import React from 'react'
import {
  CrewShareFragmentFragmentDoc,
  ScoutingFindFragmentFragmentDoc,
  SessionFragmentFragmentDoc,
  SessionUserFragmentFragmentDoc,
  useGetSessionQuery,
  useGetSessionUpdatesQuery,
  WorkOrderFragmentFragmentDoc,
} from '../schema'
import log from 'loglevel'
import { usePageVisibility } from './usePageVisibility'
import { EventNameEnum, ScoutingFind, Session, SessionUser, WorkOrder } from '@regolithco/common'
import { ApolloClient, useApolloClient } from '@apollo/client'

const POLL_TIME = 5000
const FULL_REFRESH_TIME = 120000

export const useSessionPolling = (sessionId?: string, sessionUser?: SessionUser) => {
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
      log.debug('Polling: FULL sessionUserQry.onCompleted', data)
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
      log.error('Polling: sessionUpdatedQry.onError', error)
    },
    onCompleted: (data) => {
      if (data.sessionUpdates) {
        log.debug('Polling: sessionUpdatedQry.onCompleted FOUND', data.sessionUpdates?.length, data.sessionUpdates)
        const updatedDates: number[] = []
        data.sessionUpdates.forEach((update) => {
          handleCacheUpdate(client, sessionQry?.data?.session, update)
          if (update?.eventDate) updatedDates.push(update?.eventDate)
        })
        // Set the last update to the last updated date from the download queue
        // This way we're sure not to miss anything if something happened while we were processing
        // the rest of the records. Also we subtract 1 second to make sure we don't miss anything.
        // This might cause a bit of over-querying but it's better than missing something
        if (updatedDates.length > 0) {
          const maxDate = Math.max(...updatedDates)
          if (maxDate > lastUpdated) setLastUpdated(Math.max(...updatedDates))
        } else if (data.sessionUpdates?.length === 0) {
          // Make sure this date keeps up and is never behind the lastFullQuery
          if (lastUpdated < lastFullQuery) setLastUpdated(lastFullQuery)
        }

        // Now update the apollo cache
      }
    },
  })

  // TODO: This is our sloppy poll function we need to update to lower data costs
  React.useEffect(() => {
    // If we have a real session, poll every 10 seconds
    if (isPageVisible && sessionQry?.data?.session) {
      sessionUpdatedQry.startPolling(POLL_TIME)
      sessionQry.startPolling(FULL_REFRESH_TIME)
    } else {
      sessionUpdatedQry.stopPolling()
      sessionQry.stopPolling()
    }
  }, [sessionQry?.data?.session, isPageVisible])

  return { sessionLoading: sessionUpdatedQry.loading, sessionError: sessionUpdatedQry.error }
}

