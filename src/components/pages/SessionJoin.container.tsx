import { Session, SessionSettings, SessionStateEnum, UserProfile, UserStateEnum } from '@orgminer/common'
import * as React from 'react'
import { SessionJoin } from './SessionJoin'

export interface SessionJoinContainerProps {
  session: Session
  loading: boolean
  userProfile: UserProfile
  joinSession: () => void
}

/* eslint-disable no-unused-vars */
export enum SessionJoinError {
  UnverifiedNotAllowd = 'UnverifiedNotAllowd',
  NotOnList = 'NotOnList',
  Closed = 'Closed',
}
/* eslint-enable no-unused-vars */

export const SessionJoinContainer: React.FC<SessionJoinContainerProps> = ({
  session,
  userProfile,
  joinSession,
  loading,
}) => {
  const settings: SessionSettings = session?.sessionSettings || { __typename: 'SessionSettings' }

  const joinErrors: SessionJoinError[] = []
  // If you're not verified and the session requires it then nope
  if (!settings.allowUnverifiedUsers && userProfile.state === UserStateEnum.Unverified) {
    joinErrors.push(SessionJoinError.UnverifiedNotAllowd)
  }
  // if the session has a list and you're on it then yay!
  if (settings.specifyUsers && !session?.onTheList) {
    joinErrors.push(SessionJoinError.NotOnList)
  }
  if (session.state === SessionStateEnum.Closed) {
    joinErrors.push(SessionJoinError.Closed)
  }

  return <SessionJoin session={session} joinSession={joinSession} loading={loading} joinErrors={joinErrors} />
}
