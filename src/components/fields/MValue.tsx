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

export interface MValueProps {
  value?: number | string | null
  onClick?: () => void
  decimals?: number
  format?: MValueFormat
  typoProps?: TypographyProps & {
    sx?: SxProps<Theme>
    component?: unknown
  }
}

export const MValueFormatter = (
  value: MValueProps['value'],
  format: MValueProps['format'],
  decimals: MValueProps['decimals'] = 0
): string => {
  let finalVal = ''

  if (format === MValueFormat.string) finalVal = value as string
  else if (isNaN(value as number)) finalVal = 'NaN'
  else if (typeof value === 'undefined') finalVal = ''
  else if (value === null) finalVal = 'null'
  if (!format || format === MValueFormat.number) {
    if (decimals) finalVal = Numeral(value).format(`0,0.${'0'.repeat(decimals)}`)
    else finalVal = Numeral(value).format('0,0')
  } else if (format === MValueFormat.number_sm) {
    if (decimals) finalVal = Numeral(value).format(`0.${'0'.repeat(decimals)}a`)
    else finalVal = Numeral(value).format('0a')
  }
  // aUEC
  else if (format === MValueFormat.currency) {
    finalVal = Numeral(value).format(`0,0.${'0'.repeat(decimals)}`) + ' aUEC'
  } else if (format === MValueFormat.currency_sm) {
    finalVal = Numeral(value).format(`0a`) + ' aUEC'
  }
  // Percent
  else if (format === MValueFormat.percent) {
    finalVal = Numeral(value).format(`0,0.${'0'.repeat(decimals)}%`)
  } else if (format === MValueFormat.modifier) {
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
    finalVal = Numeral(value).format(`0,0.${'0'.repeat(decimals)}`) + ' SCU'
  } else if (format === MValueFormat.volcSCU) {
    finalVal = Numeral(value).format(`0,0.${'0'.repeat(decimals)}`) + ' cSCU'
  } else if (format === MValueFormat.mass_sm) {
    finalVal = Numeral(value).format(`0.${'0'.repeat(decimals)}a`) + ' kg'
  } else {
    finalVal = value as string
  }

  return finalVal
}

export const MValue: React.FC<MValueProps> = ({
  value,
  onClick,
  decimals = 0,
  format = MValueFormat.number,
  typoProps,
}) => {
  const finalVal = MValueFormatter(value, format, decimals)
  const internalTypoProps: TypographyProps = {}
  if (format === MValueFormat.currency && (value as number) < 0) internalTypoProps.color = 'error'

  return (
    <Typography onClick={onClick} variant="tablecell" {...internalTypoProps} {...typoProps}>
      {finalVal}
    </Typography>
  )
}
