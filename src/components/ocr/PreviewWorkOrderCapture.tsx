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
      <TableContainer>
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
              <TableCell>Yield</TableCell>
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
                <TableCell>
                  {!yieldVal && !amt && <NotFound />}
                  {yieldVal ? MValueFormatter(yieldVal, MValueFormat.volcSCU, 0) : <NotRelevant />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

const PreviewRow: React.FC<{ heading: React.ReactNode; value: React.ReactNode }> = ({ heading, value }) => {
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
      <TableCell>{value}</TableCell>
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
