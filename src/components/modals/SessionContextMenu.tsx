import * as React from 'react'

import { Avatar, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Typography, useTheme } from '@mui/material'

export type MenuItemObj = {
  icon?: React.ReactNode
  isHeader?: boolean
  label?: string
  onClick?: () => void
  color?: string
  disabled?: boolean
  divider?: boolean
  hotKey?: React.ReactNode
}

export type UseContextMenuProps = {
  header?: React.ReactNode
  headerColor?: string
  headerAvatar?: React.ReactNode
  menuItems?: MenuItemObj[]
}

export type SessionContextMenuProps = UseContextMenuProps & {
  open: boolean
  menuPosXY?: [number, number]
  onClose: () => void
}

export const SessionContextMenu: React.FC<SessionContextMenuProps> = ({
  header,
  menuItems,
  headerColor,
  headerAvatar,
  onClose,
  open,
  menuPosXY = [100, 100],
}) => {
  const theme = useTheme()

  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={open && menuPosXY !== null ? { top: menuPosXY[1], left: menuPosXY[0] } : undefined}
      // anchorPosition={{ top: 50, left: 50 }}
      sx={{
        '& .MuiPaper-root': {
          minWidth: 200,
          p: 0,
          overflow: 'visible',
          background: theme.palette.background.default,
          boxShadow: theme.shadows[12],
          // border: `1px solid ${theme.palette.secondary.dark}`,
          // borderRadius: 2,
        },
        '& .MuiList-root': {
          p: 0,
        },
      }}
    >
      {headerAvatar && (
        <Avatar
          sx={{
            width: 48,
            height: 48,
            position: 'absolute',
            top: -12,
            left: -24,
            background: headerColor || theme.palette.primary.main,
          }}
        >
          {headerAvatar}
        </Avatar>
      )}
      {header && (
        <Typography
          variant="overline"
          component="div"
          sx={{
            px: 2,
            py: 0,
            pl: headerAvatar ? 4 : 2,
            fontWeight: 'bold',
            background: headerColor || theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          {header}
        </Typography>
      )}
      {menuItems?.map((item, index) => {
        if (item.divider && !item.label) return <Divider key={index} />
        if (item.isHeader)
          return (
            <Typography
              key={index}
              variant="overline"
              component="div"
              sx={{
                px: 2,
                py: 0,
                pl: 2,
                fontWeight: 'bold',
                background: headerColor || theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              {item.label}
            </Typography>
          )
        return (
          <MenuItem
            key={index}
            onClick={() => {
              item.onClick && item.onClick()
              onClose && onClose()
            }}
            disabled={item.disabled}
            divider={item.divider}
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText primaryTypographyProps={{ color: item.color }}>{item.label}</ListItemText>
            {item.hotKey && (
              <Typography variant="body2" color="text.secondary">
                {item.hotKey}
              </Typography>
            )}
          </MenuItem>
        )
      })}
    </Menu>
  )
}

export const useSessionContextMenu = (menuProps: UseContextMenuProps) => {
  const [menuPosXY, setContextMenu] = React.useState<[number, number] | null>(null)

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    if (menuPosXY !== null) {
      // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
      // Other native context menus might behave different.
      // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
      return setContextMenu(null)
    }
    setContextMenu(menuPosXY === null ? [event.clientX + 2, event.clientY - 6] : null)
  }
  const handleClose = () => {
    setContextMenu(null)
  }
  return {
    handleContextMenu,
    handleClose,
    contextMenuNode: (
      <SessionContextMenu
        {...menuProps}
        menuPosXY={menuPosXY || undefined}
        open={menuPosXY !== null}
        onClose={handleClose}
      />
    ),
  }
}
