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
import { getOreName, getRockTypeName, ShipRockCapture } from '@regolithco/common'
import { fontFamilies } from '../../theme'
import { MValueFormat, MValueFormatter } from '../fields/MValue'

export interface PreviewScoutingRockCaptureProps {
  shipRock: ShipRockCapture
}

export const PreviewScoutingRockCapture: React.FC<PreviewScoutingRockCaptureProps> = ({ shipRock }) => {
  const theme = useTheme()
  const totalOres = shipRock ? shipRock.ores.reduce((acc, ore) => acc + ore.percent, 0) : 0
  const inertMaterial = totalOres >= 0 && totalOres <= 1 ? 1 - totalOres : 0
  return (
    <Box
      sx={{
        width: '90%',
        maxWidth: 400,
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
        Scan Results
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
        <TableContainer
          sx={{
            maxWidth: 300,
          }}
        >
          <Table size="small">
            <TableBody>
              <PreviewRow
                heading="Rock Class"
                value={
                  shipRock.rockType !== undefined && shipRock.rockType !== null ? (
                    getRockTypeName(shipRock.rockType)
                  ) : (
                    <NotFound />
                  )
                }
              />
              <PreviewRow
                heading="Mass"
                value={shipRock.mass !== undefined && shipRock.mass !== null ? shipRock.mass.toFixed(0) : <NotFound />}
              />
              <PreviewRow
                heading="Resistance"
                value={
                  shipRock.res !== undefined && shipRock.res !== null ? (
                    MValueFormatter(shipRock.res || 0, MValueFormat.percent)
                  ) : (
                    <NotFound />
                  )
                }
              />
              <PreviewRow
                heading="Instability"
                value={shipRock.inst !== undefined && shipRock.inst !== null ? shipRock.inst?.toFixed(2) : <NotFound />}
              />
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer
          sx={{
            mt: 5,
            maxWidth: 300,
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  '& th': {
                    borderBottom: '1px solid',
                  },
                }}
              >
                <TableCell sx={{ fontWeight: 'bold' }}>Ore</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Mass</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shipRock.ores.map(({ ore, percent }, i) => (
                <TableRow key={i}>
                  <TableCell
                    sx={{
                      fontFamily: fontFamilies.robotoMono,
                      fontWeight: 'bold',
                      color: 'text',
                    }}
                  >
                    {getOreName(ore)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: theme.palette.secondary.main,
                      textAlign: 'center',
                    }}
                  >
                    {percent !== undefined ? MValueFormatter(percent || 0, MValueFormat.percent, 2) : <NotFound />}
                  </TableCell>
                </TableRow>
              ))}
              {shipRock.ores.length > 0 && (
                <TableRow>
                  <TableCell
                    sx={{
                      fontFamily: fontFamilies.robotoMono,
                      fontWeight: 'bold',
                      color: 'text',
                    }}
                  >
                    Inert Materials
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'center',
                      fontStyle: 'italic',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {MValueFormatter(inertMaterial, MValueFormat.percent, 2)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Typography variant="caption" color="text.secondary" component="p" gutterBottom>
        <strong>Note:</strong> Inert Materials are never captured, only calculated.
      </Typography>
      <Typography variant="caption" color="primary">
        If this looks to be basically correct you can click "Use" to import this data or "Retry" with a different image
        or crop.
      </Typography>
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
  const theme = useTheme()
  return (
    <TableRow>
      <TableCell
        sx={{
          fontFamily: fontFamilies.robotoMono,
          fontWeight: 'bold',
          color: 'text',
        }}
      >
        {heading}
      </TableCell>
      <TableCell
        sx={{
          color: theme.palette.secondary.main,
          textAlign: 'center',
        }}
      >
        {value}
      </TableCell>
    </TableRow>
  )
}
