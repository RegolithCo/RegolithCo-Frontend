import React, { useEffect } from 'react'
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
  MiningLoadout,
  SessionUser,
  SessionUserStateEnum,
  User,
} from '@regolithco/common'
import { MoreVert } from '@mui/icons-material'
import { alpha, Box, useTheme } from '@mui/system'
import { SessionContext } from '../../../../context/session.context'
import { makeSessionUrls } from '../../../../lib/routingUrls'
import { UserAvatar } from '../../../UserAvatar'
import { fontFamilies } from '../../../../theme'
import { ModuleIcon } from '../../../../icons'

export interface SoloActiveProps {
  sessionUser: SessionUser
  openContextMenu: (e: HTMLElement) => void
}

export const SoloActive: React.FC<SoloActiveProps> = ({ sessionUser, openContextMenu }) => {
  const theme = useTheme()
  const { session, navigate, myUserProfile, scoutingAttendanceMap, openLoadoutModal, openActiveUserModal, captains } =
    React.useContext(SessionContext)
  const isMe = myUserProfile.userId === sessionUser.ownerId
  const secondaryText = []
  const stateObjects = []
  const isOwner = sessionUser.ownerId === session.ownerId
  const captain = sessionUser.captainId ? captains.find((su) => su.ownerId === sessionUser.captainId) : undefined
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

  const scoutingFind = scoutingAttendanceMap.get(sessionUser.ownerId)

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
    <>
      <ListItem
        onContextMenu={(e) => {
          e.preventDefault()
          openContextMenu(e.currentTarget)
        }}
        onDoubleClick={(e) => {
          e.preventDefault()
          openActiveUserModal(sessionUser.ownerId)
        }}
        onClick={() => {
          openActiveUserModal(sessionUser.ownerId)
        }}
        sx={{
          background: stateColor && alpha(stateColor, 0.1),
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
            isFriend={myUserProfile.friends?.includes(user?.scName as string)}
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
                  openLoadoutModal(sessionUser.loadout as MiningLoadout)
                }}
              >
                <ModuleIcon />
              </IconButton>
            </Tooltip>
          )}

          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation()
              openContextMenu(e.currentTarget)
            }}
          >
            <MoreVert />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </>
  )
}
