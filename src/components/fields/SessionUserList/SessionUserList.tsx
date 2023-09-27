import React from 'react'
import { Divider, List } from '@mui/material'
import { PendingUser, SessionUser } from '@regolithco/common'
import { SessionContext } from '../../../context/session.context'
import { PendingUserListItem } from './SessionUserListItems/PendingUserListItem'
import { ActiveUserListItem } from './SessionUserListItems/ActiveUserListItem'

export interface SessionUserListProps {
  openContextMenu: (el: HTMLElement, sessionUser?: SessionUser, pendingUser?: PendingUser) => void
}

type SortedUserList = [scName: string, uType: 'Active' | 'Innactive', userObj: PendingUser | SessionUser][]

export const SessionUserList: React.FC<SessionUserListProps> = ({ openContextMenu }) => {
  const { singleActives, singleInnactives, session, myUserProfile } = React.useContext(SessionContext)
  const meId = myUserProfile.userId

  // Create a mapping of scName to Active and Innactive users so we can sort them by scName
  const scNameList: SortedUserList = React.useMemo(() => {
    const retVal: SortedUserList = [
      ...singleActives.map((su) => [su.owner?.scName, 'Active', su] as [string, 'Active', SessionUser]),
      ...singleInnactives.map((iu) => [iu.scName, 'Innactive', iu] as [string, 'Innactive', PendingUser]),
    ]
    // Sorting the user list so that important stuff is at the top
    retVal.sort((a, b) => {
      const aUser = a[2] as SessionUser
      const bUser = b[2] as SessionUser
      const aIsOwner = aUser.owner?.userId === session?.ownerId
      const bIsOwner = bUser.owner?.userId === session?.ownerId
      const aIsMe = aUser.ownerId === meId
      const bIsMe = bUser.ownerId === meId

      // session owner gets the top spot
      if (aIsOwner) return -1
      else if (bIsOwner) return 1
      // I get the second spot
      else if (aIsMe) return -1
      else if (bIsMe) return 1
      // then go alphabetically
      else return a[0].toLowerCase().localeCompare(b[0].toLowerCase())
    })
    return retVal
  }, [singleActives, session, meId])

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
      {scNameList.map(([, uType, uBj], idx) =>
        uType === 'Innactive' ? (
          <React.Fragment key={`user-${idx}`}>
            <PendingUserListItem
              key={`user-${idx}`}
              pendingUser={uBj as PendingUser}
              openContextMenu={(el: HTMLElement) => openContextMenu(el, undefined, uBj as PendingUser)}
            />
            <Divider />
          </React.Fragment>
        ) : (
          <React.Fragment key={`user-${idx}`}>
            <ActiveUserListItem
              key={`user-${idx}`}
              sessionUser={uBj as SessionUser}
              openContextMenu={(el: HTMLElement) => openContextMenu(el, uBj as SessionUser, undefined)}
            />
            <Divider />
          </React.Fragment>
        )
      )}
      <div style={{ flexGrow: 1 }} />
    </List>
  )
}
