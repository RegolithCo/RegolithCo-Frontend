import {
  useDeleteScoutingFindMutation,
  useGetScoutingFindQuery,
  useJoinScoutingFindMutation,
  useLeaveScoutingFindMutation,
  useUpdateScoutingFindMutation,
} from '../schema'

import { useGQLErrors } from './useGQLErrors'
import { useNavigate } from 'react-router-dom'
import { SalvageFind, ScoutingFind, ScoutingFindInput, ShipClusterFind, VehicleClusterFind } from '@regolithco/common'
import { useSnackbar } from 'notistack'

type useSessionsReturn = {
  loading: boolean
  querying: boolean
  mutating: boolean
  updateScoutingFind: (newFind: ScoutingFind) => void
  deleteScoutingFind: (findId: string) => void
  joinScoutingFind: (findId: string, enRoute: boolean) => void
  leaveScoutingFind: (findId: string) => void
}

export const useScoutingFind = (sessionId: string, scoutingFindId: string): useSessionsReturn => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const scoutingFindQry = useGetScoutingFindQuery({
    variables: {
      sessionId,
      scoutingFindId,
    },
    skip: !sessionId || !scoutingFindId,
  })

  const updateScoutingFindMutation = useUpdateScoutingFindMutation()
  const deleteScoutingFindMutation = useDeleteScoutingFindMutation({
    update: (cache, { data }) => {
      cache.evict({ id: cache.identify(scoutingFindQry.data?.scoutingFind as ScoutingFind) })
    },
    onCompleted: () => {
      enqueueSnackbar('You have deleted the scouting find', { variant: 'warning' })
      navigate(`/session/${sessionId}`)
    },
  })
  const joinScoutingFindMutation = useJoinScoutingFindMutation({
    update: (cache, { data }) => {
      console.log('TODO: UPDATE CACHE HERE', data)
      // cache.modify({
      //   id: `Session:${data?.joinScoutingFind?.sessionId}`,
      //   fields: {
      //     scoutingFinds(existingScoutingFinds = []) {
      //       const newScoutingFindRef = cache.writeFragment({
      //         data: data?.joinScoutingFind,
      //         fragment: GetSessionDocument.definitions[0].selectionSet.selections[0].selectionSet.selections[0],
      //       })
      //       return [...existingScoutingFinds, newScoutingFindRef]
      //     },
      //   },
      // })
    },
  })
  const leaveScoutingFindMutation = useLeaveScoutingFindMutation({
    onCompleted: () => {
      enqueueSnackbar('You have left the scouting find', { variant: 'warning' })
      navigate(`/session/${sessionId}`)
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
    mutating,
    querying,
    loading: querying || mutating,
    updateScoutingFind: (newFind: ScoutingFind) => {
      const newScoutingFindInput: ScoutingFindInput = {
        state: newFind.state,
        clusterCount: newFind.clusterCount,
        note: newFind.note,
      }
      updateScoutingFindMutation[0]({
        variables: {
          sessionId,
          scoutingFindId: newFind.scoutingFindId,
          scoutingFind: newScoutingFindInput,
          shipRocks: (newFind as ShipClusterFind).shipRocks,
          vehicleRocks: (newFind as VehicleClusterFind).vehicleRocks,
          wrecks: (newFind as SalvageFind).wrecks,
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
    deleteScoutingFind: (findId: string) => {
      deleteScoutingFindMutation[0]({
        variables: {
          scoutingFindId: findId,
          sessionId,
        },
      })
    },
    joinScoutingFind: (findId: string, enRoute: boolean) => {
      joinScoutingFindMutation[0]({
        variables: {
          scoutingFindId: findId,
          sessionId,
          enRoute,
        },
      })
    },
    leaveScoutingFind: (findId: string) => {
      leaveScoutingFindMutation[0]({
        variables: {
          scoutingFindId: findId,
          sessionId,
        },
      })
    },
  }
}
