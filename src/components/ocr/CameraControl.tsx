import React, { useState, useRef, useEffect, useContext } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { useCaptureRefineryOrderLazyQuery, useCaptureShipRockScanLazyQuery } from '../../schema'
import { Stack } from '@mui/system'
import { ShipMiningOrderCapture, ShipRockCapture } from '@regolithco/common'
import { Clear, TipsAndUpdatesOutlined } from '@mui/icons-material'
import { CameraHelpDialog } from './CameraHelpDialog'
import { DeviceTypeEnum, useDeviceType } from '../../hooks/useDeviceType'
import { ConfirmModal } from '../modals/ConfirmModal'
import { CaptureStartScreen } from './CaptureStartScreen'
import { CapturePreviewCrop } from './CapturePreviewCrop'
import { useImagePaste } from '../../hooks/useImagePaste'
import log from 'loglevel'
import { ScreenshareContext } from '../../context/screenshare.context'
import { CaptureTypeEnum } from './types'
import { fontFamilies } from '../../theme'
import { PreviewWorkOrderCapture } from './PreviewWorkOrderCapture'
import { PreviewScoutingRockCapture } from './PreviewScoutingRockCapture'
import { set } from 'lodash'

export const CaptureTypeTitle: Record<CaptureTypeEnum, string> = {
  SHIP_ROCK: 'Capture Rock Scan',
  REFINERY_ORDER: 'Capture Refinery Order',
}

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
  const containerRef = useRef<HTMLDivElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [showError, setShowError] = useState<string | null>(null)
  const [overwriteConfirmOpen, setOverwriteConfirmOpen] = useState(false)
  const [data, setData] = useState<ShipRockCapture | ShipMiningOrderCapture | null>(null)

  const [helpOpen, setHelpOpen] = useState(false)
  useImagePaste(setImage, containerRef)
  const { isScreenSharing, stopScreenCapture } = useContext(ScreenshareContext)
  const theme = useTheme()

  // I need a media query to detect if this is a mobile device or a desktop
  const isPhone = useDeviceType() === DeviceTypeEnum.PHONE

  const [currDevice, setCurrDevice] = React.useState<MediaDeviceInfo>()
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([])

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

  const [qryRefineryOrder, { loading: refineryOrderLoading, error: refineryOrderError, data: refineryOrderData }] =
    useCaptureRefineryOrderLazyQuery()
  const [qryShipRockScan, { loading: shipRockScanLoading, error: shipRockScanError, data: shipRockScanData }] =
    useCaptureShipRockScanLazyQuery()

  const loading = refineryOrderLoading || shipRockScanLoading

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

  // If we have an error, show it
  useEffect(() => {
    if (refineryOrderError || shipRockScanError) {
      setShowError(refineryOrderError?.message || shipRockScanError?.message || 'Unknown Error')
    } else {
      setShowError(null)
    }
  }, [refineryOrderError, shipRockScanError])

  log.info('MARZIPAN isScreensharing', isScreenSharing)
  const isCaptureStage = !image && !isScreenSharing && !refineryOrderData && !shipRockScanData
  const isCropStage = (!!image || isScreenSharing) && !refineryOrderData && !shipRockScanData
  const isVerifyStage = refineryOrderData || shipRockScanData

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
      <DialogContent ref={containerRef} sx={{ overflowY: 'auto' }}>
        {loading ? (
          <Box
            sx={{
              position: 'absolute',
              zIndex: 5,
            }}
          >
            {image && (
              <Box
                sx={{
                  position: 'absolute',
                  zIndex: 5,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}
              >
                <img
                  src={image}
                  alt="Capture"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    filter: 'blur(5px)',
                  }}
                />
              </Box>
            )}
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
        ) : (
          <>
            {isCaptureStage && (
              <CaptureStartScreen captureType={captureType} onFileChooseClick={handleFileDialogClick} />
            )}

            {isCropStage && (
              <CapturePreviewCrop
                image={image}
                clearImage={() => setImage(null)}
                captureType={captureType}
                onSubmit={() => {
                  // TODO: Implement onSubmit
                  if (image) {
                    if (captureType === CaptureTypeEnum.REFINERY_ORDER) {
                      qryRefineryOrder({
                        variables: {
                          imgUrl: image,
                        },
                        onCompleted: (data) => {
                          log.info('MARZIPAN Capture completed', data)
                          setData(data.captureRefineryOrder || null)
                        },
                        nextFetchPolicy: 'no-cache',
                      })
                    } else if (captureType === CaptureTypeEnum.SHIP_ROCK) {
                      qryShipRockScan({
                        variables: {
                          imgUrl: image,
                        },
                        onCompleted: (data) => {
                          log.info('MARZIPAN Capture completed', data)
                          setData(data.captureShipRockScan || null)
                        },
                        nextFetchPolicy: 'no-cache',
                      })
                    }
                  }
                }}
              />
            )}

            {refineryOrderData && refineryOrderData.captureRefineryOrder && (
              <PreviewWorkOrderCapture order={refineryOrderData.captureRefineryOrder as ShipMiningOrderCapture} />
            )}
            {shipRockScanData && shipRockScanData.captureShipRockScan && (
              <PreviewScoutingRockCapture shipRock={shipRockScanData.captureShipRockScan as ShipRockCapture} />
            )}
            {isVerifyStage && (
              <DialogActions>
                <Button
                  disabled={loading}
                  startIcon={<Clear />}
                  onClick={() => {
                    if (image) setImage(null)
                    if (data) setData(null)
                  }}
                >
                  Reset
                </Button>
              </DialogActions>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
