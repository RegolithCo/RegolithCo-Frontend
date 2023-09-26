import * as React from 'react'
import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { fontFamilies } from '../../../theme'
import { PendingUser, lookups, SessionUser } from '@regolithco/common'
import { Box } from '@mui/system'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { UserAvatar } from '../../UserAvatar'
import { Cancel, CheckCircle, DeleteForever, GroupAdd, GroupRemove, Logout, RocketLaunch } from '@mui/icons-material'
import { SessionContext } from '../../../context/session.context'
dayjs.extend(relativeTime)

export interface PendingUserPopupProps {
  open: boolean
  onClose: () => void
  pendingUser: PendingUser
}

export const PendingUserPopup: React.FC<PendingUserPopupProps> = ({ open, onClose, pendingUser }) => {
  const theme = useTheme()
  const {
    captains,
    session,
    mySessionUser,
    myUserProfile,
    addFriend,
    removeFriend,
    updatePendingUserCaptain,
    crewHierarchy,
  } = React.useContext(SessionContext)
  const theirCaptain: SessionUser | null = pendingUser.captainId
    ? captains.find((c) => c.ownerId === pendingUser.captainId) || null
    : null

  const iOwnSession = session?.ownerId === myUserProfile.userId

  const theirCaptainId = pendingUser?.captainId
  const vehicleCode = theirCaptain?.vehicleCode
  const vehicle = vehicleCode ? lookups.shipLookups.find((s) => s.code === vehicleCode) : null

  const isMyFriend = myUserProfile?.friends?.includes(pendingUser.scName as string)
  const meIsPotentialCaptain = !mySessionUser?.captainId
  const meIsCaptain = !mySessionUser?.captainId && crewHierarchy[mySessionUser?.ownerId]
  const theirCaptainScName = captains.find((c) => c.ownerId === theirCaptainId)?.owner?.scName
  const iAmOnCrew = !!mySessionUser?.captainId
  const myCrewCaptainId = mySessionUser?.captainId

  const theyOnAnyCrew = Boolean(pendingUser?.captainId)

  const iAmTheirCaptain = theirCaptainId === mySessionUser?.ownerId
  const theyOnMyCrew = theyOnAnyCrew && (iAmTheirCaptain || theirCaptainId === mySessionUser?.captainId)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 10,
          boxShadow: `0px 0px 20px 5px ${theme.palette.info.dark}, 0px 0px 60px 40px black`,
          background: theme.palette.background.default,
          border: `10px solid ${theme.palette.info.main}`,
          // px: 4,
          // py: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          position: 'relative',
          fontFamily: fontFamilies.robotoMono,
          fontWeight: 'bold',
          display: 'flex',
          flexDirection: 'column',
          pl: 14,
          mb: 2,

          backgroundColor: theme.palette.info.main,
          color: theme.palette.info.contrastText,
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
          <UserAvatar size="xlarge" pendingUser={pendingUser} />
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h4">{pendingUser.scName}</Typography>
          <Box sx={{ flexGrow: 1 }} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography>Pending User</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {theirCaptain ? (
          <Typography variant="overline" color="primary" component="div">
            Status: member of <strong>{theirCaptain?.owner?.scName}'s</strong> crew
          </Typography>
        ) : (
          <Typography variant="overline" color="primary" component="div">
            Status: not on a crew
          </Typography>
        )}

        {vehicle && theirCaptain && (
          <Box>
            <Typography variant="overline" color="primary" component="div">
              Current Vehicle
            </Typography>

            <Typography variant="caption" color="text.secondary">
              1<strong>{theirCaptain.owner?.scName}'s</strong> crew is using a {vehicle?.name} (
              {vehicle?.miningHold || vehicle?.cargo} SCU)
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box>
          <ButtonGroup fullWidth variant="text" color="info" orientation="vertical">
            {(meIsPotentialCaptain || iAmOnCrew) && !theyOnAnyCrew && (
              <Button
                startIcon={<RocketLaunch />}
                onClick={() => {
                  if (meIsPotentialCaptain)
                    updatePendingUserCaptain(pendingUser.scName, myCrewCaptainId || mySessionUser.ownerId)
                  else if (myCrewCaptainId)
                    updatePendingUserCaptain(pendingUser.scName, myCrewCaptainId || mySessionUser.ownerId)
                }}
              >
                Add to my crew
              </Button>
            )}
            {theyOnMyCrew && (
              <Button
                color="error"
                startIcon={<Logout />}
                onClick={() => {
                  updatePendingUserCaptain(pendingUser.scName, null)
                }}
              >
                Remove from {iAmTheirCaptain ? 'my' : theirCaptainScName} crew
              </Button>
            )}
            {isMyFriend ? (
              <Button
                color="error"
                startIcon={<GroupRemove />}
                onClick={() => {
                  removeFriend(pendingUser.scName as string)
                }}
              >
                Remove from my friend List
              </Button>
            ) : (
              <Button
                startIcon={<GroupAdd />}
                onClick={() => {
                  addFriend(pendingUser.scName as string)
                }}
              >
                Add to my friend List
              </Button>
            )}
            {iOwnSession && (
              <Button
                startIcon={<DeleteForever />}
                onClick={() => {
                  addFriend(pendingUser.scName as string)
                }}
              >
                Delete {iAmTheirCaptain ? 'my' : theirCaptainScName} from session
              </Button>
            )}
          </ButtonGroup>
        </Box>

        <Alert severity="info" variant="outlined" sx={{ mt: 3 }}>
          <AlertTitle>About Pending Users</AlertTitle>
          <Typography variant="caption" paragraph component="div">
            Pending users are users who have been added to the session or one of its work orders but have not yet logged
            in and joined.
          </Typography>
          <Typography variant="caption" paragraph component="div">
            They are added to the session automatically when you add them to a work order.
          </Typography>
          <Typography variant="caption" paragraph component="div">
            You can set your session to only allow pending users to join and use this as a sort of "invite only" list to
            prevent random people with the share URL from joining.
          </Typography>
          <Typography variant="subtitle1" paragraph>
            <CheckCircle color="success" sx={{ mr: 1 }} />
            Pending users CAN
          </Typography>
          <Typography variant="caption" paragraph>
            <ul>
              <li>Be on your crew.</li>
              <li>Be mentioned in work orders.</li>
              <li>Be on your friend list.</li>
              <li>
                Become <strong>active users</strong> when they log in and join your session.
              </li>
            </ul>
          </Typography>
          <Typography variant="subtitle1" paragraph>
            <Cancel color="error" sx={{ mr: 1 }} />
            Pending users CANNOT
          </Typography>
          <Typography variant="caption" paragraph>
            <ul>
              <li>Be captains of a crew.</li>
            </ul>
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions>
        <div style={{ flexGrow: 1 }} />
        <Button color="info" onClick={onClose}>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  )
}
