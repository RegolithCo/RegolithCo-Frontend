import * as React from 'react'
import { Box, LinearProgress, Typography, useTheme } from '@mui/material'
import { MValueFormat, MValueFormatter } from './MValue'
import { fontFamilies } from '../../theme'
import { useCountdown } from '../../hooks/useCountdown'

interface RefineryProgressProps {
  startTime?: number
  totalTime?: number
}

export const RefineryProgress: React.FC<RefineryProgressProps> = ({ startTime, totalTime }) => {
  const theme = useTheme()
  const { isFinished, isStarted, hasTime, remainingTime } = useCountdown(startTime, totalTime)

  let progress = 0
  if (isFinished) progress = 100
  else if (isStarted && !isFinished) {
    progress = (((totalTime || 0) - (remainingTime || 0)) / (totalTime || 1)) * 100
  }

  return (
    <Box sx={{ width: '100%', position: 'relative', borderTop: `2px solid`, borderBottom: '2px solid' }}>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          backgroundColor: theme.palette.primary.dark + 'aa',
          '& .MuiLinearProgress-bar': {
            backgroundSize: '100px 100px',
            backgroundImage: `repeating-linear-gradient(
              45deg,
              ${theme.palette.secondary.main} 25%,
              ${theme.palette.secondary.main} 50%,
              ${theme.palette.secondary.dark} 50%,
              ${theme.palette.secondary.dark} 75%
              )`,
          },
          height: 50,
          width: '100%',
        }}
      />
      {hasTime && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            zIndex: 100,
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            textAlign: 'center',
            color: 'black',
            fontSize: 25,
            lineHeight: 1,
            padding: '10px',
            fontWeight: 'bold',
            fontFamily: fontFamilies.robotoMono,
          }}
        >
          {!isStarted ? MValueFormatter(totalTime, MValueFormat.durationS) : null}
          {isStarted && !isFinished ? MValueFormatter(remainingTime, MValueFormat.durationS) : null}
          {isFinished ? 'COMPLETE' : null}
        </Typography>
      )}
    </Box>
  )
}
