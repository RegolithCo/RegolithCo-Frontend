import * as React from 'react'
import { MenuItem, Select, SxProps, Theme, Tooltip, Typography } from '@mui/material'
import { SessionRoleEnum, ShipRoleEnum } from '@regolithco/common'
import { QuestionMark } from '@mui/icons-material'
import { SessionRoleColors, SessionRoleIcons, SessionRoleNames } from '../../lib/roles'

export interface SessionRoleChooserProps {
  value?: string | null
  disabled?: boolean
  onChange: (value: SessionRoleEnum | null) => void
}

export const sessionRoleOptions = (onClick?: (value: string) => void): React.ReactNode[] => {
  return Object.values(SessionRoleEnum).map((role, idx) => {
    const RoleIcon = SessionRoleIcons[role]
    return (
      <MenuItem
        value={role}
        key={idx}
        onClick={onClick ? () => onClick(role) : undefined}
        sx={{
          '& svg': {
            mr: 1,
          },
        }}
      >
        <RoleChooserItem roleName={SessionRoleNames[role]} icon={<RoleIcon />} color={SessionRoleColors[role]} />
      </MenuItem>
    )
  })
}

export const SessionRoleChooser: React.FC<SessionRoleChooserProps> = ({ value, disabled, onChange }) => {
  const found = value && Object.values(SessionRoleEnum).find((role) => role === value)
  const roleName = found ? SessionRoleNames[found] : value
  const Icon = found ? SessionRoleIcons[found] : QuestionMark
  const color = found ? SessionRoleColors[found] : '#555555'

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
            <Typography variant="overline" color="text.secondary">
              Select
            </Typography>
          )
        return <RoleChooserItem roleName={roleName} icon={<Icon />} color={color} />
      }}
      onChange={(e) => onChange(e.target.value ? (e.target.value as SessionRoleEnum) : null)}
    >
      <MenuItem value="">
        <RoleChooserItem roleName="None" />
      </MenuItem>
      {sessionRoleOptions()}
    </Select>
  )
}

export const SessionRoleIconBadge: React.FC<{ role: SessionRoleEnum | string; sx?: SxProps<Theme> }> = ({
  role,
  sx,
}) => {
  if (!role) return null
  const roleName = SessionRoleNames[role as SessionRoleEnum] || role
  const Icon = SessionRoleIcons[role] || QuestionMark
  const color = SessionRoleColors[role as SessionRoleEnum] || '#555555'
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

export const SessionRoleRenderItem: React.FC<{ role?: ShipRoleEnum | string }> = ({ role }) => {
  if (!role) return null
  const roleName = SessionRoleNames[role as SessionRoleEnum] || role
  const Icon = SessionRoleIcons[role] || QuestionMark
  const color = SessionRoleColors[role as SessionRoleEnum] || '#555555'
  return (
    <Typography
      variant="overline"
      sx={{
        display: 'flex',
        alignItems: 'center',
        '& svg': {
          mr: 1,
        },
        color: roleName && roleName.length > 0 ? color : '#555555',
      }}
    >
      {<Icon />}
      {roleName || 'None'}
    </Typography>
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
