import * as React from 'react'
import { MenuItem, Select, SxProps, Theme, Typography } from '@mui/material'
import { ShipRoleEnum } from '@regolithco/common'
import { CheckBoxOutlineBlank, QuestionMark } from '@mui/icons-material'
import { RoleChooserItem, RoleIconBadgeTooltip } from './SessionRoleChooser'
import { ShipRoleColors, ShipRoleIcons, ShipRoleNames } from '../../lib/roles'

export interface ShipRoleChooserProps {
  value?: string | null
  disabled?: boolean
  onChange: (value: ShipRoleEnum | null) => void
}
export type ShipRoleCounts = Record<ShipRoleEnum, number>
export const shipRoleOptions = (
  counts?: ShipRoleCounts,
  disableZeroCount?: boolean,
  onClick?: (value: string) => void
): React.ReactNode[] => {
  return Object.values(ShipRoleEnum).map((role, idx) => {
    const RoleIcon = ShipRoleIcons[role]
    const count = counts && counts[role]
    return (
      <MenuItem
        value={role}
        key={idx}
        disabled={disableZeroCount && count === 0}
        onClick={onClick ? () => onClick(role) : undefined}
        sx={{
          '& svg': {
            mr: 1,
          },
          color: ShipRoleColors[role as ShipRoleEnum],
        }}
      >
        <RoleChooserItem
          roleName={ShipRoleNames[role as ShipRoleEnum] || role}
          count={count}
          icon={<RoleIcon />}
          color={ShipRoleColors[role]}
        />
      </MenuItem>
    )
  })
}

export const ShipRoleChooser: React.FC<ShipRoleChooserProps> = ({ value, disabled, onChange }) => {
  const found = value && Object.values(ShipRoleEnum).find((role) => role === value)
  const roleName = found ? ShipRoleNames[found] : value
  const Icon = found ? ShipRoleIcons[found] : QuestionMark
  const color = found ? ShipRoleColors[found] : '#555555'

  if (disabled)
    return value ? <RoleChooserItem roleName={roleName} icon={<Icon />} color={color} /> : <RoleChooserItem />
  return (
    <Select
      value={value || ''}
      size="small"
      fullWidth
      variant="outlined"
      displayEmpty
      disabled={disabled}
      renderValue={(value) => {
        if (!value)
          return (
            <Typography variant="overline" color="text">
              Select
            </Typography>
          )
        return <RoleChooserItem roleName={roleName} icon={<Icon />} color={color} />
      }}
      onChange={(e) => onChange(e.target.value ? (e.target.value as ShipRoleEnum) : null)}
    >
      <MenuItem value="">
        <RoleChooserItem roleName="None" />
      </MenuItem>
      {shipRoleOptions()}
    </Select>
  )
}

export const ShipRoleIconBadge: React.FC<{
  role: ShipRoleEnum | string
  sx?: SxProps<Theme>
  placeholder?: boolean
}> = ({ role, sx, placeholder }) => {
  if (!role) {
    if (placeholder)
      return (
        <CheckBoxOutlineBlank
          sx={{
            opacity: 0,
          }}
        />
      )
    return null
  }
  const roleName = ShipRoleNames[role as ShipRoleEnum] || role
  const Icon = ShipRoleIcons[role] || QuestionMark
  const color = ShipRoleColors[role as ShipRoleEnum] || '#555555'
  return (
    <RoleIconBadgeTooltip title={'Ship Role'} roleName={roleName} color={color} Icon={Icon}>
      <Icon
        sx={{
          color: color,
          ...(sx || {}),
        }}
      />
    </RoleIconBadgeTooltip>
  )
}
