import * as React from 'react'
import { Box, Typography } from '@mui/material'
import { PageWrapper } from '../PageWrapper'
import { Coffee } from '@mui/icons-material'

export const AboutPage: React.FC = () => {
  return (
    <PageWrapper title="About Regolith Company" maxWidth="sm" sx={{ marginLeft: { lg: '7%' } }}>
      <Typography variant="h4" component="h1" gutterBottom></Typography>
      <Typography variant="body2" paragraph>
        I am a software developer and a Star Citizen backer. I have been playing Star Citizen since 2020. I am a member
        of the UEMC org.
      </Typography>
      <Typography variant="body2" paragraph>
        Supporting the site and help pay for server costs:
      </Typography>
      <ul>
        <li>Buy me a coffee. Developers love coffee.</li>
        {/* <li>Sponsor me for a few dollars on Patreon</li> */}
        {/* <li>
          Send a few aUEC to <code style={{ border: '1px solid #aaaaaa44', padding: '2px 4px' }}>_________</code> but
          there aren't notifications so make sure to let me know so I can say thanks.
        </li> */}
      </ul>
      <Box sx={{ height: 100, width: 100, margin: '0 auto' }}>
        <Coffee sx={{ fontSize: 90 }} />
      </Box>
    </PageWrapper>
  )
}
