import * as React from 'react'

import {
  Session,
  SessionStateEnum,
  SessionUser,
  ScoutingFind,
  UserProfile,
  VerifiedUserLookup,
} from '@regolithco/common'
import { Box, SxProps, Theme, Typography, useTheme } from '@mui/material'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { DialogEnum } from './SessionPage.container'
import { ActiveUserList } from '../../fields/ActiveUserList'
import { ExpandMore } from '@mui/icons-material'
import { fontFamilies } from '../../../theme'
import { MentionedUserList } from '../../fields/MentionedUserList'

export interface TabUsersProps {
  session: Session
  userProfile: UserProfile
  sessionUser: SessionUser
  navigate: (path: string) => void
  addFriend: (username: string) => void
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
    // fontFamily: fontFamilies.robotoMono,
    // fontWeight: 'bold',
    // color: theme.palette.secondary.main,
  },
  drawerAccordionDetails: {
    p: 0,
    pb: 2,
  },
  accordionSummary: {
    fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
      lineHeight: 1,
    },
    px: 1,
    '& .MuiAccordionSummary-expandIconWrapper': {
      // color: theme.palette.primary.contrastText,
    },
    '& .MuiSwitch-root': {
      marginTop: -1,
      marginBottom: -1,
    },
    '& .MuiFormGroup-root .MuiTypography-root': {
      fontSize: '0.7em',
    },
    '& .MuiSwitch-thumb, & .MuiSwitch-track': {
      backgroundColor: '#666666!important',
      border: `1px solid #444444`,
    },
    '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb,& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-track': {
      backgroundColor: isActive ? theme.palette.primary.dark + '!important' : '#999999!important',
      border: `1px solid ${isActive ? theme.palette.primary.dark + '!important' : '#3b3b3b!important'}`,
    },
    [theme.breakpoints.up('md')]: {},
  },
  paper: {},
})

export const TabUsers: React.FC<TabUsersProps> = ({
  session,
  userProfile,
  navigate,
  addFriend,
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
          <AccordionSummary expandIcon={<ExpandMore color="inherit" />} sx={styles.drawerAccordionSummary}>
            Session Members: ({session.activeMembers?.items?.length})
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
            />
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={true} disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMore color="inherit" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{ ...styles.drawerAccordionSummary }}
          >
            Mentioned: ({session.mentionedUsers?.length})
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
          <Typography
            variant="caption"
            component="div"
            sx={{
              m: 3,
              border: '1px solid',
              borderRadius: 3,
              p: 2,
            }}
          >
            "Mentioned" means this name has been added to a work order or added explicitly to this list by the session
            owner. When users with this name join the session they become "Session Members".
          </Typography>
        </Accordion>
      </Box>
    </>
  )
}
