import * as React from 'react'
import {
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
import { lookups, MiningLoadout, SessionUser, User, UserStateEnum } from '@regolithco/common'
import { UserAvatar } from '../../UserAvatar'
import { Box } from '@mui/system'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { SessionContext } from '../../../context/session.context'
import { ModuleIcon } from '../../../icons'
import { GroupAdd, GroupRemove, Logout, RocketLaunch } from '@mui/icons-material'
dayjs.extend(relativeTime)

export interface ActivePopupUserProps {
  open: boolean
  onClose: () => void
  sessionUser: SessionUser
}

export const ActivePopupUser: React.FC<ActivePopupUserProps> = ({ open, onClose, sessionUser }) => {
  const theme = useTheme()
  const {
    captains,
    mySessionUser,
    myUserProfile,
    openLoadoutModal,
    updateSessionUserCaptain,
    addFriend,
    removeFriend,
  } = React.useContext(SessionContext)
  const theirCaptain: SessionUser | null = sessionUser.captainId
    ? captains.find((c) => c.ownerId === sessionUser.captainId) || null
    : null

  const vehicleCode = theirCaptain?.vehicleCode || sessionUser.vehicleCode
  const vehicle = vehicleCode ? lookups.shipLookups.find((s) => s.code === vehicleCode) : null

  const isMyFriend = myUserProfile?.friends?.includes(sessionUser.owner?.scName as string)
  const meIsCaptain = !mySessionUser?.captainId
  const theyOnMyCrew = !!sessionUser?.captainId && mySessionUser?.captainId === sessionUser?.captainId
  const theyOnAnyCrew = !!sessionUser?.captainId

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 10,
          boxShadow: `0px 0px 20px 5px ${theme.palette.primary.light}, 0px 0px 60px 40px black`,
          background: theme.palette.background.default,
          border: `10px solid ${theme.palette.primary.main}`,
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

          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
          <UserAvatar size="xlarge" user={sessionUser?.owner as User} />
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h4">{sessionUser.owner?.scName}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="overline" color="secondary.contrastText">
            ({sessionUser?.owner?.state === UserStateEnum.Verified ? 'Verified User' : 'Unverified User'})
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography>last session activity: {dayjs(sessionUser.updatedAt).fromNow()}</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography variant="overline" color="primary" component="div">
          Status: <strong>{sessionUser.state}</strong>{' '}
          {theirCaptain ? (
            <span>
              on <strong>{theirCaptain?.owner?.scName}'s</strong> crew
            </span>
          ) : (
            ''
          )}
        </Typography>

        <Box>
          <Typography variant="overline" color="primary" component="div">
            Current Vehicle
          </Typography>

          {!theirCaptain ? (
            <Typography variant="caption" color="text.secondary">
              {vehicle ? (
                <>
                  {vehicle?.name} ({vehicle?.miningHold || vehicle?.cargo} SCU)
                </>
              ) : (
                <>
                  <strong>{sessionUser.owner?.scName}'s</strong> does not have a vehicle selected.
                </>
              )}
            </Typography>
          ) : (
            <Typography variant="caption" color="text.secondary">
              {vehicle ? (
                <>
                  <strong>{theirCaptain.owner?.scName}'s</strong> crew is using a {vehicle?.name} (
                  {vehicle?.miningHold || vehicle?.cargo} SCU)
                </>
              ) : (
                <>
                  <strong>{theirCaptain.owner?.scName}'s</strong> does not have a vehicle selected.
                </>
              )}
            </Typography>
          )}
        </Box>

        {!theirCaptain && sessionUser.loadout && (
          <Box>
            <Typography variant="overline" color="primary" component="div">
              Current Vehicle Loadout
            </Typography>
            <Button
              variant="contained"
              startIcon={<ModuleIcon />}
              onClick={() => {
                openLoadoutModal(sessionUser.loadout as MiningLoadout)
              }}
            >
              {sessionUser.loadout?.name || 'No Loadout Selected'}
            </Button>
          </Box>
        )}

        <Box>
          <Typography variant="overline" color="primary" component="div">
            Actions
          </Typography>
          <ButtonGroup fullWidth variant="text" aria-label="contained primary button group" orientation="vertical">
            {meIsCaptain && !theyOnAnyCrew && (
              <Button
                startIcon={<RocketLaunch />}
                onClick={() => {
                  updateSessionUserCaptain(sessionUser.ownerId, mySessionUser.ownerId)
                }}
              >
                Add to my crew
              </Button>
            )}
            {meIsCaptain && theyOnMyCrew && (
              <Button
                color="error"
                startIcon={<Logout />}
                onClick={() => {
                  updateSessionUserCaptain(sessionUser.ownerId, null)
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
                  removeFriend(sessionUser.owner?.scName as string)
                }}
              >
                Remove from my friend List
              </Button>
            ) : (
              <Button
                startIcon={<GroupAdd />}
                onClick={() => {
                  addFriend(sessionUser.owner?.scName as string)
                }}
              >
                Add to my friend List
              </Button>
            )}
          </ButtonGroup>
        </Box>
      </DialogContent>
      <DialogActions>
        <div style={{ flexGrow: 1 }} />
        <Button color="primary" onClick={onClose}>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  )
}
