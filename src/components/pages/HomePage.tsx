import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, SxProps, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Theme } from '@mui/system'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '../../hooks/useLogin'
import { LoginContextObj } from '../../types'
import { Auth } from 'aws-amplify'

import { PageWrapper } from '../PageWrapper'

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

export const HomePage: React.FC<HomePageProps> = ({ userCtx, navigate, handleLogin }) => {
  return (
    <PageWrapper title="Welcome to Regolith Co." maxWidth="md">
      <Typography paragraph>This is a tool for organizing miners in Star Citizen.</Typography>
      <Grid container spacing={2}>
        <Grid sm={4} sx={cardCSS}>
          <Card
            elevation={5}
            sx={cardCSS}
            onClick={() => {
              if (!userCtx.isAuthenticated) handleLogin && handleLogin()
              else if (!userCtx.isInitialized) navigate && navigate('/verify')
              else navigate && navigate('/session')
            }}
          >
            <CardMedia sx={{ height: 140 }} image={`${process.env.PUBLIC_URL}/images/sm/mining.jpg`} title="mining" />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="overline">Mining Sessions (Login)</Typography>
              <Typography variant="body2">
                Organize your multi-crew mining with multiple ships, crew sharing etc.
              </Typography>
            </CardContent>
            <CardActions>
              <Button>Login</Button>
            </CardActions>
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
  async function handleLogin() {
    try {
      await Auth.federatedSignIn()
    } catch (error) {
      console.error(error)
    }
  }
  const navigate = useNavigate()
  return <HomePage userCtx={userCtx} navigate={navigate} handleLogin={handleLogin} />
}
