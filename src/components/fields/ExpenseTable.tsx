import React from 'react'
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
  Box,
  Typography,
  IconButton,
  TextField,
  Tooltip,
  TableHead,
  Select,
  MenuItem,
} from '@mui/material'
import { jsRound, WorkOrder, WorkOrderDefaults, WorkOrderExpense, WorkOrderSummary } from '@regolithco/common'
import { Cancel } from '@mui/icons-material'
import { fontFamilies } from '../../theme'
import Numeral from 'numeral'
import { MValue, MValueFormat } from './MValue'
import log from 'loglevel'

export interface ExpenseTableProps {
  workOrder: WorkOrder
  onChange: (workOrder: WorkOrder) => void
  isEditing?: boolean
  isShare?: boolean
  summary: WorkOrderSummary
  templateJob?: WorkOrderDefaults
}

export type ExpenseRow = Omit<WorkOrderExpense, '__typename'> & { idx: number }

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ workOrder, summary, onChange, isEditing, templateJob }) => {
  const theme = useTheme()
  // const styles = stylesThunk(theme)
  const [editingRow, setEditingRow] = React.useState<number | null>(null)
  const customExpenses = workOrder.expenses || []
  const expenses: ExpenseRow[] = []

  let hasTransferFee = false
  if (workOrder.includeTransferFee && summary.transferFees > 0) {
    hasTransferFee = true
    expenses.push({
      name: 'moTRADER',
      amount: (summary?.transferFees as number) > -1 ? (summary.transferFees as number) || 0 : 0,
      ownerScName: workOrder.sellerscName || (workOrder.owner?.scName as string),
      idx: -1,
    })
  }
  customExpenses.forEach(({ name, amount, ownerScName }, idx) => {
    expenses.push({
      name,
      amount,
      ownerScName,
      idx,
    })
  })

  const totalExpenses = expenses.reduce((acc, { amount }) => acc + amount, 0)

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
        <TableHead>
          <TableRow
            sx={{
              '& .MuiTableCell-root': {
                color: theme.palette.text.secondary,
                fontFamily: fontFamilies.robotoMono,
                fontSize: theme.typography.caption.fontSize,
                fontWeight: 'bold',
              },
            }}
          >
            <TableCell scope="row" sx={{ fontWeight: 'bold' }} width={200}>
              Claimant
            </TableCell>
            <TableCell scope="row" sx={{ fontWeight: 'bold' }}>
              Expense
            </TableCell>
            <TableCell scope="row" sx={{ textAlign: 'right', fontWeight: 'bold' }}></TableCell>
            {isEditing && <TableCell padding="none"></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.length === 0 && (
            <TableRow>
              <TableCell align="center" colSpan={3}>
                <Typography variant="caption" color={theme.palette.text.disabled}>
                  <em>No Expenses</em>
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {expenses.map(({ name, amount, ownerScName, idx }) => {
            const isMoTraderRow = hasTransferFee && idx === -1
            return (
              <TableRow
                key={`expensesRows-${idx}`}
                sx={{
                  background: isMoTraderRow ? '#35353577' : 'transparent',
                }}
                onClick={() => {
                  if (!isEditing || isMoTraderRow) return
                  setEditingRow(idx)
                }}
              >
                <TableCell scope="row">
                  <ExpenseClaimant
                    scName={ownerScName}
                    options={workOrder.crewShares?.map((e) => e.payeeScName) || []}
                    isEditing={!isMoTraderRow && !!isEditing}
                    onCancel={() => setEditingRow(null)}
                    onChange={(val) => {
                      const newExpenses = [...(workOrder.expenses || [])]
                      newExpenses[idx] = { ...newExpenses[idx], ownerScName: val } // Create a new object
                      onChange({
                        ...workOrder,
                        expenses: newExpenses,
                      })
                    }}
                  />
                </TableCell>
                <TableCell scope="row">
                  <ExpenseRowName
                    name={name}
                    isEditing={Boolean(isEditing && !isMoTraderRow && editingRow === idx)}
                    onCancel={() => setEditingRow(null)}
                    onChange={(val) => {
                      const newExpenses = [...(workOrder.expenses || [])]
                      newExpenses[idx] = { ...newExpenses[idx], name: val } // Create a new object
                      onChange({
                        ...workOrder,
                        expenses: newExpenses,
                      })
                    }}
                  />
                </TableCell>
                <TableCell scope="row" sx={{ textAlign: 'right' }}>
                  <ExpenseRowAmount
                    amount={amount}
                    isEditing={Boolean(isEditing && !isMoTraderRow && editingRow === idx)}
                    onCancel={() => setEditingRow(null)}
                    onChange={(val) => {
                      const newExpenses = [...(workOrder.expenses || [])]
                      newExpenses[idx] = { ...newExpenses[idx], amount: val } // Create a new object
                      onChange({
                        ...workOrder,
                        expenses: newExpenses,
                      })
                    }}
                  />
                </TableCell>
                {isEditing && (
                  <>
                    {!isMoTraderRow ? (
                      <TableCell padding="none">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            const newExpenses = [...(workOrder.expenses || [])]
                            newExpenses.splice(idx, 1)
                            onChange({
                              ...workOrder,
                              expenses: newExpenses,
                            })
                          }}
                        >
                          <Cancel />
                        </IconButton>
                      </TableCell>
                    ) : (
                      <Tooltip title="Automatic. Remove using the settings radio buttons">
                        <TableCell padding="none">
                          <IconButton size="small" color="error" disabled>
                            <Cancel />
                          </IconButton>
                        </TableCell>
                      </Tooltip>
                    )}
                  </>
                )}
              </TableRow>
            )
          })}

          {expenses.length >= 1 && (
            <TableRow
              sx={{
                '& .MuiTableCell-root': {
                  pt: 1,
                  borderTop: `2px solid ${theme.palette.secondary.dark}`,
                  borderBottom: 'none',
                },
              }}
            >
              <TableCell
                scope="row"
                colSpan={2}
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.text.secondary,
                }}
              >
                Total Expenses:
              </TableCell>
              <TableCell scope="row" sx={{ textAlign: 'right' }}>
                <MValue value={totalExpenses * -1} format={MValueFormat.currency} />
              </TableCell>
              <TableCell padding="none"></TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  )
}

