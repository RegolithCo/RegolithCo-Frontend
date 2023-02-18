import * as React from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  useTheme,
} from '@mui/material'
import { Stack } from '@mui/system'
import { Cancel, Check } from '@mui/icons-material'
import { failReasons } from '@regolithco/common'

export interface WorkOrderFailModalProps {
  open: boolean
  onClose: () => void
  onChoose: (reason: string) => void
}

export const WorkOrderFailModal: React.FC<WorkOrderFailModalProps> = ({ open, onClose, onChoose }) => {
  const theme = useTheme()
  const [reason, setReason] = React.useState('')
  const [otherReason, setOtherReason] = React.useState('')

  const finalReason = reason === 'other' ? otherReason : reason
  const valid = finalReason.length > 0
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 10,
          boxShadow: `0px 0px 20px 5px ${theme.palette.primary.light}, 0px 0px 60px 40px black`,
          background: theme.palette.background.default,
          border: `10px solid ${theme.palette.primary.main}`,
          px: 4,
          py: 2,
        },
      }}
    >
      <DialogTitle>Why did the work order fail?</DialogTitle>
      <DialogContent>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={reason}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const newValue = event.target.value
              if (newValue !== 'other') setOtherReason('')
              setReason(newValue)
            }}
          >
            {failReasons.map((reason, idx) => (
              <FormControlLabel key={`failreason-${idx}`} value={reason} control={<Radio />} label={reason} />
            ))}
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </FormControl>
        <FormControl fullWidth>
          <FormLabel>Other reason</FormLabel>
          <TextField
            value={otherReason}
            multiline
            disabled={reason !== 'other'}
            onChange={(event) => {
              // Limit to 256 characters
              setOtherReason(event.target.value.slice(0, 256))
            }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
          <Button color="secondary" onClick={onClose} variant="outlined" startIcon={<Cancel />}>
            Cancel
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Button
            color="error"
            startIcon={<Check />}
            disabled={!valid}
            variant="contained"
            onClick={() => {
              onChoose(finalReason)
              onClose()
            }}
          >
            Fail work order
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
