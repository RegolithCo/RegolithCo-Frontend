import * as React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Box, Divider, alpha, useTheme } from '@mui/material'
import { MenuItemType } from './TopBar'
import { yellow } from '@mui/material/colors'
import { fontSize } from '@mui/system'

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
  isMobile?: boolean
  isSubMenu?: boolean
  handleAction: (path?: string, action?: () => void) => void
}

export const TopBarMenuItem: React.FC<TopBarMenuItemProps> = ({ item, isMobile, isSubMenu, handleAction }) => {
  const theme = useTheme()
  const isMobileSubMenu = isMobile && isSubMenu
  return (
    <MenuItem
      disabled={item.disabled}
      onClick={() => handleAction(item.path, item.action)}
      sx={{
        pr: 3,
        fontSize: isMobileSubMenu ? '0.8rem' : undefined,
        pl: theme.spacing((isMobileSubMenu ? 3 : 0) + 1 || 1),
        minHeight: isMobileSubMenu ? '1.5rem' : undefined,
        borderTop: isMobile && !isSubMenu ? `1px solid ${theme.palette.secondary.contrastText}` : undefined,
        // color: indent ? theme.palette.secondary.light : undefined,
        // background: indent ? theme.palette.secondary.contrastText : undefined,
        // color: isMobileSubMenu ? theme.palette.primary.contrastText : undefined,
        // background: isMobileSubMenu ? theme.palette.primary.light : undefined,
        '&:hover': {
          background: theme.palette.secondary.contrastText,
          color: theme.palette.secondary.light,
        },
      }}
    >
      <Box
        sx={{
          display: 'inline',
          mr: 1,
          '& svg': {
            color: isMobileSubMenu ? theme.palette.primary.contrastText : undefined,
            fontSize: isMobileSubMenu ? '0.8rem' : undefined,
          },
        }}
      >
        {item.icon}
      </Box>
      {item.name}
    </MenuItem>
  )
}
