import * as React from 'react'
import { getShipOreName, ShipOreEnum, findPrice } from '@regolithco/common'
import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, useTheme } from '@mui/material'
import Gradient from 'javascript-color-gradient'
import { MValue, MValueFormat } from '../fields/MValue'
import { LookupsContext } from '../../context/lookupsContext'

export const ShipOreTable: React.FC = () => {
  const theme = useTheme()
  const [sortedShipRowKeys, setSortedShipRowKeys] = React.useState<ShipOreEnum[]>([])
  const [finalTable, setFinalTable] = React.useState<[number, number, number, number, number, number][]>()
  const [bgColors, setBgColors] = React.useState<string[]>([])
  const [fgColors, setFgColors] = React.useState<string[]>([])
  const [colorizedRows, setColorizedRows] = React.useState<[number, number, number, number, number, number][]>([])

  const dataStore = React.useContext(LookupsContext)

  React.useEffect(() => {
    if (!dataStore.ready) return
    const calcShipRowKeys = async () => {
      const shipRowKeys = Object.values(ShipOreEnum)
      const pricesRefined: number[] = await Promise.all(
        shipRowKeys.map((shipOreKey) => findPrice(dataStore, shipOreKey, undefined, true))
      )
      const pricesUnrefined: number[] = await Promise.all(
        shipRowKeys.map((shipOreKey) => findPrice(dataStore, shipOreKey, undefined, false))
      )

      const priceLookups: Record<ShipOreEnum, [number, number]> = shipRowKeys.reduce((acc, key, idx) => {
        acc[key] = [pricesRefined[idx], pricesUnrefined[idx]]
        return acc
      }, {} as Record<ShipOreEnum, [number, number]>)

      const newSorted = [...shipRowKeys].sort((a, b) => {
        const aPrice = pricesRefined[shipRowKeys.indexOf(a)] || 0
        const bPrice = pricesRefined[shipRowKeys.indexOf(b)] || 0
        return bPrice - aPrice
      })

      const bgColors = new Gradient()
        .setColorGradient('#b93327', '#a46800', '#246f9a', '#246f9a', '#246f9a', '#229f63')
        .setMidpoint(100) // 100 is the number of colors to generate. Should be enough stops for our ores
        .getColors()
      const fgColors = bgColors.map((color) => theme.palette.getContrastText(color))

      const newFinalTable: [number, number, number, number, number, number][] = newSorted.map((shipOreKey, rowIdx) => {
        const orePrices = priceLookups[shipOreKey] || [0, 0]
        const orePriceRefined = orePrices ? orePrices[0] : 0
        const orePriceUnrefined = orePrices ? orePrices[1] : 0
        const retVals = [
          orePriceUnrefined,
          orePriceRefined,
          orePriceUnrefined * 32,
          orePriceRefined * 32,
          orePriceUnrefined * 96,
          orePriceRefined * 96,
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
        const normalizedValues = newFinalTable[rowIdx].map((value, colIdx) => {
          return (value - rowStats[colIdx].min) / (rowStats[colIdx].max - rowStats[colIdx].min)
        })
        const colorIdxs = normalizedValues.map((value) => Math.round(value * 99))
        return colorIdxs as [number, number, number, number, number, number]
      })

      setColorizedRows(colorizedRows)
      setFinalTable(newFinalTable)
      setBgColors(bgColors)
      setFgColors(fgColors)
      setSortedShipRowKeys(newSorted)
    }
    calcShipRowKeys()
  }, [dataStore])

  const rowStats: { max: number; min: number }[] = []

  if (!finalTable) return <div>Loading...</div>
  return (
    <TableContainer>
      <Table sx={{ minWidth: 400, maxWidth: 900, mx: 'auto' }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#00000033' }}></TableCell>
            <TableCell align="left" colSpan={2} valign="top" sx={{ backgroundColor: '#00000055' }}>
              <Typography variant="h5" component="div">
                1 SCU
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
          {sortedShipRowKeys.map((shipRowKey, rowIdx) => {
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
                      <MValue
                        key={`cell-${rowIdx}-${colIdx}`}
                        value={colVal}
                        format={colIdx < 2 ? MValueFormat.currency : MValueFormat.currency_sm}
                      />
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
