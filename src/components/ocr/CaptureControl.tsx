import React, { useState, useEffect, useContext } from 'react'
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
  Stack,
} from '@mui/material'
import { useCaptureRefineryOrderLazyQuery, useCaptureShipRockScanLazyQuery } from '../../schema'
import { ShipMiningOrderCapture, ShipRockCapture } from '@regolithco/common'
import { Check, Clear, Replay, TipsAndUpdatesOutlined } from '@mui/icons-material'
import { CameraHelpDialog } from './CameraHelpDialog'
import { DeviceTypeEnum, useDeviceType } from '../../hooks/useDeviceType'
import { ConfirmModal } from '../modals/ConfirmModal'
import { CaptureStartScreen } from './CaptureStartScreen'
import { CapturePreviewCrop } from './CapturePreviewCrop'
import { useImagePaste } from '../../hooks/useImagePaste'
import { ScreenshareContext } from '../../context/screenshare.context'
import { CaptureTypeEnum } from './types'
import { fontFamilies } from '../../theme'
import { PreviewWorkOrderCapture } from './PreviewWorkOrderCapture'
import { PreviewScoutingRockCapture } from './PreviewScoutingRockCapture'
import { RockIcon } from '../../icons'

export const CaptureTypeTitle: Record<CaptureTypeEnum, string> = {
  SHIP_ROCK: 'Capture Rock Scan',
  REFINERY_ORDER: 'Capture Refinery Order',
}

export interface CaptureControlProps {
  onClose: () => void
  initialImageUrl?: string | null
  onCapture: <T extends ShipRockCapture | ShipMiningOrderCapture>(retVal: T) => void
  captureType: CaptureTypeEnum
}

export const CaptureControl: React.FC<CaptureControlProps> = ({ onClose, captureType, onCapture, initialImageUrl }) => {
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(initialImageUrl || null)
  const [submittedImageUrl, setSubmittedImageUrl] = useState<string | null>(null)
  const [showError, setShowError] = useState<string | null>(null)
  const [overwriteConfirmOpen, setOverwriteConfirmOpen] = useState(false)
  const [data, setData] = useState<ShipRockCapture | ShipMiningOrderCapture | null>(null)

  const [helpOpen, setHelpOpen] = useState(false)
  useImagePaste(setRawImageUrl)
  const { isScreenSharing } = useContext(ScreenshareContext)
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
        setRawImageUrl(e.target?.result as string)
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
      onCapture(data as ShipRockCapture)
    } else if (captureType === CaptureTypeEnum.REFINERY_ORDER) {
      onCapture(data as ShipMiningOrderCapture)
    }
    onClose()
  }

  // If we have an error, show it
  useEffect(() => {
    if (refineryOrderError || shipRockScanError) {
      setShowError(refineryOrderError?.message || shipRockScanError?.message || 'Scan Could not be captured')
    } else {
      setShowError(null)
    }
  }, [refineryOrderError, shipRockScanError])

  const isCaptureStage = !rawImageUrl && !isScreenSharing && !data && !showError
  const isCropStage = (!!rawImageUrl || isScreenSharing) && !data && !showError
  const isVerifyStage = !!data && !showError
  const isError = !!showError

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
          <RockIcon />
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
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isError && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200,
              width: '100%',
              height: '100%',
            }}
          >
            <Stack>
              <Typography variant="h6" color="error" align="center">
                ERROR: {showError}
              </Typography>
              <Typography variant="caption" color="error" align="center">
                Scan could not be captured. Please try again.
              </Typography>
            </Stack>
          </Box>
        )}
        {loading ? (
          <Box
            sx={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              minHeight: 500,
              backgroundImage: submittedImageUrl ? `url(${submittedImageUrl})` : undefined,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'contain',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                zIndex: 5,
              }}
            >
              <CircularProgress size={100} thickness={10} color="secondary" />
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
          </Box>
        ) : (
          <>
            {isCaptureStage && (
              <CaptureStartScreen captureType={captureType} onFileChooseClick={handleFileDialogClick} />
            )}

            {isCropStage && (
              <CapturePreviewCrop
                imageUrl={rawImageUrl}
                clearImage={() => {
                  if (rawImageUrl) setRawImageUrl(null)
                  if (showError) setShowError(null)
                  if (submittedImageUrl) setSubmittedImageUrl(null)
                }}
                chooseFileClick={handleFileDialogClick}
                captureType={captureType}
                onSubmit={(newUrl) => {
                  if (newUrl) {
                    setSubmittedImageUrl(newUrl)
                    if (captureType === CaptureTypeEnum.REFINERY_ORDER) {
                      qryRefineryOrder({
                        variables: {
                          imgUrl: newUrl,
                        },
                        onCompleted: (data) => {
                          if (data.captureRefineryOrder) {
                            setData(data.captureRefineryOrder)
                            if (rawImageUrl) setRawImageUrl(null)
                            setSubmittedImageUrl(null)
                          } else {
                            setShowError('Scan Could not be captured')
                          }
                        },
                        fetchPolicy: 'no-cache',
                      })
                    } else if (captureType === CaptureTypeEnum.SHIP_ROCK) {
                      qryShipRockScan({
                        variables: {
                          imgUrl: newUrl,
                        },
                        onCompleted: (data) => {
                          if (data.captureShipRockScan) {
                            setData(data.captureShipRockScan || null)
                            if (rawImageUrl) setRawImageUrl(null)
                            setSubmittedImageUrl(null)
                          } else {
                            setShowError('Scan Could not be captured')
                          }
                        },
                        fetchPolicy: 'no-cache',
                      })
                    }
                  }
                }}
              />
            )}

            {data && data.__typename === 'ShipMiningOrderCapture' && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PreviewWorkOrderCapture order={data as ShipMiningOrderCapture} />
              </Box>
            )}
            {data && data.__typename === 'ShipRockCapture' && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PreviewScoutingRockCapture shipRock={data as ShipRockCapture} />
              </Box>
            )}
            {isVerifyStage && (
              <DialogActions>
                <Button
                  disabled={loading}
                  color="error"
                  startIcon={<Replay />}
                  onClick={() => {
                    if (rawImageUrl) setRawImageUrl(null)
                    // if (isScreenSharing) stopScreenCapture()
                    if (showError) setShowError(null)
                    if (submittedImageUrl) setSubmittedImageUrl(null)
                    if (data) setData(null)
                  }}
                >
                  Retry
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  color="success"
                  variant="contained"
                  disabled={loading || !data || isError}
                  startIcon={<Check />}
                  onClick={() => {
                    handleOnCapture()
                    onClose()
                  }}
                >
                  Use
                </Button>
              </DialogActions>
            )}
            {isError && (
              <DialogActions>
                <Button
                  disabled={loading}
                  color="error"
                  startIcon={<Replay />}
                  onClick={() => {
                    if (rawImageUrl) setRawImageUrl(null)
                    // if (isScreenSharing) stopScreenCapture()
                    if (submittedImageUrl) setSubmittedImageUrl(null)
                    if (showError) setShowError(null)
                    if (data) setData(null)
                  }}
                >
                  Try Again
                </Button>
              </DialogActions>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
