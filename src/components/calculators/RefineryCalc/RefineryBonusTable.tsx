import * as React from 'react'
import {
  OreProcessingLookup,
  RefineryEnum,
  RefineryModifiers,
  ShipOreEnum,
  getShipOreName,
  findPrice,
} from '@regolithco/common'
import { TableContainer, Table, TableHead, TableRow, TableCell, useTheme, TableBody, Typography } from '@mui/material'
import Gradient from 'javascript-color-gradient'
import { MValue, MValueFormat } from '../../fields/MValue'
import { fontFamilies } from '../../../theme'
import { useAsyncLookupData } from '../../../hooks/useLookups'

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

  const { hAxis, vAxis, rows } = useAsyncLookupData(async (ds) => {
    const tradeportData = await ds.getLookup('tradeportLookups')
    const refineryBonusLookup = await ds.getLookup('refineryBonusLookup')

    const hAxis: [RefineryEnum, string][] = Object.values(RefineryEnum).map((refVal) => [
      refVal as RefineryEnum,
      (tradeportData.find(({ code }) => code === refVal)?.name as string) || (refVal as string),
    ])
    hAxis.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))

    let vAxis: [ShipOreEnum, string][] = []
    const sortable = Object.entries(ShipOreEnum)
      .filter(([, val]) => val !== ShipOreEnum.Inertmaterial)
      .map(([oreKey, oreVal]) => [oreKey, oreVal])
    const prices = await Promise.all(
      sortable.map(([, oreVal]) => findPrice(ds, oreVal as ShipOreEnum, undefined, true))
    )
    sortable.sort(
      (a, b) =>
        prices[sortable.findIndex(([, oreVal]) => oreVal === b[1])] -
        prices[sortable.findIndex(([, oreVal]) => oreVal === a[1])]
    )
    vAxis = sortable.map(([, oreVal]) => [oreVal as ShipOreEnum, getShipOreName(oreVal as ShipOreEnum)])

    const rows: RefineryModifiers[][] = vAxis.map(([ore]) => {
      const cols: RefineryModifiers[] = hAxis.map(([refinery, name]) => {
        const opl = refineryBonusLookup[refinery] as OreProcessingLookup
        if (!opl) return [NaN, NaN, NaN]
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

    return { hAxis, vAxis, rows }
  }, []) || { hAxis: [], vAxis: [], rows: [] }

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

  const tables = ['Yield']
  const reversed = [false, true, true]

  return (
    <>
      {tables.map((tableName, tableIdx) => (
        <TableContainer
          sx={{
            align: 'center',
            [theme.breakpoints.down('sm')]: {
              '& .MuiTableCell-root * ': {
                fontSize: '0.75rem!important',
              },
            },
          }}
          key={`table-${tableIdx}`}
        >
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
                    '& .MuiTableCell-root * ': {
                      fontSize: '0.75rem!important',
                    },
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
                      px: 0.1,
                      textAlign: 'center',
                      fontFamily: fontFamilies.robotoMono,
                      background: colIdx % 2 === 0 ? '#000000' : '#222222',
                      '& .MuiTableCell-root * ': {
                        fontSize: '0.75rem!important',
                      },
                    }}
                  >
                    <Typography variant="h5" sx={{ fontSize: '1.2rem' }} component="div">
                      {hAxisLabel.split(' ')[0]}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem' }} component="div">
                      {hAxisLabel.split(' ').slice(1).join(' ')}
                    </Typography>
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
                      const valIsNan = isNaN(val)
                      const rowColorIdx = rowColColors[rowIdx][colIdx][tableIdx]
                      const val1IsMax = val !== null && val === gridStatsArr[tableIdx].max
                      const val1IsMin = val !== null && val === gridStatsArr[tableIdx].min
                      const transparency = val1IsMax || val1IsMin ? 'ff' : 'aa'
                      const isReversed = reversed[tableIdx]
                      let bgcol = rowColorIdx ? bgColors[rowColorIdx] + transparency : null
                      let fgcol = rowColorIdx ? fgColors[rowColorIdx] + transparency : null
                      if (isReversed) {
                        bgcol = rowColorIdx ? bgColors[bgColors.length - rowColorIdx] + transparency : null
                        fgcol = rowColorIdx ? fgColors[fgColors.length - rowColorIdx] + transparency : null
                      }
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
                          {val !== 0 && !valIsNan && (
                            <MValue
                              value={val}
                              format={MValueFormat.modifier}
                              typoProps={{ component: 'div' }}
                              decimals={2}
                            />
                          )}
                          {valIsNan && '??'}
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
