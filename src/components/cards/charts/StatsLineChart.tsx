import * as React from 'react'
import { Typography, Box } from '@mui/material'
import { ObjectValues } from '@regolithco/common'
import { CartesianMarkerProps, linearGradientDef } from '@nivo/core'
import { ResponsiveLine, LineSeries, LineSvgProps } from '@nivo/line'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import dayjs, { Dayjs } from 'dayjs'
// import log from 'loglevel'

export interface StatsLineChartProps {
  chartData: LineSeries[]
  resolution: ChartResolutionsEnum
  chartFormat?: string
  loading?: boolean
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const
type ExtendedCartesianMarkerProps = Pick<CartesianMarkerProps, 'value' | 'legend'> &
  Partial<Omit<CartesianMarkerProps, 'value' | 'legend'>>

export const ChartTypesEnum = {
  DAY: 'DAY',
  MONTH: 'MONTH',
  YEAR: 'YEAR',
} as const
export type ChartResolutionsEnum = ObjectValues<typeof ChartTypesEnum>

/**
 * This is the wrpaper for all the types of things scouts can find
 * @param param0
 * @returns
 */
export const StatsLineChart: React.FC<StatsLineChartProps> = ({ chartData, loading, resolution, chartFormat }) => {
  const markers = React.useMemo(() => getMarkers(resolution), [resolution])

  return (
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
            lineColor: 'white',
            lineStrokeWidth: 1,
            text: {
              fontFamily: 'sans-serif',
              fontSize: 10,
              fill: 'white',
              outlineWidth: 0,
              outlineColor: 'transparent',
              outlineOpacity: 1,
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
            if (resolution === ChartTypesEnum.MONTH) {
              // add 2 days to the date so that the month is correct in any timezone
              date.setDate(date.getDate() + 2)
              // if the month is january then we should show the year
              if (date.getMonth() === 0 || date.getMonth() === 11) {
                return `${months[date.getMonth()]} ${date.getFullYear()}`
              } else return months[date.getMonth()]
            } else return `${months[date.getMonth()]} ${date.getDate()}`
          },
          tickRotation: 45,
          legendPosition: 'middle',
        }}
        sliceTooltip={({ slice }) => {
          const sliceDate = slice.points[0].data.x as Date
          return (
            <Box
              sx={{
                color: 'white',
                background: 'black',
                padding: '9px 12px',
                border: '1px solid #ccc',
                minWidth: '250px',
              }}
            >
              <Typography variant="caption" sx={{ color: 'white' }}>
                {resolution === ChartTypesEnum.MONTH && `${months[sliceDate.getMonth()]} ${sliceDate.getFullYear()}`}
                {resolution === ChartTypesEnum.DAY && (slice.points[0].data.x as Date).toDateString()}
              </Typography>
              <div style={{ color: 'white' }}>
                {slice.points.map((point) => (
                  <div
                    key={point.id}
                    style={{
                      color: point.seriesColor,
                      padding: '3px 0',
                    }}
                  >
                    <strong>{point.seriesId}: </strong>
                    <span>
                      {MValueFormatter((point.data as unknown as { val: string }).val, MValueFormat.number_sm, 0)}
                    </span>
                  </div>
                ))}
              </div>
            </Box>
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
  )
}

const getMarkers = (chartType: ChartResolutionsEnum): LineSvgProps<LineSeries>['markers'] => {
  // If it's MONTH Then we should go from march 2023 to now. if it's daily then it should be the last 30 days
  const startDate: dayjs.Dayjs = chartType === ChartTypesEnum.MONTH ? dayjs('2023-03-01') : dayjs().subtract(30, 'days')
  const endDate: dayjs.Dayjs = dayjs()
  const rounding = chartType === ChartTypesEnum.MONTH ? 'month' : 'day'

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
      // 3.24 cargo refactor
      value: dayjs('2024-08-29').startOf(rounding).toDate(),
      legend: '3.24',
    },
    {
      // 3.24.1 cargo refactor
      value: dayjs('2024-09-14').startOf(rounding).toDate(),
      legend: '3.24.1',
    },
    {
      // 3.24.3 Last patch before 4.0
      value: dayjs('2024-11-22').startOf(rounding).toDate(),
      legend: 'IAE 2954 (3.24.3)',
    },
    {
      // 4.0 live
      value: dayjs('2024-12-19').startOf(rounding).toDate(),
      legend: '4.0',
    },
    {
      // 4.0 live
      value: dayjs('2025-01-29').startOf(rounding).toDate(),
      legend: '4.0.1',
    },
    {
      // 4.0 live
      value: dayjs('2025-03-28').startOf(rounding).toDate(),
      legend: '4.1',
    },
    {
      // 4.0 live
      value: dayjs('2025-05-13').startOf(rounding).toDate(),
      legend: 'Invictus 4.1.1',
    },
    {
      value: dayjs('2025-07-18').startOf(rounding).toDate(),
      legend: 'Invictus 4.2.1',
    },
    {
      value: dayjs('2025-08-22').startOf(rounding).toDate(),
      legend: 'Invictus 4.3',
    },
    {
      value: dayjs('2025-09-13').startOf(rounding).toDate(),
      legend: 'Invictus 4.3.1',
    },
    {
      value: dayjs('2025-10-17').startOf(rounding).toDate(),
      legend: 'Invictus 4.3.2',
    },
    {
      value: dayjs('2025-11-19').startOf(rounding).toDate(),
      legend: 'Invictus 4.4',
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
