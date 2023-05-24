import { ErrorCode, Session, SessionSettings, SessionStateEnum, UserProfile, UserStateEnum } from '@regolithco/common'
import * as React from 'react'
import { SessionJoin } from './SessionJoin'

export interface SessionJoinContainerProps {
  session?: Session
  sessionError?: ErrorCode
  loading: boolean
  userProfile: UserProfile
  joinSession: () => void
}

type ObjectValues<T> = T[keyof T]
export const SessionJoinError = {
  UnverifiedNotAllowd: 'UnverifiedNotAllowd',
  NotOnList: 'NotOnList',
  Closed: 'Closed',
} as const
export type SessionJoinError = ObjectValues<typeof SessionJoinError>

export const SessionJoinContainer: React.FC<SessionJoinContainerProps> = ({
  session,
  sessionError,
  userProfile,
  joinSession,
  loading,
}) => {
  const settings: SessionSettings = session?.sessionSettings || { __typename: 'SessionSettings' }

  const joinErrors: SessionJoinError[] = []
  // If you're not verified and the session requires it then nope
  if (
    sessionError === ErrorCode.SESSIONJOIN_NOT_VERIFIED ||
    (!settings.allowUnverifiedUsers && userProfile.state === UserStateEnum.Unverified)
  ) {
    joinErrors.push(SessionJoinError.UnverifiedNotAllowd)
  }
  // if the session has a list and you're on it then yay!
  if (sessionError === ErrorCode.SESSIONJOIN_NOT_ON_LIST || (settings.specifyUsers && !session?.onTheList)) {
    joinErrors.push(SessionJoinError.NotOnList)
  }
  if (session && session.state === SessionStateEnum.Closed) {
    joinErrors.push(SessionJoinError.Closed)
  }

  return <SessionJoin session={session} joinSession={joinSession} loading={loading} joinErrors={joinErrors} />
}
