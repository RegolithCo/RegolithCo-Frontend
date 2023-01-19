import * as React from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

export interface RemoveUserModalProps {
  open: boolean
  scName: string
  onClose: () => void
  onConfirm: () => void
}

export const RemoveUserModal: React.FC<RemoveUserModalProps> = ({ open, scName, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Remove "{scName}"?</DialogTitle>
      <DialogContent>You can always add them back.</DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Button onClick={onConfirm}>Yes</Button>
      </DialogActions>
    </Dialog>
  )
}
