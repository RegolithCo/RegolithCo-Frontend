import * as React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { Typography, useTheme, alpha, Box, Stack, Grid } from '@mui/material'
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
import { SiteStatsCard } from '../../../cards/SiteStats'
import { OrePieChart } from '../../../cards/charts/OrePieChart'
import { MValueFormat, MValueFormatter } from '../../../fields/MValue'
import { PageLoader } from '../../PageLoader'
import { SessionDashTabsEnum, tabUrl } from '../Dashboard.container'
import { MyDashboardStatsChart } from '../../../cards/charts/MyDashboardStatsChart'
import { DoubleArrow } from '@mui/icons-material'

export type StatsFilters = {
  preset: DatePresetsEnum
  fromDateCustom: Dayjs | null
  toDateCustom: Dayjs | null
  defaultFrom?: Dayjs | null
  defaultTo?: Dayjs | null
}

export const TabStats: React.FC<DashboardProps> = ({
  userProfile,
  mySessions,
  joinedSessions,
  workOrderSummaries,
  fetchMoreSessions,
  paginationDate,
  setPaginationDate,
  allLoaded,
  loading,
  navigate,
  statsFilters,
}) => {
  const theme = useTheme()
  const { fromDateCustom, toDateCustom, preset } = statsFilters
  // First and last dates are set to the first and last dates of the data within the range from toDate and fromDate
  const [firstDate, setFirstDate] = React.useState<Dayjs | null>(null)
  const [lastDate, setLastDate] = React.useState<Dayjs | null>(null)

  // If the preset is not CUSTOM then the from and to date are presentational only
  const { fromDate, toDate, numDays } = React.useMemo(() => {
    let fromDate: Dayjs | null = null
    let toDate: Dayjs | null = null
    switch (preset) {
      case DatePresetsEnum.CUSTOM:
        fromDate = fromDateCustom
        toDate = toDateCustom
        break
      case DatePresetsEnum.TODAY:
        fromDate = dayjs().startOf('day')
        toDate = dayjs().endOf('day')
        break
      case DatePresetsEnum.YESTERDAY:
        fromDate = dayjs().subtract(1, 'day').startOf('day')
        toDate = dayjs().subtract(1, 'day').endOf('day')
        break
      case DatePresetsEnum.LAST7:
        fromDate = dayjs().subtract(7, 'day').startOf('day')
        toDate = dayjs()
        break
      case DatePresetsEnum.LAST30:
        fromDate = dayjs().subtract(30, 'day').startOf('day')
        toDate = dayjs()
        break
      case DatePresetsEnum.THISMONTH:
        fromDate = dayjs().startOf('month')
        toDate = dayjs()
        break
      case DatePresetsEnum.LASTMONTH:
        fromDate = dayjs().subtract(1, 'month').startOf('month')
        toDate = dayjs().subtract(1, 'month').endOf('month')
        break
      case DatePresetsEnum.YTD:
        fromDate = dayjs().startOf('year')
        toDate = dayjs()
        break
      case DatePresetsEnum.ALLTIME:
        fromDate = dayjs('2023-03-01').startOf('day')
        toDate = dayjs()
        break
      default:
        break
    }
    const numDays = fromDate && toDate ? toDate.diff(fromDate, 'day') : 0
    return { fromDate, toDate, numDays }
  }, [preset])

  React.useEffect(() => {
    if (allLoaded || loading) return
    // If the fromDate is before the pagination date then we need to trigger a fetch
    if (fromDate && fromDate.isBefore(dayjs(paginationDate))) {
      fetchMoreSessions()
    }
  }, [fromDate, paginationDate, loading])

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
  const { activityPie, oreReducedRaw, oreReducedYielded, scoutedRocks } = React.useMemo(() => {
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

    const oreReducedRaw = formatCardNumber(
      sessionsFiltered.reduce((acc, sess) => {
        return acc + (sess.summary?.collectedSCU || 0)
      }, 0)
    )
    const oreReducedYielded = formatCardNumber(
      sessionsFiltered.reduce((acc, sess) => {
        return acc + (sess.summary?.yieldSCU || 0)
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
      oreReducedRaw,
      oreReducedYielded,
      scoutedRocks,
    }
  }, [sessionsFiltered])

  // The titlebar needs to show the date range
  const dateStr = React.useMemo(() => {
    if (!toDate || !fromDate) return ''
    // First handle preset weirdness
    if (preset === DatePresetsEnum.THISMONTH) {
      return toDate?.format('MMMM, YYYY') + ' (so far)'
    }
    if (preset === DatePresetsEnum.LASTMONTH) {
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
  }, [toDate, fromDate, preset])

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
        const refinedVal = value.refined
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
        preset={preset}
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={(date) => {
          setFirstDate(null)
          navigate && navigate(tabUrl(SessionDashTabsEnum.stats, DatePresetsEnum.CUSTOM, date, toDate))
        }}
        setToDate={(date) => {
          setLastDate(null)
          navigate && navigate(tabUrl(SessionDashTabsEnum.stats, DatePresetsEnum.CUSTOM, fromDate, date))
        }}
        onPresetChange={(newPreset) => {
          if (newPreset === DatePresetsEnum.CUSTOM) {
            navigate && navigate(tabUrl(SessionDashTabsEnum.stats, newPreset, fromDate, toDate))
          } else {
            navigate && navigate(tabUrl(SessionDashTabsEnum.stats, newPreset))
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
          {preset === DatePresetsEnum.CUSTOM ? 'My Statistics' : DatePresetStrings[preset || DatePresetsEnum.THISMONTH]}
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

      <Box sx={{ position: 'relative', minHeight: 500 }}>
        {/* LOADER */}
        {loading && (
          <Box
            sx={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              zIndex: 1000,
              backgroundColor: alpha(theme.palette.background.paper, 0.4),
              // blur background
              backdropFilter: 'blur(4px)',
            }}
          >
            <PageLoader title="Loading Data..." subtitle={dateStr} loading={true} />
          </Box>
        )}

        <Grid spacing={2} my={3} container sx={{ width: '100%' }}>
          <SiteStatsCard
            value={totalRevenue[0]}
            scale={totalRevenue[1]}
            subText="Total Session Revenue"
            tooltip={`aUEC Earned by all users in sessions I have owned/joined`}
            loading={loading}
          />
          <SiteStatsCard
            value={myIncome[0]}
            scale={myIncome[1]}
            subText="Personal Profit"
            tooltip={`aUEC Earned by users`}
            loading={loading}
          />
          <SiteStatsCard
            value={sharedIncome[0]}
            scale={sharedIncome[1]}
            subText="Shared Income"
            tooltip={`aUEC Earned by users other than you in your sessions.`}
            loading={loading}
          />
          <SiteStatsCard value={expenses[0]} scale={expenses[1]} subText="Expenses (aUEC)" loading={loading} />

          <SiteStatsCard
            value={
              <>
                {MValueFormatter(oreReducedRaw[0] || 0, MValueFormat.number)}
                <DoubleArrow />
                {MValueFormatter(oreReducedYielded[0] || 0, MValueFormat.number)}
              </>
            }
            scale={oreReducedRaw[1]}
            subText="Ore (SCU)"
            tooltip={
              <Box sx={{ backgroundColor: 'black', p: 2 }}>
                <Typography variant="body2" gutterBottom color="text.secondary">
                  {MValueFormatter(oreReducedRaw[0] || 0, MValueFormat.number)} SCU of raw material mined, collected or
                  salvaged
                </Typography>
                <Typography variant="body2" gutterBottom color="text.primary">
                  {MValueFormatter(oreReducedYielded[0] || 0, MValueFormat.number)} SCU of refined material produced for
                  sale
                </Typography>
                <Typography variant="caption" color="error">
                  Note: Yield can be greater than collected because refining always rounds up to the nearest SCU to fill
                  a box.
                </Typography>
              </Box>
            }
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
          {!loading && (
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <OrePieChart title="Activity Types" activityTypes={activityPie} loading={Boolean(loading)} />
            </Grid>
          )}
          {!loading && (
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <OrePieChart
                title="Ship Ores"
                groupThreshold={0.04}
                ores={shipOrePie as RegolithStatsSummary['shipOres']}
                loading={Boolean(loading)}
              />
            </Grid>
          )}
          {!loading && (
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <OrePieChart
                title="Vehicle Ores"
                ores={vehicleOrePie as RegolithStatsSummary['vehicleOres']}
                loading={Boolean(loading)}
              />
            </Grid>
          )}
          {!loading && (
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <OrePieChart
                title="Salvage Ores"
                ores={salvageOrePie as RegolithStatsSummary['salvageOres']}
                loading={Boolean(loading)}
              />
            </Grid>
          )}
          {!loading && (
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <OrePieChart
                title="Refining Processes"
                activityTypes={refiningProcesses as RegolithStatsSummary['refineryMethod']}
                loading={Boolean(loading)}
              />
            </Grid>
          )}
          {!loading && (
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <OrePieChart
                title="Refineries"
                activityTypes={refineries as RegolithStatsSummary['refineries']}
                loading={Boolean(loading)}
              />
            </Grid>
          )}
          {!loading && (
            <Grid size={{ xs: 12 }} my={3}>
              <MyDashboardStatsChart
                sessions={[...mySessions, ...joinedSessions]}
                workOrderSummaries={workOrderSummaries}
                fromDate={fromDate}
                toDate={toDate}
                loading={Boolean(loading)}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  )
}
