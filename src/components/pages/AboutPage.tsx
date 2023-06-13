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
import { Celebration, Coffee, HelpCenter, Info, QuestionAnswer, Twitter } from '@mui/icons-material'
import { DiscordIcon } from '../../icons/Discord'
import { AppVersion } from '../fields/AppVersion'
import { SCVersion } from '../fields/SCVersion'
import { fontFamilies } from '../../theme'
import { useNavigate, useParams } from 'react-router-dom'

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  innerPaper: {
    p: 3,
    mb: 4,
  },
})

export const AboutPageContainer: React.FC = () => {
  const navigate = useNavigate()
  const { tab } = useParams()

  return <AboutPage navigate={navigate} tab={tab as string} />
}

export interface AboutPageProps {
  tab: string
  navigate?: (path: string) => void
}

const TabIndex = {
  General: 'general',
  HelpUs: 'support-us',
  GetHelp: 'get-help',
  FAQ: 'faq',
  Thanks: 'acknowledgements',
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate, tab }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)

  const finalTab = typeof tab === 'undefined' ? TabIndex.General : tab
  let finalTitle = 'About Regolith Co.'
  switch (finalTab) {
    case TabIndex.FAQ:
      finalTitle = 'Frequently Asked Questions'
      break
    case TabIndex.HelpUs:
      finalTitle = 'Support Us'
      break
    case TabIndex.GetHelp:
      finalTitle = 'Get Help'
      break
    case TabIndex.Thanks:
      finalTitle = 'Acknowledgements'
      break
    default:
      break
  }

  return (
    <PageWrapper title={finalTitle} maxWidth="sm" sx={{ marginLeft: { lg: '7%' } }}>
      <Typography variant="body2" component="div" gutterBottom>
        <em>"Don't mine alone"</em>
      </Typography>
      <Tabs
        value={finalTab}
        aria-label="basic tabs example"
        sx={{ mb: 3 }}
        onChange={(event, newValue) => {
          navigate && navigate(`/about/${newValue}`)
        }}
      >
        <Tab label="General" icon={<Info />} value={TabIndex.General} />
        <Tab label="FAQ" icon={<QuestionAnswer />} value={TabIndex.FAQ} />
        <Tab label="Help Us" icon={<Coffee />} value={TabIndex.HelpUs} />
        <Tab label="Get Help" icon={<HelpCenter />} value={TabIndex.GetHelp} />
        <Tab label="Thanks" icon={<Celebration />} value={TabIndex.Thanks} />
      </Tabs>
      {finalTab === TabIndex.General && (
        <Box sx={{ mb: 3 }}>
          <Typography>
            Regolith Co. is a fansite dedicated to helping Star Citizen players mine, organize, share, and scout
            together.
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
      {/* FAQ TAB =================================== */}
      {finalTab === TabIndex.FAQ && (
        <Box sx={{ mb: 3 }}>
          <Paper elevation={5} sx={styles.innerPaper}>
            <Typography variant="h5" gutterBottom>
              What is this? Where did it come from?
            </Typography>
            <Typography gutterBottom>
              This tool was created in response to the need for better organization and tracking of mining jobs within
              the{' '}
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
              , but quickly grew beyond its container. I had always had a clear idea of what I wanted it to be, but I
              was hesitant to take on the additional responsibility of maintaining a website. However, I eventually made
              the decision to go ahead and build it. I hope you find it helpful.
            </Typography>
          </Paper>
          <Paper elevation={5} sx={styles.innerPaper}>
            <Typography variant="h5" gutterBottom>
              How do I report a bug or ask for a feature?
            </Typography>
            <Typography gutterBottom>
              If you're a discord user that's probably the best place. It really helps me if you can take a screenshot
              of the problem and also{' '}
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
              3.19 is here and we're adapting! Lots of changes for sure and some of them (like no more prices in the
              client files) have been a bit painful.
            </Typography>
            <Typography gutterBottom>
              Also I've found a good migration scheme so folks shouldn't lose their old 3.18 sessions and work orders.
            </Typography>
          </Paper>
          <Paper elevation={5} sx={styles.innerPaper}>
            <Typography variant="h5" gutterBottom>
              Will this tool always be free?
            </Typography>
            <Typography paragraph>
              First off, this is not about profit. It is a passion project that I created for myself, my friends and my
              ORG (
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
              Feel free to use the site as much as you'd like totally free. If you'd like to contribute towards server
              costs or buy me a coffee on <Link href="https://ko-fi.com/regolithco">ko-fi</Link> or{' '}
              <Link href="https://patreon.com/user?u=64746907">Patreon</Link> as a gesture of appreciation and to help
              cover server costs, that would be greatly appreciated. Beyond that, I have no plans to monetize the site
              through advertising or any other methods.
            </Typography>
          </Paper>
          <Paper elevation={5} sx={styles.innerPaper}>
            <Typography variant="h5" gutterBottom>
              "Will there be data wipes?"
            </Typography>
            <Typography paragraph>
              <strong>Yes!</strong> Star Citizen wipes their database when they patch and so will Regolith Co. If that's
              a problem for you then be sure to regularly download your sessions to either a CSV or JSON files.
            </Typography>
            <Typography paragraph>
              Why? It's just easier than migrating all the numbers in the database to their new values. Or trying to
              support multiple versions of Star Citizen's mercurial alpha nature.
            </Typography>
          </Paper>
          <Paper elevation={5} sx={styles.innerPaper}>
            <Typography variant="h5" gutterBottom>
              "What about privacy / security?"
            </Typography>
            <Typography paragraph>
              We don't collect any identifying data beyond your Star Citizen username (optional) and your discord or
              google id to enable login. Any other information in the site is only what you choose to add.
            </Typography>
            <Typography paragraph>
              The data you enter into this tool will be used to calculate stats and interesting metrics but we will
              never single-out or expose individual data about any user without their express consent.
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
      )}
      {/* HELP US TAB ============================= */}
      {finalTab === TabIndex.HelpUs && (
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
      {finalTab === TabIndex.GetHelp && (
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
      {finalTab === TabIndex.Thanks && (
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
              A big thanks to the{' '}
              <Link href="https://robertsspaceindustries.com/orgs/uemc" target="_blank">
                United Earth Mining Corporation (UEMC)
              </Link>{' '}
              org and in particular to <strong style={{ color: theme.palette.secondary.dark }}>Ents</strong>,{' '}
              <strong style={{ color: theme.palette.secondary.dark }}>Rockseeker</strong> and{' '}
              <strong style={{ color: theme.palette.secondary.dark }}>Synack</strong> for their help, support,
              encouragement and collective determination to crack the new meta for 3.19.
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
