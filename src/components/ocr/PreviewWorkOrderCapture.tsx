import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Box,
} from '@mui/material'
import { getOreName, ShipMiningOrderCapture } from '@regolithco/common'
import { MValue, MValueFormat, MValueFormatter } from '../fields/MValue'
import { fontFamilies } from '../../theme'
import { RefineryControl } from '../fields/RefineryControl'
import { RefineryMethodControl } from '../fields/RefiningMethodControl'
import { CountdownTimer } from '../calculators/WorkOrderCalc/CountdownTimer'

export interface PreviewWorkOrderCapturePRops {
  order: ShipMiningOrderCapture
  imageUrl?: string | null
  onChange: (val: ShipMiningOrderCapture) => void
}

export const PreviewWorkOrderCapture: React.FC<PreviewWorkOrderCapturePRops> = ({ order, imageUrl, onChange }) => {
  const theme = useTheme()
  console.log('MARZIPAN', order)
  const handleUpdate = (updates: Partial<ShipMiningOrderCapture>) => {
    onChange({ ...order, ...updates })
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: imageUrl ? 1000 : 450,
        px: 2,
        '& *': {
          fontFamily: fontFamilies.robotoMono,
          fontWeight: 'bold',
        },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          borderBottom: '1px solid',
          mb: 2,
          fontFamily: fontFamilies.robotoMono,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Capture Results
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, justifyContent: 'center' }}>
        <Box
          sx={{
            flex: 1,
            width: '100%',
            display: 'flex',
            pb: 2,
            flexDirection: 'column',
            // centerd horizontally
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TableContainer sx={{ maxWidth: '100%' }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{
                      fontFamily: fontFamilies.robotoMono,
                      fontWeight: 'bold',
                      color: 'text.secondary',
                    }}
                  >
                    Refinery
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'right',
                      color: theme.palette.secondary.dark,
                      fontFamily: fontFamilies.robotoMono,
                      fontWeight: 'bold',
                      minWidth: 150,
                    }}
                  >
                    <RefineryControl
                      value={order.refinery}
                      onChange={(newRefinery) => handleUpdate({ refinery: newRefinery })}
                      allowNone
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      fontFamily: fontFamilies.robotoMono,
                      fontWeight: 'bold',
                      color: 'text.secondary',
                    }}
                  >
                    Method
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'right',
                      color: theme.palette.secondary.dark,
                      fontFamily: fontFamilies.robotoMono,
                      fontWeight: 'bold',
                      minWidth: 150,
                    }}
                  >
                    <RefineryMethodControl
                      value={order.method || undefined}
                      onChange={(newMethod) => handleUpdate({ method: newMethod })}
                      allowNone
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      fontFamily: fontFamilies.robotoMono,
                      fontWeight: 'bold',
                      color: 'text.secondary',
                    }}
                  >
                    Cost
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'right',
                      color: theme.palette.secondary.dark,
                      fontFamily: fontFamilies.robotoMono,
                      fontWeight: 'bold',
                    }}
                  >
                    <MValue
                      value={order.expenses && order.expenses.length > 0 ? order.expenses[0].amount : 0}
                      onChange={(newCost) => {
                        // We only support editing the first expense (cost)
                        const newExpenses = order.expenses ? [...order.expenses] : []
                        if (newExpenses.length === 0) {
                          newExpenses.push({
                            amount: BigInt(newCost || 0),
                            __typename: 'WorkOrderExpense',
                            name: 'Initial Cost',
                            ownerScName: '',
                          })
                        } else {
                          newExpenses[0] = { ...newExpenses[0], amount: BigInt(newCost || 0) }
                        }
                        handleUpdate({ expenses: newExpenses })
                      }}
                      format={MValueFormat.currency}
                      inputProps={{ sx: { textAlign: 'right' } }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      fontFamily: fontFamilies.robotoMono,
                      fontWeight: 'bold',
                      color: 'text.secondary',
                    }}
                  >
                    Time (sec)
                  </TableCell>

                  <TableCell
                    sx={{
                      textAlign: 'right',
                      color: theme.palette.secondary.dark,
                      fontFamily: fontFamilies.robotoMono,
                      fontWeight: 'bold',
                    }}
                  >
                    {order.processDurationS && order.processDurationS > 0 ? (
                      <CountdownTimer
                        startTime={Date.now()}
                        totalTime={order.processDurationS * 1000 + 20}
                        paused
                        useMValue
                      />
                    ) : (
                      <NotFound />
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer
            sx={{
              maxWidth: '100%',
              mt: 5,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{
                    borderBottom: '3px solid',
                  }}
                >
                  <TableCell>Ore</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Yield</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.shipOres.map(({ amt, ore, yield: yieldVal }, i) => (
                  <TableRow key={i}>
                    <TableCell
                      sx={{
                        fontFamily: fontFamilies.robotoMono,
                        fontWeight: 'bold',
                        color: 'text.secondary',
                      }}
                    >
                      {getOreName(ore)}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: 'right',
                        color: theme.palette.secondary.dark,
                        fontFamily: fontFamilies.robotoMono,
                        fontWeight: 'bold',
                      }}
                    >
                      <MValue
                        value={yieldVal}
                        onChange={(newYield) => {
                          const newOres = [...order.shipOres]
                          newOres[i] = { ...newOres[i], yield: newYield }
                          handleUpdate({ shipOres: newOres })
                        }}
                        format={MValueFormat.volcSCU}
                        decimals={0}
                        inputProps={{ sx: { textAlign: 'right', color: theme.palette.secondary.dark } }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {imageUrl && (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <img
              src={imageUrl}
              alt="Capture"
              style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain', borderRadius: 4 }}
            />
          </Box>
        )}
      </Box>
      <Typography variant="caption" color="primary">
        If this looks to be basically correct you can click "Use" to import this data or "Retry" with a different image
        or crop.
      </Typography>
    </Box>
  )
}

const NotRelevant: React.FC = () => {
  return (
    <Typography variant="body1" color={'text.secondary'}>
      --
    </Typography>
  )
}

const NotFound: React.FC = () => {
  return (
    <Typography variant="body1" color={'error'}>
      Not Found
    </Typography>
  )
}
