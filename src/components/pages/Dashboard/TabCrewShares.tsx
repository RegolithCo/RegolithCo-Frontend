import * as React from 'react'

import { Alert, AlertTitle, Card, CircularProgress, List, Typography, useTheme } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { fontFamilies } from '../../../theme'
import { DashboardProps } from './Dashboard'
import { CrewShare, WorkOrder } from '@regolithco/common'
import { ConfirmModalState, OwingListItem } from '../../fields/OwingListItem'
import { FetchMoreWithDate } from './FetchMoreSessionLoader'
import { PayConfirmModal } from '../../modals/PayConfirmModal'
import { MValue, MValueFormat } from '../../fields/MValue'

export type WorkOrderLookup = Record<string, Record<string, WorkOrder>>

export const TabCrewShares: React.FC<DashboardProps> = ({
  userProfile,
  mySessions,
  paginationDate,
  workOrderSummaries,
  fetchMoreSessions,
  markCrewSharesPaid,
  joinedSessions,
  allLoaded,
  loading,
  navigate,
}) => {
  const theme = useTheme()
  const [payConfirmState, setPayConfirmModal] = React.useState<ConfirmModalState | undefined>()

  // This is unfiltered. We shouldn't use these directly
  const { relevantCrewShares } = React.useMemo(() => {
    const myCrewShares = [...joinedSessions, ...mySessions].reduce(
      (acc, session) => {
        // NOTE: We need to filter out crewshares that don't involve us
        return acc.concat(
          (session.workOrders?.items || []).reduce(
            (acc, wo) => {
              try {
                const csSumm = workOrderSummaries[wo.sessionId][wo.orderId].crewShareSummary || []
                const csReturns = (wo.crewShares || []).map<[CrewShare, number]>((cs, idcs) => {
                  const amts = csSumm[idcs] || [0, 0, 0]
                  const amt = wo.includeTransferFee ? amts[1] : amts[0]
                  return [cs, amt]
                })
                return acc.concat(csReturns)
              } catch (e) {
                return acc
              }
            },
            [] as [CrewShare, number][]
          )
        )
      },
      [] as [CrewShare, number][]
    )

    const relevantCrewShares = myCrewShares.filter((csArr) => {
      const cs = csArr[0]
      const amt = csArr[1]
      if (amt <= 0) return false
      // Any share where the payer is not also the payee
      const sellerScName = workOrderSummaries[cs.sessionId][cs.orderId].sellerScName
      // Any share where the payer IS the payee is considered paid
      if (!sellerScName || sellerScName === cs.payeeScName) return false
      if (sellerScName === userProfile.scName || cs.payeeScName === userProfile.scName) return true
      return false
    })
    myCrewShares.sort((a, b) => a[0].createdAt - b[0].createdAt)

    return { relevantCrewShares }
  }, [mySessions, joinedSessions, workOrderSummaries])

  // Now let's make a more refined version of the crewShares
  const { iOweShares, oweMeShares } = React.useMemo(() => {
    // Filter to only unpaid shares
    const unpaidShares = relevantCrewShares.filter((cs) => !cs[0].state)
    const iOweShares: Record<string, { amt: number; shares: [CrewShare, number][]; workOrders: WorkOrder[] }> = {}
    const oweMeShares: Record<string, { amt: number; shares: [CrewShare, number][]; workOrders: WorkOrder[] }> = {}

    const workOrderLookups = [...mySessions, ...joinedSessions].reduce((acc, session) => {
      acc[session.sessionId] = (session.workOrders?.items || []).reduce(
        (acc, wo) => {
          acc[wo.orderId] = wo
          return acc
        },
        {} as Record<string, WorkOrder>
      )
      return acc
    }, {} as WorkOrderLookup)

    unpaidShares.forEach((csArr) => {
      const cs = csArr[0]
      const amt = csArr[1]
      const foundWo = workOrderLookups[cs.sessionId][cs.orderId]
      if (!foundWo) return
      const wo = { ...foundWo }
      const foundSession = [...mySessions, ...joinedSessions].find((s) => s.sessionId === cs.sessionId)
      if (foundSession) {
        const { workOrders, ...rest } = foundSession
        wo.session = rest
      }
      const sellerName = workOrderSummaries[cs.sessionId][cs.orderId].sellerScName

      if (cs.payeeScName === userProfile.scName && sellerName !== userProfile.scName) {
        if (!oweMeShares[sellerName]) oweMeShares[sellerName] = { amt: 0, shares: [], workOrders: [] }
        oweMeShares[sellerName].shares.push(csArr)
        oweMeShares[sellerName].workOrders.push(wo)
        oweMeShares[sellerName].amt += amt
      } else if (
        cs.payeeScName !== userProfile.scName &&
        workOrderSummaries[cs.sessionId][cs.orderId].sellerScName === userProfile.scName
      ) {
        if (!iOweShares[cs.payeeScName]) iOweShares[cs.payeeScName] = { amt: 0, shares: [], workOrders: [] }
        iOweShares[cs.payeeScName].shares.push(csArr)
        iOweShares[cs.payeeScName].workOrders.push(wo)
        iOweShares[cs.payeeScName].amt += amt
      }
    })

    return {
      iOweShares,
      oweMeShares,
    }
  }, [relevantCrewShares, workOrderSummaries])

  return (
    <Box>
      <Card
        elevation={6}
        sx={{
          // p: 3,
          // pb: 2,
          mb: 5,
          borderRadius: 7,
          // backgroundColor: '#282828',
          display: 'flex',
          flexDirection: 'column',
          border: `8px solid ${theme.palette.primary.main}`,
        }}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{
            px: 3,
            py: 2,
            backgroundColor: theme.palette.primary.main,
          }}
        >
          <Typography
            variant="h4"
            component="h3"
            sx={{
              color: theme.palette.primary.contrastText,
              fontFamily: fontFamilies.robotoMono,
              fontWeight: 'bold',
            }}
          >
            Unpaid Crew Shares
          </Typography>

          {loading && (
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <CircularProgress color="error" size={24} />
              <Typography variant="overline" sx={{ color: theme.palette.primary.contrastText }}>
                Loading...
              </Typography>
            </Stack>
          )}
        </Stack>

        <Box>
          <Box>
            <Stack
              direction="row"
              spacing={2}
              alignItems={'center'}
              justifyContent={'space-between'}
              sx={{
                px: 3,
                py: 2,
                background: theme.palette.secondary.main,
                '& *': {
                  color: theme.palette.secondary.contrastText,
                  fontFamily: fontFamilies.robotoMono,
                  fontWeight: 'bold',
                },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: theme.palette.secondary.contrastText,
                  fontFamily: fontFamilies.robotoMono,
                  fontWeight: 'bold',
                }}
              >
                You owe:
              </Typography>
              <MValue
                typoProps={{
                  variant: 'h5',
                  sx: {
                    color: theme.palette.secondary.contrastText,
                    fontFamily: fontFamilies.robotoMono,
                    fontWeight: 'bold',
                  },
                }}
                value={Object.values(iOweShares).reduce((acc, { amt }) => acc + amt, 0)}
                format={MValueFormat.currency}
              />
            </Stack>
            <Box sx={{ mb: 3 }}>
              <List>
                {Object.keys(iOweShares).length === 0 && (
                  <Alert severity="info">
                    <AlertTitle>No Crew Shares</AlertTitle>
                    You don't owe any crew shares to anyone.
                  </Alert>
                )}
                {Object.entries(iOweShares).map(([scName, { amt, shares, workOrders }]) => {
                  // Find the first user in any session that has the same scName
                  const payeeUser = [...mySessions, ...joinedSessions]
                    .flatMap(({ activeMembers }) => activeMembers?.items || [])
                    .find((u) => u.owner?.scName === scName)
                  return (
                    <OwingListItem
                      payeeSCName={scName}
                      payerSCName={userProfile.scName}
                      payerUser={userProfile}
                      payeeUser={payeeUser}
                      amt={amt}
                      workOrders={workOrders}
                      isPaid={false}
                      meUser={userProfile}
                      mutating={loading}
                      crossSession
                      isShare={false}
                      setPayConfirm={(state) => setPayConfirmModal(state)}
                    />
                  )
                })}
              </List>
            </Box>
          </Box>
          <Box>
            <Stack
              direction="row"
              spacing={2}
              alignItems={'center'}
              justifyContent={'space-between'}
              sx={{
                px: 3,
                py: 2,
                background: theme.palette.secondary.main,
                '& *': {
                  color: theme.palette.secondary.contrastText,
                  fontFamily: fontFamilies.robotoMono,
                  fontWeight: 'bold',
                },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: theme.palette.secondary.contrastText,
                  fontFamily: fontFamilies.robotoMono,
                  fontWeight: 'bold',
                }}
              >
                You are owed:
              </Typography>
              <MValue
                typoProps={{
                  variant: 'h5',
                  sx: {
                    color: theme.palette.secondary.contrastText,
                    fontFamily: fontFamilies.robotoMono,
                    fontWeight: 'bold',
                  },
                }}
                value={Object.values(oweMeShares).reduce((acc, { amt }) => acc + amt, 0)}
                format={MValueFormat.currency}
              />
            </Stack>
            <Box>
              <List>
                {Object.keys(oweMeShares).length === 0 && (
                  <Alert severity="info">
                    <AlertTitle>No Crew Shares</AlertTitle>
                    You don't owe any crew shares to anyone.
                  </Alert>
                )}
                {Object.entries(oweMeShares).map(([scName, { amt, shares, workOrders }]) => {
                  // Find the first user in any session that has the same scName
                  const payerUser = [...mySessions, ...joinedSessions]
                    .flatMap(({ activeMembers }) => activeMembers?.items || [])
                    .find((u) => u.owner?.scName === scName)
                  return (
                    <OwingListItem
                      payeeSCName={userProfile.scName}
                      payerSCName={scName}
                      payerUser={userProfile}
                      amt={amt}
                      workOrders={workOrders}
                      isPaid={false}
                      meUser={userProfile}
                      mutating={loading}
                      crossSession
                      payeeUser={payerUser}
                      isShare={false}
                    />
                  )
                })}
              </List>
            </Box>
          </Box>
          <PayConfirmModal
            payConfirm={payConfirmState}
            onClose={() => setPayConfirmModal(undefined)}
            onConfirm={() => {
              if (payConfirmState) {
                markCrewSharesPaid(payConfirmState.crewShares)
              }
              setPayConfirmModal(undefined)
            }}
          />
        </Box>
        <FetchMoreWithDate
          sx={{
            background: theme.palette.background.default,
            borderTop: `3px solid ${theme.palette.primary.main}`,
            textAlign: 'right',
            p: 2,
            mt: 1,
          }}
          loading={loading}
          allLoaded={allLoaded}
          fetchMoreSessions={fetchMoreSessions}
          paginationDate={paginationDate}
        />
      </Card>
      <Alert elevation={1} variant="standard" severity="info" sx={{ my: 2, flex: 1 }}>
        <AlertTitle>Unpaid crew shares from all your workorders and sessions</AlertTitle>
        <Typography>
          This is a list of all the crew shares that are owed to you or that you owe to others. You can click on the
          work order to see more details.
        </Typography>
      </Alert>
    </Box>
  )
}
