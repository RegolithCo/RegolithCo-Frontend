import React from 'react'
import { Select, MenuItem, Box } from '@mui/material'
import { RefineryEnum, getRefineryName } from '@regolithco/common'
import { fontFamilies } from '../../theme'

export interface RefineryControlProps {
  value?: RefineryEnum
  onChange: (refinery?: RefineryEnum) => void
  settingsScreen?: boolean
  disabled?: boolean
  allowNone?: boolean
}

export const RefineryControl: React.FC<RefineryControlProps> = ({
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
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
                lineHeight: 1,
                fontSize: {
                  xs: '0.8rem',
                  md: '0.9rem',
                  lg: '1rem',
                },
              }
            : {}
        }
      >
        {value ? getRefineryName(value) : 'Refinery'}
      </Box>
    )
  return (
    <Select
      labelId="refineryChoice"
      id="refineryChoice"
      variant="standard"
      disableUnderline
      disabled={disabled}
      value={value ? value : allowNone ? '' : RefineryEnum.Arcl1}
      sx={
        !settingsScreen
          ? {
              p: 0,
              color: 'inherit',
              fontFamily: fontFamilies.robotoMono,
              fontWeight: 'bold',
              borderBottom: '1px solid',
              '&.MuiInput-root::before': {
                borderBottom: 'none',
              },
              '& input': {
                p: 0,
                m: 0,
              },
              '& .MuiSvgIcon-root': {
                color: 'inherit',
              },
              '& .MuiSelect-select': {
                color: 'inherit',
                lineHeight: 1,
                fontSize: {
                  xs: '0.8rem',
                  md: '0.9rem',
                  lg: '1rem',
                },
                mx: 1,
                my: 0,
                p: 0,
              },
            }
          : {}
      }
      label="Refinery"
      fullWidth
      onChange={(event) => {
        const newVal = event.target.value
        if (allowNone && newVal === '') return onChange()
        onChange(newVal as RefineryEnum)
      }}
    >
      {allowNone && (
        <MenuItem key={`refinery-none`} value={'NONE'}>
          None
        </MenuItem>
      )}
      {Object.values(RefineryEnum).map((refinery) => (
        <MenuItem key={`refinery-${refinery}`} value={refinery}>
          {getRefineryName(refinery)}
        </MenuItem>
      ))}
    </Select>
  )
}
