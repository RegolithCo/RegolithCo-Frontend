import {
  Box,
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useContext } from 'react'
import { CaptureTypeTitle } from './CaptureControl'
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
        Regolith can interpret screenshots so that you can automatically{' '}
        <strong>{CaptureTypeTitle[captureType]}</strong> data into Regolith. There are 3 ways to capture data from Star
        Citizen into Regolith:
      </Typography>
      <List
        sx={{
          // Get the primary text elements
          '& .MuiListItemText-primary': {
            color: theme.palette.primary.main,
            fontSize: '1.2rem',
          },
        }}
      >
        <ListItem alignItems="flex-start">
          <ListItemIcon>
            <ScreenShare />
          </ListItemIcon>
          <ListItemText
            primary="1. Screen Sharing"
            secondary={
              <Stack spacing={1}>
                <Typography variant="body2">
                  This is the most convenient way. It allows Regolith to see the game screen and extract the data it
                  needs. You will need to give permission to share your screen. When asked, select to share your Star
                  Citizen game window.
                </Typography>
                <Typography variant="body2" color="secondary">
                  Note: Screen sharing persists until you turn it off. This is so you can easily take multiple data
                  points without needing to re-share your screen.
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
        <ListItem alignItems="flex-start">
          <ListItemIcon>
            <ContentPaste />
          </ListItemIcon>
          <ListItemText
            primary="2. Copy & Paste a Screenshot / Image"
            secondary={
              <Stack spacing={1}>
                <Typography variant="body2" paragraph>
                  Inside Star citizen use <KeyShortcut keyStr="Alt + PrintScreen" /> to copy a screenshot to your
                  clipboard. Then in Regolith use <KeyShortcut keyStr="Ctrl + V" />
                  or <KeyShortcut keyStr="Strg + V" /> to paste a screenshot into this window.{' '}
                  <Link
                    href="https://support.microsoft.com/en-us/office/copy-the-window-or-screen-contents-98c41969-51e5-45e1-be36-fb9381b32bb7#:~:text=Copy%20only%20the%20image%20of%20the%20active%20window&text=Press%20ALT%2BPRINT%20SCREEN.,Office%20program%20or%20other%20application."
                    target="_blank"
                  >
                    Read more about the Print Screen Key here
                  </Link>
                </Typography>
                <Typography variant="body2" color="secondary">
                  Pro tip: Pasting screenshots works from anywhere inside an active session
                </Typography>
              </Stack>
            }
          />
        </ListItem>
        <ListItemButton onClick={onFileChooseClick} alignItems="flex-start">
          <ListItemIcon>
            <IconButton>
              <AddPhotoAlternate />
            </IconButton>
          </ListItemIcon>
          <ListItemText
            primary="3. Upload a Screenshot Image"
            // secondary="Upload a screenshot of the game window. You will be able to crop it before submitting."
            secondary={
              <Stack spacing={1}>
                <Typography variant="body2">Click here to upload a screenshot from your local PC.</Typography>
              </Stack>
            }
          />
        </ListItemButton>
      </List>
      <Typography variant="body1" color="text.secondary">
        <em>Note: In all 3 cases you will be able to crop it before submitting.</em>
      </Typography>
    </Box>
  )
}
