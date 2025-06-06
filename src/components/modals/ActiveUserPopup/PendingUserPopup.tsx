import * as React from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  Box,
} from '@mui/material'
import { fontFamilies } from '../../../theme'
import { PendingUser, PendingUserInput, SessionUser, ShipLookups } from '@regolithco/common'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { UserAvatar } from '../../UserAvatar'
import {
  Cancel,
  CheckCircle,
  DeleteForever,
  ExpandMore,
  GroupAdd,
  GroupRemove,
  Info,
  Logout,
  RocketLaunch,
} from '@mui/icons-material'
import { SessionContext } from '../../../context/session.context'
import { AppContext } from '../../../context/app.context'
import { LookupsContext } from '../../../context/lookupsContext'
import { PopupUserRoleChooser } from './ActivePopupUser'
import { DeleteModal } from '../DeleteModal'
dayjs.extend(relativeTime)

export interface PendingUserPopupProps {
  open: boolean
  onClose: () => void
  pendingUser: PendingUser
}

export const PendingUserPopup: React.FC<PendingUserPopupProps> = ({ open, onClose, pendingUser }) => {
  const theme = useTheme()
  const { getSafeName } = React.useContext(AppContext)
  const [deletePendingUsersOpen, setDeletePendingUserOpen] = React.useState(false)

  const dataStore = React.useContext(LookupsContext)
  const {
    session,
    captains,
    isSessionAdmin,
    mySessionUser,
    myUserProfile,
    addFriend,
    removeSessionMentions,
    removeFriend,
    updatePendingUsers,
    crewHierarchy,
  } = React.useContext(SessionContext)

  if (!dataStore.ready) return null

  const shipLookups = dataStore.getLookup('shipLookups') as ShipLookups
  const theirCaptain: SessionUser | null =
    pendingUser.captainId && crewHierarchy[pendingUser.captainId]
      ? captains.find((c) => c.ownerId === pendingUser.captainId) || null
      : null

  // NO HOOKS BELOW HERe

  const theirCaptainId = pendingUser?.captainId && crewHierarchy[pendingUser?.captainId] ? pendingUser?.captainId : null
  const vehicleCode = theirCaptain?.vehicleCode
  const vehicle = vehicleCode ? shipLookups.find((s) => s.UEXID === vehicleCode) : null

  const isMyFriend = myUserProfile?.friends?.includes(pendingUser.scName as string)
  const meIsPotentialCaptain = !mySessionUser?.captainId || !crewHierarchy[mySessionUser?.captainId]

  const theirCaptainScName = captains.find((c) => c.ownerId === theirCaptainId)?.owner?.scName
  const iAmOnCrew = !!mySessionUser?.captainId && !!crewHierarchy[mySessionUser?.captainId]
  const myCrewCaptainId = iAmOnCrew ? mySessionUser?.captainId : undefined

  const theyOnAnyCrew = Boolean(pendingUser?.captainId && crewHierarchy[pendingUser?.captainId])

  const iAmTheirCaptain = theirCaptainId === mySessionUser?.ownerId
  const theyOnMyCrew = theyOnAnyCrew && (iAmTheirCaptain || theirCaptainId === myCrewCaptainId)

  // let sessionRoleDisabled = true
  // if (isSessionAdmin || !session?.sessionSettings?.controlledSessionRole) sessionRoleDisabled = false

  // let shipRoleDisabled = true
  // if (isSessionAdmin) shipRoleDisabled = false
  // else if (!session?.sessionSettings?.controlledShipRole && iAmTheirCaptain) shipRoleDisabled = false

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
          <Typography variant="h4">{getSafeName(pendingUser.scName)}</Typography>
          <Box sx={{ flexGrow: 1 }} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography>Pending User</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {theirCaptain ? (
          <Typography variant="overline" color="primary" component="div">
            <strong>Status</strong>: member of <strong>{getSafeName(theirCaptain?.owner?.scName)}'s</strong> crew
          </Typography>
        ) : (
          <Typography variant="overline" color="primary" component="div">
            Status: not on a crew
          </Typography>
        )}

        <PopupUserRoleChooser user={pendingUser} />

        {vehicle && theirCaptain && (
          <Box>
            <Typography variant="overline" color="primary" component="div">
              Current Vehicle
            </Typography>

            <Typography variant="caption" color="text.secondary">
              <strong>{getSafeName(theirCaptain.owner?.scName)}'s</strong> crew is using a {vehicle?.name} (
              {vehicle?.miningHold || vehicle?.cargo} SCU)
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="overline" color="primary" component="div">
            Actions:
          </Typography>
          <ButtonGroup fullWidth variant="text" color="info" orientation="vertical">
            {(meIsPotentialCaptain || iAmOnCrew) && !theyOnAnyCrew && (
              <Button
                startIcon={<RocketLaunch />}
                onClick={() => {
                  updatePendingUsers([
                    {
                      ...pendingUser,
                      captainId: myCrewCaptainId || mySessionUser.ownerId,
                    } as PendingUserInput,
                  ])
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
                  updatePendingUsers([{ ...pendingUser, captainId: null } as PendingUserInput])
                }}
              >
                Remove from {iAmTheirCaptain ? 'my' : getSafeName(theirCaptainScName) + "'s"} crew
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
            {isSessionAdmin && (
              <Button
                startIcon={<DeleteForever />}
                color="error"
                onClick={() => {
                  setDeletePendingUserOpen(true)
                }}
              >
                Delete {getSafeName(pendingUser.scName)} from session
              </Button>
            )}
          </ButtonGroup>
        </Box>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Info />
            <Typography variant="overline">What is a "pending" user?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="caption" component="div" gutterBottom>
              Pending users have been added to the session or one of its work orders but have not yet logged in and
              joined.
            </Typography>
            <Typography variant="caption" component="div" gutterBottom>
              They are added to the session automatically when you add them to a work order or manually using the ADD
              button at the top of the members list.
            </Typography>
            <Typography variant="caption" component="div" gutterBottom>
              You can set your session to only allow pending users to join and use this as a sort of "invite only" list
              to prevent random people with the share URL from joining.
            </Typography>
            <Typography variant="subtitle1" component="p" gutterBottom>
              <CheckCircle color="success" sx={{ mr: 1 }} />
              Pending users CAN
            </Typography>
            <Typography variant="caption" component="div" gutterBottom>
              <ul>
                <li>Be on your crew.</li>
                <li>Be mentioned in work orders.</li>
                <li>Be on your friend list.</li>
                <li>
                  Become <strong>active users</strong> when they log in and join your session.
                </li>
              </ul>
            </Typography>
            <Typography variant="subtitle1" component="p" gutterBottom>
              <Cancel color="error" sx={{ mr: 1 }} />
              Pending users CANNOT
            </Typography>
            <Typography variant="caption" component="div" gutterBottom>
              <ul>
                <li>Be captains of a crew.</li>
                <li>Create work orders or scouting finds.</li>
              </ul>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </DialogContent>

      <DialogActions>
        <div style={{ flexGrow: 1 }} />
        <Button color="info" onClick={onClose}>
          Dismiss
        </Button>
      </DialogActions>

      {/* Modal for deleting pedning users from the session */}
      <DeleteModal
        open={deletePendingUsersOpen}
        title={`Delete ${pendingUser?.scName} from session?`}
        message={`Are you sure you want to delete ${pendingUser?.scName} from the session? This will also remove any of their work order shares.`}
        onClose={() => setDeletePendingUserOpen(false)}
        onConfirm={() => {
          removeSessionMentions([pendingUser?.scName as string])
          setDeletePendingUserOpen(false)
        }}
      />
    </Dialog>
  )
}
