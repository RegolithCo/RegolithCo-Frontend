import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, useTheme } from '@mui/material'
import React from 'react'
import { CaptureTypeEnum, CaptureTypeTitle } from './CameraControl'
import { AddPhotoAlternate, Camera, UploadFile } from '@mui/icons-material'

// export const CaptureTypeTitle: Record<CaptureTypeEnum, string> = {

interface CameraHelpDialogProps {
  onClose: () => void
  captureType: CaptureTypeEnum
}

export const CameraHelpDialog: React.FC<CameraHelpDialogProps> = ({ onClose, captureType }) => {
  const theme = useTheme()
  return (
    <Dialog
      open={true}
      maxWidth="md"
      fullWidth
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(1px)',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          color: theme.palette.info.contrastText,
          backgroundColor: theme.palette.info.main,
        }}
      >
        <Stack>
          <Typography variant="h6">{CaptureTypeTitle[captureType]}</Typography>
          <Typography variant="body1">Tips and Tricks</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent
        sx={{
          overflowY: 'auto',
        }}
      >
        <Stack spacing={2} sx={{ mt: 3 }}>
          {captureType === CaptureTypeEnum.REFINERY_ORDER && (
            <>
              <Typography variant="body2">
                <b>Don't hit submit!</b> - You must be on the confirmation screen BEFORE hitting submit to capture a
                work order. This is so we can capture the refinery cost and refinining time.
              </Typography>
              <Typography variant="body2">
                <b>Line up the guide</b> - Line up the red guide so that the refinery submission is inside the red box.
              </Typography>
            </>
          )}
          {captureType === CaptureTypeEnum.SHIP_ROCK && (
            <Typography variant="body2">
              <b>Create Contrast</b> - Try to move your ship so that it creates the maximum contrast for the rock scan
              interface.
            </Typography>
          )}
          <Typography variant="body2">
            <b>Snap OR Upload</b> - You can{' '}
            <Camera
              sx={{
                height: 16,
                width: 16,
              }}
            />{' '}
            Capture a photo or{' '}
            <AddPhotoAlternate
              sx={{
                height: 16,
                width: 16,
              }}
            />{' '}
            Upload a screenshot.
          </Typography>
          <Typography variant="body2">
            <b>Crop Screenshots</b> - If you're uploading a screenshot, crop it to just the UI you're trying to scan.
          </Typography>
          <Typography variant="body2">
            <b>Avoid Skew</b> - Try to take the photo directly facing the screen. Perspective skew can make detection
            harder.
          </Typography>
          <Typography variant="body2">
            <b>Turn off Chromatic Aberation</b> - This is a major cause of blurry numbers in Star Citizen.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ok</Button>
      </DialogActions>
    </Dialog>
  )
}
