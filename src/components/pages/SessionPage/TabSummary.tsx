import * as React from 'react'

import {
  CrewShare,
  makeHumanIds,
  Session,
  SessionBreakdown,
  sessionReduce,
  SessionStateEnum,
  SessionUser,
  ShareAmtArr,
  ShareTypeEnum,
  User,
} from '@regolithco/common'
import {
  Box,
  Button,
  Collapse,
  Divider,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { fontFamilies } from '../../../theme'
import {
  ChevronRight,
  Description,
  ExpandMore,
  PriceCheck,
  Toll as TollIcon,
  PieChart as PieChartIcon,
  Percent,
} from '@mui/icons-material'
import { MValue, MValueFormat } from '../../fields/MValue'
import { UserAvatar } from '../../UserAvatar'
import { CountdownTimer } from '../../calculators/WorkOrderCalc/CountdownTimer'
import numeral from 'numeral'
import { ConfirmModal } from '../../modals/ConfirmModal'
import { SessionContext } from '../../../context/session.context'
import { grey } from '@mui/material/colors'

export interface TabSummaryProps {
  propA?: string
}

const crewShareTypeIcons: Record<ShareTypeEnum, React.ReactElement> = {
  [ShareTypeEnum.Amount]: <TollIcon sx={{ fontSize: '1em' }} />,
  [ShareTypeEnum.Percent]: <Percent sx={{ fontSize: '1em' }} />,
  [ShareTypeEnum.Share]: <PieChartIcon sx={{ fontSize: '1em' }} />,
}

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

type ConfirmModalState = {
  payerUser?: User
  payerUserSCName?: string
  payeeUser?: User
  payeeUserSCName?: string
  amt: number
  crewShares: CrewShare[]
}

export const TabSummary: React.FC<TabSummaryProps> = () => {
  const theme = useTheme()
  const { session, mySessionUser, mutating, markCrewSharePaid, openWorkOrderModal } = React.useContext(SessionContext)
  const isSessionActive = session?.state === SessionStateEnum.Active
  const styles = stylesThunk(theme, isSessionActive)
  const [payConfirm, setPayConfirm] = React.useState<ConfirmModalState | undefined>()
  const sessionSummary: SessionBreakdown = React.useMemo(
    () => sessionReduce(session?.workOrders?.items || []),
    [session]
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: '100%', ...styles.container }}>
      <Typography sx={styles.sectionTitle}>Session Stats</Typography>
      <List
        sx={{
          // Make every other row a different color
          '& .MuiListItem-container:nth-of-type(odd)': {
            background: '#00000044',
          },
        }}
      >
        <ListItem>
          <ListItemText primary="Gross earnings" />
          <ListItemSecondaryAction>
            <MValue
              value={sessionSummary.shareAmount}
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
              decimals={1}
              typoProps={{
                px: 2,
                fontSize: '1.1rem',
                lineHeight: '2rem',
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        {sessionSummary.lastFinishedOrder && sessionSummary.lastFinishedOrder > Date.now() && (
          <ListItem>
            <ListItemText primary="Last work order complete" />
            <ListItemSecondaryAction>
              <CountdownTimer
                endTime={sessionSummary.lastFinishedOrder}
                useMValue
                typoProps={{
                  sx: {
                    color: theme.palette.primary.light,
                  },
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </List>
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
      <ConfirmModal
        open={Boolean(payConfirm)}
        title="Mark Paid?"
        message={
          <>
            <Typography variant="body1" component="div" paragraph>
              Are you sure you want to mark all {payConfirm?.crewShares.length} shares to{' '}
              <strong>{payConfirm?.payeeUserSCName}</strong> as paid?
            </Typography>
            <Stack spacing={1} direction="row" alignItems="center">
              <Box sx={{ display: 'flex' }}>
                <UserAvatar user={payConfirm?.payeeUser as User} size="small" />
                <Typography sx={{ ...styles.username, px: 1, pt: 0.5, fontSize: '1.1rem' }}>
                  {payConfirm?.payeeUserSCName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex' }} />
              <MValue
                value={payConfirm?.amt}
                format={MValueFormat.currency}
                typoProps={{
                  px: 2,
                  fontSize: '1.1rem',
                  lineHeight: '2rem',
                }}
              />
            </Stack>
          </>
        }
        onClose={() => setPayConfirm(undefined)}
        cancelBtnText="No"
        confirmBtnText="Yes!"
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

interface OwingListProps {
  session?: Session
  sessionUser: SessionUser
  sessionSummary: SessionBreakdown
  mutating: boolean
  isPaid: boolean
  setPayConfirm?: (state: ConfirmModalState) => void
  openWorkOrderModal: (workOrderId: string) => void
}

const OwingList: React.FC<OwingListProps> = ({
  session,
  sessionUser,
  mutating,
  sessionSummary,
  isPaid,
  setPayConfirm,
  openWorkOrderModal,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme, session?.state === SessionStateEnum.Active)
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

  if (rowArr.length === 0) {
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
          backgroundColor: '#FFFFFF55',
        },
      }}
    >
      {rowArr.map(([payerSCName, payeeSCName, amt], idy) => {
        const payerUser = (session.activeMembers?.items || []).find(({ owner }) => owner?.scName === payerSCName)
        const payeeUser = (session.activeMembers?.items || []).find(({ owner }) => owner?.scName === payeeSCName)
        if (payerUser?.owner?.scName === payeeUser?.owner?.scName) return null

        const crewShares = (session.workOrders?.items || [])
          .filter(({ owner, sellerscName }) => {
            return (sellerscName || owner?.scName) === payerSCName
          })
          .reduce((acc, wo) => {
            const crewShare = (wo.crewShares || []).find((cs) => cs.scName === payeeSCName)
            if (crewShare) acc.push(crewShare)
            return acc
          }, [] as CrewShare[])
          .filter((cs) => cs.state === isPaid)

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
                <Stack direction="row" spacing={1}>
                  {isExpanded ? <ExpandMore /> : <ChevronRight />}
                  <UserAvatar user={payerUser?.owner as User} size="small" />
                  <Typography sx={styles.username}>{payerSCName}</Typography>
                  <Divider orientation="vertical" flexItem />
                  <Typography variant="overline">owes</Typography>
                  <Divider orientation="vertical" flexItem />
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
                        setPayConfirm &&
                          setPayConfirm({
                            payeeUser: payeeUser?.owner as User,
                            payeeUserSCName: payeeSCName,
                            payerUser: payerUser?.owner as User,
                            payerUserSCName: payerSCName,
                            amt,
                            crewShares,
                          })
                      }}
                      sx={{ opacity: payerSCName !== sessionUser.owner?.scName ? 0.1 : 1 }}
                      disabled={payerSCName !== sessionUser.owner?.scName}
                      startIcon={<PriceCheck />}
                      variant="contained"
                      color={mutating ? 'secondary' : 'success'}
                    >
                      Pay
                    </Button>
                  )}
                </Stack>
              </ListItemText>
            </ListItemButton>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit key={`woRows-${idy}`}>
              <Box sx={{ p: 2 }}>
                <TableContainer sx={{ border: '1px solid', borderRadius: 4 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Work Order</TableCell>
                        <TableCell>Share Type</TableCell>
                        <TableCell>Share</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Note</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {crewShares.map((cs, idx) => {
                        const hasNote = cs.note && cs.note.length > 0
                        const isMe = cs.scName === sessionUser.owner?.scName
                        let shareVal: React.ReactElement
                        switch (cs.shareType) {
                          case ShareTypeEnum.Amount:
                            shareVal = <MValue value={cs.share} format={MValueFormat.number} />
                            break
                          case ShareTypeEnum.Percent:
                            shareVal = <MValue value={cs.share} format={MValueFormat.percent} />
                            break
                          case ShareTypeEnum.Share:
                            shareVal = <MValue value={cs.share} format={MValueFormat.number} decimals={0} />
                            break
                          default:
                            shareVal = <MValue value={cs.share} format={MValueFormat.number} />
                            break
                        }
                        const workOrder = (session.workOrders?.items || []).find((wo) => wo.orderId === cs.orderId)
                        const { remainder, payoutSummary } = sessionSummary.orderBreakdowns[cs.orderId]
                        const finalPayout: ShareAmtArr = isMe
                          ? [
                              payoutSummary[cs.scName][0] + (remainder || 0),
                              payoutSummary[cs.scName][1] + (remainder || 0),
                              0,
                            ]
                          : payoutSummary[cs.scName]
                        return (
                          <TableRow
                            key={`wo-${idx}`}
                            onClick={() => openWorkOrderModal(cs.orderId)}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: '#FFFFFF33',
                              },
                            }}
                          >
                            <TableCell>
                              <Link>
                                {makeHumanIds(workOrder?.sellerscName || workOrder?.owner?.scName, cs.orderId)}
                              </Link>
                            </TableCell>
                            <Tooltip title={`Share type: ${cs.shareType}`}>
                              <TableCell>{crewShareTypeIcons[cs.shareType as ShareTypeEnum]}</TableCell>
                            </Tooltip>
                            <TableCell>{shareVal}</TableCell>
                            {isMe
                              ? formatPayout(finalPayout, false)
                              : formatPayout(finalPayout, Boolean(workOrder?.includeTransferFee))}
                            {hasNote ? (
                              <Tooltip title={`NOTE: ${cs.note}`}>
                                <TableCell>
                                  <Description color="primary" />
                                </TableCell>
                              </Tooltip>
                            ) : (
                              <TableCell></TableCell>
                            )}
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Collapse>
          </>
        )
      })}
    </List>
  )
}

const formatPayout = (shareArr: ShareAmtArr, includeTfr?: boolean): React.ReactNode => {
  const theme = useTheme()
  let tooltip = ''
  if (includeTfr) {
    tooltip = `= ${numeral(shareArr[0]).format('0,0')} payout - ${numeral(shareArr[0] - shareArr[1]).format(
      '0,0'
    )} transfer fee`
  } else {
    tooltip = `= ${numeral(shareArr[0]).format('0,0')} payout`
  }
  return (
    <Tooltip title={tooltip}>
      <TableCell align="right" sx={{ color: theme.palette.primary.light }}>
        <MValue
          value={shareArr[1]}
          format={MValueFormat.currency}
          typoProps={{
            color: shareArr[1] >= 0 ? theme.palette.primary.light : 'error',
          }}
        />
      </TableCell>
    </Tooltip>
  )
}
