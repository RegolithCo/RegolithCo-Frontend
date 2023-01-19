import * as React from 'react'
import {
  lookups,
  OreProcessingLookup,
  RefineryEnum,
  RefineryModifiers,
  ShipOreEnum,
  getShipOreName,
} from '@orgminer/common'
import { TableContainer, Table, TableHead, TableRow, TableCell, useTheme, TableBody } from '@mui/material'
import Gradient from 'javascript-color-gradient'
import { MValue, MValueFormat } from '../../fields/MValue'
import { fontFamilies } from '../../../theme'

type GridStats = { max: number | null; min: number | null }

export const RefineryBonusTable: React.FC = () => {
  const theme = useTheme()
  // Only used for time v profit
  const gridStatsArr: [GridStats, GridStats, GridStats] = [
    { max: null, min: null },
    { max: null, min: null },
    { max: null, min: null },
  ]
  const bgColorArr = ['#b93327', '#000000', '#229f63']
  const bgColors = new Gradient()
    .setColorGradient(...bgColorArr)
    .setMidpoint(101) // 100 is the number of colors to generate. Should be enough stops for our ores
    .getColors()
  const fgColors = bgColors.map((color) => theme.palette.getContrastText(color))

  const hAxis = Object.values(RefineryEnum).map((refVal) => [refVal, refVal])
  hAxis.sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))

  let vAxis: [ShipOreEnum, string][] = []
  const sortable = Object.entries(ShipOreEnum)
    .filter(([, val]) => val !== ShipOreEnum.Inertmaterial)
    .map(([oreKey, oreVal]) => [oreKey, oreVal])
  sortable.sort(
    (a, b) =>
      (lookups.marketPriceLookup[b[1] as ShipOreEnum]?.refined as number) -
      (lookups.marketPriceLookup[a[1] as ShipOreEnum]?.refined as number)
  )
  vAxis = sortable.map(([, oreVal]) => [oreVal as ShipOreEnum, getShipOreName(oreVal as ShipOreEnum)])

  const rows: RefineryModifiers[][] = vAxis.map(([ore]) => {
    const cols: RefineryModifiers[] = hAxis.map(([refinery]) => {
      const opl = lookups.refineryBonusLookup[refinery] as OreProcessingLookup
      const outArr = opl[ore] as RefineryModifiers

      const outArrNormed = outArr.map((val) => {
        if (val === null) return null
        else return (val - 1) * 100
      }) as RefineryModifiers

      outArrNormed.forEach((val, idx) => {
        if (val !== null) {
          const max = gridStatsArr[idx].max
          const min = gridStatsArr[idx].min
          if (max === null || val > max) {
            gridStatsArr[idx].max = val
            gridStatsArr[idx].min = val * -1
          }
          if (min === null || val < min) {
            gridStatsArr[idx].max = val * -1
            gridStatsArr[idx].min = val
          }
        }
      })
      return outArrNormed
    })
    return cols
  })

  // Now map the values to a color index
  const rowColColors: RefineryModifiers[][] = rows.map((row) =>
    row.map<RefineryModifiers>((col) => {
      const vals = col.map((val, idx) => {
        const max = gridStatsArr[idx].max
        const min = gridStatsArr[idx].min
        if (val == null || max === null || min === null) return null
        const normedVal = idx === 1 ? 1 - (val - min) / (max - min) : (val - min) / (max - min)
        return Math.round((normedVal + Number.EPSILON) * 100)
      }) as RefineryModifiers
      return vals
    })
  )

  const tables = ['Yield', 'Refining Time']

  return (
    <>
      {tables.map((tableName, tableIdx) => (
        <TableContainer sx={{ align: 'center' }} key={`table-${tableIdx}`}>
          <Table size="small" aria-label="simple table" sx={{ my: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    background: theme.palette.primary.main,
                    color: 'black',
                    fontFamily: fontFamilies.robotoMono,
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                  }}
                >
                  {tableName}
                </TableCell>

                {hAxis.map(([, hAxisLabel], colIdx) => (
                  <TableCell
                    key={`collabel-${colIdx}`}
                    align="left"
                    valign="top"
                    sx={{
                      fontSize: '1.2rem',
                      textAlign: 'center',
                      fontFamily: fontFamilies.robotoMono,
                      fontWeight: 'bold',
                      background: colIdx % 2 === 0 ? '#000000' : '#222222',
                    }}
                  >
                    {hAxisLabel}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, rowIdx) => {
                return (
                  <TableRow key={`row-${rowIdx}`}>
                    <TableCell component="th" scope="row">
                      <MValue value={vAxis[rowIdx][1]} format={MValueFormat.string} />
                    </TableCell>
                    {row.map((col, colIdx) => {
                      const val = col[tableIdx]
                      const rowColorIdx = rowColColors[rowIdx][colIdx][tableIdx]
                      const val1IsMax = val !== null && val === gridStatsArr[tableIdx].max
                      const val1IsMin = val !== null && val === gridStatsArr[tableIdx].min
                      const transparency = val1IsMax || val1IsMin ? 'ff' : 'aa'
                      const bgcol = rowColorIdx ? bgColors[rowColorIdx] + transparency : null
                      const fgcol = rowColorIdx ? fgColors[rowColorIdx] + transparency : null
                      return (
                        <TableCell
                          align="right"
                          key={`cell-${rowIdx}-${colIdx}`}
                          sx={{
                            lineHeight: 1,
                            p: 0.5,
                            background: val !== 0 ? bgcol : colIdx % 2 === 0 ? '#00000066' : '#11111166',
                            color: fgcol,
                          }}
                        >
                          {val !== 0 && (
                            <MValue
                              value={val}
                              format={MValueFormat.modifier}
                              typoProps={{ component: 'div' }}
                              decimals={2}
                            />
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </>
  )
}
