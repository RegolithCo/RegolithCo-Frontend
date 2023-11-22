import * as React from 'react'
import { Button, Paper, Typography } from '@mui/material'
import { PageWrapper } from '../../PageWrapper'
import { ArrowBack } from '@mui/icons-material'

export interface SessionNotFound {
  action: () => void
}

export const SessionNotFound: React.FC<SessionNotFound> = ({ action }) => {
  return (
    <PageWrapper title="Session Not Found" maxWidth="md">
      <Paper elevation={5} sx={{ p: 3, border: '1px solid white', borderRadius: 3 }}>
        <Typography variant="subtitle1" component="div" paragraph>
          Either this session does not exist or you have not joined it using a valid share link.
        </Typography>
        <Typography variant="subtitle1" component="div" paragraph>
          If you are trying to join a session make sure you use a link that looks like:
        </Typography>
        <code>
          <pre>http://regolith.rocks/sharing?joinId=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX</pre>
        </code>
        <Button variant="contained" startIcon={<ArrowBack />} onClick={action}>
          Back to sessions
        </Button>
      </Paper>
    </PageWrapper>
  )
}
