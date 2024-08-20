import * as React from 'react'

import {
  ActivityEnum,
  getTimezoneStr,
  makeHumanIds,
  ShipMiningOrder,
  WorkOrder,
  WorkOrderStateEnum,
} from '@regolithco/common'
import dayjs from 'dayjs'
import { getActivityName, WorkOrderSummary } from '@regolithco/common'
import { alpha, Checkbox, Chip, Link, TableCell, TableRow, Tooltip, Typography, useTheme } from '@mui/material'
import { MValue, MValueFormat, MValueFormatter } from '../../fields/MValue'
import { CountdownTimer } from '../../calculators/WorkOrderCalc/CountdownTimer'
import { ClawIcon, GemIcon, RockIcon } from '../../../icons'
import { AccountBalance, DeleteForever, SvgIconComponent } from '@mui/icons-material'
import { fontFamilies } from '../../../theme'
import { SessionContext } from '../../../context/session.context'
import { AppContext } from '../../../context/app.context'
import { useSessionContextMenu } from '../../modals/SessionContextMenu'
import { DeleteWorkOrderModal } from '../../modals/DeleteWorkOrderModal'

export interface WorkOrderTableRowProps {
  workOrder: WorkOrder
  isShare?: boolean
  isDashboard?: boolean
  openWorkOrderModal?: (orderId: string) => void
  summary: WorkOrderSummary
}

