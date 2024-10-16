import React from 'react'
import html2canvas from 'html2canvas'
import { Box, Button, useTheme } from '@mui/material'
import { DownloadForOffline } from '@mui/icons-material'
import { alpha, keyframes, Stack } from '@mui/system'
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
        alignContent={'space-between'}
        justifyContent="center"
        alignItems={'center'}
        mb={2}
        spacing={3}
        sx={{ width: '100%' }}
      >
        {leftContent}
        <Button
          color={'info'}
          size="large"
          startIcon={
            <DownloadForOffline
              sx={{
                width: 40,
                height: 40,
              }}
            />
          }
          variant="contained"
          onClick={captureComponent}
          sx={{
            height: 60,
            width: 400,
            fontSize: '1.5rem',
            animation: `${pulse} 1.5s infinite`,
          }}
        >
          Download .PNG
        </Button>
      </Stack>
      <Box
        //
        sx={{
          width: `${widthPx + 10}px`,
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
              color: theme.palette.error.contrastText,
              backgroundColor: theme.palette.error.main,
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
            PNG Preview
          </Box>
          <Box
            sx={{
              border: '5px solid transparent',
              // Deny all interaction
              background: `repeating-linear-gradient(
      -45deg,
      ${theme.palette.error.main} 0px,
      ${theme.palette.error.main} 10px,
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
