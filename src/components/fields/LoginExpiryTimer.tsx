import React, { useEffect } from 'react'
import { Auth } from 'aws-amplify'
import { CountdownTimer } from '../calculators/WorkOrderCalc/CountdownTimer'
import log from 'loglevel'

export const LoginExpiryTimer: React.FC = () => {
  const [expiryTime, setExpiryTime] = React.useState<number>(0)
  const [tickChecker, setTickChecker] = React.useState<number>(0)
  const timerRef = React.useRef<NodeJS.Timeout>()
  const nowDate = Date.now()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        log.debug('LoginExpiryTimer: Check Auth')
        const session = await Auth.currentSession()
        // const token = session.getAccessToken().getJwtToken()
        const expiry = session.getAccessToken().getExpiration() * 1000
        setExpiryTime(expiry)
      } catch (error) {
        log.error('LoginExpiryTimer:error', error)
      }
      timerRef.current = setTimeout(() => {
        log.debug('LoginExpiryTimer: Tick Checker')
        setTickChecker(tickChecker + 1)
      }, 10000)
    }
    checkAuth()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [tickChecker])

  return (
    <CountdownTimer
      startTime={nowDate}
      totalTime={expiryTime - nowDate}
      useMValue={true}
      typoProps={{
        sx: {
          border: '1px solid red',
          color: 'red',
        },
      }}
    />
  )
}
