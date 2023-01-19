import * as React from 'react'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import { ActivityEnum, getActivityName, SessionSettings } from '@orgminer/common'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { PostAdd, QuestionMark } from '@mui/icons-material'
import { Badge, Fab, FabProps, useTheme } from '@mui/material'

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
  { activityId: ActivityEnum.Other, icon: <QuestionMark />, name: `${getActivityName(ActivityEnum.Other)}` },
]

export interface WorkOrderAddFABProps {
  sessionSettings?: SessionSettings
  onClick?: (activityId: ActivityEnum) => void
  fabProps?: FabProps
}

export const WorkOrderAddFAB: React.FC<WorkOrderAddFABProps> = ({ sessionSettings, fabProps, onClick }) => {
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const locked = actions.map(({ activityId }) => {
    return sessionSettings && sessionSettings.activity && sessionSettings.activity !== activityId
  })
  // If there's only one action unlocked then just return a normal fab
  if (locked.filter((l) => !l).length === 1) {
    const action = actions.find((a, idx) => !locked[idx])
    if (!action) return null
    return (
      <Fab
        color="primary"
        onClick={() => {
          onClick && onClick(action.activityId)
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
      ariaLabel="Work order add"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      FabProps={{
        color: 'primary',
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
      }}
      icon={<PostAdd color="inherit" />}
    >
      {actions
        .filter((_, idx) => !locked[idx])
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
