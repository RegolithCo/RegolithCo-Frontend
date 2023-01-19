import * as React from 'react'

type UseCountDownReturn = {
  isStarted: boolean
  isFinished: boolean
  hasTime: boolean
  remainingTime: number
}

export const useCountdown = (startTime?: number, totalTime?: number): UseCountDownReturn => {
  const [remainingTime, setRemainingTime] = React.useState<number>(0)
  const timerRef = React.useRef<NodeJS.Timeout>()

  // Means thisis a refinery process
  const hasTime = typeof totalTime !== 'undefined' && totalTime > 0
  // is Started
  const isStarted = hasTime && typeof startTime !== 'undefined' && startTime > 0
  // is finished
  const isFinished = isStarted && remainingTime <= 0

  React.useEffect(() => {
    // If we have no start time or total time, we can't do anything
    if (typeof startTime === 'undefined' || typeof totalTime === 'undefined') {
      setRemainingTime(0)
      return
    }
    const endTime = startTime + totalTime
    const nowDate = Date.now()
    // If we are already finished, we can't do anything
    if (nowDate >= endTime) {
      setRemainingTime(0)
      return
    }
    setRemainingTime(endTime - nowDate)
    timerRef.current = setInterval(() => {
      setRemainingTime((t) => {
        if (t < 0) {
          timerRef.current && clearInterval(timerRef.current)
          return 0
        } else return t - 1000
      })
    }, 1000)
    return () => timerRef.current && clearInterval(timerRef.current)
  }, [startTime, totalTime])

  return {
    isStarted,
    isFinished,
    hasTime,
    remainingTime,
  }
}
