import React from 'react'
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { Check } from '@mui/icons-material'

export type NoteAddDialogProps = {
  title?: string
  note?: string
  open?: boolean
  onClose: () => void
  onChange: (newNote: string) => void
}

export const NoteAddDialog: React.FC<NoteAddDialogProps> = ({ open, note, title, onClose, onChange }) => {
  const [newNote, setNewNote] = React.useState<string>(note || '')
  const [noteValid, setNoteValid] = React.useState<boolean>(true)

  return (
    <Dialog
      open={Boolean(open)}
      onClose={onClose}
      maxWidth="sm"
      aria-labelledby="closeDelete"
      aria-describedby="closeDelete"
    >
      <DialogTitle id="alert-dialog-title">{title || 'Add Note'}</DialogTitle>
      <DialogContent>
        <TextField
          id="outlined-multiline-flexible"
          multiline
          fullWidth
          inputRef={(input) => input && input.focus()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onChange(newNote)
              onClose()
            }
          }}
          value={newNote || ''}
          variant="standard"
          onChange={(e) => {
            setNewNote(e.target.value || '')
          }}
          sx={{ mb: 2 }}
          placeholder="Enter a note..."
          maxRows={4}
        />
      </DialogContent>
      <DialogActions sx={{ display: 'flex' }}>
        <Button color={'error'} size="small" onClick={onClose} autoFocus>
          cancel
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Button
          color={'secondary'}
          variant="contained"
          size="small"
          onClick={() => {
            onChange(newNote)
            onClose()
          }}
          autoFocus
        >
          Set
        </Button>
      </DialogActions>
    </Dialog>
  )
}
