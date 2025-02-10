import * as React from 'react'

import {
  ActivityEnum,
  getTimezoneStr,
  makeHumanIds,
  ObjectValues,
  ShipMiningOrder,
  WorkOrder,
  WorkOrderStateEnum,
} from '@regolithco/common'
import dayjs from 'dayjs'
import { WorkOrderSummary } from '@regolithco/common'
import {
  alpha,
  Checkbox,
  Chip,
  IconButton,
  Link,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { MValue, MValueFormat, MValueFormatter } from '../../fields/MValue'
import { CountdownTimer } from '../../calculators/WorkOrderCalc/CountdownTimer'
import { OpenInNew } from '@mui/icons-material'
import { fontFamilies } from '../../../theme'
import { SessionContext } from '../../../context/session.context'
import { AppContext } from '../../../context/app.context'
import { DeleteWorkOrderModal } from '../../modals/DeleteWorkOrderModal'
import { RefineryIcon } from '../../fields/RefineryIcon'
import { useWorkOrders } from '../../../hooks/useWorkOrder'
import { OrderIcon } from './OrderIcon'
import { useWorkOrderRowContextMenu } from './useWorkOrderRowContextMenu'

export interface WorkOrderTableRowProps {
  workOrder: WorkOrder
  isShare?: boolean
  disableContextMenu?: boolean
  onRowClick?: (sessionId: string, orderId: string) => void
  summary: WorkOrderSummary
  columns?: WorkOrderTableColsEnum[]
}

export const WorkOrderTableColsEnum = {
  Session: 'Session',
  Activity: 'Activity',
  Refinery: 'Refinery',
  OrderId: 'Order ID',
  Shares: 'Shares',
  Ores: 'Ores',
  Volume: 'Volume',
  Gross: 'Gross',
  Net: 'Net',
  FinishedTime: 'Finished Time',
  Sold: 'Sold',
  Paid: 'Paid',
} as const
export type WorkOrderTableColsEnum = ObjectValues<typeof WorkOrderTableColsEnum>

export const WorkOrderTableRow: React.FC<WorkOrderTableRowProps> = ({
  workOrder,
  isShare,
  summary,
  columns,
  disableContextMenu,
  onRowClick,
}) => {
  const theme = useTheme()
  const { deleteWorkOrder, updateWorkOrder } = useWorkOrders(workOrder.sessionId, workOrder.orderId)
  const [deleteConfirmModal, setDeleteConfirmModal] = React.useState<boolean>(false)
  const { getSafeName } = React.useContext(AppContext)
  // updateAnyWorkOrder, deleteAnyWorkOrder Can get this from useWorkoRder
  // myUserProfile can get this from userQry
  const { session, myUserProfile } = React.useContext(SessionContext)

  // TODO: How do we get this???
  const amISessionOwner = myUserProfile && session?.ownerId === myUserProfile.userId
  const canEdit =
    myUserProfile?.userId === workOrder?.ownerId || amISessionOwner || workOrder.sellerscName === myUserProfile?.scName

  const { crewShares } = workOrder
  const shipOrder = workOrder as ShipMiningOrder

  // let stateIcon: React.ReactNode
  const volumeVal = summary.yieldSCU

  const isPaid = !!crewShares?.every(({ state }) => state === true)
  const numPaid = crewShares?.filter(({ state }) => state === true).length || 0
  const numCrewShares = (workOrder.crewShares || []).length

  const { handleContextMenu, contextMenuNode } = useWorkOrderRowContextMenu(
    workOrder,
    isPaid,
    !!canEdit,
    onRowClick,
    () => setDeleteConfirmModal(true)
  )

  const allowEdit =
    myUserProfile?.userId === workOrder?.ownerId || amISessionOwner || workOrder.sellerscName === myUserProfile?.scName
  const finalOres = Object.keys(summary.oreSummary)
  const oreNames =
    workOrder.orderType === ActivityEnum.Other
      ? 'N/A'
      : finalOres.length > 1
        ? finalOres.map((o) => o.slice(0, 3)).join(', ')
        : finalOres[0]
          ? finalOres[0]
          : '???'

  const onRowClickInner = () => onRowClick && onRowClick(workOrder.sessionId, workOrder.orderId)
  const isFailed = workOrder.state === WorkOrderStateEnum.Failed

  const workOrderGrossShareAmt = isFailed ? 0 : summary.grossValue || 0
  const workOrderNetShareAmt = summary.shareAmount
  const hasHover = canEdit || onRowClick
  return (
    <TableRow
      key={workOrder.orderId}
      onContextMenu={handleContextMenu}
      sx={{
        cursor: canEdit ? 'context-menu' : onRowClick ? 'pointer' : 'default',
        '&:hover': hasHover
          ? {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }
          : {},
        backgroundColor: isFailed ? alpha(theme.palette.error.dark, 0.1) : undefined,
        fontFamily: fontFamilies.robotoMono,
        fontWeight: 'bold',
        '& .MuiTypography-root': {
          fontFamily: fontFamilies.robotoMono,
          fontWeight: 'bold',
          color: isFailed ? theme.palette.error.main : undefined,
        },
      }}
    >
      {canEdit && contextMenuNode}
      {(!columns || columns.includes(WorkOrderTableColsEnum.Session)) && (
        <TableCell
          align="left"
          sx={{
            maxWidth: 250,
          }}
        >
          <Typography
            component="div"
            sx={{
              fontFamily: fontFamilies.robotoMono,
              fontSize: '0.8rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <Tooltip title={`Open this session in a new tab`}>
              <IconButton
                // href={`/session/${workOrder.sessionId}/dash/w/${workOrder.orderId}`}
                href={`/session/${workOrder.sessionId}/dash`}
                target="_blank"
                size="small"
                color="primary"
              >
                <OpenInNew />
              </IconButton>
            </Tooltip>
            <Tooltip title={`Go to session: "${workOrder.session?.name || workOrder.sessionId}`}>
              {/* <Link href={`/session/${workOrder.sessionId}/dash/w/${workOrder.orderId}`} underline="hover"> */}
              <Link href={`/session/${workOrder.sessionId}/dash`} underline="hover">
                {workOrder.session?.name || workOrder.sessionId}
              </Link>
            </Tooltip>
          </Typography>
        </TableCell>
      )}
      {(!columns || columns.includes(WorkOrderTableColsEnum.Activity)) && (
        <TableCell align="center" onClick={onRowClickInner}>
          {isFailed ? (
            <Chip label="FAILED" color="error" size="small" />
          ) : (
            <OrderIcon orderType={workOrder.orderType} />
          )}
        </TableCell>
      )}
      {(!columns || columns.includes(WorkOrderTableColsEnum.Refinery)) && (
        <TableCell align="center" onClick={onRowClickInner}>
          {shipOrder.isRefined && shipOrder.refinery && <RefineryIcon shortName={shipOrder.refinery} />}
        </TableCell>
      )}
      {(!columns || columns.includes(WorkOrderTableColsEnum.OrderId)) && (
        <TableCell onClick={onRowClickInner}>
          {!onRowClick && (
            <Tooltip title={`Open this work order in a new tab`}>
              <IconButton
                href={`/session/${workOrder.sessionId}/dash/w/${workOrder.orderId}`}
                target="_blank"
                size="small"
                color="primary"
              >
                <OpenInNew />
              </IconButton>
            </Tooltip>
          )}
          {!onRowClick ? (
            <Link href={`/session/${workOrder.sessionId}/dash/w/${workOrder.orderId}`} underline="hover">
              <MValue
                value={makeHumanIds(getSafeName(workOrder.sellerscName || workOrder.owner?.scName), workOrder.orderId)}
                format={MValueFormat.string}
              />
            </Link>
          ) : (
            <MValue
              value={makeHumanIds(getSafeName(workOrder.sellerscName || workOrder.owner?.scName), workOrder.orderId)}
              format={MValueFormat.string}
            />
          )}
        </TableCell>
      )}

      {/* crew shares */}
      {(!columns || columns.includes(WorkOrderTableColsEnum.Shares)) && (
        <TableCell align="center" onClick={onRowClickInner}>
          <Typography>{workOrder.crewShares?.length || 0}</Typography>
        </TableCell>
      )}

      {/* ORE NAMES */}
      {(!columns || columns.includes(WorkOrderTableColsEnum.Ores)) && (
        <TableCell
          onClick={onRowClickInner}
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: workOrder.orderType === ActivityEnum.Other ? theme.palette.text.disabled : undefined,
            maxWidth: 150,
          }}
        >
          <Typography>{oreNames}</Typography>
        </TableCell>
      )}

      {/* Volume */}
      {(!columns || columns.includes(WorkOrderTableColsEnum.Volume)) && (
        <TableCell
          onClick={onRowClickInner}
          align="right"
          sx={{
            color: workOrder.orderType === ActivityEnum.Other ? theme.palette.text.disabled : undefined,
          }}
        >
          {workOrder.orderType === ActivityEnum.Other ? (
            'N/A'
          ) : (
            <MValue value={volumeVal} format={MValueFormat.volSCU} decimals={volumeVal > 10 ? 0 : 1} />
          )}
        </TableCell>
      )}

      {(!columns || columns.includes(WorkOrderTableColsEnum.Gross)) && (
        <Tooltip
          title={
            <>
              Work Order Gross Profit (Total revenue from sale):
              <br />
              {MValueFormatter(workOrderGrossShareAmt, MValueFormat.currency)}
            </>
          }
        >
          <TableCell align="right" onClick={onRowClickInner}>
            <MValue value={workOrderGrossShareAmt} format={MValueFormat.currency_sm} />
          </TableCell>
        </Tooltip>
      )}

      {(!columns || columns.includes(WorkOrderTableColsEnum.Net)) && (
        <Tooltip
          title={
            <>
              Work Order Net Profit (Gross Minus Fees/Expenses/costs):
              <br />
              {MValueFormatter(workOrderNetShareAmt, MValueFormat.currency)}
            </>
          }
        >
          <TableCell align="right" onClick={onRowClickInner}>
            <MValue value={workOrderNetShareAmt} format={MValueFormat.currency_sm} />
          </TableCell>
        </Tooltip>
      )}
      {(!columns || columns.includes(WorkOrderTableColsEnum.FinishedTime)) && (
        <>
          {isShare ? (
            <TableCell align="left" onClick={onRowClickInner}>
              {summary.completionTime && (
                <Typography>
                  {dayjs(
                    shipOrder.processStartTime
                      ? shipOrder.processStartTime + (shipOrder.processDurationS || 0) * 1000
                      : undefined
                  ).format('MMM D, h:mm a')}{' '}
                  ({getTimezoneStr()})
                </Typography>
              )}
            </TableCell>
          ) : (
            <TableCell align="left" onClick={onRowClickInner}>
              {summary.completionTime && summary.completionTime > Date.now() ? (
                <CountdownTimer
                  startTime={shipOrder.processStartTime as number}
                  totalTime={(shipOrder.processDurationS || 0) * 1000}
                  useMValue
                />
              ) : (
                <MValue value={workOrder.createdAt} format={MValueFormat.dateTime} />
              )}
            </TableCell>
          )}
        </>
      )}
      {!isShare && (!columns || columns.includes(WorkOrderTableColsEnum.Sold)) && (
        <TableCell
          align="center"
          padding="checkbox"
          onClick={() => {
            if (!allowEdit) return
            updateWorkOrder({ ...workOrder, isSold: !workOrder.isSold })
          }}
        >
          <Checkbox
            disabled={!allowEdit}
            color={workOrder.isSold ? 'secondary' : 'error'}
            checked={Boolean(workOrder.isSold)}
          />
        </TableCell>
      )}
      {!isShare && (!columns || columns.includes(WorkOrderTableColsEnum.Paid)) && (
        <TableCell align="center" padding="checkbox" onClick={onRowClickInner}>
          <Tooltip title={`All crew shares ${isPaid ? 'are' : 'are NOT'} paid`}>
            {numCrewShares > 1 ? (
              <Typography>
                {numPaid}/{(workOrder.crewShares || []).length}
              </Typography>
            ) : (
              <Typography>N/A</Typography>
            )}
          </Tooltip>
        </TableCell>
      )}
      {deleteConfirmModal && (
        <DeleteWorkOrderModal
          onClose={() => setDeleteConfirmModal(false)}
          open
          onConfirm={() => {
            deleteWorkOrder && deleteWorkOrder()
            setDeleteConfirmModal(false)
          }}
        />
      )}
    </TableRow>
  )
}
