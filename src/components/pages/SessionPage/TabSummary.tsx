import * as React from 'react'

import { Session, SessionBreakdown, sessionReduce, SessionStateEnum, SessionUser } from '@regolithco/common'
import { Box, List, SxProps, Theme, Typography, useTheme } from '@mui/material'
import { fontFamilies } from '../../../theme'
import { SessionContext } from '../../../context/session.context'
import { grey } from '@mui/material/colors'
import { TabSummaryStats } from './TabSummaryStats'
// import { AppContext } from '../../../context/app.context'
import { LookupsContext } from '../../../context/lookupsContext'
import { ConfirmModalState, OwingListItem } from '../../fields/OwingListItem'
import { PayConfirmModal } from '../../modals/PayConfirmModal'
import { TabScoutingSummary } from './TabScoutingSummary'
import { TabRefinedOreSummary } from './TabRefinedOreSummary'

export interface TabSummaryProps {
  propA?: string
}

// const crewShareTypeIcons: Record<ShareTypeEnum, React.ReactElement> = {
//   [ShareTypeEnum.Amount]: <TollIcon sx={{ fontSize: '1em' }} />,
//   [ShareTypeEnum.Percent]: <Percent sx={{ fontSize: '1em' }} />,
//   [ShareTypeEnum.Share]: <PieChartIcon sx={{ fontSize: '1em' }} />,
// }

const stylesThunk = (theme: Theme, isActive: boolean): Record<string, SxProps<Theme>> => ({
  gridContainer: {
    [theme.breakpoints.up('md')]: {},
  },
  username: {
    fontSize: '1rem',
    lineHeight: 2,
    fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: '#0e0c1baa',
    position: 'relative',
    '& .MuiAccordion-root': {
      backgroundColor: '#0e0c1baa',
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
    px: 2,
    py: 0.65,
    background: '#121115aa',
    backgroundColor: isActive ? theme.palette.primary.main : grey[600],
    color: theme.palette.primary.contrastText,
    fontSize: '1.2rem',
    lineHeight: 2,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
      lineHeight: 1,
    },
    fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
  },
  sectionBody: {
    py: 1,
    pl: 2,
    pr: 1,
    mb: 2,
  },
})

export const TabSummary: React.FC<TabSummaryProps> = () => {
  const theme = useTheme()
  const [sessionSummary, setSessionSummary] = React.useState<SessionBreakdown>()

  // const { hideNames, getSafeName } = React.useContext(AppContext)
  const { session, mySessionUser, mutating, markCrewSharePaid, openWorkOrderModal } = React.useContext(SessionContext)
  const isSessionActive = session?.state === SessionStateEnum.Active
  const styles = stylesThunk(theme, isSessionActive)
  const [payConfirm, setPayConfirm] = React.useState<ConfirmModalState | undefined>()

  const dataStore = React.useContext(LookupsContext)

  React.useEffect(() => {
    if (!dataStore.ready || !session?.workOrders?.items) return
    sessionReduce(dataStore, session?.workOrders?.items || []).then((res) => {
      setSessionSummary(res)
    })
  }, [dataStore.ready, session?.workOrders?.items])

  if (!dataStore.ready || !sessionSummary) return null
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: '100%', ...styles.container }}>
      <Typography sx={styles.sectionTitle}>Session Stats</Typography>
      <TabSummaryStats session={session as Session} />
      <Box sx={{ mb: 2 }} />

      {/* Unpaid Crew Shares */}
      <Typography sx={styles.sectionTitle}>Unpaid Crew Shares</Typography>
      <OwingList
        isPaid={false}
        mutating={mutating}
        setPayConfirm={setPayConfirm}
        openWorkOrderModal={openWorkOrderModal}
        session={session}
        sessionSummary={sessionSummary}
        sessionUser={mySessionUser}
      />
      <Box sx={{ mb: 2 }} />

      {/* Paid Crew Shares */}
      <Typography sx={styles.sectionTitle}>Paid Crew Shares</Typography>
      <OwingList
        isPaid={true}
        mutating={mutating}
        openWorkOrderModal={openWorkOrderModal}
        session={session}
        sessionSummary={sessionSummary}
        sessionUser={mySessionUser}
      />
      <Box sx={{ mb: 2 }} />

      <Typography sx={styles.sectionTitle}>Ore Summary</Typography>
      <TabRefinedOreSummary session={session as Session} />

      <Typography sx={styles.sectionTitle}>Scouting Summary</Typography>
      <TabScoutingSummary session={session as Session} />

      <PayConfirmModal
        payConfirm={payConfirm}
        onClose={() => setPayConfirm(undefined)}
        onConfirm={() => {
          if (payConfirm) {
            payConfirm.crewShares.forEach((cs) => markCrewSharePaid && markCrewSharePaid(cs, true))
          }
          setPayConfirm(undefined)
        }}
      />
    </Box>
  )
}

