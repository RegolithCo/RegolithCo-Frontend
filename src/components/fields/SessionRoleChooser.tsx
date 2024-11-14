import * as React from 'react'
import { MenuItem, Select, Tooltip, Typography } from '@mui/material'
import { ObjectValues } from '@regolithco/common'
import { Engineering, LocalPolice, LocalShipping, ManageAccounts, Support, TravelExplore } from '@mui/icons-material'

export interface SessionRoleChooserProps {
  value: SessionRoleEnum | ''
  disabled?: boolean
  onChange: (value: SessionRoleEnum | null) => void
}

export const SessionRoleEnum = {
  Manager: 'MANAGER',
  Scout: 'SCOUT',
  Medical: 'MEDICAL',
  Security: 'SECURITY',
  Logistics: 'LOGISTICS',
  Transport: 'TRANSPORT',
} as const
export type SessionRoleEnum = ObjectValues<typeof SessionRoleEnum>

export const SessionRoleNames: Record<SessionRoleEnum, string> = {
  [SessionRoleEnum.Manager]: 'Manager',
  [SessionRoleEnum.Scout]: 'Surveyor / Scout',
  [SessionRoleEnum.Medical]: 'Medical & Rescue',
  [SessionRoleEnum.Security]: 'Security',
  [SessionRoleEnum.Logistics]: 'Logistics & Support',
  [SessionRoleEnum.Transport]: 'Transport',
}

export const SessionRoleIcons: Record<SessionRoleEnum, React.ReactNode> = {
  [SessionRoleEnum.Manager]: <ManageAccounts />,
  [SessionRoleEnum.Scout]: <TravelExplore />,
  [SessionRoleEnum.Medical]: <Support />,
  [SessionRoleEnum.Security]: <LocalPolice />,
  [SessionRoleEnum.Logistics]: <Engineering />,
  [SessionRoleEnum.Transport]: <LocalShipping />,
}
export const SessionRoleColors: Record<SessionRoleEnum, string> = {
  [SessionRoleEnum.Manager]: '#ff0',
  [SessionRoleEnum.Scout]: '#0f0',
  [SessionRoleEnum.Medical]: '#0ff',
  [SessionRoleEnum.Security]: '#f00',
  [SessionRoleEnum.Logistics]: '#ccc',
  [SessionRoleEnum.Transport]: '#f0f',
}

export const SessionRoleChooser: React.FC<SessionRoleChooserProps> = ({ value, disabled, onChange }) => {
  if (disabled)
    return value ? (
      <RoleChooserItem
        roleName={SessionRoleNames[value as SessionRoleEnum]}
        icon={SessionRoleIcons[value as SessionRoleEnum]}
        color={SessionRoleColors[value as SessionRoleEnum]}
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
            roleName={SessionRoleNames[value as SessionRoleEnum]}
            icon={SessionRoleIcons[value as SessionRoleEnum]}
            color={SessionRoleColors[value as SessionRoleEnum]}
          />
        )
      }}
      onChange={(e) => onChange(e.target.value ? (e.target.value as SessionRoleEnum) : null)}
    >
      <MenuItem value="">
        <RoleChooserItem roleName="" />
      </MenuItem>
      {Object.values(SessionRoleEnum).map((role, idx) => (
        <MenuItem
          value={role}
          key={idx}
          sx={{
            '& svg': {
              mr: 1,
            },
            color: SessionRoleColors[role as SessionRoleEnum],
          }}
        >
          <RoleChooserItem
            roleName={SessionRoleNames[role as SessionRoleEnum]}
            icon={SessionRoleIcons[role as SessionRoleEnum]}
          />
        </MenuItem>
      ))}
    </Select>
  )
}

export const SessionRoleIconBadge: React.FC<{ role: SessionRoleEnum }> = ({ role }) => {
  return (
    <Tooltip title={SessionRoleNames[role]}>
      <>{SessionRoleIcons[role]}</>
    </Tooltip>
  )
}

export const RoleChooserItem: React.FC<{ roleName?: string; icon?: React.ReactNode; color?: string }> = ({
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
