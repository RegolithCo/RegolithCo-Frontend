import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import React from 'react'
import { getOreName, ShipRockCapture } from '@regolithco/common'
import { Box } from '@mui/system'
import { fontFamilies } from '../../theme'

export interface PreviewScoutingRockCaptureProps {
  shipRock: ShipRockCapture
}

export const PreviewScoutingRockCapture: React.FC<PreviewScoutingRockCaptureProps> = ({ shipRock }) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        width: '90%',
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
            <PreviewRow heading="Mass" value={shipRock.mass ? shipRock.mass : <NotFound />} />
            <PreviewRow heading="Instability" value={shipRock.inst ? shipRock.inst : <NotFound />} />
            <PreviewRow heading="Resistance" value={shipRock.res ? `${shipRock.res * 100}%` : <NotFound />} />
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
            <TableRow>
              <TableCell>Ore</TableCell>
              <TableCell>Mass</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipRock.ores.map(({ ore, percent }, i) => (
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
                <TableCell>{percent ? `${percent * 100}%` : <NotFound />}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

const NotFound: React.FC = () => {
  return (
    <Typography variant="body1" color={'error'}>
      Not Found
    </Typography>
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
