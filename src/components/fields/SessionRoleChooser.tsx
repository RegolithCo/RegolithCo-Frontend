import * as React from 'react'
import { Box, MenuItem, Select, SxProps, Theme, Tooltip, Typography } from '@mui/material'
import { SessionRoleEnum, ShipRoleEnum } from '@regolithco/common'
import { CheckBoxOutlineBlank, QuestionMark } from '@mui/icons-material'
import { RoleIconType, SessionRoleColors, SessionRoleIcons, SessionRoleNames } from '../../lib/roles'
import { isUndefined } from 'lodash'

export interface SessionRoleChooserProps {
  value?: string | null
  disabled?: boolean
  onChange: (value: SessionRoleEnum | null) => void
}
export type SessionRoleCounts = Record<SessionRoleEnum, number>
export const sessionRoleOptions = (
  counts?: SessionRoleCounts,
  disableZeroCount?: boolean,
  onClick?: (value: string) => void
): React.ReactNode[] => {
  return Object.keys(SessionRoleNames).map((role, idx) => {
    const RoleIcon = SessionRoleIcons[role]
    const count = counts && counts[role]
    return (
      <MenuItem
        value={role}
        key={idx}
        disabled={disableZeroCount && !count}
        onClick={onClick ? () => onClick(role) : undefined}
        sx={{
          '& svg': {
            mr: 1,
          },
        }}
      >
        <RoleChooserItem
          roleName={SessionRoleNames[role]}
          count={count}
          icon={<RoleIcon />}
          color={SessionRoleColors[role]}
        />
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

export const RoleIconBadgeTooltip: React.FC<{
  title: string
  roleName: string
  color: string
  Icon?: RoleIconType
  children: React.ReactElement
}> = ({ title, roleName, color, Icon, children }) => {
  return (
    <Tooltip
      title={
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="overline" color="text.secondary">
            {title}
          </Typography>
          {Icon && <Icon sx={{ color: color, height: 40, width: 40 }} />}
          <Typography
            variant="overline"
            sx={{
              color: color,
            }}
          >
            {roleName}
          </Typography>
        </Box>
      }
    >
      {children}
    </Tooltip>
  )
}

export const SessionRoleIconBadge: React.FC<{
  role: SessionRoleEnum | string
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
  const roleName = SessionRoleNames[role as SessionRoleEnum] || role
  const Icon = SessionRoleIcons[role] || QuestionMark
  const color = SessionRoleColors[role as SessionRoleEnum] || '#555555'
  return (
    <RoleIconBadgeTooltip title={'Session Role'} roleName={roleName} color={color} Icon={Icon}>
      <Icon
        sx={{
          color: color,
          ...(sx || {}),
        }}
      />
    </RoleIconBadgeTooltip>
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

export const RoleChooserItem: React.FC<{
  roleName?: string | null
  count?: number
  icon?: React.ReactNode
  color?: string
}> = ({ roleName, icon, count, color }) => {
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
      {!isUndefined(count) && count > -1 ? ` (${count}) ` : ''}
    </Typography>
  )
}
