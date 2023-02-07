import * as React from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { Cancel, Delete } from '@mui/icons-material'

export interface DeleteModalProps {
  open: boolean
  title: string | React.ReactNode | React.ReactNode[]
  message: string | React.ReactNode | React.ReactNode[]
  onClose: () => void
  onConfirm: () => void
  confirmBtnText?: string
  cancelBtnText?: string
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  title,
  message,
  onClose,
  onConfirm,
  confirmBtnText,
  cancelBtnText,
}) => {
  const theme = useTheme()
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 10,
          border: `10px solid ${theme.palette.primary.dark}`,
          px: 4,
          py: 2,
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" component="div">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
          <Button color="error" onClick={onClose} variant="contained" startIcon={<Cancel />}>
            {cancelBtnText || 'Cancel'}
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Button
            color="error"
            startIcon={<Delete />}
            sx={{ background: theme.palette.background.paper }}
            variant="outlined"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmBtnText || 'Delete'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
