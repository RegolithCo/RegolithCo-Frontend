import * as React from 'react'
import { Divider, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Typography } from '@mui/material'
import { Delete, DeleteForever, GroupAdd, GroupRemove, Person, RocketLaunch } from '@mui/icons-material'
import { SessionContext } from '../../../context/session.context'
import { PendingUser, MiningLoadout, SessionUser } from '@regolithco/common'
import { ModuleIcon } from '../../../icons'
import { DisbandModal } from '../../modals/DisbandCrew'
import { DeleteModal } from '../../modals/DeleteModal'

interface SessionUserContextMenuProps {
  open: boolean
  sessionUser?: SessionUser
  pendingUser?: PendingUser
  anchorEl?: HTMLElement
  onClose: () => void
}

export const SessionUserContextMenu: React.FC<SessionUserContextMenuProps> = ({
  open,
  anchorEl,
  onClose,
  sessionUser,
  pendingUser,
}) => {
  const {
    myUserProfile,
    addFriend,
    crewHierarchy,
    mySessionUser,
    captains,
    session,
    removeFriend,
    removeSessionMentions,
    removeSessionCrew,
    openActiveUserModal,
    openPendingUserModal,
    updateSessionUserCaptain,
    updatePendingUserCaptain,
    openLoadoutModal,
  } = React.useContext(SessionContext)

  const [disbandPopupOpen, setDisbandPopupOpen] = React.useState(false)
  const [deletePendingUserOpen, setDeletePendingUserOpen] = React.useState(false)
  const [deleteActiveUserOpen, setDeleteActiveUserOpen] = React.useState(false)
  const isMe = sessionUser?.ownerId === myUserProfile.userId
  const isActiveUser = !!sessionUser
  const theirSCName = (sessionUser?.owner?.scName || pendingUser?.scName) as string

  const iOwnSession = session?.ownerId === myUserProfile.userId

  const meIsPotentialCaptain = !mySessionUser?.captainId
  const meIsCaptain = meIsPotentialCaptain && crewHierarchy[mySessionUser?.ownerId]
  const iAmOnCrew = !!mySessionUser?.captainId
  const myCrewCaptainId = mySessionUser?.captainId
  const myCaptainScName = myCrewCaptainId
    ? captains.find((c) => c.ownerId === myCrewCaptainId)?.owner?.scName
    : undefined

  const isMyFriend = myUserProfile?.friends?.includes(theirSCName as string)
  const theirCaptainId = sessionUser?.captainId || pendingUser?.captainId
  const theirCaptainScName = captains.find((c) => c.ownerId === theirCaptainId)?.owner?.scName
  const theyOnAnyCrew = Boolean(theirCaptainId)
  const theyIsCaptain = sessionUser && !sessionUser?.captainId && crewHierarchy[sessionUser?.ownerId]
  const theyIsMyCaptain = sessionUser && mySessionUser?.captainId === sessionUser?.ownerId
  const iAmTheirCaptain = theirCaptainId === mySessionUser?.ownerId
  const theyOnMyCrew = theyOnAnyCrew && (iAmTheirCaptain || theirCaptainId === mySessionUser?.captainId)

  return (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      onClose={onClose}
      sx={
        {
          // display: { xs: 'block', md: 'none' },
        }
      }
    >
      <MenuList>
        {/* Header Item */}
        <ListItem>
          <ListItemText>
            <Typography variant="overline">
              {theirSCName} {isMe && ' (You)'}
              {!isActiveUser && ' (Pending)'}
            </Typography>
          </ListItemText>
        </ListItem>
        <Divider />

        {/* Open user popup action */}
        <MenuItem
          onClick={() => {
            if (isActiveUser) openActiveUserModal(sessionUser?.owner?.userId as string)
            else openPendingUserModal(pendingUser?.scName as string)
            onClose()
          }}
        >
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>{isMe ? 'Edit My Status' : 'User Details'}</ListItemText>
        </MenuItem>

        {/* Loadout popup screen */}
        {!isMe && sessionUser && (
          <MenuItem
            disabled={!sessionUser.loadout}
            onClick={() => {
              openLoadoutModal(sessionUser.loadout as MiningLoadout)
              onClose()
            }}
          >
            <ListItemIcon>
              <ModuleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{`Loadout: ${sessionUser.loadout?.name}` || 'No Loadout Selected'}</ListItemText>
          </MenuItem>
        )}

        <Divider />

        {/* Add to my crew */}
        {!isMe && (meIsPotentialCaptain || iAmOnCrew) && !theyOnAnyCrew && !theyIsCaptain && (
          <MenuItem
            onClick={() => {
              if (sessionUser) updateSessionUserCaptain(sessionUser.ownerId, myCrewCaptainId || mySessionUser.ownerId)
              else if (pendingUser)
                updatePendingUserCaptain(pendingUser.scName, myCrewCaptainId || mySessionUser.ownerId)
              onClose()
            }}
          >
            <ListItemIcon>
              <RocketLaunch fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add to my crew</ListItemText>
          </MenuItem>
        )}
        {sessionUser && !isMe && !meIsCaptain && !iAmOnCrew && !theyOnAnyCrew && (
          <MenuItem
            onClick={() => {
              updateSessionUserCaptain(mySessionUser.ownerId, sessionUser.ownerId)
              onClose()
            }}
          >
            <ListItemIcon>
              <RocketLaunch fontSize="small" />
            </ListItemIcon>
            <ListItemText>Join {sessionUser.owner?.scName}'s crew</ListItemText>
          </MenuItem>
        )}
        {((isMe && iAmOnCrew) || (!isMe && theyIsMyCaptain)) && (
          <MenuItem
            onClick={() => {
              updateSessionUserCaptain(mySessionUser.ownerId, null)
              onClose()
            }}
          >
            <ListItemIcon>
              <GroupRemove fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="error">Leave {myCaptainScName}'s crew</Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Remove from my crew */}
        {!isMe && theyOnMyCrew && (
          <MenuItem
            onClick={() => {
              if (sessionUser) updateSessionUserCaptain(sessionUser.ownerId, null)
              else if (pendingUser) updatePendingUserCaptain(pendingUser.scName, null)
              onClose()
            }}
          >
            <ListItemIcon>
              <RocketLaunch fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="error">Remove from {iAmTheirCaptain ? 'my' : theirCaptainScName} crew</Typography>
            </ListItemText>
          </MenuItem>
        )}

        {isMe && meIsCaptain && (
          <MenuItem
            color="error"
            onClick={() => {
              setDisbandPopupOpen(true)
              onClose()
            }}
          >
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="error">Disband Crew</Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Add as friend */}
        {!isMe && !isMyFriend && (
          <MenuItem
            onClick={() => {
              addFriend(theirSCName)
              onClose()
            }}
          >
            <ListItemIcon>
              <GroupAdd fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Friend</ListItemText>
          </MenuItem>
        )}

        {/* Remove as Friend */}
        {!isMe && isMyFriend && (
          <MenuItem
            color="error"
            onClick={() => {
              removeFriend(theirSCName)
              onClose()
            }}
          >
            <ListItemIcon>
              <GroupRemove fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="error">Remove Friend</Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Remove from my crew */}
        {iOwnSession && pendingUser && (
          <MenuItem
            onClick={() => {
              setDeletePendingUserOpen(true)
            }}
          >
            <ListItemIcon>
              <DeleteForever fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="error">Delete {pendingUser.scName} from session</Typography>
            </ListItemText>
          </MenuItem>
        )}
        {/* Remove from my crew */}
        {iOwnSession && sessionUser && (
          <MenuItem
            onClick={() => {
              setDeleteActiveUserOpen(true)
            }}
          >
            <ListItemIcon>
              <DeleteForever fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="error">Delete {sessionUser.owner?.scName} from session</Typography>
            </ListItemText>
          </MenuItem>
        )}
      </MenuList>
      <DisbandModal open={deletePendingUserOpen} onClose={() => setDisbandPopupOpen(false)} />
      <DeleteModal
        open={deletePendingUserOpen}
        title={`Delete ${pendingUser?.scName} from session?`}
        message={`Are you sure you want to delete ${pendingUser?.scName} from the session? This will also remove any of their work order shares.`}
        onClose={() => setDeletePendingUserOpen(false)}
        onConfirm={() => {
          removeSessionMentions([pendingUser?.scName as string])
          setDeletePendingUserOpen(false)
          onClose()
        }}
      />
      <DeleteModal
        open={deleteActiveUserOpen}
        title={`Delete ${sessionUser?.owner?.scName} from session?`}
        message={
          <>
            <Typography>
              Are you sure you want to delete <strong>{sessionUser?.owner?.scName}</strong> from the session? This will:
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
          onClose()
        }}
      />
    </Menu>
  )
}
