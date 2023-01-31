import * as React from 'react'
import { useTheme, SxProps, Theme, Card, CardContent, Typography, CardMedia } from '@mui/material'
import { StatsObject } from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Textfit } from 'react-textfit'
import { MValueFormat, MValueFormatter } from '../fields/MValue'
import { Box } from '@mui/system'

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
      <SiteStatsCard number={stats?.users} subText="Users" />
      <SiteStatsCard number={stats?.aUEC} subText="aUEC Earned by Users" />
      <SiteStatsCard number={stats?.rawOreSCU} subText="SCU of Raw Ore" />
      <SiteStatsCard number={stats?.sessions} subText="Sessions" />
      <SiteStatsCard number={stats?.workOrders} subText="Work Orders" />
      <SiteStatsCard number={stats?.scoutingRocks} subText="Rocks Scouted" />
    </Grid>
  )
}

interface SiteStatsCardProps {
  number: number
  subText: string
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
})

export const SiteStatsCard: React.FC<SiteStatsCardProps> = ({ number, subText }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  return (
    <Grid xs={4} sm={4} md={3}>
      <Card sx={styles.card} elevation={7}>
        <div style={{ flexGrow: 1 }} />
        <CardMedia sx={{ textAlign: 'center', minHeight: 30, mx: 2 }}>
          <Textfit mode="single">{MValueFormatter(number || 0, MValueFormat.number)}</Textfit>
        </CardMedia>
        <div style={{ flexGrow: 1 }} />
        <CardContent sx={{ flex: '1 1 20%' }}>
          <Typography sx={{ mb: 1.5, textAlign: 'center' }} color="text.secondary">
            {subText}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}
