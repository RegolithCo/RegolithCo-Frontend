import * as React from 'react'
import { Divider, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Typography } from '@mui/material'
import { Person, PersonAdd, PersonRemove } from '@mui/icons-material'
import { SessionUser } from '@regolithco/common'

interface ActiveUserContextMenuProps {
  open: boolean
  isMe: boolean
  sessionUser: SessionUser
  friends: string[]
  anchorEl?: HTMLElement
  addFriend?: () => void
  removeFriend?: () => void
  onClose: () => void
}

export const ActiveUserContextMenu: React.FC<ActiveUserContextMenuProps> = ({
  open,
  anchorEl,
  sessionUser,
  onClose,
  isMe,
  addFriend,
  removeFriend,
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
        <MenuItem>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>User Details</ListItemText>
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
      </MenuList>
    </Menu>
  )
}
