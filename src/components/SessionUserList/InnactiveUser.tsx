import React, { useEffect } from 'react'
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { InnactiveUser } from '@regolithco/common'
import { MoreVert } from '@mui/icons-material'
import { useTheme } from '@mui/system'
import { SessionContext } from '../../context/session.context'

export interface InnactiveUserRowProps {
  innactiveUser: InnactiveUser
}

export const InnactiveUserRow: React.FC<InnactiveUserRowProps> = ({ innactiveUser }) => {
  const theme = useTheme()
  const { openInnactiveUserModal } = React.useContext(SessionContext)

  const [contextMenuEl, setContextMenuEl] = React.useState<HTMLElement | null>(null)
  useEffect(() => {
    // define a custom handler function
    // for the contextmenu event
    const handleContextMenu = (event: MouseEvent) => {
      // prevent the right-click menu from appearing
      event.preventDefault()
    }

    // attach the event listener to
    // the document object
    document.addEventListener('contextmenu', handleContextMenu)

    // clean up the event listener when
    // the component unmounts
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  return (
    <ListItem
      onContextMenu={(e) => {
        e.preventDefault()
        setContextMenuEl(e.currentTarget)
      }}
      onDoubleClick={(e) => {
        e.preventDefault()
        openInnactiveUserModal(innactiveUser.scName)
      }}
      onClick={() => {
        openInnactiveUserModal(innactiveUser.scName)
      }}
      sx={{
        cursor: 'pointer',
      }}
    >
      <ListItemAvatar>
        {/* <UserAvatar size="small" user={user} isFriend={friends?.includes(user?.scName as string)} /> */}
      </ListItemAvatar>

      <ListItemText
        sx={{
          '& .MuiListItemText-secondary': {
            fontSize: '0.7rem',
          },
          //
        }}
        primary={innactiveUser.scName}
        secondaryTypographyProps={{
          component: 'div',
        }}
        secondary={
          <Stack direction="row" spacing={1}>
            <Typography>Innactive User</Typography>
          </Stack>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          color="primary"
          onClick={(e) => {
            e.stopPropagation()
            setContextMenuEl(e.currentTarget)
          }}
        >
          <MoreVert />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
