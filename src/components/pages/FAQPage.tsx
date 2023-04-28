import * as React from 'react'
import Typography from '@mui/material/Typography'
import { PageWrapper } from '../PageWrapper'
import { Avatar, Button, Divider, Link, Paper, Stack, SxProps, Theme, useTheme } from '@mui/material'
import { Coffee } from '@mui/icons-material'
import { DiscordIcon } from '../../icons/Discord'

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  innerPaper: {
    p: 3,
    mb: 4,
  },
})

export const FAQPage: React.FC = () => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  return (
    <PageWrapper title="FAQ" maxWidth="sm" sx={{ marginLeft: { lg: '7%' } }}>
      <Paper elevation={5} sx={styles.innerPaper}>
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
      </Paper>
      <Paper elevation={5} sx={styles.innerPaper}>
        <Typography variant="h5" gutterBottom>
          How do I report a bug or ask for a feature?
        </Typography>
        <Typography gutterBottom>
          If you're a discord user that's probably the best place. It really helps me if you can take a screenshot of
          the problem and also{' '}
          <strong>
            <em>send me your user id</em>
          </strong>{' '}
          (you can find it on the bottom of the user profile page)
        </Typography>
        <Button
          startIcon={<DiscordIcon />}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ fontSize: '1rem', p: 2 }}
          href="https://discord.gg/6TKSYHNJha"
          target="_blank"
        >
          Discord Server
        </Button>
        <Typography gutterBottom>
          If you're not a discord user, you can also{' '}
          <Link href="https://twitter.com/RegolithCo" target="_blank">
            hit me up on twitter
          </Link>
        </Typography>
      </Paper>
      <Paper elevation={5} sx={styles.innerPaper}>
        <Typography variant="h5" gutterBottom>
          3.19 is going to change mining. Can Regolith adapt?
        </Typography>
        <Typography gutterBottom>
          I'm really excited about the new mining changes coming in 3.19. But I'm also nervous about how much they
          change and how much work it will to adapt.
        </Typography>
        <Typography gutterBottom>
          Hopefully this won't be too painful. Certainly things like prices are easy to update. Adding new ore types
          like iron and the new rare hand-mineable should be pretty easy too. The biggest challenge will be: 1) the new
          dynamic pricing system and 2) The new rock composition calculations. Regolith might need new controls to allow
          you to enter your sell location and a bunch more lookup values.
        </Typography>
        <Typography gutterBottom>
          I've got a 3.19 development code branch started already but CIG can change anything at any time so I think the
          safest thing to do is to wait until 3.19 hits and stabilizes a bit in the PTU. Unfortunately this means
          Regolith might not be 100% ready on day 1 of 3.19 in the PU but hopefully it won't be too long a wait.
        </Typography>
        <Typography gutterBottom>
          Also if things change too much <strong>I might need to wipe the Regolith database for 3.19</strong> but I'm
          really hoping not to. Stay tuned!
        </Typography>
      </Paper>
      <Paper elevation={5} sx={styles.innerPaper}>
        <Typography variant="h5" gutterBottom>
          Will this tool always be free?
        </Typography>
        <Typography paragraph>
          First off, this is not about profit. It is a passion project that I created for myself, my friends and my ORG
          (
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
          or buy me a coffee on <Link href="https://ko-fi.com/regolithco">ko-fi</Link> or{' '}
          <Link href="https://patreon.com/user?u=64746907">Patreon</Link> as a gesture of appreciation and to help cover
          server costs, that would be greatly appreciated. Beyond that, I have no plans to monetize the site through
          advertising or any other methods.
        </Typography>
      </Paper>
      <Paper elevation={5} sx={styles.innerPaper}>
        <Typography variant="h5" gutterBottom>
          "Will there be data wipes?"
        </Typography>
        <Typography paragraph>
          <strong>Yes!</strong> Star Citizen wipes their database when they patch and so will Regolith Co. If that's a
          problem for you then be sure to regularly download your sessions to either a CSV or JSON files.
        </Typography>
        <Typography paragraph>
          Why? It's just easier than migrating all the numbers in the database to their new values. Or trying to support
          multiple versions of Star Citizen's mercurial alpha nature.
        </Typography>
      </Paper>
      <Paper elevation={5} sx={styles.innerPaper}>
        <Typography variant="h5" gutterBottom>
          "What about privacy / security?"
        </Typography>
        <Typography paragraph>
          We don't collect any identifying data beyond your Star Citizen username (optional) and your discord or google
          id to enable login. Any other information in the site is only what you choose to add.
        </Typography>
        <Typography paragraph>
          The data you enter into this tool will be used to calculate stats and interesting metrics but we will never
          single-out or expose individual data about any user without their express consent.
        </Typography>
        <Typography paragraph>
          Currently we don't use Google analytics or any other tracking tools but that might change at some point to
          help track and estimate my server needs.
        </Typography>
        <Typography paragraph>
          If you have concerns about putting sensitive information in here then please{' '}
          <strong>
            <em>just don't</em>
          </strong>
          . You can still use the standalone calculators for free even without logging in.
        </Typography>
      </Paper>
    </PageWrapper>
  )
}
