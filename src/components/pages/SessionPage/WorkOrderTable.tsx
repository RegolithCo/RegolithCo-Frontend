import * as React from 'react'

import {
  ActivityEnum,
  makeHumanIds,
  OtherOrder,
  ShipMiningOrder,
  WorkOrder,
  WorkOrderStateEnum,
} from '@regolithco/common'
import { getActivityName, calculateWorkOrder, WorkOrderSummary } from '@regolithco/common'
import {
  Badge,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Theme,
  Tooltip,
  useTheme,
} from '@mui/material'
import { MValue, MValueFormat } from '../../fields/MValue'
import { CountdownTimer } from '../../calculators/WorkOrderCalc/CountdownTimer'
import { ClawIcon, GemIcon, RockIcon } from '../../../icons'
import {
  AccessTime,
  CheckCircle,
  Dangerous,
  Diversity3,
  Factory,
  PriceCheck,
  QuestionMark,
  SvgIconComponent,
} from '@mui/icons-material'
import { fontFamilies } from '../../../theme'

export interface WorkOrderTableProps {
  isDashboard?: boolean
  workOrders: WorkOrder[]
  openWorkOrderModal: (orderId: string) => void
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  table: {
    '& .MuiTableCell-root': {
      whiteSpace: 'nowrap',
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
    '& .MuiTableBody-root .MuiTableRow-root:nth-of-type(odd) .MuiTableCell-root': {
      backgroundColor: '#00000055',
    },
  },
  tableHead: {
    '& .MuiTableCell-root': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      borderBottom: '2px solid',
    },
  },
  footer: {
    '& .MuiTableCell-root': {
      fontSize: '0.8rem',
      color: theme.palette.secondary.main,
      backgroundColor: '#160800d8',
      borderTop: '2px solid',
      whiteSpace: 'nowrap',
      borderBottom: 'none',
    },
  },
})

