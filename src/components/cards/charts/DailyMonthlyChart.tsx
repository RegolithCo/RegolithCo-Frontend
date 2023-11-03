import * as React from 'react'
import { useTheme, Typography, Box, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { ObjectValues, StatsObject, StatsObjectSummary } from '@regolithco/common'
import { ResponsiveLine, Serie } from '@nivo/line'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { fontFamilies } from '../../../theme'

export interface DailyMonthlyChartProps {
  stats: Partial<StatsObjectSummary>
  statsLoading: Record<keyof StatsObjectSummary, boolean>
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

export const ChartTypesEnum = {
  DAY: 'DAY',
  MONTH: 'MONTH',
  // YEAR: 'YEAR',
} as const
export type ChartTypesEnum = ObjectValues<typeof ChartTypesEnum>

/**
 * This is the wrpaper for all the types of things scouts can find
 * @param param0
 * @returns
 */
export const DailyMonthlyChart: React.FC<DailyMonthlyChartProps> = ({ stats, statsLoading }) => {
  const theme = useTheme()
  const [chartType, setChartType] = React.useState<ChartTypesEnum>(ChartTypesEnum.MONTH)

  const { chartData, chartformat } = React.useMemo(() => {
    const chartformat = '%Y-%m-%d'
    if (!stats) return { chartData: [], chartformat }
    switch (chartType) {
      case ChartTypesEnum.DAY:
        if (statsLoading.daily || !stats?.daily) return { chartData: formatChartData({}, chartType), chartformat }
        return { chartData: formatChartData(stats?.daily, chartType, 30), chartformat: '%m-%d' }
      case ChartTypesEnum.MONTH:
        if (statsLoading.monthly || !stats?.monthly) return { chartData: formatChartData({}, chartType), chartformat }
        return { chartData: formatChartData(stats?.monthly, chartType), chartformat: '%Y-%m' }
      // case ChartTypesEnum.YEAR:
      //   return formatChartData(stats?.yearly)
      default:
        if (statsLoading.daily || !stats?.daily) return { chartData: formatChartData({}, chartType), chartformat }
        return { chartData: formatChartData(stats?.daily, chartType, 30), chartformat: '%m' }
    }
  }, [chartType, stats])

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
        {chartType === ChartTypesEnum.DAY && 'Daily'}
        {chartType === ChartTypesEnum.MONTH && 'Monthly'}
        {/* {chartType === ChartTypesEnum.YEAR && 'Yearly'} */} Breakdown
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 30, right: 20, bottom: 60, left: 10 }}
          xScale={{
            type: 'point',
            min: 'auto',
            max: 'auto',
            nice: true,
            clamp: true,
          }}
          theme={{
            textColor: 'white',
            legends: {
              text: {
                fill: 'white',
              },
            },
            crosshair: {
              line: {
                stroke: 'white',
              },
            },
            axis: {
              ticks: {
                text: {
                  fill: 'white',
                },
              },
            },
            tooltip: {
              container: {
                background: 'black',
              },
            },
          }}
          // curve="basis"
          enableArea={true}
          enableGridX={false}
          enableGridY={false}
          enableSlices="x"
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            nice: true,
            clamp: true,
            // stacked: true,
            // reverse: false,
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            format: (d) => {
              const date = new Date(d)
              if (chartType === ChartTypesEnum.MONTH) {
                // add 2 days to the date so that the month is correct in any timezone
                date.setDate(date.getDate() + 2)
                return months[date.getMonth()]
              } else return `${months[date.getMonth()]} ${date.getDate()}`
            },
            tickRotation: 45,
            legendPosition: 'middle',
          }}
          sliceTooltip={({ slice }) => {
            const sliceDate = slice.points[0].data.x as Date
            return (
              <div
                style={{
                  background: 'black',
                  padding: '9px 12px',
                  border: '1px solid #ccc',
                }}
              >
                <Typography variant="caption" sx={{ color: 'white' }}>
                  {chartType === ChartTypesEnum.MONTH && `${months[sliceDate.getMonth()]} ${sliceDate.getFullYear()}`}
                  {chartType === ChartTypesEnum.DAY && (slice.points[0].data.x as Date).toDateString()}
                </Typography>
                <div style={{ color: 'black' }}>
                  {slice.points.map((point) => (
                    <div
                      key={point.id}
                      style={{
                        color: point.serieColor,
                        padding: '3px 0',
                      }}
                    >
                      <strong>{point.serieId}: </strong>
                      <span>{MValueFormatter((point.data as any).val, MValueFormat.number_sm, 0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          }}
          axisLeft={null}
          pointSize={6}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={1}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={false}
          legends={[
            {
              anchor: 'top-left',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: -30,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 120,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',

              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </Box>

      <RadioGroup
        aria-labelledby="chart-type-radio"
        defaultValue="female"
        name="radio-buttons-group"
        row
        value={chartType}
        onChange={(e) => setChartType(e.target.value as ChartTypesEnum)}
      >
        <FormControlLabel value={ChartTypesEnum.MONTH} control={<Radio />} label="By Month" />
        <FormControlLabel value={ChartTypesEnum.DAY} control={<Radio />} label="By Day" />
        {/* <FormControlLabel value={ChartTypesEnum.YEAR} control={<Radio />} label="Year" /> */}
      </RadioGroup>
    </Box>
  )
}

type StatsObjectRowKeys = keyof Pick<
  StatsObject,
  'users' | 'workOrders' | 'sessions' | 'scoutingRocks' | 'aUEC'
  // | 'rawOreSCU'
>

const LINES: Record<StatsObjectRowKeys, { label: string; color: string }> = {
  aUEC: { label: 'aUEC Earned', color: 'hsl(132, 92%, 50%)' },
  scoutingRocks: { label: 'Scouted Rocks', color: 'hsl(66, 70%, 50%)' },
  workOrders: { label: 'Work Orders', color: 'hsl(295, 70%, 50%)' },
  sessions: { label: 'Mining Sessions', color: 'hsl(88, 70%, 50%)' },
  users: { label: 'Active Users', color: 'hsl(237, 70%, 50%)' },
  // rawOreSCU: { label: 'Ore Mined (SCU)', color: 'hsl(0, 0%, 51%)' },
}

export function formatChartData(
  stats: Record<string, StatsObject>,
  chartType: ChartTypesEnum,
  maxVals?: number
): Serie[] {
  let keys = Object.keys(stats)
  keys.sort((a, b) => (new Date(a) > new Date(b) ? 1 : -1))

  if (maxVals) {
    // Choose the last n values
    keys = keys.splice(keys.length - maxVals, keys.length)
  }

  const series: Serie[] = []
  Object.entries(LINES).forEach(([key, { label, color }]) => {
    const serie: Serie = {
      id: label,
      color,
      data: keys.map((k) => {
        const dateVal = new Date(k + 'T00:00:00')
        // If the dateval is the current month and the month is not over then we need to pro-rate the value
        let value: number = stats[k][key as StatsObjectRowKeys]
        if (chartType === ChartTypesEnum.MONTH) {
          const now = new Date()
          if (now.getMonth() === dateVal.getMonth() && now.getFullYear() === dateVal.getFullYear()) {
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
            const daysPassed = now.getDate()
            const proRate = daysPassed / daysInMonth
            value = value / proRate
          }
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
      d.y = (d.val || 0) / max
    })

    series.push(serie)
  })
  return series
}
