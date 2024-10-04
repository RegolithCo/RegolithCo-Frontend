import * as React from 'react'
import { useTheme, Typography, Box, FormControlLabel, Switch } from '@mui/material'
import { ObjectValues, ScoutingFind, ScoutingFindTypeEnum, Session, WorkOrder } from '@regolithco/common'
import { Datum, Serie } from '@nivo/line'
import { fontFamilies } from '../../../theme'
import { StatsLineChart } from './StatsLineChart'
import { WorkOrderSummaryLookup } from '../../pages/Dashboard/Dashboard.container'
import log from 'loglevel'
import dayjs, { Dayjs } from 'dayjs'
import { Stack } from '@mui/system'

const MAX_VALUES = 80

export interface MyDashboardStatsChartProps {
  sessions: Session[]
  workOrderSummaries: WorkOrderSummaryLookup
  fromDate: Dayjs | null
  toDate: Dayjs | null
  loading: boolean
}

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
export const MyDashboardStatsChart: React.FC<MyDashboardStatsChartProps> = ({
  sessions,
  workOrderSummaries,
  fromDate,
  toDate,
  loading,
}) => {
  const theme = useTheme()
  const [normalizeActivity, setNormalizeActity] = React.useState(true)
  const [normalizeFinances, setNormalizeFinances] = React.useState(true)

  const { activityData, financeData, resolution } = React.useMemo(() => {
    if (!toDate || !fromDate)
      return { chartData: [], resolution: ChartTypesEnum.MONTH, activityData: [], financeData: [] }

    const numDays = toDate.diff(fromDate, 'days')
    const numMonths = toDate.diff(fromDate, 'months')
    const resolution =
      numDays > MAX_VALUES ? (numMonths > MAX_VALUES ? ChartTypesEnum.YEAR : ChartTypesEnum.MONTH) : ChartTypesEnum.DAY
    const { activityData, financeData } = formatChartData(sessions, workOrderSummaries, fromDate, toDate, resolution)

    if (normalizeActivity) {
      // Now normalize the y
      Object.values(activityData).forEach((serie) => {
        const max = serie.data.reduce((acc, cur) => Math.max(acc, (cur.y as number) || 0), 0)
        serie.data.forEach((d) => {
          if (max === 0) {
            d.y = 0
            return
          }
          d.y = (d.val || 0) / max
        })
      })
    }
    if (normalizeFinances) {
      Object.values(financeData).forEach((serie) => {
        const max = serie.data.reduce((acc, cur) => Math.max(acc, (cur.y as number) || 0), 0)
        serie.data.forEach((d) => {
          if (max === 0) {
            d.y = 0
            return
          }
          d.y = (d.val || 0) / max
        })
      })
    }

    return {
      activityData,
      financeData,
      resolution,
    }
  }, [sessions, workOrderSummaries, fromDate, toDate, normalizeActivity, normalizeFinances])

  return (
    <Box>
      <Box>
        <Stack
          spacing={2}
          direction="row"
          justifyContent={'space-between'}
          sx={{
            borderBottom: `1px solid ${theme.palette.secondary.dark}`,
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.secondary.dark,
              fontWeight: 'bold',
              fontFamily: fontFamilies.robotoMono,
            }}
          >
            Finances
          </Typography>
          <FormControlLabel
            control={<Switch checked={normalizeFinances} onChange={() => setNormalizeFinances(!normalizeFinances)} />}
            label="Normalize"
          />
        </Stack>
        <StatsLineChart chartData={financeData} loading={loading} resolution={resolution} />
      </Box>
      <Box>
        <Stack
          spacing={2}
          direction="row"
          justifyContent={'space-between'}
          sx={{
            borderBottom: `1px solid ${theme.palette.secondary.dark}`,
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.secondary.dark,
              fontWeight: 'bold',
              fontFamily: fontFamilies.robotoMono,
            }}
          >
            Activity
          </Typography>
          <FormControlLabel
            control={<Switch checked={normalizeActivity} onChange={() => setNormalizeActity(!normalizeActivity)} />}
            label="Normalize"
          />
        </Stack>
        <StatsLineChart chartData={activityData} loading={loading} resolution={resolution} />
      </Box>
    </Box>
  )
}

const getBucketName = (date: Dayjs, resolution: ChartResolutionsEnum) => {
  switch (resolution) {
    case ChartTypesEnum.DAY:
      return date.startOf('day').format('YYYY-MM-DD')
    case ChartTypesEnum.MONTH:
      return date.startOf('month').format('YYYY-MM-DD')
    case ChartTypesEnum.YEAR:
      return date.startOf('year').format('YYYY-MM-DD')
  }
}

const ACTIVITY_LINES: Record<string, { label: string; color: string }> = {
  scoutedWrecks: { label: 'Wrecks Scouted', color: 'hsl(184, 70%, 50%)' },
  scoutedRocks: { label: 'Rocks Scouted', color: 'hsl(88, 70%, 50%)' },
  workOrders: { label: 'Work Orders', color: 'hsl(295, 70%, 50%)' },
  sessions: { label: 'Mining Sessions', color: 'hsl(203, 73.6%, 49%)' },
}
const FINANCE_LINES: Record<string, { label: string; color: string }> = {
  expenses: { label: 'Expenses (aUEC)', color: 'hsl(0, 0%, 51%)' },
  lossaUEC: { label: 'Loss (aUEC)', color: 'hsl(0, 0%, 51%)' },
  payoutsTotal: { label: 'Payouts (aUEC)', color: 'hsl(0, 0%, 51%)' },
  grossProfitaUEC: { label: 'Gross Profit (aUEC)', color: 'hsl(132, 92%, 50%)' },
}

