import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  Fab,
  IconButton,
  PaletteColor,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import Webcam from 'react-webcam'
import { useCaptureRefineryOrderLazyQuery, useCaptureShipRockScanLazyQuery } from '../../schema'
import { alpha, keyframes, Stack } from '@mui/system'
import { ShipMiningOrderCapture, ShipRockCapture } from '@regolithco/common'
import { ObjectValues } from '@regolithco/common/dist/types'
import {
  AddPhotoAlternate,
  Camera,
  Cameraswitch,
  Check,
  Clear,
  Replay,
  TipsAndUpdatesOutlined,
} from '@mui/icons-material'
import { CameraHelpDialog } from './CameraHelpDialog'
import { DeviceTypeEnum, useDeviceType } from '../../hooks/useDeviceType'
import { fontFamilies } from '../../theme'
import log from 'loglevel'
import { ConfirmModal } from '../modals/ConfirmModal'
import { PreviewScoutingRockCapture } from './PreviewScoutingRockCapture'
import { PreviewWorkOrderCapture } from './PreviewWorkOrderCapture'

export const CaptureTypeEnum = {
  SHIP_ROCK: 'SHIP_ROCK',
  REFINERY_ORDER: 'REFINERY_ORDER',
} as const
export type CaptureTypeEnum = ObjectValues<typeof CaptureTypeEnum>

export const CaptureStepEnum = {
  CAPTURE: 'CAPTURE',
  APPROVE: 'APPROVE',
} as const
export type CaptureStepEnum = ObjectValues<typeof CaptureStepEnum>

export const CaptureTypeTitle: Record<CaptureTypeEnum, string> = {
  SHIP_ROCK: 'Capture Rock Scan',
  REFINERY_ORDER: 'Capture Refinery Order',
}

const StepOrder: CaptureStepEnum[] = ['CAPTURE', 'APPROVE']

export interface CameraControlProps {
  onClose: () => void
  confirmOverwrite?: boolean
  mode: 'Camera' | 'File'
  onCapture: <T extends ShipRockCapture | ShipMiningOrderCapture>(retVal: T) => void
  captureType: CaptureTypeEnum
}

