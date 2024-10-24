import { Box, Button, Dialog, FormControlLabel, Switch } from '@mui/material'
import React, { useState, useRef } from 'react'
import { Camera, CameraType } from 'react-camera-pro'
import { useCaptureRefineryOrderLazyQuery, useCaptureShipRockScanLazyQuery } from '../../schema'
import { Stack } from '@mui/system'

interface CameraControlProps {
  onClose: () => void
}

export const CameraControl: React.FC<CameraControlProps> = ({ onClose }) => {
  const camera = useRef<CameraType>(null)
  const [image, setImage] = useState<string | null>(null)
  const [mode, setMode] = useState<boolean>(true)

  const [qryRefineryOrder] = useCaptureRefineryOrderLazyQuery()
  const [qryShipRockScan] = useCaptureShipRockScanLazyQuery()

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

  return (
    <Dialog open={true} fullScreen fullWidth>
      <Stack
        spacing={2}
        direction="row"
        sx={{
          zIndex: 2000,
          backgroundColor: 'black',
        }}
      >
        <FormControlLabel
          control={<Switch checked={mode} onChange={(e) => setMode(e.target.checked)} />}
          label="Work Order / Rock"
        />
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
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              if (camera.current) {
                const photo = camera.current.takePhoto('base64url') as string
                setImage(photo)
              }
            }}
          >
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
              if (mode) {
                qryRefineryOrder({ variables: { imgUrl: image } })
              } else {
                qryShipRockScan({ variables: { imgUrl: image } })
              }
            }}
          >
            Send
          </Button>
        )}
      </Stack>
      <Box>
        {!image ? (
          <Camera
            // facingMode="environment"
            ref={camera}
            // aspectRatio={4 / 3}
            errorMessages={{
              canvas: 'Canvas is not supported',
              noCameraAccessible: 'No camera device accessible',
              permissionDenied: 'Camera permission denied',
              switchCamera: 'Switching camera failed',
            }}
          />
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
