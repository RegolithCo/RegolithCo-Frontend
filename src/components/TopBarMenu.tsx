import * as React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Box, Divider, alpha, useTheme } from '@mui/material'
import { MenuItemType } from './TopBar'
import { yellow } from '@mui/material/colors'

export interface TopBarMenuProps {
  open?: boolean
  name?: string
  anchorEl?: HTMLElement | null
  menu: MenuItemType[]
  handleAction: (path?: string, action?: () => void) => void
  onClose?: () => void
}

export const TopBarMenu: React.FC<TopBarMenuProps> = ({ open, name, anchorEl, handleAction, onClose, menu }) => {
  const theme = useTheme()

  return (
    <Menu
      closeAfterTransition
      elevation={11}
      sx={{
        mt: 1.8,
        '& .MuiList-root': {
          py: 0,
        },
        '& .MuiPaper-root': {
          color: yellow[700],
          backgroundColor: alpha(theme.palette.secondary.contrastText, 1),
          border: `1px solid ${yellow[700]}`,
          borderTop: `none`,
        },
      }}
      disablePortal
      MenuListProps={{
        onMouseLeave: onClose,
        style: { pointerEvents: 'auto' },
      }}
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={Boolean(open)}
      onClose={onClose}
    >
      {menu
        .filter(({ show }) => show !== false)
        .map((item, idx) =>
          item.isDivider ? (
            <Divider
              key={`divider-${idx}`}
              sx={{
                border: `1px solid ${yellow[700]}`,
              }}
            />
          ) : (
            <TopBarMenuItem key={idx} item={item} handleAction={handleAction} />
          )
        )}
    </Menu>
  )
}

export interface TopBarMenuItemProps {
  item: MenuItemType
  indent?: number
  handleAction: (path?: string, action?: () => void) => void
}

export const TopBarMenuItem: React.FC<TopBarMenuItemProps> = ({ item, indent, handleAction }) => {
  const theme = useTheme()
  return (
    <MenuItem
      disabled={item.disabled}
      onClick={() => handleAction(item.path, item.action)}
      sx={{
        pr: 3,
        pl: theme.spacing((indent || 0) + 1 || 1),
        // color: indent ? theme.palette.secondary.light : undefined,
        // background: indent ? theme.palette.secondary.contrastText : undefined,
        '&:hover': {
          background: theme.palette.secondary.contrastText,
          color: theme.palette.secondary.light,
        },
      }}
    >
      <Box sx={{ display: 'inline', mr: 1 }}>{item.icon}</Box>
      {item.name}
    </MenuItem>
  )
}
