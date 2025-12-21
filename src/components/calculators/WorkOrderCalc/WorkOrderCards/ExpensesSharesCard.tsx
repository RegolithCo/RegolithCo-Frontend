import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Box,
  Stack,
  Chip,
  useTheme,
  IconButton,
  Tooltip,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material'
import Numeral from 'numeral'
import {
  ActivityEnum,
  ShipMiningOrder,
  WorkOrderSummary,
  findAllStoreChoices,
  jsRound,
  StoreChoice,
  calculateWorkOrder,
  WorkOrder,
  WorkOrderExpense,
  ShareTypeEnum,
} from '@regolithco/common'
import { WorkOrderCalcProps } from '../WorkOrderCalc'
import { fontFamilies } from '../../../../theme'
import {
  AddCircle,
  Cancel,
  CheckBox,
  CheckBoxOutlineBlank,
  Help,
  Info,
  RestartAlt,
  Store,
  TableView,
} from '@mui/icons-material'
import { CrewShareTable } from '../../../fields/crewshare/CrewShareTable'
import { StoreChooserModal } from '../../../modals/StoreChooserModal'
import { StoreChooserListItem } from '../../../fields/StoreChooserListItem'
import { MValueFormat, MValueFormatter } from '../../../fields/MValue'
import { ExpenseTable } from '../../../fields/ExpenseTable'
import { CompositeAddModal } from '../../../modals/CompositeAddModal'
import { ConfirmModal } from '../../../modals/ConfirmModal'
import { LookupsContext } from '../../../../context/lookupsContext'
import { ExpenseCardHelpModal } from './ExpenseCardHelpModal'
import { SellerPicker } from '../../../fields/SellerPicker'
import { UEXHelpDialog } from './UEXHelpModal'
import { DeleteModal } from '../../../modals/DeleteModal'

