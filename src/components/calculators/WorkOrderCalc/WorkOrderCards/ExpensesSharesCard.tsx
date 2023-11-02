import React, { useEffect, useMemo, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Box,
  Chip,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  IconButton,
  Tooltip,
  ListItem,
  ListItemText,
  Button,
  Link,
} from '@mui/material'
import Numeral from 'numeral'
import {
  ActivityEnum,
  ShipMiningOrder,
  WorkOrderSummary,
  findAllStoreChoices,
  jsRound,
  CrewShare,
  ShareTypeEnum,
} from '@regolithco/common'
import { WorkOrderCalcProps } from '../WorkOrderCalc'
import { fontFamilies } from '../../../../theme'
import {
  ExpandMore,
  GroupAdd,
  GroupAddTwoTone,
  Help,
  Percent,
  PieChart,
  RestartAlt,
  Store,
  Toll,
} from '@mui/icons-material'
import { CrewShareTable } from '../../../fields/crewshare/CrewShareTable'
import { StoreChooserModal } from '../../../modals/StoreChooserModal'
import { StoreChooserListItem } from '../../../fields/StoreChooserListItem'
import { MValueFormat, MValueFormatter } from '../../../fields/MValue'
import { ExpenseTable } from '../../../fields/ExpenseTable'
import { Stack } from '@mui/system'
// import log from 'loglevel'

export type ExpensesSharesCardProps = WorkOrderCalcProps & {
  summary: WorkOrderSummary
}

