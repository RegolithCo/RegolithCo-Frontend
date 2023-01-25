import { Button, Card, CardActions, CardContent, CardMedia, SxProps, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Theme } from '@mui/system'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import { PageWrapper } from '../PageWrapper'
import { LoginContextObj, useLogin } from '../../hooks/useOAuth2'

interface HomePageProps {
  userCtx: LoginContextObj
  navigate?: (path: string) => void
  handleLogin?: () => void
}

const cardCSS: SxProps<Theme> = {
  cursor: 'pointer',
  // height: '100%',
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'space-between',
}

export const HomePage: React.FC<HomePageProps> = ({ userCtx, navigate }) => {
  return (
    <PageWrapper title="Welcome to Regolith Co." maxWidth="md">
      <Typography paragraph>This is a tool for organizing miners in Star Citizen.</Typography>
      <Grid container spacing={4}>
        <Grid sm={4} sx={cardCSS}>
          <Card
            elevation={8}
            sx={cardCSS}
            onClick={() => {
              if (!userCtx.isAuthenticated) userCtx.openPopup && userCtx.openPopup('/session')
              else if (!userCtx.isInitialized) navigate && navigate('/verify')
              else navigate && navigate('/session')
            }}
          >
            <CardMedia sx={{ height: 140 }} image={`${process.env.PUBLIC_URL}/images/sm/mining.jpg`} title="mining" />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="overline">Mining Sessions {userCtx.isInitialized ? '' : '(Login)'}</Typography>
              <Typography variant="body2">
                Organize your multi-crew mining with multiple ships, crew sharing etc.
              </Typography>
            </CardContent>
            <CardActions>{userCtx.isInitialized ? <Button>My Sessions</Button> : <Button>Login</Button>}</CardActions>
          </Card>
        </Grid>
        <Grid sm={4} sx={cardCSS}>
          <Card elevation={5} sx={cardCSS} onClick={() => navigate && navigate('/workorder')}>
            <CardMedia sx={{ height: 140 }} image={`${process.env.PUBLIC_URL}/images/sm/refinery.jpg`} title="mining" />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="overline">Work Order Calculator</Typography>
              <Typography variant="body2">Standalone calculator for refinery calculation and aUEC Shares</Typography>
            </CardContent>
            <CardActions>
              <Button onClick={() => navigate && navigate('/workorder')}>Work Orders</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid sm={4} sx={cardCSS}>
          <Card elevation={5} sx={cardCSS} onClick={() => navigate && navigate('/cluster')}>
            <CardMedia sx={{ height: 140 }} image={`${process.env.PUBLIC_URL}/images/sm/cluster.jpg`} title="mining" />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="overline">Cluster Calculator</Typography>
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
          <Card elevation={5} sx={cardCSS} onClick={() => navigate && navigate('/tables/ore')}>
            <CardMedia sx={{ height: 140 }} image={`${process.env.PUBLIC_URL}/images/sm/market.jpg`} title="mining" />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="overline">Market & Refinery Data</Typography>
              <Typography variant="body2">Data tables to compare refineries.</Typography>
            </CardContent>
            <CardActions>
              <Button>Prices & Data Tables</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </PageWrapper>
  )
}

export const HomePageContainer: React.FC = () => {
  const userCtx = useLogin()
  const navigate = useNavigate()
  return <HomePage userCtx={userCtx} navigate={navigate} />
}
