import React from 'react'
import { Typography, Box, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { ActivityEnum, ShipMiningOrder, WorkOrder } from '@regolithco/common'
import { Help } from '@mui/icons-material'
import { ReferenceTables } from './ReferenceTables'
import { Stack } from '@mui/system'

export type OreCardHelpModalProps = {
  workOrder: WorkOrder
  isEditing?: boolean
  onClose?: () => void
}

export const OreCardHelpModal: React.FC<OreCardHelpModalProps> = ({ onClose, workOrder, isEditing }) => {
  const theme = useTheme()
  const shipOrder = workOrder as ShipMiningOrder

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
        <Help sx={{ mr: 2 }} color="inherit" /> Ore and Refining
      </DialogTitle>
      <DialogContent>
        {/* Helpful tips and tricks */}
        {isEditing && (
          <Box>
            <Typography component="ol">
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
          </Box>
        )}
        <ReferenceTables activity={workOrder.orderType} />
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1} sx={{ width: '100%' }} justifyContent={'right'}>
          <Button onClick={onClose}>Ok</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
