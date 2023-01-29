import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Box,
  Chip,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import { ActivityEnum, OtherOrder, WorkOrderSummary } from '@regolithco/common'
import { MValue, MValueFormat } from '../../../fields/MValue'
import { WorkOrderCalcProps } from '../WorkOrderCalc'
import { fontFamilies } from '../../../../theme'
import { ExpandMore, Help, Percent, PieChart, Toll } from '@mui/icons-material'
import { CrewShareTable } from '../../../fields/crewshare/CrewShareTable'
// import log from 'loglevel'

export type ExpensesSharesCardProps = WorkOrderCalcProps & {
  summary: WorkOrderSummary
}

export const ExpensesSharesCard: React.FC<ExpensesSharesCardProps> = ({
  workOrder,
  summary,
  allowEdit,
  allowPay,
  isEditing,
  onChange,
  onSetCrewSharePaid,
  onDeleteCrewShare,
  userSuggest,
  templateJob,
  sx,
}) => {
  const theme = useTheme()
  const [otherShareAmtEdit, setOtherShareAmtEdit] = useState<boolean>(false)

  const otherOrder = workOrder as OtherOrder
  const expenses: { name: string; value: number }[] = []
  if (workOrder.includeTransferFee) {
    expenses.push({
      name: 'moTRADER',
      value: (summary?.transferFees as number) > -1 ? -1 * ((summary.transferFees as number) || 0) : 0,
    })
  }

  return (
    <Card sx={sx}>
      <CardHeader
        sx={{
          flex: '0 0',
          padding: 1.5,
          color: theme.palette.secondary.contrastText,
          backgroundColor: theme.palette.secondary.light,
        }}
        title={
          <Box
            sx={{
              display: 'flex',
              fontFamily: fontFamilies.robotoMono,
              fontWeight: 'bold',
              fontSize: {
                xs: '0.7rem',
                md: '0.8rem',
                lg: '0.9rem',
              },
              lineHeight: 1,
            }}
          >
            Shares
          </Box>
        }
        subheaderTypographyProps={{ color: 'iherit' }}
      />
      <CardContent sx={{ flex: '1 1', overflowX: { md: 'hidden', sm: 'scroll' }, overflow: { md: 'scroll' } }}>
        {workOrder.orderType === ActivityEnum.Other && (
          <Typography variant="overline">aUEC Amount to share:</Typography>
        )}
        {isEditing && workOrder.orderType === ActivityEnum.Other && (
          <Typography>
            This is useful for sharing aUEC for other activities, missions etc. Simply type in the aUEC amount you want
            to share
          </Typography>
        )}
        {workOrder.orderType === ActivityEnum.Other && isEditing && otherShareAmtEdit && (
          <TextField
            fullWidth
            autoFocus
            defaultValue={otherOrder.shareAmount}
            onFocus={(event) => {
              event.target.select()
            }}
            onBlur={() => setOtherShareAmtEdit(false)}
            onKeyDown={(event) => {
              if (event.key === '.') {
                event.preventDefault()
              }
              if (event.key === 'Enter') {
                // Set next cell down to edit mode
                event.preventDefault()
                setOtherShareAmtEdit(false)
              }
              if (event.key === 'Tab') {
                event.preventDefault()
                // Set next cell down to edit mode
                setOtherShareAmtEdit(false)
              }
              if (event.key === 'Escape') {
                event.preventDefault()
                setOtherShareAmtEdit(false)
              }
            }}
            onChange={(e) => {
              try {
                const value = parseFloat(e.target.value)
                if (value > 0) {
                  onChange({
                    ...otherOrder,
                    shareAmount: value,
                  })
                }
              } catch (e) {
                //
              }
            }}
            inputProps={{
              sx: {
                textAlign: 'right',
                fontFamily: fontFamilies.robotoMono,
                fontSize: 24,
              },
            }}
            type="number"
            sx={{
              my: 2,
              p: 1,
            }}
          />
        )}
        {workOrder.orderType === ActivityEnum.Other && (!isEditing || !otherShareAmtEdit) && (
          <MValue
            value={(workOrder as OtherOrder).shareAmount}
            decimals={0}
            onClick={() => setOtherShareAmtEdit(true)}
            format={MValueFormat.currency}
            typoProps={{
              component: 'div',
              sx: {
                my: 2,
                p: 2,
                border: '1px solid',
                textAlign: 'right',
                fontSize: 24,
              },
            }}
          />
        )}

        {/* The actual control for the crew shares */}
        <CrewShareTable
          allowEdit={allowEdit}
          isEditing={isEditing}
          allowPay={allowPay}
          templateJob={templateJob}
          onChange={onChange}
          onSetCrewSharePaid={onSetCrewSharePaid}
          onDeleteCrewShare={onDeleteCrewShare}
          workOrder={workOrder}
          summary={summary}
          userSuggest={userSuggest}
        />

        <Accordion sx={{ mt: 3 }} disableGutters>
          <AccordionSummary color="info" expandIcon={<ExpandMore color="inherit" />}>
            <Help sx={{ mr: 2 }} color="inherit" /> About Shares
          </AccordionSummary>
          <AccordionDetails>
            <Typography component="div" variant="overline">
              Notes
            </Typography>
            <Typography variant="caption" component="ul">
              <li>Users are not verified. Any valid Star Citizen username will work.</li>
              <li>Any remaining money is assigned back to the owner.</li>
              <li>The owner pays no transfer fee (obviously).</li>
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
                  Example: If Susan has 2 shares and Bob has 1 share, Susan will get 2/3 of the remainder and Bob will
                  get 1/3 since there are 3 shares total.
                </em>
              </li>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  )
}
