import * as React from 'react'
import { useTheme, Typography, Box, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { ObjectValues, RegolithStatsSummary, RegolithMonthStats, RegolithAllTimeStats } from '@regolithco/common'
import { CartesianMarkerProps, linearGradientDef } from '@nivo/core'
import { ResponsiveLine, Serie, LineSvgProps } from '@nivo/line'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { fontFamilies } from '../../../theme'
import dayjs, { Dayjs } from 'dayjs'
import { isUndefined } from 'lodash'
// import log from 'loglevel'

export interface DailyMonthlyChartProps {
  last30Days?: RegolithMonthStats
  allTime?: RegolithAllTimeStats
  chartType: 'workOrders' | 'scouting'
  resolution?: ChartResolutionsEnum
  statsLoading: boolean
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const
type ExtendedCartesianMarkerProps = Pick<CartesianMarkerProps, 'value' | 'legend'> &
  Partial<Omit<CartesianMarkerProps, 'value' | 'legend'>>

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
    const chartformat = '%Y-%m-%d'
    if (!last30Days && !allTime) return { chartData: [], chartformat }
    switch (chartResolution) {
      case ChartTypesEnum.DAY:
        if (statsLoading || !last30Days?.days)
          return { chartData: formatChartData({}, chartResolution, chartType), chartformat }
        return { chartData: formatChartData(last30Days?.days, chartResolution, chartType, 30), chartformat: '%m-%d' }
      case ChartTypesEnum.MONTH:
        if (statsLoading || !allTime) return { chartData: formatChartData({}, chartResolution, chartType), chartformat }
        return { chartData: formatChartData(allTime, chartResolution, chartType), chartformat: '%Y-%m' }
      // case ChartTypesEnum.YEAR:
      //   return formatChartData(stats?.yearly)
      default:
        if (statsLoading || !last30Days?.days)
          return { chartData: formatChartData({}, chartResolution, chartType), chartformat }
        return { chartData: formatChartData(last30Days?.days, chartResolution, chartType, 30), chartformat: '%m' }
    }
  }, [chartResolution, last30Days, allTime])

  const markers = React.useMemo(() => getMarkers(chartResolution), [chartResolution])

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
      <Box sx={{ height: 300 }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 30, right: 20, bottom: 60, left: 10 }}
          // xScale={{
          //   type: 'linear',
          //   min: 'auto',
          //   max: 'auto',
          //   nice: true,
          //   clamp: true,
          // }}
          theme={{
            // textColor: 'white',
            legends: {
              text: {
                fill: 'white',
              },
            },
            markers: {
              fontSize: '10',
              lineColor: 'white',
              textColor: 'white',
              lineStrokeWidth: 1,
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
          markers={markers}
          // curve="monotoneX"
          enableArea={true}
          enableGridX={false}
          enableGridY={false}
          enableSlices="x"
          // yScale={{
          //   type: 'linear',
          //   min: 'auto',
          //   max: 'auto',
          //   nice: true,
          //   clamp: true,
          //   // stacked: true,
          //   // reverse: false,
          // }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            format: (d) => {
              const date = new Date(d)
              if (chartResolution === ChartTypesEnum.MONTH) {
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
                  {chartResolution === ChartTypesEnum.MONTH &&
                    `${months[sliceDate.getMonth()]} ${sliceDate.getFullYear()}`}
                  {chartResolution === ChartTypesEnum.DAY && (slice.points[0].data.x as Date).toDateString()}
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
                      <span>
                        {MValueFormatter((point.data as unknown as { val: string }).val, MValueFormat.number_sm, 0)}
                      </span>
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
          defs={[
            linearGradientDef('gradientA', [
              { offset: 0, color: 'inherit' },
              { offset: 100, color: 'inherit', opacity: 0 },
            ]),
          ]}
          fill={[{ match: '*', id: 'gradientA' }]}
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
  'users' | 'workOrders' | 'sessions' | 'grossProfitaUEC' | 'lossaUEC'
  // | 'rawOreSCU'
>
type ScoutingKeys = keyof RegolithStatsSummary['scouting']

const WORK_ORDER_LINES: Record<WorkOrderKeys, { label: string; color: string }> = {
  grossProfitaUEC: { label: 'Gross Profit (aUEC)', color: 'hsl(132, 92%, 50%)' },
  lossaUEC: { label: 'Loss (aUEC)', color: 'hsl(0, 0%, 51%)' },
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

const getMarkers = (chartType: ChartResolutionsEnum): LineSvgProps['markers'] => {
  // If it's MONTH Then we should go from march 2023 to now. if it's daily then it should be the last 30 days
  const startDate: dayjs.Dayjs = chartType === ChartTypesEnum.MONTH ? dayjs('2023-03-01') : dayjs().subtract(30, 'days')
  const endDate: dayjs.Dayjs = dayjs()
  const rounding = chartType === ChartTypesEnum.MONTH ? 'month' : 'day'

  console.log('getMarkers', { startDate, endDate, today: dayjs() })

  const markerStyle: Omit<CartesianMarkerProps, 'legend' | 'value'> = {
    axis: 'x',
    lineStyle: { stroke: 'white', strokeWidth: 1 },
    textStyle: { fill: 'white', fontSize: 9 },
    legendOrientation: 'vertical',
    legendPosition: 'bottom-right',
  }

  const markerPieces: ExtendedCartesianMarkerProps[] = [
    {
      value: dayjs('2023-03-01').startOf('month').toDate(),
      legend: 'Regolith LIVE! (SC 3.18)',
    },
    // {
    // SC 3.18 : March 10th 2023
    //   value: dayjs('2023-03-10').startOf('month').toDate(),
    //   legend: 'SC 3.18',
    // },
    {
      // Starfield launched September 6, 2023
      value: dayjs('2023-09-06').startOf(rounding).toDate(),
      legend: 'Starfield (3.20)',
    },
    {
      // SC 3.19 : May 16th 2023
      value: dayjs('2023-05-16').startOf(rounding).toDate(),
      legend: '3.19',
    },
    // {
    // SC 3.20 : September 19th 2023
    //   value: dayjs('2023-09-19').startOf(rounding).toDate(),
    //   legend: 'SC 3.20',
    // },
    // {
    // SC 3.21 : October 19th 2023
    //   value: dayjs('2023-10-19').startOf(rounding).toDate(),
    //   legend: 'SC 3.21',
    // },
    {
      // SC 3.22 : December 14st 2023
      value: dayjs('2023-12-14').startOf(rounding).toDate(),
      legend: '3.22',
    },
    {
      // citizen con Oct 21 - 22, 2023
      value: dayjs('2023-10-21').startOf(rounding).toDate(),
      legend: 'CitizenCon (3.21)',
    },
    {
      // IAE 2023 Nov 30, 2023
      value: dayjs('2023-11-30').startOf(rounding).toDate(),
      legend: 'IAE 2953',
    },
    {
      // Fleet week 2024: May 24, 2024
      value: dayjs('2024-05-24').startOf(rounding).toDate(),
      legend: 'Fleet Week 2954 (3.23)',
    },
    {
      // citizen con Oct 21 - 22, 2023
      value: dayjs('2024-08-29').startOf(rounding).toDate(),
      legend: '3.24',
    },
  ].filter((m) => m.value >= startDate.toDate() && m.value <= endDate.toDate())

  // If this is DAILY then also add all the sundays
  if (chartType === ChartTypesEnum.DAY) {
    // Find all the sundays between the start and end date
    const sundays: Dayjs[] = []
    let sunday = startDate
    while (sunday.isBefore(endDate)) {
      if (sunday.day() === 0) {
        sundays.push(sunday)
      }
      sunday = sunday.add(1, 'day')
    }

    // Add the sundays to the markers
    sundays.forEach((sunday) => {
      markerPieces.push({
        value: sunday.startOf('day').toDate(),
        lineStyle: { stroke: '#555555', strokeWidth: 2, opacity: 1 },
        legend: 'Sunday',
        textStyle: { fill: 'white', fontSize: 8 },
      } as ExtendedCartesianMarkerProps)
    })
  }
  // Sort date ascending
  markerPieces.sort((a, b) => (a.value > b.value ? 1 : -1))

  return markerPieces.map((m) => {
    return {
      ...markerStyle,
      ...m,
      // These are required by Nivo or it throws an error
      legendOffsetY: 10,
      legendOffsetX: 10,
    }
  })
}
