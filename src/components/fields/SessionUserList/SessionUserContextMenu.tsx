import * as React from 'react'
import { Divider, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Typography } from '@mui/material'
import { GroupAdd, GroupRemove, Person, PersonAdd, PersonRemove, RocketLaunch } from '@mui/icons-material'
import { SessionContext } from '../../../context/session.context'
import { PendingUser, MiningLoadout, SessionUser } from '@regolithco/common'
import { ModuleIcon } from '../../../icons'

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
    mySessionUser,
    removeFriend,
    openActiveUserModal,
    openPendingUserModal,
    updateSessionUserCaptain,
    updatePendingUserCaptain,
    captains,
    openLoadoutModal,
  } = React.useContext(SessionContext)

  const isMe = sessionUser?.ownerId === myUserProfile.userId
  const isActiveUser = !!sessionUser
  const theirSCName = (sessionUser?.owner?.scName || pendingUser?.scName) as string
  const theirCaptainId = sessionUser?.captainId || pendingUser?.captainId
  const theirCaptain: SessionUser | null = theirCaptainId
    ? captains.find((c) => c.ownerId === theirCaptainId) || null
    : null

  const isMyFriend = myUserProfile?.friends?.includes(theirSCName as string)
  const meIsCaptain = !theirCaptainId
  const theyOnMyCrew = !!theirCaptainId && theirCaptainId === sessionUser?.captainId
  const theyOnAnyCrew = !!theirCaptainId

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
            }}
          >
            <ListItemIcon>
              <ModuleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{`Loadout: ${sessionUser.loadout?.name}` || 'No Loadout Selected'}</ListItemText>
          </MenuItem>
        )}

        <Divider />

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

        {/* Add to my crew */}
        {meIsCaptain && !theyOnMyCrew && (
          <MenuItem
            onClick={() => {
              if (sessionUser) updateSessionUserCaptain(sessionUser.ownerId, mySessionUser.ownerId)
              else if (pendingUser) updatePendingUserCaptain(pendingUser.scName, mySessionUser.ownerId)
              onClose()
            }}
          >
            <ListItemIcon>
              <RocketLaunch fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add to my crew</ListItemText>
          </MenuItem>
        )}

        {/* Remove from my crew */}
        {meIsCaptain && theyOnMyCrew && (
          <MenuItem
            onClick={() => {
              if (sessionUser) updateSessionUserCaptain(sessionUser.ownerId, null)
              else if (pendingUser) updatePendingUserCaptain(pendingUser.scName, null)
            }}
          >
            <ListItemIcon>
              <RocketLaunch fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="error">Remove from my crew</Typography>
            </ListItemText>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  )
}
