import { Replay } from '@mui/icons-material'
import { Button, Stack, Typography } from '@mui/material'
import * as React from 'react'

import { PageWrapper } from '../PageWrapper'
import { wipeLocalLookups } from '../../lib/utils'

export const ServiceDownPage: React.FC = () => {
  const [countdown, setCountdown] = React.useState<number>(10)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        const newCountdown = prev - 1
        if (newCountdown <= 0) {
          clearInterval(interval)
          wipeLocalLookups()
          window.location.reload()
          return prev
        } else return newCountdown
      })
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const handleReload = () => {
    wipeLocalLookups()
    window.location.reload()
  }

  return (
    <PageWrapper title="Service Down">
      <Typography variant="body1" component="p" gutterBottom paragraph>
        The Regolith Co. service is currently experiencing a temporary outagse. In most cases reloading the website will
        fix this problem.
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button startIcon={<Replay />} color="info" variant="contained" onClick={handleReload}>
          Try Reloading
        </Button>
        <Typography variant="caption">
          Reloading automatically in <span id="countdown">{countdown}</span> seconds
        </Typography>
      </Stack>
    </PageWrapper>
  )
}
