import * as React from 'react'
import { SalvageOreEnum, findPrice, getSalvageOreName } from '@regolithco/common'
import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, useTheme } from '@mui/material'
import Gradient from 'javascript-color-gradient'
import { MValue, MValueFormat } from '../fields/MValue'
import { LookupsContext } from '../../context/lookupsContext'

export const SalvagingOreTable: React.FC = () => {
  const theme = useTheme()
  const [sortedSalvageRowKeys, setSortedSalvageRowKeys] = React.useState<SalvageOreEnum[]>([])
  const [finalTable, setFinalTable] = React.useState<[number, number, number][]>()
  const [colorizedRows, setColorizedRows] = React.useState<[number, number, number][]>([])

  const bgColors = new Gradient()
    .setColorGradient('#b93327', '#a46800', '#246f9a', '#246f9a', '#246f9a', '#229f63')
    .setMidpoint(100) // 100 is the number of colors to generate. Should be enough stops for our ores
    .getColors()
  const fgColors = bgColors.map((color) => theme.palette.getContrastText(color))

  const dataStore = React.useContext(LookupsContext)

  React.useEffect(() => {
    const calcSalvageRowKeys = async () => {
      if (!dataStore.ready) return
      const salvageRowKeys = Object.values(SalvageOreEnum)
      const prices = await Promise.all(salvageRowKeys.map((shipOreKey) => findPrice(dataStore, shipOreKey)))
      const newSorted = [...salvageRowKeys].sort((a, b) => {
        const aPrice = prices[salvageRowKeys.indexOf(a)]
        const bPrice = prices[salvageRowKeys.indexOf(b)]
        return bPrice - aPrice
      })

      const priceLookups: Record<SalvageOreEnum, number> = salvageRowKeys.reduce((acc, key, idx) => {
        acc[key] = prices[idx]
        return acc
      }, {} as Record<SalvageOreEnum, number>)

      const rowStats: { max: number; min: number }[] = []

      const newFinaltable: [number, number, number][] = salvageRowKeys.map((shipOreKey, rowIdx) => {
        const orePrice = priceLookups[shipOreKey]
        const retVals = [orePrice, orePrice * 12, orePrice * 420]
        if (rowIdx === 0) {
          retVals.forEach((value) => rowStats.push({ max: value, min: value }))
        } else {
          retVals.forEach((value, colIdx) => {
            if (value > rowStats[colIdx].max) rowStats[colIdx].max = value
            if (value < rowStats[colIdx].min) rowStats[colIdx].min = value
          })
        }
        return retVals as [number, number, number]
      })
      // Now map the values to a color index
      const colorizedRows: [number, number, number][] = salvageRowKeys.map((_, rowIdx) => {
        const normalizedValues = newFinaltable[rowIdx].map((value, colIdx) => {
          return (value - rowStats[colIdx].min) / (rowStats[colIdx].max - rowStats[colIdx].min)
        })
        const colorIdxs = normalizedValues.map((value) => Math.round(value * 99))
        return colorIdxs as [number, number, number]
      })

      setSortedSalvageRowKeys(newSorted)
      setFinalTable(newFinaltable)
      setColorizedRows(colorizedRows)
    }
    calcSalvageRowKeys()
  }, [dataStore.ready])

  if (!finalTable || !dataStore.ready) return <div>Loading prices...</div>

  return (
    <TableContainer>
      <Table sx={{ minWidth: 400, maxWidth: 900, mx: 'auto' }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#00000033' }}></TableCell>
            <TableCell align="left" valign="top" sx={{ backgroundColor: '#00000055' }}>
              <Typography variant="h5" component="div">
                1 SCU
              </Typography>
              <Typography variant="caption" component="div">
                Single Box
              </Typography>
            </TableCell>
            <TableCell align="left" valign="top" sx={{ backgroundColor: '#00000033' }}>
              <Typography variant="h5" component="div">
                12 SCU
              </Typography>
              <Typography variant="caption" component="div">
                Full Vulture
              </Typography>
            </TableCell>
            <TableCell align="left" valign="top" sx={{ backgroundColor: '#00000055' }}>
              <Typography variant="h5" component="div">
                420 SCU
              </Typography>
              <Typography variant="caption" component="div">
                Full Reclaimer
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedSalvageRowKeys.map((shipRowKey, rowIdx) => {
            return (
              <TableRow key={`row-${rowIdx}`}>
                <TableCell component="th" scope="row">
                  <MValue value={getSalvageOreName(shipRowKey)} format={MValueFormat.string} />
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
