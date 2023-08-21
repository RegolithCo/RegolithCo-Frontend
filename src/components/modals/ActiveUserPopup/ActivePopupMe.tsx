import React, { useMemo } from 'react'
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material'
import { fontFamilies } from '../../../theme'
import {
  SessionUser,
  Vehicle,
  User,
  UserStateEnum,
  lookups,
  ScoutingFind,
  SessionUserStateEnum,
  MiningLoadout,
} from '@regolithco/common'
import { UserAvatar } from '../../UserAvatar'
import { Box } from '@mui/system'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { Cancel, RocketLaunch } from '@mui/icons-material'
dayjs.extend(relativeTime)

export interface ActivePopupMeProps {
  open: boolean
  onClose: () => void
  sessionUser: SessionUser
  loadouts: MiningLoadout[]
  scoutingMap: Map<string, ScoutingFind>
}

export const ActivePopupMe: React.FC<ActivePopupMeProps> = ({ open, onClose, sessionUser, loadouts, scoutingMap }) => {
  const theme = useTheme()

  const sortedShips: Vehicle[] = useMemo(() => {
    const newShips = [...lookups.shipLookups]
    newShips.sort((a, b) => {
      if (a.miningHold || b.miningHold) {
        return (b.miningHold || 0) - (a.miningHold || 0)
      }
      return (b.cargo || 0) - (a.cargo || 0)
    })
    return newShips
  }, [])

  const shipColorLookup: Record<string, string> = {
    Mining: theme.palette.secondary.main,
    Freight: theme.palette.primary.main,
    Transport: theme.palette.primary.main,
    Gunship: theme.palette.error.main,
    Fighter: theme.palette.error.main,
  }

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
          <ToggleButtonGroup value={sessionUser.state} fullWidth size="small">
            <ToggleButton value={SessionUserStateEnum.Unknown}>None</ToggleButton>
            <ToggleButton value={SessionUserStateEnum.RefineryRun}>Refinery Run</ToggleButton>
            <ToggleButton value={SessionUserStateEnum.Scouting}>Scouting</ToggleButton>
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
          <Autocomplete
            id="shipChooser"
            value={sessionUser.vehicle}
            renderOption={(props, ship) => (
              <MenuItem
                {...props}
                value={ship.code}
                sx={{
                  color: shipColorLookup[ship.role] || 'inherit',
                }}
              >
                {ship.name}
                <div style={{ flexGrow: 1 }} />
                <Typography variant="caption">
                  {ship.role} ({ship.miningHold || ship.cargo || '0'} SCU)
                </Typography>
              </MenuItem>
            )}
            clearOnBlur
            blurOnSelect
            fullWidth
            freeSolo
            getOptionLabel={(option) => {
              if (option === null) return ''
              if (typeof option === 'string') return option
              else return option.name + ` (${option.miningHold || option.cargo || '0'} SCU)`
            }}
            options={sortedShips}
            renderInput={(params) => <TextField {...params} label="Current Ship" />}
            onChange={(event, option) => {
              console.log('event', event, option)
            }}
          />
        </Box>

        <Box>
          <Typography variant="overline" color="primary" component="div">
            Current Vehicle Loadout
          </Typography>
          <Select
            fullWidth
            value={sessionUser.loadout?.name || ''}
            renderValue={(value) => {
              if (!value || value.length === 0 || value === 'none') return 'None'
              return value
            }}
            onChange={(e) => {
              console.log('e', e)
            }}
          >
            {sessionUser.loadout && <MenuItem value={sessionUser.loadout.name}>{sessionUser.loadout.name}</MenuItem>}
            <MenuItem value="none">None</MenuItem>
            {loadouts.map((loadout) => (
              <MenuItem key={loadout.loadoutId} value={loadout.loadoutId}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="overline" color="text.secondary">
                    {loadout.ship.toUpperCase()}
                  </Typography>
                  <Typography>{loadout.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(loadout?.activeLasers || [])
                      .reduce((acc, laser) => (laser?.laser ? [...acc, laser?.laser] : acc), [] as string[])
                      .filter((a) => !!a)
                      .join(' - ')}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" color="text.secondary">
            You can create a save named loadouts in the loadout calculator tool.
          </Typography>
        </Box>

        {/* Either a list of MY Crew (if there are any) or specify whose crew I am on */}
        <Typography>{sessionUser.pilotSCName ? `Crew of: ${sessionUser.pilotSCName}` : 'No crew'}</Typography>

        <Typography variant="overline" color="primary" component="div">
          Actions
        </Typography>
        <ButtonGroup variant="contained" color="error" aria-label="contained primary button group">
          {sessionUser.pilotSCName && <Button startIcon={<RocketLaunch />}>Leave USERNAME's Crew</Button>}
          <Button color="error" startIcon={<Cancel />}>
            Leave Session
          </Button>
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
