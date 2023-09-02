import * as React from 'react'

import { ActivityEnum, Session, SessionStateEnum, UserProfile, WorkOrder } from '@regolithco/common'
import { Box, FormControlLabel, FormGroup, Switch, Theme, Typography, useTheme } from '@mui/material'
import { WorkOrderAddFAB } from '../../fields/WorkOrderAddFAB'
import { WorkOrderTable } from './WorkOrderTable'
import { newWorkOrderMaker } from '../../../lib/newObjectFactories'
import { Stack, SxProps } from '@mui/system'
import { fontFamilies } from '../../../theme'
import { DialogEnum, SessionContext } from '../../../context/session.context'

export interface TabWorkOrdersProps {
  propA?: string
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  gridContainer: {
    [theme.breakpoints.up('md')]: {},
  },
  container: {
    backgroundColor: '#0e0c1baa',
    position: 'relative',
  },
  section: {},
  sectionTitle: {
    px: 2,
    py: 0.65,
    background: '#121115aa',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& .MuiTypography-root': {
      fontSize: '1.2rem',
      lineHeight: 2,
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
        lineHeight: 1,
      },
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
    '& .MuiFormControlLabel-root .MuiTypography-root': {
      fontStyle: 'italic',
      fontSize: '0.7rem',
    },
  },
  sectionBody: {
    py: 1,
    pl: 2,
    pr: 1,
    mb: 2,
  },
})

export const TabWorkOrders: React.FC<TabWorkOrdersProps> = () => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const { session, openWorkOrderModal, createNewWorkOrder, setActiveModal } = React.useContext(SessionContext)
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
        onClick={createNewWorkOrder}
        sessionSettings={session.sessionSettings}
        fabProps={{
          disabled: !isActive,
        }}
      />
    </Box>
  )
}
