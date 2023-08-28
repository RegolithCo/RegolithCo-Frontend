import * as React from 'react'

import {
  Session,
  SessionStateEnum,
  SessionUser,
  ScoutingFind,
  UserProfile,
  VerifiedUserLookup,
  InnactiveUser,
} from '@regolithco/common'
import { Box, Stack, SxProps, Theme, Toolbar, Tooltip, Typography, useTheme } from '@mui/material'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { ActiveUserList } from '../../fields/ActiveUserList'
import { ExpandMore, HelpOutline } from '@mui/icons-material'
import { fontFamilies } from '../../../theme'
import { MentionedUserList } from '../../fields/MentionedUserList'
import { crewHierarchyCalc } from '@regolithco/common'
import { CrewUserList } from '../../fields/CrewUserList'

export interface TabUsersProps {
  session: Session
  userProfile: UserProfile
  sessionUser: SessionUser
  scoutingMap?: Map<string, ScoutingFind>
  navigate: (path: string) => void
  addFriend?: (username: string) => void
  removeFriend?: (username: string) => void
  verifiedMentionedUsers: VerifiedUserLookup
  addSessionMentions: (scNames: string[]) => void
  removeSessionMentions: (scNames: string[]) => void
  openUserModal: (userId: string) => void
  openLoadoutModal: (userId: string) => void
}

const stylesThunk = (theme: Theme, isActive: boolean): Record<string, SxProps<Theme>> => ({
  container: {
    [theme.breakpoints.up('md')]: {
      height: '100%',
      overflow: 'hidden',
      p: 2,
    },
  },
  gridContainer: {},
  gridColumn: {},
  drawerAccordionSummaryCrews: {
    '& .MuiTypography-root': {
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.dark,
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: theme.palette.secondary.contrastText,
    },
  },
  drawerAccordionSummaryActive: {
    '& .MuiTypography-root': {
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: theme.palette.secondary.contrastText,
    },
  },
  drawerAccordionSummarySecondary: {
    '& .MuiTypography-root': {
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.light,
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: theme.palette.secondary.contrastText,
    },
  },
  drawerAccordionDetails: {
    p: 0,
    pb: 2,
  },
  paper: {},
})

export const TabUsers: React.FC<TabUsersProps> = ({
  session,
  userProfile,
  navigate,
  addFriend,
  removeFriend,
  scoutingMap,
  verifiedMentionedUsers,
  addSessionMentions,
  removeSessionMentions,
  openUserModal,
  openLoadoutModal,
}) => {
  const theme = useTheme()
  const isActive = session.state === SessionStateEnum.Active
  const styles = stylesThunk(theme, isActive)
  const isSessionOwner = session.ownerId === userProfile.userId

  const { crewHierarchy, singleActives, captains, singleInnactives } = React.useMemo(() => {
    const crewHierarchy = crewHierarchyCalc(session.activeMembers?.items as SessionUser[], session.mentionedUsers || [])
    const { captains, singleActives } = (session.activeMembers?.items || []).reduce(
      (acc, su) => {
        if (!su.owner?.userId || !crewHierarchy[su.owner?.userId]) {
          acc.singleActives.push(su)
          return acc
        }
        const crew = crewHierarchy[su.owner?.userId]
        if (crew.activeIds.length === 0 || crew.innactiveSCNames.length === 0) {
          acc.singleActives.push(su)
        } else {
          acc.captains.push(su)
        }
        return acc
      },
      { singleActives: [], captains: [] } as { singleActives: SessionUser[]; captains: SessionUser[] }
    )
    const singleInnactives: InnactiveUser[] = (session.mentionedUsers || []).filter(
      ({ captainId }) => !captainId || !crewHierarchy[captainId]
    )
    return { crewHierarchy, singleActives, captains, singleInnactives }
  }, [session.activeMembers?.items, session.mentionedUsers])

  return (
    <>
      <Box sx={{ flex: '1 1', overflowX: 'hidden', overflowY: 'auto' }}>
        <Toolbar
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.secondary.contrastText,
            '&.MuiToolbar-root': {
              px: 2,
              fontSize: `1.2rem`,
              minHeight: 50,
              textTransform: 'uppercase',
              fontFamily: fontFamilies.robotoMono,
              fontWeight: 'bold',
            },
          }}
        >
          Session Members ({(session.activeMembers?.items?.length || 0) + session.mentionedUsers.length})
        </Toolbar>
        <Accordion defaultExpanded={true} disableGutters>
          <AccordionSummary expandIcon={<ExpandMore />} sx={styles.drawerAccordionSummaryCrews}>
            <Typography>Crews ({captains.length})</Typography>
          </AccordionSummary>
          <AccordionDetails sx={styles.drawerAccordionDetails}>
            <CrewUserList
              friends={userProfile.friends}
              scoutingMap={scoutingMap}
              sessionOwnerId={session.ownerId}
              crewHierarchy={crewHierarchy}
              navigate={navigate}
              meId={userProfile.userId}
              listUsers={captains}
              session={session}
              addFriend={addFriend}
              removeFriend={removeFriend}
              openUserModal={openUserModal}
              openLoadoutModal={openLoadoutModal}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={true} disableGutters>
          <AccordionSummary expandIcon={<ExpandMore />} sx={styles.drawerAccordionSummaryActive}>
            <Typography>Active Users ({(session.activeMembers?.items || []).length})</Typography>
          </AccordionSummary>
          <AccordionDetails sx={styles.drawerAccordionDetails}>
            <ActiveUserList
              friends={userProfile.friends}
              scoutingMap={scoutingMap}
              sessionOwnerId={session.ownerId}
              navigate={navigate}
              meId={userProfile.userId}
              listUsers={session.activeMembers?.items || []}
              addFriend={addFriend}
              removeFriend={removeFriend}
              openUserModal={openUserModal}
              openLoadoutModal={openLoadoutModal}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={true} disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={styles.drawerAccordionSummarySecondary}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
              <Typography sx={{ flexGrow: 1 }}>Not Joined Yet: ({session.mentionedUsers.length})</Typography>
              <Tooltip
                title={
                  <>
                    <Typography paragraph variant="caption">
                      "Mentioned" users haven't joined the session yet (Or they don't want to). But mentioning them
                      means you can still track what you owe them.
                    </Typography>
                    <Typography paragraph variant="caption">
                      When users with the same name log in they become "Session Members".
                    </Typography>
                    <Typography paragraph variant="caption">
                      If you have enabled the session setting <strong>"Require joining users to be "Mentioned"</strong>{' '}
                      then only users that are mentioned can join this session, even if they have the share link.
                    </Typography>
                  </>
                }
              >
                <HelpOutline />
              </Tooltip>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={styles.drawerAccordionDetails}>
            <MentionedUserList
              mentionedUsers={session.mentionedUsers}
              verifiedUsers={verifiedMentionedUsers}
              myFriends={userProfile.friends}
              useAutocomplete
              addFriend={addFriend}
              addToList={isActive ? (scName: string) => addSessionMentions([scName]) : undefined}
              removeFromList={isActive ? (scName: string) => removeSessionMentions([scName]) : undefined}
            />
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  )
}
