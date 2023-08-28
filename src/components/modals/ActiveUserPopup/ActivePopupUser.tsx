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
import { lookups, SessionUser, User, UserStateEnum } from '@regolithco/common'
import { UserAvatar } from '../../UserAvatar'
import { Box } from '@mui/system'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
dayjs.extend(relativeTime)

export interface ActivePopupUserProps {
  open: boolean
  onClose: () => void
  sessionUser: SessionUser
}

export const ActivePopupUser: React.FC<ActivePopupUserProps> = ({ open, onClose, sessionUser }) => {
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
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          position: 'relative',
          fontFamily: fontFamilies.robotoMono,
          fontWeight: 'bold',
          display: 'flex',
          flexDirection: 'column',
          pl: 14,
          mb: 2,
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
          <UserAvatar size="xlarge" user={sessionUser?.owner as User} />
        </Box>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 6 }}>
          <Typography variant="h4">{sessionUser.owner?.scName}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="overline" color="secondary.contrastText">
            ({sessionUser?.owner?.state === UserStateEnum.Verified ? 'Verified User' : 'Unverified User'})
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography variant="overline" color="primary" component="div">
          Status
        </Typography>
        <Typography>{sessionUser.isPilot ? 'Pilot' : 'Crew'}</Typography>
        <Typography>last active {dayjs(sessionUser.updatedAt).fromNow()}</Typography>
        {sessionUser.loadout && (
          <Typography>
            Loadout:
            {sessionUser.loadout.name}
          </Typography>
        )}
        <Typography>Vehicle: {vehicle?.name || 'UNKNOWN'}</Typography>
        {/* Either a list of MY Crew (if there are any) or specify whose crew I am on */}
        <Typography>{sessionUser.captainId ? `Crew of: ${sessionUser.captainId}` : 'No crew'}</Typography>

        <Typography>State: {sessionUser.state}</Typography>

        <Typography variant="overline" color="primary" component="div">
          {sessionUser?.owner?.state === UserStateEnum.Verified ? 'Verified' : 'Unverified'}
        </Typography>

        <Box>
          <Typography variant="overline" color="primary" component="div">
            Current Vehicle
          </Typography>
          <Typography>
            {vehicle?.name} ({vehicle?.maker})
          </Typography>
        </Box>

        <Typography variant="overline" color="primary" component="div">
          Actions
        </Typography>
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          <Button>Add to Crew</Button>
          <Button>Remove from Crew</Button>
          <Button>Add to Friend List</Button>
          <Button>Remove From Friend List</Button>
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
