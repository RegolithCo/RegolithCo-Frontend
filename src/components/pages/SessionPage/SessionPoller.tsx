import React from 'react'
import { useSessionPolling } from '../../../hooks/useSessionPolling'
import { SessionUser } from '@regolithco/common'

export const SessionPoller: React.FC<{
  sessionId?: string
  sessionUser?: SessionUser | undefined
}> = ({ sessionId, sessionUser }) => {
  useSessionPolling(sessionId, sessionUser)
  return null
}
