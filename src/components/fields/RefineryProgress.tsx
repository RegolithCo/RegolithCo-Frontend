import * as React from 'react'
import { Box, TextField, Tooltip, Typography, keyframes, useTheme } from '@mui/material'
import { MValueFormat, MValueFormatter } from './MValue'
import { fontFamilies } from '../../theme'
import { useCountdown } from '../../hooks/useCountdown'

interface RefineryProgressProps {
  startTime?: number
  totalTimeS?: number
  editable?: boolean
  onChange: (durationMs: number) => void
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
  let durationMin = 0
  if (parsedSegments.length > 0) {
    durationMin += parseInt(parsedSegments[0])
  }
  if (parsedSegments.length > 1) {
    durationMin += parseInt(parsedSegments[1]) * 60
  }
  if (parsedSegments.length > 2) {
    durationMin += parseInt(parsedSegments[2]) * 24 * 60
  }

  return [formattedValue, parsedSegments, durationMin * 60]
}

export const RefineryProgress: React.FC<RefineryProgressProps> = ({ startTime, editable, totalTimeS, onChange }) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const { isFinished, isStarted, hasTime, remainingTime } = useCountdown(startTime, (totalTimeS || 0) * 1000)
  const [[stringValue, segments, numValMs], setValue] = React.useState<[string, string[], number]>(
    formatValue(reverseFormat(totalTimeS))
  )
  const theme = useTheme()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editable) return

    const inputValue = event.target.value
    const formattedValue = formatValue(inputValue)
    if (formattedValue[0].length > 9) {
      return
    }

    setValue(formattedValue)
  }

  const flash = keyframes`
    0% { color: ${theme.palette.secondary.contrastText}; }
    50% { color: ${theme.palette.secondary.main}; }
    100% { color: ${theme.palette.secondary.contrastText}; }
  `

  if (!editable && !isFinished && !isStarted) return null

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        borderTop: `2px solid ${theme.palette.primary.light}`,
        borderBottom: `2px solid ${theme.palette.primary.light}`,
      }}
    >
      {!isEditing && (
        <Typography
          variant="body2"
          component="div"
          onClick={() => {
            if (!editable) return
            if (remainingTime > 0) setValue(formatValue(reverseFormat(remainingTime / 1000)))
            setIsEditing(true)
          }}
          sx={{
            top: 0,
            left: 0,
            textAlign: 'center',
            color: theme.palette.secondary.contrastText,
            backgroundSize: '100px 100px',
            backgroundImage: `repeating-linear-gradient(
              45deg,
              ${theme.palette.secondary.main} 25%,
              ${theme.palette.secondary.main} 50%,
              ${theme.palette.secondary.main} 50%,
              ${theme.palette.secondary.main} 75%
              )`,
            fontSize: '1.5rem',
            animation: totalTimeS === 0 ? `${flash} 1s infinite` : undefined,
            lineHeight: 1,
            padding: 0.5,
            fontWeight: 'bold',
            fontFamily: fontFamilies.robotoMono,
            userSelect: 'none', // Prevents text selection
          }}
        >
          {isStarted && !isFinished ? MValueFormatter(remainingTime, MValueFormat.durationS) : null}
          {isStarted && isFinished ? 'COMPLETE' : null}
          {!isStarted && (totalTimeS || 0) > 0
            ? MValueFormatter((totalTimeS || 0) * 1000, MValueFormat.durationS)
            : null}
          {!isFinished && !isStarted && '00:00:00:00'}
        </Typography>
      )}
      {isEditing && (
        <Tooltip
          open
          // arrow
          disableFocusListener
          disableHoverListener
          disableTouchListener
          disableInteractive
          placement="top"
          PopperProps={{
            sx: {
              '& .MuiTooltip-tooltip': {
                backgroundColor: 'black',
                borderRadius: 2,
                border: `2px solid ${theme.palette.secondary.main}`,
              },
            },
          }}
          title={
            <Typography
              variant="caption"
              align="center"
              sx={{
                fontFamily: fontFamilies.robotoMono,
                color: theme.palette.secondary.main,
              }}
            >
              {segments.length > 2 && `${segments[2]} day, `}
              {segments.length > 1 && `${segments[1]} hr, `}
              {`${segments[0] || 0} min`}
            </Typography>
          }
        >
          <TextField
            fullWidth
            color="primary"
            inputRef={(input) => input && input.focus()}
            inputProps={{
              sx: {
                color: theme.palette.primary.main,
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
                fontSize: '1.5rem',
                lineHeight: 1,
                padding: 0.5,
                textAlign: 'center',
              },
            }}
            InputProps={{
              sx: {},
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onChange(numValMs)
                setIsEditing(false)
              } else if (e.key === 'Escape') {
                e.preventDefault()
                setIsEditing(false)
              }
            }}
            onBlur={() => {
              onChange(numValMs)
              setIsEditing(false)
            }}
            value={stringValue || ''}
            onChange={handleChange}
            sx={{}}
            placeholder="DD:HH:MM"
          />
        </Tooltip>
      )}
    </Box>
  )
}
