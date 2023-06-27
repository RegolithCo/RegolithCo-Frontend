import React, { useEffect } from 'react'
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Link,
} from '@mui/material'
import { getSessionUserStateName, ScoutingFind, SessionUser, SessionUserStateEnum, User } from '@regolithco/common'
import { Person, PersonAdd } from '@mui/icons-material'
import { makeSessionUrls } from '../../lib/routingUrls'
import { UserAvatar } from '../UserAvatar'

export interface ActiveUserListItemProps {
  sessionUser: SessionUser
  meId?: string
  sessionOwnerId?: string
  scoutingFind?: ScoutingFind
  friends?: string[]
  openUserPopup?: (userId: string) => void
  openContextMenu?: (el: HTMLElement, userId: string) => void
  navigate?: (path: string) => void
  addFriend?: () => void
}

export const ActiveUserListItem: React.FC<ActiveUserListItemProps> = ({
  sessionUser,
  sessionOwnerId,
  friends,
  scoutingFind,
  openUserPopup,
  openContextMenu,
  addFriend,
  navigate,
  meId,
}) => {
  const secondaryText = []
  const isMe = meId && sessionUser.owner?.userId === meId
  const isOwner = sessionUser.ownerId === sessionOwnerId

  useEffect(() => {
    // define a custom handler function
    // for the contextmenu event
    const handleContextMenu = (event: MouseEvent) => {
      // prevent the right-click menu from appearing
      event.preventDefault()
    }

    // attach the event listener to
    // the document object
    document.addEventListener('contextmenu', handleContextMenu)

    // clean up the event listener when
    // the component unmounts
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

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
    <ListItem
      anchorEl={anchorEl}
      onContextMenu={(e) => {
        e.preventDefault()
        openContextMenu(anchorEl, userId)
      }}
      onDoubleClick={(e) => {
        e.preventDefault()
        openUserPopup && openUserPopup(sessionUser.ownerId)
      }}
      sx={{ background: meId ? '#33333366' : 'transparent' }}
    >
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
