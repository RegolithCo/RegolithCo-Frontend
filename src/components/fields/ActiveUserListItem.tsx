import React from 'react'
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Link,
} from '@mui/material'
import {
  getSessionUserStateName,
  makeAvatar,
  ScoutingFind,
  SessionStateEnum,
  SessionUser,
  SessionUserStateEnum,
  User,
} from '@regolithco/common'
import { Person, PersonAdd } from '@mui/icons-material'
import { makeSessionUrls } from '../../lib/routingUrls'
import { UserAvatar } from '../UserAvatar'

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
      } else if (sessionUser.state !== SessionUserStateEnum.Unknown) {
        secondaryText.push(getSessionUserStateName(sessionUser.state))
      }
    }
    if (sessionUser.vehicle) {
      secondaryText.push(sessionUser.vehicle.name)
    }
    if (sessionUser.pilotSCName) {
      secondaryText.push(`Crew of: ${sessionUser.pilotSCName}`)
    }
  }

  return (
    <ListItem sx={{ background: meId ? '#33333366' : 'transparent' }}>
      <ListItemAvatar>
        <UserAvatar size="small" user={user} sessionOwner={isOwner} />
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
