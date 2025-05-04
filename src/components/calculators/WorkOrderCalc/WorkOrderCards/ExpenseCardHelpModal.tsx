import React from 'react'
import { Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip } from '@mui/material'
import { WorkOrder } from '@regolithco/common'
import { Help, Percent, PieChart, Toll } from '@mui/icons-material'
import { Stack } from '@mui/system'

export type ExpenseCardHelpModalProps = {
  workOrder: WorkOrder
  isEditing?: boolean
  onClose?: () => void
}

export const ExpenseCardHelpModal: React.FC<ExpenseCardHelpModalProps> = ({ onClose, workOrder, isEditing }) => {
  const theme = useTheme()

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 10,
          boxShadow: `0px 0px 10px 5px ${theme.palette.info.light}, 0px 0px 30px 20px black`,
          background: theme.palette.background.default,
          border: `6px solid ${theme.palette.info.main}`,
          px: 2,
          py: 2,
        },
      }}
    >
      <DialogTitle>
        <Help sx={{ mr: 2 }} color="inherit" /> Selling & Profit Sharing
      </DialogTitle>
      <DialogContent>
        {/* Helpful tips and tricks */}
        <Typography component="div" variant="overline">
          Notes
        </Typography>
        <Typography variant="caption" component="ul">
          <li>Users are not verified. Any valid Star Citizen username will work.</li>
          <li>Any remaining money is assigned back to the owner.</li>
          <li>The owner does not pay any transfer fees (obviously).</li>
        </Typography>

        <Typography component="div" variant="overline">
          Share Types
        </Typography>
        <Typography variant="caption" component="ul" sx={{ listStyle: 'none', pl: 0.5 }}>
          <li>
            <Chip icon={<Toll />} label="Flat Rate" color="default" size="small" sx={{ mr: 1 }} />
            User gets a flat rate of the total payouts. moTransfer fees are not deducted from these.
            <br />
            Good for:
            <ul>
              <li>Fixed price security contracts</li>
              <li>Finder's fees</li>
              <li>
                Paying Ransoms.
                <em>"Hey, a dangerous verse is no excuse for an unbalanced ledger."</em>
              </li>
            </ul>
          </li>
          <li>
            <Chip icon={<Percent />} label="Percentage" color="default" size="small" sx={{ mr: 1 }} />
            User gets a percentage of the total payouts after the flat rates have been deducted.
          </li>
          <li>
            <Chip icon={<PieChart />} label="Equal Share" color="default" size="small" sx={{ mr: 1 }} />
            After the flat rates and percentages have been deducted. Whatever is left is divided up. The number
            corresponds to the number of "shares" a user has.
            <br />
            <br />
            <em>
              Example: If Susan has 2 shares and Bob has 1 share, Susan will get 2/3 of the remainder and Bob will get
              1/3 since there are 3 shares total.
            </em>
          </li>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1} sx={{ width: '100%' }} justifyContent={'right'}>
          <Button onClick={onClose}>Ok</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
