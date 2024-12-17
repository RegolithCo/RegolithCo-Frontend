import * as React from 'react'

import { FormControl, InputLabel, MenuItem, Select, useTheme } from '@mui/material'
import { getSystemName, SystemEnum } from '@regolithco/common'

export interface SystemChooserProps {
  value?: SystemEnum
  onChange: (choice: SystemEnum | null) => void
}

export const SystemChooser: React.FC<SystemChooserProps> = ({ onChange, value }) => {
  const theme = useTheme()

  return (
    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
      <InputLabel id="sysId">System</InputLabel>
      <Select
        fullWidth
        variant="outlined"
        labelId="sysId"
        disableUnderline
        value={value || ''}
        label="System"
        onChange={(event) => {
          const newVal = event.target.value
          if (newVal === '') return onChange(null)
          onChange(newVal as SystemEnum)
        }}
      >
        <MenuItem key={`systems-none`} value={''}>
          All Systems
        </MenuItem>
        {Object.values(SystemEnum).map((refinery) => (
          <MenuItem key={`refinery-${refinery}`} value={refinery}>
            {getSystemName(refinery)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
