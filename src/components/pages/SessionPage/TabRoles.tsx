import * as React from 'react'
import {
  alpha,
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  List,
  MenuItem,
  Select,
  Stack,
  Switch,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  DestructuredSettings,
  ObjectValues,
  PendingUser,
  SessionInput,
  SessionSettings,
  SessionUser,
} from '@regolithco/common'
import { DialogEnum, SessionContext } from '../../../context/session.context'
import { fontFamilies } from '../../../theme'
import { PendingUserListItem } from '../../fields/SessionUserList/SessionUserListItems/PendingUserListItem'
import { ActiveUserListItem } from '../../fields/SessionUserList/SessionUserListItems/ActiveUserListItem'
import { group } from 'console'
import {
  Engineering,
  Handyman,
  HealthAndSafety,
  Inventory,
  LocalPolice,
  LocalShipping,
  ManageAccounts,
  RocketLaunch,
  Security,
  Support,
  TravelExplore,
} from '@mui/icons-material'

export interface RolesTabProps {
  // For the profile version we only have the sessionSettings
  sessionSettings?: SessionSettings
  onChangeSession?: (session: SessionInput, newSettings: DestructuredSettings) => void
  onChangeSettings?: (newSettings: DestructuredSettings) => void
  setActiveModal?: (modal: DialogEnum) => void
}

export const SessionRoleEnum = {
  Manager: 'MANAGER',
  Scout: 'SCOUT',
  Medical: 'MEDICAL',
  Security: 'SECURITY',
  Logistics: 'LOGISTICS',
  Transport: 'TRANSPORT',
} as const
export type SessionRoleEnum = ObjectValues<typeof SessionRoleEnum>

export const SessionRoleNames: Record<SessionRoleEnum, string> = {
  [SessionRoleEnum.Manager]: 'Manager',
  [SessionRoleEnum.Scout]: 'Surveyor / Scout',
  [SessionRoleEnum.Medical]: 'Medical & Rescue',
  [SessionRoleEnum.Security]: 'Security',
  [SessionRoleEnum.Logistics]: 'Logistics & Support',
  [SessionRoleEnum.Transport]: 'Transport',
}

export const SessionRoleIcons: Record<SessionRoleEnum, React.ReactNode> = {
  [SessionRoleEnum.Manager]: <ManageAccounts />,
  [SessionRoleEnum.Scout]: <TravelExplore />,
  [SessionRoleEnum.Medical]: <Support />,
  [SessionRoleEnum.Security]: <LocalPolice />,
  [SessionRoleEnum.Logistics]: <Engineering />,
  [SessionRoleEnum.Transport]: <LocalShipping />,
}
export const SessionRoleColors: Record<SessionRoleEnum, string> = {
  [SessionRoleEnum.Manager]: '#ff0',
  [SessionRoleEnum.Scout]: '#0f0',
  [SessionRoleEnum.Medical]: '#0ff',
  [SessionRoleEnum.Security]: '#f00',
  [SessionRoleEnum.Logistics]: '#ccc',
  [SessionRoleEnum.Transport]: '#f0f',
}

export const ShipRoleEnum = {
  Pilot: 'PILOT',
  CoPilot: 'COPILOT',
  Engineer: 'ENGINEER',
  Turret: 'TURRET',
  Security: 'SECURITY',
  Medic: 'MEDIC',
  Stevedore: 'STEVEDORE',
} as const
export type ShipRoleEnum = ObjectValues<typeof ShipRoleEnum>

export const ShipRoleNames: Record<ShipRoleEnum, string> = {
  [ShipRoleEnum.Pilot]: 'Pilot',
  [ShipRoleEnum.CoPilot]: 'Co-Pilot',
  [ShipRoleEnum.Engineer]: 'Engineer',
  [ShipRoleEnum.Turret]: 'Turret',
  [ShipRoleEnum.Security]: 'Security',
  [ShipRoleEnum.Medic]: 'Medic',
  [ShipRoleEnum.Stevedore]: 'Stevedore',
}

export const ShipRoleIcons: Record<ShipRoleEnum, React.ReactNode> = {
  [ShipRoleEnum.Pilot]: <RocketLaunch />,
  [ShipRoleEnum.CoPilot]: <RocketLaunch />,
  [ShipRoleEnum.Engineer]: <Handyman />,
  [ShipRoleEnum.Turret]: <Security />,
  [ShipRoleEnum.Security]: <Security />,
  [ShipRoleEnum.Medic]: <Support />,
  [ShipRoleEnum.Stevedore]: <Inventory />,
}

export const ShipRoleColors: Record<ShipRoleEnum, string> = {
  [ShipRoleEnum.Pilot]: '#ff0',
  [ShipRoleEnum.CoPilot]: '#ff0',
  [ShipRoleEnum.Engineer]: '#b26eff',
  [ShipRoleEnum.Turret]: '#f00',
  [ShipRoleEnum.Security]: '#f00',
  [ShipRoleEnum.Medic]: '#0ff',
  [ShipRoleEnum.Stevedore]: '#ccc',
}

