import React, { useEffect, useState } from 'react'
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
  StoreChoice,
} from '@regolithco/common'
import { WorkOrderCalcProps } from '../WorkOrderCalc'
import { fontFamilies } from '../../../../theme'
import {
  CheckBox,
  CheckBoxOutlineBlank,
  ExpandMore,
  GroupAdd,
  GroupAddTwoTone,
  Help,
  Percent,
  PieChart,
  RestartAlt,
  Store,
  TableView,
  Toll,
} from '@mui/icons-material'
import { CrewShareTable } from '../../../fields/crewshare/CrewShareTable'
import { StoreChooserModal } from '../../../modals/StoreChooserModal'
import { StoreChooserListItem } from '../../../fields/StoreChooserListItem'
import { MValueFormat, MValueFormatter } from '../../../fields/MValue'
import { ExpenseTable } from '../../../fields/ExpenseTable'
import { Stack } from '@mui/system'
import { CompositeAddModal } from '../../../modals/CompositeAddModal'
import { ConfirmModal } from '../../../modals/ConfirmModal'
import { LookupsContext } from '../../../../context/lookupsContext'
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
  isShare,
  isCalculator,
  onChange,
  markCrewSharePaid,
  onDeleteCrewShare,
  userSuggest,
  templateJob,
  sx,
}) => {
  const theme = useTheme()
  const dataStore = React.useContext(LookupsContext)
  const [storeChooserOpen, setStoreChooserOpen] = useState<boolean>(false)
  const [compositeAddOpen, setCompositeAddOpen] = useState<boolean>(false)
  const [confirmPriceReset, setConfirmPriceReset] = useState<boolean>(false)
  const [storeChoices, setStoreChoices] = useState<StoreChoice[]>([])
  const [myStoreChoice, setMyStoreChoice] = useState<StoreChoice>()
  const [shareAmountInputVal, setShareAmountInputVal] = useState<number>(jsRound(workOrder.shareAmount || 0, 0))
  const useScrollerRef = React.useRef<HTMLDivElement>(null)
  const shipOrder = workOrder as ShipMiningOrder

  useEffect(() => {
    const calcMyStoreChoice = async () => {
      if (!dataStore.ready) return
      const storeChoices = await findAllStoreChoices(dataStore, summary.oreSummary, Boolean(shipOrder.isRefined))
      setStoreChoices(storeChoices)
      if (storeChoices.length === 0) {
        setMyStoreChoice(undefined)
      } else {
        setMyStoreChoice(storeChoices.find((sc) => sc.code === workOrder.sellStore) || storeChoices[0])
      }
    }
    calcMyStoreChoice()
  }, [summary.oreSummary, shipOrder.isRefined, workOrder.sellStore])

  const shareAmountIsSet = typeof workOrder.shareAmount !== 'undefined' && workOrder.shareAmount !== null

  // Update the share amount but only if the user has not already edited it
  useEffect(() => {
    if (!myStoreChoice) {
      if (!workOrder.shareAmount && shareAmountInputVal !== 0) {
        setShareAmountInputVal(0)
      }
      return
    }
    if (typeof workOrder.shareAmount === 'undefined' || workOrder.shareAmount === null) {
      setShareAmountInputVal(myStoreChoice.price)
    }
  }, [myStoreChoice, workOrder.shareAmount])

  if (!dataStore.ready) return <div>Loading lookups...</div>
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
        <CardContent
          id="workorder-expenses-shares-card"
          ref={useScrollerRef}
          sx={{
            flex: '1 1',
            overflowX: { md: 'hidden', sm: 'scroll' },
            overflowY: { md: 'scroll', lg: isCalculator ? 'visible' : 'scroll' },
          }}
        >
          {workOrder.orderType === ActivityEnum.ShipMining && !shipOrder.shareRefinedValue && (
            <Box
              sx={{
                border: `1px solid ${theme.palette.grey[500]}`,
                borderRadius: 3,
                mt: 0.5,
                mb: 2,
                p: 0.5,
                px: 1,
              }}
            >
              <Tooltip
                title={
                  <Box>
                    <Typography variant="overline" component="div">
                      Estimated Unrefined Value?
                    </Typography>
                    <Typography variant="caption">
                      When you <strong>deselect</strong> "Share Refined Value" your crew shares will be divided based on
                      the estimated price of what you "would" sell your unrefined ore for (even though you're refining
                      and selling at a TDD).
                    </Typography>
                  </Box>
                }
              >
                <Stack direction="row" spacing={1}>
                  <Typography variant="overline" sx={{ fontWeight: 'bold' }} color="GrayText">
                    Estimated Unrefined Value:
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Typography variant="overline" color="GrayText">
                    {MValueFormatter(summary.unrefinedValue, MValueFormat.currency)}
                  </Typography>
                </Stack>
              </Tooltip>
            </Box>
          )}
          {workOrder.orderType !== ActivityEnum.Other && (
            <>
              <Typography variant="overline" sx={{ fontWeight: 'bold' }} color="secondary">
                Sell Price Estimate:
              </Typography>
              <List dense>
                {storeChoices.length > 0 && myStoreChoice ? (
                  <StoreChooserListItem
                    onClick={() => isEditing && setStoreChooserOpen(true)}
                    ores={summary.oreSummary}
                    compact
                    disabled={!isEditing}
                    isSelected={isEditing}
                    cityStores={myStoreChoice}
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.stopPropagation()
                onChange({
                  ...workOrder,
                  isSold: true,
                })
              }
            }}
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
              } catch {
                //
              }
            }}
            InputProps={{
              endAdornment: (
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  sx={{
                    px: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                    }}
                  >
                    aUEC
                  </Typography>
                  {isEditing && (
                    <Tooltip title="Composite add">
                      <IconButton size="small" onClick={() => setCompositeAddOpen(true)}>
                        <TableView color="primary" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              ),
              startAdornment: !isShare && (
                <>
                  {!shareAmountIsSet && myStoreChoice ? (
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
                      <IconButton size="small" color="primary" disableFocusRipple disableRipple disableTouchRipple>
                        <Store fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    isEditing && (
                      <Tooltip title="Reset to store estimate">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation()
                            setConfirmPriceReset(true)
                          }}
                        >
                          <RestartAlt fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )
                  )}
                  {!isCalculator && (
                    <Chip
                      color={workOrder.isSold ? 'success' : 'error'}
                      label={workOrder.isSold ? 'SOLD' : 'UNSOLD'}
                      sx={{
                        opacity: isEditing ? 1 : 0.5,
                        cursor: isEditing ? 'pointer' : 'default',
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!isEditing) return
                        onChange({
                          ...workOrder,
                          isSold: !workOrder.isSold,
                        })
                      }}
                      icon={
                        !isEditing ? undefined : workOrder.isSold ? (
                          <CheckBox color="inherit" />
                        ) : (
                          <CheckBoxOutlineBlank color="inherit" />
                        )
                      }
                      size="small"
                    />
                  )}
                </>
              ),
            }}
            inputProps={{
              sx: {
                m: 0,
                p: 1,
                textAlign: isShare ? 'left' : 'right',
                pr: 4,
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
          {workOrder.orderType === ActivityEnum.ShipMining && !isShare && (
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
                {!isCalculator && userSuggest && (
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
                                }) as CrewShare
                            ),
                          ],
                        })
                      }}
                    >
                      All
                    </Button>
                  </Tooltip>
                )}
                {!isCalculator && userSuggest && (
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
                                }) as CrewShare
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
            isShare={isShare}
            scrollRef={useScrollerRef}
            allowPay={allowPay}
            templateJob={templateJob}
            onChange={onChange}
            markCrewSharePaid={markCrewSharePaid}
            onDeleteCrewShare={onDeleteCrewShare}
            workOrder={workOrder}
            summary={summary}
            userSuggest={userSuggest}
          />
          {!isShare && (
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
                      Example: If Susan has 2 shares and Bob has 1 share, Susan will get 2/3 of the remainder and Bob
                      will get 1/3 since there are 3 shares total.
                    </em>
                  </li>
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
        </CardContent>
      </Card>
      {compositeAddOpen && (
        <CompositeAddModal
          open
          startAmt={shareAmountInputVal}
          onConfirm={(newVal: number) => {
            setShareAmountInputVal(newVal)
            onChange({
              ...workOrder,
              isSold: true,
              shareAmount: newVal,
            })
            setCompositeAddOpen(false)
          }}
          onClose={() => setCompositeAddOpen(false)}
        />
      )}
      {confirmPriceReset && (
        <ConfirmModal
          open
          title="Reset to store estimate?"
          message={
            <Typography>
              Are you sure you want to reset your sell price to the store estimate? You will lose the manual price you
              entered.
            </Typography>
          }
          onClose={() => setConfirmPriceReset(false)}
          onConfirm={() => {
            setShareAmountInputVal(myStoreChoice?.price || 0)
            onChange({
              ...workOrder,
              shareAmount: null,
            })
            setConfirmPriceReset(false)
          }}
        />
      )}
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