export function formatChartData(
  sessions: Session[],
  workOrderSummaries: WorkOrderSummaryLookup,
  fromDate: Dayjs,
  toDate: Dayjs,
  chartResolution: ChartResolutionsEnum
): { activityData: Serie[]; financeData: Serie[] } {
  // Make the apporpriate buckets as an ordered dictionary
  const buckets: string[] = []
  const emptyActivityObject = Object.keys(ACTIVITY_LINES).reduce((acc, cur) => ({ ...acc, [cur]: 0 }), {})
  const emptyFiannceObject = Object.keys(FINANCE_LINES).reduce((acc, cur) => ({ ...acc, [cur]: 0 }), {})
  switch (chartResolution) {
    case ChartTypesEnum.DAY:
      // Create one bucket a day from fromDate to toDate. The key should be isoDate
      for (let i = 0; i <= toDate.diff(fromDate, 'days'); i++) {
        buckets.push(getBucketName(fromDate.add(i, 'days'), chartResolution))
      }
      break
    case ChartTypesEnum.MONTH:
      for (let i = 0; i <= toDate.diff(fromDate, 'months'); i++) {
        buckets.push(getBucketName(fromDate.add(i, 'months'), chartResolution))
      }
      break
    case ChartTypesEnum.YEAR:
      for (let i = 0; i <= toDate.diff(fromDate, 'years'); i++) {
        buckets.push(getBucketName(fromDate.add(i, 'years'), chartResolution))
      }
      break
  }
  const activityBucketDict: Record<string, Record<keyof typeof ACTIVITY_LINES, number>> = buckets.reduce(
    (acc, cur) => ({ ...acc, [cur]: { ...emptyActivityObject } }),
    {}
  )
  const financeBucketDict: Record<string, Record<keyof typeof FINANCE_LINES, number>> = buckets.reduce(
    (acc, cur) => ({ ...acc, [cur]: { ...emptyFiannceObject } }),
    {}
  )

  sessions
    .reduce((acc, sess) => {
      if (!sess.workOrders || !sess.workOrders.items) return acc
      const date = dayjs(sess.createdAt)
      const bucket = getBucketName(date, chartResolution)
      if (activityBucketDict[bucket]) activityBucketDict[bucket].sessions++
      return acc.concat(sess.workOrders.items || [])
    }, [] as WorkOrder[])
    .forEach((wo) => {
      const date = dayjs(wo.createdAt)
      const bucket = getBucketName(date, chartResolution)
      if (!activityBucketDict[bucket]) return
      activityBucketDict[bucket].workOrders++
      if (!workOrderSummaries[wo.sessionId] || !workOrderSummaries[wo.sessionId][wo.orderId]) return

      const summary = workOrderSummaries[wo.sessionId][wo.orderId]
      financeBucketDict[bucket].grossProfitaUEC += summary.grossValue
      financeBucketDict[bucket].lossaUEC += summary.lossValue
      financeBucketDict[bucket].payoutsTotal += summary.payoutsTotal
    })

  sessions
    .reduce((acc, sess) => {
      if (!sess.scouting || !sess.scouting.items) return acc
      return acc.concat(sess.scouting.items || [])
    }, [] as ScoutingFind[])
    .forEach((sf) => {
      const date = dayjs(sf.createdAt)
      const bucket = getBucketName(date, chartResolution)
      if (!activityBucketDict[bucket]) return
      switch (sf.clusterType) {
        case ScoutingFindTypeEnum.Ship:
          activityBucketDict[bucket].scoutedRocks++
          break
        case ScoutingFindTypeEnum.Salvage:
          activityBucketDict[bucket].scoutedWrecks++
          break
      }
    })

  // Now flatten everything down to a simple aray of dates and values
  const activityDict: Record<string, Serie> = Object.keys(ACTIVITY_LINES).reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: { id: ACTIVITY_LINES[cur].label, color: ACTIVITY_LINES[cur].color, data: [] },
    }),
    {}
  )
  const financeDict: Record<string, Serie> = Object.keys(FINANCE_LINES).reduce(
    (acc, cur) => ({ ...acc, [cur]: { id: FINANCE_LINES[cur].label, color: FINANCE_LINES[cur].color, data: [] } }),
    {}
  )

  for (const date of buckets) {
    const activityBucket = activityBucketDict[date]
    Object.entries(activityBucket).forEach(([key, value]) => {
      // Create a new array with the updated data
      activityDict[key] = {
        ...activityDict[key],
        data: [
          ...activityDict[key].data,
          {
            x: new Date(date + 'T00:00:00'),
            // random value between 10 and 16
            y: value,
            val: value,
          } as Datum,
        ],
      }
    })
    const financeBucket = financeBucketDict[date]
    Object.entries(financeBucket).forEach(([key, value]) => {
      // Create a new array with the updated data
      financeDict[key] = {
        ...financeDict[key],
        data: [
          ...financeDict[key].data,
          {
            x: new Date(date + 'T00:00:00'),
            // random value between 10 and 16
            y: value,
            val: value,
          } as Datum,
        ],
      }
    })
  }

  log.debug('MARZIPAN', { buckets, activityDict, financeDict })

  return {
    activityData: Object.values(activityDict),
    financeData: Object.values(financeDict),
  }
}
