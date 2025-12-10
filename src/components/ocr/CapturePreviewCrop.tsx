import { Box, Button, Chip, DialogActions, IconButton, Tooltip, Typography, useTheme } from '@mui/material'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import ReactCrop, { Crop } from 'react-image-crop'
import { ScreenshareContext } from '../../context/screenshare.context'

// Crop needs some very particular CSS that is not included in the MUI theme
import 'react-image-crop/dist/ReactCrop.css'
import useLocalStorage from '../../hooks/useLocalStorage'
import {
  AddPhotoAlternate,
  Clear,
  Crop as CropIcon,
  DocumentScanner,
  ScreenShare,
  SelectAll,
  StopScreenShare,
} from '@mui/icons-material'
import { CaptureTypeEnum } from './types'
import { isEqual } from 'lodash'
import log from 'loglevel'

interface CapturePreviewCropProps {
  imageUrl?: string | null // This is the URL-encoded image
  captureType: CaptureTypeEnum
  clearImage: () => void
  chooseFileClick: () => void
  onSubmit: (image: string | null) => void
}

type CropLookups = {
  [CaptureTypeEnum.REFINERY_ORDER]: Crop
  [CaptureTypeEnum.SHIP_ROCK]: Crop
}

export const defaultCrops: CropLookups = {
  [CaptureTypeEnum.REFINERY_ORDER]: {
    unit: '%',
    width: 50,
    height: 100,
    x: 0,
    y: 0,
  },
  [CaptureTypeEnum.SHIP_ROCK]: {
    unit: '%',
    width: 20,
    height: 40,
    x: 60,
    y: 20,
  },
}

