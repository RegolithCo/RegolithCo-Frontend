import * as React from 'react'
import { useSnackbar } from 'notistack'
import { useGetSessionShareQuery, useJoinSessionMutation } from '../schema'
import { ErrorCode, SessionShare } from '@regolithco/common'
import { useNavigate } from 'react-router-dom'
import { useGQLErrors } from './useGQLErrors'
import log from 'loglevel'
import { usePageVisibility } from './usePageVisibility'
import { makeSessionUrls } from '../lib/routingUrls'
import { SessionTabs } from '../context/session.context'

type useSessionsReturn = {
  sessionShare?: SessionShare
  sessionError?: ErrorCode
  loading: boolean
  mutating: boolean
  joinSession: () => void
}

export const useJoinSession = (joinId?: string): useSessionsReturn => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [sessionError, setSessionError] = React.useState<ErrorCode>()
  const isPageVisible = usePageVisibility()

  const sessionJoinQuery = useGetSessionShareQuery({
    variables: {
      joinId: joinId as string,
    },
    skip: !joinId,
  })

  // TODO: This is our sloppy poll function we need to update to lower data costs
  React.useEffect(() => {
    // If we have a real session, poll every 10 seconds
    if (isPageVisible && sessionJoinQuery.data?.sessionShare) {
      // If the last updated date is greater than 24 hours or if the state is not active, slow your poll
      const pollTime = 10000
      sessionJoinQuery.startPolling(pollTime)
    } else {
      sessionJoinQuery.stopPolling()
    }
    // Also stop all polling when when this component is unmounted
    return () => {
      sessionJoinQuery.stopPolling()
    }
  }, [sessionJoinQuery.data, isPageVisible])

  React.useEffect(() => {
    if (sessionJoinQuery.error) {
      try {
        if (sessionJoinQuery.error.graphQLErrors.find((e) => e.extensions?.code === ErrorCode.SESSION_NOT_FOUND))
          navigate('/')
      } catch {
        //
      }
      log.error('sessionQry.error', sessionJoinQuery.error)
    }
  }, [sessionJoinQuery.error])

  const joinSessionMutation = useJoinSessionMutation({
    variables: {
      joinId: joinId as string,
    },
    onCompleted: (data) => {
      enqueueSnackbar('JOINED SESSION!', { variant: 'success' })
      if (data.joinSession?.sessionId)
        navigate(makeSessionUrls({ sessionId: data.joinSession?.sessionId, tab: SessionTabs.DASHBOARD }))
    },
  })

  const queries = [sessionJoinQuery]
  const mutations = [joinSessionMutation]

  useGQLErrors(queries, mutations)

  const loading = queries.some((q) => q.loading)
  const mutating = mutations.some((m) => m[1].loading)

  return {
    sessionShare: sessionJoinQuery.data?.sessionShare as SessionShare,
    sessionError,
    loading,
    mutating,
    joinSession: joinSessionMutation[0],
  }
}
