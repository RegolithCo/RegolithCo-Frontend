import * as React from 'react'

import {
  ActivityEnum,
  ScoutingFindStateEnum,
  Session,
  SessionStateEnum,
  UserProfile,
  SessionUser,
  WorkOrder,
  ScoutingFind,
} from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  SxProps,
  Theme,
  useTheme,
  Zoom,
} from '@mui/material'
import { ScoutingAddFAB } from '../../fields/ScoutingAddFAB'
import { WorkOrderAddFAB } from '../../fields/WorkOrderAddFAB'
import { ExpandMore } from '@mui/icons-material'
import { WorkOrderTable } from './WorkOrderTable'
import { ClusterCard } from '../../cards/ClusterCard'
import { newEmptyScoutingFind, newWorkOrderMaker } from '../../../lib/newObjectFactories'
import { DialogEnum } from './SessionPage.container'
import { fontFamilies } from '../../../theme'

export interface TabDashboardProps {
  session: Session
  userProfile: UserProfile
  sessionUser: SessionUser
  // For the two modals that take us deeper
  openWorkOrderModal: (workOrderId?: string) => void
  openScoutingModal: (scoutinfFindId?: string) => void
  //
  setNewWorkOrder: (workOrder: WorkOrder) => void
  setNewScoutingFind: (scoutingFind: ScoutingFind) => void
  setActiveModal: (modal: DialogEnum) => void
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  container: {
    '& .MuiAccordion-root': {
      backgroundColor: '#0e0c1baa',
      position: 'relative',
    },
    '& .MuiAccordionDetails-root': {
      p: 0,
      pb: 8,
      position: 'relative',
    },
    '& .MuiAccordionSummary-content': {
      m: 0,
    },
    '& .MuiTable-root': {
      background: '#12111555',
    },
  },
  section: {},
  sectionTitle: {
    '&::before': {
      content: '""',
    },
    // fontFamily: fontFamilies.robotoMono,
    fontSize: '1rem',
    lineHeight: 2,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
      lineHeight: 1,
    },
    // color: theme.palette.primary.dark,
    fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
    background: '#121115aa',
    // borderBottom: '2px solid',
  },
  sectionBody: {
    py: 1,
    pl: 2,
    pr: 1,
    mb: 2,
  },
})

export const TabDashboard: React.FC<TabDashboardProps> = ({
  session,
  userProfile,
  sessionUser,
  openWorkOrderModal,
  openScoutingModal,
  setNewWorkOrder,
  setNewScoutingFind,
  setActiveModal,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const isActive = session.state === SessionStateEnum.Active
  // Filtering for the accordions
  const [filterClosedScout, setFilterClosedScout] = React.useState(false)
  const [filterPaidWorkOrders, setFilterPaidWorkOrders] = React.useState(false)
  const badStates: ScoutingFindStateEnum[] = [ScoutingFindStateEnum.Abandonned, ScoutingFindStateEnum.Depleted]
  const allScouts = session.scouting?.items || []
  const filteredScouts = allScouts.filter(({ state }) => !filterClosedScout || badStates.indexOf(state) < 0)
  filteredScouts.sort((a, b) => b.createdAt - a.createdAt)
  const allWorkOrders = session.workOrders?.items || []
  const filteredWorkOrders = filterPaidWorkOrders
    ? allWorkOrders.filter(({ crewShares }) => crewShares?.some(({ state }) => !state))
    : [...allWorkOrders]

  const scountingCounts = [filteredScouts.length, allScouts.length]
  const workOrderCounts = [filteredWorkOrders.length, allWorkOrders.length]

  return (
    <Box sx={styles.container}>
      <Accordion defaultExpanded={true} disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMore color="inherit" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={styles.sectionTitle}
        >
          Work Orders ({workOrderCounts[0]}/{workOrderCounts[1]})
          <Box sx={{ flexGrow: 1 }} />
          <FormGroup
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <FormControlLabel
              sx={{ mr: 3 }}
              labelPlacement="start"
              color="secondary"
              control={
                <Switch
                  color="secondary"
                  checked={filterPaidWorkOrders}
                  onChange={(e) => setFilterPaidWorkOrders(e.target.checked)}
                />
              }
              label="Hide paid"
            />
          </FormGroup>
        </AccordionSummary>
        <AccordionDetails>
          <WorkOrderTable isDashboard workOrders={filteredWorkOrders || []} openWorkOrderModal={openWorkOrderModal} />
          <WorkOrderAddFAB
            onClick={(activity: ActivityEnum) => {
              setNewWorkOrder(newWorkOrderMaker(session, userProfile, activity))
              setActiveModal(DialogEnum.ADD_WORKORDER)
            }}
            sessionSettings={session.sessionSettings}
            fabProps={{
              disabled: !isActive,
            }}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true} disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMore color="inherit" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={styles.sectionTitle}
        >
          Scouting ({scountingCounts[0]}/{scountingCounts[1]})
          <Box sx={{ flexGrow: 1 }} />
          <FormGroup
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <FormControlLabel
              sx={{ mr: 3 }}
              labelPlacement="start"
              control={
                <Switch
                  color="secondary"
                  checked={filterClosedScout}
                  onChange={(e) => setFilterClosedScout(e.target.checked)}
                />
              }
              label="Hide Depleted/Abandoned"
            />
          </FormGroup>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            maxHeight: 400,
            minHeight: 300,
          }}
        >
          <Grid container spacing={3} margin={0}>
            {filteredScouts.map((scouting, idx) => {
              return (
                <Grid
                  key={`scoutingfind-${idx}`}
                  sx={{
                    '& *': {
                      cursor: 'pointer',
                    },
                  }}
                  onClick={() => {
                    openScoutingModal(scouting.scoutingFindId)
                  }}
                >
                  <Zoom in style={{ transitionDelay: `${200 * idx}ms` }}>
                    <Box>
                      <ClusterCard key={idx} scoutingFind={scouting} />
                    </Box>
                  </Zoom>
                </Grid>
              )
            })}
          </Grid>
          <ScoutingAddFAB
            onClick={(scoutingType) => {
              setNewScoutingFind(newEmptyScoutingFind(session, sessionUser, scoutingType))
              setActiveModal(DialogEnum.ADD_SCOUTING)
            }}
            sessionSettings={session.sessionSettings}
            fabProps={{
              disabled: !isActive,
            }}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
