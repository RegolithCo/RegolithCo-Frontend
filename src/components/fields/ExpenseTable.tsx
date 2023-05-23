import React from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
  Theme,
  SxProps,
  Box,
  Typography,
} from '@mui/material'
import { ShipMiningOrder, WorkOrder, WorkOrderSummary } from '@regolithco/common'
import { MValue, MValueFormat } from './MValue'
// import log from 'loglevel'

export interface ExpenseTableProps {
  workOrder: WorkOrder
  isEditing?: boolean
  summary: WorkOrderSummary
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  gridContainer: {
    [theme.breakpoints.up('md')]: {},
    '& .MuiTableCell-root *': {
      [theme.breakpoints.down('sm')]: {
        border: '1px solid red',
        fontSize: '0.2rem',
      },
    },
  },
})

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ workOrder, summary, isEditing }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const expenses: { name: string; value: number }[] = []
  if ((workOrder as ShipMiningOrder).isRefined && summary?.refiningCost) {
    expenses.push({
      name: 'Refining Cost',
      value: -1 * (summary?.refiningCost as number),
    })
  }
  if (workOrder.includeTransferFee && summary.transferFees > 0) {
    expenses.push({
      name: 'moTRADER',
      value: (summary?.transferFees as number) > -1 ? -1 * ((summary.transferFees as number) || 0) : 0,
    })
  }

  return (
    <Box
      sx={{
        border: `1px solid ${isEditing ? theme.palette.secondary.main : '#000'}`,
        borderRadius: 3,
        py: 1,
        px: 0.5,
        mb: 2,
      }}
    >
      <Table size="small">
        {/* <TableHead>
          <TableRow>
            <TableCell align="left" component="th">
              Expense Name
            </TableCell>
            <TableCell align="right">Amt.</TableCell>
          </TableRow>
        </TableHead> */}
        <TableBody>
          {expenses.length === 0 && (
            <TableRow>
              <TableCell align="center" colSpan={2}>
                <Typography variant="caption" color={theme.palette.text.disabled}>
                  <em>No Expenses</em>
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {expenses.map(({ name, value }, idx) => (
            <TableRow key={`expensesRows-${idx}`}>
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
              <TableCell align="right">
                <MValue value={value} format={MValueFormat.currency} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
