import * as React from 'react'

import { Session, UserProfile } from '@regolithco/common'
import { Box, Button, Paper, Tab, Tabs, useTheme } from '@mui/material'
import { AddCircle, Insights } from '@mui/icons-material'
import { Container, Stack } from '@mui/system'
import { TabSessions } from './TabSessions'
import { TabWorkOrders } from './TabWorkOrders'
import { TabStats } from './TabStats'
import { TabCrewShares } from './TabCrewShares'
import { SessionDashTabsEnum } from './Dashboard.container'

export interface DashboardProps {
  userProfile: UserProfile
  activeTab: SessionDashTabsEnum
  mySessions: Session[]
  joinedSessions: Session[]
  fetchMoreSessions: () => void
  loading?: boolean
  allLoaded?: boolean
  navigate?: (path: string) => void
  onCreateNewSession?: () => void
}

export const Dashboard: React.FC<DashboardProps> = (props) => {
  const theme = useTheme()
  const { activeTab, navigate, onCreateNewSession } = props

  const styles = {
    container: {
      py: {
        md: 3,
        lg: 4,
      },
      px: {
        md: 2,
        lg: 4,
      },
      my: {
        md: 4,
      },
      border: {
        // md: '1px solid #444444',
      },
      backgroundColor: '#000000cc',
    },
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={4} sx={styles.container}>
        <Stack spacing={2} sx={{ my: 2 }} direction={{ xs: 'column', sm: 'row' }}>
          <Box>
            {onCreateNewSession && (
              <Button
                startIcon={<AddCircle />}
                size="large"
                variant="contained"
                sx={{ margin: '0 auto' }}
                onClick={onCreateNewSession}
              >
                Create a new Session
              </Button>
            )}
          </Box>
        </Stack>

        <Tabs
          value={activeTab}
          variant="fullWidth"
          onChange={(event: React.SyntheticEvent, newValue: SessionDashTabsEnum) => {
            navigate && navigate(`/dashboard/${newValue}`)
          }}
        >
          <Tab label="My Sessions" value={SessionDashTabsEnum.sessions} />
          <Tab label="Work Orders" value={SessionDashTabsEnum.workOrders} />
          <Tab label="Crew Shares" value={SessionDashTabsEnum.crewShares} />
          <Tab label="Stats" icon={<Insights />} iconPosition="start" value={SessionDashTabsEnum.stats} />
        </Tabs>
        {activeTab === SessionDashTabsEnum.sessions && <TabSessions {...props} />}
        {activeTab === SessionDashTabsEnum.workOrders && <TabWorkOrders {...props} />}
        {activeTab === SessionDashTabsEnum.crewShares && <TabCrewShares {...props} />}
        {activeTab === SessionDashTabsEnum.stats && <TabStats {...props} />}
      </Paper>
    </Container>
  )
}
