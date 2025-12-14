import * as React from 'react'

import { WorkOrder, WorkOrderStateEnum } from '@regolithco/common'
import { calculateWorkOrder, WorkOrderSummary } from '@regolithco/common'
import {
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
import { MValue, MValueFormat, MValueFormatter } from '../../fields/MValue'
import { AccessTime, Factory } from '@mui/icons-material'
import { fontFamilies } from '../../../theme'
import { grey } from '@mui/material/colors'
import { WorkOrderTableColsEnum, WorkOrderTableRow } from './WorkOrderTableRow'
import { LookupsContext } from '../../../context/lookupsContext'

export interface WorkOrderTableProps {
  workOrders: WorkOrder[]
  onRowClick?: (sessionId: string, orderId: string) => void
  reverse?: boolean
  isShare?: boolean
  sessionActive?: boolean
  columns?: WorkOrderTableColsEnum[]
}

const stylesThunk = (theme: Theme, isActive: boolean): Record<string, SxProps<Theme>> => ({
  table: {
    height: '100%',
    overflowX: 'auto',
    overflowY: 'auto',
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
      backgroundColor: isActive ? theme.palette.primary.light : grey[400],
      color: theme.palette.primary.contrastText,
      borderBottom: '2px solid',
    },
  },
  footer: {
    '& .MuiTableCell-root': {
      pb: 5,
      fontSize: '0.8rem',
      color: isActive ? theme.palette.secondary.main : grey[400],
      backgroundColor: '#160800d8',
      borderTop: '2px solid',
      whiteSpace: 'nowrap',
      borderBottom: 'none',
    },
  },
})

