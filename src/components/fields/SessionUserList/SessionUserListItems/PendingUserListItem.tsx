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
import { alpha, useTheme } from '@mui/system'
import { SessionContext } from '../../../../context/session.context'
import { UserAvatar } from '../../../UserAvatar'
import { fontFamilies } from '../../../../theme'

export interface PendingUserListItemProps {
  pendingUser: PendingUser
  // Crew gets a smaller row and less info
  isCrewDisplay?: boolean
  openContextMenu: (e: HTMLElement) => void
}

export const PendingUserListItem: React.FC<PendingUserListItemProps> = ({
  pendingUser,
  isCrewDisplay,
  openContextMenu,
}) => {
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
      dense={isCrewDisplay}
      disableGutters={isCrewDisplay}
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
        // background: '#15163455',
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
          !isCrewDisplay ? (
            <Typography
              sx={{
                fontFamily: fontFamilies.robotoMono,
                color: alpha(theme.palette.text.secondary, 0.3),
                fontWeight: 'bold',
                fontSize: '0.7rem',
              }}
            >
              Pending User
            </Typography>
          ) : (
            <Typography
              sx={{
                color: theme.palette.info.dark,
                textTransform: 'uppercase',
                fontSize: '0.6rem',
                fontWeight: 'bold',
                fontFamily: fontFamilies.robotoMono,
              }}
            >
              Crew (Pending User)
            </Typography>
          )
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          color="default"
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
