import * as React from 'react'

import { Alert, AlertTitle, List, Typography, useTheme } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { fontFamilies } from '../../../theme'
import { DashboardProps } from './Dashboard'
import { CrewShare, WorkOrder } from '@regolithco/common'
import log from 'loglevel'
import { OwingListItem } from '../../fields/OwingListItem'

type WorkOrderLookup = Record<string, Record<string, WorkOrder>>

export const TabCrewShares: React.FC<DashboardProps> = ({
  userProfile,
  mySessions,
  workOrderSummaries,
  fetchMoreSessions,
  markCrewSharesPaid,
  joinedSessions,
  allLoaded,
  loading,
  navigate,
}) => {
  const theme = useTheme()
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
      // Any share where the payer is not also the payee
      return (
        workOrderSummaries[cs.sessionId][cs.orderId].sellerScName !== cs.payeeScName &&
        // Any share where the payer or the payee is me
        (cs.payeeScName === userProfile.scName ||
          workOrderSummaries[cs.sessionId][cs.orderId].sellerScName === userProfile.scName)
      )
    })
    myCrewShares.sort((a, b) => a[0].createdAt - b[0].createdAt)

    return { relevantCrewShares }
  }, [mySessions, joinedSessions])

  // Now let's make a more refined version of the crewShares
  const { iOweShares, oweMeShares } = React.useMemo(() => {
    // Filter to only unpaid shares
    const unpaidShares = relevantCrewShares.filter((cs) => !cs[0].state)
    const iOweShares: Record<string, { amt: number; shares: [CrewShare, number][]; workOrders: WorkOrder[] }> = {}
    const oweMeShares: Record<string, { amt: number; shares: [CrewShare, number][]; workOrders: WorkOrder[] }> = {}

    unpaidShares.forEach((csArr) => {
      const cs = csArr[0]
      const wo = workOrderLookups[cs.sessionId][cs.orderId]
      const foundSession = [...mySessions, ...joinedSessions].find((s) => s.sessionId === cs.sessionId)
      if (foundSession) {
        const { workOrders, ...rest } = foundSession
        wo.session = rest
      }

      if (
        cs.payeeScName === userProfile.scName &&
        workOrderSummaries[cs.sessionId][cs.orderId].sellerScName !== userProfile.scName
      ) {
        if (cs.payeeScName === userProfile.scName) return
        if (!oweMeShares[cs.payeeScName]) oweMeShares[cs.payeeScName] = { amt: 0, shares: [], workOrders: [] }
        oweMeShares[cs.payeeScName].shares.push(csArr)
        oweMeShares[cs.payeeScName].workOrders.push(wo)
        oweMeShares[cs.payeeScName].amt += csArr[1]
      } else if (
        cs.payeeScName !== userProfile.scName &&
        workOrderSummaries[cs.sessionId][cs.orderId].sellerScName === userProfile.scName
      ) {
        if (!iOweShares[cs.payeeScName]) iOweShares[cs.payeeScName] = { amt: 0, shares: [], workOrders: [] }
        iOweShares[cs.payeeScName].shares.push(csArr)
        iOweShares[cs.payeeScName].workOrders.push(wo)
        iOweShares[cs.payeeScName].amt += csArr[1]
      }
    })

    return {
      iOweShares,
      oweMeShares,
    }
  }, [relevantCrewShares, workOrderSummaries])

  log.debug('crewShares', { relevantCrewShares, iOweShares, oweMeShares })

  return (
    <>
      <Stack
        spacing={2}
        sx={{ my: 2, borderBottom: `2px solid ${theme.palette.secondary.dark}` }}
        direction={{ xs: 'column', sm: 'row' }}
      >
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            color: 'secondary.dark',
            fontFamily: fontFamilies.robotoMono,
            fontWeight: 'bold',
          }}
        >
          My Crew Shares
        </Typography>
      </Stack>
      <Stack spacing={2} sx={{ my: 2 }} direction={{ xs: 'column', sm: 'row' }}>
        <Alert elevation={6} variant="outlined" severity="info" sx={{ my: 2, flex: '1 1 50%' }}>
          <AlertTitle>Work orders from all your sessions</AlertTitle>
          <Typography>
            All work orders inside all your joined sessions that you either own or have been marked as the seller.
          </Typography>
        </Alert>
      </Stack>
      <Box
        sx={{
          p: 3,
          pb: 5,
          my: 5,
          borderRadius: 7,
          // backgroundColor: '#282828',
          display: 'flex',
          flexDirection: 'column',
          border: `5px solid ${theme.palette.primary.main}`,
        }}
      >
        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          sx={{
            fontFamily: fontFamilies.robotoMono,
            fontWeight: 'bold',
            color: theme.palette.secondary.dark,
          }}
        >
          Unpaid Crew Shares
        </Typography>
        <Box>
          <Typography variant="h5" component="h3" gutterBottom>
            You Owe:
          </Typography>
          <Box>
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
                    amt={amt}
                    workOrders={workOrders}
                    isPaid={false}
                    meUser={userProfile}
                    mutating={loading}
                    crossSession
                    payeeUser={payeeUser}
                    onRowClick={(sessionId, orderId) => {
                      const url = `/session/${sessionId}/dash/w/${orderId}`
                      window.open(url, '_blank')
                    }}
                    isShare={false}
                    setPayConfirm={() => {
                      markCrewSharesPaid(shares.map(([cs]) => cs))
                    }}
                  />
                )
              })}
            </List>
          </Box>
        </Box>
        <Box>
          <Typography variant="h5" component="h3" gutterBottom>
            Owed to You:
          </Typography>
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
                    onRowClick={(sessionId, orderId) => {
                      const url = `/session/${sessionId}/dash/w/${orderId}`
                      window.open(url, '_blank')
                    }}
                    isShare={false}
                    setPayConfirm={() => {
                      markCrewSharesPaid(shares.map(([cs]) => cs))
                    }}
                  />
                )
              })}
            </List>
            {/* <SimpleTreeView>
            {Object.entries(oweMeShares).map(([scName, { amt, shares }]) => {
              const uniqueSessions = Array.from(new Set(shares.map(([cs]) => cs.sessionId))).length
              const uniqueOrderIds = Array.from(new Set(shares.map(([cs]) => cs.orderId))).length
              return (
                <TreeItem
                  itemId={`iOwer_${scName}`}
                  label={
                    <Typography variant="body1">
                      {scName} owes you {MValueFormatter(amt, 'currency')} from {uniqueOrderIds} orders in{' '}
                      {uniqueSessions} sessions
                    </Typography>
                  }
                >
                  {shares.map(([cs, amt]) => (
                    <TreeItem
                      itemId={`${cs.sessionId}_${cs.orderId}_${cs.payeeScName}`}
                      label={
                        <Typography variant="body1">
                          {cs.payeeScName} owes you {MValueFormatter(amt, 'currency')}
                        </Typography>
                      }
                    />
                  ))}
                </TreeItem>
              )
            })}
          </SimpleTreeView> */}
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography variant="h5" component="h3" gutterBottom>
          All Crew Shares:
        </Typography>
      </Box>
    </>
  )
}
