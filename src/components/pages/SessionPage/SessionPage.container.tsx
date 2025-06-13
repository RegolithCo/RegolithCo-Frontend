import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SessionPage } from './SessionPage'
import { PageLoader } from '../PageLoader'
import { useSessions } from '../../../hooks/useSessions'
import {
  ActivityEnum,
  createUserSuggest,
  crewHierarchyCalc,
  CrewShareInput,
  PendingUser,
  MiningLoadout,
  ScoutingFind,
  ScoutingFindTypeEnum,
  SessionStateEnum,
  SessionUser,
  UserProfile,
  UserSuggest,
  WorkOrder,
  WorkOrderDefaults,
  SystemEnum,
} from '@regolithco/common'
import { useUserProfile } from '../../../hooks/useUserProfile'
import { makeSessionUrls } from '../../../lib/routingUrls'
import { useWorkOrders } from '../../../hooks/useWorkOrder'
import { useScoutingFind } from '../../../hooks/useScouting'
import { DialogEnum, SessionContext, SessionTabs } from '../../../context/session.context'
import { ScoutingFindContext } from '../../../context/scoutingFind.context'
import { ScoutingFindModal } from '../../modals/ScoutingFindModal'
import { WorkOrderContext } from '../../../context/workOrder.context'
import { LoadoutCalc } from '../../calculators/LoadoutCalc/LoadoutCalc'
import { WorkOrderModal } from '../../modals/WorkOrderModal'
import { workOrderStateThemes } from '../../../theme'
import { DeleteModal } from '../../modals/DeleteModal'
import { DialogContentText, ThemeProvider, Typography } from '@mui/material'
import { CollaborateModal } from '../../modals/CollaborateModal'
import { ConfirmModal } from '../../modals/ConfirmModal'
import { newEmptyScoutingFind, newWorkOrderMaker } from '../../../lib/newObjectFactories'
import { ActivePopupMe } from '../../modals/ActiveUserPopup/ActivePopupMe'
import { ActivePopupUser } from '../../modals/ActiveUserPopup/ActivePopupUser'
import { PendingUserPopup } from '../../modals/ActiveUserPopup/PendingUserPopup'
import { AddPendingUsersModal } from '../../modals/AddPendingUsersModal'
import { DisbandModal } from '../../modals/DisbandCrew'
import { ShareModal } from '../../modals/ShareModal'
import config from '../../../config'
import { SessionNotFound } from './SessionNotFound'
import { DownloadModalContainer } from '../../modals/DownloadModalWrapper'
import { useImagePaste } from '../../../hooks/useImagePaste'
import { PasteDetectedModal } from '../../modals/PasteDetectedModal'
import { ScreenshareContext } from '../../../context/screenshare.context'
import { SessionPoller } from './SessionPoller'
import useLocalStorage from '../../../hooks/useLocalStorage'
import { useBrowserTitle } from '../../../hooks/useBrowserTitle'

