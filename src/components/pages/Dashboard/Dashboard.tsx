import * as React from 'react'

import { Session, SessionStateEnum, UserProfile } from '@regolithco/common'
import { Box, Button, ButtonGroup, IconButton, Menu, Paper, Tab, Tabs, useTheme } from '@mui/material'
import { AddCircle, ChevronLeft, Insights, MoreHoriz, RocketLaunch } from '@mui/icons-material'
import { Container, Stack } from '@mui/system'
import { TabSessions } from './TabSessions'
import { TabWorkOrders } from './TabWorkOrders'
import { TabStats } from './TabStats/TabStats'
import { TabCrewShares } from './TabCrewShares'
import { SessionDashTabsEnum, WorkOrderSummaryLookup } from './Dashboard.container'
import { DatePresetsEnum } from './TabStats/StatsDatePicker'
import { JoinSessionButton } from './JoinSessionButton'

export interface DashboardProps {
  userProfile: UserProfile
  workOrderSummaries: WorkOrderSummaryLookup
  activeTab: SessionDashTabsEnum
  preset: DatePresetsEnum
  mySessions: Session[]
  joinedSessions: Session[]
  fetchMoreSessions: () => void
  paginationDate: number
  setPaginationDate: (date: number) => void
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

  const activeSessions = React.useMemo(() => {
    const activeSessions = props.mySessions.filter((session) => session.state === SessionStateEnum.Active)
    return activeSessions
  }, [props.mySessions])

  return (
    <Container maxWidth="lg">
      <Paper elevation={4} sx={styles.container}>
        <JoinSessionButton sessions={activeSessions} onCreateNewSession={onCreateNewSession} navigate={navigate} />

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
