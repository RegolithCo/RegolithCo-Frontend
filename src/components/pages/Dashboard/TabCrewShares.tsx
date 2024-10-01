import * as React from 'react'

import { Alert, AlertTitle, Card, CardContent, List, Typography, useTheme } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { fontFamilies } from '../../../theme'
import { DashboardProps } from './Dashboard'
import { CrewShare, WorkOrder } from '@regolithco/common'
import log from 'loglevel'
import { OwingListItem } from '../../fields/OwingListItem'
import { FetchMoreWithDate } from './FetchMoreSessionLoader'

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
    <Box>
      {/* <Stack
        spacing={2}
        sx={{ my: 2, mb: 4, borderBottom: `4px solid ${theme.palette.secondary.dark}` }}
        direction={{ xs: 'column', sm: 'row' }}
      >
        <Typography
          variant="h3"
          component="h3"
          gutterBottom
          sx={{
            color: 'secondary.dark',
            fontFamily: fontFamilies.robotoMono,
            fontWeight: 'bold',
          }}
        >
          Unpaid Crew Shares
        </Typography>
      </Stack> */}
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
        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          sx={{
            px: 3,
            py: 2,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontFamily: fontFamilies.robotoMono,
            fontWeight: 'bold',
          }}
        >
          Unpaid Crew Shares
        </Typography>
        <CardContent>
          <Box>
            <Typography
              variant="h5"
              component="h5"
              gutterBottom
              sx={{
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
                color: theme.palette.secondary.dark,
              }}
            >
              You owe:
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
            <Typography
              variant="h5"
              component="h5"
              gutterBottom
              sx={{
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
                color: theme.palette.secondary.dark,
              }}
            >
              You are owed:
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
            </Box>
          </Box>
        </CardContent>
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
