import * as React from 'react'
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Link,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
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
import { Celebration, Coffee, HelpCenter, Info, NewReleases, QuestionAnswer, Share, Twitter } from '@mui/icons-material'
import { DiscordIcon } from '../../icons/Discord'
import { AppVersion } from '../fields/AppVersion'
import { SCVersion } from '../fields/SCVersion'
import { fontFamilies } from '../../theme'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import log from 'loglevel'

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
  ReleaseNotes: 'release-notes',
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate, tab }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const [changelist, setChangelist] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Loop over all the possible keys of StatsObjectSummary and fetch them
    axios
      .get(`/CHANGELIST.md`)
      .then((response) => {
        setChangelist(response.data)
      })
      .catch((error) => {
        //If there is an error, log it. DO NOT FAIL
        log.error(error)
        setChangelist('CHANGELIST NOT FOUND')
      })
  }, [])

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
    case TabIndex.ReleaseNotes:
      finalTitle = 'Release Notes'
      break
    default:
      break
  }

  return (
    <PageWrapper title={finalTitle} maxWidth="md" sx={{ marginLeft: { lg: '7%' } }}>
      <Tabs
        value={finalTab}
        aria-label="basic tabs example"
        sx={{
          mb: 3,
          // Center the flex items
          '& .MuiTabs-flexContainer': {
            justifyContent: 'center',
          },
        }}
        onChange={(event, newValue) => {
          navigate && navigate(`/about/${newValue}`)
        }}
      >
        <Tab label="General" icon={<Info />} value={TabIndex.General} />
        <Tab label="Thanks" icon={<Celebration />} value={TabIndex.Thanks} />
        <Tab label="FAQ" icon={<QuestionAnswer />} value={TabIndex.FAQ} />
        <Tab label="Get Help" icon={<HelpCenter />} value={TabIndex.GetHelp} />
        <Tab label="Support Us" icon={<Coffee />} value={TabIndex.HelpUs} />
        <Tab label="Release Notes" icon={<NewReleases />} value={TabIndex.ReleaseNotes} />
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
          <Card elevation={20} sx={{ p: 3, m: 4 }}>
            <CardHeader title="Regolith Co. Mission Statement" />
            <CardContent>
              <Typography paragraph variant={'body2'} color={'text.secondary'}>
                "Regolith Co. is dedicated to advancing the frontiers of space exploration by fostering collaboration,
                innovation, and resource sharing within the space mining industry. Our mission is to unite and empower
                space miners, enabling them to explore and utilize celestial bodies, while promoting sustainable
                practices and responsible stewardship of extraterrestrial resources. Together, we aim to unlock the vast
                potential of the cosmos for the betterment of humanity and the preservation of our precious bodily
                fluids."
              </Typography>
            </CardContent>
          </Card>
          <Card elevation={20} sx={{ p: 3, m: 4 }}>
            <CardHeader title="Disclaimer" />
            <CardContent>
              <Typography paragraph>
                Space mining is an inherently dangerous activity. Regolith Co. cannot be held responsible for any
                injuries, deaths, or other unfortunate incidents, (hilarious or otherwise) that may occur while using
                our services. These include, but are not limited to:
              </Typography>
              <Typography
                paragraph
                fontStyle={'italic'}
                sx={{
                  '& li': {
                    mb: 2,
                  },
                }}
              >
                <ol>
                  <li>
                    <strong style={{ color: theme.palette.secondary.dark }}>Death / Regeneriation Fees:</strong>{' '}
                    Regolith shall not be held responsible for any death or regeneration fees incurred while using our
                    services.
                  </li>
                  <li>
                    <strong style={{ color: theme.palette.secondary.dark }}>Ship malfunctions or pilot error:</strong>{' '}
                    The pilot of every ship is responsible for their own actions. Regolith cannot be held responsible
                    for any loss of life or property due to ship malfunctions or pilot error.
                  </li>
                  <li>
                    <strong style={{ color: theme.palette.secondary.dark }}>Alien Abductions</strong> Regolith cannot be
                    held accountable or responsible for extraterrestrial beings mistaking you a snack or science
                    experiment. Travel expenses, mind-flay restoration, and any intergalactic souvenirs will be at your
                    own expense.
                  </li>
                  <li>
                    <strong style={{ color: theme.palette.secondary.dark }}>Jumpgate Misdirection</strong>: Any loss of
                    wages/life due to misfiring jumpgates is the sole domain and responsibility of the spacers guild.
                    Furthermore any arbitration around spice tithing must be handled by the guild.
                  </li>
                  <li>
                    <strong style={{ color: theme.palette.secondary.dark }}>Gravity-related accidents:</strong> Gravity
                    is a harsh mistress. Plan appropriately.
                  </li>
                </ol>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
      {/* FAQ TAB =================================== */}
      {finalTab === TabIndex.FAQ && (
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
              "What is this site/app? Where did it come from?"
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
              the decision to go ahead and build it. Now here we are. I hope you find it helpful.
            </Typography>
          </Paper>
          <Paper elevation={5} sx={styles.innerPaper}>
            <Typography variant="h5" gutterBottom>
              "How do I report a bug or ask for a new feature?"
            </Typography>
            <Typography gutterBottom>
              If you're a discord user that's probably the best place. It really helps if you can take a screenshot of
              the problem and also{' '}
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
            <Typography gutterBottom paragraph>
              If you're not a discord user, you can also{' '}
              <Link href="https://twitter.com/RegolithCo" target="_blank">
                hit us up on twitter
              </Link>{' '}
              but we might respond more slowly because well... twitter.
            </Typography>
          </Paper>
          <Paper elevation={5} sx={styles.innerPaper}>
            <Typography variant="h5" gutterBottom>
              "Star citizen X.XX is going to change mining. Can Regolith adapt?"
            </Typography>
            <Typography gutterBottom>
              CIG is moving fast and Regolith will always try to keep up! There is currently no direct communication
              between CIG and third-party developers though so we might lag the official patches a bit while we try to
              get our data and equations working with the new meta.
            </Typography>
            <Typography paragraph>(BTW, if you're reading this CIG then we'd love to hear from you!)</Typography>
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
                While it is designed to be low maintenance and require minimal resources, that may change if usage
                spikes and maintenance and server costs rise.
              </strong>{' '}
              Sort of a nice problem to have, but I'll cross that bridge when/if we get there.
            </Typography>
            <Typography paragraph>
              Feel free to use the site as much as you'd like totally free. If you'd like to contribute towards server
              costs or buy me a coffee on <Link href="https://ko-fi.com/regolithco">ko-fi</Link> or{' '}
              <Link href="https://patreon.com/user?u=64746907">Patreon</Link> that would be greatly appreciated. Beyond
              that, I have no plans to monetize the site through advertising or any other methods.
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
              Why do we do this? It's just easier than migrating all the numbers in the database to their new values. Or
              trying to support multiple versions of Star Citizen's mercurial alpha nature.
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
              <strong>The passwords</strong> you used (Google or Discord) to log in are not stored in any way by
              Regolith.
            </Typography>
            <Typography paragraph>
              <strong>The data</strong> you enter into this tool will be used to calculate stats and interesting metrics
              but we will never single-out or expose individual data about any user without their express consent.
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
              Everyone can use this site for free, hopefully forever. However,{' '}
              <strong style={{ color: theme.palette.secondary.dark }}>server costs are real</strong>. If you use
              Regolith and are seeking a way to help keep the lights on and satiate the unquenchable hunger of Bezos'
              infinite AWS maw, your support would be amazing!
            </Typography>
            <Typography paragraph variant="subtitle1">
              Any amount at all is a big help!
            </Typography>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
              sx={{ width: '100%', mb: 3 }}
            >
              <Button
                variant="contained"
                size="large"
                href="https://ko-fi.com/regolithco"
                target="_blank"
                fullWidth
                sx={{ fontSize: '2rem', p: 1 }}
                startIcon={
                  <Avatar
                    sx={{ height: 100, width: 100 }}
                    src={`${process.env.PUBLIC_URL}/images/icons/kofi_s_logo_nolabel.webp`}
                  />
                }
              >
                Ko-Fi
              </Button>
              <Button
                variant="contained"
                size="large"
                href="https://patreon.com/user?u=64746907"
                target="_blank"
                fullWidth
                color="secondary"
                sx={{ fontSize: '2rem', p: 1 }}
                startIcon={<Coffee sx={{ height: 64, width: 64 }} />}
              >
                Patreon
              </Button>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h5" paragraph sx={{ borderBottom: '1px solid', mt: 3 }}>
              Spread the word
            </Typography>
            <Typography paragraph>
              Regolith is a community-driven app and we don't do a lot of outreach. If you like the site, tell your
              friends, tell your family. Hell, tell your cat Fluffles!
            </Typography>
            <Typography paragraph>
              If you feel really inspired, share and brag about your mining sessions on social media. Regolith has share
              buttons (<Share />) that let you export parts of the site to images you can paste into your favourite
              platforms. The shred images all have the our site URL at the bottom.
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h5" paragraph sx={{ borderBottom: '1px solid', mt: 3 }}>
              Star Citizen Referral Code
            </Typography>
            <Typography paragraph>
              If you're looking for a way to support the site and you don't already have a Star Citizen account, you can
              use our referral code when you create your account. You'll get 5000 aUEC (spacebucks) and we'll get a
              referral point.
            </Typography>
            <Box
              id="referral-code"
              sx={{
                border: `5px solid ${theme.palette.text.secondary}`,
                backgroundColor: '#222',
                padding: 1,
                fontSize: '2rem',
                textAlign: 'center',
                fontWeight: 'bold',
                fontFamily: fontFamilies.robotoMono,
              }}
              // copy the value to the clipboard when the user clicks
              onClick={() => {
                // Select the contents of the box
                const range = document.createRange()
                range.selectNodeContents(document.getElementById('referral-code') as Node)
                const selection = window.getSelection()
                selection?.removeAllRanges()
                selection?.addRange(range)

                // Copy the contents to the clipboard
                navigator.clipboard.writeText('STAR-DM37-GVY5')
              }}
            >
              STAR-DM37-GVY5
            </Box>
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
          <Paper elevation={5} sx={styles.innerPaper}>
            <Typography variant="body2">
              Regolith is a community-driven app and would not exist without a lot of support and hard work from people.
              We should mention a few by name:
            </Typography>
          </Paper>
          <Paper elevation={10} sx={styles.innerPaper}>
            <Typography variant="h5" paragraph>
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

          <Paper elevation={10} sx={styles.innerPaper}>
            <Typography variant="h5" paragraph>
              <Link href="https://redmonstergaming.com/" target="_blank">
                RedMonsterSC
              </Link>
            </Typography>
            <Typography variant="body2" paragraph>
              RedMonsterSC is a Star Citizen content creator on{' '}
              <Link href="https://www.youtube.com/@RedMonsterSC" target="_blank">
                YouTube
              </Link>
              . His excellent spreadsheets, cheat sheets and videos have been a huge help to many, including us here at
              Regolith. In particular his spreadsheet for the loadout meta for 3.20 and beyond was instrumental in the
              development of Regolith's own loadout tool.
            </Typography>
            <Typography variant="body2" paragraph>
              RedMonsterSC also runs the Red Legion Org. for Star Citizen miners who are interested in the industrial
              profession.
            </Typography>

            <List>
              <ListItemButton href="https://redmonstergaming.com/" target={'_blank'}>
                <ListItemAvatar sx={{ mr: 2 }}>
                  <Avatar
                    src={`https://yt3.googleusercontent.com/xzMVBRlRcIDim80H9SfWAVEngKt77TudSeHqPAvnzNEddHrM8IqF7yqNqULywd4PR1KACAmz=s176-c-k-c0x00ffffff-no-rj`}
                    sx={{ width: 56, height: 56 }}
                  />
                </ListItemAvatar>
                <ListItemText primary="Red Monster Gaming" secondary="Cheat sheets, spreadsheets, videos etc." />
              </ListItemButton>
              <ListItemButton href="https://discord.com/invite/RedLegion" target={'_blank'}>
                <ListItemAvatar sx={{ mr: 2 }}>
                  <Avatar
                    src={`https://robertsspaceindustries.com/media/vthzvi2wp0i0xr/logo/REDLEGN-Logo.png`}
                    sx={{ width: 56, height: 56 }}
                  />
                </ListItemAvatar>
                <ListItemText primary="Red Legion Org." secondary="Star Citizen Mining org on Discord" />
              </ListItemButton>
            </List>
          </Paper>

          <Paper elevation={10} sx={styles.innerPaper}>
            <Typography variant="h5" paragraph>
              UEMC Miners, Board and Foremen
            </Typography>
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
            <List>
              <ListItemButton href="https://discord.gg/nfVVk3N" target={'_blank'}>
                <ListItemAvatar sx={{ mr: 2 }}>
                  <Avatar
                    src={`https://robertsspaceindustries.com/media/qkzikaxpxbqvbr/logo/UEMC-Logo.png`}
                    sx={{ width: 56, height: 56 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="United Earth Mining Corporation (UEMC)"
                  secondary="Star Citizen Mining org on Discord"
                />
              </ListItemButton>
            </List>
          </Paper>

          <Paper elevation={10} sx={styles.innerPaper}>
            <Typography variant="h5" paragraph>
              Regolith Discord Community
            </Typography>
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
      {finalTab === TabIndex.ReleaseNotes && (
        <Box
          sx={{
            mb: 3,
            '& h2': {
              fontSize: '1.5rem',
              mt: 0,
              color: theme.palette.secondary.dark,
            },
            '& h3': {
              fontSize: '0.9rem',
              fontFamilies: fontFamilies.robotoMono,
              color: theme.palette.primary.light,
              textAlign: 'right',
              margin: 0,
            },
          }}
        >
          <Alert severity="info">
            <AlertTitle>Also Available on Discord in the "Updates" channel</AlertTitle>
          </Alert>
          {!changelist ? (
            <CircularProgress />
          ) : (
            changelist
              // Split on anything greater than 3 dashes
              .split(/-{3,}/)
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
              .map((change, index) => (
                <Paper elevation={5} sx={styles.innerPaper} key={`changelist-${index}`}>
                  <ReactMarkdown>{change}</ReactMarkdown>
                </Paper>
              ))
          )}
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
