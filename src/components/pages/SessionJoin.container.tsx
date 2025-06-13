import { AuthTypeEnum, ErrorCode, SessionStateEnum, UserStateEnum } from '@regolithco/common'
import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useJoinSession } from '../../hooks/useJoinSession'
import { PageLoader } from './PageLoader'
import { SessionJoin } from './SessionJoin'
import { SessionNotFound } from './SessionPage/SessionNotFound'
import { LoginContext, UserProfileContext } from '../../context/auth.context'
import { useBrowserTitle } from '../../hooks/useBrowserTitle'

export interface SessionJoinContainerProps {
  // joinId: string
  a?: string
}

type ObjectValues<T> = T[keyof T]
export const SessionJoinError = {
  UnverifiedNotAllowd: 'UnverifiedNotAllowd',
  NotOnList: 'NotOnList',
  Closed: 'Closed',
  NeedDiscord: 'NeedDiscord',
  NotInDiscordServer: 'NotInDiscordServer',
  NotPermittedInDiscordServer: 'NotPermittedInDiscordServer',
} as const
export type SessionJoinError = ObjectValues<typeof SessionJoinError>

export const SessionJoinContainer: React.FC<SessionJoinContainerProps> = () => {
  const { joinId } = useParams()
  const { authType } = React.useContext(LoginContext)
  const { myProfile } = React.useContext(UserProfileContext)
  const navigate = useNavigate()
  const joinErrors: SessionJoinError[] = []
  let showGuilds = false
  useBrowserTitle('Join Session')

  const { joinSession, loading, mutating, sessionError, sessionShare } = useJoinSession(joinId)
  // If you're not verified and the session requires it then nope
  if (
    sessionError === ErrorCode.SESSIONJOIN_NOT_VERIFIED ||
    (!sessionShare?.allowUnverifiedUsers && myProfile?.state === UserStateEnum.Unverified)
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
  if (sessionShare?.lockToDiscordGuild) {
    const myGuild = myProfile?.discordGuilds.find((guild) => guild.id === sessionShare?.lockToDiscordGuild?.id)

    if (authType !== AuthTypeEnum.Discord) {
      joinErrors.push(SessionJoinError.NeedDiscord)
    } else if (!myGuild) {
      joinErrors.push(SessionJoinError.NotInDiscordServer)
      showGuilds = true
    } else if (!myGuild.hasPermission) {
      joinErrors.push(SessionJoinError.NotPermittedInDiscordServer)
      showGuilds = true
    }
  }
  if (loading)
    // NO HOOKS BELOW HERE PLEASE
    return <PageLoader title="loading invitation..." loading />

  if (sessionError || !sessionShare) {
    return <SessionNotFound action={() => navigate('/sessions')} />
  }

  return (
    <SessionJoin
      sessionShare={sessionShare}
      showGuilds={showGuilds}
      profile={myProfile}
      joinSession={joinSession}
      navigate={navigate}
      loading={loading || mutating}
      joinErrors={joinErrors}
    />
  )
}
