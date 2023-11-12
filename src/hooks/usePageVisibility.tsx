import React, { useEffect } from 'react'
import log from 'loglevel'

export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = React.useState(!document.hidden)

  useEffect(() => {
    const handleVisibilityChange = () => {
      log.debug(`Page visibility changed to: ${!document.hidden}`)
      setIsVisible(!document.hidden)
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return isVisible
}
