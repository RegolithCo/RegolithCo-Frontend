import * as React from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { fontFamilies } from '../../theme'
import dayjs from 'dayjs'

interface RefineryProgressShareProps {
  startTime?: number
  totalTimeS?: number
}

export const RefineryProgressShare: React.FC<RefineryProgressShareProps> = ({ startTime, totalTimeS }) => {
  const theme = useTheme()
  if (!startTime || !totalTimeS) return null
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
