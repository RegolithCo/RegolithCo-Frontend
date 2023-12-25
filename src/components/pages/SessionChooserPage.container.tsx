import { Session, UserProfile } from '@regolithco/common'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { SessionChooserPage } from './SessionChooserPage'
import { useUserProfile } from '../../hooks/useUserProfile'
import { useSessionList } from '../../hooks/useSessionList'

export const SessionChooserPageContainer: React.FC = () => {
  const navigate = useNavigate()
  const userQueries = useUserProfile()
  const useSessionListQueries = useSessionList()

  return (
    <SessionChooserPage
      userProfile={userQueries.userProfile as UserProfile}
      joinedSessions={(useSessionListQueries.joinedSessions?.items || []) as Session[]}
      mySessions={(useSessionListQueries.mySessions?.items || []) as Session[]}
      loading={userQueries.loading || useSessionListQueries.loading || userQueries.mutating}
      navigate={navigate}
      onCreateNewSession={useSessionListQueries.createSession}
    />
  )
}
