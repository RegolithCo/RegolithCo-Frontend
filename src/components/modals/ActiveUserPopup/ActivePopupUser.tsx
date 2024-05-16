import * as React from 'react'
import {
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
import { MiningLoadout, SessionUser, ShipLookups, User } from '@regolithco/common'
import { UserAvatar } from '../../UserAvatar'
import { Box } from '@mui/system'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { SessionContext } from '../../../context/session.context'
import { ModuleIcon } from '../../../icons'
import { GroupAdd, GroupRemove, Logout, RocketLaunch } from '@mui/icons-material'
import { AppContext } from '../../../context/app.context'
import { LookupsContext } from '../../../context/lookupsContext'

dayjs.extend(relativeTime)

export interface ActivePopupUserProps {
  open: boolean
  onClose: () => void
  sessionUser: SessionUser
}

export const ActivePopupUser: React.FC<ActivePopupUserProps> = ({ open, onClose, sessionUser }) => {
  const theme = useTheme()
  const { getSafeName, hideNames } = React.useContext(AppContext)
  const dataStore = React.useContext(LookupsContext)

  const {
    captains,
    mySessionUser,
    myUserProfile,
    openLoadoutModal,
    updateSessionUserCaptain,
    addFriend,
    crewHierarchy,
    removeFriend,
  } = React.useContext(SessionContext)

  if (!dataStore.ready) return null

  const shipLookups = dataStore.getLookup('shipLookups') as ShipLookups

  const theirCaptain: SessionUser | null =
    sessionUser.captainId && crewHierarchy[sessionUser.captainId]
      ? captains.find((c) => c.ownerId === sessionUser.captainId) || null
      : null

  const vehicleCode = theirCaptain?.vehicleCode || sessionUser.vehicleCode
  const vehicle = vehicleCode ? shipLookups.find((s) => s.UEXID === vehicleCode) : null

  const isMyFriend = myUserProfile?.friends?.includes(sessionUser.owner?.scName as string)
  const meIsPotentialCaptain = !mySessionUser?.captainId || !crewHierarchy[mySessionUser?.captainId]
  const meIsCaptain = !!crewHierarchy[mySessionUser?.ownerId]
  const iAmOnCrew = !!mySessionUser?.captainId && !!crewHierarchy[mySessionUser?.captainId]
  const myCrewCaptain = meIsCaptain ? mySessionUser?.ownerId : mySessionUser?.captainId

  const theyIsCaptain = !sessionUser?.captainId || !crewHierarchy[sessionUser?.ownerId]
  const theyOnAnyCrew = Boolean(sessionUser?.captainId && crewHierarchy[sessionUser?.captainId])
  const theyOnMyCrew = theyOnAnyCrew && theirCaptain?.ownerId === myCrewCaptain

  const crewCount =
    crewHierarchy[sessionUser?.ownerId] &&
    crewHierarchy[sessionUser?.ownerId].activeIds.length + crewHierarchy[sessionUser?.ownerId].innactiveSCNames.length

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
          <UserAvatar size="xlarge" user={sessionUser?.owner as User} privacy={hideNames} />
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h4">{getSafeName(sessionUser.owner?.scName)}</Typography>
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
              on <strong>{getSafeName(theirCaptain?.owner?.scName)}'s</strong> crew
            </span>
          ) : (
            ''
          )}
          {theyIsCaptain && (
            <span>
              captain with <strong>{crewCount}</strong> crew members
            </span>
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
                  <strong>{getSafeName(sessionUser.owner?.scName)}'s</strong> does not have a vehicle selected.
                </>
              )}
            </Typography>
          ) : (
            <Typography variant="caption" color="text.secondary">
              {vehicle ? (
                <>
                  <strong>{getSafeName(theirCaptain.owner?.scName)}'s</strong> crew is using a {vehicle?.name} (
                  {vehicle?.miningHold || vehicle?.cargo} SCU)
                </>
              ) : (
                <>
                  <strong>{getSafeName(theirCaptain.owner?.scName)}'s</strong> does not have a vehicle selected.
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
        <Divider sx={{ my: 3 }} />
        <Box>
          <ButtonGroup fullWidth variant="text" aria-label="contained primary button group" orientation="vertical">
            {(meIsPotentialCaptain || iAmOnCrew) && !theyOnAnyCrew && !theyIsCaptain && (
              <Button
                startIcon={<RocketLaunch />}
                onClick={() => {
                  updateSessionUserCaptain(sessionUser.ownerId, mySessionUser.ownerId)
                }}
              >
                Add to my crew
              </Button>
            )}
            {myCrewCaptain === sessionUser.ownerId && (
              <Button
                color="error"
                startIcon={<RocketLaunch />}
                onClick={() => {
                  updateSessionUserCaptain(mySessionUser.ownerId, null)
                }}
              >
                Leave {getSafeName(sessionUser.owner?.scName)}'s crew
              </Button>
            )}
            {!meIsCaptain && !iAmOnCrew && !theyOnAnyCrew && (
              <Button
                startIcon={<RocketLaunch />}
                onClick={() => {
                  updateSessionUserCaptain(mySessionUser.ownerId, sessionUser.ownerId)
                }}
              >
                Join {getSafeName(sessionUser.owner?.scName)}'s crew
              </Button>
            )}
            {(meIsCaptain || iAmOnCrew) && theyOnMyCrew && (
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
