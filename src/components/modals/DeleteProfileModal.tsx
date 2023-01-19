import * as React from 'react'

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material'
import { SCUsernameField } from '../fields/SCUsernameField'

export interface DeleteProfileModalProps {
  open: boolean
  scName: string
  onClose: () => void
  onConfirm: () => void
}

const bulletStyleYES: React.CSSProperties = {
  content: '"✓"',
  color: 'green',
  fontWeight: 'bold',
  display: 'inline-block',
  width: '1em',
  marginLeft: '-1em,',
}
const bulletStyleNO: React.CSSProperties = {
  content: '"✗"',
  color: 'red',
  fontWeight: 'bold',
  display: 'inline-block',
  width: '1em',
  marginLeft: '-1em,',
}

export const DeleteProfileModal: React.FC<DeleteProfileModalProps> = ({ open, scName, onClose, onConfirm }) => {
  const [confirm, setConfirm] = React.useState<string>('')
  const [clean, setClean] = React.useState<boolean>(false)
  const good2go = confirm === scName
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle color="error">DANGER: Delete User Account</DialogTitle>
      <DialogContent>
        <Typography paragraph>Your user profile and login will be cleaned up.</Typography>
        <Typography paragraph>
          Additionally you can choose to delete all sessions and work orders you created. There is no harm in leaving
          those behind though, especially if others would find it useful.
        </Typography>
        <FormGroup
          sx={{
            border: '1px solid',
            borderRadius: 2,
            p: 1,
            m: 2,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox onChange={(event: React.ChangeEvent<HTMLInputElement>) => setClean(event.target.checked)} />
            }
            label="Remove my data as well"
          />
        </FormGroup>
        <Box
          sx={{
            ul: {
              listStyle: 'none',
            },
            'ul li.yes::before': bulletStyleYES,
            'ul li.no::before': bulletStyleNO,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            What will be cleaned up:
          </Typography>
          <ul className={'yesno'}>
            <li className={'yes'}>Remove your login</li>
            <li className={clean ? 'yes' : 'no'}>Remove work orders and sessions you created</li>
            <li className={clean ? 'yes' : 'no'}>Change past shares with your username to "DELETED_USER"</li>
          </ul>
        </Box>
        <Typography variant="body1" color="primary">
          Please type your Star Citizen username <strong>({scName})</strong> to confirm.
        </Typography>
        <SCUsernameField defaultValue={''} onChange={(confirmName) => setConfirm(confirmName || '')} />
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Button
          color="secondary"
          disabled={!good2go}
          onClick={onConfirm}
          size="large"
          variant={good2go ? 'contained' : 'text'}
        >
          Delete User Profile
        </Button>
      </DialogActions>
    </Dialog>
  )
}
