import * as React from 'react'
import { MenuItem, Select, Tooltip, Typography } from '@mui/material'
import { ShipRoleEnum } from '@regolithco/common'
import { QuestionMark } from '@mui/icons-material'
import { RoleChooserItem } from './SessionRoleChooser'
import { ShipRoleColors, ShipRoleIcons, ShipRoleNames } from '../../lib/roles'

export interface ShipRoleChooserProps {
  value?: string | null
  disabled?: boolean
  onChange: (value: ShipRoleEnum | null) => void
}

export const ShipRoleChooser: React.FC<ShipRoleChooserProps> = ({ value, disabled, onChange }) => {
  if (disabled)
    return value ? (
      <RoleChooserItem
        roleName={ShipRoleNames[value as ShipRoleEnum] || value}
        icon={ShipRoleIcons[value as ShipRoleEnum]}
        color={ShipRoleColors[value as ShipRoleEnum]}
      />
    ) : (
      <RoleChooserItem />
    )
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
            <Typography variant="overline" color="text.secondary">
              Select
            </Typography>
          )
        return (
          <RoleChooserItem
            roleName={ShipRoleNames[value as ShipRoleEnum] || value}
            icon={ShipRoleIcons[value as ShipRoleEnum]}
            color={ShipRoleColors[value as ShipRoleEnum]}
          />
        )
      }}
      onChange={(e) => onChange(e.target.value ? (e.target.value as ShipRoleEnum) : null)}
    >
      <MenuItem value="">
        <RoleChooserItem />
      </MenuItem>
      {Object.values(ShipRoleEnum).map((role, idx) => (
        <MenuItem
          value={role}
          key={idx}
          sx={{
            '& svg': {
              mr: 1,
            },
            color: ShipRoleColors[role as ShipRoleEnum],
          }}
        >
          <RoleChooserItem
            roleName={ShipRoleNames[role as ShipRoleEnum] || role}
            icon={ShipRoleIcons[role as ShipRoleEnum]}
          />
        </MenuItem>
      ))}
    </Select>
  )
}

export const SessionRoleIconBadge: React.FC<{ role: ShipRoleEnum }> = ({ role }) => {
  return (
    <Tooltip title={ShipRoleNames[role] || role}>
      <>{ShipRoleIcons[role] || <QuestionMark />}</>
    </Tooltip>
  )
}
