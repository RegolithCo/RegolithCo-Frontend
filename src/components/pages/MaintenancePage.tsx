import { Alert, AlertTitle, Typography } from '@mui/material'
import * as React from 'react'

import { PageWrapper } from '../PageWrapper'

export interface MaintenancePageProps {
  msg?: string
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({ msg }) => {
  return (
    <PageWrapper title="Maintenance">
      <Typography variant="body1" component="p" gutterBottom>
        The Regolith Co. service is down for maintenance
      </Typography>

      <Alert severity="warning">
        <AlertTitle>Maintenance</AlertTitle>
        {msg}
      </Alert>

      <Typography variant="body1" component="p" gutterBottom>
        Please try again later.
      </Typography>
    </PageWrapper>
  )
}
