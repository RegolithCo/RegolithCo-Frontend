import * as React from 'react'
import { MenuItem, Select, Tooltip, Typography } from '@mui/material'
import { SessionRoleEnum } from '@regolithco/common'
import { QuestionMark } from '@mui/icons-material'
import { SessionRoleColors, SessionRoleIcons, SessionRoleNames } from '../../lib/roles'

export interface SessionRoleChooserProps {
  value?: string | null
  disabled?: boolean
  onChange: (value: SessionRoleEnum | null) => void
}

export const SessionRoleChooser: React.FC<SessionRoleChooserProps> = ({ value, disabled, onChange }) => {
  const found = value && Object.values(SessionRoleEnum).find((role) => role === value)
  const roleName = found ? SessionRoleNames[found] : value
  const icon = found ? SessionRoleIcons[found] : null
  const color = found ? SessionRoleColors[found] : '#555555'

  if (disabled)
    return value ? (
      <RoleChooserItem roleName={roleName} icon={icon} color={SessionRoleColors[value as SessionRoleEnum]} />
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
        return <RoleChooserItem roleName={roleName} icon={icon} color={SessionRoleColors[value as SessionRoleEnum]} />
      }}
      onChange={(e) => onChange(e.target.value ? (e.target.value as SessionRoleEnum) : null)}
    >
      <MenuItem value="">
        <RoleChooserItem roleName="None" />
      </MenuItem>
      {Object.values(SessionRoleEnum).map((role, idx) => (
        <MenuItem
          value={role}
          key={idx}
          sx={{
            '& svg': {
              mr: 1,
            },
          }}
        >
          <RoleChooserItem
            roleName={SessionRoleNames[role]}
            icon={SessionRoleIcons[role]}
            color={SessionRoleColors[role]}
          />
        </MenuItem>
      ))}
    </Select>
  )
}

export const SessionRoleIconBadge: React.FC<{ role: SessionRoleEnum }> = ({ role }) => {
  return (
    <Tooltip title={SessionRoleNames[role] || role}>
      <>{SessionRoleIcons[role] || <QuestionMark />}</>
    </Tooltip>
  )
}

export const RoleChooserItem: React.FC<{ roleName?: string | null; icon?: React.ReactNode; color?: string }> = ({
  roleName,
  icon,
  color,
}) => {
  return (
    <Typography
      variant="overline"
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        '& svg': {
          mr: 1,
        },
        color: roleName && roleName.length > 0 ? color : '#555555',
      }}
    >
      {icon}
      {roleName || 'None'}
    </Typography>
  )
}
