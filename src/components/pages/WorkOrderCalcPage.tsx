import * as React from 'react'
import { Alert, Box, Link, Stack, Typography, useTheme } from '@mui/material'
import { PageWrapper } from '../PageWrapper'

import { UserSuggest, ActivityEnum, UserProfile, WorkOrder } from '@regolithco/common'
import { WorkOrderCalc } from '../calculators/WorkOrderCalc'
import { WorkOrderTypeChooser } from '../fields/WorkOrderTypeChooser'
import { dummySession, dummyUserProfile, newWorkOrderMaker } from '../../lib/newObjectFactories'
import { useLogin } from '../../hooks/useOAuth2'

export interface WorkOrderCalcPageProps {
  userProfile?: UserProfile
}

export const WorkOrderCalcPage: React.FC<WorkOrderCalcPageProps> = ({ userProfile }) => {
  const theme = useTheme()

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
    <PageWrapper title="Work Order Calculator" maxWidth="lg" sx={{}}>
      <Typography variant="h4" component="h1" gutterBottom></Typography>
      <Typography variant="body1" paragraph>
        This is where you can calculate the cost of a work order and how to share it between members of your
        org/party/crew.
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          [theme.breakpoints.up('md')]: {
            m: { md: 2, sm: 0, xs: 0 },
          },
        }}
      >
        <Box
          sx={{
            [theme.breakpoints.up('md')]: {
              mx: 3,
              flex: '1 1 50%',
            },
          }}
        >
          <WorkOrderTypeChooser onChange={setActiveActivity} value={activeActivity} />
        </Box>
      </Stack>
      <Box
        sx={{
          display: 'flex',
          minHeight: 700,
          overflowX: 'hidden',
          overflowY: 'visible',
        }}
      >
        <WorkOrderCalc
          allowEdit
          isEditing
          allowPay
          isCalculator
          isMine
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
                crewShares: (activeWorkOrder.crewShares || [])?.filter((share) => share.payeeScName !== scName),
              },
            }
            setWorkOrders(newWorkOrders)
          }}
          markCrewSharePaid={(crewShare, paid) => {
            if (!activeWorkOrder) return
            const newWorkOrders = {
              ...(workOrders ? workOrders : {}),
              [activeActivity]: {
                ...activeWorkOrder,
                crewShares: (activeWorkOrder.crewShares || [])?.map((share) => {
                  if (share.payeeScName === crewShare.payeeScName) return { ...share, state: paid }
                  return share
                }),
              },
            }
            setWorkOrders(newWorkOrders)
          }}
        />
      </Box>
      <Alert severity="info" sx={{ m: 2, flex: '1 1 50%', [theme.breakpoints.down('sm')]: { display: 'none' } }}>
        NOTE: This is a standalone calculator. If you want to work on more than one order, store consecutive orders or
        share your work orders with friends then consider logging in and creating/joining a <strong>session</strong>{' '}
        from the <Link href="/dashboard">dashboard</Link>. Work orders inside Sessions can be captured automatically
        from the game or by uploading screenshots using OCR.
      </Alert>
    </PageWrapper>
  )
}

export const WorkOrderCalcPageContainer: React.FC = () => {
  const { userProfile } = useLogin()

  return <WorkOrderCalcPage userProfile={userProfile} />
}
