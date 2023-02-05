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
  Link,
} from '@mui/material'
import { getSessionUserStateName, makeAvatar, ScoutingFind, SessionUser, User, UserStateEnum } from '@regolithco/common'
import { Engineering, Person, PersonAdd, Verified } from '@mui/icons-material'
import { makeSessionUrls } from '../../lib/routingUrls'

export interface ActiveUserListItemProps {
  sessionUser: SessionUser
  meId?: string
  sessionOwnerId?: string
  scoutingFind?: ScoutingFind
  friends?: string[]
  navigate?: (path: string) => void
  addFriend?: () => void
}

export const ActiveUserListItem: React.FC<ActiveUserListItemProps> = ({
  sessionUser,
  sessionOwnerId,
  friends,
  scoutingFind,
  addFriend,
  navigate,
  meId,
}) => {
  const secondaryText = []
  const isMe = meId && sessionUser.owner?.userId === meId
  const isOwner = sessionUser.ownerId === sessionOwnerId
  const userAvatar = makeAvatar(sessionUser.owner?.avatarUrl as string)

  const user = sessionUser.owner as User
  if (sessionUser) {
    if (sessionUser.isPilot) {
      secondaryText.push('Pilot')
    }
    if (sessionUser.state) {
      if (scoutingFind) {
        secondaryText.push(' - ')
        secondaryText.push(
          <>
            {getSessionUserStateName(sessionUser.state)} -
            <Link
              sx={{
                fontSize: '0.75rem',
              }}
              onClick={() => {
                navigate &&
                  navigate(
                    makeSessionUrls({ sessionId: scoutingFind.sessionId, scoutingFindId: scoutingFind.scoutingFindId })
                  )
              }}
            >
              {scoutingFind.scoutingFindId.split('_')[0]}
            </Link>
          </>
        )
      } else secondaryText.push(getSessionUserStateName(sessionUser.state))
    }
    if (sessionUser.miningVehicle) {
      secondaryText.push(sessionUser.miningVehicle)
    }
    if (sessionUser.pilotSCName) {
      secondaryText.push(`Crew of: ${sessionUser.pilotSCName}`)
    }
  }

  return (
    <ListItem sx={{ background: meId ? '#33333366' : 'transparent' }}>
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
          <Avatar src={userAvatar} imgProps={{ referrerPolicy: 'no-referrer' }} alt={sessionUser.owner?.scName}>
            <Person />
          </Avatar>
        </Badge>
      </ListItemAvatar>

      <ListItemText
        sx={{
          '& .MuiListItemText-secondary': {
            fontSize: '0.7rem',
          },
          //
        }}
        primary={user?.scName}
        secondary={
          secondaryText.length > 0
            ? secondaryText.map((it, idx) => (
                <span key={`it-${idx}`} style={{ fontSize: 'inherit' }}>
                  {it}
                </span>
              ))
            : null
        }
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
