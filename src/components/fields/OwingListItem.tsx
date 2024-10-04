import * as React from 'react'

import {
  calculateWorkOrder,
  CrewShare,
  makeHumanIds,
  SessionUser,
  ShareAmtArr,
  ShareTypeEnum,
  smartDate,
  User,
  UserProfile,
  WorkOrder,
  WorkOrderSummary,
} from '@regolithco/common'
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Link,
  ListItemButton,
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
import log from 'loglevel'

import {
  ChevronRight,
  Description,
  ExpandMore,
  PriceCheck,
  Toll as TollIcon,
  PieChart as PieChartIcon,
  Percent,
  OpenInNew,
} from '@mui/icons-material'
import numeral from 'numeral'
import { fontFamilies } from '../../theme'
import { UserAvatar } from '../UserAvatar'
import { MValue, MValueFormat } from './MValue'
import { AppContext } from '../../context/app.context'
import { LookupsContext } from '../../context/lookupsContext'

const crewShareTypeIcons: Record<ShareTypeEnum, React.ReactElement> = {
  [ShareTypeEnum.Amount]: <TollIcon sx={{ fontSize: '1em' }} />,
  [ShareTypeEnum.Percent]: <Percent sx={{ fontSize: '1em' }} />,
  [ShareTypeEnum.Share]: <PieChartIcon sx={{ fontSize: '1em' }} />,
}

const styles: Record<string, SxProps<Theme>> = {
  username: {
    fontSize: '1rem',
    lineHeight: 2,
    fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
  },
}

export type ConfirmModalState = {
  payerUser?: User | UserProfile
  payerUserSCName?: string
  payeeUser?: User | UserProfile
  payeeUserSCName?: string
  amt: number
  crewShares: CrewShare[]
}

export interface OwingListItemProps {
  payerSCName: string
  payeeSCName: string
  payerUser?: SessionUser | User | UserProfile
  payeeUser?: SessionUser | User | UserProfile
  meUser?: SessionUser | User | UserProfile
  workOrders: WorkOrder[]
  amt: number
  mutating?: boolean
  isPaid?: boolean
  isShare?: boolean
  crossSession?: boolean
  setPayConfirm?: (state: ConfirmModalState) => void
  onRowClick?: (sessionId: string, orderId: string) => void
}

