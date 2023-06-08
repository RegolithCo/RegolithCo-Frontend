import * as React from 'react'
import { Typography, TableCell, useTheme, SxProps, Theme } from '@mui/material'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'

export const tableStylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  table: {
    width: 'auto',
    // Body cels
    '& .MuiTableBody-root .MuiTableCell-root': {
      width: 40,
      minWidth: 40,
      borderRight: `1px solid ${theme.palette.divider}`,
    },
  },
  textCell: {
    maxWidth: 60,
  },
  tinyCell: {
    maxWidth: 20,
  },
  numericCell: {
    maxWidth: 60,
  },
  storeCell: {
    width: 40,
  },
  spacerCell: {
    width: 'inherit!important',
  },
  sectionDivider: {
    borderRight: `4px solid ${theme.palette.divider}!important`,
  },
  shortHeader: {
    pt: 12,
    verticalAlign: 'bottom',
  },
  longHeaders: {
    p: 0,
    position: 'relative',
    pt: 15,
    '& .MuiTypography-root': {
      width: 250,
      pl: 5,
      pt: 0,
      borderTop: `1px solid ${theme.palette.divider}`,
      position: 'absolute',
      transform: 'rotate(-30deg)',
      transformOrigin: '0% 0%',
      whiteSpace: 'nowrap',
    },
  },
})

export const StatsCell: React.FC<{
  value?: number
  sx?: SxProps<Theme>
  reversed?: boolean
  maxMin?: { max: number; min: number }
}> = ({ value, sx, reversed, maxMin }) => {
  const theme = useTheme()
  const isBold = maxMin && typeof value !== 'undefined' && (value === maxMin.max || value === maxMin.min)
  const finalSx: SxProps<Theme> = Object.assign({ fontWeight: isBold ? 'bold' : null }, sx || {})

  if (typeof value === 'undefined') {
    return <TableCell sx={finalSx}> </TableCell>
  }
  const color = reversed
    ? value <= 0
      ? isBold
        ? theme.palette.success.main
        : theme.palette.success.dark
      : isBold
      ? theme.palette.error.main
      : theme.palette.error.dark
    : value > 0
    ? isBold
      ? theme.palette.success.main
      : theme.palette.success.dark
    : isBold
    ? theme.palette.error.main
    : theme.palette.error.dark
  return (
    <TableCell sx={finalSx}>
      <span style={{ color }}>
        {value > 0 ? '+' : ''}
        {MValueFormatter(value, MValueFormat.percent)}
      </span>
    </TableCell>
  )
}

export const LongCellHeader: React.FC<React.PropsWithChildren> = ({ children }) => {
  const theme = useTheme()
  const styles = tableStylesThunk(theme)
  return (
    <TableCell sx={styles.longHeaders}>
      <Typography variant="caption" component="div">
        {children}
      </Typography>
    </TableCell>
  )
}
