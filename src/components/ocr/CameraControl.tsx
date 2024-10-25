import {
  Box,
  Dialog,
  DialogTitle,
  Fab,
  IconButton,
  PaletteColor,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useState, useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import { useCaptureRefineryOrderLazyQuery, useCaptureShipRockScanLazyQuery } from '../../schema'
import { alpha, keyframes, Stack } from '@mui/system'
import { ShipMiningOrder, ShipRock } from '@regolithco/common'
import { ObjectValues } from '@regolithco/common/dist/types'
import { AddPhotoAlternate, Camera, Check, Clear, DocumentScanner, Info, Publish, Replay } from '@mui/icons-material'
import { CameraHelpDialog } from './ComeraHelpDialog'

export const CaptureTypeEnum = {
  SHIP_ROCK: 'SHIP_ROCK',
  REFINERY_ORDER: 'REFINERY_ORDER',
} as const
export type CaptureTypeEnum = ObjectValues<typeof CaptureTypeEnum>

export const CaptureTypeTitle: Record<CaptureTypeEnum, string> = {
  SHIP_ROCK: 'Capture Rock Scan',
  REFINERY_ORDER: 'Capture Refinery Order',
}

const Steps = {
  CAPTURE: [<DocumentScanner />, 'Capture'],
  SUBMIT: [<Publish />, 'Submit'],
  APPROVE: [<Check />, 'Approve'],
}
const StepOrder = ['CAPTURE', 'SUBMIT', 'APPROVE']

interface CameraControlProps {
  onClose: () => void
  onCapture: <T extends ShipRock | ShipMiningOrder>(retVal) => T
  captureType: CaptureTypeEnum
}

const pulse = (color: PaletteColor) => keyframes`
0% { 
  box-shadow: 0 0 0 0 transparent; 
  background-color: ${color.dark} 
}
50% { 
  box-shadow: 0 0 5px 5px ${alpha(color.light, 0.5)}; 
  background-color: ${color.light} 
}
100% { 
  box-shadow: 0 0 0 0 transparent; 
  background-color:  ${color.dark}
}
`

export const CameraControl: React.FC<CameraControlProps> = ({ onClose, captureType, onCapture }) => {
  const camera = useRef<Webcam & HTMLVideoElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [showError, setShowError] = useState<string | null>(null)
  const [helpOpen, setHelpOpen] = useState(false)
  const [step, setStep] = useState(0)
  const theme = useTheme()

  const [currDevice, setCurrDevice] = React.useState<MediaDeviceInfo>()
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([])

  const cameraReady = !!camera.current && !!camera.current.video

  const { previeWith, previewHeight, imgWidth, imgHeight } = React.useMemo(() => {
    const { width, height } = frameRef.current?.getBoundingClientRect() || { width: 512, height: 512 }
    const previeWith = width
    const previewHeight = width * (4 / 3)
    const imgWidth = 1024
    const imgHeight = 1024 * (4 / 3)
    return { previeWith, previewHeight, imgWidth, imgHeight }
  }, [frameRef.current])

  // const handleDevices = React.useCallback(
  //   (mediaDevices: MediaDeviceInfo[]) => {
  //     setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput'))
  //     if (!currDevice && mediaDevices.length > 0) {
  //       setCurrDevice(mediaDevices[0])
  //     }
  //   },
  //   [setDevices]
  // )

  // React.useEffect(() => {
  //   navigator.mediaDevices.enumerateDevices().then(handleDevices)
  // }, [handleDevices])

  const capture = React.useCallback(() => {
    if (camera.current) {
      const imageSrc = camera.current.getScreenshot({
        width: imgWidth,
        height: imgHeight,
      })
      setImage(imageSrc)
      setStep(1)
    }
  }, [camera, imgWidth, imgHeight])

  const [qryRefineryOrder, { loading: refineryOrderLoading, error: refineryOrderError, data: refineryOrderData }] =
    useCaptureRefineryOrderLazyQuery()
  const [qryShipRockScan, { loading: shipRockScanLoading, error: shipRockScanError, data: shipRockScanData }] =
    useCaptureShipRockScanLazyQuery()

  const loading = refineryOrderLoading || shipRockScanLoading

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

  const handleFileDialogClick = () => {
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
    <Dialog open={true} fullScreen fullWidth sx={{}}>
      {helpOpen && <CameraHelpDialog onClose={() => setHelpOpen(false)} captureType={captureType} />}
      <DialogTitle
        sx={{
          color: theme.palette.primary.contrastText,
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Stack
          spacing={2}
          direction="row"
          sx={{
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography variant="h6">{CaptureTypeTitle[captureType]}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={() => setHelpOpen(true)} color="inherit">
            <Info />
          </IconButton>
          <IconButton onClick={onClose} color="inherit">
            <Clear />
          </IconButton>
        </Stack>
      </DialogTitle>
      {showError && <Box sx={{ color: 'red' }}>{showError}</Box>}
      <Box
        ref={frameRef}
        sx={{
          position: 'relative',
          flexGrow: 1,
        }}
      >
        <Stepper
          activeStep={step}
          sx={{
            zIndex: 1000,
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {StepOrder.map((label) => (
            <Step key={label} color="info">
              <StepLabel>{Steps[label][1]}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Typography variant="h6">{currDevice ? currDevice.label : 'No Camera Found'}</Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            zIndex: 1,
            overflow: 'hidden',
            position: 'absolute',
          }}
        >
          {image ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                position: 'absolute',
                border: '10px solid black',
                backgroundColor: 'black', // Ensure the background is black
              }}
            >
              <img
                src={image}
                alt="Taken photo"
                style={{
                  height: '100%',
                  width: 'auto',
                  objectFit: 'contain', // Ensure the image maintains its aspect ratio
                  backgroundColor: 'black', // Ensure the background is black
                }}
              />
            </Box>
          ) : (
            <>
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
                  style={{
                    height: '100%',
                    width: '100%',
                    opacity: 0.4,
                  }}
                />
              </Box>
              <Webcam
                ref={camera}
                audio={false}
                height={previewHeight}
                width={previeWith}
                screenshotFormat="image/jpeg"
                screenshotQuality={0.2}
                videoConstraints={{
                  deviceId: currDevice?.deviceId,
                  facingMode: 'environment',
                  width: imgWidth,
                  height: imgHeight,
                }}
              />
            </>
          )}
        </Box>
        {!image && (
          <>
            <Fab
              color="success"
              variant="extended"
              disabled={loading || !cameraReady}
              onClick={() => capture()}
              sx={{
                // Give it
                boxShadow: `0 0 10px 10px  ${theme.palette.primary.light}44`,
                backgroundColor: theme.palette.primary.main,
                animation: `${pulse(theme.palette.primary)} 1.5s infinite`,
                position: 'absolute',
                bottom: '20px',
                right: '50%',
                transform: 'translateX(50%)',
              }}
            >
              {Steps.CAPTURE[0]} {Steps.CAPTURE[1]}
            </Fab>
            {/* <Fab
              color="info"
              variant="extended"
              disabled={loading}
              size="small"
              onClick={handleFileDialogClick}
              sx={{
                position: 'absolute',
                top: '20px',
                right: '20px',
              }}
            >
              <AddPhotoAlternate /> Photo Library
            </Fab> */}
          </>
        )}

        {image && (
          <>
            <Fab
              color="success"
              variant="extended"
              disabled={loading}
              onClick={() => {
                qryFn({ variables: { imgUrl: image } })
              }}
              sx={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
              }}
            >
              <Check /> Submit
            </Fab>
            <Fab
              color="secondary"
              onClick={() => {
                setImage(null)
                setStep(0)
              }}
              variant="extended"
              disabled={loading}
              sx={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
              }}
            >
              <Replay /> Try again
            </Fab>
          </>
        )}
      </Box>
    </Dialog>
  )
}
