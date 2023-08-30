import React, { useEffect, useRef } from 'react'
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import {
  getSessionUserStateName,
  lookups,
  ScoutingFind,
  SessionUser,
  SessionUserStateEnum,
  User,
} from '@regolithco/common'
import { MoreVert } from '@mui/icons-material'
import { makeSessionUrls } from '../../lib/routingUrls'
import { UserAvatar } from '../UserAvatar'
import { ModuleIcon } from '../../icons/Module'
import { alpha, Box, useTheme } from '@mui/system'
import { fontFamilies } from '../../theme'

export interface ActiveUserProps {
  sessionUser: SessionUser
  meId?: string
  sessionOwnerId?: string
  scoutingFind?: ScoutingFind
  friends?: string[]
  captain?: SessionUser
  openUserPopup?: () => void
  openLoadoutPopup?: () => void
  openContextMenu?: (el: HTMLElement) => void
  navigate?: (path: string) => void
  addFriend?: () => void
}

export const ActiveUser: React.FC<ActiveUserProps> = ({
  sessionUser,
  sessionOwnerId,
  friends,
  scoutingFind,
  openUserPopup,
  openLoadoutPopup: openModalPopup,
  captain,
  openContextMenu,
  navigate,
  meId,
}) => {
  const theme = useTheme()
  const secondaryText = []
  const stateObjects = []
  const isMe = meId && sessionUser.owner?.userId === meId
  const isOwner = sessionUser.ownerId === sessionOwnerId
  // const menuRef = useRef<HTMLLIElement>()

  const STATE_COLORS_BG: Record<SessionUserStateEnum, string> = {
    [SessionUserStateEnum.Unknown]: '#000000',
    [SessionUserStateEnum.Afk]: '#666666',
    [SessionUserStateEnum.OnSite]: theme.palette.info.main,
    [SessionUserStateEnum.RefineryRun]: theme.palette.secondary.main,
    [SessionUserStateEnum.Scouting]: theme.palette.info.light,
    [SessionUserStateEnum.Travelling]: theme.palette.info.light,
  }
  const STATE_COLORS_FG: Record<SessionUserStateEnum, string> = {
    [SessionUserStateEnum.Unknown]: '#000000',
    [SessionUserStateEnum.Afk]: '#000000',
    [SessionUserStateEnum.OnSite]: theme.palette.info.contrastText,
    [SessionUserStateEnum.RefineryRun]: theme.palette.secondary.contrastText,
    [SessionUserStateEnum.Scouting]: theme.palette.info.contrastText,
    [SessionUserStateEnum.Travelling]: theme.palette.info.contrastText,
  }

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
    if (sessionUser.vehicleCode) {
      const vehicle = sessionUser.vehicleCode
        ? lookups.shipLookups.find((s) => s.code === sessionUser.vehicleCode)
        : null
      if (vehicle) {
        // Truncate to 16 characters with an ellipsis if necessary
        const vehicleName = vehicle.name.length > 16 ? vehicle.name.substring(0, 16) + '...' : vehicle.name
        secondaryText.push(vehicleName)
      }
    }
    if (sessionUser.state) {
      if (scoutingFind) {
        stateObjects.push(
          <>
            {getSessionUserStateName(sessionUser.state)}
            {sessionUser.state === SessionUserStateEnum.OnSite && ' at '}
            {sessionUser.state === SessionUserStateEnum.Travelling && ' to '}
            {(sessionUser.state === SessionUserStateEnum.OnSite ||
              sessionUser.state === SessionUserStateEnum.Travelling) &&
              scoutingFind.scoutingFindId.split('_')[0]}
          </>
        )
      } else if (sessionUser.state !== SessionUserStateEnum.Unknown) {
        stateObjects.push(getSessionUserStateName(sessionUser.state))
      }
    }

    if (captain) {
      secondaryText.push(`Crew of: ${captain.owner?.scName}`)
    }
  }
  const stateColor = STATE_COLORS_BG[sessionUser.state] || undefined

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
      onClick={() => {
        openUserPopup && openUserPopup()
      }}
      sx={{
        background: stateColor && alpha(stateColor, 0.2),
        cursor: 'pointer',
        borderLeft: isMe ? `5px solid ${theme.palette.secondary.light}` : '1px solid transparent',
      }}
    >
      {sessionUser.state && sessionUser.state !== SessionUserStateEnum.Unknown && (
        <Box
          sx={{
            background: STATE_COLORS_BG[sessionUser.state],
            color: STATE_COLORS_FG[sessionUser.state],
            position: 'absolute',
            fontFamily: fontFamilies.robotoMono,
            textTransform: 'uppercase',
            fontSize: '0.6rem',
            fontWeight: 'bold',
            borderRadius: '0 0 0 0.2rem',
            px: 0.5,
            top: 0,
            right: 0,
          }}
          onClick={(e) => {
            if (!scoutingFind) return
            e.stopPropagation()
            e.preventDefault()
            navigate &&
              navigate(
                makeSessionUrls({ sessionId: scoutingFind.sessionId, scoutingFindId: scoutingFind.scoutingFindId })
              )
          }}
        >
          <Stack direction="row" spacing={1}>
            {stateObjects.map((it, idx) => (
              <Box key={`stat$-${idx}`}>{it}</Box>
            ))}
          </Stack>
        </Box>
      )}
      <ListItemAvatar>
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
        primary={user?.scName}
        secondaryTypographyProps={{
          component: 'div',
        }}
        secondary={
          <Stack direction="row" spacing={1}>
            {secondaryText.length > 0
              ? secondaryText.map((it, idx) => (
                  <Typography key={`it-${idx}`} variant="caption" sx={{ fontSize: '0.65rem' }}>
                    {it}
                  </Typography>
                ))
              : null}
          </Stack>
        }
      />
      <ListItemSecondaryAction>
        {sessionUser.loadout && (
          <Tooltip title={`Vehicle Loadout: ${sessionUser.loadout?.name || 'None'}`} arrow>
            <IconButton
              color="primary"
              onClick={() => {
                openModalPopup && openModalPopup()
              }}
            >
              <ModuleIcon />
            </IconButton>
          </Tooltip>
        )}

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
