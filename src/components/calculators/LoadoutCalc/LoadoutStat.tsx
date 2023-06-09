import React from 'react'
import { Box, SxProps, Theme, Tooltip, keyframes, useTheme } from '@mui/material'
import { fontFamilies } from '../../../theme'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  container: {
    fontFamily: fontFamilies.robotoMono,
    p: 1,
  },
  number: {
    textAlign: 'center',
    fontSize: '1rem',
  },
  label: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: '0.4rem',
  },
})

export interface NumberStatProps {
  label: string
  value?: number
  unit?: string
  reversed?: boolean
  percent?: boolean
  active?: boolean
  tooltip?: string
}

export const NumberStat: React.FC<NumberStatProps> = ({ label, value, reversed, percent, active, unit, tooltip }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)

  const isNumeric = typeof value === 'number'

  let color = theme.palette.text.primary
  if (isNumeric && value > 0) color = reversed ? theme.palette.error.main : theme.palette.success.main
  if (isNumeric && value < 0) color = reversed ? theme.palette.success.main : theme.palette.error.main

  let lightColor = theme.palette.text.primary
  if (isNumeric && value > 0) lightColor = reversed ? theme.palette.error.light : theme.palette.success.light
  if (isNumeric && value < 0) lightColor = reversed ? theme.palette.success.light : theme.palette.error.light

  let darkColor = theme.palette.text.primary
  if (isNumeric && value > 0) darkColor = reversed ? theme.palette.error.dark : theme.palette.success.dark
  if (isNumeric && value < 0) darkColor = reversed ? theme.palette.success.dark : theme.palette.error.dark

  const pulse = keyframes`
    0% { color: ${darkColor}; }
    50% { color: ${lightColor}; }
    100% { color: ${darkColor}; }
`

  return (
    <Tooltip title={tooltip || ''} placement="top">
      <Box
        sx={Object.assign({}, styles.container, {
          color: percent && Math.abs(value || 0) > 0.01 ? color : null,
          fontWeight: isNumeric && active ? 'bold' : 'normal',
          animation: isNumeric && active ? `${pulse} 1s infinite ease` : '',
        })}
      >
        <Box sx={styles.number}>
          {!isNumeric && '--'}
          {isNumeric && percent && value > 0 ? '+' : ''}
          {isNumeric && percent && MValueFormatter(1 - value, MValueFormat.percent)}
          {isNumeric && !percent && MValueFormatter(value, MValueFormat.number)}
          {unit}
        </Box>
        <Box sx={styles.label}>{label}</Box>
      </Box>
    </Tooltip>
  )
}
