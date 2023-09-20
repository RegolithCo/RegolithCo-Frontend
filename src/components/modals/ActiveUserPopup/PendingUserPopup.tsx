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
import { GroupAdd, GroupRemove, Logout, RocketLaunch } from '@mui/icons-material'
import { SessionContext } from '../../../context/session.context'
dayjs.extend(relativeTime)

export interface PendingUserPopupProps {
  open: boolean
  onClose: () => void
  pendingUser: PendingUser
}

export const PendingUserPopup: React.FC<PendingUserPopupProps> = ({ open, onClose, pendingUser }) => {
  const theme = useTheme()
  const { captains, mySessionUser, myUserProfile, addFriend, removeFriend, updatePendingUserCaptain } =
    React.useContext(SessionContext)
  const theirCaptain: SessionUser | null = pendingUser.captainId
    ? captains.find((c) => c.ownerId === pendingUser.captainId) || null
    : null

  const vehicleCode = theirCaptain?.vehicleCode
  const vehicle = vehicleCode ? lookups.shipLookups.find((s) => s.code === vehicleCode) : null

  const isMyFriend = myUserProfile?.friends?.includes(pendingUser?.scName as string)
  const meIsCaptain = !mySessionUser?.captainId
  const iAmOnCrew = !!mySessionUser?.captainId
  const myCrewCaptain = meIsCaptain ? mySessionUser?.ownerId : mySessionUser?.captainId
  const theyOnAnyCrew = !!pendingUser?.captainId

  const theyOnMyCrew = theyOnAnyCrew && pendingUser?.captainId === myCrewCaptain

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
        {theirCaptain && (
          <Typography variant="overline" color="primary" component="div">
            Status: member of <strong>{theirCaptain?.owner?.scName}'s</strong> crew
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

        <Box>
          <Typography variant="overline" color="info.dark" component="div">
            Actions
          </Typography>
          <ButtonGroup fullWidth variant="text" color="info" orientation="vertical">
            {(meIsCaptain || iAmOnCrew) && !theyOnAnyCrew && (
              <Button
                startIcon={<RocketLaunch />}
                onClick={() => {
                  if (myCrewCaptain) updatePendingUserCaptain(pendingUser.scName, myCrewCaptain)
                }}
              >
                Add to my crew
              </Button>
            )}
            {(meIsCaptain || iAmOnCrew) && theyOnMyCrew && (
              <Button
                color="error"
                startIcon={<Logout />}
                onClick={() => {
                  updatePendingUserCaptain(pendingUser.scName, null)
                }}
              >
                Remove from my crew
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
          </ButtonGroup>
        </Box>

        <Alert severity="info" variant="outlined" sx={{ mt: 3 }}>
          <AlertTitle>About Pending Users</AlertTitle>
          <Typography variant="caption" paragraph component="div">
            Pending users are users who have been added to the session or one of its work orders but have not yet logged
            in and joined.
          </Typography>
          <Typography variant="caption" paragraph>
            <ul>
              <li>They are added to the session automatically when you add them to a work order.</li>
              <li>They can be added to your crew.</li>
              <li>They can be added to your friend list.</li>
              <li>
                They become <strong>active users</strong> when they log in and join your session.
              </li>
              <li>
                You can set your session to only allow pending users to join and use this as a sort of "invite only"
                list to prevent random people with the share URL from joining.
              </li>
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