// import log from 'loglevel'
const MAXIMUM_EXPENSES = 20

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
  isMine,
  isNew,
  onChange,
  markCrewSharePaid,
  onDeleteCrewShare,
  userSuggest,
  templateJob,
  sx,
}) => {
  const theme = useTheme()
  const dataStore = React.useContext(LookupsContext)
  const [clearConfirmOpen, setClearConfirmOpen] = React.useState<boolean>(false)

  const [helpDialogOpen, setHelpDialogOpen] = React.useState<boolean>(false)
  const [UEXHelpDialogOpen, setUEXHelpDialogOpen] = React.useState<boolean>(false)

  const isShareRefinedValueLocked = (templateJob?.lockedFields || [])?.includes('shareRefinedValue')

  const [storeChooserOpen, setStoreChooserOpen] = useState<boolean>(false)
  const [compositeAddOpen, setCompositeAddOpen] = useState<boolean>(false)
  const [confirmPriceReset, setConfirmPriceReset] = useState<boolean>(false)
  const [storeChoices, setStoreChoices] = useState<StoreChoice[]>([])
  const [myStoreChoice, setMyStoreChoice] = useState<StoreChoice>()
  const [finalSummary, setFinalSummary] = useState<WorkOrderSummary>(summary)
  const [shareAmountInputVal, setShareAmountInputVal] = useState<number>(
    jsRound(Number(workOrder.shareAmount || 0n), 0)
  )
  const useScrollerRef = React.useRef<HTMLDivElement>({} as HTMLDivElement)
  const shipOrder = workOrder as ShipMiningOrder

  const isIncludeTransferFeeLocked = (templateJob?.lockedFields || [])?.includes('includeTransferFee')

  useEffect(() => {
    const calcMyStoreChoice = async () => {
      if (!dataStore.ready) return
      const storeChoices = await findAllStoreChoices(
        dataStore,
        summary.oreSummary,
        Boolean(shipOrder.isRefined),
        workOrder.orderType === ActivityEnum.ShipMining
      )
      setStoreChoices(storeChoices)
      if (storeChoices.length === 0) {
        setMyStoreChoice(undefined)
      } else {
        const store = storeChoices.find((sc) => sc.code === workOrder.sellStore) || storeChoices[0]
        setMyStoreChoice(store)
      }
    }
    calcMyStoreChoice()
  }, [summary.oreSummary, shipOrder.isRefined, workOrder.sellStore])

  useEffect(() => {
    if (!dataStore.ready) return
    const calcNewSummary = async () => {
      // If there's no sell store then just use the first summary
      if (!myStoreChoice) setFinalSummary(summary)
      // Otherwise we need to recalculate for the store otherwise we end up with a max price
      // That's too high for the highest store we're selling to
      const tempWorkOrder: WorkOrder = { ...workOrder, sellStore: myStoreChoice?.code }
      const newSummary = await calculateWorkOrder(dataStore, tempWorkOrder)
      setFinalSummary(newSummary)
    }
    calcNewSummary()
  }, [workOrder, myStoreChoice, summary])

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
      // We need to sync this back to the work order so it can be saved
      onChange({ ...workOrder, shareAmount: BigInt(myStoreChoice.price) })
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
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography
                sx={{
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
                Selling & Profit Sharing
              </Typography>

              <IconButton onClick={() => setHelpDialogOpen(true)} size="small" sx={{ ml: 'auto' }} color="inherit">
                <Help />
              </IconButton>
            </Stack>
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
          {workOrder.orderType !== ActivityEnum.Other && (
            <Box sx={{ position: 'relative' }}>
              <IconButton
                size="small"
                color="info"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  setUEXHelpDialogOpen(true)
                }}
                sx={{
                  zIndex: 1000,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                }}
              >
                <Info />
              </IconButton>
              <Button
                disabled={!isEditing || storeChoices.length === 0 || !myStoreChoice}
                fullWidth
                component={Box}
                color="info"
                variant={isEditing ? 'outlined' : 'text'}
                onClick={() => isEditing && setStoreChooserOpen(true)}
                sx={{
                  borderWidth: 3,
                  '&:hover': {
                    borderWidth: 3,
                  },
                  display: 'flex',
                  textAlign: 'left',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="overline" sx={{ fontWeight: 'bold' }} color="secondary" component={'div'}>
                  Market Price (UEX):
                </Typography>
                <Stack direction={'row'} spacing={1} alignItems="center">
                  {storeChoices.length > 0 && myStoreChoice ? (
                    <StoreChooserListItem
                      onClick={() => isEditing && setStoreChooserOpen(true)}
                      ores={summary.oreSummary}
                      textOnly
                      disabled={!isEditing}
                      isSelected={isEditing}
                      cityStores={myStoreChoice}
                      isMax={!workOrder.sellStore}
                      priceColor={theme.palette.success.main}
                    />
                  ) : (
                    <Typography variant="overline" sx={{ fontWeight: 'bold' }} color="default">
                      No Stores Found
                    </Typography>
                  )}
                </Stack>
              </Button>
            </Box>
          )}

          <Tooltip
            placement="right"
            title={
              <>
                <Typography variant="overline" gutterBottom>
                  Seller
                </Typography>
                <Typography variant="body1" gutterBottom>
                  This is whoever is selling the assets. This is the person who is responsible for payouts.
                </Typography>
              </>
            }
          >
            <SellerPicker
              disabled={!allowEdit || !isEditing}
              value={workOrder.sellerscName || (workOrder.owner?.scName as string)}
              onChange={(addName) => {
                if (!addName || addName.toLowerCase() === workOrder.sellerscName?.toLowerCase()) return
                const isOwner = addName.toLowerCase() === workOrder.owner?.scName.toLowerCase()
                const newOrder: WorkOrder = {
                  ...workOrder,
                  sellerscName: isOwner ? null : addName,
                }
                if (!workOrder.crewShares?.find((cs) => cs.payeeScName === addName)) {
                  // if it's not there then add them as a crew share
                  newOrder.crewShares = [
                    ...(workOrder.crewShares || []),
                    {
                      sessionId: workOrder.sessionId,
                      orderId: workOrder.orderId,
                      payeeScName: addName,
                      shareType: ShareTypeEnum.Share,
                      share: 1,
                      note: null,
                      createdAt: Date.now(),
                      updatedAt: Date.now(),
                      state: true,
                      __typename: 'CrewShare',
                    },
                  ]
                }
                onChange(newOrder)
              }}
              userSuggest={userSuggest}
              includeFriends
              includeMentioned
            />
          </Tooltip>

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
            value={Numeral(Number(shareAmountInputVal)).format(`0,0`)}
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
                    shareAmount: BigInt(value),
                  })
                } else {
                  setShareAmountInputVal(0)
                  onChange({
                    ...workOrder,
                    shareAmount: null,
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
                    <Tooltip placement="right" title="Composite add tool">
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
                          <Typography component="p" gutterBottom>
                            This price comes from the store estimate above: {myStoreChoice.name_short} =
                            {MValueFormatter(myStoreChoice.price, MValueFormat.currency)}
                          </Typography>
                          <Typography component="p" gutterBottom>
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

          {workOrder.orderType === ActivityEnum.ShipMining && (
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              {shipOrder.isRefined && !shipOrder.shareRefinedValue && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="overline" sx={{ fontWeight: 'bold' }} color="GrayText">
                    Estimated Unrefined Value:
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Typography variant="overline" color="GrayText">
                    {MValueFormatter(summary.unrefinedValue, MValueFormat.currency)}
                  </Typography>
                </Stack>
              )}
              <Box sx={{ flexGrow: 1 }} />
              {shipOrder.isRefined && (
                <Tooltip
                  placement="top"
                  title={
                    <>
                      <Typography variant="overline" gutterBottom>
                        Share Unrefined Value
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Select this option to divide your crew shares based on the estimated price of what your ore
                        would sell for unrefined (even though you're refining and selling at a TDD).
                      </Typography>
                      <Typography variant="caption" gutterBottom>
                        This could be useful if your crew wants to be paid in advance. In this case the owner of the
                        order takes all the risk of delivering the ore to market.{' '}
                        {isEditing && isShareRefinedValueLocked ? '(LOCKED BY SESSION OWNER)' : ''}
                      </Typography>
                    </>
                  }
                >
                  <FormControlLabel
                    sx={{
                      '& .MuiTypography-root': {
                        fontFamily: fontFamilies.robotoMono,
                        fontSize: 10,
                        color: theme.palette.text.secondary,
                      },
                    }}
                    control={
                      <Switch
                        size="small"
                        checked={Boolean(!shipOrder.shareRefinedValue)}
                        disabled={!isEditing || isShareRefinedValueLocked}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          onChange({
                            ...shipOrder,
                            shareRefinedValue: !event.target.checked,
                          } as ShipMiningOrder)
                        }}
                      />
                    }
                    label="Share Unrefined Value"
                  />
                </Tooltip>
              )}
            </Stack>
          )}

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="overline" sx={{ fontWeight: 'bold' }} color="secondary" component="div">
              Expenses:
            </Typography>

            {isEditing && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  size="small"
                  color="primary"
                  startIcon={<AddCircle />}
                  disabled={Boolean(workOrder?.expenses && workOrder?.expenses.length >= MAXIMUM_EXPENSES)}
                  onClick={() => {
                    const newExpenses: WorkOrderExpense[] = [
                      ...(workOrder.expenses || []),
                      {
                        name: '',
                        amount: 0n,
                        ownerScName: workOrder.sellerscName || (workOrder.owner?.scName as string),
                        __typename: 'WorkOrderExpense',
                      },
                    ]
                    onChange({
                      ...workOrder,
                      expenses: newExpenses,
                    })
                  }}
                >
                  Add Expense
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Cancel />}
                  disabled={!(workOrder?.expenses && workOrder?.expenses.length >= 0)}
                  onClick={() => setClearConfirmOpen(true)}
                >
                  Clear All
                </Button>
              </Stack>
            )}
          </Stack>
          <ExpenseTable workOrder={workOrder} summary={summary} isEditing={isEditing} onChange={onChange} />
          {isEditing && (
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="right">
              <Tooltip
                placement="bottom"
                title={
                  <>
                    <Typography variant="overline" gutterBottom>
                      Include moTrader Fees
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Include the moTrader transfer fees as a reimbursable expense.
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      If this is off the OWNER will pay all the 0.5% moTRADER transfer fees.{' '}
                      {isEditing && isIncludeTransferFeeLocked ? '(LOCKED BY SESSION OWNER)' : ''}
                    </Typography>
                  </>
                }
              >
                <FormControlLabel
                  sx={{
                    '& .MuiTypography-root': {
                      fontFamily: fontFamilies.robotoMono,
                      fontSize: 10,
                      color: theme.palette.text.secondary,
                    },
                  }}
                  control={
                    <Switch
                      size="small"
                      checked={Boolean(workOrder.includeTransferFee)}
                      disabled={!isEditing || isIncludeTransferFeeLocked}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        onChange({
                          ...workOrder,
                          includeTransferFee: event.target.checked,
                        })
                      }}
                    />
                  }
                  label="Include moTrader Transfer Fee"
                />
              </Tooltip>
            </Stack>
          )}

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Typography variant="overline" sx={{ fontWeight: 'bold' }} color="secondary">
              Profit Shares:
            </Typography>
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
            isCalculator={isCalculator}
            markCrewSharePaid={markCrewSharePaid}
            onDeleteCrewShare={onDeleteCrewShare}
            workOrder={workOrder}
            summary={finalSummary}
            userSuggest={userSuggest}
          />
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
              shareAmount: BigInt(newVal),
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

      {helpDialogOpen && (
        <ExpenseCardHelpModal onClose={() => setHelpDialogOpen(false)} workOrder={workOrder} isEditing={isEditing} />
      )}
      {clearConfirmOpen && (
        <DeleteModal
          open
          title="Clear All Expenses"
          confirmBtnText="Clear All"
          message={
            <Typography>
              Are you sure you want to clear all expenses? This will remove all custom expenses and cannot be undone.
            </Typography>
          }
          onClose={() => setClearConfirmOpen(false)}
          onConfirm={() => {
            onChange({
              ...workOrder,
              expenses: [],
            })
            setClearConfirmOpen(false)
          }}
        />
      )}
      {UEXHelpDialogOpen && <UEXHelpDialog onClose={() => setUEXHelpDialogOpen(false)} />}
      <StoreChooserModal
        open={storeChooserOpen}
        onClose={() => setStoreChooserOpen(false)}
        ores={summary.oreSummary}
        initStore={workOrder.sellStore as string}
        isRefined={shipOrder.isRefined || false}
        isShipOrder={workOrder.orderType === ActivityEnum.ShipMining}
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
