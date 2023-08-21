import * as React from 'react'

import {
  Session,
  SessionStateEnum,
  SessionUser,
  ScoutingFind,
  UserProfile,
  VerifiedUserLookup,
} from '@regolithco/common'
import { Box, Stack, SxProps, Theme, Tooltip, Typography, useTheme } from '@mui/material'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { DialogEnum } from './SessionPage.container'
import { ActiveUserList } from '../../fields/ActiveUserList'
import { ExpandMore, HelpOutline } from '@mui/icons-material'
import { fontFamilies } from '../../../theme'
import { MentionedUserList } from '../../fields/MentionedUserList'

export interface TabUsersProps {
  session: Session
  userProfile: UserProfile
  sessionUser: SessionUser
  navigate: (path: string) => void
  addFriend?: (username: string) => void
  removeFriend?: (username: string) => void
  verifiedMentionedUsers: VerifiedUserLookup
  addSessionMentions: (scNames: string[]) => void
  removeSessionMentions: (scNames: string[]) => void
  setActiveModal: (modal: DialogEnum) => void
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
  drawerAccordionSummary: {
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
  verifiedMentionedUsers,
  addSessionMentions,
  removeSessionMentions,
  setActiveModal,
}) => {
  const theme = useTheme()
  const isActive = session.state === SessionStateEnum.Active
  const styles = stylesThunk(theme, isActive)
  const isSessionOwner = session.ownerId === userProfile.userId

  // make a map of useIds to their scouting find attendance
  const userScoutingAttendance = React.useMemo(() => {
    const map = new Map<string, ScoutingFind>()
    session.scouting?.items?.forEach((scoutingFind) => {
      // This will get overwritten if there are duplicates but that's ok
      scoutingFind.attendance?.forEach((attendance) => {
        map.set(attendance.owner?.userId as string, scoutingFind)
      })
    })
    return map
  }, [session.scouting?.items])

  return (
    <>
      <Box sx={{ flex: '1 1', overflowX: 'hidden', overflowY: 'auto' }}>
        <Accordion defaultExpanded={true} disableGutters>
          <AccordionSummary expandIcon={<ExpandMore />} sx={styles.drawerAccordionSummary}>
            <Typography>Session Members: ({session.activeMembers?.items?.length})</Typography>
          </AccordionSummary>
          <AccordionDetails sx={styles.drawerAccordionDetails}>
            <ActiveUserList
              friends={userProfile.friends}
              scoutingMap={userScoutingAttendance}
              sessionOwnerId={session.ownerId}
              navigate={navigate}
              meId={userProfile.userId}
              sessionUsers={session.activeMembers?.items as SessionUser[]}
              addFriend={addFriend}
              removeFriend={removeFriend}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={true} disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={styles.drawerAccordionSummary}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
              <Typography sx={{ flexGrow: 1 }}>Mentioned: ({session.mentionedUsers?.length})</Typography>
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
