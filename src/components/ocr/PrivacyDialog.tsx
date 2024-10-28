import { PrivacyTip } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

// export const CaptureTypeTitle: Record<CaptureTypeEnum, string> = {

interface PrivacyDialogProps {
  open: boolean
  onClose: () => void
}

export const PrivacyDialog: React.FC<PrivacyDialogProps> = ({ open, onClose }) => {
  const theme = useTheme()
  return (
    <Dialog
      open={open}
      maxWidth="sm"
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
        <Stack direction="row" alignItems="center" spacing={2}>
          <PrivacyTip />
          <Typography variant="h5">Screen Sharing and Privacy</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent
        sx={{
          overflowY: 'auto',
        }}
      >
        <Box py={2}>
          <Typography variant="h4">We take your privacy seriously:</Typography>
          <Stack spacing={2} sx={{ mt: 3 }}>
            <Typography variant="body2">
              <b>The Screenshare preview is only local</b> - No data is sent to Regolith servers until you hit the
              "Submit" button. The live screenshare preview is not sent or streamed in any way.
            </Typography>
            <Typography variant="body2">
              <b>We only send the cropped image</b> - If you choose to crop the image before sending we will only send
              the image data inside that crop. If you do not crop the image we will send the entire image.
            </Typography>
            <Typography variant="body2">
              <b>No other OCR is done</b> - The only analysis we perform on the image is what we send back to you. We do
              not analyze the image for any other data and everything we detect we send back and show to you.
            </Typography>
            <Typography variant="body2">
              <b>No image data is ever stored</b> - Regolith sends cropped image you submit to Amazon Textract for
              analysis. After that the image data is deleted. Regolith does not store your screenshots, only the
              analized Work Orders and Scouted rocks detected in those images.
            </Typography>
            <Typography variant="body2">
              <b>Amazon Textract</b> - Regolith uses Amazon Textract to analyze the images you submit. Amazon Textract
              is a secure and reliable service provided by Amazon Web Services. You can read more in their{' '}
              <Link href="https://aws.amazon.com/textract/faqs/" target="_blank">
                FAQ
              </Link>
              , specically the section marked "Data Privacy"
            </Typography>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>close</Button>
      </DialogActions>
    </Dialog>
  )
}
