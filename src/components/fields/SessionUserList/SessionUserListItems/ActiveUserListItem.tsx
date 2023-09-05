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
import { alpha, useTheme } from '@mui/system'
import { SessionContext } from '../../../../context/session.context'
import { UserAvatar } from '../../../UserAvatar'
import { ModuleIcon } from '../../../../icons'
import { StateChip, stateColorsBGThunk } from './StateChip'
import { fontFamilies } from '../../../../theme'

export interface ActiveUserListItemProps {
  sessionUser: SessionUser
  // Crew gets a smaller row and less info
  isCrewDisplay?: boolean
  openContextMenu: (e: HTMLElement) => void
}

export const ActiveUserListItem: React.FC<ActiveUserListItemProps> = ({
  sessionUser,
  isCrewDisplay,
  openContextMenu,
}) => {
  const theme = useTheme()
  const {
    session,
    navigate,
    myUserProfile,
    scoutingAttendanceMap,
    openLoadoutModal,
    openActiveUserModal,
    captains,
    crewHierarchy,
  } = React.useContext(SessionContext)
  const stateColorsBg = stateColorsBGThunk(theme)
  const isMe = myUserProfile.userId === sessionUser.ownerId
  const secondaryText = []
  const stateObjects = []
  const isOwner = sessionUser.ownerId === session?.ownerId
  const captain = sessionUser.captainId ? captains.find((su) => su.ownerId === sessionUser.captainId) : undefined
  const isCaptain = !sessionUser.captainId
  const crew = crewHierarchy[sessionUser.ownerId] || { activeIds: [], innactiveSCNames: [] }
  const totalCrew = crew.activeIds.length + crew.innactiveSCNames.length
  // const menuRef = useRef<HTMLLIElement>()

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
  const vehicle = sessionUser.vehicleCode ? lookups.shipLookups.find((s) => s.code === sessionUser.vehicleCode) : null

  const user = sessionUser.owner as User
  if (sessionUser) {
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
      if (!isCrewDisplay) secondaryText.push(`Crew of: ${captain.owner?.scName}`)
      else
        secondaryText.push(
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              textTransform: 'uppercase',
              fontSize: '0.6rem',
              fontWeight: 'bold',
              fontFamily: fontFamilies.robotoMono,
            }}
          >
            Crew
          </Typography>
        )
    } else if (isCrewDisplay)
      secondaryText.push(
        <Typography
          sx={{
            color: theme.palette.secondary.light,
            textTransform: 'uppercase',
            fontSize: '0.6rem',
            fontWeight: 'bold',
            fontFamily: fontFamilies.robotoMono,
          }}
        >
          {totalCrew} {totalCrew === 1 ? 'Crew Member' : 'Crew Members'}
        </Typography>
      )
  }
  const stateColor = stateColorsBg[sessionUser.state] || undefined

  return (
    <ListItem
      dense={isCrewDisplay && !isCaptain}
      disableGutters={isCrewDisplay && !isCaptain}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        openContextMenu(e.currentTarget)
      }}
      onDoubleClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        openActiveUserModal(sessionUser.ownerId)
      }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        openActiveUserModal(sessionUser.ownerId)
      }}
      sx={{
        background: stateColor && alpha(stateColor, 0.1),
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        '&::after': isMe
          ? {
              content: '""',
              display: 'block',
              top: -10,
              left: -10,
              position: 'absolute',
              width: 20,
              height: 20,
              transform: 'rotate(45deg)',
              backgroundColor: theme.palette.secondary.light,
            }
          : {},
        '&.MuiListItem-root': {},
      }}
    >
      <StateChip userState={sessionUser.state} scoutingFind={scoutingFind} vehicleName={vehicle?.name} />
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
        {sessionUser.loadout && !isCrewDisplay && (
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
          color="default"
          onClick={(e) => {
            e.stopPropagation()
            openContextMenu(e.currentTarget)
          }}
        >
          <MoreVert />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
