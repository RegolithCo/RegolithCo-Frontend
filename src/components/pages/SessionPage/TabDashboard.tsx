import * as React from 'react'

import { ScoutingFindStateEnum, SessionStateEnum } from '@regolithco/common'
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
import { fontFamilies } from '../../../theme'
import { SessionContext } from '../../../context/session.context'
import { grey } from '@mui/material/colors'

export interface TabDashboardProps {
  propA?: string
}

const stylesThunk = (theme: Theme, isActive: boolean): Record<string, SxProps<Theme>> => ({
  container: {
    flex: '1 1',
    '& .MuiAccordion-root': {
      position: 'relative',
    },
    '& .MuiAccordion-root .MuiCollapse-root': {
      backgroudColor: '#0e0c1baa',
    },
    '& .MuiAccordionDetails-root': {
      p: 0,
      // pb: 8,
      position: 'relative',
      backgroundColor: '#0e0c1baa',
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: theme.palette.primary.contrastText,
    },
    '& .MuiAccordionSummary-content': {
      m: 0,
    },
    '& .MuiAccordionSummary-content .MuiFormControlLabel-root .MuiTypography-root': {
      fontStyle: 'italic',
      fontSize: '0.7rem',
    },
  },
  section: {},
  sectionTitle: {
    '&::before': {
      content: '""',
    },
    fontSize: '1.2rem',
    lineHeight: 2,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
      lineHeight: 1,
    },
    fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
    background: '#121115aa',
    backgroundColor: isActive ? theme.palette.primary.main : grey[600],
    color: theme.palette.primary.contrastText,
  },
  sectionBody: {
    py: 1,
    pl: 2,
    pr: 1,
    mb: 2,
  },
})

export const TabDashboard: React.FC<TabDashboardProps> = () => {
  const theme = useTheme()
  const { session, openWorkOrderModal, openScoutingModal, createNewWorkOrder, createNewScoutingFind } =
    React.useContext(SessionContext)
  const isActive = session?.state === SessionStateEnum.Active
  const styles = stylesThunk(theme, isActive)
  // Filtering for the accordions
  const [filterClosedScout, setFilterClosedScout] = React.useState(false)
  const [filterPaidWorkOrders, setFilterPaidWorkOrders] = React.useState(false)
  const badStates: ScoutingFindStateEnum[] = [ScoutingFindStateEnum.Abandonned, ScoutingFindStateEnum.Depleted]

  const allScouts = session?.scouting?.items || []
  const filteredScouts = allScouts.filter(({ state }) => !filterClosedScout || badStates.indexOf(state) < 0)
  filteredScouts.sort((a, b) => b.createdAt - a.createdAt)

  const allWorkOrders = session?.workOrders?.items || []
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
          <Box sx={{ pb: 8 }}>
            <WorkOrderTable isDashboard workOrders={filteredWorkOrders || []} openWorkOrderModal={openWorkOrderModal} />
          </Box>
        </AccordionDetails>
        <WorkOrderAddFAB
          onClick={createNewWorkOrder}
          sessionSettings={session?.sessionSettings}
          fabProps={{
            disabled: !isActive,
          }}
        />
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
            position: 'relative',
            overflowY: 'hidden',
            maxHeight: 400,
            minHeight: 300,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Grid container spacing={3} margin={0} sx={{ pt: 3, pb: 8, flex: '1 1', overflowY: 'scroll' }}>
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
            onClick={createNewScoutingFind}
            sessionSettings={session?.sessionSettings}
            fabProps={{
              disabled: !isActive,
            }}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
