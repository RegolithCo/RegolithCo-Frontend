import * as React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useTheme } from '@mui/material'
import { Newspaper } from '@mui/icons-material'
import { fontFamilies } from '../../theme'

export interface ActiveUserProps {
  open: boolean
  onClose: () => void
}

export const ActiveUserPopup: React.FC<ActiveUserProps> = ({ open, onClose }) => {
  const theme = useTheme()
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 10,
          boxShadow: `0px 0px 20px 5px ${theme.palette.primary.light}, 0px 0px 60px 40px black`,
          background: theme.palette.background.default,
          border: `10px solid ${theme.palette.primary.main}`,
          // px: 4,
          // py: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          position: 'relative',
          fontFamily: fontFamilies.robotoMono,
          fontWeight: 'bold',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          textAlign: 'center',
          mb: 2,
        }}
      >
        <Newspaper
          sx={{
            fontSize: 30,
            position: 'absolute',
            left: 20,
            top: 15,
          }}
        />
        3.19 and the new Meta
      </DialogTitle>
      <DialogContent>hello</DialogContent>
      <DialogActions>
        <div style={{ flexGrow: 1 }} />
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
