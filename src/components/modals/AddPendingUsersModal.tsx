import * as React from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme, Stack } from '@mui/material'
import { Cancel, Check } from '@mui/icons-material'
import { SessionContext } from '../../context/session.context'
import { UserPicker } from '../fields/UserPicker'
import { validateSCName } from '@regolithco/common'

export interface AddInnactiveUsersModalProps {
  open: boolean
  onClose: () => void
}

export const AddPendingUsersModal: React.FC<AddInnactiveUsersModalProps> = ({ open, onClose }) => {
  const theme = useTheme()
  const { addSessionMentions, session, myUserProfile, userSuggest } = React.useContext(SessionContext)
  const [[addNameFinal, error], setAddName] = React.useState<[string, string | null]>(['', null])

  const activeNames: string[] = React.useMemo(
    () => session?.activeMembers?.items?.map(({ owner }) => (owner?.scName as string).toLowerCase()) || [],
    [session?.activeMembers]
  )
  const pendingNames: string[] = React.useMemo(
    () => session?.mentionedUsers?.map(({ scName }) => scName.toLowerCase()) || [],
    [session?.activeMembers]
  )
  const allNames = [...activeNames, ...pendingNames]

  const handleChange = (addName: string): string | null => {
    const addNameLower = addName.toLowerCase()

    let error: string | null = null
    if (!addName || addName.trim().length === 0) error = 'Please enter a name'
    else if (addNameLower === myUserProfile.scName.toLowerCase()) error = 'You cannot add yourself'
    else if (activeNames.includes(addNameLower)) error = 'User has already joined'
    else if (pendingNames.includes(addNameLower)) error = 'User is already added as "innactive"'
    else if (!validateSCName(addNameLower)) error = 'Invalid name'

    setAddName([addName, error])
    return error
  }

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
      <DialogTitle>Add usernames to session</DialogTitle>
      <DialogContent>
        <Typography variant="caption" component="div">
          Add a user to the session. Added users start as "Pending" but they become "Active" once they log in and join
          the session.
        </Typography>

        {error ? (
          <Typography variant="overline" component="div" color="error">
            {error}
          </Typography>
        ) : addNameFinal.length > 0 ? (
          <Typography variant="overline" component="div" color="success" sx={{ color: theme.palette.success.main }}>
            User is valid
          </Typography>
        ) : (
          <Typography variant="overline" component="div" color="text.secondary">
            Enter a star citizen user name
          </Typography>
        )}
        <UserPicker
          label="Name"
          toolTip={null}
          disableResetBox
          onInputChange={handleChange}
          onChange={(addName) => {
            const newError = handleChange(addName)
            if (newError === null) {
              addSessionMentions && addSessionMentions([addName])
              // TODO: THis is a hack. modal won't close unless we wait a bit
              setTimeout(onClose, 200)
            }
          }}
          userSuggest={userSuggest}
          includeFriends
          includeMentioned
          disableList={allNames || []}
        />
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
          <Button color="secondary" onClick={onClose} variant="contained" startIcon={<Cancel />}>
            Cancel
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Button
            color="primary"
            startIcon={<Check />}
            disabled={!addNameFinal || addNameFinal.trim().length === 0 || error !== null}
            sx={{ background: theme.palette.background.paper }}
            variant="outlined"
            onClick={() => {
              addSessionMentions && addSessionMentions([addNameFinal])
              onClose()
            }}
          >
            Add
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
