import React from 'react'
import { List } from '@mui/material'
import { ScoutingFind, SessionUser } from '@regolithco/common'
import { ActiveUser } from './ActiveUser'
import { SessionUserContextMenu } from './SessionUserContextMenu'
import { Box } from '@mui/system'

export interface SessionUserListProps {
  listUsers: SessionUser[]
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

export const SessionUserList: React.FC<SessionUserListProps> = ({
  listUsers,
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
  const sortedSessionUsers = [...listUsers]

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

  const menuOpenUser = listUsers.find((su) => su.owner?.userId === menuOpen?.userId) as SessionUser | undefined

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
          <Box key={`user-${idx}`}>
            <ActiveUser
              key={`user-${idx}`}
              captain={
                sessionUser.captainId ? listUsers.find((su) => su.owner?.userId === sessionUser.captainId) : undefined
              }
              // Context menu
              // User popup
              sessionUser={sessionUser}
            />
          </Box>
        ))}
        <div style={{ flexGrow: 1 }} />
      </List>
      <SessionUserContextMenu
        open={!!menuOpen}
        anchorEl={menuOpen?.el}
        onClose={() => setMenuOpen(null)}
        sessionUser={listUsers.find((su) => su.owner?.userId === menuOpen?.userId) as SessionUser}
      />
    </>
  )
}
