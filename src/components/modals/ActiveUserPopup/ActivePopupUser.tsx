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
import { MiningLoadout, PendingUser, PendingUserInput, SessionUser, ShipLookups, User } from '@regolithco/common'
import { UserAvatar } from '../../UserAvatar'
import { Box } from '@mui/system'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { SessionContext } from '../../../context/session.context'
import { ModuleIcon } from '../../../icons'
import { DeleteForever, GroupAdd, GroupRemove, Logout, RocketLaunch } from '@mui/icons-material'
import { AppContext } from '../../../context/app.context'
import { LookupsContext } from '../../../context/lookupsContext'
import { ShipRoleChooser } from '../../fields/ShipRoleChooser'
import { SessionRoleChooser } from '../../fields/SessionRoleChooser'
import { DeleteModal } from '../DeleteModal'

dayjs.extend(relativeTime)

export interface ActivePopupUserProps {
  open: boolean
  onClose: () => void
  sessionUser: SessionUser
}

export const ActivePopupUser: React.FC<ActivePopupUserProps> = ({ open, onClose, sessionUser }) => {
  const theme = useTheme()
  const { getSafeName, hideNames } = React.useContext(AppContext)
  const [deleteActiveUserOpen, setDeleteActiveUserOpen] = React.useState(false)
  const dataStore = React.useContext(LookupsContext)

  const {
    session,
    captains,
    mySessionUser,
    myUserProfile,
    isSessionAdmin,
    removeSessionCrew,
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

  const isMe = mySessionUser.ownerId === sessionUser.ownerId
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

  let sessionRoleDisabled = true
  if (isSessionAdmin) sessionRoleDisabled = false
  else if (!session?.sessionSettings?.controlledSessionRole && isMe) sessionRoleDisabled = false

  let shipRoleDisabled = true
  if (isSessionAdmin) shipRoleDisabled = false
  else if (!session?.sessionSettings?.controlledShipRole && (isMe || theyOnMyCrew)) shipRoleDisabled = false

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

        <PopupUserRoleChooser user={sessionUser} />

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
            {isSessionAdmin && (
              <Button
                startIcon={<DeleteForever />}
                color="error"
                onClick={() => {
                  setDeleteActiveUserOpen(true)
                }}
              >
                Delete {getSafeName(sessionUser.owner?.scName)} from session
              </Button>
            )}
          </ButtonGroup>
        </Box>

        <DeleteModal
          open={deleteActiveUserOpen}
          title={`Delete ${sessionUser?.owner?.scName} from session?`}
          message={
            <>
              <Typography>
                Are you sure you want to delete <strong>{sessionUser?.owner?.scName}</strong> from the session? This
                will:
                <ul>
                  <li>Remove all of their work orders.</li>
                  <li>Remove their work order shares in any work order.</li>
                  <li>Reassigned all their scouting shares to the session owner (you).</li>
                </ul>
              </Typography>
              <Typography color="error">
                You should know that if they still have the link for this session and you have not set "Require users to
                be added first." in the sesison settings they can still rejoin the session.
              </Typography>
            </>
          }
          onClose={() => setDeleteActiveUserOpen(false)}
          onConfirm={() => {
            removeSessionCrew(sessionUser?.owner?.scName as string)
            setDeleteActiveUserOpen(false)
          }}
        />
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

export interface props {
  user: SessionUser | PendingUser
}

export const PopupUserRoleChooser: React.FC<props> = ({ user }) => {
  const dataStore = React.useContext(LookupsContext)
  const isPending = !(user as SessionUser).ownerId
  const sessionUser = user as SessionUser

  const {
    session,
    captains,
    mySessionUser,
    isSessionAdmin,
    updatePendingUsers,
    updateSessionRole,
    updateShipRole,
    crewHierarchy,
  } = React.useContext(SessionContext)

  if (!dataStore.ready) return null

  const theirCaptain: SessionUser | null =
    user.captainId && crewHierarchy[user.captainId] ? captains.find((c) => c.ownerId === user.captainId) || null : null

  const isMe = !isPending && mySessionUser.ownerId === sessionUser.ownerId
  const meIsCaptain = !!crewHierarchy[mySessionUser?.ownerId]
  const myCrewCaptain = meIsCaptain ? mySessionUser?.ownerId : mySessionUser?.captainId

  const theyOnAnyCrew = Boolean(user?.captainId && crewHierarchy[user?.captainId])
  const theyOnMyCrew = theyOnAnyCrew && theirCaptain?.ownerId === myCrewCaptain

  let sessionRoleDisabled = true
  if (isSessionAdmin) sessionRoleDisabled = false
  else if (!session?.sessionSettings?.controlledSessionRole && isMe) sessionRoleDisabled = false

  let shipRoleDisabled = true
  if (isSessionAdmin) shipRoleDisabled = false
  else if (!session?.sessionSettings?.controlledShipRole && (isMe || theyOnMyCrew)) shipRoleDisabled = false

  return (
    <>
      {(user.sessionRole || user.shipRole || !sessionRoleDisabled || !shipRoleDisabled) && (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent={'space-around'}
          sx={{
            border: '1px solid #555555',
            pb: 2,
            my: 2,
          }}
        >
          {(user.sessionRole || !sessionRoleDisabled) && (
            <Box>
              <Typography variant="overline" color="primary" component="div">
                Session Role
              </Typography>
              <SessionRoleChooser
                onChange={(newRole) => {
                  if (isPending)
                    updatePendingUsers([
                      {
                        ...user,
                        sessionRole: newRole || null,
                      } as PendingUserInput,
                    ])
                  else updateSessionRole(sessionUser.ownerId, newRole || null)
                }}
                disabled={sessionRoleDisabled}
                value={user.sessionRole}
              />
            </Box>
          )}
          {(user.shipRole || !shipRoleDisabled) && (
            <Box>
              <Typography variant="overline" color="primary" component="div">
                Ship Role
              </Typography>
              <ShipRoleChooser
                onChange={(newRole) => {
                  if (isPending)
                    updatePendingUsers([
                      {
                        ...user,
                        shipRole: newRole || null,
                      } as PendingUserInput,
                    ])
                  else updateShipRole(sessionUser.ownerId, newRole || null)
                }}
                disabled={shipRoleDisabled}
                value={user.shipRole}
              />
            </Box>
          )}
        </Stack>
      )}
    </>
  )
}
