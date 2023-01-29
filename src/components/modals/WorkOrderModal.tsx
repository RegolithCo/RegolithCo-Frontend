import * as React from 'react'
import { Box, Button, Dialog, DialogActions, SxProps, Toolbar, Typography, useTheme } from '@mui/material'

import { WorkOrderCalc } from '../calculators/WorkOrderCalc'
import { ActivityEnum, makeHumanOrderId, UserSuggest, WorkOrder, WorkOrderDefaults } from '@regolithco/common'
import { Cancel, Create, Delete, Edit, QuestionMark, Save, SvgIconComponent } from '@mui/icons-material'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { fontFamilies } from '../../theme'
import { keyframes, Theme } from '@mui/system'
import { DeleteModal } from './DeleteModal'

export interface WorkOrderModalProps {
  open: boolean
  workOrder: WorkOrder
  onUpdate: (workOrder: WorkOrder) => void
  deleteWorkOrder?: () => void
  onSetCrewSharePaid?: (scName: string, paid: boolean) => void
  allowEdit?: boolean
  allowPay?: boolean
  templateJob?: WorkOrderDefaults
  forceTemplate?: boolean
  userSuggest?: UserSuggest
  isNew?: boolean
  onClose: () => void
}

const styleThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  paper: {
    '& .MuiDialog-paper': {
      borderRadius: 2,
      [theme.breakpoints.down('sm')]: {
        height: 'calc(100% - 64px)',
        margin: 0,
        borderRadius: 0,
        maxHeight: '100%',
      },
      [theme.breakpoints.up('md')]: {
        minHeight: 600,
        maxHeight: 900,
        overflow: 'visible',
      },
      backgroundColor: '#282828cc',
      backgroundImage: 'none',
      border: `2px solid ${theme.palette.primary.dark}`,
    },
  },
  containerBox: {
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  workOrderBox: {
    overflow: 'hidden',
    overflowY: 'auto',
    flexGrow: 1,

    [theme.breakpoints.up('md')]: {
      overflowY: 'hidden',
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
    border: `5px solid ${theme.palette.primary.dark}`,
    color: theme.palette.primary.dark,

    background: theme.palette.primary.contrastText,
    borderRadius: '50%',
  },
})

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({
  open,
  isNew,
  workOrder,
  onUpdate,
  deleteWorkOrder,
  onSetCrewSharePaid,
  allowEdit,
  allowPay,
  templateJob,
  forceTemplate,
  userSuggest,
  onClose,
}) => {
  const theme = useTheme()
  const [newWorkOrder, setNewWorkOrder] = React.useState<WorkOrder>(workOrder)
  const [isEditing, setIsEditing] = React.useState<boolean>(Boolean(isNew))
  const [deleteConfirmModal, setDeleteConfirmModal] = React.useState<boolean>(false)
  const styles = styleThunk(theme)

  React.useEffect(() => {
    setNewWorkOrder(workOrder)
  }, [workOrder])

  const pulse = keyframes`
  0% { color:  ${theme.palette.secondary.contrastText}; }
  70% { color:  ${theme.palette.secondary.dark}; }
  100% { color: ${theme.palette.warning.contrastText}; }
`
  const pulseCssThunk = (doPulse: boolean): SxProps<Theme> => ({
    animation: doPulse ? `${pulse} 2s infinite ease` : '',
    color: 'transparent',
  })

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
      title = 'Arbitrary aUEC Work Order'
      WorkIcon = QuestionMark
      break
    default:
      return <>DisplayError</>
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" disableEscapeKeyDown={isEditing} sx={styles.paper}>
      <WorkIcon color="inherit" fontSize="large" sx={styles.icon} />
      <Box sx={styles.containerBox}>
        <Toolbar
          sx={{
            zIndex: 20,
            flex: '0 0',
            fontFamily: fontFamilies.robotoMono,
            bgcolor: theme.palette.primary.dark,
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
            </Typography>
            <Typography component="div" sx={{ py: 0, pl: 5, fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}>
              ID: {makeHumanOrderId(workOrder.orderId, workOrder.owner?.scName || 'NEW')}
              {'    '} Created By: {workOrder.owner?.scName || 'NEW'}
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

          {/* <Chip label={workOrder?.state} color="secondary" /> */}
        </Toolbar>
        <Box sx={styles.workOrderBox}>
          {workOrder ? (
            <WorkOrderCalc
              onChange={setNewWorkOrder}
              onSetCrewSharePaid={(scName: string, paid: boolean) => {
                // IMPORTANT: if we're editing an existing work order we can set this thing as paid
                // directly because it already exists int he database

                // If this is a new work order, we need to update the state of the new work order first
                // then the whole object will go to the server together
                if (isNew) {
                  setNewWorkOrder({
                    ...newWorkOrder,
                    crewShares: (newWorkOrder.crewShares || [])?.map((share) => {
                      if (share.scName === scName) return { ...share, paid }
                      return share
                    }),
                  })
                } else onSetCrewSharePaid && onSetCrewSharePaid(scName, paid)
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

        <DialogActions sx={{ backgroundColor: theme.palette.primary.dark, flex: '0 0' }}>
          <Button
            color="error"
            variant="contained"
            size="large"
            startIcon={<Cancel />}
            onClick={() => {
              if (isEditing && !isNew) setIsEditing(false)
              onClose()
            }}
          >
            {isNew ? 'Cancel' : 'Close'}
          </Button>
          <div style={{ flexGrow: 1 }} />
          {allowEdit && deleteWorkOrder && (
            <Button
              variant="contained"
              startIcon={<Delete />}
              onClick={() => setDeleteConfirmModal(true)}
              color="error"
            >
              Delete
            </Button>
          )}
          {allowEdit && isEditing && (
            <Button
              color="secondary"
              variant="contained"
              size="large"
              startIcon={isNew ? <Create /> : <Save />}
              onClick={() => {
                onUpdate(newWorkOrder)
                isEditing && setIsEditing(false)
                isEditing && onClose()
              }}
            >
              {isNew ? 'Create' : 'Save'}
            </Button>
          )}
          {allowEdit && !isEditing && (
            <Button
              color="secondary"
              variant="contained"
              size="large"
              startIcon={<Edit />}
              onClick={() => {
                setIsEditing(true)
              }}
            >
              {'Edit'}
            </Button>
          )}
        </DialogActions>
      </Box>
      <DeleteModal
        message="Deleting this work order will remove it from the system. This action cannot be undone."
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
    </Dialog>
  )
}
