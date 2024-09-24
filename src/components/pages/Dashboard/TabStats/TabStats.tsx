import * as React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { Typography, useTheme } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { fontFamilies } from '../../../../theme'
import { DashboardProps } from '../Dashboard'
import { DatePresetsEnum, DatePresetStrings, StatsDatePicker } from './StatsDatePicker'
import {
  ActivityEnum,
  CrewShare,
  formatCardNumber,
  RegolithStatsSummary,
  SalvageOreEnum,
  ShipMiningOrder,
  ShipOreEnum,
  VehicleOreEnum,
  WorkOrder,
} from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { SiteStatsCard } from '../../../cards/SiteStats'
import { OrePieChart } from '../../../cards/charts/OrePieChart'
import { MValueFormat, MValueFormatter } from '../../../fields/MValue'

export const TabStats: React.FC<DashboardProps> = ({
  userProfile,
  mySessions,
  workOrderSummaries,
  fetchMoreSessions,
  joinedSessions,
  allLoaded,
  loading,
  navigate,
  defaultStatsPreset,
}) => {
  const theme = useTheme()
  // These dates are what we use to filter the data
  const [fromDate, setFromDate] = React.useState<Dayjs | null>(defaultStatsPreset.from || dayjs('2022-04-17'))
  const [toDate, setToDate] = React.useState<Dayjs | null>(defaultStatsPreset.to || dayjs('2022-04-17'))

  const [firstDate, setFirstDate] = React.useState<Dayjs | null>(null)
  const [lastDate, setLastDate] = React.useState<Dayjs | null>(null)

  const { sessionsFiltered, workOrdersFiltered, crewSharesFiltered } = React.useMemo(() => {
    const sessions = [...joinedSessions, ...mySessions]
    const sessionsFiltered = sessions.filter((session) => {
      const sessionDate = dayjs(session.createdAt)
      const allow = sessionDate.isBefore(toDate) && sessionDate.isAfter(fromDate)
      if (!allow) return false
      if (!firstDate || sessionDate.isBefore(firstDate)) setFirstDate(sessionDate)
      if (!lastDate || sessionDate.isAfter(lastDate)) setLastDate(sessionDate)
      return true
    })

    const workOrdersFiltered = sessions
      .reduce((acc, wo) => acc.concat(wo.workOrders?.items || []), [] as WorkOrder[])
      .filter((workOrder) => {
        const workOrderDate = dayjs(workOrder.createdAt)
        const allow = workOrderDate.isBefore(toDate) && workOrderDate.isAfter(fromDate)
        if (!allow) return false
        if (!firstDate || workOrderDate.isBefore(firstDate)) setFirstDate(workOrderDate)
        if (!lastDate || workOrderDate.isAfter(lastDate)) setLastDate(workOrderDate)
        return true
      })

    const crewSharesFiltered = sessions
      .reduce((acc, session) => {
        return acc.concat(
          (session.workOrders?.items || []).reduce((acc, wo) => {
            return wo.crewShares ? acc.concat(wo.crewShares) : acc
          }, [] as CrewShare[])
        )
      }, [] as CrewShare[])
      .filter((crewShare) => {
        const crewShareDate = dayjs(crewShare.createdAt)
        const allow = crewShareDate.isBefore(toDate) && crewShareDate.isAfter(fromDate)
        if (!allow) return false
        if (!firstDate || crewShareDate.isBefore(firstDate)) setFirstDate(crewShareDate)
        if (!lastDate || crewShareDate.isAfter(lastDate)) setLastDate(crewShareDate)
        return true
      })

    return { sessionsFiltered, workOrdersFiltered, crewSharesFiltered }
  }, [mySessions, joinedSessions, fromDate, toDate])

  const { totalRevenue, myIncome, sharedIncome, refineries, refiningProcesses } = React.useMemo(() => {
    const refineries: Partial<RegolithStatsSummary['refineries']> = {}
    const refiningProcesses: Partial<RegolithStatsSummary['refineryMethod']> = {}

    // Total Revenue is easy. It's just all the aUEC summed from all sessions
    const totalRevenue = sessionsFiltered.reduce((acc, session) => acc + (session.summary?.aUEC || 0), 0)

    const myIncome = workOrdersFiltered.reduce((acc, wo) => {
      const { crewShares, sessionId, orderId, orderType } = wo
      const myIndex = (crewShares || []).findIndex((cs) => cs.payeeScName === userProfile.scName)
      if (myIndex < 0 || !workOrderSummaries[sessionId] || !workOrderSummaries[sessionId][orderId]) return acc

      if (orderType === ActivityEnum.ShipMining) {
        const shipOrder = wo as ShipMiningOrder
        if (shipOrder.refinery) {
          if (!refineries[shipOrder.refinery]) refineries[shipOrder.refinery] = 0
          refineries[shipOrder.refinery] = (refineries[shipOrder.refinery] || 0) + 1
        }
        if (shipOrder.method) {
          if (!refiningProcesses[shipOrder.method]) refiningProcesses[shipOrder.method] = 0
          refiningProcesses[shipOrder.method] = (refiningProcesses[shipOrder.method] || 0) + 1
        }
      }

      const woSumm = workOrderSummaries[sessionId][orderId].crewShareSummary
      if (!woSumm) return acc
      return acc + (woSumm[myIndex][0] || 0)
    }, 0)

    const sharedIncome = workOrdersFiltered.reduce((acc, { crewShares, sessionId, orderId }) => {
      const myIndex = (crewShares || []).findIndex((cs) => cs.payeeScName === userProfile.scName)
      if (myIndex < 0 || !workOrderSummaries[sessionId] || !workOrderSummaries[sessionId][orderId]) return acc
      const woSumm = workOrderSummaries[sessionId][orderId]

      if (!woSumm || woSumm.sellerScName !== userProfile.scName) return acc
      // REDUCE THE SHARED INCOME BY THE AMOUNT I EARNED`1
      return acc + ((woSumm.crewShareSummary || [])[myIndex][0] || 0)
    }, 0)
    return {
      totalRevenue: formatCardNumber(totalRevenue),
      myIncome: formatCardNumber(myIncome),
      sharedIncome: formatCardNumber(sharedIncome),
      refineries,
      refiningProcesses,
    }
  }, [sessionsFiltered, workOrdersFiltered, crewSharesFiltered, workOrderSummaries])

  // Accumulate all the results for our charts
  const { activityPie, oreReduced, scoutedRocks } = React.useMemo(() => {
    const activityPie = sessionsFiltered.reduce(
      (acc, { summary }) => {
        const activity = summary?.workOrdersByType
        if (!activity) return acc
        return Object.keys(activity).reduce((acc, key) => {
          if (key === '__typename') return acc
          acc[key] = (acc[key] || 0) + activity[key]
          return acc
        }, acc)
      },
      {} as RegolithStatsSummary['workOrderTypes']
    )

    const oreReduced = formatCardNumber(
      sessionsFiltered.reduce((acc, sess) => {
        return acc + (sess.summary?.oreSCU || 0)
      }, 0)
    )

    const scoutedRocks = formatCardNumber(
      sessionsFiltered.reduce((acc, sess) => {
        const scoutSummary = sess.summary?.scoutingFindsByType
        return (
          acc + (scoutSummary?.other || 0) ||
          0 + (scoutSummary?.salvage || 0) + (scoutSummary?.ship || 0) + (scoutSummary?.vehicle || 0)
        )
      }, 0)
    )
    return {
      activityPie,
      oreReduced,
      scoutedRocks,
    }
  }, [sessionsFiltered])

  const dateStr = React.useMemo(() => {
    if (!toDate || !fromDate) return ''
    // First handle preset weirdness
    if (defaultStatsPreset.preset === DatePresetsEnum.THISMONTH) {
      return toDate?.format('MMMM, YYYY') + ' (so far)'
    }
    if (defaultStatsPreset.preset === DatePresetsEnum.LASTMONTH) {
      return toDate?.format('MMMM, YYYY')
    }
    // If they are on the same day then
    if (fromDate?.isSame(toDate, 'day')) {
      return toDate?.format('LL')
    }
    // If they share the same month then
    if (fromDate?.isSame(toDate, 'month')) {
      return `${fromDate?.format('MMMM, D')}-${toDate?.format('D')}, ${toDate?.format('YYYY')}`
    }
    // If they share the same year then
    if (fromDate?.isSame(toDate, 'year')) {
      return `${fromDate?.format('MMMM, D')} - ${toDate?.format('MMMM, D, YYYY')}`
    }
    return `${fromDate?.format('LL')} - ${toDate?.format('LL')}`
  }, [firstDate, lastDate, defaultStatsPreset])

  const { shipOrePie, vehicleOrePie, salvageOrePie, expenses } = React.useMemo(() => {
    const shipOrePie: Partial<RegolithStatsSummary['shipOres']> = {}
    const vehicleOrePie: Partial<RegolithStatsSummary['vehicleOres']> = {}
    const salvageOrePie: Partial<RegolithStatsSummary['salvageOres']> = {}
    let expenses: number = 0

    workOrdersFiltered.forEach(({ orderId, sessionId }) => {
      const summ = workOrderSummaries[sessionId]?.[orderId]
      expenses += summ?.expensesValue || 0
      if (!summ) return
      const shipOres = Object.values(ShipOreEnum)
      const vehicleOres = Object.values(VehicleOreEnum)
      const salvageOres = Object.values(SalvageOreEnum)

      Object.entries(summ.oreSummary || {}).forEach(([key, value]) => {
        if (key === '__typename') return
        const refinedVal = value.collected
        if (shipOres.includes(key as ShipOreEnum)) {
          shipOrePie[key] = (shipOrePie[key] || 0) + refinedVal / 100
        } else if (vehicleOres.includes(key as VehicleOreEnum)) {
          vehicleOrePie[key] = (vehicleOrePie[key] || 0) + refinedVal / 100
        } else if (salvageOres.includes(key as SalvageOreEnum)) {
          salvageOrePie[key] = (salvageOrePie[key] || 0) + refinedVal / 100
        }
      })
    })

    return {
      expenses: formatCardNumber(expenses),
      shipOrePie,
      vehicleOrePie,
      salvageOrePie,
    }
  }, [workOrdersFiltered, workOrderSummaries])

  return (
    <Box>
      <StatsDatePicker
        preset={defaultStatsPreset.preset || DatePresetsEnum.THISMONTH}
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={(date) => {
          setFirstDate(null)
          setFromDate(date)
          navigate?.(
            `/dashboard/stats/${DatePresetsEnum.CUSTOM}?from=${date?.format('YYYY-MM-DD')}&to=${toDate?.format('YYYY-MM-DD')}`
          )
        }}
        setToDate={(date) => {
          setLastDate(null)
          setToDate(date)
          navigate?.(
            `/dashboard/stats/${DatePresetsEnum.CUSTOM}?from=${fromDate?.format('YYYY-MM-DD')}&to=${date?.format('YYYY-MM-DD')}`
          )
        }}
        onPresetChange={(preset) => {
          if (preset === DatePresetsEnum.CUSTOM) {
            navigate?.(
              `/dashboard/stats/${DatePresetsEnum.CUSTOM}?from=${fromDate?.format('YYYY-MM-DD')}&to=${toDate?.format('YYYY-MM-DD')}`
            )
          } else {
            navigate?.(`/dashboard/stats/${preset}`)
          }
        }}
      />

      <Stack
        spacing={2}
        alignItems={'flex-end'}
        sx={{ my: 2, borderBottom: `2px solid ${theme.palette.secondary.dark}` }}
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
      >
        <Typography
          variant="h3"
          component="h3"
          gutterBottom
          sx={{
            color: 'secondary.dark',
            fontFamily: fontFamilies.robotoMono,
            fontWeight: 'bold',
          }}
        >
          {defaultStatsPreset.preset === DatePresetsEnum.CUSTOM
            ? 'My Statistics'
            : DatePresetStrings[defaultStatsPreset.preset || DatePresetsEnum.THISMONTH]}
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            color: 'secondary.dark',
            fontFamily: fontFamilies.robotoMono,
            fontWeight: 'bold',
          }}
        >
          {dateStr}
        </Typography>
      </Stack>

      <Box>
        <Grid spacing={2} my={3} container sx={{ width: '100%' }}>
          <SiteStatsCard
            value={totalRevenue[0]}
            scale={totalRevenue[1]}
            subText="Total Session Revenue"
            tooltip={`${MValueFormatter(totalRevenue, MValueFormat.number)} aUEC Earned by all users in sessions I have owned/joined`}
            loading={loading}
          />
          <SiteStatsCard
            value={myIncome[0]}
            scale={myIncome[1]}
            subText="Personal Profit"
            tooltip={`${MValueFormatter(myIncome, MValueFormat.number)} aUEC Earned by users`}
            loading={loading}
          />
          <SiteStatsCard
            value={sharedIncome[0]}
            scale={sharedIncome[1]}
            subText="Shared Income"
            tooltip={`${MValueFormatter(sharedIncome, MValueFormat.number)} aUEC Earned by users other than you in your sessions.`}
            loading={loading}
          />
          <SiteStatsCard value={expenses[0]} scale={expenses[1]} subText="Expenses (aUEC)" loading={loading} />

          <SiteStatsCard
            value={oreReduced[0]}
            scale={oreReduced[1]}
            subText="Raw Ore (SCU)"
            tooltip={`${MValueFormatter(
              oreReduced[0] || 0,
              MValueFormat.number
            )} SCU of raw material mined, collected or salvaged`}
            loading={loading}
          />
          <SiteStatsCard
            value={formatCardNumber(sessionsFiltered.length)[0]}
            scale={formatCardNumber(sessionsFiltered.length)[1]}
            subText="Sessions"
            tooltip="User sessions"
            loading={loading}
          />
          <SiteStatsCard
            value={formatCardNumber(workOrdersFiltered.length)[0]}
            scale={formatCardNumber(workOrdersFiltered.length)[1]}
            subText="Work Orders"
            loading={loading}
          />
          <SiteStatsCard value={scoutedRocks[0]} scale={scoutedRocks[1]} subText="Rocks Scouted" loading={loading} />
        </Grid>
        <Grid spacing={3} container sx={{ width: '100%' }}>
          {/* {!loading && stats.daily && stats.monthly && (
            <Grid xs={12} my={3}>
              <DailyMonthlyChart stats={stats} statsLoading={loading} />
            </Grid>
          )} */}
          {!loading && (
            <Grid xs={12} sm={6} md={4}>
              <OrePieChart title="Activity Types" activityTypes={activityPie} loading={Boolean(loading)} />
            </Grid>
          )}
          {!loading && (
            <Grid xs={12} sm={6} md={4}>
              <OrePieChart
                title="Ship Ores"
                groupThreshold={0.04}
                ores={shipOrePie as RegolithStatsSummary['shipOres']}
                loading={Boolean(loading)}
              />
            </Grid>
          )}
          {!loading && (
            <Grid xs={12} sm={6} md={4}>
              <OrePieChart
                title="Vehicle Ores"
                ores={vehicleOrePie as RegolithStatsSummary['vehicleOres']}
                loading={Boolean(loading)}
              />
            </Grid>
          )}
          {!loading && (
            <Grid xs={12} sm={6} md={4}>
              <OrePieChart
                title="Salvage Ores"
                ores={salvageOrePie as RegolithStatsSummary['salvageOres']}
                loading={Boolean(loading)}
              />
            </Grid>
          )}
          {!loading && (
            <Grid xs={12} sm={6} md={4}>
              <OrePieChart
                title="Refining Processes"
                activityTypes={refiningProcesses as RegolithStatsSummary['refineryMethod']}
                loading={Boolean(loading)}
              />
            </Grid>
          )}
          {!loading && (
            <Grid xs={12} sm={6} md={4}>
              <OrePieChart
                title="Refineries"
                activityTypes={refineries as RegolithStatsSummary['refineries']}
                loading={Boolean(loading)}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  )
}
