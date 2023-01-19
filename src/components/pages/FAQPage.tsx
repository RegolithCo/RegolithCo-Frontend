import * as React from 'react'
import Typography from '@mui/material/Typography'
import { PageWrapper } from '../PageWrapper'
import { Divider, Link } from '@mui/material'

export const FAQPage: React.FC = () => {
  return (
    <PageWrapper title="About Regolith Co." maxWidth="md" sx={{ marginLeft: { sm: '7%' } }}>
      <Typography variant="h5" gutterBottom>
        What is this? Where did it come from?
      </Typography>
      <Typography gutterBottom>
        This tool was created in response to the need for better organization and tracking of mining jobs within the{' '}
        <Link href="https://robertsspaceindustries.com/orgs/UEMC" target="_blank">
          UEMC organization
        </Link>
        . It started life as a humble{' '}
        <Link
          href="https://docs.google.com/spreadsheets/d/1Gb3gEjBZ90Aoo53H9oP4yTzbSU2pYKA_G_FSLbVbH10/edit#gid=1678166171"
          target="_blank"
        >
          Google Spreadsheet
        </Link>
        , but quickly grew beyond its container. I had always had a clear idea of what I wanted it to be, but I was
        hesitant to take on the additional responsibility of maintaining a website. However, I eventually made the
        decision to go ahead and build it. I hope you find it helpful.
      </Typography>
      <Divider sx={{ m: 2 }} />
      <Typography variant="h5" gutterBottom>
        Will this tool always be free?
      </Typography>
      <Typography paragraph>
        First off, this is not about profit. It is a passion project that I created for myself, my friends and my ORG (
        <Link href="https://robertsspaceindustries.com/orgs/UEMC" target="_blank">
          Check out the UEMC if you haven't already
        </Link>
        ) to enjoy mining together.{' '}
        <strong>
          While it is designed to be low maintenance and require minimal resources, that may change if it becomes
          popular.
        </strong>{' '}
        Sort of a nice problem to have, but I'll cross that bridge when/if we get there.
      </Typography>

      <Typography paragraph>
        Feel free to use the site as much as you'd like totally free. If you'd like to contribute towards server costs
        or buy me a coffee as a gesture of appreciation, that would be greatly appreciated. Beyond that, I have no plans
        to monetize the site through advertising or any other methods.
      </Typography>

      <Divider sx={{ m: 2 }} />
      <Typography variant="h5" gutterBottom>
        Is my data safe?
      </Typography>
      <Typography paragraph>
        What data? Kidding... well sort of. I don't track, store or sell your login info, identity, passwords or emails
        in the database. Any data you enter into this app might be used to do fun things like reporting on general
        trends (ore collected, etc...). I won't ever mention individual users by name without express permission.
      </Typography>
      <Typography paragraph>
        I might turn on Google analytics at some point to keep track of traffic and estimate my server needs.
      </Typography>
      <Typography paragraph>
        That said, I am not a security expert. If you have concerns about putting sensitive information in here then
        please{' '}
        <strong>
          <em>just don't</em>
        </strong>
        . You can still use the standalone calculators for free even without an account.
      </Typography>
      <Typography paragraph>This is all placeholder text. Better legalese is probably needed.</Typography>
    </PageWrapper>
  )
}
