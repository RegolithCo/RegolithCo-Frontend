import React from 'react'
import { List, Typography } from '@mui/material'
import { InnactiveUser, SessionUser } from '@regolithco/common'
import { ActiveUser } from './ActiveUser'
import { alpha, Box, useTheme } from '@mui/system'
import { SessionContext } from '../../context/session.context'
import { SessionUserContextMenu } from './SessionUserContextMenu'

export interface CrewUserListProps {
  listUsers: SessionUser[]
}

export const CrewUserList: React.FC<CrewUserListProps> = ({ listUsers }) => {
  const theme = useTheme()
  const [{ el, menuUser }, setContextMenuEl] = React.useState<{
    el: HTMLElement | null
    menuUser: SessionUser | null
  }>({ el: null, menuUser: null })

  const { session, mySessionUser, crewHierarchy, openLoadoutModal } = React.useContext(SessionContext)
  const sortedSessionUsers = [...listUsers]
  const meId = mySessionUser.owner?.userId

  sortedSessionUsers.sort((a, b) => {
    // session owner gets the top spot
    if (a.owner?.userId === session.ownerId) {
      return -1
    }
    if (b.owner?.userId === session.ownerId) {
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
              sessionUser={captain}
              captain={captain.captainId ? listUsers.find((su) => su.owner?.userId === captain.captainId) : undefined}
              // Context menu
              // menuOpen={!!menuOpen}
              // User popup
            />

            {crewHierarchy && crewHierarchy[captain.owner?.userId as string] && (
              <Box sx={{ pl: 2, backgroundColor: alpha(theme.palette.secondary.dark, 0.2) }}>
                {crewHierarchy[captain.owner?.userId as string]?.activeIds.map((actId) => {
                  const thisUser = session.activeMembers?.items.find((su) => su.owner?.userId === actId) as SessionUser
                  if (!thisUser) {
                    console.error(`Could not find session user ${actId}`)
                    return null
                  }
                  return <ActiveUser key={`user-${actId}`} captain={captain} sessionUser={thisUser} />
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

      {menuUser && el && (
        <SessionUserContextMenu
          open
          sessionUser={menuUser}
          anchorEl={el}
          onClose={() => setContextMenuEl({ el: null, menuUser: null })}
        />
      )}
    </>
  )
}
