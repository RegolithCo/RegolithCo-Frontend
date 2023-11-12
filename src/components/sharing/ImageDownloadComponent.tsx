import React from 'react'
import html2canvas from 'html2canvas'
import { Box, Button, useTheme } from '@mui/material'
import { DownloadForOffline } from '@mui/icons-material'
import { alpha, keyframes, Stack } from '@mui/system'
import { ShareWrapper } from './ShareWrapper'

export interface ImageDownloadComponentProps {
  leftContent?: React.ReactNode
  fileName: string
  children: React.ReactNode
}

export const ImageDownloadComponent: React.FC<ImageDownloadComponentProps> = ({ children, fileName, leftContent }) => {
  const theme = useTheme()
  const captureComponent = () => {
    const element = document.getElementById('componentToCapture')
    if (!element) return console.error('No element with id "componentToCapture"')
    html2canvas(element).then((canvas) => {
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
    <Box>
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
        id="componentToCapture"
        sx={{
          border: '3px solid transparent',
          background: `repeating-linear-gradient(
      -45deg,
      yellow 0px,
      yellow 10px,
      black 10px,
      black 20px
    )`,
        }}
      >
        <Box
          id="componentToCapture"
          sx={{
            border: '1px solid transparent',
            background: theme.palette.background.paper,
          }}
        >
          <ShareWrapper>{children}</ShareWrapper>
        </Box>
      </Box>
    </Box>
  )
}
