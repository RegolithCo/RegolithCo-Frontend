import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SessionPage } from './SessionPage'
import { PageLoader } from '../PageLoader'
import { useSessions } from '../../../hooks/useSessions'
import { CrewShareInput, Session, SessionUser, UserProfile, WorkOrder } from '@regolithco/common'
import { SessionJoinContainer } from '../SessionJoin.container'
import { useUserProfile } from '../../../hooks/useUserProfile'
import { makeSessionUrls } from '../../../lib/routingUrls'
import { useWorkOrders } from '../../../hooks/useWorkOrder'
import { useScoutingFind } from '../../../hooks/useScouting'

type ObjectValues<T> = T[keyof T]
export const DialogEnum = {
  SHARE_SESSION: 'SHARE_SESSION',
  ADD_WORKORDER: 'ADD_WORKORDER',
  LEAVE_SESSION: 'LEAVE_SESSION',
  DELETE_SESSION: 'DELETE_SESSION',
  CLOSE_SESSION: 'CLOSE_SESSION',
  DOWNLOAD_SESSION: 'DOWNLOAD_SESSION',
  ADD_SCOUTING: 'ADD_SCOUTING',
  SESSION_PREFERENCES: 'SESSION_PREFERENCES',
  ADD_FRIEND: 'ADD_FRIEND',
} as const
export type DialogEnum = ObjectValues<typeof DialogEnum>

export const SessionTabs = {
  USERS: 'users',
  DASHBOARD: 'dash',
  WORK_ORDERS: 'work',
  SCOUTING: 'scout',
  SUMMARY: 'summary',
  SETTINGS: 'settings',
} as const
export type SessionTabs = ObjectValues<typeof SessionTabs>

export const SessionPageContainer2: React.FC = () => {
  const { sessionId, orderId, tab, scoutingFindId } = useParams()
  const userQry = useUserProfile()

  const sessionQueries = useSessions(sessionId as string)
  const workOrderQry = useWorkOrders(sessionId as string, orderId as string)
  const scoutingFindQry = useScoutingFind(sessionId as string, scoutingFindId as string, sessionQueries.sessionUser)

  const navigate = useNavigate()

  // TODO: Need to fold this into the API call I think OR let session users add referenced users
  const createNewMentionedUsers = async (newShares: CrewShareInput[]): Promise<void> => {
    if (newShares && newShares.length > 0) {
      const shareNames = newShares.map((s) => s.scName)
      const activeNames = (sessionQueries.session?.activeMembers?.items || []).map(({ owner }) => owner?.scName)
      const addToMentioned = shareNames.filter(
        (s) => !sessionQueries.session?.mentionedUsers?.includes(s) && !activeNames.includes(s)
      )
      if (addToMentioned.length > 0) await sessionQueries.addSessionMentions(addToMentioned)
    }
  }

  if (sessionQueries.loading && !sessionQueries.session && !sessionQueries.sessionStub)
    return <PageLoader title="loading session..." loading />

  if (sessionQueries.sessionStub || sessionQueries.sessionError)
    return (
      <SessionJoinContainer
        session={sessionQueries.sessionStub}
        sessionError={sessionQueries.sessionError}
        userProfile={userQry.userProfile as UserProfile}
        joinSession={sessionQueries.joinSession}
        loading={sessionQueries.loading || sessionQueries.mutating}
      />
    )
  return (
    <SessionPage
      session={sessionQueries.session as Session}
      navigate={navigate}
      loading={sessionQueries.loading}
      mutating={sessionQueries.mutating}
      // User
      userProfile={userQry.userProfile as UserProfile}
      // A bit redundant but we need it
      sessionUser={sessionQueries.sessionUser as SessionUser}
      addFriend={userQry.addFriend}
      // Session stuff
      onCloseSession={sessionQueries.closeSession}
      onUpdateSession={sessionQueries.onUpdateSession}
      resetDefaultSystemSettings={sessionQueries.resetDefaultSystemSettings}
      resetDefaultUserSettings={sessionQueries.resetDefaultUserSettings}
      addSessionMentions={sessionQueries.addSessionMentions}
      removeSessionMentions={sessionQueries.removeSessionMentions}
      removeSessionCrew={sessionQueries.removeSessionCrew}
      leaveSession={sessionQueries.leaveSession}
      deleteSession={sessionQueries.deleteSession}
      // CrewShares
      markCrewSharePaid={sessionQueries.markCrewSharePaid}
      // Work orders
      orderId={orderId}
      activeTab={tab as SessionTabs}
      setActiveTab={(tab: SessionTabs) => {
        navigate(makeSessionUrls({ sessionId, tab }))
      }}
      failWorkOrder={workOrderQry.failWorkOrder}
      createWorkOrder={async (workOrder: WorkOrder) => {
        const newShares: CrewShareInput[] = (workOrder.crewShares || []).map(
          ({ scName, share, shareType, state, note }) => ({
            scName,
            share,
            shareType,
            state: Boolean(state),
            note,
          })
        )
        await createNewMentionedUsers(newShares)
        return sessionQueries.createWorkOrder(workOrder)
      }}
      updateWorkOrder={async (workOrder: WorkOrder) => {
        const newShares: CrewShareInput[] = (workOrder.crewShares || []).map(
          ({ scName, share, shareType, state, note }) => ({
            scName,
            share,
            shareType,
            state: Boolean(state),
            note,
          })
        )
        await createNewMentionedUsers(newShares)
        return workOrderQry.updateWorkOrder(workOrder)
      }}
      deleteWorkOrder={workOrderQry.deleteWorkOrder}
      openWorkOrderModal={(orderId) => {
        navigate(makeSessionUrls({ sessionId, orderId, tab }))
      }}
      createScoutingFind={sessionQueries.createScoutingFind}
      openScoutingModal={(scoutingFindId) => {
        navigate(makeSessionUrls({ sessionId, scoutingFindId, tab }))
      }}
      // Scouting finds
      scoutingFindId={scoutingFindId}
      updateScoutingFind={scoutingFindQry.updateScoutingFind}
      deleteScoutingFind={scoutingFindQry.deleteScoutingFind}
      joinScoutingFind={scoutingFindQry.joinScoutingFind}
      leaveScoutingFind={scoutingFindQry.leaveScoutingFind}
      verifiedMentionedUsers={{}}
    />
  )
}
