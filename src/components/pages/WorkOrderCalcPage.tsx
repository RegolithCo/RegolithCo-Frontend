import * as React from 'react'
import { Alert, Box, Typography } from '@mui/material'
import { PageWrapper } from '../PageWrapper'

import { UserSuggest, ActivityEnum, UserProfile, WorkOrder } from '@orgminer/common'
import { WorkOrderCalc } from '../calculators/WorkOrderCalc'
import { WorkOrderTypeChooser } from '../fields/WorkOrderTypeChooser'
import { dummySession, dummyUserProfile, newWorkOrderMaker } from '../../lib/newObjectFactories'

export interface WorkOrderCalcPageProps {
  userProfile?: UserProfile
}

export const WorkOrderCalcPage: React.FC<WorkOrderCalcPageProps> = ({ userProfile }) => {
  // eslint-disable-next-line no-unused-vars
  const [workOrders, setWorkOrders] = React.useState<{ [key in ActivityEnum]?: WorkOrder }>({})
  const [activeActivity, setActiveActivity] = React.useState<ActivityEnum>(ActivityEnum.ShipMining)
  const owner = userProfile || dummyUserProfile()
  const session = dummySession(owner)

  // dumb
  const activeWorkOrder = React.useMemo(() => {
    if (workOrders && workOrders[activeActivity]) return workOrders && workOrders[activeActivity]
    else {
      return newWorkOrderMaker(session, owner, activeActivity)
    }
  }, [workOrders, activeActivity])

  const userSuggest: UserSuggest = React.useMemo(
    (): UserSuggest =>
      !userProfile
        ? {}
        : (userProfile?.friends || []).reduce(
            (acc, fName) => ({
              ...acc,
              [fName]: {
                friend: true,
                session: false,
              },
            }),
            {}
          ),
    [userProfile]
  )

  return (
    <PageWrapper title="Work Order Calculator" maxWidth="xl" sx={{}}>
      <Typography variant="h4" component="h1" gutterBottom></Typography>
      <Typography variant="body1" paragraph>
        This is where you can calculate the cost of a work order and how to share it between members of your org/party.
      </Typography>
      <Alert severity="info" sx={{ m: 2 }}>
        NOTE: This is a standalone calculator. If you want to work on more than one order, store consecutive orders or
        share your work orders with friends then consider logging in and creating/joining a <strong>session</strong>.
      </Alert>
      <Box sx={{ mb: 3 }}>
        <WorkOrderTypeChooser onChange={setActiveActivity} value={activeActivity} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          minHeight: 700,
          overflowX: 'hidden',
          overflowY: 'scroll',
        }}
      >
        <WorkOrderCalc
          allowEdit
          isEditing
          allowPay
          workOrder={activeWorkOrder as WorkOrder}
          userSuggest={userSuggest}
          // We don't do templates or locking ont he standalone calculator
          // forceTemplate
          // templateJob
          onChange={(workOrder) => {
            setWorkOrders({
              ...(workOrders ? workOrders : {}),
              [activeActivity]: { ...workOrder },
            })
          }}
          onDeleteCrewShare={(scName) => {
            if (!activeWorkOrder) return
            const newWorkOrders = {
              ...(workOrders ? workOrders : {}),
              [activeActivity]: {
                ...activeWorkOrder,
                crewShares: (activeWorkOrder.crewShares || [])?.filter((share) => share.scName !== scName),
              },
            }
            setWorkOrders(newWorkOrders)
          }}
          onSetCrewSharePaid={(scName, paid) => {
            if (!activeWorkOrder) return
            const newWorkOrders = {
              ...(workOrders ? workOrders : {}),
              [activeActivity]: {
                ...activeWorkOrder,
                crewShares: (activeWorkOrder.crewShares || [])?.map((share) => {
                  if (share.scName === scName) return { ...share, state: paid }
                  return share
                }),
              },
            }
            setWorkOrders(newWorkOrders)
          }}
        />
      </Box>
    </PageWrapper>
  )
}
