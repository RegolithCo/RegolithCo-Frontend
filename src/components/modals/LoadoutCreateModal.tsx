import * as React from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { Stack } from '@mui/system'
import { Cancel, Check } from '@mui/icons-material'

export interface LoadoutCreateModalProps {
  open: boolean
  edit?: boolean
  value?: string
  onClose: () => void
  onConfirm: (name: string) => void
}

export const LoadoutCreateModal: React.FC<LoadoutCreateModalProps> = ({ open, edit, value, onClose, onConfirm }) => {
  const theme = useTheme()
  const [loadoutName, setLoadoutName] = React.useState(value || '')
  const valid = loadoutName.trim().length > 3 && loadoutName.trim().length < 100
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
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
      <DialogTitle>{edit ? 'Edit loadout name' : 'Save new loadout'}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" component="div">
          Give your loadout a good name
        </Typography>
        <TextField
          fullWidth
          error={!valid}
          variant="standard"
          sx={{ fontSize: 30 }}
          inputProps={{ sx: { fontSize: 30 } }}
          helperText={!valid && loadoutName.length > 0 ? 'Must be at least 4 - 100 characters' : ' '}
          value={loadoutName}
          onChange={(e) => setLoadoutName(e.target.value.trimStart())}
        />
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
          <Button color="error" onClick={onClose} variant="outlined" startIcon={<Cancel />}>
            {'Cancel'}
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Button
            color="primary"
            startIcon={<Check />}
            variant="contained"
            disabled={!valid}
            onClick={() => {
              onConfirm(loadoutName.trim())
              onClose()
            }}
          >
            {edit ? 'Confirm' : 'Create'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
