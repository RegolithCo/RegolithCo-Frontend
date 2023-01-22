import * as React from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  MenuItem,
  Select,
  Switch,
  SxProps,
  TextField,
  Theme,
  Typography,
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
import { Delete, Lock, LockOpen, Person, RestartAlt, Save, Settings, StopCircle } from '@mui/icons-material'
import { RefineryControl } from '../../fields/RefineryControl'
import { RefineryMethodControl } from '../../fields/RefiningMethodControl'
import { ShipOreChooser } from '../../fields/ShipOreChooser'
import { VehicleOreChooser } from '../../fields/VehicleOreChooser'
import { CrewShareTemplateTable } from '../../fields/crewshare/CrewShareTemplateTable'
import { omit } from 'lodash'
import { DeleteModal } from '../../modals/DeleteModal'

export interface ShareModalProps {
  // Use this for the session version
  session?: Session
  title?: string
  description?: string
  // For the profile version we only have the sessionSettings
  sessionSettings?: SessionSettings
  open: boolean
  onChangeSession?: (session: SessionInput, newSettings: DestructuredSettings) => void
  onChangeSettings?: (newSettings: DestructuredSettings) => void
  onCloseSession?: () => void
  onDeleteSession?: () => void
  onModalClose: () => void
  resetDefaultUserSettings?: () => void
  resetDefaultSystemSettings?: () => void
  userSuggest?: UserSuggest
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  dialog: {
    '& .MuiDialog-paper': {
      border: '1px solid #444444',
      background: '#111111ee',
    },
  },
  dialogTitle: {
    // p: 0,
    display: 'flex',
    backgroundColor: '#600000',
    color: theme.palette.getContrastText('#600000'),
    borderBottom: `1px solid #9d0c0c`,
    mb: 2,
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
    fontWeight: 'bold',
    fontSize: '1rem',
    mb: 2,
    lineHeight: 1.5,
    color: theme.palette.primary.dark,
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

export const SessionSettingsModal: React.FC<ShareModalProps> = ({
  session,
  sessionSettings,
  title,
  description,
  open,
  userSuggest,
  onChangeSession,
  onChangeSettings,
  onModalClose: onClose,
  onCloseSession,
  onDeleteSession,
  resetDefaultSystemSettings,
  resetDefaultUserSettings,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const [forceRefresh, setForceRefresh] = React.useState(0)
  const [newSession, setNewSession] = React.useState<SessionInput | null>(null)

  const [newSettings, setNewSettings] = React.useState<DestructuredSettings>(makeNewSettings(session, sessionSettings))
  const [nameValid, setNameValid] = React.useState(true)
  const [notevalid, setNoteValid] = React.useState(true)

  const [closeConfirmModal, setCLoseConfirmModal] = React.useState(false)
  const [deleteConfirmModal, setDeleteConfirmModal] = React.useState(false)

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
    <Dialog open={open} onClose={onClose} maxWidth="lg" sx={styles.dialog}>
      <DialogTitle sx={styles.dialogTitle}>
        <Settings sx={{ fontSize: '2rem', mr: 2 }} />
        <Box
          sx={{
            '& .MuiTypography-root': {
              // p: 0,
              // lineHeight: 1,
            },
          }}
        >
          <Typography component="div" variant="h5">
            {title || 'Session Settings'}
          </Typography>
          {description && (
            <Typography component="div" variant="caption">
              {description}
            </Typography>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container sx={styles.gridContainer} spacing={3}>
          <Grid xs={12} md={6}>
            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                Session Settings
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
                  (Optional) You can indicate where the mining is going to happen.
                </Typography>

                <Autocomplete
                  id="combo-box-demo"
                  options={planetOptions}
                  fullWidth
                  autoHighlight
                  sx={{ mb: 3 }}
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

                <FormControl fullWidth variant="outlined" sx={{ mb: 1 }}>
                  <InputLabel id="gwell">Location Type</InputLabel>
                  <Select
                    value={(newSettings.sessionSettings?.location as string) || ''}
                    fullWidth
                    variant="outlined"
                    label="Location Type"
                    size="small"
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
              </Box>
            </Box>

            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                Activity Type (Optional)
              </Typography>
              <Box sx={styles.section}>
                <Box sx={{ px: 5, py: 2 }}>
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
                  label="Make these rows mandatory for all work orders in this session?"
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
                  label={`Require users to be added to the "Mentioned" list in order to join this session.`}
                />
              </Box>
            </Box>

            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                Refinery / Ore Defaults
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
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          Cancel
        </Button>

        <div style={{ flexGrow: 1 }} />

        {session && (
          <Button variant="contained" startIcon={<Delete />} onClick={() => setDeleteConfirmModal(true)} color="error">
            Delete Session
          </Button>
        )}
        {session?.state === SessionStateEnum.Active && (
          <Button
            variant="contained"
            startIcon={<StopCircle />}
            onClick={() => setCLoseConfirmModal(true)}
            color="secondary"
          >
            End Session
          </Button>
        )}
        <div style={{ flexGrow: 1 }} />

        <Button
          color="info"
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
          variant="contained"
          onClick={() => {
            session && onChangeSession && onChangeSession(newSession as SessionInput, newSettings)
            sessionSettings && onChangeSettings && onChangeSettings(newSettings)
          }}
        >
          Save
        </Button>
      </DialogActions>
      <DeleteModal
        title={closeConfirmModal ? 'Permanently close session?' : 'Permanently DELETE session?'}
        confirmBtnText={closeConfirmModal ? 'Yes, End Session!' : 'Yes, Delete Session!'}
        cancelBtnText="No, keep session"
        message={
          closeConfirmModal ? (
            <DialogContentText id="alert-dialog-description">
              Closing a session will lock it permanently. Crew shares can still be marked paid but no new jobs or
              scouting finds can be added and no new users can join. THIS IS A PERMANENT ACTION. Are you sure you want
              to close this session?
            </DialogContentText>
          ) : (
            <DialogContentText id="alert-dialog-description">
              Deleting a session will remove it permanently. Work orders and crew shares will be irrecoverably lots.
              THIS IS A PERMANENT ACTION. Are you sure you want to delete this session?
            </DialogContentText>
          )
        }
        open={closeConfirmModal || deleteConfirmModal}
        onClose={() => {
          closeConfirmModal && setCLoseConfirmModal(false)
          deleteConfirmModal && setDeleteConfirmModal(false)
        }}
        onConfirm={() => {
          setCLoseConfirmModal(false)
          setDeleteConfirmModal(false)
          deleteConfirmModal && onDeleteSession && onDeleteSession()
          closeConfirmModal && onCloseSession && onCloseSession()
        }}
      />
    </Dialog>
  )
}
