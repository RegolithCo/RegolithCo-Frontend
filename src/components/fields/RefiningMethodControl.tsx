import React from 'react'
import { Select, MenuItem, Box } from '@mui/material'
import { RefineryMethodEnum, getRefineryMethodName } from '@regolithco/common'
import { fontFamilies } from '../../theme'

export interface RefineryMethodProps {
  value?: RefineryMethodEnum
  onChange: (method?: RefineryMethodEnum) => void
  disabled?: boolean
  settingsScreen?: boolean
  allowNone?: boolean
}

export const RefineryMethodControl: React.FC<RefineryMethodProps> = ({
  value,
  settingsScreen,
  disabled,
  onChange,
  allowNone,
}) => {
  if (disabled)
    return (
      <Box
        sx={
          !settingsScreen
            ? {
                textAlign: 'center',
                border: '1px solid #555',
                borderRadius: 2,
                my: 2,
                p: 1.5,
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
                fontSize: 20,
              }
            : {}
        }
      >
        {value ? getRefineryMethodName(value) : 'Refinery Method: UNKNOWN'}
      </Box>
    )
  return (
    <Select
      labelId="refineryMethod"
      id="refineryMethod"
      variant="standard"
      size="small"
      disabled={disabled}
      value={value ? value : allowNone ? '' : RefineryMethodEnum.DinyxSolventation}
      sx={
        !settingsScreen
          ? {
              color: 'inherit',
              fontFamily: fontFamilies.robotoMono,
              fontSize: 18,
              fontWeight: 'bold',
              '& .MuiSelect-select': {
                mx: 2,
                my: 1,
              },
            }
          : {}
      }
      label="Method"
      fullWidth
      onChange={(event) => {
        if (event.target.value === '') return onChange()
        onChange(event.target.value as RefineryMethodEnum)
      }}
    >
      {allowNone && (
        <MenuItem key={`method-none`} value={''}>
          None
        </MenuItem>
      )}
      {Object.values(RefineryMethodEnum).map((method) => (
        <MenuItem key={`method-${method}`} value={method}>
          {getRefineryMethodName(method)}
        </MenuItem>
      ))}
    </Select>
  )
}
