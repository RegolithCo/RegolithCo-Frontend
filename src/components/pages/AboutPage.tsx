import * as React from 'react'
import { Avatar, Button, Divider, Link, Paper, Stack, SxProps, Theme, Typography, useTheme } from '@mui/material'
import { PageWrapper } from '../PageWrapper'
import { Coffee, Twitter } from '@mui/icons-material'
import { fontFamilies } from '../../theme'
import { DiscordIcon } from '../../icons/Discord'

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  innerPaper: {
    p: 3,
    mb: 4,
  },
})

export const AboutPage: React.FC = () => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  return (
    <PageWrapper title="About Regolith Co." maxWidth="sm" sx={{ marginLeft: { lg: '7%' } }}>
      <Typography variant="body2" component="div" gutterBottom>
        <em>"Don't mine alone"</em>
      </Typography>
      <Typography>
        Regolith Co. is a fansite dedicated to helping Star Citizen players organize, share, and scout together.
      </Typography>
      <Typography variant="h4" component="h1" gutterBottom></Typography>
      <Typography paragraph>
        It was developed by me. Hello! I am a software developer and a Star Citizen backer. I have been playing Star
        Citizen since 2020. I am a member of the{' '}
        <Link href="https://robertsspaceindustries.com/orgs/uemc" target="_blank">
          United Earth Mining Corporation (UEMC)
        </Link>{' '}
        Organization.
      </Typography>
      <Paper elevation={5} sx={styles.innerPaper}>
        <Typography variant="h5" paragraph sx={{ borderBottom: '1px solid' }}>
          Support the site
        </Typography>
        <Typography paragraph>
          Everyone can use this site for free, hopefully forever. That said, server costs are a real thing. If you use
          it and are looking for a way to help keep the lights on, your support would be amazing!
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
        <Typography variant="h5" paragraph sx={{ borderBottom: '1px solid' }}>
          Report Bugs / Get Help
        </Typography>
        <Typography paragraph>
          Join the Discord server for help, support, bugs, feature requests etc. There is also on twitter (but it is
          checked less often).
        </Typography>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          sx={{ width: '100%', mb: 3 }}
        >
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
          <Button
            startIcon={<Twitter />}
            variant="contained"
            color="info"
            fullWidth
            sx={{ fontSize: '1rem', p: 2 }}
            href="https://twitter.com/RegolithCo"
            target="_blank"
          >
            @RegolithCo
          </Button>
        </Stack>
        {/* <Typography paragraph>
          For the old-school among us, here's an email address but it doesn't get checked very often.
        </Typography>
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
        </Typography> */}
      </Paper>
      <Typography variant="caption" paragraph sx={{ p: 1, m: 1 }}>
        Regolith Co. is a Star Citizen fansite, not affiliated with the Cloud Imperium group of companies in any way.
        All content on this site not authored by its host or users is property of their respective owners. Star
        Citizen®, Roberts Space Industries®, and Cloud Imperium® are registered trademarks of Cloud Imperium Rights LLC.
      </Typography>
    </PageWrapper>
  )
}
