import React from 'react'
import { MenuItem, Select, Stack, Typography, useTheme } from '@mui/material'
import { SessionUser, MiningLoadout } from '@regolithco/common'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { Box } from '@mui/system'
dayjs.extend(relativeTime)

export interface LoadoutSelectPRops {
  onChange: (loadoutId: string | null) => void
  disabled?: boolean
  sessionUser: SessionUser
  loadouts: MiningLoadout[]
}

export const LoadoutSelect: React.FC<LoadoutSelectPRops> = ({ sessionUser, loadouts, onChange, disabled }) => {
  const theme = useTheme()

  return (
    <Select
      fullWidth
      disabled={disabled}
      value={sessionUser.loadout?.loadoutId || 'none'}
      renderValue={(value) => {
        if (disabled) return 'Choose a mining ship first'
        if (!value || value.length === 0 || value === 'none') return 'None'
        const loadout = loadouts.find((l) => l.loadoutId === value)
        if (!loadout) return 'None'
        return <LoadoutItem loadout={loadout} />
      }}
      onChange={(e) => {
        const loadoutId = e.target.value as string
        if (loadoutId === 'none') onChange(null)
        else onChange(loadoutId)
      }}
    >
      <MenuItem value="none">None</MenuItem>
      {loadouts.map((loadout) => (
        <MenuItem key={loadout.loadoutId} value={loadout.loadoutId}>
          <LoadoutItem loadout={loadout} />
        </MenuItem>
      ))}
    </Select>
  )
}

const LoadoutItem: React.FC<{ loadout: MiningLoadout }> = ({ loadout }) => {
  if (!loadout) return <>'None'</>
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="overline" color="text.secondary">
        {loadout.ship.toUpperCase()}
      </Typography>
      <Typography>{loadout.name}</Typography>
      <Box sx={{ flexGrow: 1 }} />
      <Typography variant="caption" color="text.secondary">
        {(loadout?.activeLasers || [])
          .reduce((acc, laser) => (laser?.laser ? [...acc, laser?.laser] : acc), [] as string[])
          .filter((a) => !!a)
          .join(' - ')}
      </Typography>
    </Stack>
  )
}
