import * as React from 'react'
import { SxProps, Theme, Typography, TypographyProps } from '@mui/material'
import Numeral from 'numeral'
import dayjs from 'dayjs'
import { readableMilliseconds } from '@regolithco/common'

type ObjectValues<T> = T[keyof T]

export const MValueFormat = {
  number: 'number',
  number_sm: 'number_sm',
  currency: 'currency',
  currency_sm: 'currency_sm',
  volSCU: 'volumeSCU',
  volcSCU: 'volumecSCU',
  percent: 'percent',
  modifier: 'mod',
  mass_sm: 'mass_sm',
  duration_small: 'duration_compact',
  duration: 'duration',
  durationS: 'durationS',
  dateTime: 'dateTime',
  string: 'string',
} as const
export type MValueFormat = ObjectValues<typeof MValueFormat>

/**
 * Numeral does a pretty good job but sometimes we need a few more significant digits
 * This one is only used for compact numbers
 * @returns
 */
export const findDecimalsSm = (value: number, allowFractions = false): number => {
  if (value === 0) return 0
  if (value < 100 && !allowFractions) return 0
  const testVal = Numeral(value).format(`0a`)
  if (testVal.length >= 3) return 0
  else return 3 - testVal.length
}

/**
 * Render the number and count the number of decimals
 * @param value
 * @returns
 */
export const countDecimals = (value: number, maxAllowedDecimals: number): number => {
  // If the value is an integer or zero then we have no decimals
  if (value === 0 || value % 1 === 0) return 0
  const testVal = value.toFixed(maxAllowedDecimals).split('.')[1].replace(/0+$/, '').length
  return testVal
}

export interface MValueProps {
  value?: number | string | React.ReactNode | null
  onClick?: () => void
  decimals?: number
  maxDecimals?: number
  approx?: boolean
  format?: MValueFormat
  typoProps?: TypographyProps & {
    sx?: SxProps<Theme>
    component?: unknown
  }
}

export const MValueAddUnit = (value: string, unit: string): React.ReactNode => {
  return (
    <>
      {value} <span style={{ fontSize: '0.7em' }}>{unit}</span>
    </>
  )
}

export const MValueFormatter = (
  value: MValueProps['value'],
  format: MValueProps['format'],
  decimals?: MValueProps['decimals'],
  maxDecimals?: MValueProps['maxDecimals']
): React.ReactNode => {
  let finalVal: React.ReactNode = ''

  // Miscellaneous types of values that may be non-numerical
  if (format === MValueFormat.string) finalVal = value as string
  else if (isNaN(Number(value))) return '--'
  // check for the infinity case
  else if (!isFinite(Number(value))) return '--'
  else if (typeof value === 'undefined') return ''
  else if (value === null) finalVal = 'null'

  // Number: Just a number
  if (!format || format === MValueFormat.number) {
    let finalDecimals = 0
    if (decimals) finalDecimals = decimals
    else if (maxDecimals) finalDecimals = countDecimals(value as number, maxDecimals)
    else finalDecimals = 0
    //
    if (finalDecimals === 0) finalVal = Numeral(value).format(`0,0`)
    else finalVal = Numeral(value).format(`0,0.${'0'.repeat(finalDecimals)}`)
  } else if (format === MValueFormat.number_sm) {
    // The small version is pretty tightly wound
    let finalDecimals = 0
    if (decimals) finalDecimals = decimals
    else if (maxDecimals) finalDecimals = countDecimals(value as number, maxDecimals)
    else finalDecimals = findDecimalsSm(value as number)
    finalVal = Numeral(value).format(`0.${'0'.repeat(finalDecimals)}a`)
  }

  // aUEC: Currency
  else if (format === MValueFormat.currency) {
    // Currency never has decimals because aUEC has no fractional amount
    finalVal = MValueAddUnit(Numeral(value).format(`0,0`), 'aUEC')
  } else if (format === MValueFormat.currency_sm) {
    // The small version is pretty tightly wound
    let finalDecimals = 0
    if (decimals) finalDecimals = decimals
    else if (maxDecimals) finalDecimals = countDecimals(value as number, maxDecimals)
    else finalDecimals = findDecimalsSm(value as number)
    finalVal = MValueAddUnit(Numeral(value).format(`0.${'0'.repeat(finalDecimals)}a`), 'aUEC')
  }

  // Percent: 0.00%
  else if (format === MValueFormat.percent) {
    let finalDecimals = 0
    if (decimals) finalDecimals = decimals
    else if (maxDecimals) finalDecimals = countDecimals((value as number) * 100, maxDecimals)
    else finalDecimals = findDecimalsSm(value as number)
    finalVal = Numeral(value).format(`0,0.${'0'.repeat(finalDecimals || 0)}%`)
  }

  // Modifier. Used for loadout calculations: +0.00%
  else if (format === MValueFormat.modifier) {
    const prefix = (value as number) > 0 ? '+' : ''
    finalVal = prefix + Numeral(value).format(`0,0`) + '%'
  }

  // Durations 00:00:00
  else if (format === MValueFormat.duration) {
    finalVal = readableMilliseconds(value as number, false)
  } else if (format === MValueFormat.durationS) {
    finalVal = readableMilliseconds(value as number, true)
  } else if (format === MValueFormat.duration_small) {
    finalVal = readableMilliseconds(value as number, false, false)
  } else if (format === MValueFormat.dateTime) {
    // Format date to be more readable
    finalVal = dayjs(value as number).format('MMM D h:mma')
  } else if (format === MValueFormat.volSCU) {
    const val = value as number
    const finalDecimals = typeof decimals !== 'undefined' ? decimals : findDecimalsSm(value as number, true)
    finalVal = MValueAddUnit(Numeral(val).format(`0,0.${'0'.repeat(finalDecimals)}`), 'SCU')
  } else if (format === MValueFormat.volcSCU) {
    finalVal = MValueAddUnit(Numeral(value).format(`0,0.${'0'.repeat(decimals || 0)}`), 'cSCU')
  } else if (format === MValueFormat.mass_sm) {
    const finalDecimals = typeof decimals !== 'undefined' ? decimals : findDecimalsSm(value as number, true)
    finalVal = MValueAddUnit(Numeral(value).format(`0.${'0'.repeat(finalDecimals)}a`), 't')
  } else {
    finalVal = value as string
  }

  return finalVal
}

export const MValue: React.FC<MValueProps> = ({
  value,
  onClick,
  decimals,
  maxDecimals,
  format = MValueFormat.number,
  approx,
  typoProps,
}) => {
  const finalVal = MValueFormatter(value, format, decimals, maxDecimals)
  const internalTypoProps: TypographyProps = {}
  if (format === MValueFormat.currency && (value as number) < 0) internalTypoProps.color = 'error'

  return (
    <Typography onClick={onClick} variant="tablecell" {...internalTypoProps} {...typoProps}>
      {approx && '~'}
      {finalVal}
    </Typography>
  )
}
