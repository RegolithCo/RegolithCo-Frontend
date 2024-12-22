import * as React from 'react'
import { useTheme, Typography, Box, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { ObjectValues, RegolithStatsSummary, RegolithMonthStats, RegolithAllTimeStats } from '@regolithco/common'
import { Serie } from '@nivo/line'
import { fontFamilies } from '../../../theme'
import { isUndefined } from 'lodash'
import { StatsLineChart } from './StatsLineChart'
// import log from 'loglevel'

export interface DailyMonthlyChartProps {
  last30Days?: RegolithMonthStats
  allTime?: RegolithAllTimeStats
  chartType: 'workOrders' | 'scouting'
  resolution?: ChartResolutionsEnum
  statsLoading: boolean
}

export const ChartTypesEnum = {
  DAY: 'DAY',
  MONTH: 'MONTH',
  // YEAR: 'YEAR',
} as const
export type ChartResolutionsEnum = ObjectValues<typeof ChartTypesEnum>

/**
 * This is the wrpaper for all the types of things scouts can find
 * @param param0
 * @returns
 */
export const DailyMonthlyChart: React.FC<DailyMonthlyChartProps> = ({
  last30Days,
  allTime,
  statsLoading,
  chartType,
  resolution,
}) => {
  const theme = useTheme()
  const [chartResolution, setChartResolution] = React.useState<ChartResolutionsEnum>(resolution || ChartTypesEnum.MONTH)

  const { chartData } = React.useMemo(() => {
    if (!last30Days && !allTime) return { chartData: [] }
    switch (chartResolution) {
      case ChartTypesEnum.DAY:
        if (statsLoading || !last30Days?.days) return { chartData: formatChartData({}, chartResolution, chartType) }
        return { chartData: formatChartData(last30Days?.days, chartResolution, chartType, 30), chartformat: '%m-%d' }
      case ChartTypesEnum.MONTH:
        if (statsLoading || !allTime) return { chartData: formatChartData({}, chartResolution, chartType) }
        return { chartData: formatChartData(allTime.months, chartResolution, chartType), chartformat: '%Y-%m' }
      // case ChartTypesEnum.YEAR:
      //   return formatChartData(stats?.yearly)
      default:
        if (statsLoading || !last30Days?.days) return { chartData: formatChartData({}, chartResolution, chartType) }
        return { chartData: formatChartData(last30Days?.days, chartResolution, chartType, 30) }
    }
  }, [chartResolution, last30Days, allTime])

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.secondary.dark,
          fontWeight: 'bold',
          mb: 1,
          fontFamily: fontFamilies.robotoMono,
          borderBottom: `1px solid ${theme.palette.secondary.dark}`,
        }}
      >
        {chartType === 'workOrders' && 'Work Orders: '}
        {chartType === 'scouting' && 'Scouting: '}
        {chartResolution === ChartTypesEnum.DAY && 'Daily'}
        {chartResolution === ChartTypesEnum.MONTH && 'Monthly'}
        {/* {chartType === ChartTypesEnum.YEAR && 'Yearly'} */} Breakdown
      </Typography>
      <StatsLineChart chartData={chartData} resolution={chartResolution} loading={statsLoading} />

      <RadioGroup
        aria-labelledby="chart-type-radio"
        defaultValue="female"
        name="radio-buttons-group"
        row
        value={chartResolution}
        onChange={(e) => setChartResolution(e.target.value as ChartResolutionsEnum)}
      >
        <FormControlLabel value={ChartTypesEnum.MONTH} control={<Radio />} label="By Month" />
        <FormControlLabel value={ChartTypesEnum.DAY} control={<Radio />} label="By Day" />
        {/* <FormControlLabel value={ChartTypesEnum.YEAR} control={<Radio />} label="Year" /> */}
      </RadioGroup>
    </Box>
  )
}

type WorkOrderKeys = keyof Pick<
  RegolithStatsSummary,
  'users' | 'workOrders' | 'sessions' | 'grossProfitaUEC'
  // | 'lossaUEC'
  // | 'rawOreSCU'
>
type ScoutingKeys = keyof RegolithStatsSummary['scouting']

const WORK_ORDER_LINES: Record<WorkOrderKeys, { label: string; color: string }> = {
  grossProfitaUEC: { label: 'Gross Profit (aUEC)', color: 'hsl(132, 92%, 50%)' },
  // lossaUEC: { label: 'Loss (aUEC)', color: 'hsl(0, 0%, 51%)' },
  workOrders: { label: 'Work Orders', color: 'hsl(295, 70%, 50%)' },
  sessions: { label: 'Mining Sessions', color: 'hsl(88, 70%, 50%)' },
  users: { label: 'Active Users', color: 'hsl(237, 70%, 50%)' },
}
const SCOUTING_LINES: Record<ScoutingKeys, { label: string; color: string }> = {
  rocks: { label: 'Rocks', color: 'hsl(66, 70%, 50%)' },
  wrecks: { label: 'Wrecks', color: 'hsl(66, 70%, 50%)' },
  gems: { label: 'Gems', color: 'hsl(66, 70%, 50%)' },
}

export function formatChartData(
  stats: Record<string, RegolithStatsSummary>,
  chartResolution: ChartResolutionsEnum,
  chartType: 'workOrders' | 'scouting',
  maxVals?: number
): Serie[] {
  if (!stats) return []
  let keys = Object.keys(stats)
  keys.sort((a, b) => (new Date(a) > new Date(b) ? 1 : -1))

  if (maxVals) {
    // Choose the last n values
    keys = keys.splice(keys.length - maxVals, keys.length)
  }

  const series: Serie[] = []
  Object.entries(chartType === 'scouting' ? SCOUTING_LINES : WORK_ORDER_LINES).forEach(([key, { label, color }]) => {
    const serie: Serie = {
      id: label,
      color,
      data: keys.map((k) => {
        const dateVal = chartResolution === ChartTypesEnum.MONTH ? new Date(k + 'T00:00:00') : new Date(k + 'T00:00:00')
        // If the dateval is the current month and the month is not over then we need to pro-rate the value
        let value: number = stats[k][key as WorkOrderKeys | ScoutingKeys]
        if (isUndefined(value)) value = stats[k].scouting[key as keyof RegolithStatsSummary['scouting']]
        if (chartResolution === ChartTypesEnum.MONTH) {
          const now = new Date()
          if (now.getMonth() === dateVal.getMonth() && now.getFullYear() === dateVal.getFullYear()) {
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
            const daysPassed = now.getDate()
            const proRate = daysPassed / daysInMonth
            value = value / proRate
          }
        }
        // Make sure to handle any NaN or null values
        if (isNaN(value) || value === null) {
          value = 0
        }
        return {
          //
          x: dateVal,
          y: value,
          val: value,
        }
      }),
    }
    // Now normalize the y
    const max = serie.data.reduce((acc, cur) => Math.max(acc, (cur.y as number) || 0), 0)
    serie.data.forEach((d) => {
      if (max === 0) {
        d.y = 0
        return
      }
      d.y = (d.val || 0) / max
    })

    series.push(serie)
  })
  return series
}
