import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { BugReport } from '@mui/icons-material'
import { useSubmitOcrImageLazyQuery } from '../../schema/apollo'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { CaptureTypeEnum } from './types'
import { CaptureTypeEnum as GQLCaptureTypeEnum, JSONObject } from '@regolithco/common'
import { fontFamilies } from '../../theme'

interface SubmitOCRImageButtonProps {
  imageUrl: string | null
  context: JSONObject
  captureType: CaptureTypeEnum
  sessionId: string
}

export const SubmitOCRImageButton: React.FC<SubmitOCRImageButtonProps> = ({
  imageUrl,
  captureType,
  sessionId,
  context,
}) => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const [getSignedUrl] = useSubmitOcrImageLazyQuery()

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setMessage('')
  }

  const handleSubmit = async () => {
    if (!imageUrl) return

    setSubmitting(true)
    try {
      const gqlCaptureType =
        captureType === CaptureTypeEnum.SHIP_ROCK
          ? GQLCaptureTypeEnum.ShipRockCapture
          : GQLCaptureTypeEnum.ShipMiningOrderCapture

      const { data, error } = await getSignedUrl({
        variables: {
          sessionId,
          captureType: gqlCaptureType,
          metadata: { message, data: context, captureType },
        },
      })

      if (error) {
        throw error
      }

      const signedUrl = data?.submitOCRImage
      if (!signedUrl) {
        throw new Error('Failed to get signed URL')
      }

      // Convert base64 to blob if necessary
      let uploadData: Blob | string = imageUrl
      if (imageUrl.startsWith('data:')) {
        const response = await fetch(imageUrl)
        uploadData = await response.blob()
      }

      // Upload to S3
      await axios.put(signedUrl, uploadData, {
        headers: {
          'Content-Type': 'image/png',
        },
      })

      enqueueSnackbar('Capture submitted for review. Thank you!', { variant: 'success' })
      handleClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit image. Please try again.'
      console.error('Error submitting OCR image:', err)
      enqueueSnackbar(message, { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Tooltip title="If OCR failed, submit this image to the developers for review.">
        <Button variant="outlined" color="error" startIcon={<BugReport />} onClick={handleOpen} disabled={!sessionId}>
          Report OCR failure
        </Button>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            fontFamily: fontFamilies.robotoMono,
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
          }}
        >
          Report OCR failure
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ my: 2 }}>
            Help us understand why the image failed by submitting it to the developers.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Optional message (e.g. what went wrong?)"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={submitting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="info"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <BugReport />}
          >
            {submitting ? 'Submitting...' : 'Submit Image'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
