import { calculateWorkOrder, ObjectValues, Session, UserProfile, WorkOrder, WorkOrderSummary } from '@regolithco/common'
import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Dashboard } from './Dashboard'
import { useUserProfile } from '../../../hooks/useUserProfile'
import { useSessionList } from '../../../hooks/useSessionList'
import { LookupsContext } from '../../../context/lookupsContext'

import log from 'loglevel'
import { DatePresetsEnum } from './TabStats/StatsDatePicker'

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

  log.debug('DashboardContainer', { workOrderSummaries })

  return (
    <Dashboard
      activeTab={tab as SessionDashTabsEnum}
      preset={preset as DatePresetsEnum}
      workOrderSummaries={workOrderSummaries}
      paginationDate={useSessionListQueries.paginationDate}
      setPaginationDate={useSessionListQueries.setPaginationDate}
      userProfile={userQueries.userProfile as UserProfile}
      joinedSessions={(useSessionListQueries.joinedSessions?.items || []) as Session[]}
      mySessions={(useSessionListQueries.mySessions?.items || []) as Session[]}
      fetchMoreSessions={useSessionListQueries.fetchMoreSessions}
      loading={userQueries.loading || useSessionListQueries.loading || userQueries.mutating}
      allLoaded={useSessionListQueries.allLoaded}
      navigate={navigate}
      onCreateNewSession={useSessionListQueries.createSession}
    />
  )
}
