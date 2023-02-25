import * as React from 'react'
import Typography from '@mui/material/Typography'
import { PageWrapper } from '../PageWrapper'
import { Avatar, Button, Divider, Link, Paper, Stack, SxProps, Theme, useTheme } from '@mui/material'
import { Coffee } from '@mui/icons-material'

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
          or buy me a coffee as a gesture of appreciation, that would be greatly appreciated. Beyond that, I have no
          plans to monetize the site through advertising or any other methods.
        </Typography>{' '}
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
            sx={{ fontSize: '1rem', p: 1 }}
            startIcon={<Avatar src={`${process.env.PUBLIC_URL}/images/icons/kofi_s_logo_nolabel.webp`} />}
          >
            Ko-Fi
          </Button>
          <Button
            variant="contained"
            href="https://patreon.com/user?u=64746907"
            target="_blank"
            fullWidth
            color="secondary"
            sx={{ fontSize: '1rem', p: 1 }}
            startIcon={<Coffee />}
          >
            Patreon
          </Button>
        </Stack>
      </Paper>
      <Paper elevation={5} sx={styles.innerPaper}>
        <Typography variant="h5" gutterBottom>
          Will there be data wipes?
        </Typography>
        <Typography paragraph>
          Yes. Star Citizen wipes their database when they patch and so will Regolith Co. If that's a problem for you
          then be sure to regularly download your sessions to either a CSV or JSON files.
        </Typography>
        <Typography paragraph>
          Why? It's just easier than migrating all the numbers in the database to their new values. Or trying to support
          multiple versions of Star Citizen's mercurial alpha nature.
        </Typography>
      </Paper>
      <Paper elevation={5} sx={styles.innerPaper}>
        <Typography variant="h5" gutterBottom>
          What about privacy / security?
        </Typography>
        <Typography paragraph>
          We don't collect any identifying data beyond your Star Citizen username (optional).
        </Typography>
        <Typography paragraph>
          The data you enter into this tool will be used to calculate stats and interesting metrics but we will never
          single you out or expose individual data about any user without their express consent.
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
