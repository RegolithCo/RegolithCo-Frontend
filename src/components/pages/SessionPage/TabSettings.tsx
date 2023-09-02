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

export interface SessionSettingsTabProps {
  // Use this for the session version
  session?: Session
  title?: string
  description?: string
  scroll?: boolean
  // For the profile version we only have the sessionSettings
  sessionSettings?: SessionSettings
  onChangeSession?: (session: SessionInput, newSettings: DestructuredSettings) => void
  onChangeSettings?: (newSettings: DestructuredSettings) => void
  resetDefaultUserSettings?: () => void
  resetDefaultSystemSettings?: () => void
  setActiveModal?: (modal: DialogEnum) => void
  userSuggest?: UserSuggest
}

const stylesThunk = (theme: Theme, scroll?: boolean): Record<string, SxProps<Theme>> => ({
  tabContainerOuter: {
    background: '#121115aa',
    p: 2,
    overflow: scroll ? 'hidden' : undefined,
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

function makeNewSettings(session?: Session, sessionSettings?: SessionSettings) {
  return session
    ? destructureSettings(session.sessionSettings || { __typename: 'SessionSettings' })
    : destructureSettings(sessionSettings || { __typename: 'SessionSettings' })
}

export const SessionSettingsTab: React.FC<SessionSettingsTabProps> = ({
  session,
  sessionSettings,
  title,
  description,
  userSuggest,
  scroll,
  onChangeSession,
  onChangeSettings,
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
              <Typography component="div" sx={styles.sectionTitle}>
                General Settings
              </Typography>
              <Box sx={styles.sectionBody}>
                {/* NAME FIELD */}
                {session && (
                  <>
                    <TextField
                      value={displayValue.name || ''}
                      fullWidth
                      variant="outlined"
                      label="Session Name"
                      sx={{ mb: 1 }}
                      onChange={(e) => {
                        const newName = e.target.value
                        const valid = newName.length > 0
                        setNameValid(valid)
                        setNewSession({ ...newSession, name: newName })
                      }}
                    />
                    {/* NOTE FIELD */}
                    <TextField
                      id="outlined-multiline-flexible"
                      label="Session Note"
                      multiline
                      fullWidth
                      variant="outlined"
                      onChange={(e) => {
                        const newNote = e.target.value
                        const valid = newNote.length > 0
                        setNoteValid(valid)
                        setNewSession({ ...newSession, note: newNote })
                      }}
                      sx={{ mb: 2 }}
                      placeholder="Enter a note for this session..."
                      maxRows={4}
                      value={displayValue.note || ''}
                    />
                  </>
                )}
                <Typography variant="caption" paragraph component="div">
                  (Optional) You can indicate where the mining is going to happen. These settings are not enforced in
                  any way.
                </Typography>

                <Autocomplete
                  id="combo-box-demo"
                  options={planetOptions}
                  fullWidth
                  autoHighlight
                  sx={{ mb: 3 }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={gravWell ? { label: getPlanetName(gravWell), id: gravWell } : null}
                  onChange={(event, newValue) => {
                    setNewSettings({
                      ...newSettings,
                      sessionSettings: {
                        ...newSettings.sessionSettings,
                        gravityWell: newValue ? newValue.id : null,
                      },
                    })
                  }}
                  renderInput={(params) => <TextField {...params} label="Gravity Well" />}
                />

                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel id="gwell">Location Type</InputLabel>
                  <Select
                    value={(newSettings.sessionSettings?.location as string) || ''}
                    fullWidth
                    variant="outlined"
                    label="Location Type"
                    // size="small"
                    renderValue={(value: string) => (value === '' ? null : getLocationName(value as LocationEnum))}
                    onChange={(e) => {
                      const newLocation = e.target.value === '' ? null : (e.target.value as LocationEnum)
                      setNewSettings({
                        ...newSettings,
                        sessionSettings: {
                          ...newSettings.sessionSettings,
                          location: newLocation,
                        },
                      })
                    }}
                  >
                    <MenuItem value={''}>-- All / Any --</MenuItem>
                    {Object.values(LocationEnum).map((key) => (
                      <MenuItem key={key} value={key}>
                        {getLocationName(key)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {session && (
                  <Stack direction={mediumUp ? 'row' : 'column'} spacing={2} sx={{ mb: 2 }}>
                    {session?.state === SessionStateEnum.Active && (
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<StopCircle />}
                        onClick={() => {
                          setActiveModal && setActiveModal(DialogEnum.CLOSE_SESSION)
                        }}
                        color="secondary"
                      >
                        End Session
                      </Button>
                    )}
                    {session && (
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<Delete />}
                        onClick={() => {
                          setActiveModal && setActiveModal(DialogEnum.DELETE_SESSION)
                        }}
                        color="error"
                      >
                        Delete Session
                      </Button>
                    )}
                  </Stack>
                )}
              </Box>
            </Box>

            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                Activity Type
              </Typography>
              <Box sx={styles.section}>
                <Box sx={{ px: { xs: 1, sm: 2, md: 2 }, py: 2 }}>
                  <WorkOrderTypeChooser
                    allowNone
                    hideOther
                    value={newSettings.sessionSettings?.activity || undefined}
                    onChange={(newActivity) => {
                      setNewSettings({
                        ...newSettings,
                        sessionSettings: {
                          ...newSettings.sessionSettings,
                          activity: newActivity,
                        },
                      })
                    }}
                  />
                </Box>

                {newSettings.sessionSettings?.activity && (
                  <Typography variant="caption" component="div" gutterBottom color="primary" sx={{ mb: 2 }}>
                    Users will only be able to add workorders and scouting activities for "
                    {getActivityName(newSettings.sessionSettings?.activity)}".
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                Crew Share Defaults
              </Typography>
              <Typography variant="caption" component="div" gutterBottom sx={{ mb: 2 }}>
                These are the default crew shares that will be added to all new workorders. You can override these when
                creating a work order <strong>unless</strong> you click the lock switch below.
              </Typography>
              <Box sx={styles.sectionBody}>
                <CrewShareTemplateTable
                  onChange={(newTemplates) => {
                    const makeInputs: CrewShareTemplateInput[] = (newTemplates || []).map(
                      (t) => omit(t, ['__typename']) as CrewShareTemplateInput
                    )
                    setNewSettings({
                      ...newSettings,
                      crewSharesDefaults: makeInputs,
                    })
                  }}
                  onDeleteCrewShare={(scName) => {
                    const makeInputs: CrewShareTemplateInput[] = (newSettings.crewSharesDefaults || []).map(
                      (t) => omit(t, ['__typename']) as CrewShareTemplateInput
                    )
                    setNewSettings({
                      ...newSettings,
                      crewSharesDefaults: makeInputs.filter(({ scName: deleteMe }) => scName !== deleteMe),
                    })
                  }}
                  crewShareTemplates={
                    newSettings.crewSharesDefaults?.map((t) => ({
                      ...t,
                      __typename: 'CrewShareTemplate',
                    })) || []
                  }
                  userSuggest={userSuggest}
                />

                <FormControlLabel
                  checked={Boolean(newSettings.workOrderDefaults?.lockedFields?.includes('crewShares'))}
                  control={
                    <Switch
                      icon={<LockOpen />}
                      checkedIcon={<Lock />}
                      onChange={(e) => setNewMergeLockedFields('crewShares', e.target.checked)}
                    />
                  }
                  label="Make these rows mandatory?"
                />
              </Box>
            </Box>
          </Grid>
          {/* Work oreder defaults */}
          <Grid xs={12} md={6}>
            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                Session Join permissions
              </Typography>
              <Typography variant="caption" component="div" gutterBottom sx={{ mb: 2 }}>
                These settings control who can join this session. You can insist that users are verified, or you can use
                your "mentioned" list to control who can join.
              </Typography>
              <Box sx={styles.sectionBody}>
                <FormControlLabel
                  checked={Boolean(newSettings.sessionSettings?.allowUnverifiedUsers)}
                  control={
                    <Switch
                      onChange={(e) => {
                        setNewSettings({
                          ...newSettings,
                          sessionSettings: {
                            ...newSettings.sessionSettings,
                            allowUnverifiedUsers: e.target.checked,
                          },
                        })
                      }}
                    />
                  }
                  label="Allow unverified users to join"
                />

                <FormControlLabel
                  checked={Boolean(newSettings.sessionSettings?.specifyUsers)}
                  control={
                    <Switch
                      onChange={(e) => {
                        setNewSettings({
                          ...newSettings,
                          sessionSettings: {
                            ...newSettings.sessionSettings,
                            specifyUsers: e.target.checked,
                          },
                        })
                      }}
                    />
                  }
                  label={`Require joining users to be "Mentioned"`}
                />
              </Box>
            </Box>

            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                Refinery / Ore Defaults
              </Typography>
              <Typography variant="caption" component="div" gutterBottom sx={{ mb: 1 }}>
                These are the default settings that will be applied to all new workorders. You can override these
                defaults on a per-workorder basis unless you click the adjacent lock switch.
              </Typography>
              <Box sx={styles.sectionBody}>
                <List dense>
                  <ListItem>
                    <FormControlLabel
                      checked={Boolean(newSettings.workOrderDefaults?.includeTransferFee)}
                      control={
                        <Switch
                          onChange={(e) => {
                            setNewSettings({
                              ...newSettings,
                              workOrderDefaults: {
                                ...newSettings.workOrderDefaults,
                                includeTransferFee: e.target.checked,
                              },
                            })
                          }}
                        />
                      }
                      label="Subtract transfer fee"
                    />
                    <ListItemSecondaryAction>
                      <Checkbox
                        icon={<LockOpen />}
                        checked={Boolean(newSettings.workOrderDefaults?.lockedFields?.includes('includeTransferFee'))}
                        checkedIcon={<Lock />}
                        onChange={(e) => setNewMergeLockedFields('includeTransferFee', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  {(!newSettings.sessionSettings?.activity ||
                    newSettings.sessionSettings?.activity === ActivityEnum.ShipMining) && (
                    <>
                      <ListItem>
                        <FormControlLabel
                          checked={Boolean(newSettings.workOrderDefaults?.isRefined)}
                          control={
                            <Switch
                              onChange={(e) => {
                                setNewSettings({
                                  ...newSettings,
                                  workOrderDefaults: {
                                    ...newSettings.workOrderDefaults,
                                    isRefined: e.target.checked,
                                  },
                                })
                              }}
                            />
                          }
                          label="Use Refinery"
                        />
                        <ListItemSecondaryAction>
                          <Checkbox
                            icon={<LockOpen />}
                            checked={Boolean(newSettings.workOrderDefaults?.lockedFields?.includes('isRefined'))}
                            checkedIcon={<Lock />}
                            onChange={(e) => setNewMergeLockedFields('isRefined', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      {newSettings.workOrderDefaults?.isRefined && (
                        <>
                          <ListItem>
                            <FormControlLabel
                              checked={Boolean(newSettings.workOrderDefaults?.shareRefinedValue)}
                              control={
                                <Switch
                                  onChange={(e) => {
                                    setNewSettings({
                                      ...newSettings,
                                      workOrderDefaults: {
                                        ...newSettings.workOrderDefaults,
                                        shareRefinedValue: e.target.checked,
                                      },
                                    })
                                  }}
                                />
                              }
                              label="Share refined value"
                            />
                            <ListItemSecondaryAction>
                              <Checkbox
                                icon={<LockOpen />}
                                checked={Boolean(
                                  newSettings.workOrderDefaults?.lockedFields?.includes('shareRefinedValue')
                                )}
                                checkedIcon={<Lock />}
                                onChange={(e) => setNewMergeLockedFields('shareRefinedValue', e.target.checked)}
                              />
                            </ListItemSecondaryAction>
                          </ListItem>

                          <ListItem>
                            <FormControl fullWidth variant="standard" sx={{ px: 2 }}>
                              <InputLabel id="gwell">Default Refinery</InputLabel>
                              <RefineryControl
                                settingsScreen
                                onChange={(refinery) => {
                                  setNewSettings({
                                    ...newSettings,
                                    workOrderDefaults: {
                                      ...newSettings.workOrderDefaults,
                                      refinery: refinery || null,
                                    },
                                  })
                                }}
                                allowNone
                                value={newSettings.workOrderDefaults?.refinery || undefined}
                              />
                            </FormControl>
                            <ListItemSecondaryAction>
                              <Checkbox
                                icon={<LockOpen />}
                                checked={Boolean(newSettings.workOrderDefaults?.lockedFields?.includes('refinery'))}
                                checkedIcon={<Lock />}
                                onChange={(e) => setNewMergeLockedFields('refinery', e.target.checked)}
                              />
                            </ListItemSecondaryAction>
                          </ListItem>
                          <ListItem>
                            <FormControl fullWidth variant="standard" sx={{ px: 2 }}>
                              <InputLabel id="gwell">Default Refining Method</InputLabel>
                              <RefineryMethodControl
                                settingsScreen
                                onChange={(method) => {
                                  setNewSettings({
                                    ...newSettings,
                                    workOrderDefaults: {
                                      ...newSettings.workOrderDefaults,
                                      method: method || null,
                                    },
                                  })
                                }}
                                allowNone
                                value={newSettings.workOrderDefaults?.method || undefined}
                              />
                            </FormControl>
                            <ListItemSecondaryAction>
                              <Checkbox
                                icon={<LockOpen />}
                                checked={Boolean(newSettings.workOrderDefaults?.lockedFields?.includes('method'))}
                                checkedIcon={<Lock />}
                                onChange={(e) => setNewMergeLockedFields('method', e.target.checked)}
                              />
                            </ListItemSecondaryAction>
                          </ListItem>
                        </>
                      )}
                    </>
                  )}
                  {(!newSettings.sessionSettings?.activity ||
                    newSettings.sessionSettings?.activity === ActivityEnum.ShipMining) && (
                    <ListItem>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="caption">Default Vehicle Ore Rows</Typography>
                        <ShipOreChooser
                          values={newSettings.shipOreDefaults || []}
                          multiple
                          onChange={(newVals) => {
                            setNewSettings({
                              ...newSettings,
                              shipOreDefaults: newVals,
                            })
                          }}
                        />
                      </Box>
                    </ListItem>
                  )}
                  {(!newSettings.sessionSettings?.activity ||
                    newSettings.sessionSettings?.activity === ActivityEnum.VehicleMining) && (
                    <ListItem>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="caption">Default Vehicle Ore Rows</Typography>
                        <VehicleOreChooser
                          values={newSettings.vehicleOreDefaults || []}
                          multiple
                          onChange={(newVals) => {
                            setNewSettings({
                              ...newSettings,
                              vehicleOreDefaults: newVals,
                            })
                          }}
                        />
                      </Box>
                    </ListItem>
                  )}
                </List>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Stack
        sx={mediumUp ? { borderTop: '2px solid', py: 2 } : undefined}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        spacing={1}
        alignItems="center"
      >
        <Box sx={{ flexGrow: 1 }} />
        <Button
          color="info"
          fullWidth={!mediumUp}
          startIcon={<RestartAlt />}
          disabled={!valid}
          variant="outlined"
          onClick={() => {
            resetDefaultSystemSettings && resetDefaultSystemSettings()
            setForceRefresh((f) => f + 1)
          }}
        >
          System Defaults
        </Button>
        {session && (
          <Button
            color="secondary"
            fullWidth={!mediumUp}
            startIcon={<Person />}
            disabled={!valid}
            variant="outlined"
            onClick={() => {
              resetDefaultUserSettings && resetDefaultUserSettings()
              setForceRefresh((f) => f + 1)
            }}
          >
            My Defaults
          </Button>
        )}
        <Button
          color="primary"
          startIcon={<Save />}
          disabled={!valid}
          fullWidth={!mediumUp}
          variant="contained"
          onClick={() => {
            session && onChangeSession && onChangeSession(newSession as SessionInput, newSettings)
            sessionSettings && onChangeSettings && onChangeSettings(newSettings)
          }}
        >
          Save
        </Button>
      </Stack>
    </Box>
  )
}
