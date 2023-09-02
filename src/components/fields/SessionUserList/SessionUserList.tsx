import React from 'react'
import { List } from '@mui/material'
import { InnactiveUser, SessionUser } from '@regolithco/common'
import { SessionContext } from '../../../context/session.context'
import { SoloInnactive } from './SessionUserListItems/SoloInnactive'
import { SoloActive } from './SessionUserListItems/SoloActive'

export interface SessionUserListProps {
  openContextMenu: (el: HTMLElement, sessionUser?: SessionUser, innactiveUser?: InnactiveUser) => void
}

type SortedUserList = [scName: string, uType: 'Active' | 'Innactive', userObj: InnactiveUser | SessionUser][]

export const SessionUserList: React.FC<SessionUserListProps> = ({ openContextMenu }) => {
  const [menuOpen, setMenuOpen] = React.useState<{ el: HTMLElement; userId: string } | null>(null)
  const { singleActives, session, myUserProfile } = React.useContext(SessionContext)
  const meId = myUserProfile.userId

  // Create a mapping of scName to Active and Innactive users so we can sort them by scName
  const scNameList: SortedUserList = React.useMemo(() => {
    const retVal: SortedUserList = [
      ...singleActives.map((su) => [su.owner?.scName, 'Active', su] as [string, 'Active', SessionUser]),
      ...session.mentionedUsers.map((iu) => [iu.scName, 'Innactive', iu] as [string, 'Innactive', InnactiveUser]),
    ]
    // Sorting the user list so that important stuff is at the top
    scNameList.sort((a, b) => {
      if (a[1] === 'Active') {
        // session owner gets the top spot
        if ((a[2] as SessionUser).owner?.userId === session.ownerId) return -1
        // I get the second spot
        else if ((a[2] as SessionUser).owner?.userId === meId) return -1
      }
      // then go alphabetically
      return a[0].localeCompare(b[0])
    })
    return retVal
  }, [singleActives, session, meId])

  const menuOpenUser = singleActives.find((su) => su.owner?.userId === menuOpen?.userId) as SessionUser | undefined

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
          <SoloInnactive
            key={`user-${idx}`}
            innactiveUser={uBj as InnactiveUser}
            openContextMenu={(el: HTMLElement) => openContextMenu(el, undefined, uBj as InnactiveUser)}
          />
        ) : (
          <SoloActive
            key={`user-${idx}`}
            sessionUser={uBj as SessionUser}
            openContextMenu={(el: HTMLElement) => openContextMenu(el, uBj as SessionUser, undefined)}
          />
        )
      )}
      <div style={{ flexGrow: 1 }} />
    </List>
  )
}
