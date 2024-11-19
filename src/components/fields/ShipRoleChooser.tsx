import * as React from 'react'
import { MenuItem, Select, SxProps, Theme, Tooltip, Typography } from '@mui/material'
import { ShipRoleEnum } from '@regolithco/common'
import { QuestionMark } from '@mui/icons-material'
import { RoleChooserItem } from './SessionRoleChooser'
import { ShipRoleColors, ShipRoleIcons, ShipRoleNames } from '../../lib/roles'

export interface ShipRoleChooserProps {
  value?: string | null
  disabled?: boolean
  onChange: (value: ShipRoleEnum | null) => void
}

export const shipRoleOptions = (onClick?: (value: string) => void): React.ReactNode[] => {
  return Object.values(ShipRoleEnum).map((role, idx) => {
    const RoleIcon = ShipRoleIcons[role]
    return (
      <MenuItem
        value={role}
        key={idx}
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

export const ShipRoleIconBadge: React.FC<{ role: ShipRoleEnum | string; sx?: SxProps<Theme> }> = ({ role, sx }) => {
  if (!role) return null
  const roleName = ShipRoleNames[role as ShipRoleEnum] || role
  const Icon = ShipRoleIcons[role] || QuestionMark
  const color = ShipRoleColors[role as ShipRoleEnum] || '#555555'
  return (
    <Tooltip title={`Session Role: ${roleName}`}>
      <Icon
        sx={{
          color: color,
          ...(sx || {}),
        }}
      />
    </Tooltip>
  )
}
