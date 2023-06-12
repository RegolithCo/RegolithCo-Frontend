import * as React from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { Check } from '@mui/icons-material'

export interface WarningModalProps {
  open: boolean
  title: string | React.ReactNode | React.ReactNode[]
  message: string | React.ReactNode | React.ReactNode[]
  onClose: () => void
  confirmBtnText?: string
}

export const WarningModal: React.FC<WarningModalProps> = ({ open, title, message, onClose, confirmBtnText }) => {
  const theme = useTheme()
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 10,
          boxShadow: `0px 0px 20px 5px ${theme.palette.secondary.light}, 0px 0px 60px 40px black`,
          background: theme.palette.background.default,
          border: `10px solid ${theme.palette.secondary.main}`,
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
          <div style={{ flexGrow: 1 }} />
          <Button
            color="secondary"
            startIcon={<Check />}
            sx={{ background: theme.palette.background.paper }}
            variant="outlined"
            onClick={() => onClose()}
          >
            {confirmBtnText || 'Ok'}
          </Button>
          <div style={{ flexGrow: 1 }} />
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
