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
import { fontFamilies } from '../../../theme'
import { SessionContext } from '../../../context/session.context'

export interface TabScoutingProps {
  propA?: string
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  gridContainer: {
    [theme.breakpoints.up('md')]: {},
  },
  container: {
    backgroundColor: '#0e0c1baa',
    position: 'relative',
  },
  section: {},
  sectionTitle: {
    px: 2,
    py: 0.65,
    background: '#121115aa',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& .MuiTypography-root': {
      fontSize: '1.2rem',
      lineHeight: 2,
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
        lineHeight: 1,
      },
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
    '& .MuiFormControlLabel-root .MuiTypography-root': {
      fontStyle: 'italic',
      fontSize: '0.7rem',
    },
    // Just for scouting,
    mb: 3,
  },
  sectionBody: {
    py: 1,
    pl: 2,
    pr: 1,
    mb: 2,
  },
})

export const TabScouting: React.FC<TabScoutingProps> = () => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const { session, openScoutingModal, createNewScoutingFind, setActiveModal } = React.useContext(SessionContext)
  const isActive = session.state === SessionStateEnum.Active
  // Filtering for the accordions
  const [filterClosedScout, setFilterClosedScout] = React.useState(false)
  const badStates: ScoutingFindStateEnum[] = [ScoutingFindStateEnum.Abandonned, ScoutingFindStateEnum.Depleted]
  const allScouts = session.scouting?.items || []
  const filteredScouts = allScouts.filter(({ state }) => !filterClosedScout || badStates.indexOf(state) < 0)
  filteredScouts.sort((a, b) => b.createdAt - a.createdAt)
  const scountingCounts = [filteredScouts.length, allScouts.length]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', ...styles.container }}>
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
        onClick={createNewScoutingFind}
        sessionSettings={session.sessionSettings}
        fabProps={{
          disabled: !isActive,
        }}
      />
    </Box>
  )
}