export const SessionPageContainer: React.FC = () => {
  const { sessionId, orderId: modalOrderId, tab, scoutingFindId: modalScoutingFindId } = useParams()
  const navigate = useNavigate()
  const userQry = useUserProfile()
  const [expandedUserDrawer, setExpandedUserDrawer] = useLocalStorage('SESSION::expandedUserDrawer', true)

  // For temporary objects before we commit them to the DB
  const [newWorkOrder, setNewWorkOrder] = React.useState<WorkOrder | null>(null)
  const [newScoutingFind, setNewScoutingFind] = React.useState<ScoutingFind | null>(null)
  const [activeModal, setActiveModal] = React.useState<DialogEnum | null>(null)
  const [activeLoadout, setActiveLoadout] = React.useState<MiningLoadout | null>(null)
  const [activeUserModalId, setActiveUserModalId] = React.useState<string | null>(null)
  const [pendingUserModalScName, setPendingUserModalScName] = React.useState<string | null>(null)
  const { stopScreenCapture, stream } = React.useContext(ScreenshareContext)

  // Clean up the stream when you leave a session page
  React.useEffect(() => {
    return () => {
      stopScreenCapture()
    }
  }, [stream])

  // We keep a pasted buffer state for the user to paste into
  const [pastedImgUrl, setPastedImgUrl] = React.useState<string | null>(null)

  const [shareWorkOrderId, setShareWorkOrderId] = React.useState<string | null>(null)
  const [shareScoutingFindId, setShareScoutingFindId] = React.useState<string | null>(null)

  const sessionQueries = useSessions(sessionId as string)
  const modalWorkOrderQry = useWorkOrders(sessionId as string, modalOrderId as string)
  const modalScoutingFindQry = useScoutingFind(
    sessionId as string,
    modalScoutingFindId as string,
    sessionQueries.sessionUser
  )
  const session = sessionQueries.session
  const myUserProfile = userQry.userProfile as UserProfile
  const mySessionUser = sessionQueries.sessionUser as SessionUser
  const isActive = session?.state === SessionStateEnum.Active
  const amISessionOwner = myUserProfile && session?.ownerId === myUserProfile.userId
  const shareUrl: string | null = session?.joinId ? `${config.shareUrl}?joinId=${session?.joinId}` : null

  const returnToSession = () => navigate(makeSessionUrls({ sessionId, tab }))
  const openWorkOrderModal = (orderId: string) => navigate(makeSessionUrls({ sessionId, orderId, tab }))
  const openScoutingModal = (scoutingFindId: string) => navigate(makeSessionUrls({ sessionId, scoutingFindId, tab }))

  const sessionUserModalSessionUser: SessionUser | undefined = session?.activeMembers?.items?.find(
    ({ owner }) => owner?.userId === activeUserModalId
  )

  const sessionUserModalPendingUser: PendingUser | undefined = session?.mentionedUsers?.find(
    ({ scName }) => scName === pendingUserModalScName
  )

  const { crewHierarchy, singleActives, captains, singleInnactives } = React.useMemo(() => {
    const crewHierarchy = crewHierarchyCalc(
      (session?.activeMembers?.items as SessionUser[]) || [],
      session?.mentionedUsers || []
    )

    const { captains, singleActives } = (session?.activeMembers?.items || []).reduce(
      (acc, su) => {
        const suUserId = su.owner?.userId as string
        const crew = crewHierarchy[suUserId as string]
        // If I'm not a captain or I don't have a captain, I'm a single active
        if (!(su.captainId && crewHierarchy[su.captainId]) && !crew) {
          acc.singleActives.push(su)
          return acc
        }
        if (crew) acc.captains.push(su)
        return acc
      },
      { singleActives: [], captains: [] } as { singleActives: SessionUser[]; captains: SessionUser[] }
    )
    const singleInnactives: PendingUser[] = (session?.mentionedUsers || []).filter(
      ({ captainId }) => !captainId || !crewHierarchy[captainId]
    )
    return { crewHierarchy, singleActives, captains, singleInnactives }
  }, [session?.activeMembers?.items, session?.mentionedUsers])

  const userSuggest: UserSuggest = React.useMemo(() => {
    if (!session || !myUserProfile || !mySessionUser) return {} as UserSuggest
    return createUserSuggest(session, myUserProfile, mySessionUser, crewHierarchy)
  }, [session, myUserProfile, mySessionUser, crewHierarchy])

  const openActiveUserModal = (userId: string | null) => {
    setPendingUserModalScName(null)
    setActiveUserModalId(userId)
    setActiveModal(DialogEnum.USER_STATUS)
  }
  const openPendingUserModal = (scName: string | null) => {
    setActiveUserModalId(null)
    setPendingUserModalScName(scName)
    setActiveModal(DialogEnum.USER_STATUS)
  }
  const openLoadoutModal = (loadout: MiningLoadout | null) => {
    setActiveLoadout(loadout)
    setActiveModal(DialogEnum.LOADOUT_MODAL)
  }

  const createNewWorkOrder = (activity: ActivityEnum) => {
    if (!session) return
    setNewWorkOrder(newWorkOrderMaker(session, myUserProfile, activity, crewHierarchy))
    setActiveModal(DialogEnum.ADD_WORKORDER)
  }

  const createNewScoutingFind = (scoutingType: ScoutingFindTypeEnum) => {
    if (!session) return
    setNewScoutingFind(newEmptyScoutingFind(session, mySessionUser, scoutingType, Boolean(myUserProfile.isSurveyor)))
    setActiveModal(DialogEnum.ADD_SCOUTING)
  }

  const setActiveTab = (tab: SessionTabs) => navigate(makeSessionUrls({ sessionId, tab }))

  const createWorkOrder = async (workOrder: WorkOrder) => {
    const newShares: CrewShareInput[] = (workOrder.crewShares || []).map(
      ({ payeeScName, payeeUserId, share, shareType, state, note }) => {
        return {
          payeeScName: payeeUserId ? undefined : payeeScName,
          payeeUserId,
          share,
          shareType,
          state: Boolean(state),
          note,
        }
      }
    )
    await createNewMentionedUsers(newShares)
    return sessionQueries.createWorkOrder(workOrder)
  }

  const updateModalWorkOrder = async (workOrder: WorkOrder) => {
    const newShares: CrewShareInput[] = (workOrder.crewShares || []).map(
      ({ payeeScName, payeeUserId, share, shareType, state, note }) => ({
        payeeScName: payeeUserId ? undefined : payeeScName,
        payeeUserId,
        share,
        shareType,
        state: Boolean(state),
        note,
      })
    )
    await createNewMentionedUsers(newShares)
    return modalWorkOrderQry.updateWorkOrder(workOrder)
  }

  // make a map of useIds to their scouting find attendance
  const scoutingAttendanceMap = React.useMemo(() => {
    const map = new Map<string, ScoutingFind>()
    session?.scouting?.items?.forEach((scoutingFind) => {
      // This will get overwritten if there are duplicates but that's ok
      scoutingFind.attendance?.forEach((attendance) => {
        map.set(attendance.owner?.userId as string, scoutingFind)
      })
    })
    return map
  }, [session?.scouting?.items])

  // TODO: Need to fold this into the API call I think OR let session users add referenced users
  const createNewMentionedUsers = async (newShares: CrewShareInput[]): Promise<void> => {
    if (newShares && newShares.length > 0) {
      // NOTE: This is a little bit of an anti-pattern. payeeScName will always be set in the UI but we can only
      // Send one of scName or UserId to the server. We need to check if the user is already in the session
      const shareNames = newShares.map((s) => s.payeeScName as string)
      const activeNames = (sessionQueries.session?.activeMembers?.items || []).map(({ owner }) => owner?.scName)
      const addToMentioned = shareNames.filter(
        (s) => s && !sessionQueries.session?.mentionedUsers?.find((u) => u.scName === s) && !activeNames.includes(s)
      )
      if (addToMentioned.length > 0) await sessionQueries.addSessionMentions(addToMentioned)
    }
  }

  const modalWorkOrder: WorkOrder | undefined = React.useMemo(() => {
    return (
      (sessionQueries.session &&
        modalOrderId &&
        sessionQueries.session.workOrders?.items?.find(
          ({ orderId: existingOrderId }) => existingOrderId === modalOrderId
        )) ||
      undefined
    )
  }, [sessionQueries.session?.workOrders?.items, modalOrderId])
  const modalScoutingFind: ScoutingFind | undefined = React.useMemo(() => {
    return (
      (sessionQueries.session &&
        modalScoutingFindId &&
        sessionQueries.session.scouting?.items?.find(
          ({ scoutingFindId: existingScoutingFindId }) => existingScoutingFindId === modalScoutingFindId
        )) ||
      undefined
    )
  }, [sessionQueries.session?.scouting?.items, modalScoutingFindId])

  // Detect paste events and handle them as long as no modals are open
  const pasteDisabled = React.useMemo(
    () =>
      !!activeModal ||
      !!modalWorkOrder ||
      !!modalScoutingFind ||
      !!newWorkOrder ||
      !!newScoutingFind ||
      session?.state === SessionStateEnum.Closed,
    [activeModal, modalWorkOrder, modalScoutingFind, newWorkOrder, newScoutingFind]
  )
  useImagePaste((image) => {
    setPastedImgUrl(image)
    setActiveModal(DialogEnum.PASTE_DETECTED)
  }, pasteDisabled)

  let browserTitle = ''
  switch (tab) {
    case SessionTabs.DASHBOARD:
      browserTitle = `Session Dashboard`
      break
    case SessionTabs.USERS:
      browserTitle = `Session Users`
      break
    case SessionTabs.WORK_ORDERS:
      browserTitle = `Session Work Orders`
      break
    case SessionTabs.SCOUTING:
      browserTitle = `Session Scouting`
      break
    case SessionTabs.SUMMARY:
      browserTitle = `Session Summary`
      break
    case SessionTabs.SETTINGS:
      browserTitle = `Session Settings`
      break
    case SessionTabs.ROLES:
      browserTitle = `Session Roles`
      break
    default:
      browserTitle = `Session`
      break
  }
  useBrowserTitle(browserTitle)

  // NO HOOKS BELOW HERE PLEASE
  if (sessionQueries.loading && !sessionQueries.session) return <PageLoader title="loading session..." loading />

  if (sessionQueries.sessionError || !sessionQueries.session) {
    return <SessionNotFound action={() => navigate('/sessions')} />
  }

  if (!mySessionUser || !myUserProfile || !session) return <PageLoader title="loading session..." loading />

  return (
    <>
      <SessionPoller sessionId={sessionId} sessionUser={sessionQueries.sessionUser} />
      <SessionContext.Provider
        value={{
          session,
          navigate: navigate,
          loading: sessionQueries.loading,
          mutating: sessionQueries.mutating,
          isSessionAdmin: amISessionOwner,
          // Tab Settings
          userTabExpanded: expandedUserDrawer,
          setUserTabExpanded: setExpandedUserDrawer,
          // User
          myUserProfile,
          // A bit redundant but we need it
          mySessionUser,
          addFriend: userQry.addFriend,
          removeFriend: userQry.removeFriend,
          userSuggest,

          crewHierarchy,
          singleActives,
          captains,
          singleInnactives,
          scoutingAttendanceMap,

          createNewWorkOrder,
          createNewScoutingFind,
          // Session stuff
          onCloseSession: sessionQueries.closeSession,
          onReOpenSession: sessionQueries.reOpenSession,
          onUpdateSession: sessionQueries.onUpdateSession,
          resetDefaultSystemSettings: sessionQueries.resetDefaultSystemSettings,
          resetDefaultUserSettings: sessionQueries.resetDefaultUserSettings,
          addSessionMentions: sessionQueries.addSessionMentions,
          removeSessionMentions: sessionQueries.removeSessionMentions,
          removeSessionCrew: sessionQueries.removeSessionCrew,
          leaveSession: sessionQueries.leaveSession,
          deleteSession: sessionQueries.deleteSession,
          // Session User Stuff
          setActiveModal,
          updateMySessionUser: sessionQueries.updateMySessionUser,
          updateSessionRole: sessionQueries.updateSessionRole,
          updateShipRole: sessionQueries.updateShipRole,
          updateSessionUserCaptain: sessionQueries.updateSessionUserCaptain,
          updatePendingUsers: sessionQueries.updatePendingUsers,

          openActiveUserModal,
          openPendingUserModal,
          openLoadoutModal,
          openScoutingModal,
          openWorkOrderModal,
          // CrewShares
          markCrewSharePaid: sessionQueries.markCrewSharePaid,
          // Work orders
          activeTab: tab as SessionTabs,
          setActiveTab,
          failWorkOrder: modalWorkOrderQry.failWorkOrder,
          createWorkOrder,
          updateModalWorkOrder,
          deleteWorkOrder: modalWorkOrderQry.deleteWorkOrder,
          setWorkOrderShareId: (shareId) => {
            setShareWorkOrderId(shareId)
            setActiveModal(DialogEnum.SHARE_SESSION)
          },
          createScoutingFind: sessionQueries.createScoutingFind,
          // Scouting finds
          updateScoutingFind: modalScoutingFindQry.updateScoutingFind,
          deleteScoutingFind: modalScoutingFindQry.deleteScoutingFind,
          joinScoutingFind: modalScoutingFindQry.joinScoutingFind,
          setScoutingFindShareId: (shareId) => {
            setShareScoutingFindId(shareId)
            setActiveModal(DialogEnum.SHARE_SESSION)
          },
          leaveScoutingFind: modalScoutingFindQry.leaveScoutingFind,
          verifiedMentionedUsers: {},
        }}
      >
        <SessionPage />

        {/* Workorder Modal: EDITING */}
        {modalWorkOrder && (
          <ThemeProvider theme={workOrderStateThemes[modalWorkOrder.state]}>
            <WorkOrderContext.Provider
              value={{
                onUpdate: (newOrder) => {
                  setActiveModal(null)
                  updateModalWorkOrder(newOrder)
                  // Make sure to clear the pasted buffer to clean up the memory for that
                  if (pastedImgUrl) setPastedImgUrl(null)
                },
                markCrewSharePaid: sessionQueries.markCrewSharePaid,
                workOrder: modalWorkOrder as WorkOrder,
                templateJob: session?.sessionSettings?.workOrderDefaults as WorkOrderDefaults,
                systemFilter: session?.sessionSettings?.systemFilter as SystemEnum,
                userSuggest,
                isMine: modalWorkOrder.ownerId === myUserProfile?.userId,
                allowPay:
                  amISessionOwner ||
                  modalWorkOrder.ownerId === myUserProfile?.userId ||
                  (Boolean(modalWorkOrder.sellerscName) && modalWorkOrder.sellerscName === myUserProfile?.scName),
                deleteWorkOrder: () => modalWorkOrderQry.deleteWorkOrder(),
                failWorkOrder: modalWorkOrderQry.failWorkOrder,
                isSessionActive: isActive,
                pastedImgUrl,
                setPastedImgUrl,
                allowEdit:
                  myUserProfile?.userId === modalWorkOrder?.ownerId ||
                  amISessionOwner ||
                  modalWorkOrder.sellerscName === myUserProfile?.scName,
              }}
            >
              <WorkOrderModal
                open={Boolean(modalWorkOrder)}
                setWorkOrderShareId={(shareId) => {
                  setShareWorkOrderId(shareId)
                  setActiveModal(DialogEnum.SHARE_SESSION)
                }}
                onClose={() => {
                  setActiveModal(null)
                  returnToSession()
                  // Make sure to clear the pasted buffer to clean up the memory for that
                  if (pastedImgUrl) setPastedImgUrl(null)
                }}
              />
            </WorkOrderContext.Provider>
          </ThemeProvider>
        )}

        {/* Workorder Modal: NEW */}
        {isActive && newWorkOrder && (
          // NEW WORK ORDER
          <WorkOrderContext.Provider
            value={{
              onUpdate: (newOrder) => {
                setActiveModal(null)
                createWorkOrder(newOrder)
                setNewWorkOrder(null)
                // Make sure to clear the pasted buffer to clean up the memory for that
                if (pastedImgUrl) setPastedImgUrl(null)
              },
              isMine: true,
              allowEdit: isActive,
              allowPay: true,
              isSessionActive: isActive,
              forceTemplate: true,
              systemFilter: session?.sessionSettings?.systemFilter as SystemEnum,
              userSuggest: userSuggest,
              isNew: true,
              markCrewSharePaid: sessionQueries.markCrewSharePaid,
              templateJob: session.sessionSettings?.workOrderDefaults as WorkOrderDefaults,
              workOrder: newWorkOrder as WorkOrder,
              pastedImgUrl,
              setPastedImgUrl,
            }}
          >
            <WorkOrderModal
              open={activeModal === DialogEnum.ADD_WORKORDER}
              onClose={() => {
                setActiveModal(null)
                if (newWorkOrder) setNewWorkOrder(null)
                // Make sure to clear the pasted buffer to clean up the memory for that
                if (pastedImgUrl) setPastedImgUrl(null)
              }}
            />
          </WorkOrderContext.Provider>
        )}

        {/* LOADOUT Modal */}
        {activeLoadout && (
          <LoadoutCalc
            isModal
            readonly
            onClose={() => setActiveModal(null)}
            open={activeModal === DialogEnum.LOADOUT_MODAL}
            miningLoadout={activeLoadout}
          />
        )}

        {/* ScoutingFind Modal: NEW */}
        {isActive && newScoutingFind && (
          <ScoutingFindContext.Provider
            value={{
              meUser: mySessionUser,
              allowEdit: isActive,
              allowDelete: true,
              scoutingFind: newScoutingFind as ScoutingFind,
              isNew: true,
              onChange: (newScouting) => {
                setActiveModal(null)
                sessionQueries.createScoutingFind(newScouting)
                setNewScoutingFind(null)
                // Make sure to clear the pasted buffer to clean up the memory for that
                if (pastedImgUrl) setPastedImgUrl(null)
              },
              pastedImgUrl,
              setPastedImgUrl,
            }}
          >
            <ScoutingFindModal
              open={activeModal === DialogEnum.ADD_SCOUTING}
              onClose={() => {
                setActiveModal(null)
                if (newScoutingFind) setNewScoutingFind(null)
                // Make sure to clear the pasted buffer to clean up the memory for that
                if (pastedImgUrl) setPastedImgUrl(null)
              }}
            />
          </ScoutingFindContext.Provider>
        )}

        {/* ScoutingFind Modal: EDITING */}
        {modalScoutingFind && (
          <ScoutingFindContext.Provider
            value={{
              meUser: mySessionUser,
              allowEdit: true, // anyone in the sessionc an edit this
              allowDelete: amISessionOwner || modalScoutingFind.ownerId === myUserProfile?.userId,
              scoutingFind: modalScoutingFind,
              joinScoutingFind: modalScoutingFindQry.joinScoutingFind,
              leaveScoutingFind: modalScoutingFindQry.leaveScoutingFind,
              onDelete: () => {
                modalScoutingFindQry.deleteScoutingFind(modalScoutingFind.scoutingFindId, modalScoutingFind.__typename)
                setActiveModal(null)
                // Make sure to clear the pasted buffer to clean up the memory for that
                if (pastedImgUrl) setPastedImgUrl(null)
              },
              onChange: (newScouting) => {
                modalScoutingFindQry.updateScoutingFind(newScouting)
                setNewScoutingFind(null)
                // Make sure to clear the pasted buffer to clean up the memory for that
                if (pastedImgUrl) setPastedImgUrl(null)
              },
              pastedImgUrl,
              setPastedImgUrl,
            }}
          >
            <ScoutingFindModal
              open={Boolean(modalScoutingFind)}
              onClose={() => {
                returnToSession()
                // Make sure to clear the pasted buffer to clean up the memory for that
                if (pastedImgUrl) setPastedImgUrl(null)
              }}
              setShareScoutingFindId={(shareId) => {
                setShareScoutingFindId(shareId)
                setActiveModal(DialogEnum.SHARE_SESSION)
              }}
            />
          </ScoutingFindContext.Provider>
        )}

        {/* Paste Detected Modal */}
        <PasteDetectedModal
          open={activeModal === DialogEnum.PASTE_DETECTED}
          onClose={() => {
            setActiveModal(null)
            // Make sure to clear the pasted buffer
            if (pastedImgUrl) setPastedImgUrl(null)
          }}
          onNewWorkOrderFromPaste={() => {
            setActiveModal(null)
            createNewWorkOrder(ActivityEnum.ShipMining)
          }}
          onNewRockClusterFromPaste={() => {
            setActiveModal(null)
            createNewScoutingFind(ScoutingFindTypeEnum.Ship)
          }}
        />

        {/* Delete Session Modal */}
        <DeleteModal
          title={'Permanently DELETE session?'}
          confirmBtnText={'Yes, Delete Session!'}
          cancelBtnText="No, keep session"
          message={
            <DialogContentText id="alert-dialog-description">
              Deleting a session will remove it permanently. Work orders and crew shares will be irrecoverably lost.
              THIS IS A PERMANENT ACTION. Are you sure you want to delete this session?
            </DialogContentText>
          }
          open={activeModal === DialogEnum.DELETE_SESSION}
          onClose={() => setActiveModal(null)}
          onConfirm={() => {
            sessionQueries.deleteSession()
            setActiveModal(null)
          }}
        />

        {/* End Session Modal */}
        <DeleteModal
          title={'Close this session?'}
          confirmBtnText={'Close session!'}
          cancelBtnText="Cancel"
          message={
            <DialogContentText id="alert-dialog-description" component={'div'}>
              <Typography component="p" gutterBottom>
                Closing a session will lock it and prevent new items or users from being added. Items can still be
                edited and deleted though and Crew shares can still be marked paid.
              </Typography>
              <Typography component="p" gutterBottom>
                You can always re-open it.
              </Typography>
            </DialogContentText>
          }
          open={activeModal === DialogEnum.CLOSE_SESSION}
          onClose={() => setActiveModal(null)}
          onConfirm={() => {
            sessionQueries.closeSession()
            setActiveModal(null)
          }}
        />

        {/* Collaborate Session Modal */}
        <CollaborateModal
          open={Boolean(shareUrl && activeModal === DialogEnum.COLLABORATE)}
          warn={!session?.sessionSettings.specifyUsers}
          url={shareUrl as string}
          onClose={() => setActiveModal(null)}
        />

        {/* Share Session Modal */}
        {activeModal === DialogEnum.SHARE_SESSION && (
          <ShareModal
            open
            initScoutingFindId={shareScoutingFindId}
            initWorkOrderId={shareWorkOrderId}
            onClose={() => {
              setShareWorkOrderId(null)
              setShareScoutingFindId(null)
              setActiveModal(null)
            }}
          />
        )}

        {/* Leave Session Modal */}
        <ConfirmModal
          title="Leave the session? Are you sure?"
          message={
            <>
              <Typography component="p" gutterBottom>
                In general <strong>DO NOT LEAVE SESSIONS</strong> unless you don't want to participate anymore.
              </Typography>
              <Typography paragraph color="error">
                If you leave this session it will be <strong>REMOVED</strong> from your session history and you will not
                see work order payment updates or be able to join again without another invite.
              </Typography>
            </>
          }
          onClose={() => setActiveModal(null)}
          open={activeModal === DialogEnum.LEAVE_SESSION}
          onConfirm={sessionQueries.leaveSession}
          cancelBtnText="No, Cancel!"
          confirmBtnText="Yes, Leave"
        />

        {/* Download Data Modal */}
        <DownloadModalContainer
          open={activeModal === DialogEnum.DOWNLOAD_SESSION}
          onClose={() => setActiveModal(null)}
        />

        <AddPendingUsersModal open={activeModal === DialogEnum.ADD_FRIEND} onClose={() => setActiveModal(null)} />
        <DisbandModal open={activeModal === DialogEnum.DISBAND_CREW} onClose={() => setActiveModal(null)} />

        {/* Active User Popup Modal: ME */}
        {sessionUserModalSessionUser && sessionUserModalSessionUser.ownerId === mySessionUser.ownerId && (
          <ActivePopupMe open={activeModal === DialogEnum.USER_STATUS} onClose={() => setActiveModal(null)} />
        )}

        {/* Active User Popup Modal: Active User */}
        {sessionUserModalSessionUser && mySessionUser.owner?.userId !== sessionUserModalSessionUser.ownerId && (
          <ActivePopupUser
            open={activeModal === DialogEnum.USER_STATUS}
            onClose={() => setActiveModal(null)}
            sessionUser={sessionUserModalSessionUser}
          />
        )}

        {/* Pending User Popup Modal */}
        {sessionUserModalPendingUser && (
          <PendingUserPopup
            open={activeModal === DialogEnum.USER_STATUS}
            onClose={() => setActiveModal(null)}
            pendingUser={sessionUserModalPendingUser}
          />
        )}
      </SessionContext.Provider>
    </>
  )
}
