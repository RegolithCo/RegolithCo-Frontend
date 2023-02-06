import * as React from 'react'

import { ActivityEnum, Session, SessionStateEnum, UserProfile, WorkOrder } from '@regolithco/common'
import { Accordion, Box, FormControlLabel, FormGroup, Switch, Theme, Typography, useTheme } from '@mui/material'
import { WorkOrderAddFAB } from '../../fields/WorkOrderAddFAB'
import { WorkOrderTable } from './WorkOrderTable'
import { newWorkOrderMaker } from '../../../lib/newObjectFactories'
import { DialogEnum } from './SessionPage.container'
import { Stack, SxProps } from '@mui/system'
import { fontFamilies } from '../../../theme'

export interface TabWorkOrdersProps {
  session: Session
  userProfile: UserProfile
  // For the two modals that take us deeper
  openWorkOrderModal: (workOrderId?: string) => void
  //
  setNewWorkOrder: (workOrder: WorkOrder) => void
  setActiveModal: (modal: DialogEnum) => void
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  gridContainer: {
    [theme.breakpoints.up('md')]: {},
  },
  container: {
    backgroundColor: '#0e0c1baa',
    position: 'relative',
    '& .MuiAccordion-root': {
      // backgroundColor: '#0e0c1baa',
    },
    '& .MuiAccordionDetails-root': {
      p: 0,
    },
    '& .MuiTable-root': {
      background: '#12111555',
    },
  },
  section: {},
  sectionTitle: {
    p: 1,
    '&::before': {
      content: '""',
    },
    background: '#121115ee',
    // color: theme.palette.primary.dark,
    // fontFamily: fontFamilies.robotoMono,
    '& .MuiTypography-root': {
      fontSize: '1rem',
      lineHeight: 2,
      // color: theme.palette.primary.dark,
      // fontFamily: fontFamilies.robotoMono,
      // fontWeight: 'bold',
    },
    textShadow: '0 0 1px #000',
    // borderBottom: '2px solid',
  },
  sectionBody: {
    py: 1,
    pl: 2,
    pr: 1,
    mb: 2,
  },
})

export const TabWorkOrders: React.FC<TabWorkOrdersProps> = ({
  session,
  userProfile,
  openWorkOrderModal,
  setNewWorkOrder,
  setActiveModal,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const isActive = session.state === SessionStateEnum.Active
  // Filtering for the accordions
  const [filterPaidWorkOrders, setFilterPaidWorkOrders] = React.useState(false)
  const allWorkOrders = session.workOrders?.items || []
  const filteredWorkOrders = filterPaidWorkOrders
    ? allWorkOrders.filter(({ crewShares }) => crewShares?.some(({ state }) => !state))
    : [...allWorkOrders]

  const workOrderCounts = [filteredWorkOrders.length, allWorkOrders.length]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', ...styles.container }}>
      <Box sx={styles.sectionTitle}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>
            Work Orders ({workOrderCounts[0]}/{workOrderCounts[1]})
          </Typography>
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
        </Stack>
      </Box>

      <WorkOrderTable workOrders={filteredWorkOrders || []} openWorkOrderModal={openWorkOrderModal} />
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
    </Box>
  )
}
