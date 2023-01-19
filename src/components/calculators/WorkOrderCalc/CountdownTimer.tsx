import { SxProps, Theme, TypographyProps } from '@mui/material'
import React, { useEffect } from 'react'
import { useCountdown } from '../../../hooks/useCountdown'
import { MValue, MValueFormat, MValueFormatter } from '../../fields/MValue'

export interface CountdownTimerProps {
  startTime?: number
  totalTime?: number
  useMValue?: boolean
  typoProps?: TypographyProps & {
    sx?: SxProps<Theme>
    component?: unknown
  }
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ startTime, totalTime, useMValue, typoProps }) => {
  const { isFinished, isStarted, hasTime, remainingTime } = useCountdown(startTime, totalTime)

  let finalVal = ''
  if (hasTime && isFinished) finalVal = 'COMPLETED'
  else if (hasTime && isStarted) finalVal = MValueFormatter(remainingTime, MValueFormat.durationS)

  if (!useMValue) return <>{finalVal}</>
  else return <MValue value={finalVal} format={MValueFormat.string} typoProps={typoProps} />
}