export const RolesTab: React.FC<RolesTabProps> = ({ onChangeSession, onChangeSettings, setActiveModal }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme, true)
  const mediumUp = useMediaQuery(theme.breakpoints.up('md'))
  const {
    captains,
    crewHierarchy,
    removeSessionCrew,
    loading,
    mySessionUser,
    myUserProfile,
    removeSessionMentions,
    singleActives,
    singleInnactives,
    session,
  } = React.useContext(SessionContext)
  const [groupCrew, setGroupCrew] = React.useState<boolean>(true)

  const allCrew = React.useMemo(() => {
    const crewArr: (PendingUser | SessionUser)[] = [
      ...(session?.activeMembers?.items || []),
      ...(session?.mentionedUsers || []),
    ]
    const comp = (aStr: string, bStr: string) => aStr.localeCompare(bStr, 'en', { sensitivity: 'base' })
    crewArr.sort((a, b) => {
      const aName: string = (a as SessionUser).owner?.scName || (a as PendingUser).scName || ''
      const bName: string = (b as SessionUser).owner?.scName || (b as PendingUser).scName || ''

      // If we're not grouping by crew then just sort normally by name
      if (!groupCrew) return comp(aName, bName)
      // If we ARE grouping by crew then sort by crew hierarchy first THEN by name as follows:
      // 1. Captains should be followed by their crew.
      // 2. Crew should be sorted alphabetically AFTER their captain
      // 3. Single active users and pending users without a captain should be treated as captains
      // 4. Captains (Including single actives without captains and pending users without captains) should be sorted by name
      else {
        const aCaptainName = a.captainId ? captains.find((su) => su.ownerId === a.captainId)?.owner?.scName : undefined
        const bCaptainName = b.captainId ? captains.find((su) => su.ownerId === b.captainId)?.owner?.scName : undefined

        // if two users both do not have captains then sort by name
        if (!aCaptainName && !bCaptainName) return comp(aName, bName)
        // If two users have different captains then sort by captain first, otherwise sort by scName
        else if (aCaptainName && bCaptainName) {
          if (aCaptainName === bCaptainName) return comp(aName, bName)
          else return comp(aCaptainName, bCaptainName)
        }
        // If one user is a captain and the other is that captain's crew member then sort by captain first
        else {
          if (aCaptainName) return comp(aCaptainName, bName)
          else if (bCaptainName) return comp(aName, bCaptainName)
          else return comp(aName, bName)
        }
      }
    })
    return crewArr
  }, [session, groupCrew])

  // console.log('CAKE', allCrew, session)
  return (
    <Box sx={styles.tabContainerOuter}>
      {/* Here's our scrollbox */}
      <Box sx={styles.tabContainerInner}>
        <Box
          sx={{
            border: `1px solid ${theme.palette.primary.main}`,
            mx: 2,
            my: 4,
            p: 3,
          }}
        >
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Session Controls</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={true}
                    onChange={() => {
                      //
                    }}
                    name="gilad"
                  />
                }
                label="Users can self-assign session role"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={true}
                    onChange={() => {
                      //
                    }}
                    name="gilad"
                  />
                }
                label="Users can self-assign ship role"
              />
            </FormGroup>
          </FormControl>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Typography variant="overline">User</Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={groupCrew}
                          onChange={() => {
                            setGroupCrew(!groupCrew)
                          }}
                          name="groupCrew"
                        />
                      }
                      slotProps={{
                        typography: { variant: 'overline' },
                      }}
                      label="Group Crew"
                    />
                  </Stack>
                </TableCell>
                <TableCell>Session Role</TableCell>
                <TableCell>Ship Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allCrew.map((crew, idx) => {
                const isCrewDisplay = Boolean(groupCrew && crew.captainId)
                const isPendingUser = !!(crew as PendingUser).scName
                const isCaptain =
                  !isPendingUser && !!captains.find((su) => su.ownerId === (crew as SessionUser).ownerId)

                return (
                  <TableRow
                    sx={{
                      // Make the background a gradient from primary.main at 0 to transparent at 10%
                      background:
                        groupCrew && isCaptain
                          ? `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 20%)`
                          : undefined,
                      borderTop: groupCrew && isCaptain ? `2px solid ${theme.palette.primary.main}` : undefined,
                    }}
                  >
                    <TableCell
                      padding="none"
                      sx={{
                        pl: isCrewDisplay ? 5 : 0,
                      }}
                    >
                      <List dense>
                        {isPendingUser ? (
                          <PendingUserListItem pendingUser={crew as PendingUser} isCrewDisplay={isCrewDisplay} />
                        ) : (
                          <ActiveUserListItem sessionUser={crew as SessionUser} isCrewDisplay={isCrewDisplay} />
                        )}
                      </List>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={crew.sessionRole}
                        size="small"
                        placeholder="Session Role"
                        fullWidth
                        variant="outlined"
                      >
                        {Object.values(SessionRoleEnum).map((role, idx) => (
                          <MenuItem
                            value={role}
                            key={idx}
                            sx={{
                              '& svg': {
                                mr: 1,
                              },
                              color: SessionRoleColors[role as SessionRoleEnum],
                            }}
                          >
                            {SessionRoleIcons[role as SessionRoleEnum]}
                            {SessionRoleNames[role as SessionRoleEnum]}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value="None" size="small" placeholder="Ship Role" fullWidth variant="outlined">
                        <MenuItem value="None">None</MenuItem>
                        {Object.values(ShipRoleEnum).map((role, idx) => (
                          <MenuItem
                            value={role}
                            key={idx}
                            sx={{
                              '& svg': {
                                mr: 1,
                              },
                              color: ShipRoleColors[role as ShipRoleEnum],
                            }}
                          >
                            {ShipRoleIcons[role as ShipRoleEnum]} {ShipRoleNames[role as ShipRoleEnum]}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
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
