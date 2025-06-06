import * as React from 'react'
import { UserProfile, UserProfileInput, DestructuredSettings, validateSCName, UserStateEnum } from '@regolithco/common'

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { DiscordIcon, SurveyCorpsIcon } from '../../../icons'
import { fontFamilies } from '../../../theme'
import { MeetingRoom, Save, ThumbUp } from '@mui/icons-material'
import { ConfirmModal } from '../../modals/ConfirmModal'
import { DiscordGuildChooser } from '../../fields/DiscordGuildChooser'

export interface SurveyCorpsProps {
  userProfile?: UserProfile
  navigate?: (path: string) => void
  loading?: boolean
  mutating?: boolean
  updateUserProfile: (userProfile: UserProfileInput, settings?: DestructuredSettings) => void
}

export const SurveyCorps: React.FC<SurveyCorpsProps> = ({
  userProfile,
  navigate,
  updateUserProfile,
  loading,
  mutating,
}) => {
  const theme = useTheme()
  const [confirmLeave, setConfirmLeave] = React.useState(false)
  const [newLeaderboardName, setNewLeaderboardName] = React.useState<string>(userProfile?.surveyorName || '')
  const [newLeaderboardGuild, setNewLeaderboardGuild] = React.useState<string | undefined>(
    userProfile?.surveyorGuild?.id
  )
  const isBanned = userProfile?.isSurveyorBanned
  const isEnlisted = userProfile?.isSurveyor && !isBanned
  const nameIsValid = newLeaderboardName.length === 0 || validateSCName(newLeaderboardName)

  React.useEffect(() => {
    setNewLeaderboardName(userProfile?.surveyorName || '')
  }, [userProfile])

  return (
    <Box>
      <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 2 }}>
        <SurveyCorpsIcon
          sx={{
            width: 48,
            height: 48,
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
      {!isBanned && !isEnlisted && (
        <SurveyCorpsEnlist updateUserProfile={updateUserProfile} userProfile={userProfile} navigate={navigate} />
      )}
      {!isBanned && isEnlisted && (
        <Box>
          <Typography gutterBottom variant="body2">
            You are currently enlisted with the Regolith Survey Corps. Thank you for your service!
          </Typography>
          <Alert severity="info" sx={{ my: 2 }}>
            <AlertTitle>Leaderboard Name</AlertTitle>
            <Typography gutterBottom variant="body2">
              This is the name that will appear on the leaderboard. It can be the same as your username or different if
              you don't want to be identified. You can also leave it blank and it will show as Anonymous.
            </Typography>
            <Typography gutterBottom variant="body2" color="error">
              <strong>Warning:</strong> If you choose a name that crosses a line into offensive and/or abusive you will
              be banned from the leaderboard. Please be cool about this.
            </Typography>
          </Alert>
          <TextField
            id="leaderboardName"
            label="Choose a leaderboard name:"
            error={!nameIsValid}
            placeholder="Anonymous"
            helperText={!nameIsValid ? 'Invalid leaderboard name' : ''}
            fullWidth
            value={newLeaderboardName}
            // center the text and make it huge
            sx={{
              background: 'black',

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
                  color="primary"
                  startIcon={<Save />}
                  disabled={mutating || loading || !nameIsValid || newLeaderboardName === userProfile?.surveyorName}
                  onClick={(e) => {
                    e.preventDefault()
                    updateUserProfile({ surveyorName: newLeaderboardName })
                  }}
                >
                  Update
                </Button>
              ),
            }}
          />
          <Alert severity="info" sx={{ my: 2 }}>
            <AlertTitle>Leaderboard Org / Guild Allegiance</AlertTitle>
            <Typography gutterBottom variant="body2">
              You can choose one Discord server to associate all your points with. If you change this all your points go
              with you.
            </Typography>
          </Alert>
          <Stack direction="row" spacing={2}>
            <DiscordGuildChooser
              discordGuildId={newLeaderboardGuild}
              onChange={(guild) => {
                setNewLeaderboardGuild(guild?.id)
              }}
              allowNone={true}
              disabled={mutating || loading || !userProfile?.discordGuilds || userProfile?.discordGuilds.length === 0}
              options={userProfile?.discordGuilds || []}
              selectProps={{
                size: 'medium',
                variant: 'outlined',
                sx: {
                  '& .MuiSelect-root': {
                    fontFamily: fontFamilies.robotoMono,
                    fontSize: 30,
                  },
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={mutating || loading || newLeaderboardGuild === userProfile?.surveyorGuild?.id}
              startIcon={<Save />}
              onClick={(e) => {
                e.preventDefault()
                updateUserProfile({ surveyorGuildId: newLeaderboardGuild })
              }}
            >
              Update
            </Button>
          </Stack>

          <Divider sx={{ my: 2 }} />
          <Typography gutterBottom variant="body2">
            If you no longer wish to be a part of the Survey Corps you can de-enlist here:
          </Typography>
          <Button
            variant="contained"
            color="error"
            fullWidth
            size="large"
            startIcon={<MeetingRoom />}
            onClick={() => {
              setConfirmLeave(true)
            }}
          >
            Leave the Survey Corps
          </Button>
          <ConfirmModal
            open={confirmLeave}
            confirmIcon={<MeetingRoom />}
            confirmBtnText="Leave the Corps"
            title="Leave the Survey Corps?"
            message={
              <Stack direction="column" spacing={2}>
                <Typography gutterBottom variant="body2">
                  Are you sure you want to leave the Survey Corps? You will lose your leaderboard status and your data
                  will no longer be considered in the global stats.
                </Typography>
                <Typography gutterBottom variant="body2">
                  Any data you have already submitted will remain in the system but you are free to remove individual
                  clusters and scans from consideration if you wish.
                </Typography>
                <Typography gutterBottom variant="body2">
                  You can re-enlist at any time if you change your mind.
                </Typography>
              </Stack>
            }
            onClose={() => setConfirmLeave(false)}
            onConfirm={() => {
              updateUserProfile({ isSurveyor: false })
              setConfirmLeave(false)
            }}
          />
        </Box>
      )}
    </Box>
  )
}

export const SurveyCorpsBanned: React.FC = () => {
  // const theme = useTheme()
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      <AlertTitle>
        <strong>You have been banned!</strong>
      </AlertTitle>
      <Typography gutterBottom variant="body2">
        You have been banned from being a prospector on Regolith. This means your scouting data will not be considered
        in the global stats and your name will not appear on the leaderboard. You are free to continue using the rest of
        Regolith as usual.
      </Typography>
      <Typography gutterBottom variant="subtitle1">
        <em>"Why did this Happen?"</em>
      </Typography>
      <Typography gutterBottom variant="body2">
        We use a combination of algorithms and human moderators to detect and prevent insertion of bad/erroneous data
        into the system. If your scouting submissions deviated too far from what is considered to be reasonable it is
        flagged.
      </Typography>
      <Typography gutterBottom variant="body2">
        This can also happen if you choose a leaderboard name that is abusive, offensive or inappropriate.
      </Typography>
      <Typography gutterBottom variant="body2">
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
  // const theme = useTheme()
  const [consentBoxChecked, setConsentBoxChecked] = React.useState(false)
  const isElligible = Boolean(userProfile?.state === UserStateEnum.Verified && !userProfile?.isSurveyorBanned)

  return (
    <Box>
      <Typography gutterBottom variant="body2">
        Not sure if this is for you? You can read more about the Survey Corps <Link href="/survey/about">here</Link>.
      </Typography>

      <Typography gutterBottom variant="overline" color="primary">
        Terms and Conditions
      </Typography>
      <Typography gutterBottom variant="body2">
        By enlisting with the Regolith Survey Corps you agree to the following. Failure to comply with these terms may
        result in a ban from the leaderboard and/or the survey corps.
      </Typography>
      <Typography gutterBottom variant="body2" component="div">
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
      {userProfile?.state !== UserStateEnum.Verified && (
        <Alert severity="error" sx={{ my: 2 }}>
          Your user account is not verified. Only verified users can be surveyors. Please complete the verification
          process on the "Profile" tab first.
        </Alert>
      )}
      {isElligible && (
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                disabled={!isElligible}
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
      )}

      <Button
        size="large"
        sx={{ mt: 2 }}
        variant="contained"
        color="secondary"
        onClick={() => {
          updateUserProfile({ isSurveyor: true })
        }}
        disabled={!consentBoxChecked || !isElligible}
        fullWidth
        startIcon={<ThumbUp />}
      >
        I understand. Enlist Today!
      </Button>
    </Box>
  )
}
