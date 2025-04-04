import * as React from 'react'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import { ActivityEnum, ScoutingFindTypeEnum, SessionSettings } from '@regolithco/common'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { TravelExplore } from '@mui/icons-material'
import { Badge, Fab, FabProps, keyframes, useTheme } from '@mui/material'

const actions = [
  {
    activityId: ActivityEnum.ShipMining,
    scoutingType: ScoutingFindTypeEnum.Ship,
    icon: <RockIcon />,
    name: `Ship Mining Cluster`,
  },
  {
    activityId: ActivityEnum.VehicleMining,
    scoutingType: ScoutingFindTypeEnum.Vehicle,
    icon: <GemIcon />,
    name: `ROC/FPS Mining Cluster`,
  },
  {
    activityId: ActivityEnum.Salvage,
    scoutingType: ScoutingFindTypeEnum.Salvage,
    icon: <ClawIcon />,
    name: `Salvage Wreck(s)`,
  },
]

export interface ScoutingAddFABProps {
  sessionSettings?: SessionSettings
  onClick?: (scoutingType: ScoutingFindTypeEnum) => void
  fabProps?: FabProps
}

export const ScoutingAddFAB: React.FC<ScoutingAddFABProps> = ({ sessionSettings, onClick, fabProps }) => {
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const locked = actions.map(({ activityId }) => {
    return sessionSettings && sessionSettings.activity && sessionSettings.activity !== activityId
  })

  const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 transparent; }
  70% { box-shadow: 0 0 10px 10px  ${theme.palette.warning.light}44; }
  100% { box-shadow: 0 0 0 0 transparent; }
`

  // If there's only one action unlocked then just return a normal fab
  if (locked.filter((l) => !l).length === 1) {
    const action = actions.find((a, idx) => !locked[idx])
    if (!action) return null
    return (
      <Fab
        color="secondary"
        onClick={() => {
          onClick && onClick(action.scoutingType)
          setOpen(false)
        }}
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          '& .MuiBadge-badge': {
            right: 0,
            fontSize: 20,
            backgroundColor: 'transparent',
            bottom: 0,
          },
          boxShadow: '0 0 0 0 transparent',
          animation: !fabProps?.disabled ? `${pulse} 2s infinite` : '',
        }}
        {...(fabProps || {})}
      >
        <Badge badgeContent={'+'} color="primary">
          {action?.icon}
        </Badge>
      </Fab>
    )
  }

  return (
    <SpeedDial
      ariaLabel="Add scouting find"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      FabProps={{
        color: 'secondary',
        ...fabProps,
      }}
      sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        borderRadius: 10,
        backgroundColor: open ? theme.palette.primary.main : null,
        '& .MuiSpeedDialAction-staticTooltipLabel': {
          whiteSpace: 'nowrap',
          maxWidth: 'none',
        },
        '& .MuiFab-root': {
          boxShadow: '0 0 0 0 transparent',
          animation: !fabProps?.disabled ? `${pulse} 2s infinite` : '',
        },
      }}
      icon={<TravelExplore color="inherit" />}
    >
      {actions
        .filter((_, idx) => !locked[idx])
        .map((action) => (
          <SpeedDialAction
            key={action.scoutingType}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={() => {
              onClick && onClick(action.scoutingType)
              setOpen(false)
            }}
            color="primary"
          />
        ))}
    </SpeedDial>
  )
}
