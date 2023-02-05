import * as React from 'react'

import { ActivityEnum, Session, SessionStateEnum, UserProfile, WorkOrder } from '@regolithco/common'
import { Accordion, Box, FormControlLabel, FormGroup, Switch, Typography } from '@mui/material'
import { WorkOrderAddFAB } from '../../fields/WorkOrderAddFAB'
import { WorkOrderTable } from './WorkOrderTable'
import { newWorkOrderMaker } from '../../../lib/newObjectFactories'
import { DialogEnum } from './SessionPage.container'
import { Stack } from '@mui/system'

export interface TabWorkOrdersProps {
  session: Session
  userProfile: UserProfile
  // For the two modals that take us deeper
  openWorkOrderModal: (workOrderId?: string) => void
  //
  setNewWorkOrder: (workOrder: WorkOrder) => void
  setActiveModal: (modal: DialogEnum) => void
}

export const TabWorkOrders: React.FC<TabWorkOrdersProps> = ({
  session,
  userProfile,
  openWorkOrderModal,
  setNewWorkOrder,
  setActiveModal,
}) => {
  const isActive = session.state === SessionStateEnum.Active
  // Filtering for the accordions
  const [filterPaidWorkOrders, setFilterPaidWorkOrders] = React.useState(false)
  const allWorkOrders = session.workOrders?.items || []
  const filteredWorkOrders = filterPaidWorkOrders
    ? allWorkOrders.filter(({ crewShares }) => crewShares?.some(({ state }) => !state))
    : [...allWorkOrders]

  const workOrderCounts = [filteredWorkOrders.length, allWorkOrders.length]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: 1000 }}>
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
