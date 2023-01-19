import * as React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from '@mui/material'
import { ShareUrlField } from '../fields/ShareUrlField'
import { Share, ShareLocation } from '@mui/icons-material'

export interface ShareModalProps {
  open: boolean
  url: string
  warn?: boolean
  onClose: () => void
}

export const ShareModal: React.FC<ShareModalProps> = ({ open, url, warn, onClose }) => {
  const theme = useTheme()
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle
        sx={{
          position: 'relative',
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          paddingLeft: 10,
          mb: 2,
        }}
      >
        <Share
          sx={{
            fontSize: 30,
            position: 'absolute',
            left: 20,
            top: 15,
          }}
        />
        Session Sharing
      </DialogTitle>
      <DialogContent>
        {warn ? (
          <Alert severity="error">
            Be careful who you share your sessions with. Anyone with this URL can join your session.
          </Alert>
        ) : (
          <Typography>Send this link to anyone you want to join your session.</Typography>
        )}

        <QRCodeSVG
          value={url}
          style={{
            display: 'block',
            border: '10px solid white',
            margin: '1rem auto',
            height: 200,
            width: 200,
          }}
        />
        <ShareUrlField code={url} />
      </DialogContent>
      <DialogActions>
        <div style={{ flexGrow: 1 }} />
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
