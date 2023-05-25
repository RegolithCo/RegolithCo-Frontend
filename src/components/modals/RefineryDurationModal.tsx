import React, { ChangeEvent } from 'react'
import { TextField, Button, useTheme, Typography, Modal, Box, Stack } from '@mui/material'
import { fontFamilies } from '../../theme'

export type RefineryDurationModalProps = {
  open?: boolean
  onClose: () => void
  onChange: (durationMs: number) => void
}

export const RefineryDurationModal: React.FC<RefineryDurationModalProps> = ({ open, onClose, onChange }) => {
  const [[stringValue, segments, numberValue], setValue] = React.useState<[string, string[], number]>(['', [], 0])
  const theme = useTheme()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    // Remove any non-digit characters from the input
    const cleanedValue = inputValue.replace(/[^\d]/g, '')
    if (cleanedValue.length > 8) {
      return
    }

    // Split the cleanedValue into segments
    const parsedSegments = (
      cleanedValue
        .split('')
        .reverse()
        .join('')
        .match(/.{1,2}/g) || []
    ).map((segment) => segment.split('').reverse().join(''))

    // Add colons between the segments
    const formattedValue = [...parsedSegments].reverse().join(':')

    // the segments take the form
    let durationMs = 0
    if (parsedSegments.length > 0) {
      durationMs += parseInt(parsedSegments[0]) * 1000
    }
    if (parsedSegments.length > 1) {
      durationMs += parseInt(parsedSegments[1]) * 60 * 1000
    }
    if (parsedSegments.length > 2) {
      durationMs += parseInt(parsedSegments[2]) * 60 * 60 * 1000
    }
    if (parsedSegments.length > 3) {
      durationMs += parseInt(parsedSegments[3]) * 24 * 60 * 60 * 1000
    }

    setValue([formattedValue, parsedSegments, durationMs])
  }

  return (
    <Modal open={Boolean(open)} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 10,
          boxShadow: `0px 0px 20px 5px ${theme.palette.primary.light}, 0px 0px 60px 40px black`,
          border: `10px solid ${theme.palette.primary.main}`,
          p: 4,
        }}
      >
        <Typography>Refinery Duration</Typography>
        <Box>
          <TextField
            id="outlined-multiline-flexible"
            fullWidth
            color="primary"
            inputRef={(input) => input && input.focus()}
            inputProps={{
              sx: {
                color: theme.palette.primary.main,
                textAlign: 'center',
              },
            }}
            InputProps={{
              sx: {
                color: theme.palette.primary.main,
                textAlign: 'right',
                fontFamily: fontFamilies.robotoMono,
                fontSize: '2rem',
              },
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onChange(numberValue)
                onClose()
              } else if (e.key === 'Escape') {
                e.preventDefault()
                onClose()
              }
            }}
            value={stringValue || ''}
            helperText={`Enter with format: DD:HH:MM:SS`}
            onChange={handleChange}
            sx={{ mb: 2 }}
            placeholder="DD:HH:MM:SS"
          />
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{
              fontFamily: fontFamilies.robotoMono,
            }}
          >
            {segments.length > 3 && `${segments[3]} Day(s), `}
            {segments.length > 2 && `${segments[2]} Hour(s), `}
            {segments.length > 1 && `${segments[1]} Minute(s), `}
            {`${segments[0] || 0} Second(s)`}
          </Typography>
        </Box>
        <Stack direction="row">
          <Button color={'error'} onClick={onClose} autoFocus>
            cancel
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Button
            color={'secondary'}
            variant="contained"
            disabled={numberValue === 0}
            onClick={() => {
              onChange(numberValue)
              onClose()
            }}
            autoFocus
          >
            Set
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
