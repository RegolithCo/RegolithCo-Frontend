import React, { useEffect } from 'react'
import { List } from '@mui/material'
import { ScoutingFind, SessionUser } from '@regolithco/common'
import { ActiveUserListItem } from './ActiveUserListItem'

export interface ActiveUserListProps {
  sessionUsers: SessionUser[]
  meId?: string
  scoutingMap?: Map<string, ScoutingFind>
  sessionOwnerId?: string
  friends?: string[]
  openUserModal?: (userId: string) => void
  navigate?: (path: string) => void
  addFriend?: (friendName: string) => void
}

export const ActiveUserList: React.FC<ActiveUserListProps> = ({
  sessionUsers,
  sessionOwnerId,
  meId,
  navigate,
  openUserModal,
  scoutingMap,
  friends,
  addFriend,
}) => {
  const [menuOpen, setMenuOpen] = React.useState<[HTMLElement, string] | null>(null)
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
      disablePadding
      sx={{
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
          openContextMenu={openUserModal}
          openUserPopup={(el: HTMLElement, userId: string) => setMenuOpen([el, userId])}
          scoutingFind={scoutingMap ? scoutingMap.get(sessionUser.owner?.userId as string) : undefined}
          sessionUser={sessionUser}
          navigate={navigate}
          friends={friends}
          addFriend={addFriend ? () => addFriend(sessionUser?.owner?.scName as string) : undefined}
        />
      ))}
      <div style={{ flexGrow: 1 }} />
    </List>
  )
}