export const WorkOrderTable: React.FC<WorkOrderTableProps> = ({
  workOrders,
  isShare,
  reverse,
  columns,
  onRowClick,
  sessionActive,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme, Boolean(sessionActive || isShare))
  const dataStore = React.useContext(LookupsContext)

  // NOTE: Order is REALLY important here
  const [summaries, setSummaries] = React.useState<Record<string, WorkOrderSummary>>()
  const [yieldVolSCU, setYieldVolSCU] = React.useState(0)
  const [grossAmount, setGrossAmount] = React.useState<number | bigint>(0)
  const [shareAmount, setShareAmount] = React.useState<number | bigint>(0)
  const [sortedWorkOrders, setSortedWorkOrders] = React.useState([...workOrders])

  const workOrderTableRows = React.useMemo(
    () =>
      sortedWorkOrders.map((workOrder) => {
        // Might have to wait for the summaries to catch up
        if (!summaries || !summaries[workOrder.orderId]) return null
        return (
          <WorkOrderTableRow
            key={workOrder.orderId}
            workOrder={workOrder}
            summary={summaries[workOrder.orderId]}
            columns={columns}
            onRowClick={onRowClick}
            isShare={isShare}
          />
        )
      }),
    [sortedWorkOrders, summaries, columns, onRowClick, isShare]
  )

  React.useEffect(() => {
    if (!dataStore.ready) return
    const calcWorkOrders = async () => {
      const sortedWorkOrders = [...workOrders].sort((a, b) =>
        reverse ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
      )
      setSortedWorkOrders(sortedWorkOrders)

      const summaries: Record<string, WorkOrderSummary> = {}
      for (const workOrder of sortedWorkOrders) {
        summaries[workOrder.orderId] = await calculateWorkOrder(dataStore, workOrder)
      }
      setSummaries(summaries)

      const volSCU = Object.values(summaries).reduce((acc, summary) => acc + summary.yieldSCU, 0)
      setYieldVolSCU(volSCU)

      const [grossAmt, shareAmt] = workOrders.reduce(
        (acc, wo) => {
          const newGross = wo.state === WorkOrderStateEnum.Failed ? acc[0] : acc[0] + summaries[wo.orderId].grossValue
          const newNet = acc[1] + summaries[wo.orderId].shareAmount
          return [newGross, newNet]
        },
        [0n, 0n]
      )
      setGrossAmount(grossAmt)
      setShareAmount(shareAmt)
    }
    calcWorkOrders()
  }, [dataStore, workOrders])

  const totalCols = columns ? columns.length - 1 : Object.keys(WorkOrderTableColsEnum).length
  let footerColSpan = totalCols
  if (!columns) footerColSpan -= 6
  else {
    if (columns.includes(WorkOrderTableColsEnum.Gross)) footerColSpan--
    if (columns.includes(WorkOrderTableColsEnum.Net)) footerColSpan--
    if (columns.includes(WorkOrderTableColsEnum.Sold)) footerColSpan--
    if (columns.includes(WorkOrderTableColsEnum.Paid)) footerColSpan--
    if (columns.includes(WorkOrderTableColsEnum.FinishedTime)) footerColSpan--
  }

  if (!dataStore.ready) return <div>Loading...</div>
  if (!summaries) return null
  return (
    <TableContainer sx={styles.table}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow sx={styles.tableHead}>
            {(!columns || columns.includes(WorkOrderTableColsEnum.Session)) && <TableCell>Session</TableCell>}
            {(!columns || columns.includes(WorkOrderTableColsEnum.Activity)) && (
              <TableCell align="center">Type</TableCell>
            )}
            {(!columns || columns.includes(WorkOrderTableColsEnum.Refinery)) && (
              <TableCell align="left">
                <Tooltip title="Refinery">
                  <Factory />
                </Tooltip>
              </TableCell>
            )}
            {(!columns || columns.includes(WorkOrderTableColsEnum.OrderId)) && <TableCell>Order Id</TableCell>}
            {(!columns || columns.includes(WorkOrderTableColsEnum.Shares)) && (
              <TableCell align="center">Shares</TableCell>
            )}
            {(!columns || columns.includes(WorkOrderTableColsEnum.Ores)) && <TableCell>Ores</TableCell>}
            {(!columns || columns.includes(WorkOrderTableColsEnum.Volume)) && (
              <TableCell align="right">
                <Tooltip placement="top" title={<>Yielded Ore Volume (SCU)</>}>
                  <span>Yield</span>
                </Tooltip>
              </TableCell>
            )}
            {(!columns || columns.includes(WorkOrderTableColsEnum.Gross)) && (
              <TableCell align="right">
                <Tooltip placement="top" title={<>Work Order Gross Profit (Total revenue from sale)</>}>
                  <span>Gross</span>
                </Tooltip>
              </TableCell>
            )}
            {(!columns || columns.includes(WorkOrderTableColsEnum.Net)) && (
              <TableCell align="right">
                <Tooltip placement="top" title={<>Work Order Net Profit (Total profit after expenses)</>}>
                  <span>Net</span>
                </Tooltip>
              </TableCell>
            )}
            {(!columns || columns.includes(WorkOrderTableColsEnum.FinishedTime)) && (
              <TableCell align="left">
                <Tooltip placement="top" title="Finished At / Time left">
                  <AccessTime />
                </Tooltip>
              </TableCell>
            )}
            {!isShare && (!columns || columns.includes(WorkOrderTableColsEnum.Sold)) && (
              <TableCell align="center">
                <Tooltip placement="top" title="Is this work order sold?">
                  <span>Sold</span>
                </Tooltip>
              </TableCell>
            )}
            {!isShare && (!columns || columns.includes(WorkOrderTableColsEnum.Paid)) && (
              <TableCell align="center">
                <Tooltip placement="top" title="Crew shares paid / Total Crew Shares">
                  <span>Paid/Shares</span>
                </Tooltip>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>{workOrderTableRows}</TableBody>
        <TableFooter sx={styles.footer}>
          <TableRow>
            <TableCell colSpan={footerColSpan}>Totals</TableCell>
            {(!columns || columns.includes(WorkOrderTableColsEnum.Volume)) && (
              <TableCell align="right">
                <MValue value={yieldVolSCU} format={MValueFormat.volSCU} decimals={yieldVolSCU > 10 ? 0 : 1} />
              </TableCell>
            )}
            {(!columns || columns.includes(WorkOrderTableColsEnum.Gross)) && (
              <Tooltip title={<>Gross Profit: {MValueFormatter(grossAmount, MValueFormat.currency)}</>}>
                <TableCell align="right">
                  <MValue value={grossAmount} format={MValueFormat.currency_sm} />
                </TableCell>
              </Tooltip>
            )}
            {(!columns || columns.includes(WorkOrderTableColsEnum.Net)) && (
              <Tooltip title={<>Net Profit: {MValueFormatter(shareAmount, MValueFormat.currency)}</>}>
                <TableCell align="right">
                  <MValue value={shareAmount} format={MValueFormat.currency_sm} />
                </TableCell>
              </Tooltip>
            )}
            {!isShare && (!columns || columns.includes(WorkOrderTableColsEnum.FinishedTime)) && (
              <TableCell align="right" />
            )}
            {!isShare && (!columns || columns.includes(WorkOrderTableColsEnum.Sold)) && <TableCell align="right" />}
            {!isShare && (!columns || columns.includes(WorkOrderTableColsEnum.Paid)) && <TableCell align="right" />}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}
