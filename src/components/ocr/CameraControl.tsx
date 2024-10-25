import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  PaletteColor,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useState, useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import { useCaptureRefineryOrderLazyQuery, useCaptureShipRockScanLazyQuery } from '../../schema'
import { alpha, keyframes, Stack } from '@mui/system'
import { ShipMiningOrder, ShipRock } from '@regolithco/common'
import { ObjectValues } from '@regolithco/common/dist/types'
import { AddPhotoAlternate, Camera, Check, Clear, Publish, Replay, TipsAndUpdatesOutlined } from '@mui/icons-material'
import { CameraHelpDialog } from './CameraHelpDialog'
import { DeviceTypeEnum, useDeviceType } from '../../hooks/useDeviceType'

export const CaptureTypeEnum = {
  SHIP_ROCK: 'SHIP_ROCK',
  REFINERY_ORDER: 'REFINERY_ORDER',
} as const
export type CaptureTypeEnum = ObjectValues<typeof CaptureTypeEnum>

export const CaptureStepEnum = {
  CAPTURE: 'CAPTURE',
  SUBMIT: 'SUBMIT',
  APPROVE: 'APPROVE',
} as const
export type CaptureStepEnum = ObjectValues<typeof CaptureStepEnum>

export const CaptureTypeTitle: Record<CaptureTypeEnum, string> = {
  SHIP_ROCK: 'Capture Rock Scan',
  REFINERY_ORDER: 'Capture Refinery Order',
}

const Steps: Record<CaptureStepEnum, [React.ReactNode, string]> = {
  CAPTURE: [<Camera />, 'Capture'],
  SUBMIT: [<Publish />, 'Submit'],
  APPROVE: [<Check />, 'Approve'],
}
const StepOrder: CaptureStepEnum[] = ['CAPTURE', 'SUBMIT', 'APPROVE']

export interface CameraControlProps {
  onClose: () => void
  mode: 'Camera' | 'File'
  onCapture: <T extends ShipRock | ShipMiningOrder>(retVal: T) => void
  captureType: CaptureTypeEnum
}

export const CameraControl: React.FC<CameraControlProps> = ({ onClose, captureType, onCapture, mode }) => {
  const camera = useRef<Webcam & HTMLVideoElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [showError, setShowError] = useState<string | null>(null)
  const [helpOpen, setHelpOpen] = useState(false)
  const [step, setStep] = useState(0)
  const theme = useTheme()
  // I need a media query to detect if this is a mobile device or a desktop
  const isPhone = useDeviceType() === DeviceTypeEnum.PHONE

  const [currDevice, setCurrDevice] = React.useState<MediaDeviceInfo>()
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([])

  const cameraReady = !!camera.current && !!camera.current.state.hasUserMedia

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

  useEffect(() => {
    if (image) {
      qryFn({ variables: { imgUrl: image } })
    }
  }, [image])

  const [qryRefineryOrder, { loading: refineryOrderLoading, error: refineryOrderError, data: refineryOrderData }] =
    useCaptureRefineryOrderLazyQuery()
  const [qryShipRockScan, { loading: shipRockScanLoading, error: shipRockScanError, data: shipRockScanData }] =
    useCaptureShipRockScanLazyQuery()

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

  useEffect(() => {
    if (mode === 'File') {
      handleFileDialogClick()
    }
  }, [mode])
  useEffect(() => {
    if (refineryOrderData) {
      const refineryOrder = refineryOrderData.captureRefineryOrder
      onClose()
      onCapture(refineryOrder as ShipMiningOrder)
    }
  }, [refineryOrderData])
  useEffect(() => {
    if (shipRockScanData) {
      const shipRock = shipRockScanData.captureShipRockScan
      onClose()
      onCapture(shipRock as ShipRock)
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
    <Dialog
      open={true}
      fullScreen={isPhone}
      fullWidth
      sx={{}}
      maxWidth="md"
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(5px)',
          },
        },
      }}
    >
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
          <Tooltip title="Capture tips and tricks" placement="top">
            <IconButton onClick={() => setHelpOpen(true)} color="inherit">
              <TipsAndUpdatesOutlined />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose} color="inherit">
            <Clear />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent
        sx={{
          position: 'relative',
          minHeight: 500,
          display: 'flex',
          flexGrow: 1,
          overflow: 'hidden',
          border: '4px solid green',
        }}
      >
        {mode === 'Camera' && StepOrder[step] === CaptureStepEnum.CAPTURE && (
          <Box
            ref={frameRef}
            sx={{
              flexGrow: 1,
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {currDevice ? currDevice.label : 'No Camera Found'}
            </Typography>
            <Box
              sx={{
                height: '90%',
                width: '90%',
                position: 'absolute',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '10px solid red',
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
            <Fab
              color="success"
              variant="extended"
              disabled={loading}
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
          </Box>
        )}
        {mode === 'File' && StepOrder[step] === CaptureStepEnum.CAPTURE && (
          <Box sx={{ flexGrow: 1 }}>
            <Stack
              spacing={1}
              sx={{
                pt: 3,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'left',
                overflow: 'hidden',
              }}
            >
              <Typography variant="body1">Screenshot Tips and Tricks:</Typography>
              <Typography variant="body2" paragraph>
                <b>Crop Screenshots</b> - If you're uploading a screenshot, crop it to just the UI you're trying to
                scan.
              </Typography>
              <Typography variant="body2" paragraph>
                <b>Avoid Skew</b> - Try to take the photo directly facing the screen. Perspective skew can make
                detection harder.
              </Typography>
              <Typography variant="body2" paragraph>
                <b>Turn off Chromatic Aberation</b> - This is a major cause of blurry numbers in Star Citizen.
              </Typography>
            </Stack>
            <Fab
              color="secondary"
              variant="extended"
              disabled={loading}
              onClick={handleFileDialogClick}
              sx={{
                position: 'absolute',
                top: '50%',
                right: '50%',
                transform: 'translate(50%, -50%)',
              }}
            >
              <AddPhotoAlternate /> Choose screenshot
            </Fab>
          </Box>
        )}
        {StepOrder[step] === CaptureStepEnum.SUBMIT && (
          <Box
            sx={{
              flexGrow: 1,
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                zIndex: 5,
              }}
            >
              <CircularProgress size={100} thickness={10} sx={{}} />
              <Typography
                color={theme.palette.primary.contrastText}
                variant="h6"
                sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              >
                Submitting...
              </Typography>
            </Box>
            {showError && <Box sx={{ color: 'red', position: 'absolute', zIndex: 10 }}>{showError}</Box>}
            {image && (
              <img
                src={image}
                alt="Taken photo"
                style={{
                  zIndex: 1,
                  height: '100%',
                  width: 'auto',
                  objectFit: 'contain', // Ensure the image maintains its aspect ratio
                  backgroundColor: 'black', // Ensure the background is black
                }}
              />
            )}
            <Fab
              color="success"
              variant="extended"
              disabled={loading || !image}
              onClick={() => {
                qryFn({ variables: { imgUrl: image as string } })
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
          </Box>
        )}
        {StepOrder[step] === CaptureStepEnum.APPROVE && <Box sx={{ flexGrow: 1 }}>APPROVE</Box>}
      </DialogContent>
    </Dialog>
  )
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
