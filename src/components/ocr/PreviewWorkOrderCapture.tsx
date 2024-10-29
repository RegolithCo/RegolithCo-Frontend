import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import React from 'react'
import { getOreName, getRefineryMethodName, getRefineryName, ShipMiningOrderCapture } from '@regolithco/common'
import { Box } from '@mui/system'
import { CountdownTimer } from '../calculators/WorkOrderCalc/CountdownTimer'
import { MValueFormat, MValueFormatter } from '../fields/MValue'
import { fontFamilies } from '../../theme'

export interface PreviewWorkOrderCapturePRops {
  order: ShipMiningOrderCapture
}

export const PreviewWorkOrderCapture: React.FC<PreviewWorkOrderCapturePRops> = ({ order }) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 450,
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
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          pb: 2,
          flexDirection: 'column',
          // centerd horizontally
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TableContainer sx={{ maxWidth: 450 }}>
          <Table size="small">
            <TableBody>
              <PreviewRow heading="Refinery" value={order.refinery ? getRefineryName(order.refinery) : <NotFound />} />
              <PreviewRow heading="Method" value={order.method ? getRefineryMethodName(order.method) : <NotFound />} />
              <PreviewRow
                heading="Cost"
                value={
                  order.expenses && order.expenses.length > 0 ? (
                    MValueFormatter(order.expenses[0].amount, MValueFormat.currency)
                  ) : (
                    <NotFound />
                  )
                }
              />
              <PreviewRow
                heading="Time"
                value={
                  order.processDurationS && order.processDurationS > 0 ? (
                    <CountdownTimer
                      startTime={Date.now()}
                      totalTime={order.processDurationS * 1000 + 20}
                      paused
                      useMValue
                    />
                  ) : (
                    <NotFound />
                  )
                }
              />
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer
          sx={{
            maxWidth: 300,
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
                <TableCell>Raw</TableCell>
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
                  <TableCell>
                    {!yieldVal && !amt && <NotFound />}
                    {amt ? MValueFormatter(amt, MValueFormat.volcSCU, 0) : <NotRelevant />}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'right',
                      color: theme.palette.secondary.dark,
                      fontFamily: fontFamilies.robotoMono,
                      fontWeight: 'bold',
                    }}
                  >
                    {!yieldVal && !amt && <NotFound />}
                    {yieldVal ? MValueFormatter(yieldVal, MValueFormat.volcSCU, 0) : <NotRelevant />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Typography variant="caption" color="primary">
        If this looks to be basically correct you can click "Use" to import this data or "Retry" with a different image
        or crop.
      </Typography>
    </Box>
  )
}

const PreviewRow: React.FC<{ heading: React.ReactNode; value: React.ReactNode }> = ({ heading, value }) => {
  const theme = useTheme()
  return (
    <TableRow>
      <TableCell
        sx={{
          fontFamily: fontFamilies.robotoMono,
          fontWeight: 'bold',
          color: 'text.secondary',
        }}
      >
        {heading}
      </TableCell>
      <TableCell
        sx={{
          textAlign: 'right',
          color: theme.palette.secondary.dark,
          fontFamily: fontFamilies.robotoMono,
          fontWeight: 'bold',
        }}
      >
        {value}
      </TableCell>
    </TableRow>
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
