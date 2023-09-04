import React from 'react'
import { lookups, PendingUser, SessionUser, User } from '@regolithco/common'
import { alpha, useTheme } from '@mui/system'
import { SessionContext } from '../../../../context/session.context'
import { ActiveUserListItem } from './ActiveUserListItem'
import { PendingUserListItem } from './PendingUserListItem'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AvatarGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import { UserAvatar } from '../../../UserAvatar'
import { fontFamilies } from '../../../../theme'
import { StateChip, stateColorsBGThunk } from './StateChip'

export interface CrewListItemProps {
  captain: SessionUser
  openContextMenu: (el: HTMLElement, sessionUser?: SessionUser, pendingUser?: PendingUser) => void
}

type SortedUserList = [scName: string, uType: 'Active' | 'Pending', userObj: PendingUser | SessionUser][]

export const CrewListItem: React.FC<CrewListItemProps> = ({ captain, openContextMenu }) => {
  const theme = useTheme()
  const { session, crewHierarchy, myUserProfile, scoutingAttendanceMap } = React.useContext(SessionContext)
  const [expanded, setExpanded] = React.useState(false)
  const meId = myUserProfile.userId
  const crew = crewHierarchy[captain.ownerId] || { activeIds: [], innactiveSCNames: [] }
  const totalCrew = crew.activeIds.length + crew.innactiveSCNames.length
  const scoutingFind = scoutingAttendanceMap.get(captain.ownerId)

  const vehicle = captain.vehicleCode ? lookups.shipLookups.find((s) => s.code === captain.vehicleCode) : null

  const crewName = captain.shipName || captain.owner?.scName

  const stateColorsBg = stateColorsBGThunk(theme)
  const stateColorBg = stateColorsBg[captain.state] || undefined

  // Create a mapping of scName to Active and Innactive users so we can sort them by scName
  const scNameList: SortedUserList = React.useMemo(() => {
    const { activeIds, innactiveSCNames } = crewHierarchy[captain.ownerId] || { activeIds: [], innactiveSCNames: [] }
    const retVal: SortedUserList = [
      ...activeIds.map(
        (userId) =>
          [userId, 'Active', session.activeMembers?.items.find((sm) => sm.ownerId === userId)] as [
            string,
            'Active',
            SessionUser
          ]
      ),
      ...innactiveSCNames.map(
        (scName) =>
          [scName, 'Pending', session.mentionedUsers.find((iu) => iu.scName === scName)] as [
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
        if ((a[2] as SessionUser).owner?.userId === session.ownerId) return -1
        // I get the second spot
        else if ((a[2] as SessionUser).owner?.userId === meId) return -1
      }
      // then go alphabetically
      return a[0].localeCompare(b[0])
    })
    return retVal
  }, [session.activeMembers, session.mentionedUsers, meId])

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        p: 0,
        m: 0,
        background: stateColorBg && alpha(stateColorBg, 0.05),
        '&.Mui-expanded': {
          background: stateColorBg && alpha(stateColorBg, 0.1),
          margin: 0,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          position: 'relative',
          borderTop: '3px solid transparent',
          // minHeight: 48,
          '&.Mui-expanded': {
            borderTop: `3px solid ${stateColorBg}`,
            // minHeight: 48,
            // m: 0,
          },
        }}
      >
        <StateChip userState={captain.state} scoutingFind={scoutingFind} />
        {vehicle && (
          <Typography
            component="div"
            sx={{
              background: theme.palette.secondary.dark,
              px: 1,
              fontSize: '0.7rem',
              position: 'absolute',
              fontFamily: fontFamilies.robotoMono,
              fontWeight: 'bold',
              top: 0,
              left: 0,
            }}
          >
            {vehicle.name.toUpperCase()}
          </Typography>
        )}
        <ListItem dense disableGutters sx={{}}>
          <ListItemAvatar>
            <AvatarGroup
              max={4}
              color="primary"
              sx={{
                '& .MuiAvatarGroup-avatar': {
                  mr: 2,
                  border: `2px solid ${theme.palette.primary.main}`,
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.dark, 0.2),
                  fontSize: '0.75rem',
                },
              }}
            >
              <UserAvatar user={session.owner as User} size="large" hideTooltip />
              {scNameList.map(([, uType, uBj], idx) =>
                uType === 'Pending' ? (
                  <UserAvatar key={`member-${idx}`} pendingUser={uBj as PendingUser} size="large" hideTooltip />
                ) : (
                  <UserAvatar
                    key={`member-${idx}`}
                    user={(uBj as SessionUser).owner as User}
                    size="large"
                    hideTooltip
                  />
                )
              )}
            </AvatarGroup>
          </ListItemAvatar>
          <ListItemText
            primary={crewName}
            primaryTypographyProps={{
              component: 'div',
            }}
            secondaryTypographyProps={{
              component: 'div',
              variant: 'caption',
            }}
            secondary={
              <>
                Cpt. {captain.owner?.scName} + {totalCrew} crew
              </>
            }
          />
        </ListItem>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          p: 0,
          m: 0,
        }}
      >
        <List sx={{ ml: 6 }}>
          <ActiveUserListItem sessionUser={captain} isCrewDisplay openContextMenu={openContextMenu} />
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
