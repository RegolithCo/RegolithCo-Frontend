import { AsteroidTypeEnum, DepositTypeEnum } from '@regolithco/common'
import { debounce } from 'lodash'
import React, { useEffect } from 'react'
import * as signals from '../lib/signals'

export type UsesignalsReturn = {
  asteroid: Record<keyof AsteroidTypeEnum, number>
  deposit: Record<keyof DepositTypeEnum, number>
  panels: number
  ROCGem: number
  handGem: number
  anyMatch: boolean
}

export const usesignals = (inputSignal: number, isSpace?: boolean): UsesignalsReturn => {
  const [debouncedSignal, setSignal] = React.useState<number>(0)

  useEffect(() => {
    debounce((signal: number) => {
      setSignal(signal)
    }, 300)(inputSignal)
  }, [inputSignal])

  const possibilities: UsesignalsReturn = React.useMemo(() => {
    if (debouncedSignal === 0) {
      return {
        asteroid: {} as Record<keyof AsteroidTypeEnum, number>,
        deposit: {} as Record<keyof DepositTypeEnum, number>,
        panels: 0,
        ROCGem: 0,
        handGem: 0,
        anyMatch: false,
      }
    }
    const asteroid = Object.entries(signals.spaceRocks).reduce(
      (acc, [key, value]) => {
        if (debouncedSignal % value === 0) {
          return {
            ...acc,
            [key]: debouncedSignal / value,
          }
        }
        return acc
      },
      {} as Record<keyof AsteroidTypeEnum, number>
    )
    const deposit = Object.entries(signals.depositRocks).reduce(
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
      {} as Record<keyof DepositTypeEnum, number>
    )
    const panels = debouncedSignal % signals.panels === 0 ? debouncedSignal / signals.panels : 0
    const ROCGem = debouncedSignal % signals.ROCGem === 0 ? debouncedSignal / signals.ROCGem : 0
    const handGem = debouncedSignal % signals.handGem === 0 ? debouncedSignal / signals.handGem : 0

    return {
      asteroid,
      deposit,
      panels,
      ROCGem,
      handGem,
      anyMatch:
        Object.keys(asteroid).length > 0 || Object.keys(deposit).length > 0 || panels > 0 || ROCGem > 0 || handGem > 0,
    }
  }, [debouncedSignal, isSpace])

  return possibilities
}