export const OwingListItem: React.FC<OwingListItemProps> = ({
  payerSCName,
  payeeSCName,
  payerUser,
  payeeUser,
  meUser,
  workOrders,
  amt,
  mutating,
  isPaid,
  isShare,
  crossSession,
  setPayConfirm,
  onRowClick,
}) => {
  const theme = useTheme()
  const [isExpanded, setIsExpanded] = React.useState(false)
  const dataStore = React.useContext(LookupsContext)
  const [workOrderCalcs, setWorkOrderCalcs] = React.useState<WorkOrderSummary[] | null>(null)
  const { hideNames, getSafeName } = React.useContext(AppContext)

  React.useEffect(() => {
    if (!dataStore || dataStore.loading) return
    const doCalc = async () => {
      const calcs = await Promise.all(
        workOrders.map(async (wo) => {
          const breakdown = await calculateWorkOrder(dataStore, wo)
          return breakdown
        })
      )
      setWorkOrderCalcs(calcs)
    }
    doCalc()
  }, [workOrders, dataStore])

  if (payerSCName === payeeSCName) return null

  const crewShares = workOrders
    .filter(({ owner, sellerscName }) => {
      return (sellerscName || owner?.scName) === payerSCName
    })
    .reduce((acc, wo) => {
      const crewShare = (wo.crewShares || []).find((cs) => cs.payeeScName === payeeSCName)
      if (crewShare) acc.push(crewShare)
      return acc
    }, [] as CrewShare[])
    .filter((cs) => cs.state === isPaid)

  const uniqueWorkOrders = crewShares.reduce((acc, { orderId }) => {
    if (!acc.includes(orderId)) acc.push(orderId)
    return acc
  }, [] as string[]).length
  const uniqueSessions = crewShares.reduce((acc, { sessionId }) => {
    if (!acc.includes(sessionId)) acc.push(sessionId)
    return acc
  }, [] as string[]).length

  const normalizedPayee = (payeeUser as SessionUser)?.owner || (payeeUser as User)
  const normalizedPayer = (payerUser as SessionUser)?.owner || (payerUser as User)
  const normalizedMeUSer = (meUser as SessionUser)?.owner || (meUser as User)

  return (
    <Box>
      <ListItemButton key={'row-button'} onClick={isShare ? undefined : () => setIsExpanded((prev) => !prev)}>
        <ListItemText>
          <Stack direction="row" spacing={1}>
            {isExpanded && !isShare && <ExpandMore />}
            {!isExpanded && !isShare && <ChevronRight />}
            <Stack direction="row" spacing={1} sx={{ flex: '1 1 40%' }}>
              <UserAvatar user={normalizedPayer} size="small" privacy={hideNames} />
              <Typography sx={styles.username}>{getSafeName(payerSCName)}</Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="overline">{isPaid ? 'paid' : 'owes'}</Typography>
              <Divider orientation="vertical" flexItem />
              <UserAvatar user={normalizedPayee} size="small" privacy={hideNames} />
              <Typography sx={styles.username}>{getSafeName(payeeSCName)}</Typography>
            </Stack>
            <Typography variant="overline">
              for <span style={{ color: theme.palette.primary.main }}>{uniqueWorkOrders}</span> work order(s)
              {(uniqueSessions > 1 || crossSession) && (
                <span>
                  {' '}
                  in <span style={{ color: theme.palette.primary.main }}>{uniqueSessions}</span> session(s)
                </span>
              )}
            </Typography>
            <MValue
              value={amt}
              format={MValueFormat.currency}
              typoProps={{
                px: 2,
                flex: '1 1 20%',
                textAlign: 'right',
                fontSize: '1.1rem',
                lineHeight: '2rem',
              }}
            />
            {!isPaid && !isShare && (
              <Button
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  setPayConfirm &&
                    setPayConfirm({
                      payeeUser: normalizedPayee,
                      payeeUserSCName: payeeSCName,
                      payerUser: normalizedPayer,
                      payerUserSCName: payerSCName,
                      amt,
                      crewShares,
                    })
                }}
                sx={{ opacity: payerSCName !== normalizedMeUSer?.scName ? 0.1 : 1 }}
                disabled={payerSCName !== normalizedMeUSer?.scName || mutating}
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
      <Collapse in={isExpanded} key={'row-collapse'} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2, px: 4 }}>
          <TableContainer
            sx={{
              border: `2px solid ${theme.palette.primary.dark}`,
              borderRadius: 4,
            }}
          >
            <Table size="small">
              <TableHead
                sx={{
                  '& .MuiTableCell-root': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                }}
              >
                <TableRow>
                  {crossSession && <TableCell>Date</TableCell>}
                  {crossSession && <TableCell>Session</TableCell>}
                  <TableCell>Work Order</TableCell>
                  <TableCell> </TableCell>
                  <TableCell>Share</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {crewShares.map((cs, idx) => {
                  const hasNote = cs.note && cs.note.length > 0
                  const isMe = cs.payeeScName === normalizedMeUSer?.scName
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
                  const workOrderIdx = workOrders.findIndex((wo) => wo.orderId === cs.orderId)
                  if (workOrderIdx < 0) return null
                  const workOrder = workOrders[workOrderIdx]
                  if (!workOrderCalcs || !workOrderCalcs[idx]) return null

                  const { remainder, payoutSummary } = workOrderCalcs[workOrderIdx]
                  const finalPayout: ShareAmtArr = isMe
                    ? [
                        payoutSummary[cs.payeeScName][0] + (remainder || 0),
                        payoutSummary[cs.payeeScName][1] + (remainder || 0),
                        0,
                      ]
                    : payoutSummary[cs.payeeScName] || [0, 0, 0]
                  log.debug('finalPayout', { workOrders, workOrderCalcs, finalPayout })
                  return (
                    <TableRow
                      key={`wo-${idx}`}
                      onClick={() => onRowClick && onRowClick(cs.sessionId, cs.orderId)}
                      sx={{
                        cursor: onRowClick ? 'pointer' : 'default',
                        '&:hover': {
                          backgroundColor: onRowClick ? '#FFFFFF33' : 'transparent',
                        },
                      }}
                    >
                      {crossSession && (
                        <TableCell
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {smartDate(workOrder.createdAt)}
                        </TableCell>
                      )}
                      {crossSession && (
                        <TableCell
                          sx={{
                            maxWidth: '300px',
                          }}
                        >
                          <Stack
                            direction={'row'}
                            spacing={1}
                            alignItems={'center'}
                            sx={{
                              overflow: 'hidden',
                            }}
                          >
                            <Tooltip title="Open this session in a new tab" placement="top">
                              <IconButton color="primary" href={`/session/${workOrder.sessionId}/dash`} target="_blank">
                                <OpenInNew />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title={`Go to session: ${workOrder.session?.name || workOrder.sessionId}`}
                              placement="top"
                            >
                              <Link
                                href={`/session/${workOrder.sessionId}/dash`}
                                sx={{
                                  flex: '1 1 80%',
                                  fontFamily: fontFamilies.robotoMono,
                                  fontWeight: 'bold',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                <Typography>{workOrder.session?.name || workOrder.sessionId}</Typography>
                              </Link>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      )}
                      <TableCell
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {crossSession && (
                          <Tooltip title="Open this work order in a new tab" placement="top">
                            <IconButton
                              color="primary"
                              href={`/session/${workOrder.sessionId}/dash/w/${workOrder.orderId}`}
                              target="_blank"
                            >
                              <OpenInNew />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip
                          title={`Go to work order: ${workOrder.session?.name || workOrder.sessionId}`}
                          placement="top"
                        >
                          <Link href={`/session/${workOrder.sessionId}/dash/w/${workOrder.orderId}`}>
                            {makeHumanIds(getSafeName(workOrder?.sellerscName || workOrder?.owner?.scName), cs.orderId)}
                          </Link>
                        </Tooltip>
                      </TableCell>
                      <Tooltip title={`Share type: ${cs.shareType}`}>
                        <TableCell>{crewShareTypeIcons[cs.shareType as ShareTypeEnum]}</TableCell>
                      </Tooltip>
                      <TableCell>{shareVal}</TableCell>
                      {isMe
                        ? formatPayout(theme, finalPayout, false)
                        : formatPayout(theme, finalPayout, Boolean(workOrder?.includeTransferFee))}
                      {hasNote ? (
                        <Tooltip
                          title={
                            <Box
                              sx={{
                                p: 4,
                              }}
                            >
                              <Typography component={'div'} variant="overline" sx={{}}>
                                Crew Share Note:
                              </Typography>
                              <Typography component={'div'} sx={{}}>
                                {cs.note}
                              </Typography>
                            </Box>
                          }
                          placement="top-end"
                          arrow
                        >
                          <TableCell>
                            <Description color="info" />
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
    </Box>
  )
}

const formatPayout = (theme: Theme, shareArr: ShareAmtArr, includeTfr?: boolean): React.ReactNode => {
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
