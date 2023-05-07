import * as React from 'react'
import {
  GetWorkOrderDocument,
  useDeleteCrewShareMutation,
  useDeleteWorkOrderMutation,
  useFailWorkOrderMutation,
  useGetWorkOrderQuery,
  useUpdateWorkOrderMutation,
  useUpsertCrewShareMutation,
} from '../schema'
import {
  crewSharesToInput,
  FailWorkOrderMutation,
  GetWorkOrderQuery,
  removeKeyRecursive,
  SalvageOrder,
  ShipMiningOrder,
  UpdateWorkOrderMutation,
  VehicleMiningOrder,
  WorkOrder,
  WorkOrderStateEnum,
} from '@regolithco/common'
import { useGQLErrors } from './useGQLErrors'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
// import log from 'loglevel'

type useSessionsReturn = {
  workOrder?: WorkOrder
  loading: boolean
  querying: boolean
  mutating: boolean
  updateWorkOrder: (newWorkOrder: WorkOrder) => void
  failWorkOrder: (reason?: string) => void
  deleteWorkOrder: () => void
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
  const failWorkOrderMutation = useFailWorkOrderMutation()
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
  const mutations = [
    updateWorkOrderMutation,
    deleteWorkOrderMutation,
    upsertCrewShareMutation,
    failWorkOrderMutation,
    deleteCrewShareMutation,
  ]

  const querying = queries.some((q) => q.loading)
  const mutating = mutations.some((m) => m[1].loading)

  useGQLErrors(queries, mutations)

  return {
    workOrder: workOrderQry.data?.workOrder as WorkOrder,
    querying,
    loading: querying || mutating,
    mutating,
    updateWorkOrder: (newWorkOrder: WorkOrder) => {
      const {
        crewShares,
        isRefined,
        method,
        note,
        sellerscName,
        processStartTime,
        refinery,
        shareAmount,
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
            note,
            isRefined,
            sellerscName,
            includeTransferFee,
            method,
            processStartTime,
            refinery,
            shareRefinedValue,
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
    failWorkOrder: (reason?: string) => {
      const fail = reason && reason.trim().length > 0
      failWorkOrderMutation[0]({
        variables: {
          sessionId,
          orderId,
          reason,
        },
        optimisticResponse: () => {
          const optimisticresponse: FailWorkOrderMutation = {
            __typename: 'Mutation',
            failWorkOrder: {
              ...(workOrderQry.data?.workOrder as WorkOrder),
              failReason: fail ? reason : null,
              state: fail ? WorkOrderStateEnum.Failed : WorkOrderStateEnum.Unknown,
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
