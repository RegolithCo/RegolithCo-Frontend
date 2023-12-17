import * as React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Box, Divider, alpha, useTheme } from '@mui/material'
import { MenuItemType } from './TopBar'
import { yellow } from '@mui/material/colors'
import { Link } from 'react-router-dom'

export interface TopBarMenuProps {
  open?: boolean
  name?: string
  anchorEl?: HTMLElement | null
  anchorWidth?: number | null
  anchorAlign?: 'left' | 'right'
  menu: MenuItemType[]
  onClose?: () => void
}

export const TopBarMenu: React.FC<TopBarMenuProps> = ({
  open,
  name,
  anchorEl,
  anchorWidth,
  anchorAlign,
  onClose,
  menu,
}) => {
  const theme = useTheme()

  return (
    <Menu
      closeAfterTransition
      elevation={11}
      onMouseMove={onClose}
      onClick={onClose}
      sx={{
        // border: '10px solid red',
        '& .MuiList-root': {
          py: 0,
        },
        '& .MuiPaper-root': {
          color: yellow[700],
          overflow: 'visible',
          backgroundColor: alpha(theme.palette.secondary.contrastText, 1),
          border: `1px solid ${yellow[700]}`,
          borderTop: `none`,
        },
      }}
      MenuListProps={{
        onMouseLeave: onClose,
        onMouseMove: (e) => {
          e.stopPropagation()
        },
        style: { pointerEvents: 'auto' },
      }}
      id="menu-appbar"
      anchorEl={anchorEl || undefined}
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
      <Box
        sx={{
          width: anchorWidth,
          height: 64,
          // border: `3px solid red`,
          position: 'absolute',
          // Put this exactly above the menu
          top: -63,
          // Move it to the left or right
          left: !anchorAlign || anchorAlign === 'left' ? 0 : undefined,
          right: anchorAlign === 'right' ? 0 : undefined,
        }}
      />
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
            <TopBarMenuItem key={idx} item={item} />
          )
        )}
    </Menu>
  )
}

export interface TopBarMenuItemProps {
  item: MenuItemType
  isMobile?: boolean
  isSubMenu?: boolean
}

const LinkWrapper = ({ item, children }: TopBarMenuItemProps & React.PropsWithChildren) => {
  if (!item.path) return <>{children}</>
  return (
    <Link
      to={item.path}
      style={{
        // Center items vertically
        width: '100%',
        // border: '1px solid green',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      {children}
    </Link>
  )
}

export const TopBarMenuItem: React.FC<TopBarMenuItemProps> = ({ item, isMobile, isSubMenu }) => {
  const theme = useTheme()
  const isMobileSubMenu = isMobile && isSubMenu
  return (
    <MenuItem
      disabled={item.disabled}
      onClick={() => {
        if (item.disabled || !item.action) return
        item.action()
      }}
      sx={{
        p: 0,
        m: 0,
        borderTop: isMobile && !isSubMenu ? `1px solid ${theme.palette.secondary.contrastText}` : undefined,
        '&:hover': {
          background: theme.palette.secondary.contrastText,
          color: theme.palette.secondary.light,
        },
      }}
    >
      <LinkWrapper item={item}>
        <Box
          sx={{
            py: 1,
            px: 1,
            pr: 3,
            fontSize: isMobileSubMenu ? '0.8rem' : undefined,
            pl: theme.spacing((isMobileSubMenu ? 3 : 0) + 1 || 1),
            minHeight: isMobileSubMenu ? '1.5rem' : undefined,
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <Box
            sx={{
              display: 'inline',
              color: 'inherit',
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
        </Box>
      </LinkWrapper>
    </MenuItem>
  )
}
