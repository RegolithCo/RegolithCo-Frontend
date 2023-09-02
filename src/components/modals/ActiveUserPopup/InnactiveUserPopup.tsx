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
import { InnactiveUser } from '@regolithco/common'
import { Box } from '@mui/system'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
dayjs.extend(relativeTime)

export interface InnactiveUserPopupProps {
  open: boolean
  onClose: () => void
  innactiveUser: InnactiveUser
}

export const InnactiveUserPopup: React.FC<InnactiveUserPopupProps> = ({ open, onClose, innactiveUser }) => {
  const theme = useTheme()

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
          {/* <UserAvatar size="xlarge" user={sessionUser?.owner as User} /> */}
        </Box>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 6 }}>
          <Typography variant="h4">{innactiveUser.scName}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="overline" color="secondary.contrastText">
            Innactive User
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography variant="overline" color="primary" component="div">
          Status
        </Typography>
        <Typography>{innactiveUser.captainId ? 'Crew' : 'Pilot'}</Typography>
        {/* Either a list of MY Crew (if there are any) or specify whose crew I am on */}
        <Typography>{innactiveUser.captainId ? `Crew of: ${innactiveUser.captainId}` : 'No crew'}</Typography>

        <Typography variant="overline" color="primary" component="div">
          Actions
        </Typography>
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          <Button>Add to Crew</Button>
          {/* TODO: Maybe a button with a dropdown chevron to pick an available user */}
          <Button>Add to My Crew</Button>
          <Button>Remove from Crew</Button>

          <Button>Add to Friend List</Button>
          <Button>Remove From Friend List</Button>
          <Button>Delete User</Button>
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
