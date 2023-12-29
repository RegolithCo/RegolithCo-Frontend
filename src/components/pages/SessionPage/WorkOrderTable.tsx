import * as React from 'react'

import { SessionStateEnum, WorkOrder } from '@regolithco/common'
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
import { useAsyncLookupData } from '../../../hooks/useLookups'

export interface WorkOrderTableProps {
  isDashboard?: boolean
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

  // NOTE: Order is REALLY important here
  const [summaries, setSummaries] = React.useState<Record<string, WorkOrderSummary>>()
  const [volSCU, setVolSCU] = React.useState(0)
  const [shareAmount, setShareAmount] = React.useState(0)
  const [sortedWorkOrders, setSortedWorkOrders] = React.useState([...workOrders])

  const { lookupLoading } = useAsyncLookupData<void>(async (ds) => {
    const sortedWorkOrders = [...workOrders].sort((a, b) => a.createdAt - b.createdAt)
    setSortedWorkOrders(sortedWorkOrders)

    const summaries: Record<string, WorkOrderSummary> = {}
    for (const workOrder of sortedWorkOrders) {
      summaries[workOrder.orderId] = await calculateWorkOrder(ds, workOrder)
    }
    setSummaries(summaries)

    const volSCU = Object.values(summaries).reduce(
      (acc, summary) =>
        acc +
        (summary.oreSummary ? Object.values(summary.oreSummary).reduce((acc, ore) => acc + ore.collected, 0) : 0) / 100,
      0
    )
    setVolSCU(volSCU)

    const shareAmount = Object.values(summaries).reduce((acc, summary) => acc + summary.shareAmount, 0)
    setShareAmount(shareAmount)
  }, [])

  if (lookupLoading) return <div>Loading...</div>
  if (!summaries) return null
  return (
    <TableContainer sx={styles.table}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow sx={styles.tableHead}>
            <TableCell align="center">Type</TableCell>
            <TableCell>Order Id</TableCell>
            <TableCell align="center">Shares</TableCell>
            <TableCell>Ores</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Gross Profit</TableCell>
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
          {sortedWorkOrders.map((workOrder: WorkOrder) => (
            <WorkOrderTableRow
              key={`wo-${workOrder.orderId}`}
              workOrder={workOrder}
              isShare={isShare}
              summary={summaries[workOrder.orderId]}
            />
          ))}
        </TableBody>
        <TableFooter sx={styles.footer}>
          <TableRow>
            <TableCell colSpan={4}>Totals</TableCell>
            <TableCell align="right">
              <MValue value={volSCU} format={MValueFormat.volSCU} decimals={volSCU > 10 ? 0 : 1} />
            </TableCell>
            <Tooltip title={<>Gross Profit: {MValueFormatter(shareAmount, MValueFormat.currency)}</>}>
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
