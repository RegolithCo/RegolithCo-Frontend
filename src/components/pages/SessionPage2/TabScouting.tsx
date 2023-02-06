import * as React from 'react'

import { ScoutingFindStateEnum, Session, SessionStateEnum, SessionUser, ScoutingFind } from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import {
  Box,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  SxProps,
  Theme,
  Typography,
  useTheme,
  Zoom,
} from '@mui/material'
import { ScoutingAddFAB } from '../../fields/ScoutingAddFAB'
import { ClusterCard } from '../../cards/ClusterCard'
import { newEmptyScoutingFind } from '../../../lib/newObjectFactories'
import { DialogEnum } from './SessionPage.container'
import { fontFamilies } from '../../../theme'

export interface TabScoutingProps {
  session: Session
  sessionUser: SessionUser
  // For the two modals that take us deeper
  openScoutingModal: (scoutinfFindId?: string) => void
  //
  setNewScoutingFind: (scoutingFind: ScoutingFind) => void
  setActiveModal: (modal: DialogEnum) => void
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  gridContainer: {
    [theme.breakpoints.up('md')]: {},
  },
  container: {
    pt: 2,
    '& .MuiAccordion-root': {
      backgroundColor: '#0e0c1baa',
    },
    '& .MuiAccordionDetails-root': {
      p: 0,
    },
    '& .MuiTable-root': {
      background: '#12111555',
    },
  },
  section: {},
  sectionTitle: {
    '&::before': {
      content: '""',
    },
    // color: theme.palette.primary.dark,
    // fontFamily: fontFamilies.robotoMono,
    '& .MuiTypography-root': {
      fontSize: '1rem',
      lineHeight: 2,
      // color: theme.palette.primary.dark,
      // fontFamily: fontFamilies.robotoMono,
      // fontWeight: 'bold',
      textShadow: '0 0 1px #000',
    },
    borderBottom: '2px solid',
  },
  sectionBody: {
    py: 1,
    pl: 2,
    pr: 1,
    mb: 2,
  },
})

export const TabScouting: React.FC<TabScoutingProps> = ({
  session,
  sessionUser,
  openScoutingModal,
  setNewScoutingFind,
  setActiveModal,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const isActive = session.state === SessionStateEnum.Active
  // Filtering for the accordions
  const [filterClosedScout, setFilterClosedScout] = React.useState(false)
  const badStates: ScoutingFindStateEnum[] = [ScoutingFindStateEnum.Abandonned, ScoutingFindStateEnum.Depleted]
  const allScouts = session.scouting?.items || []
  const filteredScouts = allScouts.filter(({ state }) => !filterClosedScout || badStates.indexOf(state) < 0)
  filteredScouts.sort((a, b) => b.createdAt - a.createdAt)
  const scountingCounts = [filteredScouts.length, allScouts.length]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: 1000, ...styles.container }}>
      <Box sx={styles.sectionTitle}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>
            Scouting ({scountingCounts[0]}/{scountingCounts[1]})
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <FormGroup
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <FormControlLabel
              sx={{ mr: 3 }}
              labelPlacement="start"
              control={
                <Switch
                  color="secondary"
                  checked={filterClosedScout}
                  onChange={(e) => setFilterClosedScout(e.target.checked)}
                />
              }
              label="Hide Depleted/Abandoned"
            />
          </FormGroup>
        </Stack>
      </Box>

      <Grid container spacing={3} margin={0}>
        {filteredScouts.map((scouting, idx) => {
          return (
            <Grid
              key={`scoutingfind-${idx}`}
              sx={{
                '& *': {
                  cursor: 'pointer',
                },
              }}
              onClick={() => {
                openScoutingModal(scouting.scoutingFindId)
              }}
            >
              <Zoom in style={{ transitionDelay: `${200 * idx}ms` }}>
                <Box>
                  <ClusterCard key={idx} scoutingFind={scouting} />
                </Box>
              </Zoom>
            </Grid>
          )
        })}
      </Grid>
      <ScoutingAddFAB
        onClick={(scoutingType) => {
          setNewScoutingFind(newEmptyScoutingFind(session, sessionUser, scoutingType))
          setActiveModal(DialogEnum.ADD_SCOUTING)
        }}
        sessionSettings={session.sessionSettings}
        fabProps={{
          disabled: !isActive,
        }}
      />
    </Box>
  )
}
