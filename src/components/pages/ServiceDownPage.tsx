import { Typography } from '@mui/material'
import * as React from 'react'

import { PageWrapper } from '../PageWrapper'

export const ServiceDownPage: React.FC = () => {
  return (
    <PageWrapper title="Service Down">
      <Typography variant="body1" component="p" gutterBottom>
        The Regolith Co. service is down for unknown reasons
      </Typography>

      <Typography variant="body1" component="p" gutterBottom>
        Please try again later.
      </Typography>
    </PageWrapper>
  )
}
