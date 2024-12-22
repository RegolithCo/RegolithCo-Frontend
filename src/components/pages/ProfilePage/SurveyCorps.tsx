import * as React from 'react'
import { UserProfile, UserProfileInput, DestructuredSettings, validateSCName } from '@regolithco/common'

import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { DiscordIcon } from '../../../icons'
import { fontFamilies } from '../../../theme'
import { Check, MeetingRoom, ThumbUp } from '@mui/icons-material'

export interface SurveyCorpsProps {
  userProfile?: UserProfile
  navigate?: (path: string) => void
  updateUserProfile: (userProfile: UserProfileInput, settings?: DestructuredSettings) => void
}

export const SurveyCorps: React.FC<SurveyCorpsProps> = ({ userProfile, navigate, updateUserProfile }) => {
  const theme = useTheme()
  const [newLeaderboardName, setNewLeaderboardName] = React.useState<string>(userProfile?.surveyorName || '')
  const isBanned = userProfile?.isSurveyorBanned
  const isEnlisted = userProfile?.isSurveyor && !isBanned
  const nameIsValid = newLeaderboardName.length === 0 || validateSCName(newLeaderboardName)

  React.useEffect(() => {
    setNewLeaderboardName(userProfile?.surveyorName || '')
  }, [userProfile])

  return (
    <Box>
      <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 2 }}>
        <Avatar
          src="/images/icons/SurveyorLogo128.png"
          sx={{
            width: theme.spacing(7),
            height: theme.spacing(7),
          }}
        />
        <Typography
          component="div"
          variant="h5"
          sx={{
            fontFamily: fontFamilies.robotoMono,
            fontWeight: 'bold',
            color: theme.palette.primary.main,
          }}
        >
          Regolith Survey Corps
        </Typography>
      </Stack>
      {isBanned && <SurveyCorpsBanned />}
      {!isBanned && !isEnlisted && <SurveyCorpsEnlist updateUserProfile={updateUserProfile} />}
      {!isBanned && isEnlisted && (
        <Box>
          <Typography paragraph variant="body2">
            You are currently enlisted with the Regolith Survey Corps. Thank you for your service!
          </Typography>
          <Alert severity="info" sx={{ my: 2 }}>
            <AlertTitle>Leaderboard Name</AlertTitle>
            <Typography paragraph variant="body2">
              This is the name that will appear on the leaderboard. It can be the same as your username or different if
              you don't want to be identified. You can also leave it blank and it will show as Anonymous.
            </Typography>
            <Typography paragraph variant="body2" color="error">
              <strong>Warning:</strong> If you choose a name that crosses a line into offensive and/or abusive you will
              be banned from the leaderboard. Please be cool about this.
            </Typography>
          </Alert>
          <TextField
            id="leaderboardName"
            label="Leaderboard Name"
            error={!nameIsValid}
            placeholder="Anonymous"
            helperText={!nameIsValid ? 'Invalid leaderboard name' : ''}
            fullWidth
            value={newLeaderboardName}
            // center the text and make it huge
            sx={{
              '& input': {
                fontFamily: fontFamilies.robotoMono,
                color: theme.palette.primary.main,
                textAlign: 'center',
                fontSize: 40,
              },
            }}
            onChange={(e) => {
              setNewLeaderboardName(e.target.value.trim())
            }}
            // put a button in the end adornment
            InputProps={{
              endAdornment: (
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<Check />}
                  disabled={!nameIsValid || newLeaderboardName === userProfile?.surveyorName}
                  onClick={() => {
                    updateUserProfile({ surveyorName: newLeaderboardName })
                  }}
                >
                  Change
                </Button>
              ),
            }}
          />

          <Divider sx={{ my: 2 }} />
          <Typography paragraph variant="body2">
            If you no longer wish to be a part of the Survey Corps you can de-enlist here:
          </Typography>
          <Button
            variant="contained"
            color="error"
            fullWidth
            size="large"
            startIcon={<MeetingRoom />}
            onClick={() => {
              updateUserProfile({ isSurveyor: false })
            }}
          >
            Leave the Survey Corps
          </Button>
        </Box>
      )}
    </Box>
  )
}

