import * as React from 'react'
import { Box, Button, Link, Paper, SxProps, Theme, Typography, useTheme } from '@mui/material'
import { DiscordIcon } from '../../icons/Discord'

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  innerPaper: {
    p: 3,
    mb: 4,
  },
  card: {
    p: {
      xs: 1,
      sm: 2,
      md: 3,
    },
    m: {
      xs: 0.5,
      sm: 1,
      md: 2,
    },
  },
})

export const AboutPageFAQ: React.FC = () => {
  const theme = useTheme()
  const styles = stylesThunk(theme)

  return (
    <Box
      sx={{
        mb: 3,
        '& p': {
          mb: 2,
        },
        '& h5': {
          color: theme.palette.secondary.dark,
        },
      }}
    >
      <Paper elevation={5} sx={styles.innerPaper}>
        <Typography variant="h5" gutterBottom>
          Login isn't working for me!
        </Typography>
        <Typography gutterBottom>
          A small number of users seem to have trouble logging in. If you're one of them, try the following:
        </Typography>
        <Typography gutterBottom component={'div'}>
          <ul>
            <li>If you use Avast Antitrack you may need to add regolith.rocks to the allowed website list.</li>
            <li>Try disabling your ad-blockers or making an exception for regolith.rocks</li>
          </ul>
        </Typography>
      </Paper>
      <Paper elevation={5} sx={styles.innerPaper}>
        <Typography variant="h5" gutterBottom>
          "What is this site/app? Where did it come from?"
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
          decision to go ahead and build it. Now here we are. I hope you find it helpful.
        </Typography>
      </Paper>
      <Paper elevation={5} sx={styles.innerPaper}>
        <Typography variant="h5" gutterBottom>
          "How do I report a bug or ask for a new feature?"
        </Typography>
        <Typography gutterBottom>
          If you're a discord user that's probably the best place. It really helps if you can take a screenshot of the
          problem and also{' '}
          <strong>
            <em>send us your user id</em>
          </strong>{' '}
          (you can find it on the bottom of the user profile page)
        </Typography>
        <Box
          sx={{
            p: 2,
            textAlign: 'center',
          }}
        >
          <Button
            startIcon={<DiscordIcon />}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ fontSize: '1rem', p: 2, maxWidth: 200 }}
            href="https://discord.gg/6TKSYHNJha"
            target="_blank"
          >
            Discord Server
          </Button>
        </Box>
        {/* <Typography gutterBottom paragraph>
          If you're not a discord user, you can also{' '}
          <Link href="https://twitter.com/RegolithCo" target="_blank">
            hit us up on twitter
          </Link>{' '}
          but we might respond more slowly because well... twitter.
        </Typography> */}
      </Paper>
      <Paper elevation={5} sx={styles.innerPaper}>
        <Typography variant="h5" gutterBottom>
          "I can't log in with either Google or Discord"
        </Typography>
        <Typography gutterBottom component="div">
          In rare cases we've been seeing some logins blocked. There are some things you can try:
          <ul>
            <li>
              <strong>Clear your browser cache</strong> reload the page
            </li>
            <li>
              Sometimes <strong>ad blockers like Privacy Badger</strong> can cause problems. Try disabling them for this
              site (we will never serve you ads) and reload the page
            </li>
            <li>
              <strong>Try a different browser</strong> (Chrome, Firefox, Edge, etc.)
            </li>
          </ul>
        </Typography>
        <Typography paragraph>(BTW, if you're reading this CIG then we'd love to hear from you!)</Typography>
      </Paper>
      <Paper elevation={5} sx={styles.innerPaper}>
        <Typography variant="h5" gutterBottom>
          "Star citizen X.XX is going to change mining. Can Regolith adapt?"
        </Typography>
        <Typography gutterBottom>
          CIG is moving fast and Regolith will always try to keep up! There is currently no direct communication between
          CIG and third-party developers though so we might lag the official patches a bit while we try to get our data
          and equations working with the new meta.
        </Typography>
        <Typography paragraph>(BTW, if you're reading this CIG then we'd love to hear from you!)</Typography>
      </Paper>
      <Paper elevation={5} sx={styles.innerPaper}>
        <Typography variant="h5" gutterBottom>
          "In my sessions can I create a work order for someone else?"
        </Typography>
        <Typography gutterBottom>
          YES! Look for the "Alternate Seller" switch. This will let you specify another user as the seller, even if
          they aren't logged into regolith or your session. Once you do this the math will reflect the new seller and
          you can tell them who they owe and how much.
        </Typography>
      </Paper>
      <Paper elevation={5} sx={styles.innerPaper}>
        <Typography variant="h5" gutterBottom>
          "Why do sessions close after 12 hours?"
        </Typography>
        <Typography gutterBottom>
          You may notice that sessions will automatically close if there is no activity for 12 hours. This is to
          discourage never-ending sessions from clogging up the database and to keep things performant and tidy. Once
          closed sessions cannot be re-opened.
        </Typography>
        <Typography gutterBottom>
          There may be times when you need to keep a session open longer than 12 hours. In those cases all you need to
          do is update something in your session and that will reset the counter. You could add and delete a work order
          or change the session description etc.
        </Typography>
      </Paper>
      <Paper elevation={5} sx={styles.innerPaper}>
        <Typography variant="h5" gutterBottom>
          "Will this tool always be free?"
        </Typography>
        <Typography paragraph>
          First off, this is not about profit other than getting miners paid in aUEC. It is a passion project that I
          created for myself, my friends and my Org (
          <Link href="https://robertsspaceindustries.com/orgs/UEMC" target="_blank">
            UEMC
          </Link>
          ) to enjoy mining together.{' '}
          <strong>
            While it is designed to be low maintenance and require minimal resources, that may change if usage spikes
            and maintenance and server costs rise.
          </strong>{' '}
          Sort of a nice problem to have, but I'll cross that bridge when/if we get there.
        </Typography>
        <Typography paragraph>
          Feel free to use the site as much as you'd like totally free. If you'd like to contribute towards server costs
          or buy me a coffee on{' '}
          <Link href="https://ko-fi.com/regolithco" target="_blank">
            ko-fi
          </Link>{' '}
          {/* or{' '}
          <Link href="https://patreon.com/user?u=64746907">Patreon</Link> 
           */}
          that would be greatly appreciated. Beyond that, I have no plans to monetize the site through advertising or
          any other methods.
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
          Why do we do this? It's just easier than migrating all the numbers in the database to their new values. Or
          trying to support multiple versions of Star Citizen's mercurial alpha nature.
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
          <strong>The passwords</strong> you used (Google or Discord) to log in are not stored in any way by Regolith.
        </Typography>
        <Typography paragraph>
          <strong>The data</strong> you enter into this tool will be used to calculate stats and interesting metrics but
          we will never single-out or expose individual data about any user without their express consent.
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
    </Box>
  )
}
