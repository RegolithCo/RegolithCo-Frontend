import * as React from 'react'

import { Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { SCUsernameField } from '../fields/SCUsernameField'

export interface ChangeUsernameModalProps {
  open: boolean
  initialValue: string
  onClose: () => void
  onChange: (newValue: string) => void
}

export const ChangeUsernameModal: React.FC<ChangeUsernameModalProps> = ({ open, initialValue, onClose, onChange }) => {
  const [newScName, setNewScName] = React.useState<string | null>(initialValue)

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Star Citizen Username</DialogTitle>
      <DialogContent>
        <Alert elevation={6} variant="outlined" severity="warning">
          <AlertTitle>Warning</AlertTitle>
          Changing your Star Citizen username can make things a little weird. If you already have data in this system.
          <ul>
            <li>You will need to re-verify.</li>
            <li>Existing workorders and jobs will not be affected.</li>
            <li>Other user's friend list will not be affected.</li>
          </ul>
        </Alert>
        <SCUsernameField
          onSubmit={() => {
            onChange && onChange(newScName as string)
            onClose()
          }}
          onChange={(newVal) => setNewScName(newVal)}
          defaultValue={newScName}
        />
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          disabled={!newScName || newScName.length < 1 || newScName === initialValue}
          onClick={() => {
            onChange && onChange(newScName as string)
            onClose()
          }}
        >
          Change
        </Button>
      </DialogActions>
    </Dialog>
  )
}
