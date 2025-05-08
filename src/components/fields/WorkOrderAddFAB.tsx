import * as React from 'react'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import { ActivityEnum, getActivityName, SessionSettings } from '@regolithco/common'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { AccountBalance, PostAdd } from '@mui/icons-material'
import { Badge, FabProps, keyframes, useTheme } from '@mui/material'

const actions = [
  {
    activityId: ActivityEnum.ShipMining,
    icon: <RockIcon />,
    name: `${getActivityName(ActivityEnum.ShipMining)}`,
  },
  {
    activityId: ActivityEnum.VehicleMining,
    icon: <GemIcon />,
    name: `${getActivityName(ActivityEnum.VehicleMining)}`,
  },
  { activityId: ActivityEnum.Salvage, icon: <ClawIcon />, name: `${getActivityName(ActivityEnum.Salvage)}` },
  { activityId: ActivityEnum.Other, icon: <AccountBalance />, name: `${getActivityName(ActivityEnum.Other)}` },
]

export interface WorkOrderAddFABProps {
  sessionSettings?: SessionSettings
  onClick?: (activityId: ActivityEnum) => void
  fabProps?: FabProps
}

export const WorkOrderAddFAB: React.FC<WorkOrderAddFABProps> = ({ sessionSettings, fabProps, onClick }) => {
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
      ariaLabel="Work order add"
      onClose={() => setOpen(false)}
      onOpen={!locked ? () => setOpen(true) : undefined}
      onClick={
        defaultAction
          ? () => {
              onClick && onClick(defaultAction.activityId)
              setOpen(false)
            }
          : undefined
      }
      open={!locked && open}
      FabProps={{
        color: 'secondary',
        ...fabProps,
      }}
      sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        borderRadius: 10,
        backgroundColor: open ? theme.palette.secondary.main : null,
        '& .MuiSpeedDialAction-staticTooltipLabel': {
          whiteSpace: 'nowrap',
          maxWidth: 'none',
        },
        '& .MuiFab-root': {
          animation: !fabProps?.disabled ? `${pulse} 2s infinite` : '',
          boxShadow: '0 0 0 0 transparent',
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
              key={action.activityId}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={() => {
                onClick && onClick(action.activityId)
                setOpen(false)
              }}
              color="primary"
            />
          ))}
    </SpeedDial>
  )
}
