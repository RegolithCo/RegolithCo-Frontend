import * as React from 'react'
import {
  VerifiedUserLookup,
  UserProfile,
  UserStateEnum,
  UserProfileInput,
  DestructuredSettings,
  UserSuggest,
  makeAvatar,
} from '@regolithco/common'

import { PageWrapper } from '../PageWrapper'
import {
  Alert,
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  SxProps,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Edit, Person, Verified } from '@mui/icons-material'
import { RemoveUserModal } from '../modals/RemoveUserModal'
import { ChangeUsernameModal } from '../modals/ChangeUsernameModal'
import { DeleteProfileModal } from '../modals/DeleteProfileModal'
import { yellow } from '@mui/material/colors'
import { MentionedUserList } from '../fields/MentionedUserList'
import { pick } from 'lodash'
import { fontFamilies } from '../../theme'
import { Theme } from '@mui/system'
import { SessionSettingsTab } from './SessionPage/TabSettings'
import { VehicleChooser } from '../fields/VehicleChooser'

type ObjectValues<T> = T[keyof T]
export const ProfileModals = {
  ChangeUsername: 'ChangeUsername',
  DeleteProfile: 'DeleteProfile',
  SessionSettings: 'SeessionSettings',
} as const
export type ProfileModals = ObjectValues<typeof ProfileModals>

export interface ProfilePageProps {
  userProfile: UserProfile
  verifiedFriends: VerifiedUserLookup
  loading?: boolean
  navigate?: (path: string) => void
  addFriend?: (friendName: string) => void
  removeFriend?: (friendName: string) => void
  resetDefaultSettings?: () => void
  refreshAvatar: (remove?: boolean) => void
  updateUserProfile?: (userProfile: UserProfileInput, settings?: DestructuredSettings) => void
  deleteProfile?: (leaveData: boolean) => void
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
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

export const ProfileTabsEnum = {
  PROFILE: 'profile',
  FRIENDS: 'friends',
  SESSION_DEFAULTS: 'sessionDefaults',
} as const
export type ProfileTabsEnum = ObjectValues<typeof ProfileTabsEnum>

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userProfile,
  loading,
  verifiedFriends,
  navigate,
  updateUserProfile,
  resetDefaultSettings,
  refreshAvatar,
  addFriend,
  deleteProfile,
  removeFriend,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const mediumUp = useMediaQuery(theme.breakpoints.up('md'))
  const [modalOpen, setModalOpen] = React.useState<ProfileModals | null>(null)
  const [newUserProfile, setNewUserProfile] = React.useState<UserProfileInput>(
    pick(userProfile, ['deliveryShipCode', 'sessionShipCode', 'scName', 'userSettings'])
  )
  const [activeTab, setActiveTab] = React.useState<ProfileTabsEnum>(ProfileTabsEnum.PROFILE)
  const [friend2remove, setFriend2remove] = React.useState<string>()

  React.useEffect(() => {
    if (userProfile)
      setNewUserProfile(pick(userProfile, ['deliveryShipCode', 'sessionShipCode', 'scName', 'userSettings']))
  }, [userProfile])

  const friends: string[] = [...(userProfile?.friends || [])]
  // Alphabetically sort friends
  friends.sort((a, b) => a.localeCompare(b))
  const myAvatar = makeAvatar(userProfile?.avatarUrl as string)

  const maxWidth = mediumUp && activeTab === ProfileTabsEnum.SESSION_DEFAULTS ? 'md' : 'sm'

