import React from 'react'
import { Box, SxProps, Theme, Tooltip, keyframes, useTheme } from '@mui/material'
import { fontFamilies } from '../../../theme'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'

const stylesThunk = (theme: Theme, isBig?: boolean): Record<string, SxProps<Theme>> => ({
  container: {
    fontFamily: fontFamilies.robotoMono,
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

export interface NumberStatProps {
  label: string
  isBig?: boolean
  value?: number
  modPercent?: number
  unit?: string
  reversed?: boolean
  isPercent?: boolean
  isMod?: boolean
  active?: boolean
  tooltip?: string
}

export const NumberStat: React.FC<NumberStatProps> = ({
  label,
  isBig,
  value,
  reversed,
  isPercent,
  isMod,
  modPercent,
  active,
  unit,
  tooltip,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme, isBig)

  const isNumeric = Boolean(typeof value === 'number')
  const valNum = isNumeric ? (value as number) : 0

  const hasModPercent = Boolean(modPercent && Math.abs(modPercent) > 0.01)
  const modPercentNum = hasModPercent ? (modPercent as number) : 0

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

  const finalValue = isMod && isPercent ? valNum : valNum
  const hasValue = Boolean(isNumeric && Math.abs(finalValue || 0) > 0.01)

  return (
    <Tooltip title={tooltip || ''} placement="top">
      <Box
        sx={Object.assign({}, styles.container, {
          color: isPercent && hasValue ? color : null,
          fontWeight: isNumeric && active ? 'bold' : 'normal',
          animation: isNumeric && active ? `${pulse} 1s infinite ease` : '',
        })}
      >
        <Box sx={styles.number}>
          {!isNumeric && '--'}
          {isNumeric && isPercent && finalValue > 0 ? '+' : ''}
          {isNumeric && isPercent && MValueFormatter(finalValue, MValueFormat.percent)}
          {isNumeric && !isPercent && MValueFormatter(finalValue, MValueFormat.number)}
          {unit}
          {hasModPercent && (
            <Box sx={styles.modPercent}>
              ({modPercentNum - 1 > 0 ? '+' : ''}
              {MValueFormatter(modPercentNum - 1, MValueFormat.percent)})
            </Box>
          )}
        </Box>
        <Box sx={styles.label}>{label}</Box>
      </Box>
    </Tooltip>
  )
}
