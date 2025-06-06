import React from 'react'
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
  Box,
} from '@mui/material'
import { fontFamilies } from '../../../theme'
import { User, SessionUserStateEnum, SessionUser, SessionStateEnum, ShipLookups } from '@regolithco/common'
import { UserAvatar } from '../../UserAvatar'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { Cancel, Delete, Logout } from '@mui/icons-material'
import { VehicleChooser } from '../../fields/VehicleChooser'
import { LoadoutSelect } from '../../fields/LoadoutSelect'
import { DialogEnum, SessionContext } from '../../../context/session.context'
import { AppContext } from '../../../context/app.context'
import { LookupsContext } from '../../../context/lookupsContext'
import { PopupUserRoleChooser } from './ActivePopupUser'
dayjs.extend(relativeTime)

export interface ActivePopupMeProps {
  open: boolean
  onClose: () => void
}

export const ActivePopupMe: React.FC<ActivePopupMeProps> = ({ open, onClose }) => {
  const theme = useTheme()
  const { getSafeName, hideNames } = React.useContext(AppContext)
  const dataStore = React.useContext(LookupsContext)
  const { session, mySessionUser, updateMySessionUser, myUserProfile, captains, crewHierarchy, setActiveModal } =
    React.useContext(SessionContext)

  if (!dataStore.ready) return null

  const shipLookups = dataStore.getLookup('shipLookups') as ShipLookups

  const sessionActive = session?.state === SessionStateEnum.Active
  const myCaptain: SessionUser | null =
    mySessionUser.captainId && crewHierarchy[mySessionUser.captainId]
      ? captains.find((c) => c.ownerId === mySessionUser.captainId) || null
      : null
  const iAmCaptain: boolean =
    (!mySessionUser.captainId || !crewHierarchy[mySessionUser.captainId]) &&
    Boolean(crewHierarchy[mySessionUser.ownerId])

  const vehicleCode = myCaptain?.vehicleCode || mySessionUser.vehicleCode
  const vehicle = vehicleCode ? shipLookups.find((s) => s.UEXID === vehicleCode) : null
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 10,
          boxShadow: `0px 0px 20px 5px ${theme.palette.info.main}, 0px 0px 60px 40px black`,
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
          backgroundColor: theme.palette.info.main,
          color: theme.palette.info.contrastText,
          pl: 14,
          mb: 2,
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
          <UserAvatar size="xlarge" user={mySessionUser?.owner as User} privacy={hideNames} />
        </Box>
        <Stack direction="row" spacing={2} alignItems="baseline">
          <Typography variant="h4">{getSafeName(mySessionUser.owner?.scName)}</Typography>
          <Typography variant="caption">(You)</Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography>last session activity: {dayjs(mySessionUser.updatedAt).fromNow()}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Typography variant="overline" color="primary" component="div">
            Your Status: <strong>{mySessionUser.state}</strong>{' '}
            {mySessionUser.captainId && crewHierarchy[mySessionUser.captainId] ? (
              <span>
                on <strong>{getSafeName(myCaptain?.owner?.scName)}'s</strong> crew
              </span>
            ) : (
              ''
            )}
          </Typography>
          <ToggleButtonGroup
            value={mySessionUser.state}
            fullWidth
            exclusive
            disabled={!sessionActive}
            size="small"
            onChange={(e, state) => {
              if (!state || !sessionActive) return
              updateMySessionUser({
                isPilot: mySessionUser.isPilot,
                state: state as SessionUserStateEnum,
              })
            }}
          >
            <ToggleButton value={SessionUserStateEnum.Unknown} color="error">
              None
            </ToggleButton>
            <ToggleButton value={SessionUserStateEnum.RefineryRun} color="primary">
              Refinery Run
            </ToggleButton>
            <ToggleButton value={SessionUserStateEnum.Scouting} color="info">
              Scouting
            </ToggleButton>
            <ToggleButton value={SessionUserStateEnum.Afk}>AFK</ToggleButton>
            {/* <ToggleButton value={SessionUserStateEnum.Travelling} disabled>
              En Route
            </ToggleButton>
            <ToggleButton value={SessionUserStateEnum.OnSite} disabled>
              On Site
            </ToggleButton> */}
          </ToggleButtonGroup>
          <Typography variant="caption" color="text.secondary">
            The 'en-route' and 'on site' statuses are set by interacting with a scouting find.
          </Typography>
        </Box>

        <PopupUserRoleChooser user={mySessionUser} />

        <Box>
          <Typography variant="overline" color="primary" component="div">
            Current Vehicle
          </Typography>

          {!myCaptain ? (
            <VehicleChooser
              vehicle={vehicle?.UEXID}
              disabled={Boolean(!sessionActive)}
              onChange={(vehicle) => {
                updateMySessionUser({
                  isPilot: true,
                  vehicleCode: vehicle?.UEXID,
                })
              }}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">
              {vehicle ? (
                <>
                  <strong>{getSafeName(myCaptain.owner?.scName)}'s</strong> crew is using a {vehicle?.name} (
                  {vehicle?.miningHold || vehicle?.cargo} SCU)
                </>
              ) : (
                <>
                  <strong>{getSafeName(myCaptain.owner?.scName)}'s</strong> does not have a vehicle selected.
                </>
              )}
            </Typography>
          )}
        </Box>

        <Box>
          <Typography variant="overline" color="primary" component="div">
            Current Vehicle Loadout
          </Typography>
          {!myCaptain && (
            <LoadoutSelect
              loadouts={myUserProfile.loadouts}
              sessionUser={mySessionUser}
              disabled={!sessionActive || Boolean(!vehicle || !vehicle.miningHold || vehicle.miningHold < 20)}
              onChange={(loadoutId) => {
                updateMySessionUser({
                  loadoutId,
                })
              }}
            />
          )}
          <Typography variant="caption" color="text.secondary">
            {!myCaptain
              ? 'You can create named loadouts in the loadout calculator tool.'
              : 'Not available to crew members.'}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {myCaptain && (
          <Box>
            <ButtonGroup variant="text" color="error" aria-label="contained primary button group" fullWidth>
              <Button
                startIcon={<Logout />}
                onClick={() => {
                  updateMySessionUser({
                    captainId: null,
                  })
                }}
              >
                Leave {getSafeName(myCaptain.owner?.scName)}'s Crew
              </Button>

              {mySessionUser.ownerId !== mySessionUser.ownerId && (
                <Button color="error" startIcon={<Cancel />} onClick={() => setActiveModal(DialogEnum.LEAVE_SESSION)}>
                  Leave Session
                </Button>
              )}
            </ButtonGroup>
          </Box>
        )}
        {iAmCaptain && (
          <Button
            startIcon={<Delete />}
            color="error"
            fullWidth
            variant="outlined"
            onClick={() => {
              setActiveModal(DialogEnum.DISBAND_CREW)
            }}
          >
            Disband Crew
          </Button>
        )}
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
