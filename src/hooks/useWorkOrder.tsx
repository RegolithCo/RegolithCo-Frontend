import * as React from 'react'
import {
  GetWorkOrderDocument,
  useDeleteCrewShareMutation,
  useDeleteWorkOrderMutation,
  useGetWorkOrderQuery,
  useUpdateWorkOrderMutation,
  useUpsertCrewShareMutation,
} from '../schema'
import {
  CrewShare,
  CrewShareInput,
  crewSharesToInput,
  GetWorkOrderQuery,
  OtherOrder,
  removeKeyRecursive,
  SalvageOrder,
  ShipMiningOrder,
  UpdateWorkOrderMutation,
  VehicleMiningOrder,
  WorkOrder,
} from '@orgminer/common'
import { useGQLErrors } from './useGQLErrors'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import log from 'loglevel'

type useSessionsReturn = {
  workOrder?: WorkOrder
  loading: boolean
  mutating: boolean
  updateWorkOrder: (newWorkOrder: WorkOrder, setFail?: boolean) => void
  deleteWorkOrder: () => void
  setCrewSharePaid: (scName: string, paid: boolean) => void
  deleteCrewShare: (scName: string) => void
}

export const useWorkOrders = (sessionId: string, orderId: string): useSessionsReturn => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const workOrderQry = useGetWorkOrderQuery({
    variables: {
      sessionId,
      orderId,
    },
    skip: !sessionId || !orderId,
  })

  const updateWorkOrderMutation = useUpdateWorkOrderMutation()
  const deleteWorkOrderMutation = useDeleteWorkOrderMutation({
    onCompleted: () => {
      enqueueSnackbar('Work Order Deleted', { variant: 'success' })
      navigate(`/session/${sessionId}`)
    },
    update: (cache) => {
      cache.evict({ id: cache.identify(workOrderQry.data?.workOrder as WorkOrder) })
    },
  })

  const upsertCrewShareMutation = useUpsertCrewShareMutation({
    refetchQueries: [{ query: GetWorkOrderDocument, variables: { sessionId, orderId } }],
  })
  const deleteCrewShareMutation = useDeleteCrewShareMutation({
    // refetchQueries: [GetWorkOrderDocument],
    update: (cache, { data }) => {
      const workOrder = cache.readQuery({
        query: GetWorkOrderDocument,
        variables: {
          sessionId,
          orderId,
        },
      })
      if (!workOrder) return
      const newWorkOrderQry = workOrder as GetWorkOrderQuery
      cache.writeQuery({
        query: GetWorkOrderDocument,
        variables: {
          sessionId,
          orderId,
        },
        data: {
          ...newWorkOrderQry,
          workOrder: {
            ...newWorkOrderQry.workOrder,
            crewShares: (newWorkOrderQry.workOrder?.crewShares || []).filter(
              (cs) => cs.scName !== data?.deleteCrewShare?.scName
            ),
          },
        },
      })
    },
  })

  const queries = [workOrderQry]
  const mutations = [updateWorkOrderMutation, deleteWorkOrderMutation, upsertCrewShareMutation, deleteCrewShareMutation]

  const loading = queries.some((q) => q.loading)
  const mutating = mutations.some((m) => m[1].loading)

  useGQLErrors(queries, mutations)

  return {
    workOrder: workOrderQry.data?.workOrder as WorkOrder,
    loading,
    mutating,
    updateWorkOrder: (newWorkOrder: WorkOrder, setFail?: boolean) => {
      const { shareAmount } = newWorkOrder as OtherOrder
      const {
        crewShares,
        isRefined,
        method,
        failReason,
        note,
        processStartTime,
        refinery,
        includeTransferFee,
        shareRefinedValue,
        shipOres,
      } = newWorkOrder as ShipMiningOrder
      const { salvageOres } = newWorkOrder as SalvageOrder
      const { vehicleOres } = newWorkOrder as VehicleMiningOrder

      updateWorkOrderMutation[0]({
        variables: {
          sessionId,
          orderId,
          shares: crewSharesToInput(newWorkOrder.crewShares || []),
          workOrder: {
            failReason,
            note,
            isRefined,
            includeTransferFee,
            method,
            processStartTime,
            refinery,
            shareRefinedValue,
            setFail,
          },
          shipOres: removeKeyRecursive(shipOres, '__typename'),
          vehicleOres: removeKeyRecursive(vehicleOres, '__typename'),
          salvageOres: removeKeyRecursive(salvageOres, '__typename'),
          shareAmount,
        },
        optimisticResponse: () => {
          const optimisticresponse: UpdateWorkOrderMutation = {
            __typename: 'Mutation',
            updateWorkOrder: {
              ...workOrderQry.data?.workOrder,
              ...newWorkOrder,
            },
          }
          return optimisticresponse
        },
      })
    },
    deleteWorkOrder: () => {
      deleteWorkOrderMutation[0]({
        variables: {
          sessionId,
          orderId,
        },
      })
    },
    setCrewSharePaid: (scName: string, paid: boolean) => {
      const existingShare = workOrderQry.data?.workOrder?.crewShares?.find((cs) => cs.scName === scName)
      if (!existingShare) {
        log.error('Crew Share not found', scName)
      }
      const { note, share, shareType } = existingShare as CrewShare
      const newShare: CrewShareInput = {
        scName,
        state: paid,
        note,
        share,
        shareType,
      }
      upsertCrewShareMutation[0]({
        variables: {
          orderId,
          sessionId,
          crewShare: newShare,
        },
        optimisticResponse: () => ({
          __typename: 'Mutation',
          upsertCrewShare: {
            ...(existingShare as CrewShare),
            state: paid,
          },
        }),
      })
    },
    deleteCrewShare: (scName: string) => {
      deleteCrewShareMutation[0]({
        variables: {
          sessionId,
          orderId,
          scName,
        },
        optimisticResponse: () => ({
          __typename: 'Mutation',
          deleteCrewShare: {
            sessionId,
            orderId,
            scName,
            __typename: 'CrewShare',
          },
        }),
      })
    },
  }
}
