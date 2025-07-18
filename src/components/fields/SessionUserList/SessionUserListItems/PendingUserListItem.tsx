import React, { useRef } from 'react'
import { ListItem, ListItemAvatar, ListItemText, Typography, Stack, alpha, useTheme } from '@mui/material'
import { PendingUser } from '@regolithco/common'
import { SessionContext } from '../../../../context/session.context'
import { UserAvatar } from '../../../UserAvatar'
import { fontFamilies } from '../../../../theme'
import { AppContext } from '../../../../context/app.context'
import { useSessionUserContextMenu } from '../SessionUserContextMenu'
import { UserListItemRoleIcons } from './ActiveUserListItem'

export interface PendingUserListItemProps {
  pendingUser: PendingUser
  // Crew gets a smaller row and less info
  isCrewDisplay?: boolean
}

export const PendingUserListItem: React.FC<PendingUserListItemProps> = ({ pendingUser, isCrewDisplay }) => {
  const theme = useTheme()
  const { getSafeName } = React.useContext(AppContext)
  const { openPendingUserModal, myUserProfile } = React.useContext(SessionContext)
  const listItemRef = useRef<HTMLLIElement>(null)

  const { contextMenuNode, handleContextMenu } = useSessionUserContextMenu(undefined, pendingUser)

  return (
    <>
      {contextMenuNode}
      <ListItem
        ref={listItemRef}
        dense={isCrewDisplay}
        disableGutters={isCrewDisplay}
        onContextMenu={handleContextMenu}
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
            size={isCrewDisplay ? 'small' : 'medium'}
            pendingUser={pendingUser}
            isFriend={myUserProfile.friends?.includes(pendingUser?.scName as string)}
          />
        </ListItemAvatar>

        <ListItemText
          sx={{
            '& .MuiListItemText-secondary': {
              fontSize: '0.7rem',
            },
            '& .MuiListItemText-primary': {
              fontSize: isCrewDisplay ? '0.7rem' : undefined,
            },
            //
          }}
          primary={<Typography variant="body2">{getSafeName(pendingUser.scName)}</Typography>}
          secondaryTypographyProps={{
            component: 'div',
          }}
          secondary={
            !isCrewDisplay && (
              <Stack direction="row" spacing={1}>
                <Typography
                  sx={{
                    fontFamily: fontFamilies.robotoMono,
                    color: alpha(theme.palette.text.secondary, 0.3),
                    fontWeight: 'bold',
                    fontSize: isCrewDisplay ? '0.5rem' : '0.7rem',
                  }}
                >
                  Pending User
                </Typography>
              </Stack>
            )
          }
        />

        <UserListItemRoleIcons user={pendingUser} />
        {/* <ListItemSecondaryAction>
          <IconButton color="default" onClick={handleContextMenu}>
            <MoreVert />
          </IconButton>
        </ListItemSecondaryAction> */}
      </ListItem>
    </>
  )
}
