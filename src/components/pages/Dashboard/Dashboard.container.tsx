import { ObjectValues, Session, UserProfile } from '@regolithco/common'
import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Dashboard } from './Dashboard'
import { useUserProfile } from '../../../hooks/useUserProfile'
import { useSessionList } from '../../../hooks/useSessionList'
import log from 'loglevel'

export const SessionDashTabsEnum = {
  sessions: 'sessions',
  workOrders: 'work_orders',
  crewShares: 'crew_shares',
  stats: 'stats',
} as const
export type SessionDashTabsEnum = ObjectValues<typeof SessionDashTabsEnum>

export const DashboardContainer: React.FC = () => {
  const navigate = useNavigate()
  const userQueries = useUserProfile()
  const useSessionListQueries = useSessionList()
  const { tab } = useParams()
  log.debug('useSessionListQueries', useSessionListQueries)
  return (
    <Dashboard
      activeTab={tab as SessionDashTabsEnum}
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