export const WorkOrderTableRow: React.FC<WorkOrderTableRowProps> = ({ workOrder, isShare, summary, isDashboard }) => {
  const theme = useTheme()
  const [deleteConfirmModal, setDeleteConfirmModal] = React.useState<boolean>(false)
  const { getSafeName } = React.useContext(AppContext)
  const { session, openWorkOrderModal, updateAnyWorkOrder, myUserProfile, deleteAnyWorkOrder } =
    React.useContext(SessionContext)

  const { orderType, crewShares } = workOrder
  const shipOrder = workOrder as ShipMiningOrder
  const amISessionOwner = session?.ownerId === myUserProfile.userId

  // let stateIcon: React.ReactNode
  const volumeVal = Object.entries(summary.oreSummary).reduce((acc, [, { collected }]) => acc + collected / 100, 0)

  const isPaid = crewShares?.every(({ state }) => state === true)
  const numPaid = crewShares?.filter(({ state }) => state === true).length || 0
  const numCrewShares = (workOrder.crewShares || []).length

  const allowEdit =
    myUserProfile?.userId === workOrder?.ownerId || amISessionOwner || workOrder.sellerscName === myUserProfile?.scName

  let OrderIcon: SvgIconComponent
  switch (orderType) {
    case ActivityEnum.ShipMining:
      OrderIcon = RockIcon
      break
    case ActivityEnum.Salvage:
      OrderIcon = ClawIcon
      break
    case ActivityEnum.VehicleMining:
      OrderIcon = GemIcon
      break
    case ActivityEnum.Other:
      OrderIcon = AccountBalance
      break
    default:
      OrderIcon = ClawIcon
      break
  }
  const finalOres = Object.keys(summary.oreSummary)
  const oreNames =
    workOrder.orderType === ActivityEnum.Other
      ? 'N/A'
      : finalOres.length > 1
        ? finalOres.map((o) => o.slice(0, 3)).join(', ')
        : finalOres[0]
          ? finalOres[0]
          : '???'

  const { contextMenuNode, handleContextMenu } = useSessionContextMenu({
    header: `Work Order: ${makeHumanIds(
      getSafeName(workOrder.sellerscName || workOrder.owner?.scName),
      workOrder.orderId
    )}`,
    headerAvatar: <OrderIcon />,
    menuItems: [
      {
        label: 'View work order',
        onClick: () => openWorkOrderModal && openWorkOrderModal(workOrder.orderId),
      },
      {
        label: 'Mark all shares paid',
        disabled: isPaid || !allowEdit,
        onClick: () => {
          updateAnyWorkOrder(
            {
              ...workOrder,
              crewShares: (workOrder.crewShares || []).map((s) => ({ ...s, state: true })),
            },
            workOrder.orderId
          )
        },
      },
      {
        label: `Mark work order ${workOrder.isSold ? 'unsold' : 'sold'}`,
        disabled: !allowEdit,
        onClick: () => {
          updateAnyWorkOrder({ ...workOrder, isSold: !workOrder.isSold }, workOrder.orderId)
        },
      },
      {
        divider: true,
        label: '',
      },
      {
        label: 'Delete work order',
        disabled: !allowEdit,
        color: 'error',
        icon: <DeleteForever fontSize="small" color="error" />,
        onClick: () => setDeleteConfirmModal(true),
      },
    ],
  })

  const onRowClick = () => openWorkOrderModal && openWorkOrderModal(workOrder.orderId)
  const isFailed = workOrder.state === WorkOrderStateEnum.Failed

  const workOrderGrossShareAmt = isFailed ? 0 : summary.grossValue || 0
  const workOrderNetShareAmt = summary.shareAmount

  return (
    <TableRow
      key={workOrder.orderId}
      onContextMenu={handleContextMenu}
      sx={{
        cursor: 'context-menu',
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
      {contextMenuNode}
      {isDashboard && (
        <TableCell
          align="left"
          sx={{
            maxWidth: 250,
          }}
        >
          <Tooltip title={session?.name}>
            <Link href={`/session/${workOrder.sessionId}`} underline="hover">
              <Typography
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {workOrder.session?.name || workOrder.sessionId}
              </Typography>
            </Link>
          </Tooltip>
        </TableCell>
      )}
      <TableCell align="center" onClick={onRowClick}>
        {isFailed ? (
          <Chip label="FAILED" color="error" size="small" />
        ) : (
          <Tooltip title={getActivityName(workOrder.orderType)}>
            <OrderIcon />
          </Tooltip>
        )}
      </TableCell>

      <TableCell onClick={onRowClick}>
        <MValue
          value={makeHumanIds(getSafeName(workOrder.sellerscName || workOrder.owner?.scName), workOrder.orderId)}
          format={MValueFormat.string}
        />
      </TableCell>

      {/* crew shares */}
      <TableCell align="center" onClick={onRowClick}>
        <Typography>{workOrder.crewShares?.length || 0}</Typography>
      </TableCell>

      {/* ORE NAMES */}
      <TableCell
        onClick={onRowClick}
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
      <TableCell
        onClick={onRowClick}
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
      <Tooltip
        title={
          <>
            Work Order Gross Profit (Total revenue from sale):
            <br />
            {MValueFormatter(workOrderGrossShareAmt, MValueFormat.currency)}
          </>
        }
      >
        <TableCell align="right" onClick={onRowClick}>
          <MValue value={workOrderGrossShareAmt} format={MValueFormat.currency_sm} />
        </TableCell>
      </Tooltip>
      <Tooltip
        title={
          <>
            Work Order Net Profit (Gross Minus Fees/Expenses/costs):
            <br />
            {MValueFormatter(workOrderNetShareAmt, MValueFormat.currency)}
          </>
        }
      >
        <TableCell align="right" onClick={onRowClick}>
          <MValue value={workOrderNetShareAmt} format={MValueFormat.currency_sm} />
        </TableCell>
      </Tooltip>
      {isShare ? (
        <TableCell align="left" onClick={onRowClick}>
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
        <TableCell align="left" onClick={onRowClick}>
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
      {!isShare && (
        <TableCell
          align="center"
          padding="checkbox"
          onClick={() => {
            if (!allowEdit) return
            updateAnyWorkOrder({ ...workOrder, isSold: !workOrder.isSold }, workOrder.orderId)
          }}
        >
          <Checkbox
            disabled={!allowEdit}
            color={workOrder.isSold ? 'secondary' : 'error'}
            checked={Boolean(workOrder.isSold)}
          />
        </TableCell>
      )}
      {!isShare && (
        <TableCell align="center" padding="checkbox" onClick={onRowClick}>
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
            deleteAnyWorkOrder && deleteAnyWorkOrder(workOrder.orderId, workOrder.__typename)
            setDeleteConfirmModal(false)
          }}
        />
      )}
    </TableRow>
  )
}
