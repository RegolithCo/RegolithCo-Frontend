import * as React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
} from '@mui/material'
import { ShareUrlField } from '../fields/ShareUrlField'
import { fontFamilies } from '../../theme'
import { CollaborateLinkIcon, ExportImageIcon } from '../../icons/badges'

export interface CollaborateModalProps {
  open: boolean
  url: string
  warn?: boolean
  onClose: () => void
}

export const CollaborateModal: React.FC<CollaborateModalProps> = ({ open, url, warn, onClose }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isSmall}
      sx={{
        '& .MuiDialog-paper': {
          [theme.breakpoints.up('md')]: {
            borderRadius: 10,
            boxShadow: `0px 0px 20px 5px ${theme.palette.primary.light}, 0px 0px 60px 40px black`,
            border: `10px solid ${theme.palette.primary.main}`,
          },
          background: theme.palette.background.default,
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
          <CollaborateLinkIcon
            sx={{
              fontSize: {
                xs: '1.5rem',
                sm: '2rem',
              },
              mr: 2,
              // position: 'absolute',
              // left: 20,
              // top: 15,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontSize: {
                xs: '1.5rem',
                sm: '2rem',
              },
            }}
          >
            Invite Others
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {warn ? (
          <Alert severity="error" variant="filled">
            <Typography paragraph fontWeight={'bold'}>
              Be careful who you share your sessions with!! Anyone with the URL below can join your session. If you just
              want to share your session on social media then use the image export icon (<ExportImageIcon />) instead.
            </Typography>
          </Alert>
        ) : (
          <Typography>Send this link to anyone you want to join your session.</Typography>
        )}
        <Stack sx={{ mt: 2 }}>
          <Typography variant="caption" component="div">
            Use this link in social apps like discord
          </Typography>
          <ShareUrlField code={url} />
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
        </Stack>
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
