import * as React from 'react'
import { SessionStateEnum } from '@regolithco/common'
import { Box, Stack, SxProps, Theme, Toolbar, Typography, useTheme } from '@mui/material'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import { fontFamilies } from '../../../theme'
import { CrewUserList } from '../../fields/SessionUserList/CrewUserList'
import { SessionUserList } from '../../fields/SessionUserList/SessionUserList'
import { DialogEnum, SessionContext } from '../../../context/session.context'
import { grey } from '@mui/material/colors'
import { AddUserButton } from '../../fields/AddUserButton'

export interface TabUsersProps {
  propa?: string
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
    backgroundColor: isActive ? theme.palette.secondary.dark : grey[400],
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
    backgroundColor: isActive ? theme.palette.secondary.main : grey[300],
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
    backgroundColor: isActive ? theme.palette.secondary.light : grey[200],
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: theme.palette.secondary.contrastText,
    },
  },
  drawerAccordionDetails: {
    p: 0,
    pb: 2,
    overflow: 'visible',
  },
  paper: {},
})

export const TabUsers: React.FC<TabUsersProps> = () => {
  const theme = useTheme()
  const { session, captains, singleActives, singleInnactives, setActiveModal } = React.useContext(SessionContext)
  const isSessionActive = session?.state === SessionStateEnum.Active
  const styles = stylesThunk(theme, isSessionActive)

  const totalSessionMembers = (session?.activeMembers?.items?.length || 0) + (session?.mentionedUsers || []).length
  return (
    <>
      <Box sx={{ flex: '1 1', overflowX: 'hidden', overflowY: 'auto' }}>
        <Toolbar
          disableGutters
          sx={{
            backgroundColor: isSessionActive ? theme.palette.primary.main : grey[500],
            color: theme.palette.secondary.contrastText,
            '&.MuiToolbar-root': {
              minHeight: 50,
              pl: 2,
              pr: 1,
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
            <Typography
              sx={{
                fontSize: `1rem`,
                textTransform: 'uppercase',
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
              }}
            >
              {totalSessionMembers} Session Member{totalSessionMembers === 1 ? '' : 's'}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <AddUserButton
              disabled={!isSessionActive}
              onAdd={() => setActiveModal(DialogEnum.ADD_FRIEND)}
              onInvite={() => setActiveModal(DialogEnum.COLLABORATE)}
            />
          </Stack>
        </Toolbar>
        {captains.length > 0 && (
          <Accordion defaultExpanded={true} disableGutters>
            <AccordionSummary expandIcon={<ExpandMore />} sx={styles.drawerAccordionSummaryCrews}>
              <Typography>
                {captains.length} Crew{captains.length === 1 ? '' : 's'}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
            </AccordionSummary>
            <AccordionDetails sx={styles.drawerAccordionDetails}>
              <CrewUserList />
            </AccordionDetails>
          </Accordion>
        )}
        {captains.length > 0 && (
          <Accordion defaultExpanded={true} disableGutters>
            <AccordionSummary expandIcon={<ExpandMore />} sx={styles.drawerAccordionSummaryActive}>
              <Typography>
                {singleActives.length + singleInnactives.length} Solo Player
                {singleActives.length + singleInnactives.length === 1 ? '' : 's'}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
            </AccordionSummary>
            <AccordionDetails sx={styles.drawerAccordionDetails}>
              <SessionUserList />
            </AccordionDetails>
          </Accordion>
        )}

        {captains.length === 0 && <SessionUserList />}
      </Box>
    </>
  )
}
