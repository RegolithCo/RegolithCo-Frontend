import { ArrowDropDown, GroupAdd } from '@mui/icons-material'
import {
  ButtonGroup,
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  useTheme,
} from '@mui/material'
import * as React from 'react'
import { CollaborateLinkIcon } from '../../icons/badges'

export interface AddUserButtonProps {
  disabled?: boolean
  onAdd?: () => void
  onInvite?: () => void
}

export const AddUserButton: React.FC<AddUserButtonProps> = ({ disabled, onAdd, onInvite }) => {
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }
    setOpen(false)
  }

  return (
    <React.Fragment>
      <ButtonGroup
        size="small"
        variant="contained"
        color="secondary"
        sx={{
          color: theme.palette.secondary.contrastText,
          backgroundColor: theme.palette.secondary.dark,
        }}
        ref={anchorRef}
        aria-label="split button"
        disabled={disabled}
      >
        <IconButton color="inherit" onClick={onAdd} size="small" disableRipple>
          <GroupAdd sx={{ height: 20, width: 20 }} />
        </IconButton>
        <IconButton color="inherit" size="small" onClick={handleToggle} disableRipple>
          <ArrowDropDown />
        </IconButton>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1000,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper elevation={11}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  <MenuItem onClick={onAdd} disableRipple>
                    <GroupAdd sx={{ mr: 2 }} />
                    Add usernames to session
                  </MenuItem>
                  <MenuItem onClick={onInvite} disableRipple>
                    <CollaborateLinkIcon sx={{ mr: 2 }} /> Invite users to join
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  )
}
