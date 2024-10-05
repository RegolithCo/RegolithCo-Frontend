import * as React from 'react'

import { UserProfile, Session, SessionStateEnum } from '@regolithco/common'
import { Alert, AlertTitle, Box, FormControlLabel, Switch, Typography, useTheme } from '@mui/material'
import { SessionList } from '../../fields/SessionList'
import { Stack } from '@mui/system'
import { fontFamilies } from '../../../theme'

export interface TabSessionsProps {
  userProfile: UserProfile
  mySessions: Session[]
  joinedSessions: Session[]
  fetchMoreSessions: () => void
  loading?: boolean
  allLoaded?: boolean
  navigate?: (path: string) => void
}

export const TabSessions: React.FC<TabSessionsProps> = ({
  userProfile,
  mySessions,
  fetchMoreSessions,
  joinedSessions,
  allLoaded,
  loading,
  navigate,
}) => {
  const theme = useTheme()
  const [activeOnly, setActiveOnly] = React.useState(false)

  // Make our buckets: bucket 1: [year-month] bucket 2: day
  const allSessionsSorted: Session[] = React.useMemo(() => {
    const allSessions = [...mySessions, ...joinedSessions].filter((s) =>
      activeOnly ? s.state !== SessionStateEnum.Closed : true
    )
    allSessions.sort((a, b) => b.createdAt - a.createdAt)
    return allSessions
  }, [mySessions, joinedSessions, activeOnly])

  return (
    <>
      <Stack
        spacing={2}
        sx={{ my: 2, mb: 4, borderBottom: `4px solid ${theme.palette.secondary.dark}` }}
        direction={{ xs: 'column', sm: 'row' }}
      >
        <Typography
          variant="h3"
          component="h3"
          gutterBottom
          sx={{
            color: 'secondary.dark',
            fontFamily: fontFamilies.robotoMono,
            fontWeight: 'bold',
          }}
        >
          My Session Timeline
        </Typography>
        <Box sx={{ flex: 1 }} />
        <FormControlLabel
          control={<Switch checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} />}
          label="Only active"
          labelPlacement="start"
        />
      </Stack>

      <Alert elevation={1} variant="standard" severity="info" sx={{ my: 2, flex: 1 }}>
        <AlertTitle>Sessions close automatically</AlertTitle>
        <Typography>
          Sessions end after 12 hours of inactivity. Ended sessions cannot be re-opened, however you can still mark
          shares as paid.{' '}
        </Typography>
      </Alert>

      <SessionList
        sessions={allSessionsSorted}
        loading={loading}
        allLoaded={allLoaded}
        fetchMoreSessions={fetchMoreSessions}
        activeOnly={activeOnly}
        onClickSession={(sessionId) => navigate?.(`/session/${sessionId}`)}
      />
    </>
  )
}
