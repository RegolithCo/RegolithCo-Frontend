import React from 'react'
import {
  CrewShareFragmentFragmentDoc,
  GetSessionUserQueryResult,
  ScoutingFindFragmentFragmentDoc,
  SessionFragmentFragmentDoc,
  SessionUserFragmentFragmentDoc,
  useGetSessionQuery,
  useGetSessionUpdatesQuery,
  WorkOrderFragmentFragmentDoc,
} from '../schema'
import log from 'loglevel'
import { usePageVisibility } from './usePageVisibility'
import { EventNameEnum, Session, SessionStateEnum } from '@regolithco/common'
import { ApolloClient, useApolloClient } from '@apollo/client'

export const useSessionPolling = (sessionId?: string, sessionUser?: GetSessionUserQueryResult['data']) => {
  const client = useApolloClient()
  const [lastUpdated, setLastUpdated] = React.useState<number>(Date.now())
  const [lastFullQuery, setLastFullQuery] = React.useState<number>(0)

  const isPageVisible = usePageVisibility()

  const sessionQry = useGetSessionQuery({
    variables: {
      sessionId: sessionId as string,
    },
    skip: !sessionId || !sessionUser,
    onCompleted: (data) => {
      log.debug('MARZIPAN: FULL sessionUserQry.onCompleted', data)
      setLastFullQuery(Date.now())
    },
  })

  // This is the lightweight query that we use to update the session
  // It should only contain: sesisoniD, timestamps for updatedAt and createdAt and the state
  const sessionUpdatedQry = useGetSessionUpdatesQuery({
    variables: {
      sessionId: sessionQry?.data?.session?.sessionId as string,
      lastCheck: lastUpdated.toFixed(0),
    },
    fetchPolicy: 'no-cache', // This has got to be fresh every time
    notifyOnNetworkStatusChange: true, // this should get the onComplete firing every time
    skip: !sessionQry?.data?.session?.sessionId || sessionQry?.loading,
    onError: (error) => {
      log.error('MARZIPAN: sessionUpdatedQry.onError', error)
    },
    onCompleted: (data) => {
      if (data.sessionUpdates) {
        log.debug('MARZIPAN: sessionUpdatedQry.onCompleted FOUND', data.sessionUpdates?.length, data.sessionUpdates)
        const updatedDates: number[] = []
        data.sessionUpdates.forEach((update) => {
          handleCacheUpdate(client, sessionQry?.data?.session, update)
          if (update?.eventDate) updatedDates.push(update?.eventDate)
        })
        // Set the last update to the last updated date from the download queue
        // This way we're sure not to miss anything if something happened while we were processing
        // the rest of the records
        if (updatedDates.length > 0) setLastUpdated(Math.max(...updatedDates))
      }
      // Now update the apollo cache
    },
  })

  // TODO: This is our sloppy poll function we need to update to lower data costs
  React.useEffect(() => {
    // If we have a real session, poll every 10 seconds
    if (isPageVisible && sessionQry?.data?.session) {
      // If it's been > 5 minutes since lastFullQuery then we need to update the full sessionQry
      if (Date.now() - lastFullQuery > 300000) sessionQry.refetch()

      const pollTime = sessionQry?.data?.session.state !== SessionStateEnum.Active ? 60000 : 10000 // now that our sessionUpdatedQry is lightweight we can poll every 5 seconds
      sessionUpdatedQry.startPolling(pollTime)
    } else {
      sessionUpdatedQry.stopPolling()
    }
  }, [sessionQry?.data?.session, isPageVisible])
}

