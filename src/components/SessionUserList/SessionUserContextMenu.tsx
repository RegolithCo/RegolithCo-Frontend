import * as React from 'react'
import { Divider, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Typography } from '@mui/material'
import { Person, PersonAdd, PersonRemove } from '@mui/icons-material'
import { SessionUser } from '@regolithco/common'

interface SessionUserContextMenuProps {
  open: boolean
  isMe: boolean
  sessionUser: SessionUser
  friends: string[]
  anchorEl?: HTMLElement
  addFriend?: () => void
  removeFriend?: () => void
  openUserModal?: (userId: string) => void
  onClose: () => void
}

export const SessionUserContextMenu: React.FC<SessionUserContextMenuProps> = ({
  open,
  anchorEl,
  sessionUser,
  onClose,
  isMe,
  addFriend,
  removeFriend,
  openUserModal,
  friends,
}) => {
  return (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      // transformOrigin={{
      //   vertical: 'top',
      //   horizontal: 'left',
      // }}
      open={open}
      onClose={onClose}
      sx={
        {
          // display: { xs: 'block', md: 'none' },
          // '& .MuiPaper-root': {
          // background: yellow[700],
          // color: theme.palette.secondary.contrastText,
          // },
        }
      }
    >
      <MenuList>
        <ListItem>
          <ListItemText>
            <Typography variant="overline">USER: {sessionUser?.owner?.scName}</Typography>
          </ListItemText>
        </ListItem>
        <Divider />
        <MenuItem
          onClick={() => {
            openUserModal && openUserModal(sessionUser?.owner?.userId as string)
            onClose()
          }}
        >
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>{isMe ? 'Edit My Status' : 'User Details'}</ListItemText>
        </MenuItem>

        {!isMe && <Divider />}
        {!isMe && addFriend && !friends.includes(sessionUser?.owner?.scName as string) && (
          <MenuItem
            onClick={() => {
              addFriend()
              onClose()
            }}
          >
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Friend</ListItemText>
          </MenuItem>
        )}
        {!isMe && removeFriend && friends.includes(sessionUser?.owner?.scName as string) && (
          <MenuItem
            color="error"
            onClick={() => {
              removeFriend()
              onClose()
            }}
          >
            <ListItemIcon>
              <PersonRemove fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="error">Remove Friend</Typography>
            </ListItemText>
          </MenuItem>
        )}

        <MenuItem disabled>
          <ListItemIcon>
            <PersonRemove fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography>Join Crew</Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem disabled>
          <ListItemIcon>
            <PersonRemove fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography>Add to Crew</Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem disabled>
          <ListItemIcon>
            <PersonRemove fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography>Leave Crew</Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem disabled>
          <ListItemIcon>
            <PersonRemove fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography>Remove from Crew</Typography>
          </ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
