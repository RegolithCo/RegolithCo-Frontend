import * as React from 'react'

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { getSystemName, SystemEnum } from '@regolithco/common'

export interface SystemChooserProps {
  value?: SystemEnum
  label?: string
  disallowNone?: boolean
  blankLabel?: string
  onChange: (choice: SystemEnum | null) => void
}

export const SystemChooser: React.FC<SystemChooserProps> = ({ onChange, label, value, blankLabel, disallowNone }) => {
  const fLabel = label || 'System'
  return (
    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
      <InputLabel id="sysId">{fLabel}</InputLabel>
      <Select
        fullWidth
        variant="outlined"
        labelId="sysId"
        value={value || ''}
        label={fLabel}
        onChange={(event) => {
          const newVal = event.target.value as SystemEnum | ''
          if (newVal === '') return onChange(null)
          onChange(newVal as SystemEnum)
        }}
      >
        {!disallowNone && (
          <MenuItem key={`systems-none`} value={''}>
            {blankLabel || 'All Systems'}
          </MenuItem>
        )}
        {Object.values(SystemEnum).map((refinery) => (
          <MenuItem key={`refinery-${refinery}`} value={refinery}>
            {getSystemName(refinery)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