export interface OwingListProps {
  session?: Session
  sessionUser?: SessionUser
  sessionSummary: SessionBreakdown
  mutating?: boolean
  isPaid?: boolean
  isShare?: boolean
  setPayConfirm?: (state: ConfirmModalState) => void
  openWorkOrderModal?: (workOrderId: string) => void
}

export const OwingList: React.FC<OwingListProps> = ({
  session,
  sessionUser,
  mutating,
  sessionSummary,
  isPaid,
  isShare,
  setPayConfirm,
  openWorkOrderModal,
}) => {
  const rowObj = isShare
    ? {
        ...sessionSummary.paid,
        ...sessionSummary.owed,
      }
    : isPaid
      ? sessionSummary.paid
      : sessionSummary.owed
  const rowArr: [string, string, number][] = Object.entries(rowObj).reduce<[string, string, number][]>(
    (acc, [payerSCName, payeeObj]) => {
      Object.entries(payeeObj).forEach(([payeeSCName, amt]) => {
        acc.push([payerSCName, payeeSCName, amt])
      })
      return acc
    },
    []
  )

  // sort rowArr by pushing sessionUser.owner.sCN to the front and then alphabetically
  rowArr.sort((a, b) => {
    if (sessionUser && a[0] === sessionUser.owner?.scName) return -1
    if (sessionUser && b[0] === sessionUser.owner?.scName) return 1
    // Else do alphabetical locale
    return a[0].localeCompare(b[0])
  })

  if (!isShare && rowArr.length === 0) {
    return (
      <Typography variant="body1" component="div" sx={{ px: 2, py: 1 }}>
        No {isPaid ? 'paid' : 'unpaid'} crew shares
      </Typography>
    )
  }
  if (!session) return null
  return (
    <List
      sx={{
        // Make every other row a different color
        '& .MuiListItemButton-root:nth-of-type(odd)': {
          backgroundColor: '#00000033',
        },
        '& .MuiListItemButton-root:hover': {
          backgroundColor: !isShare ? '#FFFFFF55' : undefined,
        },
      }}
    >
      {rowArr.map(([payerSCName, payeeSCName, amt], idy) => {
        const payerUser = (session.activeMembers?.items || []).find(({ owner }) => owner?.scName === payerSCName)
        const payeeUser = (session.activeMembers?.items || []).find(({ owner }) => owner?.scName === payeeSCName)
        // if (!payerUser || !payeeUser) return null

        if (payerSCName === payeeSCName) return null

        // if (!owedRow) return null
        const rowKey = `owed-${payerSCName}-${payeeSCName}-${idy}`

        return (
          <OwingListItem
            key={rowKey}
            {...{
              payerSCName,
              payeeSCName,
              payerUser,
              payeeUser,
              amt,
              workOrders: session.workOrders?.items || [],
              meUser: sessionUser,
              isPaid,
              isShare,
              setPayConfirm,
              mutating,
              onRowClick: () => openWorkOrderModal && openWorkOrderModal(rowKey),
            }}
          />
        )
      })}
    </List>
  )
}
