import * as React from 'react'
import {
  VerifiedUserLookup,
  UserProfile,
  UserStateEnum,
  UserProfileInput,
  DestructuredSettings,
  UserSuggest,
  // makeAvatar,
  UserPlanEnum,
} from '@regolithco/common'

import { PageWrapper } from '../../PageWrapper'
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  Stack,
  SxProps,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { ContentCopy, Cookie, Edit, Verified, Visibility, VisibilityOff } from '@mui/icons-material'
import { RemoveUserModal } from '../../modals/RemoveUserModal'
import { ChangeUsernameModal } from '../../modals/ChangeUsernameModal'
import { DeleteProfileModal } from '../../modals/DeleteProfileModal'
import { yellow } from '@mui/material/colors'
import { MentionedUserList } from '../../fields/MentionedUserList'
import { pick } from 'lodash'
import { fontFamilies } from '../../../theme'
import { SessionSettingsTab } from './../SessionPage/TabSettings'
import { VehicleChooser } from '../../fields/VehicleChooser'
import { Theme } from '@mui/system'
import { AppContext } from '../../../context/app.context'
import { UserAvatar } from '../../UserAvatar'
import { ConfirmModal } from '../../modals/ConfirmModal'
import config from '../../../config'
import { SurveyCorps } from './SurveyCorps'
import { wipeLocalLookups } from '../../../lib/utils'
import { useConsentCookie } from '../../../lib/analytics'
import { AnalyticsContext } from '../../Analytics'

export const ProfileTabsEnum = {
  PROFILE: 'profile',
  FRIENDS: 'profile/friends',
  SURVEY: 'profile/survey',
  SESSION_DEFAULTS: 'profile/session-settings',
  API: 'profile/api',
} as const
export type ProfileTabsEnum = ObjectValues<typeof ProfileTabsEnum>

type ObjectValues<T> = T[keyof T]
export const ProfileModals = {
  ChangeUsername: 'ChangeUsername',
  DeleteProfile: 'DeleteProfile',
  SessionSettings: 'SeessionSettings',
  ResetAPIKey: 'ResetAPIKey',
  RevokeAPI: 'RevokeAPI',
} as const
export type ProfileModals = ObjectValues<typeof ProfileModals>

export interface ProfilePageProps {
  userProfile?: UserProfile
  verifiedFriends: VerifiedUserLookup
  loading?: boolean
  mutating?: boolean
  activeTab: ProfileTabsEnum
  setActiveTab: (tab: ProfileTabsEnum) => void
  navigate?: (path: string) => void
  addFriend: (friendName: string) => void
  removeFriend: (friendName: string) => void
  resetDefaultSettings: () => void
  refreshAvatar: (remove?: boolean) => void
  updateUserProfile: (userProfile: UserProfileInput, settings?: DestructuredSettings) => void
  deleteProfile: (leaveData: boolean) => void
  upsertAPIKey: () => void
  deleteAPIKey: () => void
}

