import * as React from 'react'
import { Typography, TableCell, useTheme, SxProps, Theme } from '@mui/material'
import { MValueFormat, MValueFormatter } from '../fields/MValue'

export const tableStylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  table: {
    width: 'auto',
    position: 'relative',
    '& table': {
      borderCollapse: 'separate',
      '& th:first-of-type': {
        left: 0,
        zIndex: 1,
      },
      '& thead th:first-of-type': {
        zIndex: 2,
      },
    },
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
  shortHeaderFirst: {
    backgroundColor: theme.palette.background.default,
    position: 'sticky',
    zIndex: 3,
    pt: 12,
    verticalAlign: 'bottom',
  },
  longHeaders: {
    p: 0,
    pt: 15,
    position: 'relative',
    overflowX: 'visible',
    overflowY: 'clip',
    '& .MuiTypography-root': {
      width: 250,
      pl: 5,
      pt: 0,
      borderTop: `1px solid ${theme.palette.divider}`,
      position: 'absolute',
      textAlign: 'left',
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
  const finalSx: SxProps<Theme> = Object.assign({ fontWeight: isBold ? 'bold' : null, textAlign: 'right' }, sx || {})

  if (typeof value === 'undefined') {
    return <TableCell sx={finalSx}> </TableCell>
  }
  const finalValue = value > 0 ? value - 1 : 0
  const color = reversed
    ? finalValue <= 0
      ? isBold
        ? theme.palette.success.main
        : theme.palette.success.dark
      : isBold
        ? theme.palette.error.main
        : theme.palette.error.dark
    : finalValue > 0
      ? isBold
        ? theme.palette.success.main
        : theme.palette.success.dark
      : isBold
        ? theme.palette.error.main
        : theme.palette.error.dark
  return (
    <TableCell sx={finalSx}>
      <span style={{ color }}>
        {finalValue > 0 ? '+' : ''}
        {finalValue === 0 ? ' ' : MValueFormatter(finalValue, MValueFormat.percent)}
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
