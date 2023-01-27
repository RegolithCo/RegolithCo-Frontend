import * as React from 'react'
import { Button, Divider, Link, Stack, Typography } from '@mui/material'
import { PageWrapper } from '../PageWrapper'
import { Coffee, Segment, Twitter } from '@mui/icons-material'
import { fontFamilies } from '../../theme'

export const AboutPage: React.FC = () => {
  return (
    <PageWrapper title="About Regolith Co." maxWidth="sm" sx={{ marginLeft: { lg: '7%' } }}>
      <Typography>
        Regolith Co. is a fansite dedicated to helping Star Citizen players organize, share and scout together.
      </Typography>
      <Typography variant="h4" component="h1" gutterBottom></Typography>
      <Typography paragraph>
        It was developed by me. I am a software developer and a Star Citizen backer. I have been playing Star Citizen
        since 2020. I am a member of the{' '}
        <Link href="https://robertsspaceindustries.com/orgs/uemc" target="_blank">
          United Earth Mining Corporation (UEMC)
        </Link>
        .
      </Typography>
      <Typography variant="h5" paragraph sx={{ borderBottom: '1px solid' }}>
        Support the site
      </Typography>
      <Typography paragraph>
        Everyone can use this site for free, hopefully forever. That said, server costs are a real thing so if you use
        it and are looking for a way to help keep the lights on your support would be amazing!
      </Typography>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        sx={{ width: '100%', mb: 3 }}
      >
        <Button
          variant="contained"
          href="https://ko-fi.com/regolithco"
          target="_blank"
          fullWidth
          sx={{ fontSize: '1rem', p: 2 }}
          startIcon={<Coffee />}
        >
          Ko-Fi
        </Button>
        <Button
          variant="contained"
          href="https://patreon.com/user?u=64746907"
          target="_blank"
          fullWidth
          color="secondary"
          sx={{ fontSize: '1rem', p: 2 }}
          startIcon={<Coffee />}
        >
          Patreon
        </Button>
      </Stack>
      <Typography variant="h5" paragraph sx={{ borderBottom: '1px solid' }}>
        Report Bugs / Get Help
      </Typography>
      <Typography paragraph>RegolithCo is on twitter.</Typography>
      <Button
        startIcon={<Twitter />}
        variant="contained"
        color="info"
        sx={{ fontSize: '1rem', mb: 3 }}
        href="https://twitter.com/RegolithCo"
        target="_blank"
      >
        @RegolithCo
      </Button>
      <Typography paragraph>For the old-school among us here's an email address I check every now and then.</Typography>
      <Typography
        component="div"
        sx={{
          border: '1px solid',
          m: 3,
          p: 1,
          fontFamily: fontFamilies.robotoMono,
          textAlign: 'center',
        }}
      >
        info@regolith.rocks
      </Typography>
      <Typography variant="caption" paragraph sx={{ p: 1, m: 1 }}>
        Regolith Co. is a Star Citizen fansite, not affiliated with the Cloud Imperium group of companies in any way.
        All content on this site not authored by its host or users are property of their respective owners. <br />
        Star Citizen®, Roberts Space Industries® and Cloud Imperium® are registered trademarks of Cloud Imperium Rights
        LLC.
      </Typography>
    </PageWrapper>
  )
}