export const CameraControl: React.FC<CameraControlProps> = ({
  onClose,
  captureType,
  confirmOverwrite,
  onCapture,
  mode,
}) => {
  const camera = useRef<Webcam & HTMLVideoElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [deviceReady, setDeviceReady] = useState<boolean>(false)
  const [dimensions, setDimensions] = useState({ width: 512, height: 512 })
  const [showError, setShowError] = useState<string | null>(null)
  const [overwriteConfirmOpen, setOverwriteConfirmOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [step, setStep] = useState(0)
  const theme = useTheme()

  // I need a media query to detect if this is a mobile device or a desktop
  const isPhone = useDeviceType() === DeviceTypeEnum.PHONE

  const [currDevice, setCurrDevice] = React.useState<MediaDeviceInfo>()
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([])

  console.log('MARZIPAN', {
    deviceReady,
    dimensions,
  })

  // Get the list of devices and populate our chooser
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((device) => device.kind === 'videoinput')
      setDevices(videoDevices)
      if (!currDevice && videoDevices.length > 0) {
        setCurrDevice(videoDevices[0])
      }
    })
  }, [navigator.mediaDevices])

  /**
   * Detect the frame size and adjust the preview window accordingly
   */
  useEffect(() => {
    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.target === frameRef.current) {
          const { width, height } = entry.contentRect
          setDimensions({ width, height })
        }
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    if (frameRef.current) {
      resizeObserver.observe(frameRef.current)
    }

    return () => {
      if (frameRef.current) {
        resizeObserver.unobserve(frameRef.current)
      }
    }
  }, [frameRef.current])

  const { previeWith, previewHeight, imgWidth, imgHeight } = React.useMemo(() => {
    const { width, height } = frameRef.current?.getBoundingClientRect() || { width: 512, height: 512 }
    const previeWith = width
    const previewHeight = height
    const imgWidth = Math.max(1024, height)
    const imgHeight = Math.round(imgWidth * (previewHeight / previeWith))
    console.log('MARZIPAN resize', { previeWith, previewHeight, imgWidth, imgHeight })
    return { previeWith, previewHeight, imgWidth, imgHeight }
  }, [dimensions])

  useEffect(() => {
    if (image) {
      qryFn({
        variables: { imgUrl: image },
        // Comment this out for testing
        fetchPolicy: 'no-cache',
      })
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

  /**
   * Capture an image from the camera
   */
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

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setStep(1)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleOnCapture = () => {
    if (captureType === CaptureTypeEnum.SHIP_ROCK) {
      if (!shipRockScanData?.captureShipRockScan) return
      onCapture(shipRockScanData?.captureShipRockScan as ShipRockCapture)
    } else if (captureType === CaptureTypeEnum.REFINERY_ORDER) {
      if (!refineryOrderData?.captureRefineryOrder) return
      onCapture(refineryOrderData?.captureRefineryOrder as ShipMiningOrderCapture)
    }
    onClose()
  }

  const handleFileDialogClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = handleFileChange
    input.click()
  }

  // If we're in file mode, open the file dialog
  // useEffect(() => {
  //   if (mode === 'File' && !hasMounted.current) {
  //     hasMounted.current = true
  //     handleFileDialogClick()
  //   }
  // }, [])

  // If we have an error, show it
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
      {overwriteConfirmOpen && (
        <ConfirmModal
          open
          title="Overwrite with capture?"
          cancelBtnText="Cancel"
          confirmBtnText="Overwrite"
          message="Are you sure you want to overwrite the current data with this captured data?"
          onClose={() => setOverwriteConfirmOpen(false)}
          onConfirm={() => {
            setOverwriteConfirmOpen(false)
            handleOnCapture()
            onClose()
          }}
        />
      )}
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
      <Box
        sx={{
          minHeight: 500,
          display: 'flex',
          flexGrow: 1,
          overflow: 'hidden',
        }}
      >
        {mode === 'Camera' && StepOrder[step] === CaptureStepEnum.CAPTURE && (
          <Box
            ref={frameRef}
            sx={{
              flexGrow: 1,
              width: '100%',
              display: 'flex',
              // border: '4px solid white',
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                zIndex: 5,
                position: 'absolute',
                top: '20px',
                left: '50%',
                width: '90%',
                // Make it no overflow with an ellipse
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
                textShadow: '0 0 10px black',
                textOverflow: 'ellipsis',
                transform: 'translateX(-50%)',
              }}
            >
              {currDevice ? 'Camera: ' + currDevice.label : 'No Camera Found'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                zIndex: 100,
                borderRadius: 2,
                position: 'absolute',
                // width: '90%',
                px: 2,
                whiteSpace: 'nowrap',
                top: '80%',
                left: '50%',
                textTransform: 'uppercase',
                backgroundColor: '#00000088',
                color: 'red',
                textAlign: 'center',
                // Make it no overflow with an ellipse
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
                // I want a super dark black outline that is 2 pixels wide then a glowing white outline that is 10 pixels wide
                // textShadow: '0 0 2px white, 0 0 10px white',
                transform: 'translateX(-50%) translateY(-50%)',
              }}
            >
              Line up the guide with your monitor
            </Typography>
            <Box
              sx={{
                height: previewHeight,
                width: previeWith,
                overflow: 'hidden',
                position: 'absolute',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={guideUrl}
                style={{
                  height: 'auto',
                  width: '90%',
                  opacity: 0.6,
                }}
              />
            </Box>
            <Webcam
              ref={camera}
              style={{
                border: '4px solid white',
                height: previewHeight,
                width: previeWith,
                position: 'absolute',
                overflow: 'hidden',
                objectFit: 'cover',
              }}
              audio={false}
              // height={previewHeight}
              // width={previeWith}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.5}
              onUserMedia={() => {
                setDeviceReady(true)
              }}
              onUserMediaError={(e) => {
                log.error('MARZIPAN Camera Error', e)
                setDeviceReady(false)
              }}
              videoConstraints={{
                deviceId: currDevice?.deviceId,
                facingMode: 'environment',
                // width: imgWidth,
                // height: imgHeight,
              }}
            />
            {devices && devices.length > 1 && (
              <Fab
                color="error"
                disabled={loading}
                onClick={() => {
                  // Cycle through the devices
                  const currIndex = devices.findIndex((d) => d.deviceId === currDevice?.deviceId)
                  const nextIndex = (currIndex + 1) % devices.length
                  setCurrDevice(devices[nextIndex])
                }}
                sx={{
                  // border: '2px solid white',
                  borderRadius: 20,
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                }}
              >
                <Cameraswitch />
              </Fab>
            )}
            <Fab
              color="success"
              variant="extended"
              disabled={loading || !deviceReady}
              onClick={() => capture()}
              sx={{
                // Give it
                boxShadow: `0 0 10px 10px  ${theme.palette.primary.light}44`,
                backgroundColor: deviceReady ? theme.palette.primary.main : theme.palette.primary.dark,
                animation: deviceReady ? `${pulse(theme.palette.primary)} 1.5s infinite` : 'none',
                position: 'absolute',
                bottom: '20px',
                right: '50%',
                transform: 'translateX(50%)',
              }}
            >
              <Camera /> Capture
            </Fab>
          </Box>
        )}
        {mode === 'File' && StepOrder[step] === CaptureStepEnum.CAPTURE && (
          <Box sx={{ flexGrow: 1 }}>
            <Stack
              spacing={1}
              sx={{
                pt: 3,
                px: 4,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'left',
                overflow: 'hidden',
              }}
            >
              <Typography variant="h5">Screenshot Upload Tips and Tricks:</Typography>
              <Typography variant="body2" paragraph>
                <b>1. Crop Screenshots</b> - If you're uploading a screenshot, crop it to just the UI you're trying to
                scan.
              </Typography>
              <Typography variant="body2" paragraph>
                <b>2. Avoid Skew</b> - Try to take the photo directly facing the screen. Perspective skew can make
                detection harder.
              </Typography>
              <Typography variant="body2" paragraph>
                <b>3. Turn off Chromatic Aberation</b> - This is a major cause of blurry numbers in Star Citizen.
              </Typography>
              <Typography variant="body2">
                <b>4. Create Contrast</b> - Try to move your ship/character so that it creates the maximum contrast for
                the interface and reduces fog, glare, and droplets on your visor.
              </Typography>
            </Stack>
            <Box
              sx={{
                pt: 5,
                textAlign: 'center',
              }}
            >
              <Fab
                color="secondary"
                variant="extended"
                size="large"
                disabled={loading}
                onClick={handleFileDialogClick}
                sx={{}}
              >
                <AddPhotoAlternate /> Choose File
              </Fab>
            </Box>
          </Box>
        )}
        {StepOrder[step] === CaptureStepEnum.APPROVE && (
          <Box
            sx={{
              flexGrow: 1,
              pt: 3,
              flexDirection: 'column',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  zIndex: 5,
                }}
              >
                <CircularProgress size={100} thickness={10} sx={{}} />
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: fontFamilies.robotoMono,
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '0 0 10px black; 0 0 10px black',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  Submitting...
                </Typography>
              </Box>
            )}
            {!loading && refineryOrderData && refineryOrderData.captureRefineryOrder && (
              <PreviewWorkOrderCapture order={refineryOrderData.captureRefineryOrder as ShipMiningOrderCapture} />
            )}
            {!loading && shipRockScanData && shipRockScanData.captureShipRockScan && (
              <PreviewScoutingRockCapture shipRock={shipRockScanData.captureShipRockScan as ShipRockCapture} />
            )}
            <Box>
              {!loading && !refineryOrderData?.captureRefineryOrder && !shipRockScanData?.captureShipRockScan && (
                <Typography variant="h5">Capture not recognized</Typography>
              )}
              {showError && <Box sx={{ color: 'red' }}>{showError}</Box>}
            </Box>
            {image && loading && (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '100vh',
                  maxHeight: '100vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src={image}
                  alt="Taken photo"
                  style={{
                    border: '4px solid red',
                    zIndex: 1,
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain', // Ensure the image maintains its aspect ratio
                    backgroundColor: 'black', // Ensure the background is black
                  }}
                />
              </Box>
            )}
            <Fab
              color="success"
              variant="extended"
              disabled={loading || (!refineryOrderData?.captureRefineryOrder && !shipRockScanData?.captureShipRockScan)}
              onClick={() => {
                if (confirmOverwrite) {
                  setOverwriteConfirmOpen(true)
                } else {
                  handleOnCapture()
                }
              }}
              sx={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
              }}
            >
              <Check /> Use
            </Fab>
            <Fab
              color="secondary"
              onClick={() => {
                setImage(null)
                if (mode === 'File') {
                  // click the button
                  handleFileDialogClick()
                }
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
      </Box>
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
