import React, { useRef } from 'react'
import { ListItem, ListItemAvatar, ListItemText, Tooltip, Stack, Typography, useTheme, IconButton } from '@mui/material'
import {
  getSessionUserStateName,
  MiningLoadout,
  PendingUser,
  SessionRoleEnum,
  SessionUser,
  SessionUserStateEnum,
  ShipLookups,
  ShipRoleEnum,
  User,
  VehicleRoleEnum,
} from '@regolithco/common'
import { RocketLaunch } from '@mui/icons-material'
import { alpha } from '@mui/system'
import { SessionContext } from '../../../../context/session.context'
import { UserAvatar } from '../../../UserAvatar'
import { StateChip } from './StateChip'
import { fontFamilies } from '../../../../theme'
import { shipColorLookup } from '../../VehicleChooser'
import { AppContext } from '../../../../context/app.context'
import { useSessionUserContextMenu } from '../SessionUserContextMenu'
import { LookupsContext } from '../../../../context/lookupsContext'
import { SessionRoleIconBadge } from '../../SessionRoleChooser'
import { ShipRoleIconBadge } from '../../ShipRoleChooser'
import { ModuleIcon } from '../../../../icons'

export interface ActiveUserListItemProps {
  sessionUser: SessionUser
  // Crew gets a smaller row and less info
  isCrewDisplay?: boolean
  expandButton?: React.ReactNode
  expanded?: boolean
}

