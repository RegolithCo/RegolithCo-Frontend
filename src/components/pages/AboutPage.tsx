import * as React from 'react'
import {
  Avatar,
  Box,
  Button,
  Divider,
  Link,
  Paper,
  Stack,
  SxProps,
  Tab,
  Tabs,
  Theme,
  Typography,
  useTheme,
} from '@mui/material'
import { PageWrapper } from '../PageWrapper'
import { Celebration, Coffee, HelpCenter, Info, Twitter } from '@mui/icons-material'
import { DiscordIcon } from '../../icons/Discord'
import { AppVersion } from '../fields/AppVersion'
import { SCVersion } from '../fields/SCVersion'
import { fontFamilies } from '../../theme'

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  innerPaper: {
    p: 3,
    mb: 4,
  },
})

const TabIndex = {
  General: 0,
  HelpUs: 1,
  GetHelp: 2,
  Thanks: 3,
}

export const AboutPage: React.FC = () => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const [activeTab, setActiveTab] = React.useState(TabIndex.General)
  return (
    <PageWrapper title="About Regolith Co." maxWidth="sm" sx={{ marginLeft: { lg: '7%' } }}>
      <Typography variant="body2" component="div" gutterBottom>
        <em>"Don't mine alone"</em>
      </Typography>
      <Tabs
        value={activeTab}
        aria-label="basic tabs example"
        sx={{ mb: 3 }}
        onChange={(event, newValue) => {
          setActiveTab(newValue)
        }}
      >
        <Tab label="General" icon={<Info />} value={0} />
        <Tab label="Help Us" icon={<Coffee />} value={1} />
        <Tab label="Get Help" icon={<HelpCenter />} value={2} />
        <Tab label="Thanks" icon={<Celebration />} value={3} />
      </Tabs>
      {activeTab === TabIndex.General && (
        <Box sx={{ mb: 3 }}>
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
        </Box>
      )}
      {/* HELP US TAB ============================= */}
      {activeTab === TabIndex.HelpUs && (
        <Box sx={{ mb: 3 }}>
          <Paper elevation={5} sx={styles.innerPaper}>
            <Typography variant="h5" paragraph sx={{ borderBottom: '1px solid' }}>
              Support the site
            </Typography>
            <Typography paragraph>
              Everyone can use this site for free, hopefully forever. That said, server costs are a real thing. If you
              use it and are looking for a way to help keep the lights on, your support would be amazing!
            </Typography>
            <Typography paragraph>Any amount at all is a big help!</Typography>
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
        </Box>
      )}

      {/* GET HELP TAB ============================= */}
      {activeTab === TabIndex.GetHelp && (
        <Box sx={{ mb: 3 }}>
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
          </Paper>
        </Box>
      )}
      {activeTab === TabIndex.Thanks && (
        <Box sx={{ mb: 3 }}>
          <Typography paragraph>
            Regolith is a community-driven app and would not exist without a lot of support and hard work from people.
          </Typography>
          <Paper elevation={5} sx={styles.innerPaper}>
            <Typography variant="h5">
              <Link href="https://uexcorp.space/" target="_blank">
                UEXCorp
              </Link>
            </Typography>
            <Typography variant="body2" paragraph>
              When 3.19 dropped all the prices disappeared from the client XML and we had to scramble to find new ones.
              UEXCorp was gracious to allow us to use their data. If you're looking to help them out you can donate to
              their efforts either with money or{' '}
              <Link href="https://portal.uexcorp.space/users/public_signup" target="_blank">
                volunteer to become a Data Runner
              </Link>{' '}
              and help them gather the crucial data we all depend on.
            </Typography>
          </Paper>

          <Paper elevation={5} sx={styles.innerPaper}>
            <Typography variant="h5">
              <Link href="https://redmonstergaming.com/" target="_blank">
                RedMonsterSC
              </Link>
            </Typography>
            <Typography variant="body2" paragraph>
              RedMonsterSC is a Star Citizen content creator on YouTube. His excellent spreadsheets, cheat sheets and
              videos have been a huge help to me and many others.
            </Typography>
          </Paper>

          <Paper elevation={5} sx={styles.innerPaper}>
            <Typography variant="h5">UEMC Miners, Board and Foremen</Typography>
            <Typography variant="body2" paragraph>
              A big thanks to the community (Rockseeker and Synack in particular) at the{' '}
              <Link href="https://robertsspaceindustries.com/orgs/uemc" target="_blank">
                United Earth Mining Corporation (UEMC)
              </Link>{' '}
              for their collective determination to crack the new meta for 3.19.
            </Typography>
          </Paper>

          <Paper elevation={5} sx={styles.innerPaper}>
            <Typography variant="h5">Regolith Discord Community</Typography>
            <Typography variant="body2" paragraph>
              Our discord community is pretty new but it is growing. I am so grateful for the support and feedback from
              the community. Thank you!
            </Typography>
            <Typography variant="body2" paragraph>
              <Link href="https://discord.gg/6TKSYHNJha" target="_blank">
                Join us today
              </Link>{' '}
              and help us make Regolith even better!
            </Typography>
          </Paper>
        </Box>
      )}

      <Box
        sx={{
          border: '1px solid #666',
          backgroundColor: '#333',
          padding: 1,
          my: 2,
          fontSize: '0.8rem',
          textAlign: 'center',
          fontFamily: fontFamilies.robotoMono,
        }}
      >
        <AppVersion />
        <SCVersion />
      </Box>
      <Typography variant="caption" paragraph sx={{ p: 1, m: 1 }}>
        Regolith Co. is a Star Citizen fansite, not affiliated with the Cloud Imperium group of companies in any way.
        All content on this site not authored by its host or users is property of their respective owners. Star
        Citizen®, Roberts Space Industries®, and Cloud Imperium® are registered trademarks of Cloud Imperium Rights LLC.
      </Typography>
    </PageWrapper>
  )
}
