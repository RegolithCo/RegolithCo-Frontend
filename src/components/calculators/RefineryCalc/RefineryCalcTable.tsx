import * as React from 'react'
import {
  yieldCalc,
  getRefiningTime,
  RefineryEnum,
  RefineryMethodEnum,
  getRefineryMethodName,
  ShipOreEnum,
  getShipOreName,
  findPrice,
  getRefiningCost,
  UEXTradeport,
} from '@regolithco/common'
import { TableContainer, Table, TableHead, TableRow, TableCell, useTheme, TableBody, Typography } from '@mui/material'
import Gradient from 'javascript-color-gradient'
import { MValue, MValueFormat } from '../../fields/MValue'
import { RefineryMetricEnum, RefineryPivotEnum } from './RefineryCalc'
import { fontFamilies } from '../../../theme'
import { LookupsContext } from '../../../context/lookupsContext'

// vAxis={verticalAxis} hAxis={horizontalAxis} oreType={oreType} value={oreAmt}
interface RefineryCalcTableProps {
  oreAmt?: number
  method?: RefineryMethodEnum
  oreType?: ShipOreEnum
  refMetric: RefineryMetricEnum
  refMode: RefineryPivotEnum
}

type GridStats = { max: number | null; min: number | null }

export const RefineryCalcTable: React.FC<RefineryCalcTableProps> = ({
  oreAmt,
  oreType,
  method,
  refMetric,
  refMode,
}) => {
  const theme = useTheme()
  const dataStore = React.useContext(LookupsContext)
  const [hAxis, setHAxis] = React.useState<string[][]>([])
  const [vAxis, setVAxis] = React.useState<[ShipOreEnum | RefineryMethodEnum, string][]>([])
  const [rows, setRows] = React.useState<[number | null, number | null][][]>([])
  // Only used for time v profit
  const [gridStatsArr, setGridStatsArr] = React.useState<GridStats[]>([
    { max: null, min: null },
    { max: null, min: null },
  ])
  const bgColorArr = ['#a10d00', '#fd8300', '#fdbe00', '#fdbe00', '#00861b']
  const bgColors = new Gradient()
    .setColorGradient(...bgColorArr)
    .setMidpoint(101) // 100 is the number of colors to generate. Should be enough stops for our ores
    .getColors()
  const fgColors = bgColors.map((color) => theme.palette.getContrastText(color))

  React.useEffect(() => {
    const calcTable = async () => {
      if (!dataStore.ready) return
      const tradeportData = ((await dataStore.getLookup('tradeportLookups')) || []).filter(
        ({ refinery }) => refinery === true
      )
      const hAxis = Object.values(RefineryEnum).map((refVal) => [
        refVal as RefineryEnum,
        (tradeportData.find(({ code }) => code.endsWith(refVal))?.name_short as string) || (refVal as string),
      ])
      hAxis.sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))

      let vAxis: [ShipOreEnum | RefineryMethodEnum, string][] = []
      if (refMode === RefineryPivotEnum.oreType) {
        const sortable = Object.entries(ShipOreEnum)
          .filter(([, val]) => val !== ShipOreEnum.Inertmaterial)
          .map(([oreKey, oreVal]) => [oreKey, oreVal])
        const prices = await Promise.all(
          sortable.map(([, oreVal]) => findPrice(dataStore, oreVal as ShipOreEnum, undefined, true))
        )
        sortable.sort(
          (a, b) =>
            prices[sortable.findIndex(([, val]) => val === b[1])] -
            prices[sortable.findIndex(([, val]) => val === a[1])]
        )
        vAxis = sortable.map(([, oreVal]) => [oreVal as ShipOreEnum, getShipOreName(oreVal as ShipOreEnum)])
      } else {
        vAxis = Object.values(RefineryMethodEnum).map((methodVal) => [methodVal, getRefineryMethodName(methodVal)])
        vAxis.sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))
      }
      // now we need to figure out the rows
      const newGridStats: GridStats[] = [
        { max: null, min: null },
        { max: null, min: null },
      ]
      const rows: [number | null, number | null][][] = await Promise.all(
        vAxis.map(async ([rowKey]) => {
          const cols: [number | null, number | null][] = await Promise.all(
            hAxis.map(async ([colKey]) => {
              let outArr: [number | null, number | null] = [null, null]

              // We need to send the SCU in as cSCU for the calculation
              const finalAmt = oreAmt ? oreAmt * 100 : 0
              const finalOre = (refMode === RefineryPivotEnum.oreType ? rowKey : oreType) as ShipOreEnum
              const finalRefinery = colKey as RefineryEnum

              const finalMethod = (
                refMode === RefineryPivotEnum.oreType ? method : (rowKey as RefineryMethodEnum)
              ) as RefineryMethodEnum
              const oreYield = await yieldCalc(dataStore, finalAmt, finalOre, finalRefinery, finalMethod)
              const refCost = await getRefiningCost(dataStore, oreYield, finalOre, finalRefinery, finalMethod)
              const marketPrice = (await findPrice(dataStore, finalOre as ShipOreEnum, undefined, true)) / 100
              switch (refMetric) {
                case RefineryMetricEnum.netProfit:
                  outArr[0] = oreYield * marketPrice - refCost
                  break
                case RefineryMetricEnum.oreYields:
                  outArr[0] = oreYield / 100
                  break
                case RefineryMetricEnum.refiningCost:
                  outArr[0] = refCost
                  break
                case RefineryMetricEnum.refiningTime:
                  outArr[0] = await getRefiningTime(dataStore, finalAmt, finalOre, finalRefinery, finalMethod)
                  break
                case RefineryMetricEnum.timeVProfit:
                  // We need an array of values for this one to normalize things
                  outArr = [
                    oreYield * marketPrice - refCost,
                    await getRefiningTime(dataStore, finalAmt, finalOre, finalRefinery, finalMethod),
                  ]
                  break
              }
              if (outArr[0] !== null) {
                if (newGridStats[0].max === null || outArr[0] > newGridStats[0].max) newGridStats[0].max = outArr[0]
                if (newGridStats[0].min === null || outArr[0] < newGridStats[0].min) newGridStats[0].min = outArr[0]
              }
              if (outArr[1] !== null) {
                if (newGridStats[1].max === null || outArr[1] > newGridStats[1].max) newGridStats[1].max = outArr[1]
                if (newGridStats[1].min === null || outArr[1] < newGridStats[1].min) newGridStats[1].min = outArr[1]
              }
              return outArr
            })
          )
          return cols
        })
      )
      setGridStatsArr(newGridStats)
      setHAxis(hAxis)
      setVAxis(vAxis)
      setRows(rows)
    }
    calcTable()
  }, [oreAmt, oreType, method, refMetric, refMode])

  // const { hAxis, vAxis, rows } = lookupData || { hAxis: [], vAxis: [], rows: [] }

  let numberFormat1: MValueFormat = MValueFormat.number
  let numberFormat2: MValueFormat = MValueFormat.number
  let reverseMeaningVal1 = false
  let reverseMeaningVal2 = false
  let decimalVal1: number | undefined = 0
  switch (refMetric) {
    case RefineryMetricEnum.netProfit:
      numberFormat1 = MValueFormat.currency_sm
      decimalVal1 = undefined
      break
    case RefineryMetricEnum.oreYields:
      decimalVal1 = 2
      numberFormat1 = MValueFormat.volSCU
      break
    case RefineryMetricEnum.refiningCost:
      numberFormat1 = MValueFormat.currency_sm
      decimalVal1 = undefined
      reverseMeaningVal1 = true
      break
    case RefineryMetricEnum.refiningTime:
      numberFormat1 = MValueFormat.duration_small
      reverseMeaningVal1 = true
      break
    case RefineryMetricEnum.timeVProfit:
      numberFormat1 = MValueFormat.currency_sm
      decimalVal1 = undefined
      numberFormat2 = MValueFormat.duration_small
      reverseMeaningVal2 = true
      break
    default:
      break
  }

  // Now map the values to a color index
  const rowColColors: number[][] = rows.map((row) => {
    const normalizedValues = row.map(([val1, val2]) => {
      // If even the first value is null then we can't normalize. No color for you
      if (gridStatsArr[0].max === null || gridStatsArr[0].min === null || val1 === null) return null
      // If the second value is null then we only need to normalize the first value
      if (gridStatsArr[1].max === null || gridStatsArr[1].min === null || val2 === null) {
        const normVal1 = (val1 - gridStatsArr[0].min) / (gridStatsArr[0].max - gridStatsArr[0].min)
        return reverseMeaningVal1 ? 1 - normVal1 : normVal1
      }
      // If we get here then we have two values to normalize
      else {
        // We need to normalize both values
        const normVal1 = (val1 - gridStatsArr[0].min) / (gridStatsArr[0].max - gridStatsArr[0].min)
        const normVal2 = (val2 - gridStatsArr[1].min) / (gridStatsArr[1].max - gridStatsArr[1].min)
        const normVal1Rev = reverseMeaningVal1 ? 1 - normVal1 : normVal1
        const normVal2Rev = reverseMeaningVal2 ? 1 - normVal2 : normVal2
        return (normVal1Rev + normVal2Rev) / 2
      }
    })
    const colorIdxs = normalizedValues.map((colVal) =>
      colVal !== null ? Math.round((colVal - Number.EPSILON) * 100) : null
    )
    return colorIdxs as [number, number, number, number, number, number]
  })

  // Since we combined the metrics we need to renormalize the colors
  if (refMetric === RefineryMetricEnum.timeVProfit) {
    const maxVal = Math.max(...rowColColors.map((row) => Math.max(...row)))
    const minVal = Math.min(...rowColColors.map((row) => Math.min(...row)))
    rowColColors.forEach((row) => {
      row.forEach((col, idx) => {
        if (col !== null) {
          row[idx] = Math.round(((col - minVal) / (maxVal - minVal)) * 100)
        }
      })
    })
  }

  if (!dataStore.ready) return <div>Loading...</div>
  return (
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
    >
      <Table size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                background: theme.palette.primary.main,
                color: 'black',
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
                fontSize: '1.2rem',

                position: 'sticky',
                zIndex: 3,
                [theme.breakpoints.down('sm')]: {
                  fontSize: '0.75rem',
                },
              }}
            >
              {refMode === RefineryPivotEnum.method && oreType && `${getShipOreName(oreType)}`}
              {refMode === RefineryPivotEnum.oreType && method && `${getRefineryMethodName(method)}`}
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
                    // STICKY FIRST COLUMN
                    position: 'sticky',
                    background: theme.palette.background.default,
                    zIndex: 3,
                    borderRight: `3px solid ${theme.palette.primary.main}`,
                  }}
                >
                  <MValue value={vAxis[rowIdx][1]} format={MValueFormat.string} />
                </TableCell>
                {row.map(([val1, val2], colIdx) => {
                  const val1IsNan = val1 !== null && isNaN(val1)
                  const val2IsNan = val2 !== null && isNaN(val2)
                  const val1IsMax = val1 !== null && val1 === gridStatsArr[0].max
                  const val1IsMin = val1 !== null && val1 === gridStatsArr[0].min
                  const val2IsMax = val2 !== null && val2 === gridStatsArr[1].max
                  const val2IsMin = val2 !== null && val2 === gridStatsArr[1].min
                  const transparency = val1IsMax || val1IsMin || val2IsMax || val2IsMin ? 'ff' : 'aa'
                  return (
                    <TableCell
                      align="right"
                      key={`cell-${rowIdx}-${colIdx}`}
                      sx={{
                        lineHeight: 1,
                        p: 0.5,
                        background: bgColors[rowColColors[rowIdx][colIdx]] + transparency,
                        color: fgColors[rowColColors[rowIdx][colIdx]] + transparency,
                      }}
                    >
                      {!val1IsNan ? (
                        <MValue
                          value={val1}
                          format={numberFormat1}
                          typoProps={{ component: 'div' }}
                          decimals={decimalVal1}
                        />
                      ) : (
                        '??'
                      )}
                      {val2 && !val2IsNan && (
                        <MValue
                          value={val2}
                          format={numberFormat2}
                          typoProps={{ component: 'div', color: theme.palette.text.secondary }}
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
  )
}
