import * as React from 'react'
import { SxProps, Theme, ListItemText, ListItem, List, useTheme, ListItemAvatar, Avatar } from '@mui/material'
import { makeAvatar, User } from '@regolithco/common'
import { Person } from '@mui/icons-material'
import { AppContext } from '../../../context/app.context'

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
  const { getSafeName } = React.useContext(AppContext)

  return (
    <List dense disablePadding sx={styles.attendanceList}>
      {users.map((user, idx) => {
        const avtr = makeAvatar(user.avatarUrl as string)
        return (
          <ListItem key={`user-${idx}`} divider>
            <ListItemAvatar sx={{ minWidth: 30 }}>
              <Avatar
                alt={user.scName}
                src={avtr}
                imgProps={{ referrerPolicy: 'no-referrer' }}
                color="secondary"
                sx={{
                  height: 24,
                  width: 24,
                  background: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                  border: '1px solid',
                }}
              >
                <Person color="inherit" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={getSafeName(user.scName)} />
          </ListItem>
        )
      })}
    </List>
  )
}
