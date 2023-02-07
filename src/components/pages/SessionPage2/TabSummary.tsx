import * as React from 'react'

import {
  CrewShare,
  makeHumanIds,
  Session,
  SessionBreakdown,
  sessionReduce,
  SessionUser,
  User,
} from '@regolithco/common'
import {
  Box,
  Button,
  Collapse,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from '@mui/material'
import { DialogEnum } from './SessionPage.container'
import { fontFamilies } from '../../../theme'
import { ArrowCircleRight, ChevronRight, ExpandMore, PriceCheck } from '@mui/icons-material'
import { MValue, MValueFormat } from '../../fields/MValue'
import { UserAvatar } from '../../UserAvatar'
import { CountdownTimer } from '../../calculators/WorkOrderCalc/CountdownTimer'

export interface TabSummaryProps {
  session: Session
  sessionUser: SessionUser
  setActiveModal: (modal: DialogEnum) => void
  openWorkOrderModal: (workOrderId?: string) => void
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
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
    px: 2,
    py: 2,
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
    p: 1,
    fontSize: '1rem',
    lineHeight: 2,
    fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
    background: '#121115aa',
    borderBottom: '1px solid',
  },
  sectionBody: {
    py: 1,
    pl: 2,
    pr: 1,
    mb: 2,
  },
})

export const TabSummary: React.FC<TabSummaryProps> = ({ session, sessionUser, setActiveModal, openWorkOrderModal }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)

  const sessionSummary: SessionBreakdown = React.useMemo(
    () => sessionReduce(session.workOrders?.items || []),
    [session]
  )

  console.log(sessionSummary)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: '100%', ...styles.container }}>
      <Typography sx={styles.sectionTitle}>Session Stats</Typography>
      <List
        sx={{
          // Make every other row a different color
          '& .MuiListItem-root:nth-of-type(odd)': {
            background: '#00000022',
          },
        }}
      >
        <ListItem>
          <ListItemText primary="Gross earnings" />
          <ListItemSecondaryAction>
            <MValue
              value={sessionSummary.grossProfit}
              format={MValueFormat.currency}
              typoProps={{
                px: 2,
                fontSize: '1.1rem',
                lineHeight: '2rem',
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary="Raw ore collected" />
          <ListItemSecondaryAction>
            <MValue
              value={sessionSummary.rawOreCollected / 100}
              format={MValueFormat.volSCU}
              typoProps={{
                px: 2,
                fontSize: '1.1rem',
                lineHeight: '2rem',
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary="Last work order complete" />
          <ListItemSecondaryAction>
            {sessionSummary.lastFinishedOrder && sessionSummary.lastFinishedOrder > Date.now() ? (
              <CountdownTimer
                endTime={sessionSummary.lastFinishedOrder}
                useMValue
                typoProps={{
                  sx: {
                    color: theme.palette.primary.light,
                  },
                }}
              />
            ) : (
              <MValue value={sessionSummary.lastFinishedOrder} format={MValueFormat.dateTime} />
            )}
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      {/* Unpaid Crew Shares */}
      <Typography sx={styles.sectionTitle}>Unpaid</Typography>
      <OwingList
        isPaid={false}
        openWorkOrderModal={openWorkOrderModal}
        session={session}
        sessionSummary={sessionSummary}
        sessionUser={sessionUser}
      />

      {/* Paid Crew Shares */}
      <Typography sx={styles.sectionTitle}>Paid</Typography>
      <OwingList
        isPaid={true}
        openWorkOrderModal={openWorkOrderModal}
        session={session}
        sessionSummary={sessionSummary}
        sessionUser={sessionUser}
      />
    </Box>
  )
}

interface OwingListProps {
  session: Session
  sessionUser: SessionUser
  sessionSummary: SessionBreakdown
  isPaid: boolean
  openWorkOrderModal: (workOrderId?: string) => void
}

const OwingList: React.FC<OwingListProps> = ({ session, sessionUser, sessionSummary, isPaid, openWorkOrderModal }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({})
  const rowObj = isPaid ? sessionSummary.paid : sessionSummary.owed
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
    if (a[0] === sessionUser.owner?.scName) return -1
    if (b[0] === sessionUser.owner?.scName) return 1
    // Else do alphabetical locale
    return a[0].localeCompare(b[0])
  })

  return (
    <List
      sx={{
        // Make every other row a different color
        '& .MuiListItemButton-root:nth-of-type(odd)': {
          backgroundColor: '#00000033',
        },
        '& .MuiListItemButton-root:hover': {
          backgroundColor: '#FFFFFF55',
        },
      }}
    >
      {rowArr.map(([payerSCName, payeeSCName, amt], idy) => {
        const payerUser = (session.activeMembers?.items || []).find(({ owner }) => owner?.scName === payerSCName)
        const payeeUser = (session.activeMembers?.items || []).find(({ owner }) => owner?.scName === payeeSCName)

        const crewShares = (session.workOrders?.items || [])
          .filter(({ owner }) => owner?.scName === payerSCName)
          .reduce((acc, wo) => {
            const crewShare = (wo.crewShares || []).find((cs) => cs.scName === payeeSCName)
            if (crewShare) acc.push(crewShare)
            return acc
          }, [] as CrewShare[])

        // if (!owedRow) return null
        const rowKey = `owed-${idy}`
        const isExpanded = Boolean(expandedRows[rowKey])
        return (
          <>
            <ListItemButton
              key={rowKey}
              onClick={() => {
                setExpandedRows({
                  ...expandedRows,
                  [rowKey]: !isExpanded,
                })
              }}
            >
              <ListItemText>
                <Stack direction="row" spacing={3}>
                  {isExpanded ? <ExpandMore /> : <ChevronRight />}
                  <UserAvatar user={payerUser?.owner as User} size="small" />
                  <Typography sx={styles.username}>{payerSCName}</Typography>
                  <ArrowCircleRight />
                  <UserAvatar user={payeeUser?.owner as User} size="small" />
                  <Typography sx={styles.username}>{payeeSCName}</Typography>
                  <div style={{ flexGrow: 1 }} />
                  <MValue
                    value={amt}
                    format={MValueFormat.currency}
                    typoProps={{
                      px: 2,
                      fontSize: '1.1rem',
                      lineHeight: '2rem',
                    }}
                  />
                  {!isPaid && (
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        console.log('Mark as paid')
                      }}
                      disabled={payerSCName !== sessionUser.owner?.scName}
                      startIcon={<PriceCheck />}
                      variant="contained"
                      color="success"
                    >
                      Mark as Paid
                    </Button>
                  )}
                </Stack>
              </ListItemText>
            </ListItemButton>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit key={`woRows-${idy}`}>
              <List component="div" disablePadding>
                {crewShares.map((cs, idx) => (
                  <ListItem key={`wo-${idx}`} sx={{ pl: 4 }}>
                    <ListItemText>
                      <Stack direction="row" spacing={1}>
                        <Link onClick={() => openWorkOrderModal(cs.orderId)}>
                          {makeHumanIds(payerSCName, cs.orderId)}
                        </Link>
                        <Typography>{cs.share}</Typography>
                        <Typography>{cs.shareType}</Typography>
                        <Typography>{cs.note}</Typography>
                      </Stack>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )
      })}
    </List>
  )
}
