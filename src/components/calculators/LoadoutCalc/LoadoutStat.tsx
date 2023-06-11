import React from 'react'
import { Box, SxProps, Theme, Tooltip, keyframes, useTheme } from '@mui/material'
import { fontFamilies } from '../../../theme'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'

const stylesThunk = (theme: Theme, isBig?: boolean): Record<string, SxProps<Theme>> => ({
  container: {
    fontFamily: fontFamilies.robotoMono,
    minWidth: isBig ? '6rem' : '5rem',
    p: 1,
  },
  number: {
    textAlign: 'center',
    fontSize: isBig ? '1.4rem' : '0.9',
  },
  modPercent: {
    fontSize: '0.6rem',
  },
  label: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: isBig ? '0.8rem' : '0.6rem',
  },
})

export interface LoadoutStatProps {
  label: string
  isBig?: boolean
  value?: number
  modPercent?: number
  unit?: string
  reversed?: boolean
  isPercent?: boolean
  active?: boolean
  tooltip?: string
}

export const LoadoutStat: React.FC<LoadoutStatProps> = ({
  label,
  isBig,
  value,
  reversed,
  isPercent,
  modPercent,
  active,
  unit,
  tooltip,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme, isBig)

  const isNumeric = Boolean(typeof value === 'number')
  const valNum = isNumeric ? (value as number) : 0

  const hasValue = Boolean(isNumeric && Math.abs(valNum || 0) > 0.001)
  const finalVal = isPercent && hasValue ? valNum - 1 : valNum

  let color = theme.palette.text.primary
  if (isNumeric && finalVal > 0) color = reversed ? theme.palette.error.main : theme.palette.success.main
  if (isNumeric && finalVal < 0) color = reversed ? theme.palette.success.main : theme.palette.error.main

  let lightColor = theme.palette.text.primary
  if (isNumeric && finalVal > 0) lightColor = reversed ? theme.palette.error.light : theme.palette.success.light
  if (isNumeric && finalVal < 0) lightColor = reversed ? theme.palette.success.light : theme.palette.error.light

  let darkColor = theme.palette.text.primary
  if (isNumeric && finalVal > 0) darkColor = reversed ? theme.palette.error.dark : theme.palette.success.dark
  if (isNumeric && finalVal < 0) darkColor = reversed ? theme.palette.success.dark : theme.palette.error.dark

  const pulse = keyframes`
    0% { color: ${darkColor}; }
    50% { color: ${lightColor}; }
    100% { color: ${darkColor}; }
`
  const finalModPercent = (modPercent || 1) - 1
  const hasModPercent = Boolean(finalModPercent)

  if (finalModPercent !== 0) {
    color = finalModPercent > 0 ? theme.palette.success.main : theme.palette.error.main
    lightColor = finalModPercent > 0 ? theme.palette.success.light : theme.palette.error.light
    darkColor = finalModPercent > 0 ? theme.palette.success.dark : theme.palette.error.dark
  }
  return (
    <Tooltip title={tooltip || ''} placement="top">
      <Box
        sx={Object.assign({}, styles.container, {
          color: (isPercent || hasModPercent) && hasValue ? color : null,
          fontWeight: isNumeric && active ? 'bold' : 'normal',
          animation: isNumeric && active ? `${pulse} 1s infinite ease` : '',
        })}
      >
        <Box sx={styles.number}>
          {!isNumeric && '--'}
          {isNumeric && isPercent && finalVal > 0 ? '+' : ''}
          {isNumeric && isPercent && MValueFormatter(finalVal, MValueFormat.percent)}
          {isNumeric && !isPercent && MValueFormatter(finalVal, MValueFormat.number)}
          {unit}
          {hasModPercent && Math.abs(finalModPercent) > 0 && (
            <Box sx={styles.modPercent}>
              ({finalModPercent > 0 ? '+' : ''}
              {MValueFormatter(finalModPercent, MValueFormat.percent)})
            </Box>
          )}
        </Box>
        <Box sx={styles.label}>{label}</Box>
      </Box>
    </Tooltip>
  )
}
