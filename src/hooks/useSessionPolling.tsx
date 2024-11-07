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
import { EventNameEnum, Session, SessionStateEnum, WorkOrder } from '@regolithco/common'
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
  let __typename
  switch (dataType) {
    case 'Session':
      fragment = SessionFragmentFragmentDoc
      stateName = 'sessionState'
      __typename = 'Session'
      break
    case 'SessionUser':
      fragment = SessionUserFragmentFragmentDoc
      stateName = 'sessionUserState'
      __typename = 'SessionUser'
      break
    case 'CrewShare':
      fragment = CrewShareFragmentFragmentDoc
      stateName = 'crewShareState'
      __typename = 'CrewShare'
      break
    case 'SalvageFind':
    case 'ShipClusterFind':
    case 'VehicleClusterFind':
      fragment = ScoutingFindFragmentFragmentDoc
      stateName = 'scoutingState'
      __typename = 'ScoutingFindInterface'
      break
    case 'VehicleMiningOrder':
    case 'OtherOrder':
    case 'SalvageOrder':
    case 'ShipMiningOrder':
      fragment = WorkOrderFragmentFragmentDoc
      stateName = 'workOrderState'
      __typename = 'WorkOrderInterface'
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
    if (existingItem.updatedAt >= data.updatedAt) {
      // log.debug('MARZIPAN: Item is up to date')
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
  else if (eventName !== EventNameEnum.Remove) {
    log.debug('MARZIPAN: Item not found in cache')
    const existingSession = client.cache.readFragment({
      id: sessionId,
      fragment: SessionFragmentFragmentDoc,
      fragmentName: 'SessionFragment',
    }) as Session
    if (!existingSession) {
      log.debug('MARZIPAN: Session not found in cache')
      return
    }
    log.debug('MARZIPAN: Adding find to session')
    let fields = {}
    switch (dataType) {
      case 'Session':
        fields = Object.entries(data).reduce((acc, [key, value]) => {
          if (key === '__typename') return acc
          acc[key] = value
          return acc
        }, {})
        break
      case 'SessionUser':
        fields['activeMemberIds'] = (existingArray: Session['activeMemberIds']) => [
          ...(existingArray || []),
          data.userId,
        ]
        fields['activeMembers'] = (existingObj: Session['activeMembers']) => ({
          ...existingObj,
          items: [...(existingObj?.items || []), data],
        })
        break
      case 'CrewShare':
        fields['workOrders'] = (existingArray: WorkOrder[] = []) => {
          return existingArray.map((order) => {
            if (order.orderId === data.orderId) {
              return {
                ...order,
                crewShares: [...(order.crewShares || []), data],
              }
            } else return order
          })
        }
        break
      case 'SalvageFind':
      case 'ShipClusterFind':
      case 'VehicleClusterFind':
        fields['scoutingFinds'] = (existingArray = []) => [...existingArray, data]
        break
      case 'VehicleMiningOrder':
      case 'OtherOrder':
      case 'SalvageOrder':
      case 'ShipMiningOrder':
        fields['workOrders'] = (existingArray = []) => [...existingArray, data]
        break
      default:
        return
    }
    client.cache.modify({
      id: incomingDataId,
      fields: {
        activeUserids: (existingArray = []) => {
          return existingArray
        },
        activeusers: (existingArray = []) => {
          return existingArray
        },
        workOrders: (existingArray = []) => {
          return existingArray
        },
        scoutingFinds: (existingArray = []) => {
          return [...existingArray, data]
        },
      },
    })
  }
}