const handleCacheUpdate = (client: ApolloClient<object>, session, sessionUpdate) => {
  const { eventDate, sessionId, eventName, data } = sessionUpdate
  const dataType = data?.__typename
  if (!dataType || !session) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessFrag = SessionFragmentFragmentDoc as any

  // First get the session from the cache so we can figure out if the object exists inside it yet
  const sessionObj = client.cache.readFragment<Session>({
    id: client.cache.identify({ __typename: 'Session', sessionId }),
    fragment: sessFrag,
    fragmentName: sessFrag.definitions[0].name.value,
  })
  if (!sessionObj) {
    log.error('Polling: sessionObj not found in cache. BAILING!', sessionId)
    return
  }
  const isRemove = eventName === EventNameEnum.Remove

  let fragment
  let stateName
  // If the item needs adding to the session. It might already be in the cache so this must be handled separately
  let itemNeedsAdding = false
  let incomingDataIds: (string | undefined)[]
  switch (dataType) {
    case 'Session':
      fragment = SessionFragmentFragmentDoc
      stateName = 'sessionState'
      itemNeedsAdding = false
      incomingDataIds = [client.cache.identify({ __typename: 'Session', sessionId })]
      break
    case 'SessionUser':
      fragment = SessionUserFragmentFragmentDoc
      stateName = 'sessionUserState'
      itemNeedsAdding = !sessionObj.activeMembers?.items.find((item) => item.ownerId === data.ownerId)
      incomingDataIds = [client.cache.identify({ __typename: 'SessionUser', sessionId, ownerId: data.ownerId })]
      break
    case 'CrewShare':
      fragment = CrewShareFragmentFragmentDoc
      stateName = 'crewShareState'
      incomingDataIds = [
        client.cache.identify({
          __typename: 'CrewShare',
          sessionId,
          orderId: data.orderId,
          payeeScName: data.payeeScName,
        }),
      ]
      break
    case 'SalvageFind':
    case 'ShipClusterFind':
    case 'VehicleClusterFind':
      fragment = ScoutingFindFragmentFragmentDoc
      stateName = 'scoutingState'
      itemNeedsAdding = !sessionObj.scouting?.items.find((item) => item.scoutingFindId === data.scoutingFindId)
      incomingDataIds = [
        client.cache.identify({ __typename: 'SalvageFind', sessionId, scoutingFindId: data.scoutingFindId }),
        client.cache.identify({ __typename: 'ShipClusterFind', sessionId, scoutingFindId: data.scoutingFindId }),
        client.cache.identify({ __typename: 'VehicleClusterFind', sessionId, scoutingFindId: data.scoutingFindId }),
      ]
      break
    case 'VehicleMiningOrder':
    case 'OtherOrder':
    case 'SalvageOrder':
    case 'ShipMiningOrder':
      fragment = WorkOrderFragmentFragmentDoc
      stateName = 'workOrderState'
      itemNeedsAdding = !sessionObj.workOrders?.items.find((item) => item.orderId === data.orderId)
      incomingDataIds = [
        client.cache.identify({ __typename: 'VehicleMiningOrder', sessionId, orderId: data.orderId }),
        client.cache.identify({ __typename: 'OtherOrder', sessionId, orderId: data.orderId }),
        client.cache.identify({ __typename: 'SalvageOrder', sessionId, orderId: data.orderId }),
        client.cache.identify({ __typename: 'ShipMiningOrder', sessionId, orderId: data.orderId }),
      ]
      break
    default:
      return
  }
  const fragmentName = fragment.definitions[0].name.value

  let existingItem
  let incomingDataId

  for (const cacheId of incomingDataIds) {
    if (!cacheId) continue
    incomingDataId = cacheId
    existingItem = client.cache.readFragment<Session | SessionUser | WorkOrder | ScoutingFind>({
      id: cacheId,
      fragment,
      fragmentName,
    })
    if (existingItem) break
  }

  // NOTE: This needs to be here because we do not cache SessionPolling data. All data that is
  // returned must be incorporated into the Cache manually
  if (existingItem) {
    // We don't need to update if the item is already up to date. This should
    // prevent us from committing and re-rendering changes WE already made
    if (!isRemove && existingItem.updatedAt > data.updatedAt) {
      return // Do nothing if the item is already up to date or the incoming item is behind
    }
  }

  // Removals are handled and then we drop out to prevent any more processing
  if (isRemove) {
    if (!incomingDataId) return
    log.debug('Polling: Deleting item from cache', incomingDataId)
    client.cache.evict({ id: incomingDataId })
    client.cache.gc()
    return
  }

  log.debug('Polling: Writing item to the cache', incomingDataId)
  client.cache.writeFragment({
    id: incomingDataId,
    fragment,
    fragmentName,
    data: {
      ...existingItem,
      ...data,
      state: data[stateName],
    },
  })

  // If an item is CREATED then we need to add it to the session
  // We should also check that the cached item is added to the session object
  if (itemNeedsAdding) {
    log.debug('Item not found in cache: ', incomingDataId)
    const fields = {}
    let needsUpdate = false

    // SessionUser, ScoutingFind, WorkOrder get handled here
    if (dataType !== 'CrewShare') {
      switch (dataType) {
        // Session gets handled above just by updating its own cache object
        // case 'Session':
        //   fields = Object.entries(data).reduce((acc, [key, value]) => {
        //     if (key === '__typename') return acc
        //     acc[key] = () => value
        //     return acc
        //   }, {})
        //   needsUpdate = true
        //   break
        case 'SessionUser':
          fields['activeMemberIds'] = (existingArray: Session['activeMemberIds']) => {
            if (existingArray?.includes(data.userId)) return existingArray
            log.debug('Adding userId to activeMemberIds', data)
            return [...(existingArray || []), data.userId]
          }
          fields['activeMembers'] = (existingObj) => {
            if (existingObj?.items.some((item) => item.__ref === incomingDataId)) return existingObj
            log.debug('Adding sessionUser to session', data)
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
          fields['scouting'] = (existingObj) => {
            if (existingObj?.items.find((item) => item.__ref === incomingDataId)) return existingObj
            log.debug('Adding ScoutingFind to Session', data)
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
            log.debug('Adding WorkOrder to Session', data)
            return {
              ...existingObj,
              items: [...(existingObj?.items || []), { __ref: incomingDataId }],
            }
          }
          needsUpdate = true
          break
        default:
          log.error('Polling: Unknown dataType', dataType)
          return
      }
      if (needsUpdate) {
        const sessionCacheId = client.cache.identify({ __typename: 'Session', sessionId })
        if (!sessionCacheId) {
          log.error('Polling: sessionCacheId not found')
          return
        }
        try {
          if (!sessionCacheId) {
            log.error('Polling: sessionCacheId not found')
            return
          }
          if (typeof client.cache.modify !== 'function') {
            throw new Error('Polling: client.cache.modify is not a function')
          }
          client.cache.modify({
            id: sessionCacheId,
            fields,
          })
        } catch (e) {
          log.error('Polling: Error modifying cache', e)
        }
      }
    }

    // Crewsahres have to be handled different;y because they modify the workOrder object, not the session Object
    else {
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
