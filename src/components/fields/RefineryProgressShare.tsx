import * as React from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { fontFamilies } from '../../theme'
import dayjs from 'dayjs'

interface RefineryProgressShareProps {
  startTime?: number
  totalTimeS?: number
}

type InputValueType = [string, string[], number]

function reverseFormat(invalue?: number): string {
  if (!invalue) return '0:0:0:0'
  const days = Math.floor(invalue / (24 * 60 * 60))
  const hours = Math.floor((invalue % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((invalue % (60 * 60)) / 60)
  const seconds = Math.floor(invalue % 60)

  return `${days}:${hours}:${minutes}:${seconds}`
}

function formatValue(inputValue: string): InputValueType {
  // Remove any non-digit characters from the input and remove any leading zeros
  const cleanedValue = inputValue.replace(/[^\d]/g, '').replace(/^0+/, '')

  // Split the cleanedValue into segments
  const parsedSegments = (
    cleanedValue
      .split('')
      .reverse()
      .join('')
      .match(/.{1,2}/g) || []
  ).map((segment) => segment.split('').reverse().join(''))
  const formattedValue = [...parsedSegments].reverse().join(':')

  // the segments take the form
  let durationS = 0
  if (parsedSegments.length > 0) {
    durationS += parseInt(parsedSegments[0])
  }
  if (parsedSegments.length > 1) {
    durationS += parseInt(parsedSegments[1]) * 60
  }
  if (parsedSegments.length > 2) {
    durationS += parseInt(parsedSegments[2]) * 60 * 60
  }
  if (parsedSegments.length > 3) {
    durationS += parseInt(parsedSegments[3]) * 24 * 60 * 60
  }

  return [formattedValue, parsedSegments, durationS]
}

export const RefineryProgressShare: React.FC<RefineryProgressShareProps> = ({ startTime, totalTimeS }) => {
  const theme = useTheme()
  const finishTime = startTime ? startTime + (totalTimeS || 0) * 1000 : undefined

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        backgroundColor: theme.palette.secondary.main,
        borderTop: `2px solid ${theme.palette.primary.light}`,
        borderBottom: `2px solid ${theme.palette.primary.light}`,
      }}
    >
      <Typography
        variant="caption"
        component="div"
        sx={{
          textAlign: 'center',
          color: theme.palette.secondary.contrastText,
          fontWeight: 'bold',
          fontFamily: fontFamilies.robotoMono,
        }}
      >
        Ready for pickup:
      </Typography>
      <Typography
        variant="body2"
        component="div"
        sx={{
          textAlign: 'center',
          color: theme.palette.secondary.contrastText,
          fontSize: '1rem',
          padding: 0.5,
          fontWeight: 'bold',
          fontFamily: fontFamilies.robotoMono,
        }}
      >
        {dayjs(finishTime).format('MMM D YYYY, h:mm a')} (
        {new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2]})
      </Typography>
    </Box>
  )
}
