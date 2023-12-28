import * as React from 'react'
import { getVehicleOreName, VehicleOreEnum, findPrice } from '@regolithco/common'
import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, useTheme } from '@mui/material'
import Gradient from 'javascript-color-gradient'
// import log from 'loglevel'
import { MValue, MValueFormat } from '../fields/MValue'
import { useAsyncLookupData } from '../../hooks/useLookups'

export const VehicleOreTable: React.FC = () => {
  const theme = useTheme()

  const bgColors = new Gradient()
    .setColorGradient('#b93327', '#a46800', '#246f9a', '#229f63')
    .setMidpoint(4) // 100 is the number of colors to generate. Should be enough stops for our ores
    .getColors()
  const fgColors = bgColors.map((color) => theme.palette.getContrastText(color))

  const sortedVehicleRowKeys =
    useAsyncLookupData<VehicleOreEnum[]>(async (ds) => {
      const vehicleRowKeys = Object.values(VehicleOreEnum)
      const prices = await Promise.all(vehicleRowKeys.map((key) => findPrice(ds, key as VehicleOreEnum)))
      const sortedKeys = [...vehicleRowKeys].sort((a, b) => {
        const aPrice = prices[vehicleRowKeys.indexOf(a)]
        const bPrice = prices[vehicleRowKeys.indexOf(b)]
        return bPrice - aPrice
      })
      return sortedKeys
    }) || []

  const vehicleRowKeys = React.useMemo(() => sortedVehicleRowKeys, [sortedVehicleRowKeys])

  const finalTable =
    useAsyncLookupData<[number, number, number][]>(
      async (ds) => {
        const table: [number, number, number][] = []
        for (const key of sortedVehicleRowKeys) {
          const orePrice = (await findPrice(ds, key as VehicleOreEnum)) / 1000
          const retVals = [orePrice, orePrice * 800, orePrice * 3500]
          table.push(retVals as [number, number, number])
        }
        return table
      },
      [sortedVehicleRowKeys]
    ) || []

  return (
    <TableContainer>
      <Table sx={{ minWidth: 400, maxWidth: 460, mx: 'auto' }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#00000033' }} />
            <TableCell align="left" valign="top" sx={{ backgroundColor: '#00000055' }}>
              <Typography variant="h5" component="div">
                1 mSCU
              </Typography>
              <Typography variant="caption" component="div">
                Single Gem
              </Typography>
            </TableCell>
            <TableCell align="left" valign="top" sx={{ backgroundColor: '#00000033' }}>
              <Typography variant="h5" component="div">
                0.8 SCU
              </Typography>
              <Typography variant="caption" component="div">
                Full ROC
              </Typography>
            </TableCell>
            <TableCell align="left" valign="top" sx={{ backgroundColor: '#00000055' }}>
              <Typography variant="h5" component="div">
                3.5 SCU
              </Typography>
              <Typography variant="caption" component="div">
                Full ROC DS
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicleRowKeys.map((shipRowKey, rowIdx) => {
            return (
              <TableRow key={`row-${rowIdx}`}>
                <TableCell component="th" scope="row">
                  <MValue value={getVehicleOreName(shipRowKey)} format={MValueFormat.string} />
                </TableCell>
                {(finalTable[rowIdx] || []).map((colVal, colIdx) => {
                  return (
                    <TableCell
                      align="right"
                      key={`col-${colIdx}`}
                      sx={{
                        background: bgColors[bgColors.length - rowIdx - 1] + (colIdx % 2 === 1 ? '33' : '55'),
                        color: fgColors[fgColors.length - rowIdx - 1],
                      }}
                    >
                      <MValue value={colVal} format={MValueFormat.currency_sm} />
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
