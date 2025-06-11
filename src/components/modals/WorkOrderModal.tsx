import * as React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  IconButton,
  SxProps,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  keyframes,
  Theme,
} from '@mui/material'

import { WorkOrderCalc } from '../calculators/WorkOrderCalc'
import {
  ActivityEnum,
  CrewShare,
  makeHumanIds,
  oreAmtCalc,
  RefineryEnum,
  RefineryMethodEnum,
  RefineryRow,
  ShipMiningOrder,
  ShipMiningOrderCapture,
  ShipRockCapture,
  WorkOrder,
  WorkOrderStateEnum,
  yieldCalc,
} from '@regolithco/common'
import {
  AccountBalance,
  BackHand,
  Cancel,
  Create,
  Delete,
  DocumentScanner,
  Edit,
  Error,
  NewReleases,
  Save,
  SvgIconComponent,
} from '@mui/icons-material'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { fontFamilies } from '../../theme'
import { WorkOrderContext } from '../../context/workOrder.context'
import { ConfirmModal } from './ConfirmModal'
import { AppContext } from '../../context/app.context'
import { ExportImageIcon } from '../../icons/badges'
import { DeleteWorkOrderModal } from './DeleteWorkOrderModal'
import { CaptureControl } from '../ocr/CaptureControl'
import { LookupsContext } from '../../context/lookupsContext'
import { useImagePaste } from '../../hooks/useImagePaste'
import { WorkOrderFailModal } from './WorkOrderFailModal'
// import log from 'loglevel'

export interface WorkOrderModalProps {
  open: boolean
  setWorkOrderShareId?: (id: string) => void
  onClose: () => void
}

const styleThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  paper: {
    '& .MuiDialog-paper': {
      borderRadius: 2,
      minHeight: 200,
      overflow: 'visible',
      [theme.breakpoints.down('md')]: {
        margin: 0,
        borderRadius: 0,
        minHeight: '100vh',
      },
      backgroundColor: '#333333',
      backgroundImage: 'none',
      display: 'flex',
      flexDirection: 'column',
      border: `2px solid ${theme.palette.primary.main}`,
    },
  },
  containerBox: {
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
  },
  workOrderBox: {
    display: 'flex',
    overflow: 'hidden',
    overflowY: 'auto',
    flexGrow: 1,

    [theme.breakpoints.up('md')]: {
      overflowY: 'hidden',
    },
  },
  headerMeta: {
    // display: 'block',
    display: 'inline',
    fontSize: '0.6rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '0.8rem',
    },
  },
  icon: {
    [theme.breakpoints.up('md')]: {
      top: -30,
      left: -45,
      fontSize: 80,
      height: 80,
      width: 80,
      mx: 2,
      padding: 2,
    },
    padding: 1,
    top: 0,
    left: 0,
    fontSize: 40,
    height: 50,
    width: 50,
    position: 'absolute',
    zIndex: 100,
    border: `5px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,

    background: theme.palette.primary.contrastText,
    borderRadius: '50%',
  },
})

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({ open, setWorkOrderShareId, onClose }) => {
  const theme = useTheme()
  const { getSafeName } = React.useContext(AppContext)
  const {
    isNew,
    workOrder,
    onUpdate,
    deleteWorkOrder,
    markCrewSharePaid,
    allowEdit,
    allowPay,
    systemFilter,
    // isSessionActive,
    isMine,
    templateJob,
    failWorkOrder,
    pastedImgUrl,
    setPastedImgUrl,
    // forceTemplate,
    userSuggest,
  } = React.useContext(WorkOrderContext)
  const dataStore = React.useContext(LookupsContext)
  const [isFailModalOpen, setIsFailModalOpen] = React.useState(false)

  const [newWorkOrder, setNewWorkOrder] = React.useState<WorkOrder>(workOrder)
  const [isEditing, setIsEditing] = React.useState<boolean>(Boolean(isNew))
  const [deleteConfirmModal, setDeleteConfirmModal] = React.useState<boolean>(false)
  const [confirmCloseModal, setConfirmCloseModal] = React.useState<boolean>(false)

  const [camScanModal, setCamScanModal] = React.useState<boolean>(!!pastedImgUrl)

  const styles = styleThunk(theme)
  const mediumUp = useMediaQuery(theme.breakpoints.up('md'))
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const isShipMining = workOrder.orderType === ActivityEnum.ShipMining

  // We need to make sure newWorkOrder is always up to date with the workOrder
  React.useEffect(() => {
    setNewWorkOrder(workOrder)
  }, [workOrder])

  const pulse = keyframes`
  0% { color:  ${theme.palette.secondary.contrastText}; }
  70% { color:  ${theme.palette.secondary.main}; }
  100% { color: ${theme.palette.warning.contrastText}; }
`
  const pulseCssThunk = (doPulse: boolean): SxProps<Theme> => ({
    animation: doPulse ? `${pulse} 2s infinite ease` : '',
    color: 'transparent',
  })

  const handleConfirmClose = () => {
    if (isEditing || isNew) {
      setConfirmCloseModal(true)
    } else {
      onClose()
    }
  }

  // Detect paste events and handle them as long as no modals are open
  useImagePaste((image) => {
    setPastedImgUrl && setPastedImgUrl(image)
    if (!isEditing) setIsEditing(true)
    setCamScanModal(true)
  }, !setPastedImgUrl || camScanModal)

  let WorkIcon: SvgIconComponent
  let title = ''
  if (!workOrder) return null
  switch (workOrder.orderType) {
    case ActivityEnum.Salvage:
      title = mediumUp ? 'Salvage Work Order' : 'Order'
      WorkIcon = ClawIcon
      break
    case ActivityEnum.ShipMining:
      title = mediumUp ? 'Ship Mining Work Order' : 'Order'
      WorkIcon = RockIcon
      break
    case ActivityEnum.VehicleMining:
      title = mediumUp ? 'Vehicle Mining Work Order' : 'Order'
      WorkIcon = GemIcon
      break
    case ActivityEnum.Other:
      title = mediumUp ? 'Share aUEC Work Order' : 'Order'
      WorkIcon = AccountBalance
      break
    default:
      return <>DisplayError</>
  }

  const editBtnTip = allowEdit ? (
    <div>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        Edit Work Order
      </Typography>
    </div>
  ) : (
    <div>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        This work order cannot be edited
      </Typography>
    </div>
  )

  const handleCapture = async <T extends ShipRockCapture | ShipMiningOrderCapture>(data: T): Promise<void> => {
    const capturedOrder = data as ShipMiningOrderCapture
    if (newWorkOrder.orderType !== ActivityEnum.ShipMining || !dataStore.ready) return
    const shipOrder = newWorkOrder as ShipMiningOrder
    const refinery = capturedOrder.refinery || shipOrder.refinery || RefineryEnum.Arcl1
    const method = capturedOrder.method || shipOrder.method || RefineryMethodEnum.DinyxSolventation

    const newOres: RefineryRow[] = await Promise.all(
      capturedOrder.shipOres.map(async (ore) => ({
        ore: ore.ore,
        amt: ore.amt || ore.yield ? await oreAmtCalc(dataStore, ore.yield as number, ore.ore, refinery, method) : 0,
        yield: ore.yield || ore.amt ? await yieldCalc(dataStore, ore.amt as number, ore.ore, refinery, method) : 0,
        __typename: 'RefineryRow',
      }))
    )
    const expenses = [...(shipOrder.expenses || []), ...(capturedOrder.expenses || [])].filter(
      ({ amount, name }, i, arr) => !(name.toLowerCase().includes('refinery') && amount === 0)
    )

    setNewWorkOrder({
      ...shipOrder,
      refinery,
      method,
      expenses,
      processDurationS: capturedOrder.processDurationS || 0,
      shipOres: newOres,
    })
  }

  const isOther = newWorkOrder.orderType === ActivityEnum.Other

  // const maxWidth = 500
  return (
    <Dialog
      open={open}
      onClose={handleConfirmClose}
      maxWidth={isOther ? 'sm' : 'lg'}
      fullWidth
      fullScreen={!mediumUp}
      disableEscapeKeyDown={isEditing}
      sx={{ ...styles.paper }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(1px)',
          },
        },
      }}
    >
      {camScanModal && (
        <CaptureControl
          captureType="REFINERY_ORDER"
          initialImageUrl={pastedImgUrl || null}
          onClose={() => setCamScanModal(false)}
          onCapture={handleCapture}
        />
      )}
      <WorkIcon color="inherit" fontSize="large" sx={styles.icon} />
      <Box sx={styles.containerBox}>
        <Toolbar
          sx={{
            zIndex: 20,
            flex: '0 0',
            fontFamily: fontFamilies.robotoMono,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            // mb: 2,
          }}
        >
          <Box sx={{}}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                fontWeight: 700,
                py: 0,
                pl: 5,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {title}
              {mediumUp && workOrder?.state === WorkOrderStateEnum.Failed ? ' <FAILED>' : ''}
            </Typography>
            {mediumUp && (
              <Typography
                component="div"
                sx={{ py: 0, pl: 5, fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}
              >
                <Box sx={styles.headerMeta}>
                  ID: {makeHumanIds(getSafeName(workOrder.sellerscName || workOrder.owner?.scName), workOrder.orderId)}
                </Box>
                <Box sx={styles.headerMeta}> Created By: {getSafeName(workOrder.owner?.scName) || 'NEW'}</Box>
                {workOrder.sellerscName && (
                  <Box sx={styles.headerMeta}> Seller: {getSafeName(workOrder.sellerscName)}</Box>
                )}
              </Typography>
            )}
          </Box>
          <Box sx={{ flexGrow: 1 }} />

          {mediumUp && (
            <Typography
              sx={{
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
                fontSize: '2rem',
                ...pulseCssThunk(isEditing),
              }}
            >
              {isEditing ? 'Editing...' : ' '}
            </Typography>
          )}
          {!isEditing && !isNew && setWorkOrderShareId && (
            <Tooltip title="Share this work order" placement="top">
              <IconButton color="inherit" onClick={() => setWorkOrderShareId(workOrder.orderId)}>
                <ExportImageIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
        <Box sx={styles.workOrderBox}>
          {workOrder ? (
            <WorkOrderCalc
              onChange={setNewWorkOrder}
              failWorkOrder={failWorkOrder}
              isNew={isNew}
              isMine={isMine}
              systemFilter={systemFilter}
              markCrewSharePaid={(crewShare: CrewShare, paid: boolean) => {
                // IMPORTANT: if we're editing an existing work order we can set this thing as paid
                // directly because it already exists int he database

                // If this is a new work order, we need to update the state of the new work order first
                // then the whole object will go to the server together
                if (isNew) {
                  setNewWorkOrder({
                    ...newWorkOrder,
                    crewShares: (newWorkOrder.crewShares || [])?.map((share) => {
                      if (share.payeeScName === crewShare.payeeScName) return { ...share, state: paid }
                      return share
                    }),
                  })
                } else markCrewSharePaid && markCrewSharePaid(crewShare, paid)
              }}
              onDeleteCrewShare={(scName: string) => {
                setNewWorkOrder({
                  ...newWorkOrder,
                  crewShares: (newWorkOrder.crewShares || [])?.filter((share) => share.payeeScName !== scName),
                  expenses: (newWorkOrder.expenses || [])?.filter(
                    (expense) => expense.ownerScName.toLowerCase() !== scName.toLowerCase()
                  ),
                })
              }}
              workOrder={newWorkOrder}
              allowEdit={allowEdit}
              allowPay={allowPay}
              isEditing={isEditing}
              templateJob={templateJob}
              userSuggest={userSuggest}
            />
          ) : (
            'Loading...'
          )}
        </Box>

        <DialogActions sx={{ backgroundColor: theme.palette.primary.main, flex: '0 0' }}>
          <Tooltip title={isNew ? 'Cancel and close this window' : 'Close this window'} placement="top">
            <Button
              color="error"
              variant="contained"
              size={isSmall ? 'small' : 'large'}
              startIcon={!isSmall && <Cancel />}
              onClick={() => {
                if (isEditing && !isNew) setIsEditing(false)
                handleConfirmClose()
              }}
            >
              {isNew ? 'Cancel' : 'Close'}
            </Button>
          </Tooltip>
          <div style={{ flexGrow: 1 }} />
          {allowEdit && isShipMining && (
            <>
              {mediumUp && (
                <>
                  <Tooltip title="Import a work order using a game screenshot." placement="top">
                    <Button
                      size={isSmall ? 'small' : 'large'}
                      startIcon={<DocumentScanner />}
                      color="inherit"
                      variant="contained"
                      onClick={() => {
                        if (!isEditing) setIsEditing(true)
                        setCamScanModal(true)
                      }}
                    >
                      Import from Capture
                    </Button>
                  </Tooltip>
                  <div style={{ flexGrow: 1 }} />
                </>
              )}
            </>
          )}
          {allowEdit && deleteWorkOrder && (
            <Tooltip title={'PERMANENTLY Delete this work order'} placement="top">
              <Button
                variant="outlined"
                size={isSmall ? 'small' : 'large'}
                startIcon={<Delete />}
                onClick={() => setDeleteConfirmModal(true)}
                color="error"
                sx={{
                  backgroundColor: 'black',
                }}
              >
                Delete
              </Button>
            </Tooltip>
          )}
          {allowEdit && failWorkOrder && (
            <Tooltip
              title={!workOrder.failReason ? 'Mark this work order as failed' : 'Reset this work order fail status'}
              placement="top"
            >
              <Button
                variant="contained"
                size={isSmall ? 'small' : 'large'}
                startIcon={<NewReleases />}
                onClick={() => {
                  if (!workOrder.failReason) {
                    setIsFailModalOpen(true)
                  } else {
                    // Un-fail please
                    failWorkOrder && failWorkOrder()
                  }
                }}
                color="error"
              >
                {!workOrder.failReason ? 'Failed' : 'Reset Fail'}
              </Button>
            </Tooltip>
          )}

          {allowEdit && isEditing && (
            <Tooltip title={isNew ? 'Save & Create this work order' : 'Save these edits'} placement="top">
              <Button
                color={isNew ? 'info' : 'success'}
                variant="contained"
                sx={{
                  boxShadow: `2 2 5px white; 0 0 10px white`,
                  border: `2px solid black`,
                }}
                size={isSmall ? 'small' : 'large'}
                startIcon={isSmall ? undefined : isNew ? <Create /> : <Save />}
                onClick={() => {
                  onUpdate(newWorkOrder)
                  isEditing && setIsEditing(false)
                }}
              >
                {isNew ? (isSmall ? 'Save' : 'Save New Order') : 'Save'}
              </Button>
            </Tooltip>
          )}
          {!isEditing && (
            <Tooltip title={editBtnTip} placement="top">
              <div>
                <Button
                  color="info"
                  variant="contained"
                  size="large"
                  disabled={!allowEdit}
                  startIcon={<Edit />}
                  onClick={() => {
                    setIsEditing(true)
                  }}
                >
                  {'Edit'}
                </Button>
              </div>
            </Tooltip>
          )}
        </DialogActions>
      </Box>
      <DeleteWorkOrderModal
        onClose={() => setDeleteConfirmModal(false)}
        open={deleteConfirmModal}
        onConfirm={() => {
          deleteWorkOrder && deleteWorkOrder()
          setDeleteConfirmModal(false)
          onClose()
        }}
      />
      <ConfirmModal
        open={confirmCloseModal}
        onClose={() => setConfirmCloseModal(false)}
        message="Are you sure you want to close this window? Any unsaved changes will be lost."
        title="Discard Changes?"
        onConfirm={() => {
          setConfirmCloseModal(false)
          onClose()
        }}
        cancelBtnText="Keep editing"
        confirmBtnText="Discard"
        cancelIcon={<BackHand />}
        confirmIcon={<Delete />}
      />
      <WorkOrderFailModal
        open={isFailModalOpen}
        onClose={() => setIsFailModalOpen(false)}
        onChoose={(reason: string) => {
          failWorkOrder && failWorkOrder(reason)
        }}
      />
    </Dialog>
  )
}
