import * as React from 'react'

import {
  VerifiedUserLookup,
  DeliveryShips,
  lookups,
  ShipStats,
  UserProfile,
  UserStateEnum,
  ShipEnum,
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
  MenuItem,
  Select,
  SxProps,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { Edit, Person, Segment, Settings, Verified } from '@mui/icons-material'
import { RemoveUserModal } from '../modals/RemoveUserModal'
import { ChangeUsernameModal } from '../modals/ChangeUsernameModal'
import { DeleteProfileModal } from '../modals/DeleteProfileModal'
import { yellow } from '@mui/material/colors'
import { MentionedUserList } from '../fields/MentionedUserList'
import { SessionSettingsModal } from './SessionPage/SessionSettingsModal'
import { pick } from 'lodash'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { fontFamilies } from '../../theme'
import { Theme } from '@mui/system'

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
  deleteProfile?: () => void
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  container: {},
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
    color: theme.palette.primary.dark,
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
  const [modalOpen, setModalOpen] = React.useState<ProfileModals | null>(null)
  const [newUserProfile, setNewUserProfile] = React.useState<UserProfileInput>(
    pick(userProfile, ['deliveryShip', 'scName', 'userSettings'])
  )
  const [friend2remove, setFriend2remove] = React.useState<string>()

  React.useEffect(() => {
    if (userProfile) setNewUserProfile(pick(userProfile, ['deliveryShip', 'scName', 'userSettings']))
  }, [userProfile])

  const friends: string[] = [...(userProfile?.friends || [])]
  // Alphabetically sort friends
  friends.sort((a, b) => a.localeCompare(b))
  const myAvatar = makeAvatar(userProfile?.avatarUrl as string)
  const sortedShips = [...DeliveryShips]
  sortedShips.sort((a, b) => {
    const { cargo: cargoA }: ShipStats = lookups.shipLookups[a] as ShipStats
    const { cargo: cargoB }: ShipStats = lookups.shipLookups[b] as ShipStats
    return cargoA && cargoB ? cargoB - cargoA : 0
  })

  return (
    <PageWrapper title="User Profile" loading={loading} maxWidth="lg">
      <Grid container spacing={{ xs: 2, sm: 2, lg: 4 }}>
        {/* LEFT COLUMN */}
        <Grid xs={12} sm={12} md={6}>
          <Box sx={styles.section}>
            <Typography component="div" sx={styles.sectionTitle}>
              User Handle
            </Typography>
            <Box sx={styles.sectionBody}>
              {/* USERNAME */}
              <Box
                sx={{
                  display: 'flex',
                  p: 2,
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
                  fontSize: 40,
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

          {/* Delete Profile */}
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
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid xs={12} sm={12} md={6}>
          {/* Set Refinery Defaults */}
          <Box sx={styles.section}>
            <Typography component="div" sx={styles.sectionTitle}>
              Session / Refinery Defaults
            </Typography>

            <Box sx={styles.sectionBody}>
              <Button
                variant="outlined"
                onClick={() => setModalOpen(ProfileModals.SessionSettings)}
                sx={{}}
                startIcon={<Settings />}
              >
                My Session Defaults
              </Button>

              <Typography component="div" variant="caption">
                These settings will be used as defaults every time you create a session.
              </Typography>
            </Box>
          </Box>

          <Box sx={styles.section}>
            <Typography component="div" sx={styles.sectionTitle}>
              Preferred Delivery Ship
            </Typography>
            <Box sx={styles.sectionBody}>
              <Select
                labelId="demo-select-small-label"
                id="delivery-ship-select"
                disabled={loading}
                variant="outlined"
                fullWidth
                sx={{
                  fontFamily: fontFamilies.robotoMono,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  mb: 2,
                }}
                value={newUserProfile.deliveryShip || ''}
                renderValue={(ship) => {
                  const shipObj: ShipStats = lookups.shipLookups[ship as ShipEnum] as ShipStats
                  return (
                    <Box sx={{ display: 'flex' }}>
                      {shipObj.name}
                      <div style={{ flexGrow: 1 }} />
                      <div>({shipObj.cargo} SCU)</div>
                    </Box>
                  )
                }}
                onChange={(e) => {
                  const newDeliveryShip =
                    e.target.value && e.target.value.length > 0 ? (e.target.value as ShipEnum) : null
                  const updatedNewUserProfile = { ...newUserProfile, deliveryShip: newDeliveryShip }
                  setNewUserProfile(updatedNewUserProfile)
                  updateUserProfile && updateUserProfile(updatedNewUserProfile)
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {sortedShips.map((ship) => {
                  const shipObj: ShipStats = lookups.shipLookups[ship] as ShipStats
                  return (
                    <MenuItem key={`ship-${ship}`} value={ship}>
                      {shipObj.name}
                      <div style={{ flexGrow: 1 }} />
                      <Typography variant="caption">({shipObj.cargo} SCU)</Typography>
                    </MenuItem>
                  )
                })}
              </Select>
              <Typography variant="caption" sx={{ mt: 1 }}>
                The ship you prefer to use for taking your ore to market.
              </Typography>
            </Box>
          </Box>

          {/* Friends List */}
          <Box sx={styles.section}>
            <Typography component="div" sx={styles.sectionTitle}>
              Friends ({userProfile.friends.length})
            </Typography>
            <Box sx={styles.sectionBody}>
              <Typography paragraph variant="caption">
                Add your the names of people you mine with so that they are easy to add to your sessions.
              </Typography>
              <MentionedUserList
                verifiedUsers={verifiedFriends}
                mentionedUsers={userProfile.friends}
                myFriends={userProfile.friends}
                addToList={addFriend}
                removeFriend={removeFriend}
              />
            </Box>
          </Box>

          {/* Avatar controls */}
          <Box sx={styles.section}>
            <Typography component="div" sx={styles.sectionTitle}>
              Avatar
            </Typography>
            <Box sx={styles.sectionBody}>
              <Typography paragraph variant="caption">
                For now you can only choose to use the Avatar from your login account or not.
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
        </Grid>
      </Grid>

      <DeleteProfileModal
        open={modalOpen === ProfileModals.DeleteProfile}
        scName={userProfile.scName}
        onClose={() => setModalOpen(null)}
        onConfirm={() => {
          deleteProfile && deleteProfile()
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

      <SessionSettingsModal
        sessionSettings={userProfile.sessionSettings}
        title={'My Session Defaults'}
        description="These settings will be used as defaults every time you create a session."
        open={modalOpen === ProfileModals.SessionSettings}
        onModalClose={() => setModalOpen(null)}
        resetDefaultSystemSettings={resetDefaultSettings}
        onChangeSettings={(newSettings) => {
          updateUserProfile && updateUserProfile(newUserProfile, newSettings)
          setModalOpen(null)
        }}
        userSuggest={userProfile.friends.reduce((acc, friendName) => {
          return { ...acc, [friendName]: { friend: true, session: false, named: false } }
        }, {} as UserSuggest)}
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
