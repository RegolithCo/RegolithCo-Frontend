import * as React from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { Cancel, Check } from '@mui/icons-material'

export interface ConfirmModalProps {
  open: boolean
  title: string | React.ReactNode | React.ReactNode[]
  message: string | React.ReactNode | React.ReactNode[]
  onClose: () => void
  onConfirm: () => void
  confirmBtnText?: string
  cancelBtnText?: string
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
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
      maxWidth="xs"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 10,
          boxShadow: `0px 0px 20px 5px ${theme.palette.primary.light}, 0px 0px 60px 40px black`,
          background: theme.palette.background.default,
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
          <Button color="secondary" onClick={onClose} variant="contained" startIcon={<Cancel />}>
            {cancelBtnText || 'Cancel'}
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Button
            color="primary"
            startIcon={<Check />}
            sx={{ background: theme.palette.background.paper }}
            variant="outlined"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmBtnText || 'Confirm'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
