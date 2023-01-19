import React from 'react'
import { List } from '@mui/material'
import { SessionUser } from '@orgminer/common'
import { ActiveUserListItem } from './ActiveUserListItem'

export interface ActiveUserListProps {
  sessionUsers: SessionUser[]
  meId?: string
  sessionOwnerId?: string
  friends?: string[]
  small?: boolean
  addFriend?: (friendName: string) => void
}

export const ActiveUserList: React.FC<ActiveUserListProps> = ({
  sessionUsers,
  sessionOwnerId,
  meId,
  friends,
  small,
  addFriend,
}) => {
  const sortedSessionUsers = [...sessionUsers]
  sortedSessionUsers.sort((a, b) => {
    // session owner gets the top spot
    if (a.owner?.userId === sessionOwnerId) {
      return -1
    }
    if (b.owner?.userId === sessionOwnerId) {
      return 1
    }
    // I get the second top spot
    if (a.owner?.userId === meId) {
      return -1
    }
    if (b.owner?.userId === meId) {
      return 1
    }
    // then go alphabetically
    if (a.owner?.scName && b.owner?.scName) {
      return a.owner.scName.localeCompare(b.owner.scName)
    }
    return 0
  })

  return (
    <List
      dense
      sx={{
        '& *': {
          fontSize: small ? '0.5rem' : '1rem',
        },
        height: '100%',
        overflowY: 'scroll',
        overflowX: 'hidden',
      }}
    >
      {sortedSessionUsers.map((sessionUser, idx) => (
        <ActiveUserListItem
          key={`user-${idx}`}
          meId={meId}
          sessionOwnerId={sessionOwnerId}
          sessionUser={sessionUser}
          small={small}
          friends={friends}
          addFriend={addFriend ? () => addFriend(sessionUser?.owner?.scName as string) : undefined}
        />
      ))}
      <div style={{ flexGrow: 1 }} />
    </List>
  )
}
