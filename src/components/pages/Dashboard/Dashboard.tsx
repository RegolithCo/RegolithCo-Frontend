import * as React from 'react'

import { CrewShare, Session, SessionStateEnum, UserProfile, WorkOrder } from '@regolithco/common'
import { Box, Container, Paper, Tab, Tabs, useTheme } from '@mui/material'
import { Insights, ViewTimeline } from '@mui/icons-material'
import { TabSessions } from './TabSessions'
import { TabWorkOrders } from './TabWorkOrders'
import { TabStats } from './TabStats/TabStats'
import { TabCrewShares } from './TabCrewShares'
import { SessionDashTabsEnum, WorkOrderSummaryLookup } from './Dashboard.container'
import { DatePresetsEnum } from './TabStats/StatsDatePicker'
import { JoinSessionButton } from './JoinSessionButton'
import { fontFamilies } from '../../../theme'

export interface DashboardProps {
  userProfile: UserProfile
  workOrderSummaries: WorkOrderSummaryLookup
  activeTab: SessionDashTabsEnum
  preset: DatePresetsEnum
  mySessions: Session[]
  joinedSessions: Session[]
  deliverWorkOrders: (orders: WorkOrder[]) => Promise<void>
  markCrewSharesPaid: (shares: CrewShare[]) => Promise<void>
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
      my: {
        md: 4,
      },
      border: {
        // md: '1px solid #444444',
      },
    },
    paper: {
      // blur the background
      backdropFilter: 'blur(7px)',
      backgroundColor: '#000000ee',
    },
    innerContainer: {
      px: {
        md: 2,
        lg: 4,
      },
      py: {
        md: 3,
        lg: 2,
      },
    },
  }

  const activeSessions = React.useMemo(() => {
    const activeSessions = props.mySessions.filter((session) => session.state === SessionStateEnum.Active)
    return activeSessions
  }, [props.mySessions])

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <Paper elevation={4} sx={styles.paper}>
        <Tabs
          value={activeTab}
          variant="fullWidth"
          onChange={(event: React.SyntheticEvent, newValue: SessionDashTabsEnum) => {
            navigate && navigate(`/dashboard/${newValue}`)
          }}
          sx={{
            borderBottom: `3px solid ${theme.palette.primary.main}`,
            // Make the active tab stand out
            mb: 4,
            '& .MuiTab-root': {
              fontSize: '1.25rem',
              fontWeight: 'bold',
              fontFamily: fontFamilies.robotoMono,
              textAlignment: 'Left',
              background: 'black',
            },
            '& .MuiTab-root.Mui-selected': {
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.primary.main,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            },
            '& .MuiTabs-indicator': {
              // backgroundColor: 'black',
              // height: 5,
            },
          }}
        >
          <Tab label="Sessions" icon={<ViewTimeline />} iconPosition="start" value={SessionDashTabsEnum.sessions} />
          <Tab label="Work Orders" value={SessionDashTabsEnum.workOrders} />
          <Tab label="Crew Shares" value={SessionDashTabsEnum.crewShares} />
          <Tab label="Stats" icon={<Insights />} iconPosition="start" value={SessionDashTabsEnum.stats} />
        </Tabs>
        <Box sx={styles.innerContainer}>
          {activeTab === SessionDashTabsEnum.sessions && (
            <JoinSessionButton sessions={activeSessions} onCreateNewSession={onCreateNewSession} navigate={navigate} />
          )}
          {activeTab === SessionDashTabsEnum.sessions && <TabSessions {...props} />}
          {activeTab === SessionDashTabsEnum.workOrders && <TabWorkOrders {...props} />}
          {activeTab === SessionDashTabsEnum.crewShares && <TabCrewShares {...props} />}
          {activeTab === SessionDashTabsEnum.stats && <TabStats {...props} />}
        </Box>
      </Paper>
    </Container>
  )
}
