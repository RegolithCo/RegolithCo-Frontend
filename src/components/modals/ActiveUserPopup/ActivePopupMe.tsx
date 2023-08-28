import React from 'react'
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material'
import { fontFamilies } from '../../../theme'
import {
  SessionUser,
  User,
  ScoutingFind,
  SessionUserStateEnum,
  MiningLoadout,
  lookups,
  SessionUserInput,
} from '@regolithco/common'
import { UserAvatar } from '../../UserAvatar'
import { Box } from '@mui/system'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { Cancel, RocketLaunch } from '@mui/icons-material'
import { VehicleChooser } from '../../fields/VehicleChooser'
import { LoadoutSelect } from '../../fields/LoadoutSelect'
dayjs.extend(relativeTime)

export interface ActivePopupMeProps {
  open: boolean
  onClose: () => void
  onChange: (newSessionUser: SessionUserInput) => void
  sessionUser: SessionUser
  loadouts: MiningLoadout[]
  scoutingMap: Map<string, ScoutingFind>
}

export const ActivePopupMe: React.FC<ActivePopupMeProps> = ({
  open,
  onClose,
  sessionUser,
  loadouts,
  onChange,
  scoutingMap,
}) => {
  const theme = useTheme()

  const vehicle = sessionUser.vehicleCode ? lookups.shipLookups.find((s) => s.code === sessionUser.vehicleCode) : null
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
          <UserAvatar size="xlarge" user={sessionUser?.owner as User} />
        </Box>
        <Stack direction="row" spacing={2} alignItems="baseline">
          <Typography variant="h4">{sessionUser.owner?.scName}</Typography>
          <Typography variant="caption">(You)</Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography>last session activity {dayjs(sessionUser.updatedAt).fromNow()}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Typography variant="overline" color="primary" component="div">
            Your Status: {sessionUser.state}
          </Typography>
          <ToggleButtonGroup
            value={sessionUser.state}
            fullWidth
            exclusive
            size="small"
            onChange={(e, state) => {
              if (!state) return
              onChange({
                isPilot: sessionUser.isPilot,
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
            The 'en-route' and 'on site' status is set by opening a scouting find.
          </Typography>
        </Box>

        <Typography>{sessionUser.isPilot ? 'Pilot' : 'Crew'}</Typography>
        <Box>
          <Typography variant="overline" color="primary" component="div">
            Current Vehicle
          </Typography>
          <VehicleChooser
            vehicle={vehicle?.code}
            onChange={(vehicleCode) => {
              onChange({
                isPilot: true,
                vehicleCode: vehicleCode,
              })
            }}
          />
        </Box>

        <Box>
          <Typography variant="overline" color="primary" component="div">
            Current Vehicle Loadout
          </Typography>
          <LoadoutSelect
            loadouts={loadouts}
            sessionUser={sessionUser}
            disabled={Boolean(!vehicle || !vehicle.miningHold || vehicle.miningHold < 20)}
            onChange={(loadoutId) => {
              onChange({
                loadoutId,
              })
            }}
          />
          <Typography variant="caption" color="text.secondary">
            You can create a save named loadouts in the loadout calculator tool.
          </Typography>
        </Box>

        {/* Either a list of MY Crew (if there are any) or specify whose crew I am on */}
        <Typography>{sessionUser.captainId ? `Crew of: ${sessionUser.captainId}` : 'No crew'}</Typography>

        <Typography variant="overline" color="primary" component="div">
          Actions
        </Typography>
        <ButtonGroup variant="contained" color="error" aria-label="contained primary button group">
          {sessionUser.captainId && <Button startIcon={<RocketLaunch />}>Leave USERNAME's Crew</Button>}
          {sessionUser.ownerId !== sessionUser.ownerId && (
            <Button color="error" startIcon={<Cancel />}>
              Leave Session
            </Button>
          )}
        </ButtonGroup>
      </DialogContent>
      <DialogActions>
        <div style={{ flexGrow: 1 }} />
        <Button color="primary" onClick={onClose}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}
