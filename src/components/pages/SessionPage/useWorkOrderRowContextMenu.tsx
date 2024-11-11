import React from 'react'
import { DeleteForever } from '@mui/icons-material'
import { useSessionContextMenu } from '../../modals/SessionContextMenu'
import { useWorkOrders } from '../../../hooks/useWorkOrder'
import { makeHumanIds, WorkOrder } from '@regolithco/common'
import { AppContext } from '../../../context/app.context'
import { OrderIcon } from './OrderIcon'

export const useWorkOrderRowContextMenu = (
  order: WorkOrder,
  isPaid: boolean,
  allowEdit: boolean,
  onGotoWorkOrder?: (sessionId: string, orderId: string) => void,
  onOpenDeleteConfirm?: () => void
) => {
  const { getSafeName } = React.useContext(AppContext)
  const { deleteWorkOrder, updateWorkOrder, workOrder } = useWorkOrders(order.sessionId, order.orderId)

  const { contextMenuNode, handleContextMenu } = useSessionContextMenu(() =>
    workOrder
      ? {
          header: `Work Order: ${makeHumanIds(
            getSafeName(workOrder.sellerscName || workOrder.owner?.scName),
            workOrder?.orderId
          )}`,
          headerAvatar: <OrderIcon orderType={workOrder.orderType} />,
          menuItems: [
            {
              label: 'View work order',
              onClick: () => onGotoWorkOrder && onGotoWorkOrder(workOrder.sessionId, workOrder?.orderId),
            },
            {
              label: 'Mark all shares paid',
              disabled: isPaid || !allowEdit,
              onClick: () => {
                updateWorkOrder({
                  ...workOrder,
                  crewShares: (workOrder?.crewShares || []).map((s) => ({ ...s, state: true })),
                })
              },
            },
            {
              label: `Mark work order ${workOrder?.isSold ? 'unsold' : 'sold'}`,
              disabled: !allowEdit,
              onClick: () => {
                updateWorkOrder({ ...workOrder, isSold: !workOrder.isSold })
              },
            },
            {
              divider: true,
              label: '',
            },
            {
              label: 'Delete work order',
              disabled: !allowEdit || !onOpenDeleteConfirm,
              color: 'error',
              icon: <DeleteForever fontSize="small" color="error" />,
              onClick: onOpenDeleteConfirm ? () => onOpenDeleteConfirm() : undefined,
            },
          ],
        }
      : {
          header: 'Work Order (unloaded',
          menuItems: [],
        }
  )

  return { contextMenuNode, handleContextMenu }
}
