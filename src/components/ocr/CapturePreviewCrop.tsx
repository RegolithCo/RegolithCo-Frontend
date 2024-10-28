import { Box, Button, Chip, DialogActions, Typography, useTheme } from '@mui/material'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import ReactCrop, { Crop } from 'react-image-crop'
import { ScreenshareContext } from '../../context/screenshare.context'

// Crop needs some very particular CSS that is not included in the MUI theme
import 'react-image-crop/dist/ReactCrop.css'
import useLocalStorage from '../../hooks/useLocalStorage'
import { Clear, Crop as CropIcon, StopScreenShare } from '@mui/icons-material'
import { CaptureTypeEnum } from './types'
import { isEqual } from 'lodash'
import log from 'loglevel'

interface CapturePreviewCropProps {
  image?: string | null // This is the URL-encoded image
  captureType: CaptureTypeEnum
  clearImage: () => void
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

export const CapturePreviewCrop: React.FC<CapturePreviewCropProps> = ({ captureType, image, onSubmit, clearImage }) => {
  const theme = useTheme()
  const [storedVal, setStoredVal] = useLocalStorage<CropLookups>('crops', defaultCrops)
  // Do a deep compare of storedCrops to the defaultCrops using lodash and detect if there's difference
  const isDifferentCrop = useMemo(() => !isEqual(storedVal, defaultCrops), [storedVal])

  const [crop, setCrop] = useState<Crop>(storedVal[captureType] || defaultCrops[captureType])
  const { videoRef, isScreenSharing, stopScreenCapture } = useContext(ScreenshareContext)
  const isSelectingAll = crop.width === 0 && crop.height === 0

  // If the image changes then we reset the crop. Hopefully this isn't too annoying
  useEffect(() => {
    if (image) {
      setCrop(storedVal[captureType] || defaultCrops[captureType])
    }
  }, [image])

  return (
    <>
      <Box
        sx={{
          //
          py: 3,
          position: 'relative',
          maxHeight: 'calc(100vh - 200px)',
          maxWidth: 'calc(100vw - 100px)',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ReactCrop
          crop={crop}
          onChange={(c) => {
            setCrop(c)
            setStoredVal({ ...(storedVal || defaultCrops), [captureType]: c })
          }}
        >
          {!image && isScreenSharing && (
            <video ref={videoRef} style={{ width: '100%', height: '100%' }} autoPlay muted />
          )}
          {image && <img src={image} style={{ width: '100%', height: '100%' }} />}
        </ReactCrop>
        <Typography
          variant="caption"
          color="red"
          textAlign={'center'}
          sx={{
            position: 'absolute',
            zIndex: 1000,
            top: 30,
            left: '50%',
            width: '100%',
            transform: 'translateX(-50%)',
          }}
          component="div"
        >
          {captureType === CaptureTypeEnum.REFINERY_ORDER && 'Try to capture everything'}
          {captureType === CaptureTypeEnum.SHIP_ROCK &&
            'Crops do not need to be exact. Try to include Mass, Resistance, Instability and all the ore % values'}
        </Typography>
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
        {image && (
          <Button variant="contained" color="error" startIcon={<Clear />} onClick={clearImage}>
            Discard Image
          </Button>
        )}
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
          Reset Crop to defaults
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        {isScreenSharing && (
          <Button variant="outlined" color="secondary" startIcon={<StopScreenShare />} onClick={stopScreenCapture}>
            Stop Screen Sharing
          </Button>
        )}

        <Button>Submit</Button>
      </DialogActions>
    </>
  )
}
