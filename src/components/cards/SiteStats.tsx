import * as React from 'react'
import { useTheme, SxProps, Theme, Card, Typography, CardMedia, Tooltip, CircularProgress } from '@mui/material'
import { formatCardNumber, RegolithAllTimeStats, RegolithMonthStats } from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Textfit } from 'react-textfit'
import { MValueFormat, MValueFormatter } from '../fields/MValue'
import { DailyMonthlyChart } from './charts/DailyMonthlyChart'
import { OrePieChart } from './charts/OrePieChart'
import { fontFamilies } from '../../theme'
import { Stack } from '@mui/system'

export interface SiteStatsProps {
  last30Days?: RegolithMonthStats
  allTime?: RegolithAllTimeStats
  statsLoading: boolean
}

/**
 * This is the wrpaper for all the types of things scouts can find
 * @param param0
 * @returns
 */
export const SiteStats: React.FC<SiteStatsProps> = ({ last30Days, allTime, statsLoading }) => {
  // const theme = useTheme()
  // const matches = useMediaQuery(theme.breakpoints.up('md'))

  const usersFormatted = formatCardNumber(allTime?.summary?.users || 0)
  const aUECFormatted = formatCardNumber(allTime?.summary?.grossProfitaUEC || 0)
  const lossFormatted = formatCardNumber(allTime?.summary?.lossaUEC || 0)
  const rawOreSCUFormatted = formatCardNumber(allTime?.summary?.rawOreSCU || 0)
  const totalSessionsFormatted = formatCardNumber(allTime?.summary?.sessions || 0)
  const workOrdersFormatted = formatCardNumber(allTime?.summary?.workOrders || 0)
  const rocksScoutedFormatted = formatCardNumber(allTime?.summary?.scouting?.rocks || 0)
  const wrecksScoutedFormatted = formatCardNumber(allTime?.summary?.scouting?.wrecks || 0)
  const gemsScoutedFormatted = formatCardNumber(allTime?.summary?.scouting?.gems || 0)

  return (
    <>
      <Grid spacing={2} my={3} container sx={{ width: '100%' }}>
        <SiteStatsCard
          value={usersFormatted[0]}
          scale={usersFormatted[1]}
          subText="Total Users"
          tooltip="Registered Users on the site"
          loading={statsLoading}
        />
        <SiteStatsCard
          value={aUECFormatted[0]}
          scale={aUECFormatted[1]}
          subText="aUEC Earned"
          tooltip={`${MValueFormatter(allTime?.summary?.grossProfitaUEC || 0, MValueFormat.number)} aUEC Earned by users`}
          loading={statsLoading}
        />
        <SiteStatsCard
          value={lossFormatted[0]}
          scale={lossFormatted[1]}
          subText="aUEC Lost"
          tooltip={`${MValueFormatter(
            allTime?.summary?.grossProfitaUEC || 0,
            MValueFormat.number
          )} aUEC Lost due to crashes, piracy etc.`}
          loading={statsLoading}
        />
        <SiteStatsCard
          value={rawOreSCUFormatted[0]}
          scale={rawOreSCUFormatted[1]}
          subText="Raw Ore (SCU)"
          tooltip={`${MValueFormatter(
            allTime?.summary?.rawOreSCU || 0,
            MValueFormat.number
          )} SCU of raw material mined, collected or salvaged`}
          loading={statsLoading}
        />
        <SiteStatsCard
          value={totalSessionsFormatted[0]}
          scale={totalSessionsFormatted[1]}
          subText="Sessions"
          tooltip="User sessions"
          loading={statsLoading}
        />
        <SiteStatsCard
          value={workOrdersFormatted[0]}
          scale={workOrdersFormatted[1]}
          subText="Work Orders"
          loading={statsLoading}
        />
        <SiteStatsCard
          value={rocksScoutedFormatted[0]}
          scale={rocksScoutedFormatted[1]}
          subText="Rocks Scouted"
          loading={statsLoading}
        />
        <SiteStatsCard
          value={wrecksScoutedFormatted[0]}
          scale={wrecksScoutedFormatted[1]}
          subText="Wrecks Scouted"
          loading={statsLoading}
        />
        <SiteStatsCard
          value={wrecksScoutedFormatted[0]}
          scale={wrecksScoutedFormatted[1]}
          subText="ROC Gems Scouted"
          loading={statsLoading}
        />
      </Grid>
      <Grid spacing={3} container sx={{ width: '100%' }}>
        {!statsLoading && (
          <Grid xs={12} my={3}>
            <DailyMonthlyChart
              last30Days={last30Days}
              allTime={allTime}
              statsLoading={statsLoading}
              chartType="workOrders"
            />
          </Grid>
        )}
        {/* {!statsLoading && (
          <Grid xs={12} my={3}>
            <DailyMonthlyChart
              last30Days={last30Days}
              allTime={allTime}
              statsLoading={statsLoading}
              chartType="scouting"
            />
          </Grid>
        )} */}
        {!statsLoading && (
          <Grid xs={12} sm={6} md={6}>
            <OrePieChart
              title="Activity Types"
              activityTypes={allTime?.summary?.workOrderTypes}
              loading={statsLoading}
            />
          </Grid>
        )}
        {!statsLoading && (
          <Grid xs={12} sm={6} md={6}>
            <OrePieChart
              title="Ship Ores"
              groupThreshold={0.04}
              ores={allTime?.summary?.shipOres}
              loading={statsLoading}
            />
          </Grid>
        )}
        {!statsLoading && (
          <Grid xs={12} sm={6} md={6}>
            <OrePieChart
              title="Refining Methods"
              groupThreshold={0.04}
              ores={allTime?.summary?.refineryMethod}
              loading={statsLoading}
            />
          </Grid>
        )}
        {!statsLoading && (
          <Grid xs={12} sm={6} md={6}>
            <OrePieChart title="Vehicle Ores" ores={allTime?.summary?.vehicleOres} loading={statsLoading} />
          </Grid>
        )}
        {!statsLoading && (
          <Grid xs={12} sm={6} md={6}>
            <OrePieChart title="Salvage Ores" ores={allTime?.summary?.salvageOres} loading={statsLoading} />
          </Grid>
        )}
        {!statsLoading && (
          <Grid xs={12} sm={6} md={6}>
            <OrePieChart title="Failure Reasons" ores={allTime?.summary?.failReasons} loading={statsLoading} />
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
  const isText = typeof value === 'string' || typeof value === 'number'
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
                isText ?( <Textfit
                  mode="single"
                  max={30}
                  style={{ fontFamily: fontFamilies.robotoMono, color: theme.palette.primary.light }}
                >
                  {value}
                </Textfit>) : value
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