export const SurveyCorpsBanned: React.FC = () => {
  const theme = useTheme()
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      <AlertTitle>
        <strong>You have been banned!</strong>
      </AlertTitle>
      <Typography paragraph variant="body2">
        You have been banned from being a prospector on Regolith. This means your scouting data will not be considered
        in the global stats and your name will not appear on the leaderboard. You are free to continue using the rest of
        Regolith as usual.
      </Typography>
      <Typography paragraph variant="subtitle1">
        <em>"Why did this Happen?"</em>
      </Typography>
      <Typography paragraph variant="body2">
        We use a combination of algorithms and human moderators to detect and prevent insertion of bad/erroneous data
        into the system. If your scouting submissions deviated too far from what is considered to be reasonable it is
        flagged.
      </Typography>
      <Typography paragraph variant="body2">
        This can also happen if you choose a leaderboard name that is abusive, offensive or inappropriate.
      </Typography>
      <Typography paragraph variant="body2">
        <strong>Mistakes DO happen</strong>. If you believe this is an error please contact us on Discord and we're
        usually pretty reasonable about it.
      </Typography>
      <Button
        startIcon={<DiscordIcon />}
        variant="contained"
        color="primary"
        fullWidth
        href="https://discord.gg/6TKSYHNJha"
        target="_blank"
      >
        Appeal on Discord
      </Button>
    </Alert>
  )
}

export const SurveyCorpsEnlist: React.FC<SurveyCorpsProps> = ({ userProfile, navigate, updateUserProfile }) => {
  const theme = useTheme()
  const [consentBoxChecked, setConsentBoxChecked] = React.useState(false)

  return (
    <Box>
      <Typography paragraph variant="body2">
        When you enlist with the Regolith Survey Corps your Scouting data will be combined with others to generate the
        <Link href="http://google.com">location and composition charts</Link>. Just by scouting rocks, gems and wrecks
        normally you will help discover the best places to mine and salvage in the 'verse'.
      </Typography>
      <Typography paragraph variant="subtitle1" color="primary" fontStyle="italic">
        Q: "How does this work?"
      </Typography>
      <Typography paragraph variant="body2">
        When you scout a rock cluster, ROC Gem cluster or salvage site in your normal sessions you will have the option
        to contribute this data (on by default) to the global stats pool.
      </Typography>
      <Typography paragraph variant="subtitle1" color="primary" fontStyle="italic">
        Q: "Why should I do this?"
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
        Q: "What happens if I leave the Corps later?"
      </Typography>
      <Typography paragraph variant="body2" component="div">
        If you leave the Corps any scouting finds from that point onward will no longer be included in the global stats.
        Your existing data will still be included though. You can re-enlist at any time.
      </Typography>
      <Typography paragraph variant="overline" color="primary">
        Terms and Conditions
      </Typography>
      <Typography paragraph variant="body2">
        By enlisting with the Regolith Survey Corps you agree to the following. Failure to comply with these terms may
        result in a ban from the leaderboard and/or the survey corps.
      </Typography>
      <Typography paragraph variant="body2" component="div">
        <ul>
          <li>
            You will not submit scouting data that is knowingly false, misleading, or otherwise intended to harm the
            community (we have algorithms and moderators that can find bad data and ban you).
          </li>
          <li>
            You will not use any form of automation or botting to generate scouting data. This includes but is not
            limited to using macros, scripts, or any other form of automation.
          </li>
          <li>
            You will not use any form of abusive, offensive, or inappropriate language or names in the leaderboard.
          </li>
          <li>
            You understand that the Regolith Survey Corps is a community-driven project and that the data you submit
            will be shared with the community.
          </li>
        </ul>
      </Typography>
      <Divider />
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={consentBoxChecked}
              onChange={(e, checked) => {
                setConsentBoxChecked(checked)
              }}
              name="checkedA"
            />
          }
          label={
            <Typography variant="body2" color="secondary">
              By checking this box you agree to the terms and conditions of the Regolith Survey Corps.
            </Typography>
          }
        />
      </FormGroup>
      <Button
        size="large"
        sx={{ mt: 2 }}
        variant="contained"
        color="secondary"
        onClick={() => {
          updateUserProfile({ isSurveyor: true })
        }}
        disabled={!consentBoxChecked}
        fullWidth
        startIcon={<ThumbUp />}
      >
        I understand. Enlist Today!
      </Button>
    </Box>
  )
}
