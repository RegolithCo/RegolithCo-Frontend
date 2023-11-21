import * as React from 'react'
import { SxProps, Theme, ListItemText, ListItem, List, useTheme, ListItemAvatar } from '@mui/material'
import { User } from '@regolithco/common'
import { AppContext } from '../../../context/app.context'
import { UserAvatar } from '../../UserAvatar'

export interface ScoutingFindUserListProps {
  users: User[]
  meId: string
  ownerId: string
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  attendanceList: {
    '& .MuiListItem-root': {
      p: 0,
      mb: 2,
    },
    '& .MuiTypography-root': {
      display: 'block',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  },
})

/**
 * This is the wrpaper for all the types of things scouts can find
 * @param param0
 * @returns
 */
export const ScoutingFindUserList: React.FC<ScoutingFindUserListProps> = ({ users, meId, ownerId }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const { getSafeName, hideNames } = React.useContext(AppContext)

  return (
    <List dense disablePadding sx={styles.attendanceList}>
      {users.map((user, idx) => {
        return (
          <ListItem key={`user-${idx}`} divider>
            <ListItemAvatar sx={{ minWidth: 30, mr: 1 }}>
              <UserAvatar user={user} size="small" privacy={hideNames} />
            </ListItemAvatar>
            <ListItemText primary={getSafeName(user.scName)} />
          </ListItem>
        )
      })}
    </List>
  )
}