  return (
    <PageWrapper title="User Profile" loading={loading} maxWidth={maxWidth} sx={styles.pageWrapper}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', flex: '0 0' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => {
            setActiveTab(newValue)
          }}
          sx={styles.sessionTabs}
        >
          <Tab label="Profile" value={ProfileTabsEnum.PROFILE} />
          <Tab label="Friends" value={ProfileTabsEnum.FRIENDS} />
          <Tab label="Session Defaults" value={ProfileTabsEnum.SESSION_DEFAULTS} />
        </Tabs>
      </Box>
      <Box sx={styles.container}>
        {/* Profile Tab */}
        {activeTab === ProfileTabsEnum.PROFILE && (
          <Box sx={{ px: 2 }}>
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
                    {userProfile.scName}
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
                    control both accounts. (This might give your session-mates confidence that they're dealing with the
                    right person and not some tricksy pirate using the same name).
                  </Typography>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Button
                      startIcon={<Verified />}
                      color="info"
                      size="small"
                      variant="contained"
                      onClick={() => {
                        !loading && navigate && navigate('/verify')
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
                      <Avatar
                        alt={userProfile?.scName}
                        src={myAvatar}
                        imgProps={{ referrerPolicy: 'no-referrer' }}
                        color="secondary"
                        sx={{
                          background: theme.palette.secondary.main,
                          color: theme.palette.secondary.contrastText,
                          border: '1px solid',
                        }}
                      >
                        <Person color="inherit" />
                      </Avatar>
                    </ListItemAvatar>
                    <Button onClick={() => refreshAvatar()}>Refresh Avatar</Button>
                    <Button onClick={() => refreshAvatar(true)}>Remove Avatar</Button>
                  </ListItem>
                </List>
              </Box>
            </Box>

            {/* Delete Profile */}
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
              USERID:{userProfile.userId}
            </Box>

            <div style={{ flexGrow: 1 }} />
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
        )}

        {/* Friends Tab */}
        {activeTab === ProfileTabsEnum.FRIENDS && (
          <Box sx={{ px: 2 }}>
            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                Friends ({userProfile.friends.length})
              </Typography>
              <Typography paragraph variant="body2" sx={{ p: 1, px: 2 }}>
                Add your the names of people you mine with regularly so they are easy to add to your sessions.
              </Typography>
              <Box sx={styles.sectionBody}>
                <MentionedUserList
                  verifiedUsers={verifiedFriends}
                  mentionedUsers={userProfile.friends.map((f) => ({ scName: f, __typename: 'InnactiveUser' }))}
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
                      This is simply here as a convenience to populate the dropdown menus for shares on Work orders (for
                      now).
                    </li>
                  </ul>
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Sessions Tab */}
        {activeTab === ProfileTabsEnum.SESSION_DEFAULTS && (
          <>
            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                Preferred Mining Session Vehicle
              </Typography>
              <Box sx={styles.sectionBody}>
                <VehicleChooser
                  label="Mining Vehicle"
                  vehicle={userProfile.sessionShipCode as string | undefined}
                  onChange={(newVehicle) => {
                    const updatedNewUserProfile = { ...newUserProfile, sessionShipCode: newVehicle?.code }
                    setNewUserProfile(updatedNewUserProfile)
                    updateUserProfile && updateUserProfile(updatedNewUserProfile)
                  }}
                />
                <Typography variant="caption" sx={{ mt: 1 }}>
                  This ship will be your default when you start or join a session. This can be changed during a session.
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
                    const updatedNewUserProfile = { ...newUserProfile, deliveryShipCode: newVehicle?.code }
                    setNewUserProfile(updatedNewUserProfile)
                    updateUserProfile && updateUserProfile(updatedNewUserProfile)
                  }}
                />
                <Typography variant="caption" sx={{ mt: 1 }}>
                  (This is not used yet but later we will be able to calculate the number of trips you need to make to
                  market from refineries)
                </Typography>
              </Box>
            </Box>

            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                Session Defaults
              </Typography>
              <Typography paragraph variant="body2">
                These settings will be used as your session defaults. You can always override them when you create a
                session.
              </Typography>
              <Box sx={styles.sectionBody}>
                <SessionSettingsTab
                  sessionSettings={userProfile.sessionSettings}
                  resetDefaultSystemSettings={resetDefaultSettings}
                  onChangeSettings={(newSettings) => {
                    updateUserProfile && updateUserProfile(newUserProfile, newSettings)
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
      </Box>

      <DeleteProfileModal
        open={modalOpen === ProfileModals.DeleteProfile}
        scName={userProfile.scName}
        onClose={() => setModalOpen(null)}
        onConfirm={(leaveData) => {
          deleteProfile && deleteProfile(leaveData)
          setModalOpen(null)
        }}
      />

      <ChangeUsernameModal
        initialValue={userProfile.scName}
        open={modalOpen === ProfileModals.ChangeUsername}
        onClose={() => setModalOpen(null)}
        onChange={(newName) => {
          updateUserProfile && updateUserProfile({ ...newUserProfile, scName: newName })
          setModalOpen(null)
        }}
      />

      <RemoveUserModal
        scName={friend2remove || ''}
        open={Boolean(friend2remove && friend2remove.length > 0)}
        onConfirm={() => {
          friend2remove && friend2remove.length > 0 && removeFriend && removeFriend(friend2remove)
          setFriend2remove(undefined)
        }}
        onClose={() => setFriend2remove(undefined)}
      />
    </PageWrapper>
  )
}
