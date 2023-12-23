import * as React from 'react'
import Numeral from 'numeral'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { Stack } from '@mui/system'
import { Add, Cancel, Check, Delete } from '@mui/icons-material'
import { jsRound } from '@regolithco/common'
import { fontFamilies } from '../../theme'
import { MValueFormat, MValueFormatter } from '../fields/MValue'

export interface CompositeAddModal {
  open: boolean
  startAmt: number
  onClose: () => void
  onConfirm: (newVal: number) => void
}

export const CompositeAddModal: React.FC<CompositeAddModal> = ({ open, startAmt, onClose, onConfirm }) => {
  const theme = useTheme()
  const [rows, setRows] = React.useState<number[]>(() => {
    if (startAmt <= 0) return [0]
    else return [startAmt, 0]
  })
  // Create a ref for each TextField
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  React.useEffect(() => {
    const lastInputRef = inputRefs.current[inputRefs.current.length - 1]
    // Focus the last TextField and select its text
    if (lastInputRef) {
      lastInputRef.focus()
      lastInputRef.select()
    }
  }, [inputRefs])

  const rowSum = rows.reduce((a, b) => a + b, 0)
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 10,
          boxShadow: `0px 0px 20px 5px ${theme.palette.primary.light}, 0px 0px 60px 40px black`,
          background: theme.palette.background.default,
          border: `10px solid ${theme.palette.primary.main}`,
          px: 2,
          py: 2,
        },
      }}
    >
      <DialogTitle>Composite Sell Price</DialogTitle>
      <DialogContent>
        <Box textAlign={'right'}>
          <Button
            startIcon={<Add />}
            onClick={() => {
              const newRows = [...rows]
              newRows.push(0)
              setRows(newRows)
            }}
          >
            Add Row
          </Button>
        </Box>
        <Stack>
          {rows.map((row, i) => (
            <TextField
              key={`inputs-${i}`}
              fullWidth
              autoFocus
              type="text"
              variant="standard"
              // Assign the ref to the TextField
              inputRef={(ref) => {
                if (!ref) return
                if (inputRefs.current.length < rows.length) inputRefs.current.push(ref)
                inputRefs.current[i] = ref
              }}
              value={Numeral(row).format(`0,0`)}
              onKeyDown={(event) => {
                const isShiftPressed = event.shiftKey

                if (event.key === 'Escape') onClose()
                // If The user presses 'up' or 'down', increment or decrement the value
                if (event.key === 'ArrowUp') {
                  event.preventDefault()
                  if (i > 0) {
                    const lastRow = inputRefs.current[i - 1]
                    if (lastRow) {
                      lastRow.focus()
                    }
                  }
                }
                if (event.key === 'ArrowDown') {
                  event.preventDefault()
                  if (i < rows.length - 1) {
                    const prevRow = inputRefs.current[i + 1]
                    if (prevRow) {
                      prevRow.focus()
                    }
                  }
                }

                if (event.key === 'Tab') {
                  event.preventDefault()
                  // If it's the last row, add a new one
                  if (i === rows.length - 1) {
                    const newRows = [...rows]
                    newRows.push(0)
                    setRows(newRows)
                  }
                  // Otherwise focus the next row
                  else {
                    const nextInputRef = inputRefs.current[i + 1]
                    if (nextInputRef) {
                      nextInputRef.focus()
                      nextInputRef.select()
                    }
                  }
                } else if (event.key === 'Enter') {
                  event.preventDefault()
                  onConfirm(rowSum)
                }
              }}
              onChange={(e) => {
                try {
                  const value = jsRound(parseInt(e.target.value.replace(/[^\d]/g, '').replace(/^0+/, ''), 10), 0)

                  if (value >= 0) {
                    // DO a thing
                    const newRows = [...rows]
                    newRows[i] = value
                    setRows(newRows)
                  } else {
                    // DO another thing
                  }
                } catch (e) {
                  //
                }
              }}
              InputProps={{
                // Put a delete button at the start of the row
                startAdornment: <Chip size="small" label={i + 1} />,
                endAdornment: (
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    sx={{
                      px: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                      }}
                    >
                      aUEC
                    </Typography>
                    <IconButton
                      disabled={i === 0}
                      color={'error'}
                      onClick={() => {
                        const newRows = [...rows]
                        newRows.splice(i, 1)
                        setRows(newRows)
                      }}
                    >
                      <Cancel />
                    </IconButton>
                  </Stack>
                ),
              }}
              inputProps={{
                sx: {
                  m: 0,
                  p: 1,
                  textAlign: 'right',
                  fontFamily: fontFamilies.robotoMono,
                  fontSize: 16,
                },
              }}
            />
          ))}
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          mt={3}
          sx={{ width: '100%' }}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Typography
            variant="body1"
            component="div"
            sx={{
              fontSize: 24,
            }}
          >
            Final Total:
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
              fontFamily: fontFamilies.robotoMono,
              fontSize: 24,
            }}
          >
            {MValueFormatter(rowSum, MValueFormat.currency)}
          </Typography>
        </Stack>
        <Typography variant="caption" component="div" color="text.secondary" mt={4}>
          Use <Chip size="small" label="Tab" /> to add a new row. Use <Chip size="small" label="Enter" /> to accept and
          return.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
          <Button color="secondary" onClick={onClose} variant="outlined" startIcon={<Cancel />}>
            Cancel
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Button
            color="primary"
            startIcon={<Check />}
            // sx={{ background: theme.palette.background.paper }}
            variant="contained"
            onClick={() => onConfirm(rowSum)}
          >
            Accept
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