const ExpenseRowName: React.FC<{
  name: string
  isEditing?: boolean
  onChange: (val: string) => void
  onCancel: () => void
}> = ({ name, isEditing, onChange, onCancel }) => {
  // const theme = useTheme()
  // const styles = stylesThunk(theme)
  return (
    <>
      {!isEditing ? (
        name && name.trim().length > 0 ? (
          name
        ) : (
          <em>Expense Name</em>
        )
      ) : (
        <TextField
          fullWidth
          size="small"
          placeholder={'Expense Name'}
          variant="standard"
          value={name}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
              onCancel()
            }
          }}
          onChange={(e) => {
            // Strip out leading whitespace and limit to 20 alphanumeric characters
            const val = e.target.value.replace(/^\s+/, '').slice(0, 20)
            onChange(val)
          }}
          inputProps={{
            sx: {
              m: 0,
              p: 0,
              height: '2rem',
              fontSize: 14,
            },
          }}
          type="text"
          sx={{
            '& .MuiInputBase-root': {
              // borderRadius: 3,
              mt: 0,
              mb: 0,
              p: 0,
            },
            m: 0,
            p: 0,
          }}
        />
      )}
    </>
  )
}

const ExpenseRowAmount: React.FC<{
  amount: number
  isEditing: boolean
  onChange: (val: number) => void
  onCancel: () => void
}> = ({ amount, isEditing, onChange, onCancel }) => {
  const theme = useTheme()
  // const styles = stylesThunk(theme)

  if (!isEditing) return <MValue value={amount * -1} format={MValueFormat.currency} />

  return (
    <TextField
      fullWidth
      autoFocus
      disabled={!isEditing}
      variant="standard"
      value={Numeral(amount * -1).format(`0,0`)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === 'Tab') {
          onCancel()
        }
      }}
      onChange={(e) => {
        try {
          let value = jsRound(parseInt(e.target.value.replace(/[^\d]/g, '').replace(/^0+/, ''), 10), 0)
          if (value < 0) value = value * -1
          if (value > 999999999) value = 9999999
          if (value >= 0) {
            onChange(value)
          } else onChange(0)
        } catch (e) {
          //
          log.error('Expense input error', e)
        }
      }}
      InputProps={{
        endAdornment: (
          <Box
            sx={{
              fontSize: 10,
              ml: 1,
              color: theme.palette.error.main,
              px: 0,
            }}
          >
            aUEC
          </Box>
        ),
      }}
      inputProps={{
        sx: {
          m: 0,
          p: 0,
          height: '2rem',
          textAlign: 'right',
          fontFamily: fontFamilies.robotoMono,
          fontSize: 14,
          color: theme.palette.error.main,
        },
      }}
      type="text"
      sx={{
        '& .MuiInputBase-root': {
          // borderRadius: 3,
          mt: 0,
          mb: 0,
          p: 0,
        },
        m: 0,
        p: 0,
      }}
    />
  )
}

const ExpenseClaimant: React.FC<{
  scName: string
  options: string[]
  isEditing: boolean
  onChange: (val: string) => void
  onCancel: () => void
}> = ({ scName, isEditing, options, onChange, onCancel }) => {
  const theme = useTheme()
  // const styles = stylesThunk(theme)

  if (!isEditing) return scName

  return (
    <Select
      fullWidth
      autoFocus
      disabled={!isEditing}
      size="small"
      variant="standard"
      value={scName}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === 'Tab') {
          onCancel()
        }
      }}
      onChange={(e) => {
        const value = e.target.value
        onChange(value)
      }}
    >
      <Box sx={{ px: 2, py: 1, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Existing Crew Share Holders:
        </Typography>
      </Box>
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  )
}
