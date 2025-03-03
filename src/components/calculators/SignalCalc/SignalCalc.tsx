import * as React from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { useTheme } from 'styled-components'
import * as signals from '../../../lib/signals'
import { AsteroidTypeEnum } from '@regolithco/common'
import { Box, Button, ButtonGroup, TextField } from '@mui/material'
import { debounce } from 'lodash'
dayjs.extend(relativeTime)

/**
 * This is the wrpaper for all the types of things scouts can find
 * @param param0
 * @returns
 */
export const SignalCalc: React.FC = () => {
  const theme = useTheme()
  const [inputSignal, setSignal] = React.useState<number>(0)
  const [isSpace, setIsSpace] = React.useState<boolean>(false)

  // Debounced signal change
  const handleSignalChange = React.useCallback(
    debounce((signal: number) => {
      setSignal(signal)
    }, 500),
    []
  )

  const possibilities = React.useMemo(() => {
    const asteroid = Object.entries(signals.depositRocks).reduce((acc, [key, value]) => {
      if (inputSignal % value === 0) {
        return {
          ...acc,
          [key]: inputSignal / value,
        }
      }
      return acc
    })
    const deposit = Object.entries(signals.spaceRocks).reduce(
      (acc, [key, value]) => {
        // If signal is an even multiple of the signal for that type then return the type and the multiplier
        if (inputSignal % value === 0) {
          return {
            ...acc,
            [key]: inputSignal / value,
          }
        }
        return acc
      },
      {} as Record<keyof AsteroidTypeEnum, number>
    )
    const panels = inputSignal % signals.panels === 0 ? inputSignal / signals.panels : 0
    const ROCGem = inputSignal % signals.ROCGem === 0 ? inputSignal / signals.ROCGem : 0
    const handGem = inputSignal % signals.handGem === 0 ? inputSignal / signals.handGem : 0

    return {
      asteroid,
      deposit,
      panels,
      ROCGem,
      handGem,
    }
  }, [inputSignal, isSpace])

  return (
    <Box>
      <TextField label="Signal" type="number" onChange={(e) => handleSignalChange(parseInt(e.target.value))} />
      <ButtonGroup variant="contained" color="primary">
        <Button onClick={() => setIsSpace(false)}>Deposit</Button>
        <Button onClick={() => setIsSpace(true)}>Asteroid</Button>
      </ButtonGroup>
      {Object.entries(possibilities.asteroid).map(([key, value]) => (
        <p key={key}>
          {key}: {value}
        </p>
      ))}
      {Object.entries(possibilities.deposit).map(([key, value]) => (
        <p key={key}>
          {key}: {value}
        </p>
      ))}
      {possibilities.panels > 0 && <p>panels: {possibilities.panels}</p>}
      {possibilities.ROCGem > 0 && <p>ROC Gem: {possibilities.ROCGem}</p>}
      {possibilities.handGem > 0 && <p>Hand Gem: {possibilities.handGem}</p>}
    </Box>
  )
}
