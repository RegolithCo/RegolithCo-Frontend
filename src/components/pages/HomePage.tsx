import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Link,
  Paper,
  SxProps,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Theme } from '@mui/system'
import * as React from 'react'

import { PageWrapper } from '../PageWrapper'
import { LoginContextObj } from '../../hooks/useOAuth2'
import { SiteStats } from '../cards/SiteStats'
import { StatsObjectSummary } from '@regolithco/common'
import { Alert319 } from '../modals/announcements/Alert319'
import { AlertPyro } from '../modals/announcements/AlertPyro'

interface HomePageProps {
  userCtx: LoginContextObj
  navigate?: (path: string) => void
  handleLogin?: () => void
  stats: Partial<StatsObjectSummary>
  statsLoading: Record<keyof StatsObjectSummary, boolean>
}

const cardCSS: SxProps<Theme> = {
  cursor: 'pointer',
  // height: '100%',
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'space-between',
}

export const HomePage: React.FC<HomePageProps> = ({ userCtx, navigate, stats, statsLoading }) => {
  const [alertModalOpen, setAlertModalOpen] = React.useState(false)
  return (
    <PageWrapper title="Welcome to Regolith Co." maxWidth="md">
      <Typography
        paragraph
        sx={{
          m: 2,
        }}
      >
        This is a tool for organizing miners in <Link href="https://robertsspaceindustries.com/">Star Citizen</Link>.
      </Typography>
      {/* <Alert severity="info" sx={{ mb: 2 }}>
        <AlertTitle>A note about 3.19</AlertTitle>
        TL;DR: Expect weirdness and <strong>thank you</strong> for your patience while we all learn the new meta.
        <Link onClick={() => setAlertModalOpen(true)}>Read More</Link>
      </Alert> */}
      {
        <Alert severity="warning" sx={{ mb: 2 }}>
          <AlertTitle>A note about 3.21, 3.21.1, 3.22 and the road to Pyro</AlertTitle>
          Expect weirdness and <strong>thank you again</strong> for your patience while all our tools catch up.
          <Link onClick={() => setAlertModalOpen(true)}>(Read More)</Link>
        </Alert>
      }
      <Divider sx={{ my: 2 }} />
      {/* OUR MAIN CHOICE */}
      <Grid container spacing={4}>
        <Grid sm={4} sx={cardCSS}>
          <Card
            elevation={10}
            sx={cardCSS}
            onClick={() => {
              if (!userCtx.isAuthenticated) userCtx.openPopup && userCtx.openPopup('/session')
              else if (!userCtx.isInitialized) navigate && navigate('/verify')
              else navigate && navigate('/session')
            }}
          >
            <CardMedia sx={{ height: 140 }} image={`${process.env.PUBLIC_URL}/images/sm/mining.jpg`} title="mining" />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="overline" sx={{ fontWeight: 'bold' }}>
                Mining Sessions {userCtx.isInitialized ? '' : '(Login)'}
              </Typography>
              <Typography variant="body2">
                Organize your multi-crew mining with multiple ships, crew sharing, coordinated scouting etc.
              </Typography>
            </CardContent>
            <CardActions>
              {userCtx.isInitialized ? <Button>My Sessions</Button> : <Button>Mining Sessions (Login)</Button>}
            </CardActions>
          </Card>
        </Grid>
        <Grid sm={4} sx={cardCSS}>
          <Card elevation={8} sx={cardCSS} onClick={() => navigate && navigate('/loadouts')}>
            <CardMedia sx={{ height: 140 }} image={`${process.env.PUBLIC_URL}/images/sm/workshop.jpg`} title="mining" />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="overline" sx={{ fontWeight: 'bold' }}>
                Mining Loadouts
              </Typography>
              <Typography variant="body2">
                Plan and tweak your mining ship loadouts using the right components for the right kind of ores.
              </Typography>
            </CardContent>
            <CardActions>
              <Button>Mining Loadouts</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid sm={4} sx={cardCSS}>
          <Card elevation={8} sx={cardCSS} onClick={() => navigate && navigate('/workorder')}>
            <CardMedia sx={{ height: 140 }} image={`${process.env.PUBLIC_URL}/images/sm/refinery.jpg`} title="mining" />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="overline" sx={{ fontWeight: 'bold' }}>
                Work Order Calculator
              </Typography>
              <Typography variant="body2">Standalone calculator for refinery calculation and aUEC Shares</Typography>
            </CardContent>
            <CardActions>
              <Button onClick={() => navigate && navigate('/workorder')}>Work Orders</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid sm={4} sx={cardCSS}>
          <Card elevation={8} sx={cardCSS} onClick={() => navigate && navigate('/cluster')}>
            <CardMedia sx={{ height: 140 }} image={`${process.env.PUBLIC_URL}/images/sm/cluster.jpg`} title="mining" />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="overline" sx={{ fontWeight: 'bold' }}>
                Cluster Calculator
              </Typography>
              <Typography variant="body2">
                Standalone calculator figuring out the value of a rock or cluster.
              </Typography>
            </CardContent>
            <CardActions>
              <Button onClick={() => navigate && navigate('/cluster')}>Cluster Calculator</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid sm={4} sx={cardCSS}>
          <Card elevation={8} sx={cardCSS} onClick={() => navigate && navigate('/tables/ore')}>
            <CardMedia sx={{ height: 140 }} image={`${process.env.PUBLIC_URL}/images/sm/market.jpg`} title="mining" />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="overline" sx={{ fontWeight: 'bold' }}>
                Market & Refinery Data
              </Typography>
              <Typography variant="body2">Data tables to compare refineries.</Typography>
            </CardContent>
            <CardActions>
              <Button>Prices & Data Tables</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      {/* <Alert319 open={alertModalOpen} onClose={() => setAlertModalOpen(false)} /> */}
      <AlertPyro open={alertModalOpen} onClose={() => setAlertModalOpen(false)} />

      {/* STATS */}
      <Divider sx={{ my: 2 }} />
      <Paper sx={{ p: 2, my: 3 }} elevation={1}>
        <Typography variant="h5" sx={{ mb: 2 }} gutterBottom>
          Regolith Usage Stats
        </Typography>
        <SiteStats stats={stats} statsLoading={statsLoading} />
      </Paper>
    </PageWrapper>
  )
}
