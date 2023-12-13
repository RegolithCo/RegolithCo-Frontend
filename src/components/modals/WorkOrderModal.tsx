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
} from '@mui/material'

import { WorkOrderCalc } from '../calculators/WorkOrderCalc'
import { ActivityEnum, CrewShare, makeHumanIds, WorkOrder, WorkOrderStateEnum } from '@regolithco/common'
import { AccountBalance, BackHand, Cancel, Create, Delete, Edit, Save, SvgIconComponent } from '@mui/icons-material'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { fontFamilies } from '../../theme'
import { keyframes, Theme } from '@mui/system'
import { DeleteModal } from './DeleteModal'
import { WorkOrderContext } from '../../context/workOrder.context'
import { ConfirmModal } from './ConfirmModal'
import { AppContext } from '../../context/app.context'
import { ExportImageIcon } from '../../icons/badges'

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
      backgroundColor: '#282828',
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
    isSessionActive,
    isMine,
    templateJob,
    failWorkOrder,
    forceTemplate,
    userSuggest,
  } = React.useContext(WorkOrderContext)
  const [newWorkOrder, setNewWorkOrder] = React.useState<WorkOrder>(workOrder)
  const [isEditing, setIsEditing] = React.useState<boolean>(Boolean(isNew))
  const [deleteConfirmModal, setDeleteConfirmModal] = React.useState<boolean>(false)
  const [confirmCloseModal, setConfirmCloseModal] = React.useState<boolean>(false)
  const styles = styleThunk(theme)
  const mediumUp = useMediaQuery(theme.breakpoints.up('md'))

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

  let WorkIcon: SvgIconComponent
  let title = ''
  if (!workOrder) return null
  switch (workOrder.orderType) {
    case ActivityEnum.Salvage:
      title = 'Salvage Work Order'
      WorkIcon = ClawIcon
      break
    case ActivityEnum.ShipMining:
      title = 'Ship Mining Work Order'
      WorkIcon = RockIcon
      break
    case ActivityEnum.VehicleMining:
      title = 'Vehicle Mining Work Order'
      WorkIcon = GemIcon
      break
    case ActivityEnum.Other:
      title = 'Share aUEC Work Order'
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

  // const maxWidth = 500
  return (
    <Dialog
      open={open}
      onClose={handleConfirmClose}
      maxWidth="lg"
      fullWidth
      fullScreen={!mediumUp}
      disableEscapeKeyDown={isEditing}
      sx={{ ...styles.paper }}
    >
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
            <Typography component="div" sx={{ py: 0, pl: 5, fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}>
              <Box sx={styles.headerMeta}>
                ID: {makeHumanIds(getSafeName(workOrder.sellerscName || workOrder.owner?.scName), workOrder.orderId)}
              </Box>
              <Box sx={styles.headerMeta}> Created By: {getSafeName(workOrder.owner?.scName) || 'NEW'}</Box>
              {workOrder.sellerscName && (
                <Box sx={styles.headerMeta}> Seller: {getSafeName(workOrder.sellerscName)}</Box>
              )}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />

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
              markCrewSharePaid={(crewShare: CrewShare, paid: boolean) => {
                // IMPORTANT: if we're editing an existing work order we can set this thing as paid
                // directly because it already exists int he database

                // If this is a new work order, we need to update the state of the new work order first
                // then the whole object will go to the server together
                if (isNew) {
                  setNewWorkOrder({
                    ...newWorkOrder,
                    crewShares: (newWorkOrder.crewShares || [])?.map((share) => {
                      if (share.scName === crewShare.scName) return { ...share, state: paid }
                      return share
                    }),
                  })
                } else markCrewSharePaid && markCrewSharePaid(crewShare, paid)
              }}
              onDeleteCrewShare={(scName: string) => {
                setNewWorkOrder({
                  ...newWorkOrder,
                  crewShares: (newWorkOrder.crewShares || [])?.filter((share) => share.scName !== scName),
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
              size="large"
              startIcon={<Cancel />}
              onClick={() => {
                if (isEditing && !isNew) setIsEditing(false)
                handleConfirmClose()
              }}
            >
              {isNew ? 'Cancel' : 'Close'}
            </Button>
          </Tooltip>
          <div style={{ flexGrow: 1 }} />
          {allowEdit && deleteWorkOrder && (
            <Tooltip title={'PERMANENTLY Delete this work order'} placement="top">
              <Button
                variant="contained"
                startIcon={<Delete />}
                onClick={() => setDeleteConfirmModal(true)}
                color="error"
              >
                Delete
              </Button>
            </Tooltip>
          )}
          {allowEdit && isEditing && (
            <Tooltip title={isNew ? 'Save & Create this work order' : 'Save these edits'} placement="top">
              <Button
                color="secondary"
                variant="contained"
                size="large"
                startIcon={isNew ? <Create /> : <Save />}
                onClick={() => {
                  onUpdate(newWorkOrder)
                  isEditing && setIsEditing(false)
                }}
              >
                {isNew ? 'Create' : 'Save'}
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
      <DeleteModal
        message={
          <>
            <Typography paragraph>
              Deleting this work order will remove it from the system. This action cannot be undone.
            </Typography>
            {!isSessionActive && (
              <Typography color="error" paragraph>
                <strong>This session has ended!</strong> If you delete this work order you will not be able to re-add
                it.
              </Typography>
            )}
          </>
        }
        onClose={() => setDeleteConfirmModal(false)}
        open={deleteConfirmModal}
        onConfirm={() => {
          deleteWorkOrder && deleteWorkOrder()
          setDeleteConfirmModal(false)
          onClose()
        }}
        title="Permanently DELETE Work Order?"
        cancelBtnText="Oops.NO!"
        confirmBtnText="Yes, Delete"
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
    </Dialog>
  )
}
