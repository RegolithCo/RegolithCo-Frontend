import * as React from 'react'
import {
  OreProcessingLookup,
  RefineryEnum,
  RefineryModifiers,
  ShipOreEnum,
  getShipOreName,
  findPrice,
  RefineryMethodEnum,
} from '@regolithco/common'
import { TableContainer, Table, TableHead, TableRow, TableCell, useTheme, TableBody, Typography } from '@mui/material'
import Gradient from 'javascript-color-gradient'
import { MValue, MValueFormat } from '../../fields/MValue'
import { fontFamilies } from '../../../theme'
import { LookupsContext } from '../../../context/lookupsContext'

type GridStats = { max: number | null; min: number | null }

export const RefineryBonusTable: React.FC = () => {
  const theme = useTheme()
  const dataStore = React.useContext(LookupsContext)
  const [hAxis, setHAxis] = React.useState<string[][]>([])
  const [vAxis, setVAxis] = React.useState<[ShipOreEnum | RefineryMethodEnum, string][]>([])
  const [rows, setRows] = React.useState<RefineryModifiers[][]>([])
  // Only used for time v profit
  const [gridStatsArr, setGridStatsArr] = React.useState<[GridStats, GridStats, GridStats]>([
    { max: null, min: null },
    { max: null, min: null },
    { max: null, min: null },
  ])

  const bgColorArr = ['#b93327', '#000000', '#229f63']
  const bgColors = new Gradient()
    .setColorGradient(...bgColorArr)
    .setMidpoint(101) // 100 is the number of colors to generate. Should be enough stops for our ores
    .getColors()
  const fgColors = bgColors.map((color) => theme.palette.getContrastText(color))

  React.useEffect(() => {
    const calcTable = async () => {
      if (!dataStore.ready) return
      const tradeportData = await dataStore.getLookup('tradeportLookups')
      const refineryBonusLookup = await dataStore.getLookup('refineryBonusLookup')

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
        sortable.map(([, oreVal]) => findPrice(dataStore, oreVal as ShipOreEnum, undefined, true))
      )
      sortable.sort(
        (a, b) =>
          prices[sortable.findIndex(([, oreVal]) => oreVal === b[1])] -
          prices[sortable.findIndex(([, oreVal]) => oreVal === a[1])]
      )
      vAxis = sortable.map(([, oreVal]) => [oreVal as ShipOreEnum, getShipOreName(oreVal as ShipOreEnum)])

      const newGridStatsArr: [GridStats, GridStats, GridStats] = [
        { max: null, min: null },
        { max: null, min: null },
        { max: null, min: null },
      ]
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
              const max = newGridStatsArr[idx].max
              const min = newGridStatsArr[idx].min
              if (max === null || val > max) {
                newGridStatsArr[idx].max = val
                newGridStatsArr[idx].min = val * -1
              }
              if (min === null || val < min) {
                newGridStatsArr[idx].max = val * -1
                newGridStatsArr[idx].min = val
              }
            }
          })
          return outArrNormed
        })
        return cols
      })
      setGridStatsArr(newGridStatsArr)
      setRows(rows)
      setHAxis(hAxis)
      setVAxis(vAxis)
    }
    calcTable()
  }, [])

  // const { hAxis, vAxis, rows } = lookupData || { hAxis: [], vAxis: [], rows: [] }

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
  if (!dataStore.ready) return <div>Loading...</div>
  return (
    <>
      {tables.map((tableName, tableIdx) => (
        <TableContainer
          sx={{
            align: 'center',
            overflow: 'auto',
            position: 'relative',
            '& table': {
              borderCollapse: 'separate',
              '& th:first-of-type': {
                left: 0,
                zIndex: 1,
              },
              '& thead th:first-of-type': {
                zIndex: 2,
              },
            },
            [theme.breakpoints.down('sm')]: {
              '& .MuiTableCell-root * ': {
                // border: '1px solid red',
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
                    // I want this first column to be sticky
                    position: 'sticky',
                    zIndex: 3,
                    [theme.breakpoints.down('sm')]: {
                      fontSize: '0.75rem',
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
                      pl: 1,
                      minWidth: '100px',
                      textAlign: 'left',
                      // Text align to the top
                      verticalAlign: 'top',
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
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        // I want this first column to be sticky
                        position: 'sticky',
                        background: theme.palette.background.default,
                        zIndex: 3,
                        borderRight: `3px solid ${theme.palette.primary.main}`,
                      }}
                    >
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
                            pr: 3,
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
