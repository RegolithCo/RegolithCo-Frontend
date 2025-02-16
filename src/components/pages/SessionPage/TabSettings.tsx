import * as React from 'react'
import {
  alpha,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  keyframes,
  List,
  ListItem,
  ListItemSecondaryAction,
  MenuItem,
  PaletteColor,
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
  Session,
  SessionInput,
  SessionSettings,
  SessionStateEnum,
  UserSuggest,
  CrewShareTemplateInput,
  DiscordGuild,
} from '@regolithco/common'
import { WorkOrderTypeChooser } from '../../fields/WorkOrderTypeChooser'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Delete, Lock, LockOpen, Person, PlayArrow, RestartAlt, Save, StopCircle } from '@mui/icons-material'
import { RefineryControl } from '../../fields/RefineryControl'
import { RefineryMethodControl } from '../../fields/RefiningMethodControl'
import { ShipOreChooser } from '../../fields/ShipOreChooser'
import { VehicleOreChooser } from '../../fields/VehicleOreChooser'
import { CrewShareTemplateTable } from '../../fields/crewshare/CrewShareTemplateTable'
import { omit } from 'lodash'
import { fontFamilies } from '../../../theme'
import { DialogEnum } from '../../../context/session.context'
import { SalvageOreChooser } from '../../fields/SalvageOreChooser'
import { isEqual } from 'lodash'
import { DiscordServerControl } from '../../fields/DiscordServerControl'
import { GravityWellChooser } from '../../fields/GravityWellChooser'
import { SystemChooser } from '../../fields/SystemChooser'
import { UserProfileContext } from '../../../context/auth.context'

export interface SessionSettingsTabProps {
  // Use this for the session version
  session?: Session
  scroll?: boolean
  // For the profile version we only have the sessionSettings
  sessionSettings?: SessionSettings
  onChangeSession?: (session: SessionInput, newSettings: DestructuredSettings) => void
  onChangeSettings?: (newSettings: DestructuredSettings) => void
  endSession?: () => void
  reOpenSession?: () => void
  deleteSession?: () => void
  resetDefaultUserSettings?: () => void
  resetDefaultSystemSettings?: () => void
  setActiveModal?: (modal: DialogEnum) => void
  userSuggest?: UserSuggest
}

const pulse = (color: PaletteColor) => keyframes`
0% { 
  /* box-shadow: 0 0 0 0 transparent;  */
  color: ${color.dark} 
}
50% { 
  /* box-shadow: 0 0 5px 5px ${alpha(color.light, 0.5)};  */
  color: ${color.light} 
}
100% { 
  box-shadow: 0 0 0 0 transparent; 
  /* color:  ${color.dark} */
}
`

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

