import { ErrorCode, SessionStateEnum, UserStateEnum } from '@regolithco/common'
import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useJoinSession } from '../../hooks/useJoinSession'
import { useLogin } from '../../hooks/useOAuth2'
import { SessionJoin } from './SessionJoin'

export interface SessionJoinContainerProps {
  // joinId: string
  a?: string
}

type ObjectValues<T> = T[keyof T]
export const SessionJoinError = {
  UnverifiedNotAllowd: 'UnverifiedNotAllowd',
  NotOnList: 'NotOnList',
  Closed: 'Closed',
} as const
export type SessionJoinError = ObjectValues<typeof SessionJoinError>

export const SessionJoinContainer: React.FC<SessionJoinContainerProps> = () => {
  const { joinId } = useParams()
  const { userProfile } = useLogin()
  const navigate = useNavigate()
  const joinErrors: SessionJoinError[] = []

  const { joinSession, loading, mutating, sessionError, sessionShare } = useJoinSession(joinId)
  // If you're not verified and the session requires it then nope
  if (
    sessionError === ErrorCode.SESSIONJOIN_NOT_VERIFIED ||
    (!sessionShare?.allowUnverifiedUsers && userProfile?.state === UserStateEnum.Unverified)
  ) {
    joinErrors.push(SessionJoinError.UnverifiedNotAllowd)
  }
  // if the session has a list and you're on it then yay!
  if (sessionError === ErrorCode.SESSIONJOIN_NOT_ON_LIST || (sessionShare?.specifyUsers && !sessionShare?.onTheList)) {
    joinErrors.push(SessionJoinError.NotOnList)
  }
  if (sessionShare?.state === SessionStateEnum.Closed) {
    joinErrors.push(SessionJoinError.Closed)
  }

  return (
    <SessionJoin
      sessionShare={sessionShare}
      joinSession={joinSession}
      navigate={navigate}
      loading={loading || mutating}
      joinErrors={joinErrors}
    />
  )
}
