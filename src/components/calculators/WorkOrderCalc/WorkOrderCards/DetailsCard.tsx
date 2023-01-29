import React from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  FormGroup,
  Switch,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { ActivityEnum, RefineryEnum, RefineryMethodEnum, ShipMiningOrder, WorkOrderStateEnum } from '@regolithco/common'
import { WorkOrderCalcProps } from '../WorkOrderCalc'
import { fontFamilies } from '../../../../theme'
import { ExpandMore, Help } from '@mui/icons-material'
import { ReferenceTables } from './ReferenceTables'

export type DetailsCardProps = WorkOrderCalcProps

export const DetailsCard: React.FC<DetailsCardProps> = ({
  workOrder,
  onChange,
  allowEdit,
  isEditing,
  templateJob,
  sx,
}) => {
  const theme = useTheme()
  const shipOrder = workOrder as ShipMiningOrder

  // Convenience checked functions
  const isRefinedLocked = (templateJob?.lockedFields || [])?.includes('isRefined')
  const isShareRefinedValueLocked = (templateJob?.lockedFields || [])?.includes('shareRefinedValue')
  const isIncludeTransferFeeLocked = (templateJob?.lockedFields || [])?.includes('includeTransferFee')

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
            Settings
          </Box>
        }
      />
      <CardContent sx={{ flex: '1 1', overflowY: { md: 'scroll' } }}>
        <FormGroup>
          {workOrder.orderType === ActivityEnum.ShipMining && (
            <>
              <Tooltip
                placement="right"
                title={`You can sell unrefined ore quickly but for about 1/2 the price of refining it. ${
                  isEditing && isRefinedLocked ? '(LOCKED BY SESSION OWNER)' : ''
                }`}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(shipOrder.isRefined)}
                      disabled={!isEditing || isRefinedLocked}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const value = event.target.checked
                        onChange({
                          ...shipOrder,
                          isRefined: value,
                          shareRefinedValue: value,
                          method: shipOrder.method || RefineryMethodEnum.DinyxSolventation,
                          refinery: shipOrder.refinery || RefineryEnum.Arcl1,
                        } as ShipMiningOrder)
                      }}
                    />
                  }
                  label="Use Refinery"
                />
              </Tooltip>
              {shipOrder.isRefined && (
                <Tooltip
                  placement="right"
                  title={
                    <>
                      <Typography variant="body1" gutterBottom>
                        If this is off you will share only what you get from the refinery direct sale kiosk. and you
                        will keep the remainder.
                      </Typography>
                      <Typography variant="caption" gutterBottom>
                        This could be useful if your crew wants to be paid in advance. In this case the owner of the
                        order takes all the risk of delivering the ore to market.{' '}
                        {isEditing && isShareRefinedValueLocked ? '(LOCKED BY SESSION OWNER)' : ''}
                      </Typography>
                    </>
                  }
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(shipOrder.shareRefinedValue)}
                        disabled={!isEditing || isShareRefinedValueLocked}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          onChange({
                            ...shipOrder,
                            shareRefinedValue: event.target.checked,
                          } as ShipMiningOrder)
                        }}
                      />
                    }
                    label="Share Refined Value"
                  />
                </Tooltip>
              )}
            </>
          )}
          <Tooltip
            placement="right"
            title={
              <>
                <Typography variant="body1" gutterBottom>
                  Subtract the moTrader transfer fee from the total value.
                </Typography>
                <Typography variant="body2" gutterBottom>
                  If this is off the OWNER will pay all the 0.5% moTRADER transfer fees.{' '}
                  {isEditing && isShareRefinedValueLocked ? '(LOCKED BY SESSION OWNER)' : ''}
                </Typography>
              </>
            }
          >
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(workOrder.includeTransferFee)}
                  disabled={!isEditing || isIncludeTransferFeeLocked}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    onChange({
                      ...workOrder,
                      includeTransferFee: event.target.checked,
                    })
                  }}
                />
              }
              label="Subtract Transfer Fee"
            />
          </Tooltip>
        </FormGroup>
        {!workOrder.state && workOrder.state !== WorkOrderStateEnum.Unknown && (
          <>
            <Typography variant="overline" sx={{ mt: 1 }}>
              Current State
            </Typography>
            <Typography>{workOrder.state}</Typography>
          </>
        )}
        {workOrder.failReason && (
          <>
            <Typography variant="overline" sx={{ mt: 1 }}>
              Reason for Failure (optional)
            </Typography>
            <Typography>{workOrder.failReason}</Typography>
          </>
        )}

        {/* Helpful tips and tricks */}
        {isEditing && (
          <Accordion sx={{ mt: 6 }} disableGutters>
            <AccordionSummary color="info" expandIcon={<ExpandMore color="inherit" />}>
              <Help sx={{ mr: 2 }} color="inherit" /> Help
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="caption" component="ol">
                {workOrder.orderType === ActivityEnum.ShipMining && (
                  <>
                    {shipOrder.isRefined ? (
                      <>
                        <li>Select your refinery station and refining method using the dropdowns.</li>
                        <li>Select the ore(s) you are selling to create rows.</li>
                        <li>
                          Click the <strong>QTY</strong> or <strong>Yield</strong> fields to edit the values.
                        </li>
                        <li>
                          Click "START" to set the start time for the job or you can choose it manually if this job has
                          already been started.
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          Select the ore(s) you are <strong>refining</strong> to create rows.
                        </li>
                        <li>
                          Click the <strong>QTY</strong> field to edit the values.
                        </li>
                      </>
                    )}
                    <li>TAB or ENTER automatically moves to the next row.</li>
                  </>
                )}
                {workOrder.orderType === ActivityEnum.VehicleMining && (
                  <>
                    <li>Select the ROC ore(s) you are selling to create rows.</li>
                    <li>
                      Click the <strong>QTY</strong> field to edit the values.
                    </li>
                    <li>TAB or ENTER automatically moves to the next row.</li>
                    <li>
                      <strong>Amounts are in cSCU</strong> meaning that the number you enter in the <strong>QTY</strong>{' '}
                      field corresponds to the number of rock shards/gems.
                    </li>
                  </>
                )}
                {workOrder.orderType === ActivityEnum.Salvage && (
                  <>
                    <li>
                      Click the <strong>QTY</strong> field to edit the values.
                    </li>
                    <li>
                      <strong>Amounts are in SCU</strong> so the <strong>QTY</strong> field should be the # of boxes you
                      sell.
                    </li>
                  </>
                )}
                {workOrder.orderType === ActivityEnum.Other && (
                  <>
                    <li>Click to type in the "Amount to share" box to get started</li>
                  </>
                )}
                <li>Add users using their star citizen usernames</li>
              </Typography>
            </AccordionDetails>
          </Accordion>
        )}
        <ReferenceTables activity={workOrder.orderType} />
      </CardContent>
    </Card>
  )
}
