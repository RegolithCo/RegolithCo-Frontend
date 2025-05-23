import {
  FailWorkOrderMutation,
  GetWorkOrderDocument,
  GetWorkOrderQuery,
  UpdateWorkOrderMutation,
  useDeleteCrewShareMutation,
  useDeleteWorkOrderMutation,
  useFailWorkOrderMutation,
  useGetWorkOrderQuery,
  useUpdateWorkOrderMutation,
  useUpsertCrewShareMutation,
} from '../schema'
import {
  crewSharesToInput,
  removeKeyRecursive,
  SalvageOrder,
  ShipMiningOrder,
  VehicleMiningOrder,
  WorkOrder,
  WorkOrderStateEnum,
} from '@regolithco/common'
import { useGQLErrors } from './useGQLErrors'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import log from 'loglevel'
import { WorkOrderTypenames } from '../types'

type useSessionsReturn = {
  workOrder?: WorkOrder
  loading: boolean
  querying: boolean
  mutating: boolean
  updateWorkOrder: (newWorkOrder: WorkOrder) => Promise<void>
  failWorkOrder: (reason?: string) => Promise<void>
  deleteWorkOrder: () => Promise<void>
  deleteCrewShare: (scName: string) => Promise<void>
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
    onError: (error) => {
      log.error(error)
      enqueueSnackbar(error.message, { variant: 'error' })
      navigate(`/session/${sessionId}`)
    },
  })

  const updateWorkOrderMutation = useUpdateWorkOrderMutation()
  const failWorkOrderMutation = useFailWorkOrderMutation()
  const deleteWorkOrderMutation = useDeleteWorkOrderMutation()

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
              (cs) => cs.payeeScName !== data?.deleteCrewShare?.payeeScName
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

  const updateWorkOrderArbitrary = (newWorkOrder: WorkOrder, specificOrderId?: string): Promise<void> => {
    const {
      crewShares,
      isRefined,
      isSold,
      method,
      note,
      sellerscName,
      processStartTime,
      processDurationS,
      refinery,
      expenses,
      shareAmount,
      sellStore,
      includeTransferFee,
      shareRefinedValue,
      shipOres,
    } = newWorkOrder as ShipMiningOrder
    const { salvageOres } = newWorkOrder as SalvageOrder
    const { vehicleOres } = newWorkOrder as VehicleMiningOrder
    const filteredExpenses = (expenses || [])
      .filter(({ name }) => name && name.trim().length > 0)
      .map(({ name, amount, ownerScName }) => ({ name, amount, ownerScName }))

    return updateWorkOrderMutation[0]({
      variables: {
        sessionId,
        orderId: specificOrderId || orderId,
        shares: crewSharesToInput(crewShares || []),
        workOrder: {
          note,
          isRefined,
          isSold,
          sellerscName,
          includeTransferFee,
          method: isRefined ? method : null,
          expenses: filteredExpenses,
          processStartTime,
          processDurationS,
          refinery: isRefined ? refinery : null,
          shareRefinedValue,
          shareAmount,
          sellStore,
        },
        shipOres: (shipOres || []).map(({ amt, ore }) => ({ amt, ore })),
        vehicleOres: removeKeyRecursive(vehicleOres, '__typename'),
        salvageOres: removeKeyRecursive(salvageOres, '__typename'),
      },
      optimisticResponse: () => {
        const optimisticresponse: UpdateWorkOrderMutation = {
          __typename: 'Mutation',
          updateWorkOrder: {
            ...workOrderQry.data?.workOrder,
            ...newWorkOrder,
            expenses: filteredExpenses.map(({ name, amount, ownerScName }) => ({
              name,
              amount,
              ownerScName,
              __typename: 'WorkOrderExpense',
            })),
          },
        }
        return optimisticresponse
      },
    }).then()
  }

  return {
    workOrder: workOrderQry.data?.workOrder as WorkOrder,
    querying,
    loading: querying || mutating,
    mutating,
    updateWorkOrder: (newWorkOrder: WorkOrder) => updateWorkOrderArbitrary(newWorkOrder, orderId),
    failWorkOrder: (reason?: string) => {
      const fail = reason && reason.trim().length > 0
      return failWorkOrderMutation[0]({
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
      }).then()
    },
    deleteWorkOrder: () =>
      deleteWorkOrderMutation[0]({
        variables: {
          sessionId,
          orderId,
        },
        onCompleted: () => {
          enqueueSnackbar('Work Order Deleted', { variant: 'success' })
          // If the current path is inside the work order, navigate to the session
          if (window.location.pathname.includes(orderId)) navigate(`/session/${sessionId}`)
        },
        update: (cache) => {
          // need to identify this from anyOrderId NOT workOrderQry.data?.workOrder
          const id = cache.identify({ sessionId, orderId, __typename: workOrderQry.data?.workOrder?.__typename })
          if (!id) return
          cache.evict({ id })
          cache.gc()
        },
        optimisticResponse: () => ({
          __typename: 'Mutation',
          deleteWorkOrder: {
            sessionId,
            orderId,
            __typename: workOrderQry.data?.workOrder?.__typename as WorkOrderTypenames,
          },
        }),
      }).then(),
    deleteCrewShare: (payeeScName: string) => {
      return deleteCrewShareMutation[0]({
        variables: {
          sessionId,
          orderId,
          payeeScName,
        },
        optimisticResponse: () => ({
          __typename: 'Mutation',
          deleteCrewShare: {
            sessionId,
            orderId,
            payeeScName,
            __typename: 'CrewShare',
          },
        }),
      }).then()
    },
  }
}
