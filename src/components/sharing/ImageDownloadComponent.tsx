import React from 'react'
import html2canvas from 'html2canvas'
import { Box, Button, useTheme } from '@mui/material'
import { DownloadForOffline } from '@mui/icons-material'
import { alpha, fontWeight, keyframes, Stack } from '@mui/system'
import { ShareWrapper } from './ShareWrapper'
import { fontFamilies } from '../../theme'

export interface ImageDownloadComponentProps {
  leftContent?: React.ReactNode
  widthPx: number
  fileName: string
  children: React.ReactNode
}

export const ImageDownloadComponent: React.FC<ImageDownloadComponentProps> = ({
  children,
  widthPx,
  fileName,
  leftContent,
}) => {
  const theme = useTheme()
  const captureComponent = () => {
    const element = document.getElementById('componentToCapture')
    if (!element) return console.error('No element with id "componentToCapture"')
    html2canvas(element, {
      // width: widthPx,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')

      // Create a temporary link and trigger the download
      const downloadLink = document.createElement('a')
      downloadLink.href = imgData
      downloadLink.download = `${fileName}.png`
      downloadLink.click()
    })
  }

  const pulse = keyframes`
    0% { 
      box-shadow: 0 0 0 0 transparent; 
      background-color: ${theme.palette.info.dark} 
    }
    50% { 
      box-shadow: 0 0 5px 5px ${alpha(theme.palette.info.light, 0.5)}; 
      background-color: ${theme.palette.info.light} 
    }
    100% { 
      box-shadow: 0 0 0 0 transparent; 
      background-color:  ${theme.palette.info.dark}
    }
    `

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        alignContent={'space-between'}
        justifyContent="center"
        mb={2}
        spacing={3}
        sx={{ width: '100%' }}
      >
        {leftContent}
        <Button
          color={'info'}
          size="large"
          startIcon={<DownloadForOffline />}
          variant="contained"
          onClick={captureComponent}
          sx={{
            animation: `${pulse} 1.5s infinite`,
          }}
        >
          Download
        </Button>
      </Stack>
      <Box
        //
        sx={{
          width: `${widthPx}px`,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            mt: 9,
          }}
        >
          <Box
            sx={{
              color: theme.palette.info.contrastText,
              backgroundColor: theme.palette.error.light,
              position: 'absolute',
              py: 0.5,
              px: 1,
              fontWeight: 'bold',
              fontFamily: fontFamilies.robotoMono,
              top: 0,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              transform: 'translateY(-100%)',
            }}
          >
            Preview
          </Box>
          <Box
            id="componentToCapture"
            sx={{
              border: '3px solid transparent',
              // Deny all interaction
              background: `repeating-linear-gradient(
      -45deg,
      ${theme.palette.error.light} 0px,
      ${theme.palette.error.light} 10px,
      ${theme.palette.background.default} 10px,
      ${theme.palette.background.default} 20px
    )`,
            }}
          >
            <Box
              id="componentToCapture"
              sx={{
                pointerEvents: 'none',
                width: `${widthPx}px`,
                background: theme.palette.background.paper,
              }}
            >
              <ShareWrapper>{children}</ShareWrapper>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
