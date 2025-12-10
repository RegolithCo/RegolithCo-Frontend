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
import { getOreName, ShipRockCapture } from '@regolithco/common'
import { fontFamilies } from '../../theme'
import { MValue, MValueFormat, MValueFormatter } from '../fields/MValue'
import { RockTypeChooser } from '../fields/RockTypeChooser'

export interface PreviewScoutingRockCaptureProps {
  shipRock: ShipRockCapture
  imageUrl?: string | null
  onChange: (val: ShipRockCapture) => void
}

export const PreviewScoutingRockCapture: React.FC<PreviewScoutingRockCaptureProps> = ({
  shipRock,
  imageUrl,
  onChange,
}) => {
  const theme = useTheme()
  const totalOres = shipRock ? shipRock.ores.reduce((acc, ore) => acc + ore.percent, 0) : 0
  const inertMaterial = totalOres >= 0 && totalOres <= 1 ? 1 - totalOres : 0

  const handleUpdate = (updates: Partial<ShipRockCapture>) => {
    onChange({ ...shipRock, ...updates })
  }

  return (
    <Box
      sx={{
        width: '90%',
        maxWidth: imageUrl ? 1000 : 400,
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
          <TableContainer
            sx={{
              maxWidth: '100%',
            }}
          >
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{
                      fontFamily: fontFamilies.robotoMono,
                      fontWeight: 'bold',
                      color: 'text',
                    }}
                  >
                    Rock Class
                  </TableCell>
                  <TableCell
                    sx={{
                      color: theme.palette.secondary.main,
                      textAlign: 'right',
                    }}
                  >
                    <RockTypeChooser
                      value={shipRock.rockType}
                      hideLabel
                      color={theme.palette.secondary.main}
                      onChange={(newType) => handleUpdate({ rockType: newType || undefined })}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      fontFamily: fontFamilies.robotoMono,
                      fontWeight: 'bold',
                      color: 'text',
                    }}
                  >
                    Mass
                  </TableCell>
                  <TableCell
                    sx={{
                      color: theme.palette.secondary.main,
                      textAlign: 'right',
                    }}
                  >
                    <MValue
                      value={shipRock.mass}
                      onChange={(newMass) => handleUpdate({ mass: newMass || undefined })}
                      format={MValueFormat.decimal}
                      precision={0}
                      suffix="kg"
                      inputProps={{
                        sx: {
                          color: theme.palette.secondary.main,
                          textAlign: 'right',
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      fontFamily: fontFamilies.robotoMono,
                      fontWeight: 'bold',
                      color: 'text',
                    }}
                  >
                    Resistance
                  </TableCell>
                  <TableCell
                    sx={{
                      color: theme.palette.secondary.main,
                      textAlign: 'right',
                    }}
                  >
                    <MValue
                      value={shipRock.res}
                      onChange={(newRes) => handleUpdate({ res: newRes || undefined })}
                      format={MValueFormat.percent}
                      suffix="%"
                      inputProps={{ sx: { color: theme.palette.secondary.main, textAlign: 'right' } }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      fontFamily: fontFamilies.robotoMono,
                      fontWeight: 'bold',
                      color: 'text',
                    }}
                  >
                    Instability
                  </TableCell>
                  <TableCell
                    sx={{
                      color: theme.palette.secondary.main,
                      textAlign: 'right',
                    }}
                  >
                    <MValue
                      value={shipRock.inst}
                      onChange={(newInst) => handleUpdate({ inst: newInst || undefined })}
                      format={MValueFormat.decimal}
                      precision={2}
                      inputProps={{ sx: { color: theme.palette.secondary.main, textAlign: 'right' } }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer
            sx={{
              mt: 5,
              maxWidth: '100%',
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
                      <MValue
                        value={percent}
                        format={MValueFormat.percent}
                        decimals={2}
                        suffix="%"
                        onChange={(newVal) => {
                          const newOres = [...shipRock.ores]
                          newOres[i] = { ...newOres[i], percent: newVal }
                          handleUpdate({ ores: newOres })
                        }}
                        inputProps={{ sx: { textAlign: 'right', color: theme.palette.secondary.main } }}
                      />
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
                        textAlign: 'right',
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
