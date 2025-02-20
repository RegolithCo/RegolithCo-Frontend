import React from 'react'
import { Select, MenuItem, Box, useTheme } from '@mui/material'
import { RefineryEnum, SystemEnum, SystemRefineries, getRefineryName, getSystemName } from '@regolithco/common'
import { fontFamilies } from '../../theme'

export interface RefineryControlProps {
  value?: RefineryEnum
  onChange: (refinery?: RefineryEnum) => void
  settingsScreen?: boolean
  filterToSystem?: SystemEnum | null
  disabled?: boolean
  allowNone?: boolean
}

const DISABLE_LIST: RefineryEnum[] = []

export const RefineryControl: React.FC<RefineryControlProps> = ({
  value,
  settingsScreen,
  disabled,
  filterToSystem,
  onChange,
  allowNone,
}) => {
  const theme = useTheme()
  const missingItem = value && filterToSystem && !SystemRefineries[filterToSystem].includes(value as RefineryEnum)
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
        <MenuItem key={`refinery-none`} value={''}>
          None
        </MenuItem>
      )}
      {missingItem && (
        <MenuItem key={`refinery-${value}`} value={value}>
          {getRefineryName(value as RefineryEnum)}
        </MenuItem>
      )}
      {filterToSystem
        ? SystemRefineries[filterToSystem]
            .filter((refinery) => !DISABLE_LIST.includes(refinery))
            .map((refinery) => (
              <MenuItem key={`refinery-${refinery}`} value={refinery}>
                {getRefineryName(refinery)}
              </MenuItem>
            ))
        : Object.entries(SystemRefineries).reduce((acc, [system, refineries]) => {
            // Push an unselectable system header
            acc.push(
              <MenuItem
                key={`system-${system}`}
                disabled
                sx={{
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                }}
              >
                {getSystemName(system as SystemEnum)}
              </MenuItem>
            )
            refineries.forEach((refinery) => {
              acc.push(
                <MenuItem key={`refinery-${refinery}`} value={refinery}>
                  {getRefineryName(refinery)}
                </MenuItem>
              )
            })
            return acc
          }, [] as JSX.Element[])}
    </Select>
  )
}
