import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useContext } from 'react'
import { CaptureTypeTitle } from './CameraControl'
import { AddPhotoAlternate, ContentPaste, PrivacyTip, ScreenShare, StopScreenShare } from '@mui/icons-material'
import { Stack } from '@mui/system'
import { PrivacyDialog } from './PrivacyDialog'
import { ScreenshareContext } from '../../context/screenshare.context'
import { CaptureTypeEnum } from './types'
import { KeyShortcut } from '../fields/KeyShortcut'

// export const CaptureTypeTitle: Record<CaptureTypeEnum, string> = {

interface CaptureStartScreenProps {
  // onClose: () => void
  captureType: CaptureTypeEnum
  onFileChooseClick: () => void
}

export const CaptureStartScreen: React.FC<CaptureStartScreenProps> = ({ captureType, onFileChooseClick }) => {
  const theme = useTheme()
  const [privacyDialogOpen, setPrivacyDialogOpen] = React.useState(false)
  const { isScreenSharing, startScreenCapture, stopScreenCapture } = useContext(ScreenshareContext)

  return (
    <Box sx={{ py: 3 }}>
      {/* There are 3 ways to capture data from Star citizen into regolith: Screen sharing, Uploading a screenshot or pasting into this window */}

      <Typography variant="body1" paragraph>
        Regolith cam capture and interpret screenshot data so that you can automatically{' '}
        <strong>{CaptureTypeTitle[captureType]}</strong> data into Regolith. There are 3 ways to capture data from Star
        Citizen into Regolith:
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <ScreenShare />
          </ListItemIcon>
          <ListItemText
            primary="1. Screen Sharing"
            secondary={
              <Stack spacing={1}>
                <Typography variant="body2">
                  This is the best way to capture data. It allows Regolith to see the game screen and extract the data
                  it needs. You will need to give permission to share your screen. When asked, select to share your Star
                  Citizen game window.
                </Typography>
                <Stack direction="row" spacing={1}>
                  {!isScreenSharing ? (
                    <Button variant="outlined" color="primary" startIcon={<ScreenShare />} onClick={startScreenCapture}>
                      Start Screen Sharing
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<StopScreenShare />}
                      onClick={stopScreenCapture}
                    >
                      Stop Screen Sharing
                    </Button>
                  )}
                  <Button color="info" startIcon={<PrivacyTip />} onClick={() => setPrivacyDialogOpen(true)}>
                    Privacy Implications
                  </Button>
                  <PrivacyDialog open={privacyDialogOpen} onClose={() => setPrivacyDialogOpen(false)} />
                </Stack>
              </Stack>
            }
          />
        </ListItem>
        <ListItemButton onClick={onFileChooseClick}>
          <ListItemIcon>
            <IconButton>
              <AddPhotoAlternate />
            </IconButton>
          </ListItemIcon>
          <ListItemText
            primary="2. Upload a Screenshot Image"
            // secondary="Upload a screenshot of the game window. You will be able to crop it before submitting."
            secondary={
              <Stack spacing={1}>
                <Typography variant="body2">Click here to upload a screenshot from your local PC.</Typography>
              </Stack>
            }
          />
        </ListItemButton>
        <ListItem>
          <ListItemIcon>
            <ContentPaste />
          </ListItemIcon>
          <ListItemText
            primary="3. Paste a Screenshot / Image"
            secondary={
              <>
                Use <KeyShortcut keyStr="Ctrl + V" />
                or <KeyShortcut keyStr="Strg + V" /> to paste a screenshot into this window
              </>
            }
          />
        </ListItem>
      </List>
      <Typography variant="body1" color="text.secondary">
        <em>Note: In all 3 cases you will be able to crop it before submitting.</em>
      </Typography>
    </Box>
  )
}
