import * as React from 'react'
import {
  useTheme,
  SxProps,
  Theme,
  Card,
  Typography,
  CardMedia,
  Tooltip,
  useMediaQuery,
  CircularProgress,
  Divider,
} from '@mui/material'
import { StatsObjectSummary } from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Textfit } from 'react-textfit'
import { MValueFormat, MValueFormatter } from '../fields/MValue'
import { DailyMonthlyChart } from './charts/DailyMonthlyChart'
import { PieChart } from './charts/PieChart'
import { Box } from '@mui/system'

export interface SiteStatsProps {
  stats: Partial<StatsObjectSummary>
  statsLoading: Record<keyof StatsObjectSummary, boolean>
}

/**
 * This is the wrpaper for all the types of things scouts can find
 * @param param0
 * @returns
 */
export const SiteStats: React.FC<SiteStatsProps> = ({ stats, statsLoading }) => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <>
      <Grid spacing={3} container sx={{ width: '100%' }}>
        <SiteStatsCard
          value={stats?.total?.users}
          subText="Total Users"
          tooltip="Registered Users on the site"
          loading={statsLoading.total}
        />
        <SiteStatsCard
          value={MValueFormatter(stats?.total?.aUEC || 0, MValueFormat.number_sm)}
          subText="aUEC Earned"
          tooltip={`${MValueFormatter(stats?.total?.aUEC || 0, MValueFormat.number)} aUEC Earned by users`}
          loading={statsLoading.total}
        />
        <SiteStatsCard
          value={MValueFormatter(stats?.total?.rawOreSCU || 0, MValueFormat.number_sm)}
          subText="SCU of Raw Ore"
          tooltip={`${MValueFormatter(
            stats?.total?.rawOreSCU || 0,
            MValueFormat.number
          )} SCU of raw material mined, collected or salvaged`}
          loading={statsLoading.total}
        />
        <SiteStatsCard
          value={MValueFormatter(stats?.total?.sessions, MValueFormat.number_sm)}
          subText="Mining Sessions"
          tooltip="User sessions"
          loading={statsLoading.total}
        />
        <SiteStatsCard
          value={MValueFormatter(stats?.total?.workOrders, MValueFormat.number_sm)}
          subText="Work Orders"
          loading={statsLoading.total}
        />
        <SiteStatsCard
          value={MValueFormatter(stats?.total?.scoutingRocks, MValueFormat.number_sm)}
          subText="Rocks Scouted"
          loading={statsLoading.total}
        />
      </Grid>
      <Grid spacing={3} container sx={{ width: '100%' }}>
        {!statsLoading.daily && !statsLoading.monthly && stats.daily && stats.monthly && (
          <Grid xs={12} my={3}>
            <DailyMonthlyChart stats={stats} statsLoading={statsLoading} />
          </Grid>
        )}
        {!statsLoading.total && (
          <Grid xs={12} sm={6} md={6}>
            <PieChart
              title="Activity Types"
              activityTypes={stats?.total?.workOrderTypes || {}}
              loading={statsLoading.total}
            />
          </Grid>
        )}
        {!statsLoading.total && (
          <Grid xs={12} sm={6} md={6}>
            <PieChart title="Ship Ores" ores={stats?.total?.shipOres || {}} loading={statsLoading.total} />
          </Grid>
        )}
        {!statsLoading.total && (
          <Grid xs={12} sm={6} md={6}>
            <PieChart title="Vehicle Ores" ores={stats?.total?.vehicleOres || {}} loading={statsLoading.total} />
          </Grid>
        )}
        {!statsLoading.total && (
          <Grid xs={12} sm={6} md={6}>
            <PieChart title="Salvage Ores" ores={stats?.total?.salvageOres || {}} loading={statsLoading.total} />
          </Grid>
        )}
      </Grid>
    </>
  )
}

interface SiteStatsCardProps {
  value: number | string | React.ReactNode
  subText: string
  tooltip?: React.ReactNode
  loading?: boolean
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  card: {
    height: 100,
    display: 'flex',
    flexDirection: 'column',
  },
})

export const SiteStatsCard: React.FC<SiteStatsCardProps> = ({ value, subText, tooltip, loading }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  return (
    <Grid xs={4} sm={3} md={2}>
      <Tooltip title={tooltip || ''} placement="top">
        <Card sx={styles.card} elevation={7}>
          <div style={{ flexGrow: 1 }} />
          <CardMedia sx={{ textAlign: 'center', minHeight: 30, mx: 2 }}>
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              <Textfit mode="single" max={30}>
                {value}
              </Textfit>
            )}
          </CardMedia>
          <div style={{ flexGrow: 1 }} />
          <Typography sx={{ mb: 1, textAlign: 'center' }} color="text.secondary" variant="caption" component="div">
            {subText}
          </Typography>
        </Card>
      </Tooltip>
    </Grid>
  )
}
