import * as React from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  MenuItem,
  Select,
  Stack,
  Switch,
  SxProps,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  ActivityEnum,
  getActivityName,
  DestructuredSettings,
  destructureSettings,
  LocationEnum,
  getLocationName,
  PlanetEnum,
  getPlanetName,
  Session,
  SessionInput,
  SessionSettings,
  SessionStateEnum,
  UserSuggest,
  CrewShareTemplateInput,
} from '@regolithco/common'
import { WorkOrderTypeChooser } from '../../fields/WorkOrderTypeChooser'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Delete, Lock, LockOpen, Person, RestartAlt, Save, StopCircle } from '@mui/icons-material'
import { RefineryControl } from '../../fields/RefineryControl'
import { RefineryMethodControl } from '../../fields/RefiningMethodControl'
import { ShipOreChooser } from '../../fields/ShipOreChooser'
import { VehicleOreChooser } from '../../fields/VehicleOreChooser'
import { CrewShareTemplateTable } from '../../fields/crewshare/CrewShareTemplateTable'
import { omit } from 'lodash'
import { fontFamilies } from '../../../theme'
import { DialogEnum } from '../../../context/session.context'
import { SalvageOreChooser } from '../../fields/SalvageOreChooser'

export interface SessionSettingsTabProps {
  // Use this for the session version
  session?: Session
  scroll?: boolean
  // For the profile version we only have the sessionSettings
  sessionSettings?: SessionSettings
  onChangeSession?: (session: SessionInput, newSettings: DestructuredSettings) => void
  onChangeSettings?: (newSettings: DestructuredSettings) => void
  endSession?: () => void
  deleteSession?: () => void
  resetDefaultUserSettings?: () => void
  resetDefaultSystemSettings?: () => void
  setActiveModal?: (modal: DialogEnum) => void
  userSuggest?: UserSuggest
}

const stylesThunk = (theme: Theme, scroll?: boolean): Record<string, SxProps<Theme>> => ({
  tabContainerOuter: {
    background: '#121115aa',
    p: 2,
    overflowY: 'auto',
    overflowX: 'hidden',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflowY: scroll ? 'auto' : undefined,
      overflowX: scroll ? 'hidden' : undefined,
    },
  },
  tabContainerInner: {
    flexGrow: 1,
    [theme.breakpoints.up('md')]: {
      overflowY: scroll ? 'auto' : undefined,
      overflowX: scroll ? 'hidden' : undefined,
    },
  },
  gridContainer: {
    [theme.breakpoints.up('md')]: {},
  },
  section: {},
  sectionTitle: {
    '&::before': {
      content: '""',
    },
    // fontFamily: fontFamilies.robotoMono,
    fontSize: '1rem',
    mb: 2,
    lineHeight: 1.5,
    color: theme.palette.primary.main,
    fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
    textShadow: '0 0 1px #000',
    borderBottom: '2px solid',
  },
  sectionBody: {
    py: 1,
    pl: 2,
    pr: 1,
    mb: 2,
  },
})

const planetOptions: { label: string; id: PlanetEnum }[] = Object.values(PlanetEnum).map((value) => ({
  label: getPlanetName(value),
  id: value,
}))
planetOptions.sort((a, b) => a.label.localeCompare(b.label))

const locationTypeValues: LocationEnum[] = [
  LocationEnum.Space,
  LocationEnum.Ring,
  LocationEnum.Surface,
  LocationEnum.Cave,
]

function makeNewSettings(session?: Session, sessionSettings?: SessionSettings) {
  return session
    ? destructureSettings(session.sessionSettings || { __typename: 'SessionSettings' })
    : destructureSettings(sessionSettings || { __typename: 'SessionSettings' })
}

export const SessionSettingsTab: React.FC<SessionSettingsTabProps> = ({
  session,
  sessionSettings,
  userSuggest,
  scroll,
  onChangeSession,
  onChangeSettings,
  endSession,
  deleteSession,
  setActiveModal,
  resetDefaultSystemSettings,
  resetDefaultUserSettings,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme, scroll)
  const [forceRefresh, setForceRefresh] = React.useState(0)
  const [newSession, setNewSession] = React.useState<SessionInput | null>(null)
  const mediumUp = useMediaQuery(theme.breakpoints.up('md'))

  const [newSettings, setNewSettings] = React.useState<DestructuredSettings>(makeNewSettings(session, sessionSettings))
  const [nameValid, setNameValid] = React.useState(true)
  const [notevalid, setNoteValid] = React.useState(true)

  React.useEffect(() => {
    setNewSettings(makeNewSettings(session, sessionSettings))
  }, [
    session,
    sessionSettings,
    sessionSettings?.workOrderDefaults,
    sessionSettings?.workOrderDefaults?.shipOres,
    sessionSettings?.workOrderDefaults?.vehicleOres,
    sessionSettings?.workOrderDefaults?.crewShares,
    forceRefresh,
  ])

  const displayValue: Session = Object.assign({}, session, newSession)

  // Conveneince methods for merging
  const setNewMergeLockedFields = (fieldName: string, isChecked: boolean) => {
    let newLockedFields = newSettings.workOrderDefaults?.lockedFields || []
    if (isChecked) {
      newLockedFields = [...newLockedFields, fieldName]
    } else {
      newLockedFields = newLockedFields.filter((f) => f !== fieldName)
    }
    setNewSettings({
      ...newSettings,
      workOrderDefaults: {
        ...newSettings.workOrderDefaults,
        lockedFields: Array.from(new Set(newLockedFields)),
      },
    })
  }
  const gravWell = newSettings.sessionSettings?.gravityWell || null
  const valid = nameValid

  return (
    <Box sx={styles.tabContainerOuter}>
      {/* Here's our scrollbox */}
      <Box sx={styles.tabContainerInner}>
        <Grid container sx={styles.gridContainer} spacing={3}>
          <Grid xs={12} md={6}>
            <Box sx={styles.section}>
              {session && (
                <Box sx={styles.section}>
                  <Typography component="div" sx={styles.sectionTitle}>
                    Nuclear Options:
                  </Typography>
                </Box>
              )}
              {session && (
                <Box sx={styles.section}>
                  <Typography component="div" sx={styles.sectionTitle}>
                    General Settings
                  </Typography>
                  <Box sx={styles.sectionBody}>
                    <TextField />
                    {/* NOTE FIELD */}
                    <TextField multiline />
                    <Typography variant="caption" paragraph component="div" color="secondary.dark">
                      NOTE: <strong>name</strong> and <strong>note</strong> appear in the share meta link so don't put
                      any secrets or identifying info if you're worried about pirates seeing it.
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