// const planetOptions: { label: string; id: PlanetEnum }[] = Object.values(PlanetEnum).map((value) => ({
//   label: getPlanetName(value),
//   id: value,
// }))
// planetOptions.sort((a, b) => a.label.localeCompare(b.label))

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
  reOpenSession,
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
  const [oldSettings, setOldSettings] = React.useState<DestructuredSettings>(makeNewSettings(session, sessionSettings))
  const [newSettings, setNewSettings] = React.useState<DestructuredSettings>(makeNewSettings(session, sessionSettings))
  const [nameValid, setNameValid] = React.useState(true)
  const [notevalid, setNoteValid] = React.useState(true)
  const { myProfile } = React.useContext(UserProfileContext)
  const isDirty = React.useMemo(() => !isEqual(oldSettings, newSettings), [oldSettings, newSettings])

  React.useEffect(() => {
    const incomingSettings = makeNewSettings(session, sessionSettings)
    // Do a deep object compare and only update if the session settings actually changed
    if (!isEqual(oldSettings, incomingSettings)) {
      // We want to update these as infrequently as possible because we may lose work
      // log.debug('settings CHANGED', JSON.stringify(newSettings), JSON.stringify(incomingSettings))
      setOldSettings(incomingSettings)
      setNewSettings(incomingSettings)
    }
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
                  <Box sx={styles.sectionBody}>
                    <Stack direction={mediumUp ? 'row' : 'column'} spacing={2}>
                      {session?.state === SessionStateEnum.Active && (
                        <Button
                          variant="contained"
                          fullWidth
                          disabled={!endSession}
                          startIcon={<StopCircle />}
                          onClick={() => {
                            if (endSession) endSession()
                            if (setActiveModal) setActiveModal(DialogEnum.CLOSE_SESSION)
                          }}
                          color="secondary"
                        >
                          Close Session
                        </Button>
                      )}
                      {session?.state === SessionStateEnum.Closed && (
                        <Button
                          variant="contained"
                          fullWidth
                          disabled={!endSession}
                          startIcon={<PlayArrow />}
                          onClick={() => {
                            if (reOpenSession) reOpenSession()
                          }}
                          color="success"
                        >
                          Re-open Session
                        </Button>
                      )}
                      {session && (
                        <Button
                          variant="contained"
                          fullWidth
                          disabled={!deleteSession}
                          startIcon={<Delete />}
                          onClick={() => {
                            if (deleteSession) deleteSession()
                            if (setActiveModal) setActiveModal(DialogEnum.DELETE_SESSION)
                          }}
                          color="error"
                        >
                          Delete Session
                        </Button>
                      )}
                    </Stack>
                  </Box>
                  <Typography component="div" variant="caption" paragraph>
                    Sessions close automatically after 48 hours but can be re-opened. You can still edit work orders on
                    a closed session.
                  </Typography>
                </Box>
              )}
              {session && (
                <Box sx={styles.section}>
                  <Typography component="div" sx={styles.sectionTitle}>
                    General Settings
                  </Typography>
                  <Box sx={styles.sectionBody}>
                    <TextField
                      value={displayValue.name || ''}
                      fullWidth
                      variant="outlined"
                      label="Session Name"
                      sx={{ mb: 1 }}
                      helperText={`${(displayValue.name || '').length} / 150`}
                      onChange={(e) => {
                        let newName = e.target.value
                        const valid = newName.length > 0
                        // Trim to 255 chars.
                        if (newName.length > 150) {
                          newName = newName.substring(0, 150)
                        }
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
                        let newNote = e.target.value
                        const valid = newNote.length > 0
                        // Trim to 255 chars.
                        if (newNote.length > 255) {
                          newNote = newNote.substring(0, 255)
                        }
                        setNoteValid(valid)
                        setNewSession({ ...newSession, note: newNote })
                      }}
                      sx={{ mb: 2 }}
                      placeholder="Enter a note for this session..."
                      maxRows={4}
                      helperText={`${(displayValue.note || '').length} / 255`}
                      value={displayValue.note || ''}
                    />
                    <Typography variant="caption" paragraph component="div" color="secondary.dark">
                      NOTE: <strong>name</strong> and <strong>note</strong> appear in the share meta link so don't put
                      any secrets or identifying info if you're worried about pirates seeing it.
                    </Typography>
                  </Box>
                </Box>
              )}
              <Box sx={styles.section}>
                <Typography component="div" sx={styles.sectionTitle}>
                  Session Location
                </Typography>
                <Box sx={styles.sectionBody}>
                  <GravityWellChooser
                    filterToSystem={newSettings.sessionSettings?.systemFilter}
                    onClick={(choice) => {
                      setNewSettings({
                        ...newSettings,
                        sessionSettings: {
                          ...newSettings.sessionSettings,
                          gravityWell: choice,
                        },
                      })
                    }}
                    wellId={gravWell}
                  />
                  <Stack direction={mediumUp ? 'row' : 'column'} spacing={2} sx={{ mb: 2 }}>
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
                        {locationTypeValues.map((key) => (
                          <MenuItem key={key} value={key}>
                            {getLocationName(key)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                  <Typography variant="caption" paragraph component="div">
                    (Optional) You can indicate where the mining is going to happen. These settings are not enforced in
                    any way and are only visible to active session members.
                  </Typography>
                  <SystemChooser
                    label="System Filter"
                    blankLabel="All Systems (No Filter)"
                    value={newSettings.sessionSettings?.systemFilter || undefined}
                    onChange={(newSystem) => {
                      setNewSettings({
                        ...newSettings,
                        sessionSettings: {
                          ...newSettings.sessionSettings,
                          systemFilter: newSystem,
                        },
                      })
                    }}
                  />
                  <Typography variant="caption" paragraph component="div">
                    This will filter the REFINERIES and GRAVITY WELLS to only the selected system. Prices and Market
                    lookups are not filtered.
                  </Typography>
                  <Typography variant="caption" paragraph component="div" color="primary.main">
                    NOTE: If you plan on mining, refining and/or selling in different systems it's best to leave blank.
                  </Typography>
                </Box>
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
                      crewSharesDefaults: makeInputs.filter(({ payeeScName: deleteMe }) => scName !== deleteMe),
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
                These settings control who can join this session. You can insist that users must be verified to join or
                you can limit the session to only users that are already listed.
              </Typography>
              <Box sx={styles.sectionBody}>
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
                  label={`Require user mention to join.`}
                />
                <FormControlLabel
                  checked={!newSettings.sessionSettings?.allowUnverifiedUsers}
                  control={
                    <Switch
                      onChange={(e) => {
                        setNewSettings({
                          ...newSettings,
                          sessionSettings: {
                            ...newSettings.sessionSettings,
                            allowUnverifiedUsers: !e.target.checked,
                          },
                        })
                      }}
                    />
                  }
                  label="Require user verification to join."
                />
                <DiscordServerControl
                  discordGuild={newSettings.sessionSettings?.lockToDiscordGuild as DiscordGuild}
                  onChange={(guild) => {
                    setNewSettings({
                      ...newSettings,
                      sessionSettings: {
                        ...newSettings.sessionSettings,
                        lockToDiscordGuild: guild,
                      },
                    })
                  }}
                  isDiscordEnabled={Boolean(myProfile?.discordGuilds && myProfile.discordGuilds.length > 0)}
                  options={myProfile?.discordGuilds || []}
                />

                {/* <FormControlLabel
                  checked={Boolean(newSettings.sessionSettings?.specifyUsers)}
                  control={
                    <Switch
                      onChange={(e) => {
                        setNewSettings({
                          ...newSettings,
                          sessionSettings: {
                            ...newSettings.sessionSettings,
                            usersCanAddUsers: e.target.checked,
                          },
                        })
                      }}
                    />
                  }
                  label={`Users can add unlisted users to work orders.`}
                /> */}

                {/* <FormControlLabel
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
                  label={`Users can invite other users to the session.`}
                /> */}
              </Box>
            </Box>

            <Box sx={styles.section}>
              <Typography component="div" sx={styles.sectionTitle}>
                Roles
              </Typography>
              <Box sx={styles.sectionBody}>
                <FormControl component="fieldset" variant="standard">
                  <FormLabel component="legend">Allow users to self-assign roles:</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!newSettings.sessionSettings?.controlledShipRole}
                          onChange={(e) => {
                            setNewSettings({
                              ...newSettings,
                              sessionSettings: {
                                ...newSettings.sessionSettings,
                                controlledShipRole: !e.target.checked,
                              },
                            })
                          }}
                        />
                      }
                      label="Ship roles"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!newSettings.sessionSettings?.controlledSessionRole}
                          onChange={(e) => {
                            setNewSettings({
                              ...newSettings,
                              sessionSettings: {
                                ...newSettings.sessionSettings,
                                controlledSessionRole: !e.target.checked,
                              },
                            })
                          }}
                        />
                      }
                      label="Session roles"
                    />
                  </FormGroup>
                </FormControl>
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
                <List
                  dense
                  sx={{
                    '& .MuiListItem-root': {
                      pl: 0,
                    },
                  }}
                >
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
                                filterToSystem={newSettings.sessionSettings?.systemFilter}
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
                          showAllBtn
                          showNoneBtn
                          showInnert
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
                  {(!newSettings.sessionSettings?.activity ||
                    newSettings.sessionSettings?.activity === ActivityEnum.Salvage) && (
                    <ListItem>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="caption">Default Salvage Material Rows</Typography>
                        <SalvageOreChooser
                          values={newSettings.salvageOreDefaults || []}
                          multiple
                          onChange={(newVals) => {
                            setNewSettings({
                              ...newSettings,
                              salvageOreDefaults: newVals,
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
        {isDirty && (
          <Typography
            variant="body1"
            component="div"
            color="error"
            sx={{
              textTransform: 'uppercase',
              fontFamily: fontFamilies.robotoMono,
              fontWeight: 'bold',
              animation: `${pulse(theme.palette.error)} 1s infinite`,
              // borderRadius: 2,
              px: 2,
              py: 1,
              // border: `2px solid ${theme.palette.error.main}`,
            }}
          >
            [[Unsaved changes]]
          </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button
          color="info"
          fullWidth={!mediumUp}
          startIcon={<RestartAlt />}
          disabled={!valid}
          variant="outlined"
          onClick={() => {
            if (resetDefaultSystemSettings) resetDefaultSystemSettings()
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
              if (resetDefaultUserSettings) resetDefaultUserSettings()
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
            if (session && onChangeSession) onChangeSession(newSession as SessionInput, newSettings)
            if (sessionSettings && onChangeSettings) onChangeSettings(newSettings)
          }}
        >
          Save
        </Button>
      </Stack>
    </Box>
  )
}
