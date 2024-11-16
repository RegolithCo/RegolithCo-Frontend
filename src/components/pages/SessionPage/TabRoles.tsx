import * as React from 'react'
import {
  alpha,
  Box,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
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
  User,
  DestructuredSettings,
  PendingUser,
  PendingUserInput,
  SessionInput,
  SessionSettings,
  SessionUser,
} from '@regolithco/common'
import { DialogEnum, SessionContext } from '../../../context/session.context'
import { fontFamilies } from '../../../theme'
import { SessionRoleChooser } from '../../fields/SessionRoleChooser'
import { ShipRoleChooser } from '../../fields/ShipRoleChooser'
import { DeleteSweep } from '@mui/icons-material'
import { DeleteModal } from '../../modals/DeleteModal'
import { UserAvatar } from '../../UserAvatar'
import { AppContext } from '../../../context/app.context'

export interface RolesTabProps {
  // For the profile version we only have the sessionSettings
  sessionSettings?: SessionSettings
  onChangeSession?: (session: SessionInput, newSettings: DestructuredSettings) => void
  onChangeSettings?: (newSettings: DestructuredSettings) => void
  setActiveModal?: (modal: DialogEnum) => void
}

export const RolesTab: React.FC<RolesTabProps> = ({ onChangeSession, onChangeSettings, setActiveModal }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme, true)
  const [deleteSessionRolesOpen, setDeleteSessionRolesOpen] = React.useState(false)
  const [deleteShipRolesOpen, setDeleteShipRolesOpen] = React.useState(false)
  const mediumUp = useMediaQuery(theme.breakpoints.up('md'))
  const { isSessionAdmin, captains, updateSessionRole, updateShipRole, updatePendingUsers, mySessionUser, session } =
    React.useContext(SessionContext)
  const { getSafeName, hideNames } = React.useContext(AppContext)
  const [groupCrew, setGroupCrew] = React.useState<boolean>(true)

  const allCrew: [PendingUser | SessionUser, boolean, boolean][] = React.useMemo(() => {
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
    return crewArr.map<[PendingUser | SessionUser, boolean, boolean]>((crew) => {
      const isPendingUser = !!(crew as PendingUser).scName
      const isMe = !isPendingUser && (crew as SessionUser).ownerId === mySessionUser?.ownerId
      const iAmSessionOwner = session?.ownerId === mySessionUser?.ownerId
      const iAmTheirCaptain = crew.captainId === mySessionUser?.ownerId
      const canSelfAssignSessionRole = !session?.sessionSettings?.controlledSessionRole
      const canSelfAssignShipRole = !session?.sessionSettings?.controlledShipRole

      let sessionRoleDisabled = true
      if (iAmSessionOwner) sessionRoleDisabled = false
      else if (canSelfAssignSessionRole && isMe) sessionRoleDisabled = false

      let shipRoleDisabled = true
      if (iAmSessionOwner) shipRoleDisabled = false
      else if (canSelfAssignShipRole && (isMe || iAmTheirCaptain)) shipRoleDisabled = false

      return [crew, sessionRoleDisabled, shipRoleDisabled]
    })
  }, [session?.activeMembers, session?.mentionedUsers, groupCrew, mySessionUser, captains])

  // console.log('CAKE', allCrew, session)
  return (
    <Box sx={styles.tabContainerOuter}>
      {/* Here's our scrollbox */}
      <Box sx={styles.tabContainerInner}>
        <TableContainer sx={{ maxHeight: '100%' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width={'40%'}>
                  <Stack direction="row" spacing={1} justifyContent="space-between">
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
                <TableCell width={'30%'}>
                  <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Typography variant="overline">Session Role</Typography>
                    {isSessionAdmin && (
                      <Stack direction="row" spacing={1}>
                        <IconButton color="error" onClick={() => setDeleteSessionRolesOpen(true)}>
                          <DeleteSweep />
                        </IconButton>
                      </Stack>
                    )}
                  </Stack>
                </TableCell>
                <TableCell width={'30%'}>
                  <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Typography variant="overline">Ship Role</Typography>
                    {isSessionAdmin && (
                      <Stack direction="row" spacing={1}>
                        <IconButton color="error" onClick={() => setDeleteShipRolesOpen(true)}>
                          <DeleteSweep />
                        </IconButton>
                      </Stack>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allCrew.map(([crew, sessionRoleDisabled, shipRoleDisabled], idx) => {
                const isCrewDisplay = Boolean(groupCrew && crew.captainId)
                const isPendingUser = !!(crew as PendingUser).scName
                const scName = (crew as PendingUser).scName || (crew as SessionUser).owner?.scName || ''
                const isCaptain =
                  !isPendingUser && !!captains.find((su) => su.ownerId === (crew as SessionUser).ownerId)

                let isEndOfCrew =
                  idx < allCrew.length - 1 &&
                  idx > 0 &&
                  allCrew[idx + 1][0].captainId !== crew.captainId &&
                  allCrew[idx + 1][0].captainId !== (crew as SessionUser).ownerId
                if (idx === allCrew.length - 1 && crew.captainId) isEndOfCrew = true
                return (
                  <TableRow
                    key={idx}
                    sx={{
                      // Make the background a gradient from primary.main at 0 to transparent at 10%
                      '& .MuiTableCell-root': {
                        borderTop: groupCrew && isCaptain ? `2px solid ${theme.palette.primary.main}` : undefined,
                        borderBottom:
                          groupCrew && isEndOfCrew ? `1px solid ${theme.palette.secondary.dark}` : undefined,
                        background:
                          groupCrew && isCaptain
                            ? `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 90%)`
                            : groupCrew && isEndOfCrew
                              ? `linear-gradient(0deg, ${alpha(theme.palette.secondary.dark, 0.2)} 0%, transparent 90%)`
                              : undefined,
                      },
                    }}
                  >
                    <TableCell
                      padding="none"
                      width={'40%'}
                      sx={{
                        pl: isCrewDisplay ? 5 : 0,
                        position: 'relative',
                        '&::before':
                          groupCrew && isCaptain
                            ? {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                px: 0.5,
                                borderBottomRightRadius: '5px',
                                fontSize: '0.7rem',
                                fontFamily: fontFamilies.robotoMono,
                                fontWeight: 'bold',
                                color: theme.palette.primary.contrastText,
                                background: theme.palette.primary.main,
                                content: '"CREW"',
                              }
                            : {},
                      }}
                    >
                      <List dense>
                        <ListItem>
                          <ListItemAvatar>
                            {isPendingUser ? (
                              <UserAvatar size={'medium'} pendingUser={crew as PendingUser} />
                            ) : (
                              <UserAvatar
                                size={'medium'}
                                user={(crew as SessionUser).owner as User}
                                privacy={hideNames}
                                sessionOwner={session?.ownerId === (crew as SessionUser).ownerId}
                              />
                            )}
                          </ListItemAvatar>
                          <ListItemText
                            sx={{
                              '& .MuiListItemText-secondary': {
                                fontSize: '0.7rem',
                              },
                            }}
                            primary={getSafeName(scName)}
                            secondaryTypographyProps={{
                              component: 'div',
                            }}
                            secondary={
                              <Typography
                                sx={{
                                  fontFamily: fontFamilies.robotoMono,
                                  color: alpha(theme.palette.text.secondary, 0.3),
                                  fontWeight: 'bold',
                                  fontSize: '0.7rem',
                                }}
                              >
                                {isCaptain ? 'CAPTAIN: ' : ''}
                                {isCrewDisplay ? 'CREW MEMBER: ' : ''}
                                {isPendingUser ? 'Pending User' : 'Session User'}
                              </Typography>
                            }
                          />
                        </ListItem>
                      </List>
                    </TableCell>
                    <TableCell width={'30%'}>
                      <SessionRoleChooser
                        value={crew.sessionRole}
                        disabled={sessionRoleDisabled}
                        onChange={(value) => {
                          isPendingUser
                            ? updatePendingUsers([
                                {
                                  ...crew,
                                  sessionRole: value || null,
                                } as PendingUserInput,
                              ])
                            : updateSessionRole((crew as SessionUser).ownerId, value || null)
                        }}
                      />
                    </TableCell>
                    <TableCell width={'30%'}>
                      <ShipRoleChooser
                        value={crew.shipRole}
                        disabled={shipRoleDisabled}
                        onChange={(value) => {
                          isPendingUser
                            ? updatePendingUsers([
                                {
                                  ...crew,
                                  shipRole: value || null,
                                } as PendingUserInput,
                              ])
                            : updateShipRole((crew as SessionUser).ownerId, value || null)
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {deleteSessionRolesOpen && (
        <DeleteModal
          open
          onClose={() => setDeleteSessionRolesOpen(false)}
          onConfirm={() => {
            const updatePromises: Promise<unknown>[] = []
            const pendingUsers: PendingUserInput[] = allCrew
              .filter(
                ([crew, sessionRoleDisabled, shipRoleDisabled]) =>
                  !!(crew as PendingUser).scName && !sessionRoleDisabled && crew.sessionRole
              )
              .map(([crew, sessionRoleDisabled, shipRoleDisabled]) => {
                return {
                  ...crew,
                  sessionRole: null,
                } as PendingUserInput
              })
            updatePromises.push(updatePendingUsers(pendingUsers))

            allCrew
              .filter(
                ([crew, sessionRoleDisabled, shipRoleDisabled]) =>
                  !(crew as PendingUser).scName && !sessionRoleDisabled && crew.sessionRole
              )
              .forEach(([crew, sessionRoleDisabled, shipRoleDisabled], idx) => {
                updatePromises.push(updateSessionRole((crew as SessionUser).ownerId, null))
              })

            return Promise.all(updatePromises)
          }}
          title="Delete All Session Roles"
          message="Are you sure you want to delete all Session roles?"
        />
      )}
      {deleteShipRolesOpen && (
        <DeleteModal
          open
          onClose={() => setDeleteShipRolesOpen(false)}
          onConfirm={() => {
            const updatePromises: Promise<unknown>[] = []
            const pendingUsers: PendingUserInput[] = allCrew
              .filter(
                ([crew, sessionRoleDisabled, shipRoleDisabled]) =>
                  !!(crew as PendingUser).scName && !shipRoleDisabled && crew.shipRole
              )
              .map(([crew, sessionRoleDisabled, shipRoleDisabled]) => {
                return {
                  ...crew,
                  shipRole: null,
                } as PendingUserInput
              })
            updatePromises.push(updatePendingUsers(pendingUsers))

            allCrew
              .filter(([crew, sessionRoleDisabled, shipRoleDisabled]) => !shipRoleDisabled && crew.shipRole)
              .forEach(([crew, sessionRoleDisabled, shipRoleDisabled], idx) => {
                updatePromises.push(updateShipRole((crew as SessionUser).ownerId, null))
              })

            return Promise.all(updatePromises)
          }}
          title="Delete All Ship Roles"
          message="Are you sure you want to delete all Ship roles?"
        />
      )}
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
