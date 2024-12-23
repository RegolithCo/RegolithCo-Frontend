import * as React from 'react'

import { InputAdornment, MenuItem, Select, Typography, useTheme } from '@mui/material'
import {
  AsteroidTypeEnum,
  DepositTypeEnum,
  getAsteroidTypeName,
  getDepositTypeName,
  RockType,
} from '@regolithco/common'

export interface RockTypeChooserProps {
  value?: RockType | null
  onChange: (choice: RockType | null) => void
  filter?: 'asteroid' | 'deposit'
}

export const RockTypeChooser: React.FC<RockTypeChooserProps> = ({ onChange, value, filter }) => {
  const theme = useTheme()

  return (
    <Select
      fullWidth
      variant="standard"
      labelId="rockId"
      size="small"
      value={value || ''}
      label="Rock Class"
      // I need an adornment inside the select
      startAdornment={<InputAdornment position="start">Rock Class</InputAdornment>}
      // Now center the text inside the select
      sx={{
        '& .MuiSelect-select': {
          textAlign: 'center',
        },
        '& .MuiSelect-selectMenu': {
          textAlign: 'center',
        },
        '& .MuiSelect-select:focus': {
          backgroundColor: theme.palette.background.paper,
        },
      }}
      onChange={(event) => {
        const newVal = event.target.value
        if (newVal === '') return onChange(null)
        onChange(newVal as RockType)
      }}
    >
      <MenuItem key={`rocktype-none`} value={''}>
        None
      </MenuItem>
      {!filter && (
        <MenuItem key={`separator-1`} value={''} disabled>
          ASTEROID
        </MenuItem>
      )}
      {filter !== 'deposit' &&
        Object.values(AsteroidTypeEnum).map((asteroid, idx) => (
          <MenuItem key={`asteroid-${asteroid}-${idx}`} value={asteroid}>
            {getAsteroidTypeName(asteroid)}
          </MenuItem>
        ))}
      {!filter && (
        <MenuItem key={`separator-2`} value={''} disabled>
          SURFACE
        </MenuItem>
      )}
      {filter !== 'asteroid' &&
        Object.values(DepositTypeEnum).map((deposit, idx) => (
          <MenuItem key={`deposit-${deposit}-${idx}`} value={deposit}>
            {getDepositTypeName(deposit)}
          </MenuItem>
        ))}
    </Select>
  )
}
