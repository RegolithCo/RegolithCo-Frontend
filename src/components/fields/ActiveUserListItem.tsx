import React, { useEffect, useRef } from 'react'
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Link,
  IconButton,
} from '@mui/material'
import { getSessionUserStateName, ScoutingFind, SessionUser, SessionUserStateEnum, User } from '@regolithco/common'
import { MoreVert } from '@mui/icons-material'
import { makeSessionUrls } from '../../lib/routingUrls'
import { UserAvatar } from '../UserAvatar'
import { ModuleIcon } from '../../icons/Module'
import { text } from 'stream/consumers'

export interface ActiveUserListItemProps {
  sessionUser: SessionUser
  meId?: string
  sessionOwnerId?: string
  scoutingFind?: ScoutingFind
  friends?: string[]
  menuOpen: boolean
  openUserPopup?: () => void
  openContextMenu?: (el: HTMLElement) => void
  navigate?: (path: string) => void
  addFriend?: () => void
}

export const ActiveUserListItem: React.FC<ActiveUserListItemProps> = ({
  sessionUser,
  sessionOwnerId,
  friends,
  scoutingFind,
  openUserPopup,
  menuOpen,
  openContextMenu,
  navigate,
  meId,
}) => {
  const secondaryText = []
  const isMe = meId && sessionUser.owner?.userId === meId
  const isOwner = sessionUser.ownerId === sessionOwnerId
  const menuRef = useRef<HTMLLIElement>()

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
      onContextMenu={(e) => {
        e.preventDefault()
        openContextMenu && openContextMenu(e.currentTarget)
      }}
      onDoubleClick={(e) => {
        e.preventDefault()
        openUserPopup && openUserPopup()
      }}
      sx={{ background: meId ? '#33333366' : 'transparent' }}
    >
      <ListItemAvatar
        sx={{
          cursor: 'pointer',
        }}
        onClick={() => {
          openUserPopup && openUserPopup()
        }}
      >
        <UserAvatar
          size="small"
          user={user}
          sessionOwner={isOwner}
          isFriend={friends?.includes(user?.scName as string)}
        />
      </ListItemAvatar>

      <ListItemText
        sx={{
          '& .MuiListItemText-secondary': {
            fontSize: '0.7rem',
          },
          //
        }}
        primaryTypographyProps={{
          onClick: () => {
            openUserPopup && openUserPopup()
          },
          sx: {
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
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
      <ListItemSecondaryAction>
        <Tooltip title={`Vehicle Loadout: ${sessionUser.loadout?.name || 'None'}`} arrow>
          <span>
            <IconButton color="primary" disabled>
              <ModuleIcon />
            </IconButton>
          </span>
        </Tooltip>

        <IconButton
          color="primary"
          onClick={(e) => {
            openContextMenu && openContextMenu(e.currentTarget)
          }}
        >
          <MoreVert />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