export const ExpensesSharesCard: React.FC<ExpensesSharesCardProps> = ({
  workOrder,
  summary,
  allowEdit,
  allowPay,
  isEditing,
  onChange,
  markCrewSharePaid,
  onDeleteCrewShare,
  userSuggest,
  templateJob,
  sx,
}) => {
  const theme = useTheme()
  const [storeChooserOpen, setStoreChooserOpen] = useState<boolean>(false)
  const [shareAmountInputVal, setShareAmountInputVal] = useState<number>(jsRound(workOrder.shareAmount || 0, 0))

  const shipOrder = workOrder as ShipMiningOrder

  const expenses: { name: string; value: number }[] = []

  const storeChoices = useMemo(
    () => findAllStoreChoices(summary.oreSummary, Boolean(shipOrder.isRefined)),
    [summary.oreSummary]
  )
  const myStoreChoice = useMemo(
    () => storeChoices.find((sc) => sc.code === workOrder.sellStore) || storeChoices[0],
    [storeChoices]
  )

  if (workOrder.includeTransferFee) {
    expenses.push({
      name: 'moTRADER',
      value: (summary?.transferFees as number) > -1 ? -1 * ((summary.transferFees as number) || 0) : 0,
    })
  }
  const shareAmountIsSet = typeof workOrder.shareAmount !== 'undefined' && workOrder.shareAmount !== null
  // Update the share amount but only if the user has not already edited it
  useEffect(() => {
    if (!myStoreChoice) return
    if (typeof workOrder.shareAmount === 'undefined' || workOrder.shareAmount === null) {
      setShareAmountInputVal(myStoreChoice.price)
    }
  }, [myStoreChoice, workOrder.shareAmount])

  return (
    <>
      <Card sx={sx}>
        <CardHeader
          sx={{
            flex: '0 0',
            padding: 1.5,
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.secondary.light,
          }}
          title={
            <Box
              sx={{
                display: 'flex',
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
                fontSize: {
                  xs: '0.8rem',
                  md: '0.9rem',
                  lg: '1rem',
                },
                lineHeight: 1,
              }}
            >
              Shares
            </Box>
          }
          subheaderTypographyProps={{ color: 'iherit' }}
        />
        <CardContent sx={{ flex: '1 1', overflowX: { md: 'hidden', sm: 'scroll' }, overflow: { md: 'scroll' } }}>
          {workOrder.orderType !== ActivityEnum.Other && (
            <>
              <Typography variant="overline" sx={{ fontWeight: 'bold' }} color="secondary">
                Sell Price Estimate:
              </Typography>
              <List dense>
                {storeChoices.length > 0 ? (
                  <StoreChooserListItem
                    onClick={() => isEditing && setStoreChooserOpen(true)}
                    ores={summary.oreSummary}
                    compact
                    disabled={!isEditing}
                    isSelected={isEditing}
                    storeChoice={myStoreChoice}
                    isMax={!workOrder.sellStore}
                    priceColor={theme.palette.success.main}
                  />
                ) : (
                  <ListItem>
                    <ListItemText primary="No stores found" />
                  </ListItem>
                )}
              </List>
            </>
          )}

          {workOrder.orderType === ActivityEnum.Other ? (
            <Typography variant="overline" sx={{ fontWeight: 'bold' }} color="secondary">
              Share Amount <em>(Gross profit)</em>:
            </Typography>
          ) : (
            <Typography variant="overline" sx={{ fontWeight: 'bold' }} color="secondary">
              Final Sell Price <em>(Gross profit)</em>:
            </Typography>
          )}
          {isEditing && workOrder.orderType === ActivityEnum.Other && (
            <Typography variant="caption" component="div">
              Type in the aUEC amount you want to share
            </Typography>
          )}
          <TextField
            fullWidth
            autoFocus
            disabled={!allowEdit || !isEditing}
            value={Numeral(shareAmountInputVal).format(`0,0`)}
            // onKeyDown={(event) => {}}
            onChange={(e) => {
              try {
                const value = jsRound(parseInt(e.target.value.replace(/[^\d]/g, '').replace(/^0+/, ''), 10), 0)

                if (value >= 0) {
                  setShareAmountInputVal(value)
                  onChange({
                    ...workOrder,
                    shareAmount: value,
                  })
                } else {
                  setShareAmountInputVal(0)
                  onChange({
                    ...workOrder,
                    shareAmount: 0,
                  })
                }
              } catch (e) {
                //
              }
            }}
            InputProps={{
              endAdornment: (
                <Box
                  sx={{
                    fontSize: 12,
                    px: 0.5,
                  }}
                >
                  aUEC
                </Box>
              ),
              startAdornment:
                !shareAmountIsSet && myStoreChoice ? (
                  <Tooltip
                    title={
                      <Box sx={{ px: 0.5 }}>
                        <Typography paragraph>
                          This price comes from the store estimate above: {myStoreChoice.name_short} =
                          {MValueFormatter(myStoreChoice.price, MValueFormat.currency)}
                        </Typography>
                        <Typography paragraph>
                          You can either keep this estimate or change it to the actual sell price when you make your
                          delivery run.
                        </Typography>
                      </Box>
                    }
                  >
                    <Store color="primary" />
                  </Tooltip>
                ) : (
                  isEditing && (
                    <Tooltip title="Reset to store estimate">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          onChange({
                            ...workOrder,
                            shareAmount: undefined,
                          })
                        }}
                      >
                        <RestartAlt fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )
                ),
            }}
            inputProps={{
              sx: {
                m: 0,
                p: 1,
                textAlign: 'right',
                fontFamily: fontFamilies.robotoMono,
                fontSize: 16,
              },
            }}
            type="text"
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 3,
                mt: 0.5,
                mb: 2,
                p: 0.5,
              },
              m: 0,
              p: 0,
            }}
          />

          <Typography variant="overline" sx={{ fontWeight: 'bold' }} color="secondary" component="div">
            Expenses:
          </Typography>
          {workOrder.orderType === ActivityEnum.ShipMining && (
            <Typography
              variant="caption"
              sx={{ fontSize: 10, textAlign: 'center' }}
              color="error"
              component="div"
              paragraph
            >
              NOTE: Refinery fees must be entered manually until{' '}
              <Link href="http://regolith.rocks/about/release-notes" target="_blank" sx={{ color: 'red' }}>
                further notice
              </Link>
              .
            </Typography>
          )}
          <ExpenseTable workOrder={workOrder} summary={summary} isEditing={isEditing} onChange={onChange} />

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Typography variant="overline" sx={{ fontWeight: 'bold' }} color="secondary">
              Crew Shares:
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            {isEditing && (
              <>
                {userSuggest && (
                  <Tooltip title="Add ALL session users">
                    <Button
                      size="small"
                      color="primary"
                      startIcon={<GroupAddTwoTone />}
                      onClick={() => {
                        const newShares: string[] = Object.entries(userSuggest)
                          .reduce((acc, [scName, { named, session }]) => {
                            if (named || session) {
                              acc.push(scName)
                            }
                            return acc
                          }, [] as string[])
                          .filter((scName) => {
                            return !workOrder.crewShares?.find((cs) => cs.scName === scName)
                          })

                        // Make sure we have something to add
                        if (newShares.length === 0) return
                        onChange({
                          ...workOrder,
                          crewShares: [
                            ...(workOrder.crewShares || []),
                            ...newShares.map(
                              (scName) =>
                                ({
                                  scName,
                                  shareType: ShareTypeEnum.Share,
                                  share: 1,
                                  note: null,
                                  createdAt: Date.now(),
                                  orderId: workOrder.orderId,
                                  sessionId: workOrder.sessionId,
                                  updatedAt: Date.now(),
                                  state: false,
                                  __typename: 'CrewShare',
                                } as CrewShare)
                            ),
                          ],
                        })
                      }}
                    >
                      All
                    </Button>
                  </Tooltip>
                )}
                {userSuggest && (
                  <Tooltip title="Add ALL Crew users">
                    <Button
                      size="small"
                      color="secondary"
                      startIcon={<GroupAdd />}
                      onClick={() => {
                        const newShares: string[] = Object.entries(userSuggest)
                          .reduce((acc, [scName, { crew }]) => {
                            if (crew) {
                              acc.push(scName)
                            }
                            return acc
                          }, [] as string[])
                          .filter((scName) => {
                            return !workOrder.crewShares?.find((cs) => cs.scName === scName)
                          })

                        // Make sure we have something to add
                        if (newShares.length === 0) return
                        onChange({
                          ...workOrder,
                          crewShares: [
                            ...(workOrder.crewShares || []),
                            ...newShares.map(
                              (scName) =>
                                ({
                                  scName,
                                  shareType: ShareTypeEnum.Share,
                                  share: 1,
                                  note: null,
                                  createdAt: Date.now(),
                                  orderId: workOrder.orderId,
                                  sessionId: workOrder.sessionId,
                                  updatedAt: Date.now(),
                                  state: false,
                                  __typename: 'CrewShare',
                                } as CrewShare)
                            ),
                          ],
                        })
                      }}
                    >
                      Crew
                    </Button>
                  </Tooltip>
                )}
                <Tooltip title="Clear all crew shares (except owner)">
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      const ownerSCName = workOrder.sellerscName ? workOrder.sellerscName : workOrder.owner?.scName
                      onChange({
                        ...workOrder,
                        crewShares: workOrder.crewShares?.filter((cs) => cs.scName === ownerSCName) || [],
                      })
                    }}
                  >
                    Clear
                  </Button>
                </Tooltip>
              </>
            )}
          </Stack>
          {/* The actual control for the crew shares */}
          <CrewShareTable
            allowEdit={allowEdit}
            isEditing={isEditing}
            allowPay={allowPay}
            templateJob={templateJob}
            onChange={onChange}
            markCrewSharePaid={markCrewSharePaid}
            onDeleteCrewShare={onDeleteCrewShare}
            workOrder={workOrder}
            summary={summary}
            userSuggest={userSuggest}
          />

          <Accordion sx={{ mt: 3 }} disableGutters>
            <AccordionSummary color="info" expandIcon={<ExpandMore color="inherit" />}>
              <Help sx={{ mr: 2 }} color="inherit" /> About Shares
            </AccordionSummary>
            <AccordionDetails>
              <Typography component="div" variant="overline">
                Notes
              </Typography>
              <Typography variant="caption" component="ul">
                <li>Users are not verified. Any valid Star Citizen username will work.</li>
                <li>Any remaining money is assigned back to the owner.</li>
                <li>The owner pays no transfer fee (obviously).</li>
              </Typography>

              <Typography component="div" variant="overline">
                Share Types
              </Typography>
              <Typography variant="caption" component="ul" sx={{ listStyle: 'none', pl: 0.5 }}>
                <li>
                  <Chip icon={<Toll />} label="Flat Rate" color="default" size="small" sx={{ mr: 1 }} />
                  User gets a flat rate of the total payouts. moTransfer fees are not deducted from these.
                  <br />
                  Good for:
                  <ul>
                    <li>Fixed price security contracts</li>
                    <li>Finder's fees</li>
                    <li>
                      Paying Ransoms.
                      <em>"Hey, a dangerous verse is no excuse for an unbalanced ledger."</em>
                    </li>
                  </ul>
                </li>
                <li>
                  <Chip icon={<Percent />} label="Percentage" color="default" size="small" sx={{ mr: 1 }} />
                  User gets a percentage of the total payouts after the flat rates have been deducted.
                </li>
                <li>
                  <Chip icon={<PieChart />} label="Equal Share" color="default" size="small" sx={{ mr: 1 }} />
                  After the flat rates and percentages have been deducted. Whatever is left is divided up. The number
                  corresponds to the number of "shares" a user has.
                  <br />
                  <br />
                  <em>
                    Example: If Susan has 2 shares and Bob has 1 share, Susan will get 2/3 of the remainder and Bob will
                    get 1/3 since there are 3 shares total.
                  </em>
                </li>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
      <StoreChooserModal
        open={storeChooserOpen}
        onClose={() => setStoreChooserOpen(false)}
        ores={summary.oreSummary}
        initStore={workOrder.sellStore as string}
        isRefined={shipOrder.isRefined || false}
        onSubmit={(store) => {
          onChange({
            ...workOrder,
            sellStore: store,
          })
          setStoreChooserOpen(false)
        }}
      />
    </>
  )
}