const handleCacheUpdate = (client: ApolloClient<object>, session, sessionUpdate) => {
  const { eventDate, sessionId, eventName, data } = sessionUpdate
  const dataType = data?.__typename
  if (!dataType || !session) return

  let fragment
  let stateName
  const __typename = dataType
  switch (dataType) {
    case 'Session':
      fragment = SessionFragmentFragmentDoc
      stateName = 'sessionState'
      break
    case 'SessionUser':
      fragment = SessionUserFragmentFragmentDoc
      stateName = 'sessionUserState'
      break
    case 'CrewShare':
      fragment = CrewShareFragmentFragmentDoc
      stateName = 'crewShareState'
      break
    case 'SalvageFind':
    case 'ShipClusterFind':
    case 'VehicleClusterFind':
      fragment = ScoutingFindFragmentFragmentDoc
      stateName = 'scoutingState'
      break
    case 'VehicleMiningOrder':
    case 'OtherOrder':
    case 'SalvageOrder':
    case 'ShipMiningOrder':
      fragment = WorkOrderFragmentFragmentDoc
      stateName = 'workOrderState'
      break
    default:
      return
  }
  const fragmentName = fragment.definitions[0].name.value
  const incomingDataId = client.cache.identify({ ...data, __typename })

  log.debug('MARZIPAN: incomingDataId', incomingDataId)
  const existingItem = client.cache.readFragment({
    id: incomingDataId,
    fragment,
    fragmentName,
  }) as Session
  log.debug('MARZIPAN: existingItem', incomingDataId)

  if (existingItem) {
    // We don't need to update if the item is already up to date. This should
    // prevent us from committing and re-rendering changes WE already made
    if (existingItem.updatedAt >= data.updatedAt) {
      return
    }
    log.debug('MARZIPAN: Updating item in cache', eventName)
    if (eventName === EventNameEnum.Remove) {
      log.debug('MARZIPAN: Deleting item from cache')
      client.cache.evict({ id: incomingDataId, fieldName: '__typename' })
    } else {
      client.cache.writeFragment({
        id: incomingDataId,
        fragment,
        fragmentName,
        data: {
          ...existingItem,
          ...data,
          state: data[stateName] || existingItem.state,
        },
      })
    }
  }
  // If an item is CREATED then we need to add it to the session
  // We should also check that the cached item is added to the session object
  if (eventName !== EventNameEnum.Remove) {
    console.debug('Item not found in cache')
    let fields = {}
    let needsUpdate = false
    if (dataType !== 'CrewShare') {
      switch (dataType) {
        case 'Session':
          fields = Object.entries(data).reduce((acc, [key, value]) => {
            if (key === '__typename') return acc
            acc[key] = value
            return acc
          }, {})
          needsUpdate = true
          break
        case 'SessionUser':
          fields['activeMemberIds'] = (existingArray: Session['activeMemberIds']) => {
            if (existingArray?.includes(data.userId)) return existingArray
            console.debug('Adding userId to activeMemberIds', data)
            return [...(existingArray || []), data.userId]
          }
          fields['activeMembers'] = (existingObj) => {
            if (existingObj?.items.some((item) => item.__ref === incomingDataId)) return existingObj
            console.debug('Adding sessionUser to session', data)
            return {
              ...existingObj,
              items: [...(existingObj?.items || []), { __ref: incomingDataId }],
            }
          }
          needsUpdate = true
          break
        case 'SalvageFind':
        case 'ShipClusterFind':
        case 'VehicleClusterFind':
          fields['scoutingFinds'] = (existingObj) => {
            if (existingObj?.items.some((item) => item.__ref === incomingDataId)) return existingObj
            console.debug('Adding ScoutingFind to Session', data)
            return {
              ...existingObj,
              items: [...(existingObj?.items || []), { __ref: incomingDataId }],
            }
          }
          needsUpdate = true
          break
        case 'VehicleMiningOrder':
        case 'OtherOrder':
        case 'SalvageOrder':
        case 'ShipMiningOrder':
          fields['workOrders'] = (existingObj) => {
            if (existingObj?.items.some((item) => item.__ref === incomingDataId)) return existingObj
            console.debug('Adding WorkOrder to Session', data)
            return {
              ...existingObj,
              items: [...(existingObj?.items || []), { __ref: incomingDataId }],
            }
          }
          needsUpdate = true
          break
        default:
          return
      }
      if (needsUpdate) {
        const sessionCacheId = client.cache.identify({ __typename: 'Session', sessionId })
        if (!sessionCacheId) {
          log.error('MARZIPAN: sessionCacheId not found')
          return
        }
        client.cache.modify({
          id: sessionCacheId,
          fields,
        })
      }
    }
    // Crewsahres have to be handled different;y because they modify the workOrder object, not the session Object
    else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sessFrag = SessionFragmentFragmentDoc as any
      // First get the session
      const sessionObj = client.cache.readFragment({
        id: client.cache.identify({ __typename: 'Session', sessionId }),
        fragment: sessFrag,
        fragmentName: sessFrag.definitions[0].name.value,
      }) as Session
      if (!sessionObj) return
      // NOTE: This is a little string-matchy and therefore kind of fragile.

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const foundCachedOrder: any = sessionObj['workOrders']?.items.find((order) => order.orderId === data.orderId)
      if (!foundCachedOrder) return

      // We have the exact apolloId. Load the object from foundOrder.__ref
      if (foundCachedOrder.crewShares?.some((item) => item.payeeScName === data.payeeScName)) return
      console.debug('Adding CrewShare to Session', data)
      // Add the crewShare to the workOrder
      client.cache.modify({
        id: foundCachedOrder.__ref,
        fields: {
          crewShares: (existingObj) => {
            return {
              ...existingObj,
              items: [...(existingObj?.items || []), data],
            }
          },
        },
      })
    }
  }
}
