import * as React from 'react'
import { useTheme, SxProps, Theme, Card, Typography, CardMedia, Tooltip } from '@mui/material'
import { StatsObject } from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Textfit } from 'react-textfit'
import { MValueFormat, MValueFormatter } from '../fields/MValue'

export interface SiteStatsProps {
  stats?: StatsObject
  loading?: boolean
}

/**
 * This is the wrpaper for all the types of things scouts can find
 * @param param0
 * @returns
 */
export const SiteStats: React.FC<SiteStatsProps> = ({ stats, loading }) => {
  if (!stats || loading) return null
  return (
    <Grid spacing={3} container sx={{ width: '100%' }}>
      <SiteStatsCard value={stats?.users} subText="Users" tooltip="Registered Users on the site" />
      <SiteStatsCard
        value={MValueFormatter(stats?.aUEC || 0, MValueFormat.number_sm)}
        subText="aUEC Earned"
        tooltip={`${MValueFormatter(stats?.aUEC || 0, MValueFormat.number)} aUEC Earned by users`}
      />
      <SiteStatsCard
        value={MValueFormatter(stats?.rawOreSCU || 0, MValueFormat.number_sm)}
        subText="SCU of Raw Ore"
        tooltip={`${MValueFormatter(
          stats?.rawOreSCU || 0,
          MValueFormat.number
        )} SCU of raw material mined, collected or salvaged`}
      />
      <SiteStatsCard value={stats?.sessions} subText="Sessions" tooltip="User sessions" />
      <SiteStatsCard value={stats?.workOrders} subText="Work Orders" />
      <SiteStatsCard value={stats?.scoutingRocks} subText="Rocks Scouted" />
    </Grid>
  )
}

interface SiteStatsCardProps {
  value: number | string
  subText: string
  tooltip?: React.ReactNode
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  card: {
    height: 100,
    display: 'flex',
    flexDirection: 'column',
  },
})

export const SiteStatsCard: React.FC<SiteStatsCardProps> = ({ value, subText, tooltip }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  return (
    <Grid xs={4} sm={3} md={2}>
      <Tooltip title={tooltip || ''} placement="top">
        <Card sx={styles.card} elevation={7}>
          <div style={{ flexGrow: 1 }} />
          <CardMedia sx={{ textAlign: 'center', minHeight: 30, mx: 2 }}>
            <Textfit mode="single" max={30}>
              {value}
            </Textfit>
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
