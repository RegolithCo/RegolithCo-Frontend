import React, { PropsWithChildren } from 'react'
import { useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogProps, Stack } from '@mui/material'
import { Help } from '@mui/icons-material'

export type HelpModalProps = PropsWithChildren & {
  title: string | React.ReactNode
  props?: Partial<DialogProps>
  onClose?: () => void
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose, title, children, props }) => {
  const theme = useTheme()

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      {...props}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: `0px 0px 100px 50px black`,
          background: theme.palette.background.default,
          border: `6px solid ${theme.palette.info.main}`,
        },
      }}
    >
      <DialogTitle
        variant="h6"
        sx={{
          background: theme.palette.info.main,
          color: theme.palette.info.contrastText,
        }}
      >
        {typeof title === 'string' ? (
          <Stack direction="row" alignItems="center">
            <Help sx={{ mr: 2 }} color="inherit" /> {title}
          </Stack>
        ) : (
          title
        )}
      </DialogTitle>
      <DialogContent
        sx={{
          mt: 4,
          px: 4,
          py: 2,
        }}
      >
        {children}
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1} sx={{ width: '100%' }} justifyContent={'right'}>
          <Button onClick={onClose}>Ok</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
