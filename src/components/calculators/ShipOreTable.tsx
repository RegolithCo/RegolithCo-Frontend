import * as React from 'react'
import { lookups, MarketPriceLookupValue, getShipOreName, ShipOreEnum } from '@orgminer/common'
import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, useTheme } from '@mui/material'
import Gradient from 'javascript-color-gradient'
import { MValue, MValueFormat } from '../fields/MValue'

export const ShipOreTable: React.FC = () => {
  const theme = useTheme()
  const shipRowKeys = Object.values(ShipOreEnum)
  const bgColors = new Gradient()
    .setColorGradient('#b93327', theme.palette.background.paper, '#246f9a', '#229f63')
    .setMidpoint(50) // 100 is the number of colors to generate. Should be enough stops for our ores
    .getColors()
  const fgColors = bgColors.map((color) => theme.palette.getContrastText(color))
  // Sort descendng value
  shipRowKeys.sort((a, b) => {
    const aPrice = lookups.marketPriceLookup[a] as MarketPriceLookupValue
    const bPrice = lookups.marketPriceLookup[b] as MarketPriceLookupValue
    return bPrice.refined - aPrice.refined
  })

  const rowStats: { max: number; min: number }[] = []

  const finalTable: [number, number, number, number, number, number][] = shipRowKeys.map((shipOreKey, rowIdx) => {
    const oreLookup = lookups.marketPriceLookup[shipOreKey] as MarketPriceLookupValue
    const retVals = [
      oreLookup.unrefined,
      oreLookup.refined,
      oreLookup.unrefined * 3200,
      oreLookup.refined * 3200,
      oreLookup.unrefined * 9600,
      oreLookup.refined * 9600,
    ]
    if (rowIdx === 0) {
      retVals.forEach((value) => rowStats.push({ max: value, min: value }))
    } else {
      retVals.forEach((value, colIdx) => {
        if (value > rowStats[colIdx].max) rowStats[colIdx].max = value
        if (value < rowStats[colIdx].min) rowStats[colIdx].min = value
      })
    }
    return retVals as [number, number, number, number, number, number]
  })
  // Now map the values to a color index
  const colorizedRows: [number, number, number, number, number, number][] = shipRowKeys.map((_, rowIdx) => {
    const normalizedValues = finalTable[rowIdx].map((value, colIdx) => {
      return (value - rowStats[colIdx].min) / (rowStats[colIdx].max - rowStats[colIdx].min)
    })
    const colorIdxs = normalizedValues.map((value) => Math.round(value * 49))
    return colorIdxs as [number, number, number, number, number, number]
  })

  return (
    <TableContainer>
      <Table sx={{ minWidth: 400, maxWidth: 700, mx: 'auto' }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#00000033' }}></TableCell>
            <TableCell align="left" colSpan={2} valign="top" sx={{ backgroundColor: '#00000055' }}>
              <Typography variant="h5" component="div">
                1 cSCU
              </Typography>
              <Typography variant="caption" component="div">
                &nbsp;
              </Typography>
            </TableCell>
            <TableCell align="left" colSpan={2} valign="top" sx={{ backgroundColor: '#00000033' }}>
              <Typography variant="h5" component="div">
                32 SCU
              </Typography>
              <Typography variant="caption" component="div">
                Full Prospector
              </Typography>
            </TableCell>
            <TableCell align="left" colSpan={2} valign="top" sx={{ backgroundColor: '#00000055' }}>
              <Typography variant="h5" component="div">
                96 SCU
              </Typography>
              <Typography variant="caption" component="div">
                Full Argo Mole
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#00000055' }} />
            <TableCell align="right" sx={{ backgroundColor: '#00000077' }}>
              <MValue value="Unrefined" format={MValueFormat.string} />
            </TableCell>
            <TableCell align="right" sx={{ backgroundColor: '#00000055' }}>
              <MValue value="Refined" format={MValueFormat.string} />
            </TableCell>
            <TableCell align="right" sx={{ backgroundColor: '#00000077' }}>
              <MValue value="Unrefined" format={MValueFormat.string} />
            </TableCell>
            <TableCell align="right" sx={{ backgroundColor: '#00000077' }}>
              <MValue value="Refined" format={MValueFormat.string} />
            </TableCell>
            <TableCell align="right" sx={{ backgroundColor: '#00000055' }}>
              <MValue value="Unrefined" format={MValueFormat.string} />
            </TableCell>
            <TableCell align="right" sx={{ backgroundColor: '#00000077' }}>
              <MValue value="Refined" format={MValueFormat.string} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shipRowKeys.map((shipRowKey, rowIdx) => {
            return (
              <TableRow key={`row-${rowIdx}`}>
                <TableCell component="th" scope="row">
                  <MValue value={getShipOreName(shipRowKey)} format={MValueFormat.string} />
                </TableCell>
                {finalTable[rowIdx].map((colVal, colIdx) => {
                  return (
                    <TableCell
                      align="right"
                      key={`tcell-${rowIdx}-${colIdx}`}
                      sx={{
                        background: bgColors[colorizedRows[rowIdx][colIdx]] + (colIdx % 2 === 0 ? '22' : '55'),
                        color: fgColors[colorizedRows[rowIdx][colIdx]],
                      }}
                    >
                      <MValue key={`cell-${rowIdx}-${colIdx}`} value={colVal} />
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
