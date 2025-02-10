import * as React from 'react'

import { Button, ButtonGroup, CircularProgress, MenuItem, Select, Stack, Typography } from '@mui/material'
import { AddCircle, RocketLaunch } from '@mui/icons-material'
import { Session } from '@regolithco/common'
import { ConfirmModal } from '../../modals/ConfirmModal'
import { Box } from '@mui/system'

export interface JoinSessionButtonProps {
  sessions: Session[]
  navigate?: (path: string) => void
  loading?: boolean
  onCreateNewSession?: () => void
}

export const JoinSessionButton: React.FC<JoinSessionButtonProps> = ({
  sessions,
  navigate,
  loading,
  onCreateNewSession,
}) => {
  const [currentSelection, setCurrentSelection] = React.useState<string | null>(
    sessions.length > 0 ? sessions[0].sessionId : null
  )
  const [confirmModalOpen, setConfirmModalOpen] = React.useState(false)

  let sessCtl: React.ReactNode = null

  React.useEffect(() => {
    //  If the sessions change then always choose the first one
    if (sessions.length > 0) {
      setCurrentSelection(sessions[0].sessionId)
    }
  }, [sessions])

  if (sessions.length < 1) {
    sessCtl = (
      <Button variant="contained" disabled size="large">
        No Currently Active Sessions
      </Button>
    )
  } else if (sessions.length === 1) {
    sessCtl = (
      <Button
        variant="contained"
        size="medium"
        color="info"
        disabled={loading}
        href={`/session/${sessions[0].sessionId}`}
        startIcon={<RocketLaunch />}
      >
        Active Session: {sessions[0].name}
      </Button>
    )
  } else {
    sessCtl = (
      <ButtonGroup size="medium" variant="contained">
        <Select
          placeholder="Join an existing session (2 available)"
          size="small"
          // fullWidth
          value={currentSelection || 'NOPE'}
          onChange={(e) => setCurrentSelection(e.target.value)}
          disabled={sessions.length < 2 || loading}
        >
          {sessions.map(({ sessionId, name }, idx) => (
            <MenuItem key={`btn-${idx}`} value={sessionId}>
              {name}
            </MenuItem>
          ))}
          {sessions.length < 1 && (
            <MenuItem disabled value={'NOPE'}>
              No Sessions available
            </MenuItem>
          )}
        </Select>
        <Button
          color="secondary"
          size="medium"
          disabled={!currentSelection || loading}
          startIcon={<RocketLaunch />}
          variant="contained"
          href={currentSelection ? `/session/${currentSelection}` : undefined}
        >
          Go
        </Button>
      </ButtonGroup>
    )
  }
  return (
    <Stack
      spacing={2}
      width={'100%'}
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={'center'}
      sx={{
        mb: 4,
        // p: 3,
        // borderRadius: 7,
        // // backgroundColor: '#282828',
        // display: 'flex',
        // flexDirection: 'column',
        // border: `5px solid ${theme.palette.primary.main}`,
      }}
    >
      <Typography variant="overline" component="div">
        Active Sessions:
      </Typography>
      {sessCtl}
      <Box sx={{ flex: 1 }} />
      <Button
        size="medium"
        startIcon={loading ? <CircularProgress size={20} /> : <AddCircle />}
        variant="outlined"
        disabled={loading}
        onClick={loading ? undefined : sessions.length > 0 ? () => setConfirmModalOpen(true) : onCreateNewSession}
      >
        {loading ? 'Creating new Session...' : 'Create a new Session'}
      </Button>
      <ConfirmModal
        title={`You already have ${sessions.length} active session${sessions.length > 1 ? 's' : ''}`}
        message="Create another one?"
        cancelBtnText="No"
        confirmBtnText="Yes"
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => onCreateNewSession && onCreateNewSession()}
      />
    </Stack>
  )
}
