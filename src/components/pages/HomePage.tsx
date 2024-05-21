import { Card, CardContent, CardMedia, Divider, Link, Paper, Stack, Typography, useTheme } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { alpha } from '@mui/system'
import * as React from 'react'

import { PageWrapper } from '../PageWrapper'
import { LoginContextObj } from '../../hooks/useOAuth2'
import { SiteStats } from '../cards/SiteStats'
import { StatsObjectSummary } from '@regolithco/common'
// import { Alert319 } from '../modals/announcements/Alert319'
import { AlertPyro } from '../modals/announcements/AlertPyro'
import { fontFamilies, theme } from '../../theme'
import { RouterLink } from '../fields/RouterLink'
import { RegolithAlert } from '../../types'
import { HomePageAlert } from '../HomePageAlert'

interface HomePageProps {
  userCtx: LoginContextObj
  navigate?: (path: string) => void
  handleLogin?: () => void
  alerts?: RegolithAlert[]
  stats: Partial<StatsObjectSummary>
  statsLoading: Record<keyof StatsObjectSummary, boolean>
}

const HomeCard: React.FC<{
  title: string
  focus?: boolean
  description: React.ReactNode | string
  imgageUrl: string
  actions?: React.ReactNode | React.ReactNode[] | string
  url?: string
  onClick?: () => void
}> = ({ title, focus, description, imgageUrl, url, onClick }) => {
  const theme = useTheme()

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return url ? <RouterLink to={url}>{children}</RouterLink> : <>{children}</>
  }

  return (
    <Grid
      xs={12}
      sm={6}
      md={4}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Card
        elevation={focus ? 10 : 1}
        sx={{
          border: focus ? `1px solid ${theme.palette.primary.main}` : undefined,
          height: '100%',
          '& .MuiCardMedia-root': {
            opacity: focus ? 0.8 : 0.5,
          },
          '&:hover': {
            '& .MuiCardMedia-root': {
              opacity: 1,
            },
            backgroundColor: alpha(theme.palette.secondary.main, 0.2),
          },
        }}
        onClick={onClick}
      >
        <Wrapper>
          <CardMedia sx={{ height: 140 }} image={`${import.meta.env.BASE_URL}/${imgageUrl}`} title={title} />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              variant="overline"
              sx={{
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                fontFamily: fontFamilies.robotoMono,
              }}
            >
              {title}
            </Typography>
            <Typography variant="body2">{description}</Typography>
          </CardContent>
          {/* <CardActions>{actions}</CardActions> */}
        </Wrapper>
      </Card>
    </Grid>
  )
}

export const HomePage: React.FC<HomePageProps> = ({ userCtx, navigate, stats, alerts, statsLoading }) => {
  const [alertModalOpen, setAlertModalOpen] = React.useState(false)
  const nowDate = new Date()
  return (
    <PageWrapper title="Welcome to Regolith Co." maxWidth="md">
      <Typography
        paragraph
        sx={{
          m: 2,
        }}
      >
        Regolith Co. is a fansite dedicated to helping{' '}
        <Link href="https://robertsspaceindustries.com/">Star Citizen</Link> Miners organize, share, and scout together.
      </Typography>
      <Divider sx={{ my: 2 }} />
      {alerts && alerts.length > 0 && (
        <Stack spacing={2} mb={2}>
          {alerts.map((alert, i) => (
            <HomePageAlert alert={alert} key={i} />
          ))}
        </Stack>
      )}
      <Grid container spacing={4} mb={4}>
        <HomeCard
          title={`Mining Sessions ${userCtx.isInitialized ? '' : '(Login)'}`}
          focus
          description="Organize your multi-crew, multi-ship mining adventure! Supports hand, vehicle and ship mining as well as scouting and salvaging."
          imgageUrl="images/sm/mining.jpg"
          url={userCtx.isAuthenticated ? (userCtx.isInitialized ? '/session' : '/verify') : undefined}
          onClick={() => {
            if (!userCtx.isAuthenticated) userCtx.openPopup && userCtx.openPopup('/session')
          }}
        />
        <HomeCard
          title="Mining Loadouts"
          description="Plan and tweak your mining ship loadouts using the right components for the right kind of ores."
          imgageUrl="images/sm/workshop.jpg"
          url="/loadouts"
        />
        <HomeCard
          title="Work Order Calculator"
          description="Standalone calculator for refinery calculation and aUEC Sharing."
          imgageUrl="images/sm/refinery.jpg"
          url="/workorder"
        />
        <HomeCard
          title="Cluster Calculator"
          description="Standalone calculator for figuring out the value of a rock or cluster."
          imgageUrl="images/sm/cluster.jpg"
          url="/cluster"
        />
        <HomeCard
          title="Market Finder"
          description="Find the best place to sell your hard-mined ore."
          imgageUrl="images/sm/market1.jpg"
          url="/market-price"
        />
        <HomeCard
          title="Refinery Data"
          description="Data tables to compare refineries."
          imgageUrl="images/sm/market.jpg"
          url="/tables/ore"
        />
      </Grid>
      {/* STATS */}
      <Divider sx={{ my: 2 }} />
      <Paper sx={{ p: 2, my: 3 }} elevation={1}>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.secondary.dark,
            fontWeight: 'bold',
            mb: 2,
            fontFamily: fontFamilies.robotoMono,
            borderBottom: `1px solid ${theme.palette.secondary.dark}`,
          }}
        >
          Regolith Usage Stats
        </Typography>
        <SiteStats stats={stats} statsLoading={statsLoading} />
      </Paper>
    </PageWrapper>
  )
}
