import * as React from 'react'
import { Typography, useTheme } from '@mui/material'
import { Delete, DeleteForever, GroupAdd, GroupRemove, Person, RocketLaunch } from '@mui/icons-material'
import { DialogEnum, SessionContext } from '../../../context/session.context'
import { PendingUser, MiningLoadout, SessionUser, User } from '@regolithco/common'
import { ModuleIcon } from '../../../icons'
import { DeleteModal } from '../../modals/DeleteModal'
import { MenuItemObj, useSessionContextMenu } from '../../modals/SessionContextMenu'
import { UserAvatar } from '../../UserAvatar'
import { AppContext } from '../../../context/app.context'

export const useSessionUserContextMenu = (sessionUser?: SessionUser, pendingUser?: PendingUser) => {
  const theme = useTheme()
  const {
    myUserProfile,
    addFriend,
    crewHierarchy,
    mySessionUser,
    captains,
    session,
    // leaveSession,
    setActiveModal,
    removeFriend,
    removeSessionMentions,
    removeSessionCrew,
    openActiveUserModal,
    openPendingUserModal,
    updateSessionUserCaptain,
    updatePendingUserCaptain,
    openLoadoutModal,
  } = React.useContext(SessionContext)
  const { hideNames, getSafeName } = React.useContext(AppContext)

  const [deletePendingUserOpen, setDeletePendingUserOpen] = React.useState(false)
  const [deleteActiveUserOpen, setDeleteActiveUserOpen] = React.useState(false)
  const isMe = sessionUser?.ownerId === myUserProfile.userId
  const isActiveUser = !!sessionUser
  const theirSCName = (sessionUser?.owner?.scName || pendingUser?.scName) as string

  const iOwnSession = session?.ownerId === myUserProfile.userId

  const meIsPotentialCaptain = !mySessionUser?.captainId || !crewHierarchy[mySessionUser?.captainId]
  const theyIsPotentialCaptain = !sessionUser?.captainId || !crewHierarchy[sessionUser?.captainId]
  const meIsCaptain = meIsPotentialCaptain && crewHierarchy[mySessionUser?.ownerId]
  const iAmOnCrew = !!mySessionUser?.captainId && crewHierarchy[mySessionUser?.captainId]
  const myCrewCaptainId =
    mySessionUser?.captainId && crewHierarchy[mySessionUser?.captainId] ? mySessionUser?.captainId : undefined
  const myCaptainScName = myCrewCaptainId
    ? captains.find((c) => c.ownerId === myCrewCaptainId)?.owner?.scName
    : undefined

  const isMyFriend = myUserProfile?.friends?.includes(theirSCName as string)
  const theirCaptainId =
    (sessionUser?.captainId && crewHierarchy[sessionUser?.captainId] ? sessionUser?.captainId : undefined) ||
    (pendingUser?.captainId && crewHierarchy[pendingUser?.captainId] ? pendingUser?.captainId : undefined)
  const theirCaptainScName = captains.find((c) => c.ownerId === theirCaptainId)?.owner?.scName
  const theyOnAnyCrew = Boolean(theirCaptainId)
  const theyIsCaptain = Boolean(theyIsPotentialCaptain && theyOnAnyCrew)
  const theyIsMyCaptain = Boolean(
    sessionUser &&
      mySessionUser?.captainId &&
      crewHierarchy[sessionUser?.ownerId] &&
      mySessionUser?.captainId === sessionUser?.ownerId
  )
  const iAmTheirCaptain = Boolean(theirCaptainId && theirCaptainId === mySessionUser?.ownerId)
  const theyOnMyCrew = Boolean(
    theyOnAnyCrew && (iAmTheirCaptain || (myCrewCaptainId && theirCaptainId === mySessionUser?.captainId))
  )

  const menuItems: MenuItemObj[] = [
    {
      icon: <Person fontSize="small" />,
      label: isMe ? 'Edit My Status' : 'User Details',
      onClick: () => {
        if (isActiveUser) openActiveUserModal(sessionUser?.owner?.userId as string)
        else openPendingUserModal(pendingUser?.scName as string)
      },
    },
  ]

  if (sessionUser && sessionUser.loadout) {
    menuItems.push({
      label: sessionUser.loadout?.name ? `Loadout: ${sessionUser.loadout?.name}` : 'No Loadout Selected',
      disabled: !sessionUser.loadout,
      icon: <ModuleIcon fontSize="small" />,
      onClick: () => {
        openLoadoutModal(sessionUser.loadout as MiningLoadout)
      },
    })
  }
  menuItems.push({ divider: true, label: '' })

  if (!isMe && (meIsPotentialCaptain || iAmOnCrew) && !theyOnAnyCrew && !theyIsCaptain) {
    menuItems.push({
      label: `Add to my crew`,
      icon: <RocketLaunch fontSize="small" />,
      onClick: () => {
        if (sessionUser) updateSessionUserCaptain(sessionUser.ownerId, myCrewCaptainId || mySessionUser.ownerId)
        else if (pendingUser) updatePendingUserCaptain(pendingUser.scName, myCrewCaptainId || mySessionUser.ownerId)
      },
    })
  }
  if (!isMe && !iAmOnCrew && !theyOnMyCrew && sessionUser) {
    menuItems.push({
      label: `Join ${sessionUser.owner?.scName}'s crew`,
      icon: <RocketLaunch fontSize="small" />,
      onClick: () => {
        updateSessionUserCaptain(mySessionUser.ownerId, sessionUser.ownerId)
      },
    })
  }

  if ((isMe && iAmOnCrew) || (!isMe && theyIsMyCaptain)) {
    menuItems.push({
      label: `Leave ${myCaptainScName || "UNKNOWN USER's"}'s crew`,
      color: 'error',
      icon: <GroupRemove fontSize="small" color="error" />,
      onClick: () => {
        updateSessionUserCaptain(mySessionUser.ownerId, null)
      },
    })
  }

  if (!isMe && theyOnMyCrew) {
    menuItems.push({
      label: `Remove from ${iAmTheirCaptain ? 'my' : theirCaptainScName} crew`,
      color: 'error',
      icon: <RocketLaunch fontSize="small" color="error" />,
      onClick: () => {
        if (sessionUser) updateSessionUserCaptain(sessionUser.ownerId, null)
        else if (pendingUser) updatePendingUserCaptain(pendingUser.scName, null)
      },
    })
  }

  if (isMe && meIsCaptain) {
    menuItems.push({
      label: `Disband Crew`,
      color: 'error',
      icon: <Delete fontSize="small" color="error" />,
      onClick: () => {
        setActiveModal(DialogEnum.DISBAND_CREW)
      },
    })
  }

  if (!isMe && !isMyFriend) {
    menuItems.push({
      label: `Add Friend`,
      icon: <GroupAdd fontSize="small" />,
      onClick: () => {
        addFriend(theirSCName)
      },
    })
  }

  if (!isMe && isMyFriend) {
    menuItems.push({
      label: `Remove Friend`,
      color: 'error',
      icon: <GroupRemove fontSize="small" color="error" />,
      onClick: () => {
        removeFriend(theirSCName)
      },
    })
  }

  if (!isMe && iOwnSession && pendingUser) {
    menuItems.push({
      label: `Delete ${pendingUser.scName} from session`,
      color: 'error',
      icon: <DeleteForever fontSize="small" color="error" />,
      onClick: () => {
        setDeletePendingUserOpen(true)
      },
    })
  }

  if (!isMe && iOwnSession && sessionUser) {
    menuItems.push({
      label: `Delete ${sessionUser.owner?.scName} from session`,
      color: 'error',
      icon: <DeleteForever fontSize="small" color="error" />,
      onClick: () => {
        setDeleteActiveUserOpen(true)
      },
    })
  }

  if (isMe && !iOwnSession) {
    menuItems.push({
      label: `Leave Session`,
      color: 'error',
      icon: <DeleteForever fontSize="small" color="error" />,
      onClick: () => setActiveModal(DialogEnum.LEAVE_SESSION),
    })
  }

  const { contextMenuNode, handleContextMenu } = useSessionContextMenu({
    header: (
      <>
        {getSafeName(theirSCName)} {isMe && ' (You)'}
        {!isActiveUser && ' (Pending)'}
      </>
    ),
    headerColor: isMe ? theme.palette.primary.main : isActiveUser ? theme.palette.info.main : theme.palette.info.main,
    headerAvatar: (
      <UserAvatar
        size="medium"
        hideTooltip
        user={sessionUser?.owner as User}
        pendingUser={pendingUser}
        isFriend={isMyFriend}
        privacy={hideNames}
        sessionOwner={isMe}
      />
    ),
    menuItems,
  })

  return {
    handleContextMenu,
    contextMenuNode: (
      <>
        {contextMenuNode}
        <DeleteModal
          open={deletePendingUserOpen}
          title={`Delete ${pendingUser?.scName} from session?`}
          message={`Are you sure you want to delete ${pendingUser?.scName} from the session? This will also remove any of their work order shares.`}
          onClose={() => setDeletePendingUserOpen(false)}
          onConfirm={() => {
            removeSessionMentions([pendingUser?.scName as string])
            setDeletePendingUserOpen(false)
          }}
        />
        <DeleteModal
          open={deleteActiveUserOpen}
          title={`Delete ${sessionUser?.owner?.scName} from session?`}
          message={
            <>
              <Typography>
                Are you sure you want to delete <strong>{sessionUser?.owner?.scName}</strong> from the session? This
                will:
                <ul>
                  <li>Remove all of their work orders.</li>
                  <li>Remove their work order shares in any work order.</li>
                  <li>Reassigned all their scouting shares to the session owner (you).</li>
                </ul>
              </Typography>
              <Typography color="error">
                You should know that if they still have the link for this session and you have not set "Require users to
                be added first." in the sesison settings they can still rejoin the session.
              </Typography>
            </>
          }
          onClose={() => setDeleteActiveUserOpen(false)}
          onConfirm={() => {
            removeSessionCrew(sessionUser?.owner?.scName as string)
            setDeleteActiveUserOpen(false)
          }}
        />
      </>
    ),
  }
}
