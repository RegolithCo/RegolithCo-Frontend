import * as React from 'react'
import { Typography } from '@mui/material'

import { DeleteModal } from './DeleteModal'
import { WorkOrderContext } from '../../context/workOrder.context'

export interface DeleteWorkOrderModalProps {
  open: boolean
  onConfirm: () => void
  onClose: () => void
}

export const DeleteWorkOrderModal: React.FC<DeleteWorkOrderModalProps> = ({ open, onConfirm, onClose }) => {
  const { isSessionActive } = React.useContext(WorkOrderContext)

  // const maxWidth = 500
  return (
    <DeleteModal
      message={
        <>
          <Typography paragraph>
            Deleting this work order will remove it from the system. This action cannot be undone.
          </Typography>
          {!isSessionActive && (
            <Typography color="error" paragraph>
              <strong>This session has ended!</strong> If you delete this work order you will not be able to re-add it.
            </Typography>
          )}
        </>
      }
      onClose={onClose}
      open={open}
      onConfirm={onConfirm}
      title="Permanently DELETE Work Order?"
      cancelBtnText="Cancel"
      confirmBtnText="Yes, Delete"
    />
  )
}
