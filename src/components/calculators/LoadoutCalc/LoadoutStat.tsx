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
  modPercent: {
    fontSize: '0.6rem',
  },
  label: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: '0.6rem',
  },
})

export interface NumberStatProps {
  label: string
  value?: number
  modPercent?: number
  unit?: string
  reversed?: boolean
  isPercent?: boolean
  active?: boolean
  tooltip?: string
}

export const NumberStat: React.FC<NumberStatProps> = ({
  label,
  value,
  reversed,
  isPercent: percent,
  modPercent,
  active,
  unit,
  tooltip,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)

  const isNumeric = Boolean(typeof value === 'number')
  const valNum = isNumeric ? (value as number) : 0

  let color = theme.palette.text.primary
  if (isNumeric && valNum > 0) color = reversed ? theme.palette.error.main : theme.palette.success.main
  if (isNumeric && valNum < 0) color = reversed ? theme.palette.success.main : theme.palette.error.main

  let lightColor = theme.palette.text.primary
  if (isNumeric && valNum > 0) lightColor = reversed ? theme.palette.error.light : theme.palette.success.light
  if (isNumeric && valNum < 0) lightColor = reversed ? theme.palette.success.light : theme.palette.error.light

  let darkColor = theme.palette.text.primary
  if (isNumeric && valNum > 0) darkColor = reversed ? theme.palette.error.dark : theme.palette.success.dark
  if (isNumeric && valNum < 0) darkColor = reversed ? theme.palette.success.dark : theme.palette.error.dark

  const pulse = keyframes`
    0% { color: ${darkColor}; }
    50% { color: ${lightColor}; }
    100% { color: ${darkColor}; }
`
  const hasModPercent = Boolean(modPercent && Math.abs(modPercent) > 0.01)
  const modPercentNum = hasModPercent ? (modPercent as number) : 0
  const hasValue = Boolean(isNumeric && Math.abs(value || 0) > 0.01)

  return (
    <Tooltip title={tooltip || ''} placement="top">
      <Box
        sx={Object.assign({}, styles.container, {
          color: percent && hasValue ? color : null,
          fontWeight: isNumeric && active ? 'bold' : 'normal',
          animation: isNumeric && active ? `${pulse} 1s infinite ease` : '',
        })}
      >
        <Box sx={styles.number}>
          {!isNumeric && '--'}
          {isNumeric && percent && valNum > 0 ? '+' : ''}
          {isNumeric && percent && MValueFormatter(1 - valNum, MValueFormat.percent)}
          {isNumeric && !percent && MValueFormatter(valNum, MValueFormat.number)}
          {unit}
          {hasModPercent && (
            <Box sx={styles.modPercent}>
              ({modPercentNum > 0 ? '+' : ''}
              {MValueFormatter(1 - modPercentNum, MValueFormat.percent)})
            </Box>
          )}
        </Box>
        <Box sx={styles.label}>{label}</Box>
      </Box>
    </Tooltip>
  )
}
