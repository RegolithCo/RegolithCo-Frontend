import { Box, Button, Dialog, DialogTitle, Typography } from '@mui/material'
import React, { useState, useRef, useEffect } from 'react'
import Webcam, { WebcamProps } from 'react-webcam'
import { useCaptureRefineryOrderLazyQuery, useCaptureShipRockScanLazyQuery } from '../../schema'
import { Stack } from '@mui/system'
import { ShipMiningOrder, ShipRock } from '@regolithco/common'
import { ObjectValues } from '@regolithco/common/dist/types'

export const CaptureTypeEnum = {
  SHIP_ROCK: 'SHIP_ROCK',
  REFINERY_ORDER: 'REFINERY_ORDER',
} as const
export type CaptureTypeEnum = ObjectValues<typeof CaptureTypeEnum>

interface CameraControlProps {
  onClose: () => void
  onCapture: <T extends ShipRock | ShipMiningOrder>(retVal) => T
  captureType: CaptureTypeEnum
}

export const CameraControl: React.FC<CameraControlProps> = ({ onClose, captureType, onCapture }) => {
  const camera = useRef<Webcam & HTMLVideoElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [showError, setShowError] = useState<string | null>(null)

  const capture = React.useCallback(() => {
    if (camera.current) {
      const imageSrc = camera.current.getScreenshot({
        width: 720,
        height: 1024,
      })
      setImage(imageSrc)
    }
  }, [camera])

  const [qryRefineryOrder, { loading: refineryOrderLoading, error: refineryOrderError, data: refineryOrderData }] =
    useCaptureRefineryOrderLazyQuery()
  const [qryShipRockScan, { loading: shipRockScanLoading, error: shipRockScanError, data: shipRockScanData }] =
    useCaptureShipRockScanLazyQuery()

  const isLoading = refineryOrderLoading || shipRockScanLoading

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleButtonClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = handleFileChange
    input.click()
  }

  let guideUrl = ''
  let qryFn = qryShipRockScan
  switch (captureType) {
    case CaptureTypeEnum.SHIP_ROCK:
      guideUrl = '/images/capture/ScoutCaptureGuide.svg'
      qryFn = qryShipRockScan
      break
    case CaptureTypeEnum.REFINERY_ORDER:
      guideUrl = '/images/capture/RefineryCaptureGuide.svg'
      qryFn = qryRefineryOrder
      break
  }

  useEffect(() => {
    if (refineryOrderData) {
      const refineryOrder = refineryOrderData.captureRefineryOrder
      onClose()
      onCapture(refineryOrder)
    }
  }, [refineryOrderData])
  useEffect(() => {
    if (shipRockScanData) {
      const shipRock = shipRockScanData.captureShipRockScan
      onClose()
      onCapture(shipRock)
    }
  }, [shipRockScanData])
  useEffect(() => {
    if (refineryOrderError || shipRockScanError) {
      setShowError(refineryOrderError?.message || shipRockScanError?.message || 'Unknown Error')
    } else {
      setShowError(null)
    }
  }, [refineryOrderError, shipRockScanError])

  return (
    <Dialog open={true} fullScreen fullWidth>
      <DialogTitle>
        <Stack
          spacing={2}
          direction="row"
          sx={{
            width: '100%',
          }}
        >
          <Typography variant="h6">{captureType}</Typography>
          <Button size="small" variant="contained" onClick={onClose}>
            X
          </Button>
          {image && (
            <Button size="small" variant="contained" onClick={() => setImage(null)}>
              Take Again
            </Button>
          )}
          {!image && (
            <Button size="small" variant="contained" onClick={() => (camera.current as CameraType).switchCamera()}>
              Swap
            </Button>
          )}
          {!image && (
            <Button size="small" variant="contained" onClick={() => capture()}>
              CAPTURE
            </Button>
          )}
          {!image && (
            <Button size="small" variant="contained" onClick={handleButtonClick}>
              Load
            </Button>
          )}
          {image && (
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                qryFn({ variables: { imgUrl: image } })
              }}
            >
              Send
            </Button>
          )}
        </Stack>
      </DialogTitle>
      {showError && <Box sx={{ color: 'red' }}>{showError}</Box>}
      <Box
        sx={{
          border: '10px solid green',
          height: '100%',
          width: '100%',
        }}
      >
        {!image && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '10px solid red',
              position: 'absolute',
            }}
          >
            <img
              src={guideUrl}
              alt="Capture Guide"
              style={{
                height: '100%',
                width: '100%',
                opacity: 0.4,
                objectFit: 'contain',
              }}
            />
          </Box>
        )}
        {!image ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
              position: 'absolute',
            }}
          >
            <Webcam
              ref={camera}
              audio={false}
              height={1024}
              width={720}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.8}
              videoConstraints={{
                facingMode: 'environment',
                width: 720,
                height: 1024,
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
              position: 'absolute',
              border: '10px solid black',
            }}
          >
            <img src={image} alt="Taken photo" />
          </Box>
        )}
      </Box>
    </Dialog>
  )
}
