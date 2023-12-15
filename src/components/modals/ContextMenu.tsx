import * as React from 'react'

import { ListItemIcon, ListItemText, Menu, MenuItem, Typography, useTheme } from '@mui/material'

export type menuItemObj = {
  icon?: React.ReactNode
  label: string
  onClick?: () => void
  color?: string
  disabled?: boolean
  divider?: boolean
  hotKey?: string
}

export type UseContextMenuProps = {
  header?: React.ReactNode
  menuItems?: menuItemObj[]
}

export type ContextMenuProps = UseContextMenuProps & {
  open: boolean
  menuPos: [number, number] | null
  onClose: () => void
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ header, menuItems, onClose, open, menuPos }) => {
  const theme = useTheme()
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={open && menuPos !== null ? { top: menuPos[1], left: menuPos[0] } : undefined}
      // anchorPosition={{ top: 50, left: 50 }}
      sx={{
        '& .MuiPaper-root': {
          minWidth: 200,
          p: 0,
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
      {header && (
        <Typography
          variant="overline"
          component="div"
          sx={{ px: 2, py: 0, background: theme.palette.secondary.dark, color: theme.palette.secondary.contrastText }}
        >
          {header}
        </Typography>
      )}
      {menuItems?.map((item, index) => (
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
      ))}
    </Menu>
  )
}

export const useContextMenu = (menuProps: UseContextMenuProps) => {
  const [contextMenu, setContextMenu] = React.useState<[number, number] | null>(null)

  const handleContextMenu = (event: React.MouseEvent) => {
    console.log('handleContextMenu')
    event.preventDefault()
    setContextMenu(
      contextMenu === null
        ? [event.clientX + 2, event.clientY - 6]
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    )
  }
  const handleClose = () => {
    setContextMenu(null)
  }
  return {
    handleContextMenu,
    handleClose,
    contextMenuNode: (
      <ContextMenu {...menuProps} menuPos={contextMenu} open={contextMenu !== null} onClose={handleClose} />
    ),
  }
}
