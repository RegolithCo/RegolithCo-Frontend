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
    const aIsOwner = a.owner?.userId === session?.ownerId
    const bIsOwner = b.owner?.userId === session?.ownerId
    const aIsMe = a.ownerId === meId
    const bIsMe = b.ownerId === meId
    const aName = a.owner?.scName || 'ZZZZ'
    const bName = b.owner?.scName || 'ZZZZ'

    // session owner gets the top spot
    if (aIsOwner) return -1
    else if (bIsOwner) return 1
    // I get the second spot
    else if (aIsMe) return -1
    else if (bIsMe) return 1
    // then go alphabetically
    else return aName.toLowerCase().localeCompare(bName.toLowerCase())
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
