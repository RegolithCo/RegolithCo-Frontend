import * as React from 'react'

import { FormControl, InputLabel, MenuItem, Select, useTheme } from '@mui/material'
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
    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
      <InputLabel id="rockId">Rock Class</InputLabel>
      <Select
        fullWidth
        variant="outlined"
        labelId="rockId"
        size="small"
        value={value || ''}
        label="Rock Class"
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
    </FormControl>
  )
}
