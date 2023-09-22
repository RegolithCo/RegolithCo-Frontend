import * as React from 'react'
import { Divider, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Typography } from '@mui/material'
import { Delete, GroupAdd, GroupRemove, Person, RocketLaunch } from '@mui/icons-material'
import { SessionContext } from '../../../context/session.context'
import { PendingUser, MiningLoadout, SessionUser } from '@regolithco/common'
import { ModuleIcon } from '../../../icons'
import { DisbandModal } from '../../modals/DisbandCrew'

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
    removeFriend,
    openActiveUserModal,
    openPendingUserModal,
    updateSessionUserCaptain,
    updatePendingUserCaptain,
    updateMySessionUser,
    openLoadoutModal,
  } = React.useContext(SessionContext)

  const [disbandPopupOpen, setDisbandPopupOpen] = React.useState(false)
  const isMe = sessionUser?.ownerId === myUserProfile.userId
  const isActiveUser = !!sessionUser
  const theirSCName = (sessionUser?.owner?.scName || pendingUser?.scName) as string

  const meIsPotentialCaptain = !mySessionUser?.captainId
  const meIsCaptain = meIsPotentialCaptain && crewHierarchy[mySessionUser?.ownerId]
  const iAmOnCrew = !!mySessionUser?.captainId
  const myCrewCaptainId = mySessionUser?.captainId
  const myCaptainScName = myCrewCaptainId
    ? captains.find((c) => c.ownerId === myCrewCaptainId)?.owner?.scName
    : undefined

  const isMyFriend = myUserProfile?.friends?.includes(theirSCName as string)
  const theirCaptainId = sessionUser?.captainId || pendingUser?.captainId
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
              <Typography color="error">Remove from my crew</Typography>
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
      </MenuList>
      <DisbandModal open={disbandPopupOpen} onClose={() => setDisbandPopupOpen(false)} />
    </Menu>
  )
}
