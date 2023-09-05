import React from 'react'
import { PendingUser, SessionUser } from '@regolithco/common'
import { alpha, useTheme } from '@mui/system'
import { SessionContext } from '../../../../context/session.context'
import { ActiveUserListItem } from './ActiveUserListItem'
import { PendingUserListItem } from './PendingUserListItem'
import { Accordion, AccordionDetails, AccordionSummary, List } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import { stateColorsBGThunk } from './StateChip'

export interface CrewListItemProps {
  captain: SessionUser
  openContextMenu: (el: HTMLElement, sessionUser?: SessionUser, pendingUser?: PendingUser) => void
}

type SortedUserList = [scName: string, uType: 'Active' | 'Pending', userObj: PendingUser | SessionUser][]

export const CrewListItem: React.FC<CrewListItemProps> = ({ captain, openContextMenu }) => {
  const theme = useTheme()
  const { session, crewHierarchy, myUserProfile, scoutingAttendanceMap, openActiveUserModal } =
    React.useContext(SessionContext)
  const [expanded, setExpanded] = React.useState(false)
  const meId = myUserProfile.userId

  const stateColorsBg = stateColorsBGThunk(theme)
  const stateColorBg = stateColorsBg[captain.state] || undefined

  // Create a mapping of scName to Active and Innactive users so we can sort them by scName
  const scNameList: SortedUserList = React.useMemo(() => {
    const { activeIds, innactiveSCNames } = crewHierarchy[captain.ownerId] || { activeIds: [], innactiveSCNames: [] }
    const retVal: SortedUserList = [
      ...activeIds.map(
        (userId) =>
          [userId, 'Active', session?.activeMembers?.items.find((sm) => sm.ownerId === userId)] as [
            string,
            'Active',
            SessionUser
          ]
      ),
      ...innactiveSCNames.map(
        (scName) =>
          [scName, 'Pending', session?.mentionedUsers.find((iu) => iu.scName === scName)] as [
            string,
            'Pending',
            PendingUser
          ]
      ),
    ]
    // Sorting the user list so that important stuff is at the top
    retVal.sort((a, b) => {
      if (a[1] === 'Active') {
        // session owner gets the top spot
        if ((a[2] as SessionUser).owner?.userId === session?.ownerId) return -1
        // I get the second spot
        else if ((a[2] as SessionUser).owner?.userId === meId) return -1
      }
      // then go alphabetically
      return a[0].localeCompare(b[0])
    })
    return retVal
  }, [session?.activeMembers, session?.mentionedUsers, meId])

  return (
    <Accordion
      expanded={expanded}
      disableGutters
      onChange={() => setExpanded(!expanded)}
      sx={{
        p: 0,
        m: 0,
        borderTop: '3px solid transparent',
        borderBottom: '3px solid transparent',
        background: stateColorBg && alpha(stateColorBg, 0.05),
        '&.Mui-expanded': {
          borderTop: `3px solid ${stateColorBg}`,
          borderBottom: `3px solid ${stateColorBg}`,
          background: stateColorBg && alpha(stateColorBg, 0.1),
          margin: 0,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          position: 'relative',
          pl: 0,
          // minHeight: 48,
          '& .MuiAccordionSummary-content': {
            my: 0,
            '&.Mui-expanded': {
              my: 0,
            },
          },
          '&.Mui-expanded': {
            // minHeight: 48,
            // m: 0,
          },
        }}
      >
        <List disablePadding sx={{ width: '100%' }}>
          <ActiveUserListItem sessionUser={captain} isCrewDisplay openContextMenu={openContextMenu} />
        </List>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          p: 0,
          m: 0,
        }}
      >
        <List sx={{ ml: 3 }} disablePadding>
          {/* <ActiveUserListItem sessionUser={captain} isCrewDisplay openContextMenu={openContextMenu} /> */}
          {scNameList.map(([, uType, uBj], idx) =>
            uType === 'Pending' ? (
              <PendingUserListItem
                key={`user-${idx}`}
                isCrewDisplay
                pendingUser={uBj as PendingUser}
                openContextMenu={(el: HTMLElement) => openContextMenu(el, undefined, uBj as PendingUser)}
              />
            ) : (
              <ActiveUserListItem
                key={`user-${idx}`}
                isCrewDisplay
                sessionUser={uBj as SessionUser}
                openContextMenu={(el: HTMLElement) => openContextMenu(el, uBj as SessionUser, undefined)}
              />
            )
          )}
        </List>
      </AccordionDetails>
    </Accordion>
  )
}
