import {
  useDeleteScoutingFindMutation,
  useJoinScoutingFindMutation,
  useLeaveScoutingFindMutation,
  useUpdateScoutingFindMutation,
} from '../schema'

import { useGQLErrors } from './useGQLErrors'
import { useNavigate } from 'react-router-dom'
import { SalvageFind, ScoutingFind, ScoutingFindInput, ShipClusterFind, VehicleClusterFind } from '@orgminer/common'
import { useSnackbar } from 'notistack'

type useSessionsReturn = {
  mutating: boolean
  updateScoutingFind: (newFind: ScoutingFind) => void
  deleteScoutingFind: (findId: string) => void
  joinScoutingFind: (findId: string) => void
  leaveScoutingFind: (findId: string) => void
}

export const useScoutingFind = (sessionId: string): useSessionsReturn => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const updateScoutingFindMutation = useUpdateScoutingFindMutation()
  const deleteScoutingFindMutation = useDeleteScoutingFindMutation({
    update: (cache, { data }) => {
      cache.evict({
        id: `ScoutingFind:${data?.deleteScoutingFind?.sessionId}:${data?.deleteScoutingFind?.scoutingFindId}`,
      })
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

  const mutations = [
    updateScoutingFindMutation,
    deleteScoutingFindMutation,
    joinScoutingFindMutation,
    leaveScoutingFindMutation,
  ]

  const mutating = mutations.some((m) => m[1].loading)

  useGQLErrors([], mutations)

  return {
    mutating,
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
    joinScoutingFind: (findId: string) => {
      joinScoutingFindMutation[0]({
        variables: {
          scoutingFindId: findId,
          sessionId,
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