export const profileStylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  pageWrapper: {
    '&>.MuiPaper-root': {},
    [theme.breakpoints.up('md')]: {
      ml: '5%',
    },
  },
  container: {
    py: 3,
  },
  section: {},
  sectionTitle: {
    '&::before': {
      content: '""',
    },
    // fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
    fontSize: '1rem',
    mb: 2,
    lineHeight: 1.5,
    color: theme.palette.primary.main,
    textShadow: '0 0 1px #000',
    borderBottom: '2px solid',
  },
  sectionBody: {
    py: 1,
    pl: 2,
    pr: 1,
    mb: 2,
  },
})

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userProfile,
  loading,
  mutating,
  activeTab,
  setActiveTab,
  verifiedFriends,
  navigate,
  updateUserProfile,
  resetDefaultSettings,
  refreshAvatar,
  addFriend,
  deleteProfile,
  removeFriend,
  upsertAPIKey,
  deleteAPIKey,
}) => {
  const theme = useTheme()
  const styles = profileStylesThunk(theme)
  const mediumUp = useMediaQuery(theme.breakpoints.up('md'))
  const { consent, setConsent } = React.useContext(AnalyticsContext)

  const [modalOpen, setModalOpen] = React.useState<ProfileModals | null>(null)
  const { hideNames, getSafeName } = React.useContext(AppContext)
  const [newUserProfile, setNewUserProfile] = React.useState<UserProfileInput>({
    ...pick(userProfile, ['deliveryShipCode', 'sessionShipCode', 'scName', 'userSettings']),
    surveyorGuildId: userProfile?.surveyorGuild?.id,
  })
  const [friend2remove, setFriend2remove] = React.useState<string>()
  const [showAPIKey, setShowAPIKey] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (userProfile)
      setNewUserProfile(pick(userProfile, ['deliveryShipCode', 'sessionShipCode', 'scName', 'userSettings']))
  }, [userProfile])

  const friends: string[] = [...(userProfile?.friends || [])]
  // Alphabetically sort friends
  friends.sort((a, b) => a.localeCompare(b))
  // const myAvatar = makeAvatar(userProfile?.avatarUrl as string)

  const maxWidth = mediumUp && activeTab === ProfileTabsEnum.SESSION_DEFAULTS ? 'md' : 'md'

  if (loading || !userProfile)
    return (
      <PageWrapper title="User Profile" loading={loading} maxWidth={maxWidth} sx={styles.pageWrapper}>
        <Box sx={styles.container}>
          <Typography variant="h4">Loading...</Typography>
        </Box>
      </PageWrapper>
    )

  return (
    <PageWrapper title="User Profile" loading={loading} maxWidth={maxWidth} sx={styles.pageWrapper}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', flex: '0 0' }}>
        <Tabs
          variant="scrollable"
          value={activeTab}
          onChange={(_, newValue) => {
            setActiveTab(newValue)
          }}
          sx={styles.sessionTabs}
        >
          <Tab label="Profile" value={ProfileTabsEnum.PROFILE} />
          <Tab label="Survey Corps" value={ProfileTabsEnum.SURVEY} />
          <Tab label="Friends" value={ProfileTabsEnum.FRIENDS} />
          <Tab label="Session Defaults" value={ProfileTabsEnum.SESSION_DEFAULTS} />
          <Tab label="API Access" value={ProfileTabsEnum.API} />
        </Tabs>
      </Box>
      <Box sx={styles.container}>
        {/* Profile Tab */}
        {activeTab === ProfileTabsEnum.PROFILE && (
          <Container sx={{ px: 2 }} maxWidth="sm">
            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                User Handle
              </Typography>
              <Box sx={styles.sectionBody}>
                {/* USERNAME */}
                <Box
                  sx={{
                    display: 'flex',
                    color: theme.palette.getContrastText(yellow[600]),
                    background: yellow[600],
                    border: '4px solid pink',
                    borderImage: `repeating-linear-gradient(
                        -45deg,
                        #000,
                        #000 10px,
                        #ffb101 10px,
                        #ffb101 20px
                      ) 10`,
                    p: 1,
                    flexDirection: 'column',
                    [theme.breakpoints.up('md')]: {
                      flexDirection: 'row',
                      p: 2,
                      fontSize: 40,
                    },
                    lineHeight: 1,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4">
                    {getSafeName(userProfile.scName)}
                    {userProfile.state === UserStateEnum.Verified && (
                      <Tooltip title="You are verified!">
                        <Box
                          sx={{
                            position: 'relative',
                            zIndex: 1,
                            p: 0,
                            lineHeight: 0,
                            display: 'inline-block',
                            '& svg': {
                              strokeWidth: '0.5px',
                              stroke: 'black',
                            },
                            '&::before': {
                              content: '" "',
                              display: 'block',
                              background: 'black',
                              position: 'absolute',
                              top: 4,
                              left: 4,
                              zIndex: -1,
                              height: '16px',
                              width: '16px',
                              borderRadius: '50%',
                            },
                          }}
                        >
                          <Verified color="success" />
                        </Box>
                      </Tooltip>
                    )}
                  </Typography>
                  <div style={{ flexGrow: 1 }} />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setModalOpen(ProfileModals.ChangeUsername)}
                    startIcon={<Edit />}
                    size="small"
                  >
                    Change
                  </Button>
                </Box>
                {/* USERNAME ALERT */}
                <Alert severity="info" sx={{ mb: 2 }}>
                  Your handle inside this app. You can set it to anything but we{' '}
                  <strong>
                    <em>highly</em>
                  </strong>{' '}
                  recommend that you set it to your Star Citizen username so that when you are owed aUEC your crewmates
                  can enter the correct name and you can get paid.
                </Alert>
              </Box>
            </Box>

            {userProfile.state !== UserStateEnum.Verified && (
              <Box sx={styles.section}>
                <Typography component="div" sx={styles.sectionTitle}>
                  Verify Your Star Citizen Handle
                </Typography>
                <Box sx={styles.sectionBody}>
                  <Typography component="div" variant="caption">
                    If your handle above is the same as your Star Citizen username you can verify it to prove that you
                    control both accounts. (This might give your session-mates confidence that they{"'"}re dealing with
                    the right person and not some tricksy pirate using the same name).
                  </Typography>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Button
                      startIcon={<Verified />}
                      color="info"
                      size="small"
                      variant="contained"
                      onClick={() => {
                        if (!loading && navigate) navigate('/verify')
                      }}
                    >
                      Click here to verify your handle
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Avatar controls */}
            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                Avatar
              </Typography>
              <Box sx={styles.sectionBody}>
                <Typography paragraph variant="body2">
                  For now you can only choose to use the Avatar from your login account (or not).
                </Typography>

                <List dense disablePadding>
                  <ListItem>
                    <ListItemAvatar>
                      <UserAvatar user={userProfile} privacy={hideNames} size="large" />
                    </ListItemAvatar>
                    <Button onClick={() => refreshAvatar()}>Refresh Avatar</Button>
                    <Button onClick={() => refreshAvatar(true)}>Remove Avatar</Button>
                  </ListItem>
                </List>
              </Box>
              {consent || 'unset'}
            </Box>

            {/* Delete Profile */}
            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                Account Administration
              </Typography>
              <Box
                sx={{
                  border: '1px solid #666',
                  backgroundColor: '#333',
                  padding: 1,
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  fontFamily: fontFamilies.robotoMono,
                }}
              >
                USERID:{hideNames ? '[[REDACTED]]' : userProfile.userId}
              </Box>

              <div style={{ flexGrow: 1 }} />
              <Button
                fullWidth
                color="warning"
                disabled={loading}
                startIcon={<Cookie />}
                variant="outlined"
                onClick={() => setConsent(null)}
                sx={{ mt: 4 }}
              >
                Reset Analytics Cookie Choice (Currently: {consent === 'granted' ? 'Allowed' : 'No Tracking'})
              </Button>
              <Button
                fullWidth
                color="warning"
                disabled={loading}
                variant="outlined"
                onClick={() => {
                  wipeLocalLookups()
                  window.location.reload()
                }}
                sx={{ mt: 4 }}
              >
                Wipe Lookup Cache
              </Button>
              <Button
                fullWidth
                color="error"
                disabled={loading}
                variant="outlined"
                onClick={() => setModalOpen(ProfileModals.DeleteProfile)}
                sx={{ mt: 4 }}
              >
                Permanently Delete Profile
              </Button>
            </Box>
          </Container>
        )}

        {/* Scout Tab */}
        {activeTab === ProfileTabsEnum.SURVEY && (
          <Container sx={{ px: 2 }} maxWidth="sm">
            <Box sx={styles.section}>
              <SurveyCorps
                updateUserProfile={updateUserProfile}
                userProfile={userProfile}
                navigate={navigate}
                loading={loading}
                mutating={mutating}
              />
            </Box>
          </Container>
        )}

        {/* Friends Tab */}
        {activeTab === ProfileTabsEnum.FRIENDS && (
          <Container sx={{ px: 2 }} maxWidth="sm">
            {!hideNames && (
              <Box sx={styles.section}>
                <Typography component="div" sx={styles.sectionTitle}>
                  Friends ({userProfile.friends.length})
                </Typography>
                <Typography paragraph variant="body2" sx={{ p: 1, px: 2 }}>
                  Add the names of people you mine with regularly so they are easy to add to your sessions.
                </Typography>
                <Box sx={styles.sectionBody}>
                  <MentionedUserList
                    verifiedUsers={verifiedFriends}
                    mentionedUsers={userProfile.friends.map((f) => ({ scName: f, __typename: 'PendingUser' }))}
                    myFriends={userProfile.friends}
                    addToList={addFriend}
                    removeFriend={removeFriend}
                  />
                  <Typography paragraph variant="caption" sx={{ p: 1, pt: 3, px: 2 }} component="div">
                    NOTES:
                    <ul>
                      <li>Friends are not notified and this is not linked to their account in any way.</li>
                      <li>Friends do not have to be in this system to add them.</li>
                      <li>
                        This is simply here as a convenience to populate the dropdown menus for shares on Work orders
                        (for now).
                      </li>
                    </ul>
                  </Typography>
                </Box>
              </Box>
            )}
            {hideNames && (
              <Typography paragraph variant="overline" sx={{ p: 1, px: 2, textAlign: 'center' }}>
                You cannot see your friend list while streaming mode is on.
              </Typography>
            )}
          </Container>
        )}

        {/* Sessions Tab */}
        {activeTab === ProfileTabsEnum.SESSION_DEFAULTS && (
          <>
            <Stack direction={mediumUp ? 'row' : 'column'} spacing={2}>
              <Box sx={styles.section}>
                <Typography component="div" sx={styles.sectionTitle}>
                  Preferred Mining Session Vehicle
                </Typography>
                <Box sx={styles.sectionBody}>
                  <VehicleChooser
                    label="Mining Vehicle"
                    vehicle={userProfile.sessionShipCode as string | undefined}
                    onChange={(newVehicle) => {
                      const updatedNewUserProfile = { ...newUserProfile, sessionShipCode: newVehicle?.UEXID as string }
                      setNewUserProfile(updatedNewUserProfile)
                      updateUserProfile(updatedNewUserProfile)
                    }}
                  />
                  <Typography variant="caption" sx={{ mt: 1 }}>
                    This ship will be your default when you start or join a session. This can be changed during a
                    session.
                  </Typography>
                </Box>
              </Box>

              <Box sx={styles.section}>
                <Typography component="div" sx={styles.sectionTitle}>
                  Preferred Delivery Vehicle
                </Typography>
                <Box sx={styles.sectionBody}>
                  <VehicleChooser
                    label="Delivery Vehicle"
                    vehicle={userProfile.deliveryShipCode as string | undefined}
                    onlyCargo
                    onChange={(newVehicle) => {
                      const updatedNewUserProfile = { ...newUserProfile, deliveryShipCode: newVehicle?.UEXID as string }
                      setNewUserProfile(updatedNewUserProfile)
                      updateUserProfile(updatedNewUserProfile)
                    }}
                  />
                  <Typography variant="caption" sx={{ mt: 1 }}>
                    (This is not used yet but later we will be able to calculate the number of trips you need to make to
                    market from refineries)
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                Session Defaults
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography paragraph variant="body2">
                  These settings will be used as your session defaults. You can always override them when you create a
                  session. Changing these settings will not affect existing sessions.
                </Typography>
              </Alert>
              <Box sx={styles.sectionBody}>
                <SessionSettingsTab
                  sessionSettings={userProfile.sessionSettings}
                  resetDefaultSystemSettings={resetDefaultSettings}
                  onChangeSettings={(newSettings) => {
                    updateUserProfile(newUserProfile, newSettings)
                    setModalOpen(null)
                  }}
                  userSuggest={userProfile.friends.reduce((acc, friendName) => {
                    return { ...acc, [friendName]: { friend: true, session: false, named: false, crew: false } }
                  }, {} as UserSuggest)}
                />
              </Box>
            </Box>
          </>
        )}

        {activeTab === ProfileTabsEnum.API && (
          <Box sx={{ px: 2 }}>
            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                API Access
              </Typography>
            </Box>
            <Box sx={styles.sectionBody}>
              {userProfile.apiKey && (
                <Stack spacing={2} direction="row">
                  <TextField
                    label="API Token"
                    value={showAPIKey ? userProfile.apiKey : '**************************'}
                    fullWidth
                    disabled
                    InputProps={{
                      sx: {
                        fontFamily: fontFamilies.robotoMono,
                        textAlign: 'center',
                        color: showAPIKey ? theme.palette.warning.main : 'transparent',
                      },
                      readOnly: true,
                    }}
                  />
                  <Tooltip title={showAPIKey ? 'Hide' : 'Show'}>
                    <IconButton
                      color={showAPIKey ? 'primary' : 'default'}
                      onClick={() => {
                        setShowAPIKey(!showAPIKey)
                      }}
                    >
                      {showAPIKey ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy to clipboard">
                    <IconButton
                      onClick={() => {
                        if (userProfile.apiKey) navigator.clipboard.writeText(userProfile.apiKey)
                      }}
                    >
                      <ContentCopy />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}
              <Stack spacing={2} direction="row">
                {userProfile.apiKey ? (
                  <Button onClick={() => setModalOpen(ProfileModals.ResetAPIKey)}>Regenerate Token</Button>
                ) : (
                  <Button onClick={upsertAPIKey}>Generate API Token</Button>
                )}
                {userProfile.apiKey && (
                  <Button onClick={() => setModalOpen(ProfileModals.RevokeAPI)}>Delete token</Button>
                )}
              </Stack>
              {userProfile.apiKey && userProfile.plan === UserPlanEnum.Admin && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography paragraph variant="body2">
                    Feel free to use the API for your own projects. If you are using API calls regularly we'd really
                    appreciate your support to cover our server costs. If you haven't already please consider becoming a
                    supporter on{' '}
                    <Link href="https://ko-fi.com/regolithco" target="_blank">
                      Ko-Fi HERE
                    </Link>{' '}
                  </Typography>
                </Alert>
              )}
            </Box>
            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                Notes
              </Typography>
            </Box>
            <Box sx={styles.sectionBody}>
              <Typography paragraph variant="body2">
                <strong>DO NOT SHARE YOUR API TOKEN OR MAKE IT PUBLIC IN ANY WAY</strong>. Anyone with this code has
                full access to your <em>(and only your)</em> Regolith Account.
              </Typography>
              <Typography paragraph variant="body2">
                To use the Regolith API you need to include your API key in the header of your requests as follows:
              </Typography>
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  border: '1px solid #666',
                  backgroundColor: '#333',
                  fontFamily: fontFamilies.robotoMono,
                }}
              >
                <pre>POST: {config.apiUrl}</pre>
                <pre>{`Headers: {"x-api-key": "YOUR_TOKEN_HERE"}`}</pre>
                <pre>{`Body (JSON):{"query":"query {\n  profile {\n    userId\n    scName\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n}"}`}</pre>
                <Typography paragraph variant="caption">
                  (If you're sending this in as a raw string you'll need to collapse the line breaks into a single line
                  using '\n')
                </Typography>
              </Box>

              <Typography paragraph variant="body2">
                The base level is capped at 3,600 requests per day. If you need more, please contact us on{' '}
                <Link href="https://discord.gg/6TKSYHNJha" target="_blank">
                  Discord
                </Link>
                .
              </Typography>
              <Typography paragraph variant="body2">
                The Regolith API uses{' '}
                <Link href="https://graphql.org/" target="_blank" rel="noreferrer">
                  GraphQL
                </Link>{' '}
                for making requests. GraphQL is a query language for APIs and a runtime for executing those queries by
                using a type system you define for your data. It is an alternative to <strong>REST</strong> and it is
                self-documenting.
              </Typography>
              <Typography paragraph variant="body2">
                You can use tools like{' '}
                <Link href="https://www.postman.com/" target="_blank" rel="noreferrer">
                  Postman
                </Link>{' '}
                or{' '}
                <Link href="https://insomnia.rest/" target="_blank" rel="noreferrer">
                  Insomnia
                </Link>{' '}
                or{' '}
                <Link
                  // We need to encode config.apiUrl
                  href={`https://cloud.hasura.io/public/graphiql?endpoint=${encodeURIComponent(config.apiUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Hasura
                </Link>{' '}
                to test your API calls and explore the schema.
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <DeleteProfileModal
        open={modalOpen === ProfileModals.DeleteProfile}
        scName={userProfile.scName}
        onClose={() => setModalOpen(null)}
        onConfirm={(leaveData) => {
          deleteProfile(leaveData)
          setModalOpen(null)
        }}
      />

      <ChangeUsernameModal
        initialValue={userProfile.scName}
        open={modalOpen === ProfileModals.ChangeUsername}
        onClose={() => setModalOpen(null)}
        onChange={(newName) => {
          updateUserProfile({ ...newUserProfile, scName: newName })
          setModalOpen(null)
        }}
      />

      <ConfirmModal
        open={modalOpen === ProfileModals.ResetAPIKey}
        title="Reset API Key"
        message="This will invalidate the current key and generate a new one. Are you sure? All applications using this key will need to be updated."
        onClose={() => setModalOpen(null)}
        onConfirm={upsertAPIKey}
      />

      <ConfirmModal
        open={modalOpen === ProfileModals.RevokeAPI}
        title="Revoke API Key"
        message="This will invalidate the current key. Are you sure? All applications using this key will need to be updated."
        onClose={() => setModalOpen(null)}
        onConfirm={deleteAPIKey}
      />

      <RemoveUserModal
        scName={friend2remove || ''}
        open={Boolean(friend2remove && friend2remove.length > 0)}
        onConfirm={() => {
          if (friend2remove && friend2remove.length > 0 && removeFriend) removeFriend(friend2remove)
          setFriend2remove(undefined)
        }}
        onClose={() => setFriend2remove(undefined)}
      />
    </PageWrapper>
  )
}
