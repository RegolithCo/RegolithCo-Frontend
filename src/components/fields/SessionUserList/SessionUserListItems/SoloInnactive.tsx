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
import { PendingUser } from '@regolithco/common'
import { MoreVert } from '@mui/icons-material'
import { useTheme } from '@mui/system'
import { SessionContext } from '../../../../context/session.context'
import { UserAvatar } from '../../../UserAvatar'
import { fontFamilies } from '../../../../theme'

export interface SoloInnactiveProps {
  pendingUser: PendingUser
  openContextMenu: (e: HTMLElement) => void
}

export const SoloInnactive: React.FC<SoloInnactiveProps> = ({ pendingUser, openContextMenu }) => {
  const theme = useTheme()
  const { openPendingUserModal, myUserProfile } = React.useContext(SessionContext)
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
        openContextMenu(e.currentTarget)
      }}
      onDoubleClick={(e) => {
        e.preventDefault()
        openPendingUserModal(pendingUser.scName)
      }}
      onClick={() => {
        openPendingUserModal(pendingUser.scName)
      }}
      sx={{
        background: '#15163455',
        cursor: 'pointer',
      }}
    >
      <ListItemAvatar>
        <UserAvatar
          size="small"
          pendingUser={pendingUser}
          isFriend={myUserProfile.friends?.includes(pendingUser?.scName as string)}
        />
      </ListItemAvatar>

      <ListItemText
        sx={{
          '& .MuiListItemText-secondary': {
            fontSize: '0.7rem',
          },
          //
        }}
        primary={pendingUser.scName}
        secondaryTypographyProps={{
          component: 'div',
        }}
        secondary={
          <Stack direction="row" spacing={1}>
            <Typography
              sx={{
                fontFamily: fontFamilies.robotoMono,
                color: theme.palette.info.dark,
                fontWeight: 'bold',
                fontSize: '0.7rem',
              }}
            >
              Pending User
            </Typography>
          </Stack>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          color="primary"
          onClick={(e) => {
            e.stopPropagation()
            openContextMenu(e.currentTarget)
          }}
        >
          <MoreVert />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
