import * as React from 'react'

import { SessionStateEnum, WorkOrder, WorkOrderStateEnum } from '@regolithco/common'
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
import { AccessTime } from '@mui/icons-material'
import { fontFamilies } from '../../../theme'
import { SessionContext } from '../../../context/session.context'
import { grey } from '@mui/material/colors'
import { WorkOrderTableRow } from './WorkOrderTableRow'
import { LookupsContext } from '../../../context/lookupsContext'

export interface WorkOrderTableProps {
  isDashboard?: boolean // On the session dash we need the session id and owner
  workOrders: WorkOrder[]
  isShare?: boolean
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

export const WorkOrderTable: React.FC<WorkOrderTableProps> = ({ workOrders, isShare, isDashboard }) => {
  const theme = useTheme()
  const { session } = React.useContext(SessionContext)
  const isActive = session?.state === SessionStateEnum.Active
  const styles = stylesThunk(theme, Boolean(isActive || isShare))
  const dataStore = React.useContext(LookupsContext)

  // NOTE: Order is REALLY important here
  const [summaries, setSummaries] = React.useState<Record<string, WorkOrderSummary>>()
  const [volSCU, setVolSCU] = React.useState(0)
  const [grossAmount, setGrossAmount] = React.useState(0)
  const [shareAmount, setShareAmount] = React.useState(0)
  const [sortedWorkOrders, setSortedWorkOrders] = React.useState([...workOrders])

  React.useEffect(() => {
    if (!dataStore.ready) return
    const calcWorkOrders = async () => {
      const sortedWorkOrders = [...workOrders].sort((a, b) => a.createdAt - b.createdAt)
      setSortedWorkOrders(sortedWorkOrders)

      const summaries: Record<string, WorkOrderSummary> = {}
      for (const workOrder of sortedWorkOrders) {
        summaries[workOrder.orderId] = await calculateWorkOrder(dataStore, workOrder)
      }
      setSummaries(summaries)

      const volSCU = Object.values(summaries).reduce(
        (acc, summary) =>
          acc +
          (summary.oreSummary ? Object.values(summary.oreSummary).reduce((acc, ore) => acc + ore.collected, 0) : 0) /
            100,
        0
      )
      setVolSCU(volSCU)

      const [grossAmt, shareAmt] = workOrders.reduce(
        (acc, wo) => {
          const newGross = wo.state === WorkOrderStateEnum.Failed ? acc[0] : acc[0] + summaries[wo.orderId].grossValue
          const newNet = acc[1] + summaries[wo.orderId].shareAmount
          return [newGross, newNet]
        },
        [0, 0]
      )
      setGrossAmount(grossAmt)
      setShareAmount(shareAmt)
    }
    calcWorkOrders()
  }, [dataStore, workOrders])

  if (!dataStore.ready) return <div>Loading...</div>
  if (!summaries) return null
  return (
    <TableContainer sx={styles.table}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow sx={styles.tableHead}>
            {isDashboard && <TableCell>Session</TableCell>}
            <TableCell align="center">Type</TableCell>
            <TableCell>Order Id</TableCell>
            <TableCell align="center">Shares</TableCell>
            <TableCell>Ores</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Gross</TableCell>
            <TableCell align="right">Net</TableCell>
            <TableCell align="left">
              <Tooltip title="Finished At / Time left">
                <AccessTime />
              </Tooltip>
            </TableCell>
            {!isShare && <TableCell align="center">Sold</TableCell>}
            {!isShare && <TableCell align="center">Paid</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedWorkOrders.map((workOrder: WorkOrder) => {
            // Might have to wait for the summaries to catch up
            if (!summaries[workOrder.orderId]) return null
            return (
              <WorkOrderTableRow
                key={`wo-${workOrder.orderId}`}
                workOrder={workOrder}
                isShare={isShare}
                isDashboard={isDashboard}
                summary={summaries[workOrder.orderId]}
              />
            )
          })}
        </TableBody>
        <TableFooter sx={styles.footer}>
          <TableRow>
            <TableCell colSpan={isDashboard ? 5 : 4}>Totals</TableCell>
            <TableCell align="right">
              <MValue value={volSCU} format={MValueFormat.volSCU} decimals={volSCU > 10 ? 0 : 1} />
            </TableCell>
            <Tooltip title={<>Gross Profit: {MValueFormatter(grossAmount, MValueFormat.currency)}</>}>
              <TableCell align="right">
                <MValue value={grossAmount} format={MValueFormat.currency_sm} />
              </TableCell>
            </Tooltip>
            <Tooltip title={<>Net Profit: {MValueFormatter(shareAmount, MValueFormat.currency)}</>}>
              <TableCell align="right">
                <MValue value={shareAmount} format={MValueFormat.currency_sm} />
              </TableCell>
            </Tooltip>
            <TableCell align="right" colSpan={isShare ? 1 : 3} />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}