export const ActiveUserListItem: React.FC<ActiveUserListItemProps> = ({
  sessionUser,
  isCrewDisplay,
  expandButton,
  expanded,
}) => {
  const theme = useTheme()
  const listItemRef = useRef<HTMLLIElement>(null)
  const dataStore = React.useContext(LookupsContext)
  const { getSafeName, hideNames } = React.useContext(AppContext)
  const {
    session,
    // navigate,
    myUserProfile,
    scoutingAttendanceMap,
    openLoadoutModal,
    openActiveUserModal,
    captains,
    crewHierarchy,
  } = React.useContext(SessionContext)
  // const stateColorsBg = stateColorsBGThunk(theme)
  const isMe = myUserProfile.userId === sessionUser.ownerId
  const secondaryText: React.ReactNode[] = []
  const stateObjects: React.ReactNode[] = []
  const isOwner = sessionUser.ownerId === session?.ownerId
  const captain =
    sessionUser.captainId && crewHierarchy[sessionUser.captainId]
      ? captains.find((su) => su.ownerId === sessionUser.captainId)
      : undefined
  const isCaptain = !sessionUser.captainId || !crewHierarchy[sessionUser.captainId]
  // const crew = crewHierarchy[sessionUser.ownerId] || { activeIds: [], innactiveSCNames: [] }
  // const totalCrew = crew.activeIds.length + crew.innactiveSCNames.length + 1

  const { contextMenuNode, handleContextMenu } = useSessionUserContextMenu(sessionUser)

  if (!dataStore.ready) return null

  const shipLookups = dataStore.getLookup('shipLookups') as ShipLookups

  const scoutingFind = scoutingAttendanceMap.get(sessionUser.ownerId)
  const vehicle = sessionUser.vehicleCode ? shipLookups.find((s) => s.UEXID === sessionUser.vehicleCode) : null
  const finalVehicleName = vehicle && vehicle.name
  const vehicleColor = vehicle ? shipColorLookup(theme)[vehicle.role as VehicleRoleEnum] : 'inherit'

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
      if (!isCrewDisplay) secondaryText.push(`Crew of: ${getSafeName(captain.owner?.scName)}`)
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
    }
  }

  if (vehicle && (!isCrewDisplay || isCaptain)) {
    secondaryText.push(
      <Tooltip title={`${vehicle?.maker} ${vehicle?.name} (${vehicle?.role})`} arrow>
        <Typography
          sx={{
            // align all elements on the baseline
            color: vehicleColor,
            textTransform: 'uppercase',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            fontFamily: fontFamilies.robotoMono,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            maxWidth: '120px',
            textOverflow: 'ellipsis',
          }}
        >
          <RocketLaunch
            fontSize="small"
            sx={{
              fontSize: '1rem',
              position: 'relative',
              right: theme.spacing(0.5),
              top: theme.spacing(0.5),
            }}
          />
          {finalVehicleName}
        </Typography>
      </Tooltip>
    )
  }

  // const stateColor = stateColorsBg[sessionUser.state] || undefined

  if (!dataStore.ready) return <div>Loading...</div>
  return (
    <>
      {contextMenuNode}

      <ListItem
        ref={listItemRef}
        dense={isCrewDisplay && !isCaptain}
        disableGutters={isCrewDisplay && !isCaptain}
        onContextMenu={handleContextMenu}
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
          cursor: 'context-menu',
          overflow: 'hidden',
          pr: 1,
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
                backgroundColor: theme.palette.error.dark,
              }
            : {},
          '&.MuiListItem-root': {},
        }}
      >
        {expandButton}
        <StateChip userState={sessionUser.state} scoutingFind={scoutingFind} />
        <ListItemAvatar>
          <UserAvatar
            size={isCrewDisplay && !isCaptain ? 'small' : 'medium'}
            user={user}
            privacy={hideNames}
            sessionOwner={isOwner}
            isFriend={myUserProfile.friends?.includes(user?.scName as string)}
          />
        </ListItemAvatar>

        <ListItemText
          sx={{
            '& .MuiListItemText-secondary': {
              fontSize: '0.7rem',
            },
          }}
          primary={
            <Stack direction="row" spacing={0} justifyContent={'space-between'}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: isCrewDisplay && !isCaptain ? '0.7rem' : undefined,
                }}
              >
                {getSafeName(user?.scName)}
              </Typography>
              {sessionUser.loadout && isCaptain && (
                <Tooltip title={`LOADOUT: ${sessionUser.loadout?.name || 'None'}`} arrow placement="right-end">
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{
                      height: 24,
                      width: 24,
                      border: `1px solid ${theme.palette.primary.main}`,
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      openLoadoutModal(sessionUser.loadout as MiningLoadout)
                    }}
                  >
                    <ModuleIcon
                      sx={{
                        height: 16,
                        width: 16,
                      }}
                    />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          }
          secondaryTypographyProps={{
            component: 'div',
          }}
          secondary={
            <Stack direction="row" spacing={1}>
              {(!isCrewDisplay || isCaptain) && (
                <>
                  {secondaryText.length > 0 ? (
                    secondaryText.map((it, idx) => (
                      <Typography key={`it-${idx}`} variant="caption" sx={{ fontSize: '0.65rem' }}>
                        {it}
                      </Typography>
                    ))
                  ) : (
                    <Typography
                      sx={{
                        fontFamily: fontFamilies.robotoMono,
                        color: alpha(theme.palette.text.secondary, 0.3),
                        fontWeight: 'bold',
                        fontSize: isCrewDisplay && !isCaptain ? '0.5rem' : '0.7rem',
                      }}
                    >
                      Session User
                    </Typography>
                  )}
                </>
              )}
            </Stack>
          }
        />
        <UserListItemRoleIcons user={sessionUser} />
      </ListItem>
    </>
  )
}

export const UserListItemRoleIcons: React.FC<{ user: SessionUser | PendingUser }> = ({ user }) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        position: 'absolute',
        right: 5,
        bottom: 5,
      }}
    >
      <ShipRoleIconBadge
        key="shipRole"
        placeholder
        role={user.shipRole as ShipRoleEnum}
        sx={{
          fontSize: '1rem',
        }}
      />
      <SessionRoleIconBadge
        key="sessionRole"
        placeholder
        role={user.sessionRole as SessionRoleEnum}
        sx={{
          fontSize: '1rem',
        }}
      />
    </Stack>
  )
}
