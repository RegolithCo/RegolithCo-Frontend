import * as React from 'react'

import { UserProfile, Session } from '@regolithco/common'
import { Alert, AlertTitle, Typography, useTheme } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { fontFamilies } from '../../../theme'
import { DashboardProps } from './Dashboard'

export const TabStats: React.FC<DashboardProps> = ({
  userProfile,
  mySessions,
  fetchMoreSessions,
  joinedSessions,
  allLoaded,
  loading,
  navigate,
}) => {
  const theme = useTheme()

  return (
    <>
      <Stack
        spacing={2}
        sx={{ my: 2, borderBottom: `2px solid ${theme.palette.secondary.dark}` }}
        direction={{ xs: 'column', sm: 'row' }}
      >
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            color: 'secondary.dark',
            fontFamily: fontFamilies.robotoMono,
            fontWeight: 'bold',
          }}
        >
          Session Stats
        </Typography>
      </Stack>
      <Stack spacing={2} sx={{ my: 2 }} direction={{ xs: 'column', sm: 'row' }}>
        <Alert elevation={6} variant="outlined" severity="info" sx={{ my: 2, flex: '1 1 50%' }}>
          <AlertTitle>Work orders from all your sessions</AlertTitle>
          <Typography>
            All work orders inside all your joined sessions that you either own or have been marked as the seller.
          </Typography>
        </Alert>
      </Stack>

      <Box>Stuff</Box>
    </>
  )
}