export const CapturePreviewCrop: React.FC<CapturePreviewCropProps> = ({
  captureType,
  imageUrl,
  onSubmit,
  chooseFileClick,
  clearImage,
}) => {
  const theme = useTheme()
  const cropRef = React.useRef<ReactCrop>(null)
  const videoRef = React.useRef<HTMLVideoElement>({} as HTMLVideoElement)
  const [storedVal, setStoredVal] = useLocalStorage<CropLookups>('crops', defaultCrops)
  // Do a deep compare of storedCrops to the defaultCrops using lodash and detect if there's difference
  const isDifferentCrop = useMemo(() => !isEqual(storedVal, defaultCrops), [storedVal])

  const [crop, setCrop] = useState<Crop>(storedVal[captureType] || defaultCrops[captureType])
  const { startPreview, stopPreview, isScreenSharing, stopScreenCapture, startScreenCapture } =
    useContext(ScreenshareContext)
  const isSelectingAll = crop.width === 0 && crop.height === 0

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onSubmitClick()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // If the image changes then we reset the crop. Hopefully this isn't too annoying
  useEffect(() => {
    if (!cropRef.current) return
    if (storedVal[captureType]) {
      // Check to make sure the crop isn't off the image
      const box = cropRef.current.getBox()
      if (crop.x > box.width || crop.y > box.height) {
        setCrop(defaultCrops[captureType])
      } else {
        setCrop(storedVal[captureType])
      }
    } else {
      setCrop(storedVal[captureType] || defaultCrops[captureType])
    }
  }, [imageUrl, videoRef?.current, isScreenSharing])

  useEffect(() => {
    if (imageUrl) return
    if (isScreenSharing) {
      startPreview(videoRef)
    } else {
      stopPreview(videoRef)
    }
    return () => {
      stopPreview(videoRef)
    }
  }, [isScreenSharing, imageUrl])

  const onSubmitClick = useCallback(async () => {
    console.log('DEBUG: CapturePreviewCrop onSubmitClick')
    // First we need to choose if the image is coming from the imageUrl or from the screen share
    let processImg = imageUrl

    // If we're capturing the streaming output then we need to convert the video to an image
    if (!processImg && videoRef?.current) {
      const video = videoRef.current
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the current frame of the video on the canvas
      const context = canvas.getContext('2d')
      if (!context) {
        log.error('No 2d context')
        return
      }
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert the canvas to an image URL
      processImg = canvas.toDataURL('image/png')
    }

    if (!processImg || processImg.length === 0 || !cropRef.current) {
      log.error('No image to process')
      return
    }

    // Create a phantom image to process the crop
    const ghostImage = new Image()
    ghostImage.src = processImg || ''
    // Wait for the image to load
    await new Promise((resolve, reject) => {
      ghostImage.onload = resolve
      ghostImage.onerror = reject
    })
    if (crop.height === 0 && crop.width === 0) {
      // Submit the image as is
      return onSubmit(processImg)
    }
    let cropX = 0
    let cropY = 0
    let cropWidth = 0
    let cropHeight = 0

    if (crop.unit === 'px') {
      const cropBox = cropRef.current?.getBox()
      const scaleX = ghostImage.naturalWidth / cropBox.width
      const scaleY = ghostImage.naturalHeight / cropBox.height

      const finalWidth = crop.width === 0 ? ghostImage.naturalWidth : crop.width
      const finalHeight = crop.height === 0 ? ghostImage.naturalHeight : crop.height
      const finalX = crop.width === 0 ? 0 : crop.x
      const finalY = crop.height === 0 ? 0 : crop.y

      cropX = finalX * scaleX
      cropY = finalY * scaleY
      cropWidth = finalWidth * scaleX
      cropHeight = finalHeight * scaleY
    } else if (crop.unit === '%') {
      cropX = (crop.x * ghostImage.naturalWidth) / 100
      cropY = (crop.y * ghostImage.naturalHeight) / 100
      cropWidth = (crop.width * ghostImage.naturalWidth) / 100
      cropHeight = (crop.height * ghostImage.naturalHeight) / 100
    }

    const offscreen = new OffscreenCanvas(cropWidth, cropHeight)
    const ctx = offscreen.getContext('2d')
    if (!ctx) {
      throw new Error('No 2d context')
    }
    ctx.drawImage(ghostImage, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

    // You might want { type: "image/jpeg", quality: <0 to 1> } to reduce image size.
    const blobUrl = await offscreen
      .convertToBlob({
        type: 'image/jpeg',
        quality: 0.6,
      })
      .then((blob) => {
        const reader = new FileReader()
        const readPromise = new Promise<string>((resolve, reject) => {
          reader.onload = (event) => {
            const base64Url = event.target?.result as string
            resolve(base64Url) // Display the base64-encoded image preview
          }
          reader.onerror = reject
        })
        reader.readAsDataURL(blob)
        return readPromise
      })
    onSubmit(blobUrl)
  }, [crop, cropRef.current])

  return (
    <>
      <Box
        sx={{
          //
          py: 3,
          position: 'relative',
          maxHeight: 'calc(100vh - 200px)',
          maxWidth: 'calc(100vw - 100px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="body1"
          paragraph
          sx={{
            width: '100%',
            textAlign: 'left',
          }}
        >
          {captureType === CaptureTypeEnum.REFINERY_ORDER &&
            'Tip: Crops do not need to be exact. Try to include the entire work order (including buttons) and the refinery name.'}
          {captureType === CaptureTypeEnum.SHIP_ROCK &&
            'Tip: Crops do not need to be exact. Try to scoop up Mass, Resistance, Instability and all the ore % values'}
        </Typography>
        <ReactCrop
          ref={cropRef}
          crop={crop}
          style={{
            border: `2px solid ${theme.palette.primary.main}`,
          }}
          minHeight={50}
          minWidth={50}
          onChange={(c) => {
            setCrop(c)
            setStoredVal({ ...(storedVal || defaultCrops), [captureType]: c })
          }}
        >
          {!imageUrl && isScreenSharing && (
            <video ref={videoRef} style={{ width: '100%', height: '100%' }} autoPlay muted />
          )}
          {imageUrl && <img src={imageUrl} style={{ width: '100%', height: '100%' }} />}
        </ReactCrop>

        {isSelectingAll && (
          <Chip
            label="NO CROP"
            color="success"
            sx={{
              position: 'absolute',
              zIndex: 1000,
              top: 40,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            component="div"
          />
        )}
      </Box>
      <DialogActions>
        {imageUrl && (
          <Button variant="contained" color="error" startIcon={<Clear />} onClick={clearImage}>
            Clear
          </Button>
        )}
        <Button variant="contained" color="info" startIcon={<AddPhotoAlternate />} onClick={chooseFileClick}>
          Choose File
        </Button>
        <Button
          disabled={!isDifferentCrop}
          variant="text"
          color="primary"
          startIcon={<CropIcon />}
          onClick={() => {
            setCrop(defaultCrops[captureType])
            setStoredVal({ ...(storedVal || defaultCrops), [captureType]: defaultCrops[captureType] })
          }}
        >
          Reset Crop
        </Button>
        <Button
          variant="text"
          color="primary"
          startIcon={<SelectAll />}
          onClick={() => {
            setCrop({
              unit: 'px',
              width: 0,
              height: 0,
              x: 0,
              y: 0,
            })
            setStoredVal({ ...(storedVal || defaultCrops), [captureType]: defaultCrops[captureType] })
          }}
        >
          No Crop
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        {isScreenSharing && !imageUrl && (
          <>
            <Typography variant="overline" color="white">
              Screen Sharing:
            </Typography>
            <Tooltip title="Share a different window">
              <IconButton
                color="secondary"
                onClick={() => {
                  stopScreenCapture()
                  startScreenCapture()
                }}
              >
                <ScreenShare />
              </IconButton>
            </Tooltip>
            <Tooltip title="Stop Screen Sharing">
              <IconButton color="error" onClick={stopScreenCapture}>
                <StopScreenShare />
              </IconButton>
            </Tooltip>
          </>
        )}
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="contained" color="success" startIcon={<DocumentScanner />} onClick={onSubmitClick}>
          Submit
        </Button>
      </DialogActions>
    </>
  )
}
