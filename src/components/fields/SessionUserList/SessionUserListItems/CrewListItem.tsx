import React from 'react'
import { PendingUser, SessionUser } from '@regolithco/common'
import { useTheme } from '@mui/system'
import { SessionContext } from '../../../../context/session.context'
import { ActiveUserListItem } from './ActiveUserListItem'
import { PendingUserListItem } from './PendingUserListItem'
import { Accordion, AccordionDetails, Divider, IconButton, List, Tooltip } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { stateColorsBGThunk } from './StateChip'

export interface CrewListItemProps {
  captain: SessionUser
}

type SortedUserList = [scName: string, uType: 'Active' | 'Pending', userObj: PendingUser | SessionUser][]

export const CrewListItem: React.FC<CrewListItemProps> = ({ captain }) => {
  const theme = useTheme()
  const { session, crewHierarchy, myUserProfile } = React.useContext(SessionContext)
  const theCrew = crewHierarchy[captain.ownerId] || { activeIds: [], innactiveSCNames: [] }
  const isMyCrew = captain.ownerId === myUserProfile.userId || theCrew.activeIds.includes(myUserProfile.userId)
  const [expanded, setExpanded] = React.useState(isMyCrew)
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
            SessionUser,
          ]
      ),
      ...innactiveSCNames.map(
        (scName) =>
          [scName, 'Pending', session?.mentionedUsers.find((iu) => iu.scName === scName)] as [
            string,
            'Pending',
            PendingUser,
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
        background: theme.palette.background.paper,
        '&.Mui-expanded': {
          borderTop: `3px solid ${stateColorBg}`,
          borderBottom: `3px solid ${stateColorBg}`,
          background: '#252525',
          // background: stateColorBg && alpha(stateColorBg, 0.1),
          margin: 0,
        },
      }}
    >
      <List
        disablePadding
        sx={{
          width: '100%',
          // background: stateColorBg && alpha(stateColorBg, 0.05)
        }}
      >
        {/* THIS IS THE CAPTAIN */}
        <ActiveUserListItem
          sessionUser={captain}
          isCrewDisplay
          expandButton={
            <Tooltip title={expanded ? 'Collapse Crew' : 'Expand Crew'}>
              <IconButton
                sx={{
                  ml: -2,
                }}
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  setExpanded(!expanded)
                }}
              >
                {expanded ? <ExpandMore /> : <ExpandLess />}
              </IconButton>
            </Tooltip>
          }
        />
      </List>
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
              <React.Fragment key={`frag-${idx}`}>
                <Divider key={`divider-${idx}`} />
                <PendingUserListItem key={`user-${idx}`} isCrewDisplay pendingUser={uBj as PendingUser} />
              </React.Fragment>
            ) : (
              <React.Fragment key={`frag-${idx}`}>
                <Divider key={`divider-${idx}`} />
                <ActiveUserListItem key={`user-${idx}`} isCrewDisplay sessionUser={uBj as SessionUser} />
              </React.Fragment>
            )
          )}
        </List>
      </AccordionDetails>
    </Accordion>
  )
}