export const WorkOrderTable: React.FC<WorkOrderTableProps> = ({ workOrders, openWorkOrderModal, isDashboard }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)

  const { summaries, volSCU, grossProfit } = React.useMemo(() => {
    const summaries = workOrders.map((workOrder: WorkOrder) => calculateWorkOrder(workOrder))
    return {
      summaries,
      volSCU: summaries.reduce(
        (acc, summary) =>
          acc +
          (summary.oreSummary ? Object.values(summary.oreSummary).reduce((acc, ore) => acc + ore.collected, 0) : 0) /
            1000,
        0
      ),
      grossProfit: summaries.reduce((acc, summary) => acc + summary.grossProfit, 0),
    }
  }, [workOrders])

  workOrders.sort((a, b) => {
    return a.createdAt - b.createdAt
  })

  return (
    <TableContainer
      sx={{ ...styles.table, maxHeight: isDashboard ? 400 : undefined, minHeight: isDashboard ? 300 : undefined }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow sx={styles.tableHead}>
            <TableCell align="center">Type</TableCell>
            <TableCell>Order Id</TableCell>
            <TableCell align="center">State</TableCell>
            <TableCell>Ores</TableCell>
            <TableCell align="center">
              <Tooltip title="Crew Shares">
                <Diversity3 />
              </Tooltip>
            </TableCell>
            <TableCell align="right">Collected</TableCell>
            <TableCell align="right">Gross Profit</TableCell>
            <TableCell align="right">
              <Tooltip title="Finished At / Time left">
                <AccessTime />
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workOrders.map((workOrder: WorkOrder, idx) => (
            <WorkOrderTableRow
              key={`wo-${idx}`}
              workOrder={workOrder}
              openWorkOrderModal={openWorkOrderModal}
              summary={summaries[idx]}
            />
          ))}
        </TableBody>
        <TableFooter sx={styles.footer}>
          <TableRow>
            <TableCell colSpan={5}>Totals</TableCell>
            <TableCell align="right">
              <MValue value={volSCU} format={MValueFormat.volSCU} decimals={1} />
            </TableCell>
            <TableCell align="right">
              <MValue value={grossProfit} format={MValueFormat.currency} />
            </TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

export interface WorkOrderTableRowProps {
  workOrder: WorkOrder
  openWorkOrderModal: (orderId: string) => void
  summary: WorkOrderSummary
}

export const WorkOrderTableRow: React.FC<WorkOrderTableRowProps> = ({ workOrder, openWorkOrderModal, summary }) => {
  const theme = useTheme()
  const { owner, createdAt, state, orderType, crewShares } = workOrder
  const shipOrder = workOrder as ShipMiningOrder
  const otherOrder = workOrder as OtherOrder

  let displayValueCol = 0

  let stateIcon: React.ReactNode
  let volumeVal = Object.entries(summary.oreSummary).reduce((acc, [oreKey, { collected }]) => acc + collected / 100, 0)

  let OrderIcon: SvgIconComponent
  switch (orderType) {
    case ActivityEnum.ShipMining:
      displayValueCol = shipOrder.isRefined ? summary.refinedValue || 0 : summary.unrefinedValue || 0
      OrderIcon = RockIcon
      break
    case ActivityEnum.Salvage:
      displayValueCol = summary.grossProfit
      OrderIcon = ClawIcon
      break
    case ActivityEnum.VehicleMining:
      volumeVal = volumeVal / 10
      displayValueCol = summary.grossProfit
      OrderIcon = GemIcon
      break
    case ActivityEnum.Other:
      displayValueCol = otherOrder.shareAmount || 0
      OrderIcon = QuestionMark
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

  switch (state) {
    // case WorkOrderStateEnum.RefiningComplete:
    //   stateIcon = <AddBusiness color="success" />
    //   break
    case WorkOrderStateEnum.Failed:
      stateIcon = <Dangerous color="error" />
      break
    case WorkOrderStateEnum.Done:
      stateIcon = <PriceCheck color="success" />
      break
    case WorkOrderStateEnum.RefiningComplete:
      stateIcon = (
        <Badge badgeContent={<CheckCircle />}>
          <Factory />
        </Badge>
      )
      break
    case WorkOrderStateEnum.RefiningStarted:
      stateIcon = <Factory color="secondary" />
      break
    case WorkOrderStateEnum.Unknown:
      stateIcon = <QuestionMark />
      break
    default:
      stateIcon = <ClawIcon />
      break
  }

  return (
    <TableRow key={workOrder.orderId} onClick={() => openWorkOrderModal(workOrder.orderId)} sx={{ cursor: 'pointer' }}>
      <TableCell align="center">
        <Tooltip title={getActivityName(workOrder.orderType)}>
          <OrderIcon />
        </Tooltip>
      </TableCell>
      <TableCell>
        <MValue value={makeHumanIds(workOrder.owner?.scName, workOrder.orderId)} format={MValueFormat.string} />
      </TableCell>
      {/* State */}
      <TableCell align="center">
        <Tooltip title={workOrder.state}>{stateIcon}</Tooltip>
      </TableCell>
      <TableCell>{oreNames}</TableCell>
      {/* crew shares */}
      <TableCell align="center">{workOrder.crewShares?.length || 0}</TableCell>
      <TableCell align="right">
        {workOrder.orderType === ActivityEnum.Other ? (
          'N/A'
        ) : (
          <MValue value={volumeVal} format={MValueFormat.volSCU} decimals={1} />
        )}
      </TableCell>
      <TableCell align="right">
        {workOrder.orderType === ActivityEnum.Other ? (
          <MValue value={summary.grossProfit} format={MValueFormat.currency} />
        ) : (
          <MValue value={displayValueCol} format={MValueFormat.currency} />
        )}
      </TableCell>
      <TableCell align="right">
        {summary.completionTime && summary.completionTime > Date.now() ? (
          <CountdownTimer
            startTime={shipOrder.processStartTime as number}
            totalTime={summary.refiningTime}
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
    </TableRow>
  )
}
