import React from 'react'
import { List } from '@mui/material'
import { ScoutingFind, SessionUser } from '@regolithco/common'
import { ActiveUserListItem } from './ActiveUserListItem'
import { ActiveUserContextMenu } from './ActiveUserContextMenu'

export interface ActiveUserListProps {
  sessionUsers: SessionUser[]
  meId?: string
  scoutingMap?: Map<string, ScoutingFind>
  sessionOwnerId?: string
  friends?: string[]
  openUserModal?: (userId: string) => void
  openLoadoutModal?: (userId: string) => void
  navigate?: (path: string) => void
  addFriend?: (friendName: string) => void
  removeFriend?: (friendName: string) => void
}

export const ActiveUserList: React.FC<ActiveUserListProps> = ({
  sessionUsers,
  sessionOwnerId,
  meId,
  navigate,
  openUserModal,
  openLoadoutModal,
  scoutingMap,
  friends,
  addFriend,
  removeFriend,
}) => {
  const [menuOpen, setMenuOpen] = React.useState<{ el: HTMLElement; userId: string } | null>(null)
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

  const menuOpenUser = sessionUsers.find((su) => su.owner?.userId === menuOpen?.userId) as SessionUser | undefined

  return (
    <>
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
            // Context menu
            // menuOpen={!!menuOpen}
            openContextMenu={(el: HTMLElement) => setMenuOpen({ el, userId: sessionUser.owner?.userId as string })}
            // User popup
            openUserPopup={() => openUserModal && openUserModal(sessionUser.owner?.userId as string)}
            openLoadoutPopup={() => openLoadoutModal && openLoadoutModal(sessionUser.owner?.userId as string)}
            scoutingFind={scoutingMap ? scoutingMap.get(sessionUser.owner?.userId as string) : undefined}
            sessionUser={sessionUser}
            navigate={navigate}
            friends={friends}
            addFriend={addFriend ? () => addFriend(sessionUser?.owner?.scName as string) : undefined}
          />
        ))}
        <div style={{ flexGrow: 1 }} />
      </List>
      <ActiveUserContextMenu
        open={!!menuOpen}
        anchorEl={menuOpen?.el}
        onClose={() => setMenuOpen(null)}
        openUserModal={openUserModal}
        sessionUser={sessionUsers.find((su) => su.owner?.userId === menuOpen?.userId) as SessionUser}
        friends={friends || []}
        addFriend={addFriend && menuOpenUser ? () => addFriend(menuOpenUser?.owner?.scName as string) : undefined}
        removeFriend={
          removeFriend && menuOpenUser ? () => removeFriend(menuOpenUser?.owner?.scName as string) : undefined
        }
        isMe={menuOpen?.userId === meId}
      />
    </>
  )
}
