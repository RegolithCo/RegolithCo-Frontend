import {
  calculateWorkOrder,
  CrewShare,
  MarkCrewSharePaidMutation,
  ObjectValues,
  Session,
  UpdateWorkOrderMutation,
  UserProfile,
  WorkOrder,
  WorkOrderStateEnum,
  WorkOrderSummary,
} from '@regolithco/common'
import * as React from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Dashboard } from './Dashboard'
import { useUserProfile } from '../../../hooks/useUserProfile'
import { useSessionList } from '../../../hooks/useSessionList'
import { LookupsContext } from '../../../context/lookupsContext'

import log from 'loglevel'
import { DatePresetsEnum } from './TabStats/StatsDatePicker'
import { useMarkCrewSharePaidMutation, useUpdateWorkOrderMutation } from '../../../schema'
import dayjs from 'dayjs'

export const SessionDashTabsEnum = {
  sessions: 'sessions',
  workOrders: 'work_orders',
  crewShares: 'crew_shares',
  stats: 'stats',
} as const
export type SessionDashTabsEnum = ObjectValues<typeof SessionDashTabsEnum>

export type WorkOrderSummaryLookup = Record<string, Record<string, WorkOrderSummary>>

export const DashboardContainer: React.FC = () => {
  const navigate = useNavigate()
  const userQueries = useUserProfile()
  const useSessionListQueries = useSessionList()
  const dataStore = React.useContext(LookupsContext)
  const [workOrderSummaries, setWorkOrderSummaries] = React.useState<WorkOrderSummaryLookup>({})
  const { tab, preset } = useParams()
  // Get query params from url
  const { search } = useLocation()

  // Parse query parameters
  const queryParams = new URLSearchParams(search)
  const parsedFrom = queryParams.get('from')
  const parsedTo = queryParams.get('to')

  const defaultDates = localStorage.getItem('dashboard_stats_range')
  const defaultFrom = defaultDates?.split('::')[0] || null
  const defaultTo = defaultDates?.split('::')[1] || null

  const finalPreset = preset || DatePresetsEnum.THISMONTH
  React.useEffect(() => {
    if (tab !== SessionDashTabsEnum.stats) return
    console.log('finalPreset set', { finalPreset, parsedFrom, parsedTo })
    localStorage.setItem('dashboard_stats_preset', finalPreset)
    if (finalPreset === DatePresetsEnum.CUSTOM && parsedFrom && parsedTo) {
      const dateStr = `${parsedFrom || ''}::${parsedTo || ''}`
      localStorage.setItem('dashboard_stats_range', dateStr)
    }
  }, [finalPreset, parsedFrom, parsedTo])
  console.log('finalPreset PASS', { preset, finalPreset, parsedFrom, parsedTo, defaultDates })

  const updateWorkOrderMutation = useUpdateWorkOrderMutation()
  const deliverWorkOrders = (orders: WorkOrder[]) => {
    return Promise.all(
      orders.map(({ orderId, sessionId, ...rest }) => {
        return updateWorkOrderMutation[0]({
          variables: {
            orderId,
            sessionId,
            workOrder: {
              isSold: true,
            },
          },
          optimisticResponse: () => {
            // Get it from cache
            const optimisticresponse: UpdateWorkOrderMutation = {
              __typename: 'Mutation',
              updateWorkOrder: {
                ...rest,
                orderId,
                sessionId,
                state: WorkOrderStateEnum.Done,
              },
            }
            return optimisticresponse
          },
        })
          .then((res) => {
            // log.info('Delivered work order', res)
          })
          .catch((e) => {
            // log.error('Failed to deliver work order', e)
          })
      })
    ).then(() => {
      // log.debug('Delivered all work orders')
    })
  }

  const markCrewSharePaidMutation = useMarkCrewSharePaidMutation()
  const markCrewSharesPaid = (shares: CrewShare[]) => {
    return Promise.all(
      shares.map((share) => {
        const { orderId, sessionId, payeeScName } = share
        return markCrewSharePaidMutation[0]({
          variables: {
            isPaid: true,
            sessionId,
            orderId,
            payeeScName,
          },
          optimisticResponse: () => {
            return {
              __typename: 'Mutation',
              markCrewSharePaid: {
                ...share,
                isPaid: true,
              },
            } as MarkCrewSharePaidMutation
          },
        })
          .then((res) => {
            // log.info('Marked crew share paid', res)
          })
          .catch((e) => {
            // log.error('Failed to mark crew share paid', e)
          })
      })
    ).then(() => {
      // log.debug('Marked all crew shares paid')
    })
  }

  // Call calculateWorkOrder for each session and all of its work orders and store the results in state
  React.useEffect(() => {
    if (!userQueries.userProfile || !useSessionListQueries.joinedSessions || !useSessionListQueries.mySessions) return
    const sessions = [...useSessionListQueries.joinedSessions.items, ...useSessionListQueries.mySessions.items]
    const workOrders = sessions.reduce((acc, session) => {
      return acc.concat(session.workOrders?.items || [])
    }, [] as WorkOrder[])

    const calcWorkOrders = async () => {
      const summaries: Record<string, Record<string, WorkOrderSummary>> = {}
      for (const workOrder of workOrders) {
        summaries[workOrder.sessionId] = summaries[workOrder.sessionId] || {}
        summaries[workOrder.sessionId][workOrder.orderId] = await calculateWorkOrder(dataStore, workOrder)
      }
      setWorkOrderSummaries(summaries)
    }
    calcWorkOrders()
  }, [dataStore, userQueries.userProfile, useSessionListQueries.joinedSessions, useSessionListQueries.mySessions])

  return (
    <Dashboard
      activeTab={tab as SessionDashTabsEnum}
      defaultStatsPreset={{
        preset: finalPreset as DatePresetsEnum,
        from: defaultFrom ? dayjs(defaultFrom) : null,
        to: defaultTo ? dayjs(defaultTo) : null,
      }}
      workOrderSummaries={workOrderSummaries}
      deliverWorkOrders={deliverWorkOrders}
      markCrewSharesPaid={markCrewSharesPaid}
      paginationDate={useSessionListQueries.paginationDate}
      setPaginationDate={useSessionListQueries.setPaginationDate}
      userProfile={userQueries.userProfile as UserProfile}
      joinedSessions={(useSessionListQueries.joinedSessions?.items || []) as Session[]}
      mySessions={(useSessionListQueries.mySessions?.items || []) as Session[]}
      fetchMoreSessions={useSessionListQueries.fetchMoreSessions}
      loading={
        userQueries.loading ||
        useSessionListQueries.loading ||
        userQueries.mutating ||
        updateWorkOrderMutation[1].loading ||
        markCrewSharePaidMutation[1].loading
      }
      allLoaded={useSessionListQueries.allLoaded}
      navigate={navigate}
      onCreateNewSession={useSessionListQueries.createSession}
    />
  )
}
