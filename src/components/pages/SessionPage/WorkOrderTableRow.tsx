import * as React from 'react'

import { ActivityEnum, makeHumanIds, ShipMiningOrder, WorkOrder, WorkOrderStateEnum } from '@regolithco/common'
import dayjs from 'dayjs'
import { getActivityName, WorkOrderSummary } from '@regolithco/common'
import { Badge, Checkbox, TableCell, TableRow, Tooltip, Typography, useTheme } from '@mui/material'
import { MValue, MValueFormat, MValueFormatter } from '../../fields/MValue'
import { CountdownTimer } from '../../calculators/WorkOrderCalc/CountdownTimer'
import { ClawIcon, GemIcon, RockIcon } from '../../../icons'
import {
  AccountBalance,
  Check,
  CheckCircle,
  Clear,
  Dangerous,
  Factory,
  PriceCheck,
  QuestionMark,
  SvgIconComponent,
} from '@mui/icons-material'
import { fontFamilies } from '../../../theme'
import { SessionContext } from '../../../context/session.context'
import { AppContext } from '../../../context/app.context'

export interface WorkOrderTableRowProps {
  workOrder: WorkOrder
  isShare?: boolean
  openWorkOrderModal?: (orderId: string) => void
  summary: WorkOrderSummary
}

export const WorkOrderTableRow: React.FC<WorkOrderTableRowProps> = ({ workOrder, isShare, summary }) => {
  const theme = useTheme()
  const { getSafeName } = React.useContext(AppContext)
  const { updateModalWorkOrder, openWorkOrderModal, updateAnyWorkOrder } = React.useContext(SessionContext)
  const { owner, createdAt, state, orderType, crewShares } = workOrder
  const shipOrder = workOrder as ShipMiningOrder

  // let stateIcon: React.ReactNode
  const volumeVal = Object.entries(summary.oreSummary).reduce(
    (acc, [oreKey, { collected }]) => acc + collected / 100,
    0
  )

  const isPaid = crewShares?.every(({ state }) => state === true)

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

  // switch (state) {
  //   // case WorkOrderStateEnum.RefiningComplete:
  //   //   stateIcon = <AddBusiness color="success" />
  //   //   break
  //   case WorkOrderStateEnum.Failed:
  //     stateIcon = <Dangerous color="error" />
  //     break
  //   case WorkOrderStateEnum.Done:
  //     stateIcon = <PriceCheck color="success" />
  //     break
  //   case WorkOrderStateEnum.RefiningComplete:
  //     stateIcon = (
  //       <Badge badgeContent={<CheckCircle />}>
  //         <Factory />
  //       </Badge>
  //     )
  //     break
  //   case WorkOrderStateEnum.RefiningStarted:
  //     stateIcon = <Factory color="secondary" />
  //     break
  //   case WorkOrderStateEnum.Unknown:
  //     stateIcon = <QuestionMark />
  //     break
  //   default:
  //     stateIcon = <ClawIcon />
  //     break
  // }
  const onRowClick = () => openWorkOrderModal && openWorkOrderModal(workOrder.orderId)

  return (
    <TableRow key={workOrder.orderId} sx={{ cursor: 'pointer' }}>
      <TableCell align="center" onClick={onRowClick}>
        <Tooltip title={getActivityName(workOrder.orderType)}>
          <OrderIcon />
        </Tooltip>
      </TableCell>
      <TableCell onClick={onRowClick}>
        <MValue
          value={makeHumanIds(getSafeName(workOrder.sellerscName || workOrder.owner?.scName), workOrder.orderId)}
          format={MValueFormat.string}
        />
      </TableCell>
      {/* State */}
      {/* {!isShare && (
        <TableCell align="center" onClick={onRowClick}>
          <Tooltip title={workOrder.state}>{stateIcon}</Tooltip>
        </TableCell>
      )} */}

      {/* crew shares */}
      <TableCell align="center" onClick={onRowClick}>
        {workOrder.crewShares?.length || 0}
      </TableCell>
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
        {oreNames}
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
            Work Order Profit:
            {MValueFormatter(workOrder.shareAmount || summary.shareAmount || 0, MValueFormat.currency)}
          </>
        }
      >
        <TableCell align="right" onClick={onRowClick}>
          <MValue value={workOrder.shareAmount || summary.shareAmount || 0} format={MValueFormat.currency_sm} />
        </TableCell>
      </Tooltip>
      {isShare ? (
        <TableCell align="left" onClick={onRowClick}>
          {summary.completionTime && (
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.primary.light,
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
              }}
            >
              {dayjs(
                shipOrder.processStartTime
                  ? shipOrder.processStartTime + (shipOrder.processDurationS || 0) * 1000
                  : undefined
              ).format('MMM D, h:mm a')}{' '}
              ({new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2]})
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
              typoProps={{
                sx: {
                  color: theme.palette.primary.light,
                },
              }}
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
            updateAnyWorkOrder({ ...workOrder, isSold: !workOrder.isSold }, workOrder.orderId)
          }}
        >
          <Checkbox color={workOrder.isSold ? 'secondary' : 'error'} checked={Boolean(workOrder.isSold)} />
        </TableCell>
      )}
      {!isShare && (
        <TableCell align="center" padding="checkbox" onClick={onRowClick}>
          <Tooltip title={`All crew shares ${isPaid ? 'are' : 'are NOT'} paid`}>
            {isPaid ? <Check color="secondary" /> : <Clear color="error" />}
          </Tooltip>
        </TableCell>
      )}
    </TableRow>
  )
}
