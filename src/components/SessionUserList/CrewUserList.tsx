import React from 'react'
import { List, Typography } from '@mui/material'
import { CrewHierarchy, InnactiveUser, ScoutingFind, Session, SessionUser } from '@regolithco/common'
import { ActiveUser } from './ActiveUser'
import { SessionUserContextMenu } from './SessionUserContextMenu'
import { alpha, Box, useTheme } from '@mui/system'

export interface CrewUserListProps {
  listUsers: SessionUser[]
  session: Session
  meId?: string
  scoutingMap?: Map<string, ScoutingFind>
  sessionOwnerId?: string
  friends?: string[]
  crewHierarchy?: CrewHierarchy
  openUserModal?: (userId: string) => void
  openLoadoutModal?: (userId: string) => void
  navigate?: (path: string) => void
  addFriend?: (friendName: string) => void
  removeFriend?: (friendName: string) => void
}

export const CrewUserList: React.FC<CrewUserListProps> = ({
  listUsers,
  session,
  sessionOwnerId,
  meId,
  navigate,
  openUserModal,
  openLoadoutModal,
  scoutingMap,
  crewHierarchy,
  friends,
  addFriend,
  removeFriend,
}) => {
  const theme = useTheme()
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
        {sortedSessionUsers.map((captain, idx) => (
          <Box key={`user-${idx}`}>
            <ActiveUser
              key={`user-${idx}`}
              meId={meId}
              sessionOwnerId={sessionOwnerId}
              captain={captain.captainId ? listUsers.find((su) => su.owner?.userId === captain.captainId) : undefined}
              // Context menu
              // menuOpen={!!menuOpen}
              openContextMenu={(el: HTMLElement) => setMenuOpen({ el, userId: captain.owner?.userId as string })}
              // User popup
              openUserPopup={() => openUserModal && openUserModal(captain.owner?.userId as string)}
              openLoadoutPopup={() => openLoadoutModal && openLoadoutModal(captain.owner?.userId as string)}
              scoutingFind={scoutingMap ? scoutingMap.get(captain.owner?.userId as string) : undefined}
              sessionUser={captain}
              navigate={navigate}
              friends={friends}
              addFriend={addFriend ? () => addFriend(captain?.owner?.scName as string) : undefined}
            />

            {crewHierarchy && crewHierarchy[captain.owner?.userId as string] && (
              <Box sx={{ pl: 2, backgroundColor: alpha(theme.palette.secondary.dark, 0.2) }}>
                {crewHierarchy[captain.owner?.userId as string]?.activeIds.map((actId) => {
                  const thisUser = session.activeMembers?.items.find((su) => su.owner?.userId === actId) as SessionUser
                  if (!thisUser) {
                    console.error(`Could not find session user ${actId}`)
                    return null
                  }
                  return (
                    <ActiveUser
                      key={`user-${actId}`}
                      meId={meId}
                      sessionOwnerId={sessionOwnerId}
                      captain={captain}
                      // Context menu
                      // menuOpen={!!menuOpen}
                      openContextMenu={(el: HTMLElement) =>
                        setMenuOpen({ el, userId: captain.owner?.userId as string })
                      }
                      // User popup
                      openUserPopup={() => openUserModal && openUserModal(captain.owner?.userId as string)}
                      openLoadoutPopup={() => openLoadoutModal && openLoadoutModal(captain.owner?.userId as string)}
                      scoutingFind={scoutingMap ? scoutingMap.get(captain.owner?.userId as string) : undefined}
                      sessionUser={thisUser}
                      navigate={navigate}
                      friends={friends}
                      addFriend={addFriend ? () => addFriend(captain?.owner?.scName as string) : undefined}
                    />
                  )
                })}
                {crewHierarchy[captain.owner?.userId as string]?.innactiveSCNames.map((inactScName, idx) => {
                  const thisUser = session.mentionedUsers.find(({ scName }) => scName === inactScName) as InnactiveUser
                  if (!thisUser) {
                    console.error(`Could not find session user ${inactScName}`)
                    return null
                  }
                  return (
                    <Box key={`user-${idx}`} sx={{ pl: 2 }}>
                      <Typography variant="body2" color="text.primary">
                        {inactScName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        crew of {captain.owner?.scName}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            )}
          </Box>
        ))}
        <div style={{ flexGrow: 1 }} />
      </List>
      <SessionUserContextMenu
        open={!!menuOpen}
        anchorEl={menuOpen?.el}
        onClose={() => setMenuOpen(null)}
        openUserModal={openUserModal}
        sessionUser={listUsers.find((su) => su.owner?.userId === menuOpen?.userId) as SessionUser}
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
