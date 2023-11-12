import * as React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from '@mui/material'
import { ShareUrlField } from '../fields/ShareUrlField'
import { Diversity3, Share } from '@mui/icons-material'
import { fontFamilies } from '../../theme'
import { Stack } from '@mui/system'

export interface CollaborateModalProps {
  open: boolean
  url: string
  warn?: boolean
  onClose: () => void
}

export const CollaborateModal: React.FC<CollaborateModalProps> = ({ open, url, warn, onClose }) => {
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
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Diversity3
            sx={{
              fontSize: 30,
              mr: 2,
              // position: 'absolute',
              // left: 20,
              // top: 15,
            }}
          />
          <Typography variant="h4">Invite Others</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {warn ? (
          <Alert severity="error">
            <AlertTitle>Warning</AlertTitle>
            <Typography paragraph fontWeight={'bold'}>
              Be careful who you share your sessions with!! Anyone with this URL can join your session.
            </Typography>
            <Typography>
              If you just want to share your session on social media then use the Share icon (<Share />) instead.
            </Typography>
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
