import { Session, UserProfile } from '@regolithco/common'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { SessionChooserPage } from './SessionChooserPage'
import { useUserProfile } from '../../hooks/useUserProfile'

export const SessionChooserPageContainer: React.FC = () => {
  const navigate = useNavigate()
  const userQueries = useUserProfile()

  return (
    <SessionChooserPage
      userProfile={userQueries.userProfile as UserProfile}
      joinedSessions={(userQueries.joinedSessions?.items || []) as Session[]}
      mySessions={(userQueries.mySessions?.items || []) as Session[]}
      loading={userQueries.loading || userQueries.mutating}
      navigate={navigate}
      onCreateNewSession={userQueries.createSession}
    />
  )
}
