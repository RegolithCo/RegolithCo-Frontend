import * as React from 'react'

import { Button, ButtonGroup, FormControl, FormLabel, MenuItem, Select, Stack, useTheme } from '@mui/material'
import { AddCircle, RocketLaunch } from '@mui/icons-material'
import { Session } from '@regolithco/common'
import { ConfirmModal } from '../../modals/ConfirmModal'
import { Box } from '@mui/system'

export interface JoinSessionButtonProps {
  sessions: Session[]
  navigate?: (path: string) => void
  onCreateNewSession?: () => void
}

export const JoinSessionButton: React.FC<JoinSessionButtonProps> = ({ sessions, navigate, onCreateNewSession }) => {
  const theme = useTheme()
  const [currentSelection, setCurrentSelection] = React.useState<string | null>(
    sessions.length > 0 ? sessions[0].sessionId : null
  )
  const [confirmModalOpen, setConfirmModalOpen] = React.useState(false)

  let sessCtl: React.ReactNode = null

  if (sessions.length < 1) {
    sessCtl = (
      <Button fullWidth variant="contained" disabled size="large">
        No Currently Active Sessions
      </Button>
    )
  } else if (sessions.length === 1) {
    sessCtl = (
      <FormControl fullWidth>
        <FormLabel>Enter Active Session:</FormLabel>

        <Button
          fullWidth
          variant="contained"
          size="large"
          color="info"
          onClick={() => navigate && navigate(`/session/${sessions[0].sessionId}`)}
          startIcon={<RocketLaunch />}
        >
          {sessions[0].name}
        </Button>
      </FormControl>
    )
  } else {
    sessCtl = (
      <FormControl fullWidth>
        <FormLabel>{sessions.length} Active Sessions:</FormLabel>
        <ButtonGroup size="small">
          <Select
            placeholder="Join an existing session (2 available)"
            size="small"
            value={currentSelection}
            onChange={(e) => setCurrentSelection(e.target.value)}
            fullWidth
            disabled={sessions.length < 2}
          >
            {sessions.map(({ sessionId, name }) => (
              <MenuItem value={sessionId}>{name}</MenuItem>
            ))}
            {sessions.length < 1 && (
              <MenuItem disabled value="NOPE">
                No Sessions available
              </MenuItem>
            )}
          </Select>
          <Button
            color="secondary"
            size="medium"
            fullWidth
            disabled={!currentSelection}
            startIcon={<RocketLaunch />}
            variant="contained"
            onClick={() => {
              if (currentSelection) {
                navigate && navigate(`/session/${currentSelection}`)
              }
            }}
          >
            Go
          </Button>
        </ButtonGroup>
      </FormControl>
    )
  }
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 7,
        // backgroundColor: '#282828',
        display: 'flex',
        flexDirection: 'column',
        border: `5px solid ${theme.palette.primary.main}`,
      }}
    >
      <Stack direction={'row'} spacing={2} alignItems={'end'} justifyContent={'center'}>
        {sessCtl}
        <FormControl fullWidth>
          <FormLabel>Create a new session:</FormLabel>
          <Button
            sx={{ flex: '1 1 40%' }}
            size="large"
            fullWidth
            startIcon={<AddCircle />}
            variant="contained"
            onClick={sessions.length > 0 ? () => setConfirmModalOpen(true) : onCreateNewSession}
          >
            Create a new Session
          </Button>
        </FormControl>
        <ConfirmModal
          title={`You already have ${sessions.length} active session${sessions.length > 1 ? 's' : ''}`}
          message="Create another one?"
          cancelBtnText="No"
          confirmBtnText="Yes"
          open={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={() => onCreateNewSession}
        />
      </Stack>
    </Box>
  )
}
