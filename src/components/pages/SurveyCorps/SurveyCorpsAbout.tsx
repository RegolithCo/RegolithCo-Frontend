import * as React from 'react'

import { Alert, Box, Button, Container, Link, Typography, useTheme } from '@mui/material'
import { useUserProfile } from '../../../hooks/useUserProfile'
import { AppContext } from '../../../context/app.context'
import { LoginContext } from '../../../hooks/useOAuth2'
import { UserProfile } from '@regolithco/common'
import { SurveyCorpsIcon } from '../../../icons'

export interface SurveyCorpsAboutProps {
  // Props here
  userProfile?: UserProfile
}

export const SurveyCorpsAbout: React.FC<SurveyCorpsAboutProps> = ({ userProfile }) => {
  const theme = useTheme()
  const { hideNames, setHideNames } = React.useContext(AppContext)
  const { maintenanceMode, isAuthenticated, isInitialized } = React.useContext(LoginContext)
  const usrQries = useUserProfile()

  return (
    <Container
      maxWidth="md"
      sx={{
        pt: 4,
      }}
    >
      <Typography variant="h5" paragraph>
        About the Survey Corps:
      </Typography>
      <Typography variant="body2" paragraph>
        The Regoltih Survey Corps is a group of elite users who venture out into the black to report on the state of
        industrial resources in the verse.
      </Typography>

      <Typography variant="body2" paragraph>
        When you enlist with the Regolith Survey Corps your Scouting data will be combined with others to generate the{' '}
        <Link href="http://google.com">location and composition charts</Link>. Just by scouting rocks, gems and wrecks
        normally you will help discover the best places to mine and salvage in the 'verse'.
      </Typography>
      {usrQries.userProfile?.isSurveyor && (
        <Alert severity="success" sx={{ m: 4 }}>
          <Typography variant="body2" paragraph>
            You are a member of the Survey Corps. Thank you for your service. Your bravery and dedication are an example
            to us all.
          </Typography>
        </Alert>
      )}
      {usrQries.userProfile && !usrQries.userProfile?.isSurveyor && (
        <Alert severity="info" sx={{ m: 4 }}>
          <Typography variant="body2" paragraph>
            You are not a member of the Survey Corps. If you are interested in joining, please click the button below.
          </Typography>
          <Button size="large" variant="contained" startIcon={<SurveyCorpsIcon />}>
            Enlist today
          </Button>
        </Alert>
      )}
      {!isAuthenticated && <Typography variant="caption">Login</Typography>}
      <Typography variant="h5" paragraph>
        FAQ:
      </Typography>

      <Typography paragraph variant="subtitle1" color="primary" fontStyle="italic">
        Q: "How does this work?"
      </Typography>
      <Typography paragraph variant="body2">
        When you scout a rock cluster, ROC Gem cluster or salvage site in your normal sessions you will have the option
        to contribute this data (on by default) to the global stats pool.
      </Typography>
      <Typography paragraph variant="subtitle1" color="primary" fontStyle="italic">
        Q: "Why should I enlist?"
      </Typography>
      <Typography paragraph variant="body2" component="div">
        There are several reasons to do this:
        <ul>
          <li>It helps the community by providing more data to generate the charts.</li>
          <li>It helps you by providing more accurate data for your own use.</li>
          <li>For clout or just to see your score increase on the leaderboard.</li>
          <li>Periodically we may offer small incentives to those who contribute the most data.</li>
          <li>It's a lightweight form of exploration gameplay that Star Citizen so far is lacking.</li>
          <li>Maybe you like scanning and finding rocks more than you like mining them.</li>
        </ul>
      </Typography>
      <Typography paragraph variant="subtitle1" color="primary" fontStyle="italic">
        Q: "What happens if I leave the Corps?"
      </Typography>
      <Typography paragraph variant="body2" component="div">
        If you leave the Corps any scouting finds from that point onward will no longer be included in the global stats.
        Your existing data will still be included though. You can re-enlist at any time.
      </Typography>
      <Typography paragraph variant="subtitle1" color="primary" fontStyle="italic">
        Q: "What are the best practices for a Surveyor?"
      </Typography>
      <Typography
        paragraph
        variant="body2"
        component="div"
        sx={{
          '* strong': {
            color: theme.palette.info.main,
          },
        }}
      >
        <ul>
          <li>
            <strong>Survey every cluster you find, not just the valuable ones</strong>. We're trying to get a complete
            picture of the system and the probabiliy of finding valuable rocks. <em>Every scan counts equally!</em>
          </li>
          <li>
            <strong>Scan every rock in a cluster</strong>. Cluster size and composition is important.
          </li>
          <li>
            <strong>Survey in places with less data</strong>. There are point bonuses offered for systems where there is
            less data to incentivize this. Check the bonus chart for details of which gravity wells offer bonuses.
          </li>
          <li>
            <strong>Use OCR capture if possible</strong>. It makes scanning WAY less tedious and increases the accuracy
            of your scans. If the OCR doesn't pick up everything correctly you can aleays correct it after and it's
            still less time.
          </li>
        </ul>
      </Typography>
    </Container>
  )
}
