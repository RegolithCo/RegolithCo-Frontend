import React from 'react'
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material'
import { SessionUser, User, UserStateEnum } from '@regolithco/common'
import { Engineering, Person, PersonAdd, Verified } from '@mui/icons-material'

export interface ActiveUserListItemProps {
  sessionUser: SessionUser
  meId?: string
  sessionOwnerId?: string
  friends?: string[]
  small?: boolean
  addFriend?: () => void
}

export const ActiveUserListItem: React.FC<ActiveUserListItemProps> = ({
  sessionUser,
  sessionOwnerId,
  friends,
  addFriend,
  small,
  meId,
}) => {
  const secondaryText = []
  const isMe = meId && sessionUser.owner?.userId === meId
  const isOwner = sessionUser.ownerId === sessionOwnerId
  const userAvatar = sessionUser.owner?.avatarUrl ? `${sessionUser.owner?.avatarUrl}.webp?size=256` : undefined
  const user = sessionUser.owner as User
  if (sessionUser) {
    if (sessionUser.state) {
      secondaryText.push(sessionUser.state)
    }
    if (sessionUser.isPilot) {
      secondaryText.push('Pilot')
    }
    if (sessionUser.miningVehicle) {
      secondaryText.push(sessionUser.miningVehicle)
    }
    if (sessionUser.pilotSCName) {
      secondaryText.push(`Crew of: ${sessionUser.pilotSCName}`)
    }
  }

  return (
    <ListItem sx={{ background: meId ? '#33333366' : 'transparent' }} disableGutters={small}>
      {!small && (
        <ListItemAvatar>
          <Badge
            badgeContent={user.state === UserStateEnum.Verified ? <Verified color="success" /> : null}
            overlap="circular"
            sx={
              user.state === UserStateEnum.Verified
                ? {
                    '& svg': {
                      strokeWidth: '0.5px',
                      stroke: 'black',
                    },
                    '& .MuiBadge-badge::before': {
                      content: '" "',
                      display: 'block',
                      background: 'black',
                      position: 'absolute',

                      height: '16px',
                      width: '16px',
                      zIndex: -1,
                      borderRadius: '50%',
                    },
                  }
                : {}
            }
          >
            <Avatar src={userAvatar}>
              <Person />
            </Avatar>
          </Badge>
        </ListItemAvatar>
      )}
      <ListItemText
        sx={{
          '& .MuiListItemText-secondary': {
            fontSize: small ? '0.5rem' : '0.7rem',
          },
          //
        }}
        primary={user?.scName}
        secondary={secondaryText.length > 0 ? secondaryText.join(' - ') : null}
      />
      {(isOwner || !isMe) && addFriend && (
        <ListItemSecondaryAction>
          {isOwner && (
            <Tooltip title="Session Owner" arrow>
              <span>
                <Engineering color="disabled" />
              </span>
            </Tooltip>
          )}
          {!isMe && friends && (friends || []).indexOf(user.scName) < 0 ? (
            <Tooltip title="Add username to friend list" arrow>
              <span>
                <IconButton onClick={addFriend}>
                  <PersonAdd />
                </IconButton>
              </span>
            </Tooltip>
          ) : (
            !isMe && (
              <Tooltip title="Username is already in your friend list" arrow>
                <span>
                  <Person color="disabled" />
                </span>
              </Tooltip>
            )
          )}
        </ListItemSecondaryAction>
      )}
    </ListItem>
  )
}
