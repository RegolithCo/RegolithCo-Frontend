import {
  GetSessionScoutingDocument,
  GetSessionUserDocument,
  useDeleteScoutingFindMutation,
  useGetScoutingFindQuery,
  useJoinScoutingFindMutation,
  useLeaveScoutingFindMutation,
  useUpdateScoutingFindMutation,
} from '../schema'
import log from 'loglevel'

import { useGQLErrors } from './useGQLErrors'
import { useNavigate } from 'react-router-dom'
import { ScoutingFind, scoutingFindDestructured, SessionUser } from '@regolithco/common'
import { useSnackbar } from 'notistack'
import { ScoutingFindTypenames } from '../types'

type useSessionsReturn = {
  scoutingFind?: ScoutingFind
  loading: boolean
  querying: boolean
  mutating: boolean
  updateScoutingFind: (newFind: ScoutingFind) => void
  deleteScoutingFind: (findId: string, __typename: ScoutingFindTypenames) => void
  joinScoutingFind: (findId: string, enRoute: boolean) => void
  leaveScoutingFind: (findId: string) => void
}

export const useScoutingFind = (
  sessionId: string,
  scoutingFindId: string,
  sessionUser?: SessionUser
): useSessionsReturn => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const scoutingFindQry = useGetScoutingFindQuery({
    variables: {
      sessionId,
      scoutingFindId,
    },
    skip: !sessionId || !scoutingFindId,
    onError: (error) => {
      log.error(error)
      enqueueSnackbar(error.message, { variant: 'error' })
      navigate(`/session/${sessionId}`)
    },
  })

  const updateScoutingFindMutation = useUpdateScoutingFindMutation()
  const deleteScoutingFindMutation = useDeleteScoutingFindMutation({
    update: (cache, { data }) => {
      if (!data?.deleteScoutingFind) return
      cache.evict({ id: cache.identify(data?.deleteScoutingFind as ScoutingFind) })
    },
    onCompleted: () => {
      enqueueSnackbar('You have deleted the scouting find', { variant: 'warning' })
      navigate(`/session/${sessionId}`)
    },
  })
  const joinScoutingFindMutation = useJoinScoutingFindMutation({
    onCompleted: () => {
      enqueueSnackbar('You have joined the scouting find', { variant: 'success' })
    },
  })
  const leaveScoutingFindMutation = useLeaveScoutingFindMutation({
    onCompleted: () => {
      enqueueSnackbar('You have left the scouting find', { variant: 'warning' })
    },
  })
  const queries = [scoutingFindQry]
  const mutations = [
    updateScoutingFindMutation,
    deleteScoutingFindMutation,
    joinScoutingFindMutation,
    leaveScoutingFindMutation,
  ]
  const querying = queries.some((q) => q.loading)
  const mutating = mutations.some((m) => m[1].loading)

  useGQLErrors([], mutations)

  return {
    scoutingFind: scoutingFindQry.data?.scoutingFind as ScoutingFind,
    mutating,
    querying,
    loading: querying || mutating,
    updateScoutingFind: (newFind: ScoutingFind) => {
      const { scoutingFind, shipRocks, vehicleRocks, wrecks } = scoutingFindDestructured(newFind)
      updateScoutingFindMutation[0]({
        variables: {
          sessionId,
          scoutingFindId: newFind.scoutingFindId,
          scoutingFind: scoutingFind,
          shipRocks: shipRocks,
          vehicleRocks: vehicleRocks,
          wrecks: wrecks,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateScoutingFind: {
            ...scoutingFindQry.data?.scoutingFind,
            ...newFind,
          },
        },
      })
    },
    deleteScoutingFind: (findId: string, __typename: ScoutingFindTypenames) =>
      deleteScoutingFindMutation[0]({
        variables: {
          scoutingFindId: findId,
          sessionId,
        },
        onCompleted: () => {
          enqueueSnackbar('Scouting Find Deleted!', { variant: 'warning' })
          if (window.location.pathname.includes(findId)) navigate(`/session/${sessionId}`)
        },
        update: (cache) => {
          // need to identify this from anyOrderId NOT workOrderQry.data?.workOrder
          const id = cache.identify({ sessionId, scoutingFindId: findId, __typename })
          if (!id) return
          cache.evict({ id })
          cache.gc()
        },
        optimisticResponse: () => ({
          __typename: 'Mutation',
          deleteScoutingFind: {
            sessionId,
            scoutingFindId: findId,
            __typename,
          },
        }),
      }),
    joinScoutingFind: (findId: string, enRoute: boolean) => {
      joinScoutingFindMutation[0]({
        variables: {
          scoutingFindId: findId,
          sessionId,
          enRoute,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          joinScoutingFind: {
            ...(scoutingFindQry.data?.scoutingFind as ScoutingFind),
            attendanceIds: Array.from(
              new Set([
                ...(scoutingFindQry.data?.scoutingFind?.attendanceIds || []),
                sessionUser?.owner?.userId as string,
              ])
            ),
            attendance: scoutingFindQry.data?.scoutingFind?.attendance?.find(
              ({ owner }) => owner?.userId === sessionUser?.owner?.userId
            )
              ? scoutingFindQry.data?.scoutingFind?.attendance
              : [...(scoutingFindQry.data?.scoutingFind?.attendance || []), sessionUser as SessionUser],
          },
        },
        refetchQueries: [
          {
            query: GetSessionUserDocument,
            variables: {
              sessionId,
            },
          },
          {
            query: GetSessionScoutingDocument,
            variables: {
              sessionId,
            },
          },
        ],
      })
    },
    leaveScoutingFind: (findId: string) => {
      leaveScoutingFindMutation[0]({
        variables: {
          scoutingFindId: findId,
          sessionId,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          leaveScoutingFind: {
            ...(scoutingFindQry.data?.scoutingFind as ScoutingFind),
            attendanceIds: (scoutingFindQry.data?.scoutingFind?.attendanceIds || []).filter(
              (userId) => userId !== sessionUser?.owner?.userId
            ),
            attendance: (scoutingFindQry.data?.scoutingFind?.attendance || []).filter(
              (user) => user.owner?.userId !== sessionUser?.owner?.userId
            ),
          },
        },
        refetchQueries: [
          {
            query: GetSessionUserDocument,
            variables: {
              sessionId,
            },
          },
          {
            query: GetSessionScoutingDocument,
            variables: {
              sessionId,
            },
          },
        ],
      })
    },
  }
}
