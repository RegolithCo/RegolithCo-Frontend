import * as React from 'react'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import { ActivityEnum, ScoutingFindTypeEnum, SessionSettings } from '@regolithco/common'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { PostAdd } from '@mui/icons-material'
import { Badge, FabProps, keyframes, useTheme } from '@mui/material'

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
  const defaultAction = sessionSettings?.activity
    ? actions.find((a) => a.activityId === sessionSettings?.activity)
    : null
  const locked: boolean = Boolean(sessionSettings?.lockedFields && sessionSettings?.lockedFields.includes('activity'))

  const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 transparent; }
  70% { box-shadow: 0 0 10px 10px  ${theme.palette.warning.light}44; }
  100% { box-shadow: 0 0 0 0 transparent; }
`

  return (
    <SpeedDial
      ariaLabel="Add scouting find"
      onClose={() => setOpen(false)}
      onOpen={!locked ? () => setOpen(true) : undefined}
      onClick={
        defaultAction
          ? () => {
              onClick && onClick(defaultAction.scoutingType)
              setOpen(false)
            }
          : undefined
      }
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
        '& .MuiBadge-badge': {
          right: 0,
          fontSize: 20,
          backgroundColor: 'transparent',
          bottom: 0,
        },
      }}
      icon={
        defaultAction ? (
          <Badge badgeContent={'+'} color="primary">
            {defaultAction?.icon}
          </Badge>
        ) : (
          <PostAdd color="inherit" />
        )
      }
    >
      {!locked &&
        actions
          .filter(({ activityId }, idx) => activityId !== defaultAction?.activityId && !locked)
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
