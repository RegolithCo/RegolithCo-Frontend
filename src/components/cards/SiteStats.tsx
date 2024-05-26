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
} from '@mui/material'
import { formatCardNumber, StatsObjectSummary } from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Textfit } from 'react-textfit'
import { MValueFormat, MValueFormatter } from '../fields/MValue'
import { DailyMonthlyChart } from './charts/DailyMonthlyChart'
import { OrePieChart } from './charts/OrePieChart'
import { fontFamilies } from '../../theme'
import { Stack } from '@mui/system'

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

  const usersFormatted = formatCardNumber(stats?.total?.users || 0)
  const aUECFormatted = formatCardNumber(stats?.total?.grossProfitaUEC || 0)
  const lossFormatted = formatCardNumber(stats?.total?.lossaUEC || 0)
  const rawOreSCUFormatted = formatCardNumber(stats?.total?.rawOreSCU || 0)
  const totalSessionsFormatted = formatCardNumber(stats?.total?.sessions || 0)
  const workOrdersFormatted = formatCardNumber(stats?.total?.workOrders || 0)
  const rocksScoutedFormatted = formatCardNumber(stats?.total?.scoutingRocks || 0)

  return (
    <>
      <Grid spacing={2} my={3} container sx={{ width: '100%' }}>
        <SiteStatsCard
          value={usersFormatted[0]}
          scale={usersFormatted[1]}
          subText="Total Users"
          tooltip="Registered Users on the site"
          loading={statsLoading.total}
        />
        <SiteStatsCard
          value={aUECFormatted[0]}
          scale={aUECFormatted[1]}
          subText="aUEC Earned"
          tooltip={`${MValueFormatter(stats?.total?.grossProfitaUEC || 0, MValueFormat.number)} aUEC Earned by users`}
          loading={statsLoading.total}
        />
        <SiteStatsCard
          value={lossFormatted[0]}
          scale={lossFormatted[1]}
          subText="aUEC Lost"
          tooltip={`${MValueFormatter(
            stats?.total?.grossProfitaUEC || 0,
            MValueFormat.number
          )} aUEC Lost due to crashes, piracy etc.`}
          loading={statsLoading.total}
        />
        <SiteStatsCard
          value={rawOreSCUFormatted[0]}
          scale={rawOreSCUFormatted[1]}
          subText="Raw Ore (SCU)"
          tooltip={`${MValueFormatter(
            stats?.total?.rawOreSCU || 0,
            MValueFormat.number
          )} SCU of raw material mined, collected or salvaged`}
          loading={statsLoading.total}
        />
        <SiteStatsCard
          value={totalSessionsFormatted[0]}
          scale={totalSessionsFormatted[1]}
          subText="Sessions"
          tooltip="User sessions"
          loading={statsLoading.total}
        />
        <SiteStatsCard
          value={workOrdersFormatted[0]}
          scale={workOrdersFormatted[1]}
          subText="Work Orders"
          loading={statsLoading.total}
        />
        <SiteStatsCard
          value={rocksScoutedFormatted[0]}
          scale={rocksScoutedFormatted[1]}
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
            <OrePieChart
              title="Activity Types"
              activityTypes={stats?.total?.workOrderTypes || {}}
              loading={statsLoading.total}
            />
          </Grid>
        )}
        {!statsLoading.total && (
          <Grid xs={12} sm={6} md={6}>
            <OrePieChart
              title="Ship Ores"
              groupThreshold={0.04}
              ores={stats?.total?.shipOres || {}}
              loading={statsLoading.total}
            />
          </Grid>
        )}
        {!statsLoading.total && (
          <Grid xs={12} sm={6} md={6}>
            <OrePieChart title="Vehicle Ores" ores={stats?.total?.vehicleOres || {}} loading={statsLoading.total} />
          </Grid>
        )}
        {!statsLoading.total && (
          <Grid xs={12} sm={6} md={6}>
            <OrePieChart title="Salvage Ores" ores={stats?.total?.salvageOres || {}} loading={statsLoading.total} />
          </Grid>
        )}
        {!statsLoading.total && (
          <Grid xs={12} sm={6} md={6}>
            <OrePieChart title="Failure Reasons" ores={stats?.total?.failReasons || {}} loading={statsLoading.total} />
          </Grid>
        )}
      </Grid>
    </>
  )
}

interface SiteStatsCardProps {
  value: number | string | React.ReactNode
  subText: string
  scale?: string
  tooltip?: React.ReactNode
  loading?: boolean
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  card: {
    height: 100,
    display: 'flex',
    borderRadius: 5,
    border: `3px solid ${theme.palette.primary.main}`,
    flexDirection: 'column',
  },
})

export const SiteStatsCard: React.FC<SiteStatsCardProps> = ({ value, subText, scale, tooltip, loading }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  return (
    <Grid
      xs={6}
      sm={4}
      md={3}
      sx={{
        '& *': {
          whiteSpace: 'nowrap',
        },
      }}
    >
      <Tooltip title={tooltip || ''} placement="top">
        <Card sx={styles.card} elevation={5}>
          {/* put as much space between the items as possible */}
          <Stack sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
            <Typography
              sx={{ mt: 0.5, mb: 0, textAlign: 'center', color: theme.palette.primary.main, fontWeight: 'bold' }}
              variant="caption"
              component="div"
            >
              {subText}
            </Typography>
            <CardMedia sx={{ textAlign: 'center', minHeight: 30, mx: 2 }}>
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <Textfit
                  mode="single"
                  max={30}
                  style={{ fontFamily: fontFamilies.robotoMono, color: theme.palette.primary.light }}
                >
                  {value}
                </Textfit>
              )}
            </CardMedia>
            <Typography
              sx={{
                // Capitalize
                textTransform: 'capitalize',
                color: theme.palette.primary.main,
                fontFamily: fontFamilies.robotoMono,
                mb: 1,
                textAlign: 'center',
              }}
              variant="caption"
              component="div"
            >
              {scale || <>&nbsp;</>}
            </Typography>
          </Stack>
        </Card>
      </Tooltip>
    </Grid>
  )
}
