import * as React from 'react'
import {
  lookups,
  yieldCalc,
  RefineryEnum,
  RefineryMethodEnum,
  getRefineryMethodName,
  ShipOreEnum,
  getRefiningCost,
  getRefiningTime,
  getShipOreName,
} from '@regolithco/common'
import { TableContainer, Table, TableHead, TableRow, TableCell, useTheme, TableBody } from '@mui/material'
import Gradient from 'javascript-color-gradient'
import { MValue, MValueFormat } from '../../fields/MValue'
import { RefineryMetric, RefineryPivot } from './RefineryCalc'
import { fontFamilies } from '../../../theme'

// vAxis={verticalAxis} hAxis={horizontalAxis} oreType={oreType} value={oreAmt}
interface RefineryCalcTableProps {
  oreAmt?: number
  method?: RefineryMethodEnum
  oreType?: ShipOreEnum
  refMetric: RefineryMetric
  refMode: RefineryPivot
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
  // Only used for time v profit
  const gridStatsArr: [GridStats, GridStats] = [
    { max: null, min: null },
    { max: null, min: null },
  ]
  const bgColorArr = ['#a10d00', '#00861b']
  const bgColors = new Gradient()
    .setColorGradient(...bgColorArr)
    .setMidpoint(101) // 100 is the number of colors to generate. Should be enough stops for our ores
    .getColors()
  const fgColors = bgColors.map((color) => theme.palette.getContrastText(color))

  const hAxis = Object.values(RefineryEnum).map((refVal) => [refVal, refVal])
  hAxis.sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))

  let vAxis: [ShipOreEnum | RefineryMethodEnum, string][] = []
  if (refMode === RefineryPivot.oreType) {
    const sortable = Object.entries(ShipOreEnum)
      .filter(([, val]) => val !== ShipOreEnum.Inertmaterial)
      .map(([oreKey, oreVal]) => [oreKey, oreVal])
    sortable.sort(
      (a, b) =>
        (lookups.marketPriceLookup[b[1] as ShipOreEnum]?.refined as number) -
        (lookups.marketPriceLookup[a[1] as ShipOreEnum]?.refined as number)
    )
    vAxis = sortable.map(([, oreVal]) => [oreVal as ShipOreEnum, getShipOreName(oreVal as ShipOreEnum)])
  } else {
    vAxis = Object.values(RefineryMethodEnum).map((methodVal) => [methodVal, getRefineryMethodName(methodVal)])
    vAxis.sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))
  }

  const rows: [number | null, number | null][][] = vAxis.map(([rowKey]) => {
    const cols: [number | null, number | null][] = hAxis.map(([colKey]) => {
      let outArr: [number | null, number | null] = [null, null]

      // We need to send the SCU in as cSCU for the calculation
      const finalAmt = oreAmt ? oreAmt * 100 : 0
      const finalOre = (refMode === RefineryPivot.oreType ? rowKey : oreType) as ShipOreEnum
      const finalRefinery = colKey as RefineryEnum

      // if (refMode === RefineryPivot.oreType && finalOre === ShipOreEnum.Inertmaterial) return [null, null]
      const finalMethod = (
        refMode === RefineryPivot.oreType ? method : (rowKey as RefineryMethodEnum)
      ) as RefineryMethodEnum
      const oreYield = yieldCalc(finalAmt, finalOre, finalRefinery, finalMethod)
      const refCost = getRefiningCost(oreYield, finalOre, finalRefinery, finalMethod)
      const marketPrice = lookups.marketPriceLookup[finalOre]?.refined as number
      switch (refMetric) {
        case RefineryMetric.netProfit:
          outArr[0] = oreYield * marketPrice - refCost
          break
        case RefineryMetric.oreYields:
          outArr[0] = oreYield / 100
          break
        case RefineryMetric.refiningCost:
          outArr[0] = refCost
          break
        case RefineryMetric.refiningTime:
          outArr[0] = getRefiningTime(finalAmt, finalOre, finalRefinery, finalMethod)
          break
        case RefineryMetric.timeVProfit:
          // We need an array of values for this one to normalize things
          outArr = [oreYield * marketPrice - refCost, getRefiningTime(finalAmt, finalOre, finalRefinery, finalMethod)]
          break
      }
      if (outArr[0] !== null) {
        if (gridStatsArr[0].max === null || outArr[0] > gridStatsArr[0].max) gridStatsArr[0].max = outArr[0]
        if (gridStatsArr[0].min === null || outArr[0] < gridStatsArr[0].min) gridStatsArr[0].min = outArr[0]
      }
      if (outArr[1] !== null) {
        if (gridStatsArr[1].max === null || outArr[1] > gridStatsArr[1].max) gridStatsArr[1].max = outArr[1]
        if (gridStatsArr[1].min === null || outArr[1] < gridStatsArr[1].min) gridStatsArr[1].min = outArr[1]
      }
      return outArr
    })
    return cols
  })

  let numberFormat1 = MValueFormat.number
  let numberFormat2 = MValueFormat.number
  let reverseMeaningVal1 = false
  let reverseMeaningVal2 = false
  let decimalVal1 = 0
  switch (refMetric) {
    case RefineryMetric.netProfit:
      numberFormat1 = MValueFormat.number
      break
    case RefineryMetric.oreYields:
      decimalVal1 = 2
      numberFormat1 = MValueFormat.number
      break
    case RefineryMetric.refiningCost:
      numberFormat1 = MValueFormat.number
      reverseMeaningVal1 = true
      break
    case RefineryMetric.refiningTime:
      numberFormat1 = MValueFormat.duration_small
      reverseMeaningVal1 = true
      break
    case RefineryMetric.timeVProfit:
      numberFormat1 = MValueFormat.number
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
  if (refMetric === RefineryMetric.timeVProfit) {
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

  return (
    <TableContainer sx={{ align: 'center' }}>
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
              }}
            >
              {refMode === RefineryPivot.method && oreType && `${getShipOreName(oreType)}`}
              {refMode === RefineryPivot.oreType && method && `${getRefineryMethodName(method)}`}
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
                {row.map(([val1, val2], colIdx) => {
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
                      {
                        <MValue
                          value={val1}
                          format={numberFormat1}
                          typoProps={{ component: 'div' }}
                          decimals={decimalVal1}
                        />
                      }
                      {val2 && (
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
