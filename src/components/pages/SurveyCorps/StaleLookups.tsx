import * as React from 'react'

import { Alert, AlertTitle, Button, Container, Typography } from '@mui/material'
import { Replay } from '@mui/icons-material'
import { wipeLocalLookups } from '../../../lib/utils'

export const StaleLookups: React.FC = () => {
  return (
    <Container maxWidth={'sm'} sx={{ mt: 10 }}>
      <Alert severity="warning" sx={{ borderRadius: 0 }}>
        <AlertTitle>Stale Lookup Data</AlertTitle>
        <Typography variant="body2" paragraph component="div">
          The data on this page is from an older version of the survey. You can try wiping your local lookups. If it
          doesn't work please try again in a few minutes.
        </Typography>
        <Button
          startIcon={<Replay />}
          color="error"
          variant="contained"
          size="large"
          onClick={() => {
            wipeLocalLookups()
            window.location.reload()
          }}
        >
          Wipe local data
        </Button>
      </Alert>
    </Container>
  )
}
