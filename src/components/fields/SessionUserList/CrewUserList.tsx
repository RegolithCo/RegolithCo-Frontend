import React from 'react'
import { List } from '@mui/material'
import { PendingUser, SessionUser } from '@regolithco/common'
// import { useTheme } from '@mui/system'
import { SessionContext } from '../../../context/session.context'
import { CrewListItem } from './SessionUserListItems/CrewListItem'

export interface CrewUserListProps {
  openContextMenu: (el: HTMLElement, sessionUser?: SessionUser, pendingUser?: PendingUser) => void
}

export const CrewUserList: React.FC<CrewUserListProps> = ({ openContextMenu }) => {
  // const theme = useTheme()
  const { captains, session, mySessionUser } = React.useContext(SessionContext)
  const sortedCaptains = [...captains]
  const meId = mySessionUser.owner?.userId

  sortedCaptains.sort((a, b) => {
    // session owner gets the top spot
    if (a.owner?.userId === session?.ownerId) {
      return -1
    }
    if (b.owner?.userId === session?.ownerId) {
      return 1
    }
    // I get the second top spot
    if (a.owner?.userId === meId) {
      return -1
    }
    if (b.owner?.userId === meId) {
      return 1
    }
    // then go alphabetically prioritizing crew/ship name (if the user enter's one) then the captain's name
    if (a.owner?.scName && b.owner?.scName) {
      const compareA = a.shipName || a.owner.scName
      const compareB = b.shipName || b.owner.scName
      return compareA.localeCompare(compareB)
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
      {sortedCaptains.map((captain, idx) => (
        <CrewListItem key={`user-${idx}`} captain={captain} openContextMenu={openContextMenu} />
      ))}
      <div style={{ flexGrow: 1 }} />
    </List>
  )
}
