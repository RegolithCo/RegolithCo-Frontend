import * as React from 'react'
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TableFooter,
  SxProps,
  Theme,
  Box,
  Button,
  Avatar,
  Badge,
  ToggleButton,
  ToggleButtonGroup,
  ThemeProvider,
  MenuItem,
  Select,
} from '@mui/material'
import {
  SalvageFind,
  ScoutingFind,
  ShipClusterFind,
  VehicleClusterFind,
  clusterCalc,
  FindSummary,
  getOreName,
  ScoutingFindTypeEnum,
  SessionUser,
  ShipRock,
  RockStateEnum,
  ScoutingFindStateEnum,
  getScoutingFindStateName,
  SessionUserStateEnum,
  User,
} from '@regolithco/common'
import { ClawIcon, GemIcon, RockIcon } from '../../../icons'
import { AddCircle, EmojiPeople, ExitToApp, Person, RocketLaunch, SvgIconComponent } from '@mui/icons-material'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { ShipRockCard } from '../../cards/ShipRockCard'
import { DeleteModal } from '../../modals/DeleteModal'
import { ShipRockEntryModal } from '../../modals/ShipRockEntryModal'
import { ScoutingClusterCountModal } from '../../modals/ScoutingClusterCountModal'
import { fontFamilies, scoutingFindStateThemes } from '../../../theme'
import { ScoutingFindUserList } from './ScoutingFindUserList'
import { EmptyScanCard } from '../../cards/EmptyScanCard'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
dayjs.extend(relativeTime)

export interface ScoutingFindCalcProps {
  scoutingFind: ScoutingFind
  me: SessionUser
  allowEdit?: boolean
  allowWork?: boolean
  standalone?: boolean
  isNew?: boolean
  joinScoutingFind?: (findId: string, enRoute: boolean) => void
  leaveScoutingFind?: (findId: string) => void
  onChange: (scoutingFind: ScoutingFind) => void
  onDelete?: () => void
}

const AttendanceStateEnum = {
  NotJoined: 'NotJoined',
  Joined: 'Joined',
  EnRoute: 'EnRoute',
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  containerGrid: {
    background: theme.palette.background.default,
    overflow: 'hidden',
    height: '100%',
    width: '100%',
    m: 0,
    '* .MuiTypography-overline': {
      color: theme.palette.text.secondary,
      borderBottom: '1px solid',
    },
  },
  stateBtnGrp: {
    '& *': {},
    '& .MuiToggleButtonGroup-root': {
      width: '100%',
    },
    '& .MuiToggleButton-root.Mui-selected, & .MuiToggleButton-root.Mui-selected:hover': {
      cursor: 'default',
      color: theme.palette.primary.contrastText,
      boxShadow: `0 0 4px 2px ${theme.palette.primary.light}66, 0 0 10px 5px ${theme.palette.primary.light}33`,
      background: theme.palette.primary.dark,
    },
    '& .MuiToggleButton-root': {
      flexGrow: 1,
      // px: 0.7,
      // py: 0.3,
      // m: 0,
    },
  },
  scoutingFindId: {
    position: 'absolute',
    top: 0,
    left: 0,
    px: 2,
    m: 0,
    fontSize: '2em',
    color: theme.palette.primary.dark,
    fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
  },
  numberBox: {
    position: 'relative',
    textAlign: 'center',
    mt: 3,
    pb: 2,
    mb: 2,
    // border: '1px solid red',
  },
  clusterCountBadge: {
    '& .MuiBadge-badge': {
      height: '50px',
      width: '50px',
      top: '10%',
      right: '10%',
      fontSize: '30px',
      borderRadius: '50%',
      background: theme.palette.primary.dark,
      color: theme.palette.background.default,
    },
  },
  clusterCount: {
    height: 100,
    width: 100,
    fontSize: 70,
    margin: '0 auto',
    fontWeight: 'bold',
    border: `7px solid ${theme.palette.primary.dark}`,
    color: theme.palette.primary.dark,
    background: theme.palette.background.default,
  },
  editButton: {
    position: 'absolute',
    top: -2,
    color: theme.palette.primary.dark,
    fontSize: 10,
    right: '50%',
    transform: 'translate(50%, 0%)',
  },
  itemName: {
    position: 'absolute',
    zIndex: 1000,
    color: theme.palette.primary.dark,
    textShadow: '1px 1px 3px #000, -1px -1px 3px #000, 1px -1px 3px #000, -1px 1px 3px #000',
    fontSize: 30,
    bottom: '-28%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  statsTable: {
    maxWidth: 340,
    '& .MuiTableCell-root, & .MuiTableCell-root *': {
      padding: 0,
      [theme.breakpoints.up('md')]: {
        padding: 0.3,
      },
      fontSize: '0.875rem',
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
  },
  totalRow: {
    '& .MuiTableCell-root': {
      borderTop: '2px solid',
      fontSize: '0.875rem',
      color: theme.palette.primary.main,
      borderBottom: '2px solid',
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
  },
  needs: {
    width: '100%',
    fontSize: '0.8em',
  },
  topRowGrid: {
    position: 'relative',
    // border: '1px solid blue!important',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      // maxHeight: 150,
      overflow: 'hidden',
    },
  },
  stateBox: {
    position: 'absolute',
    zIndex: 1000,
    top: -10,
    left: '50%',
    transform: 'translate(-50%, 0%)',
    color: theme.palette.primary.contrastText,
    background: theme.palette.primary.dark,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  stateSelect: {
    color: theme.palette.primary.contrastText,
    '&:before, &:after, &:hover:not(.Mui-disabled):before': {
      border: 'None',
    },
    '& .MuiSelect-icon': {
      color: theme.palette.primary.contrastText,
    },
    '& .MuiSelect-select': {
      px: 2,
      pt: 1,
    },
  },
  stateNoSelect: {
    px: 2,
    pt: 1,
  },
  stateChip: {
    margin: '0 auto',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 14,
    py: 0.5,
  },
  bottomRowGrid: {
    width: '100%',
    // border: '1px solid green!important',
  },
  scansGrid: {
    [theme.breakpoints.up('md')]: {
      // display: 'flex',
      height: '100%',
      maxHeight: 200,
      overflow: 'scroll',
    },
  },
})

/**
 * This is the wrpaper for all the types of things scouts can find
 * @param param0
 * @returns
 */
export const ScoutingFindCalc: React.FC<ScoutingFindCalcProps> = ({
  scoutingFind,
  me,
  isNew,
  allowEdit,
  standalone,
  joinScoutingFind,
  leaveScoutingFind,
  allowWork,
  onChange,
  onDelete,
}) => {
  const theme = scoutingFindStateThemes[scoutingFind.state || ScoutingFindStateEnum.Discovered]
  const styles = stylesThunk(theme)
  const [editCountModalOpen, setEditCountModalOpen] = React.useState<boolean>(Boolean(isNew))
  const [deleteModalOpen, setDeleteModalOpen] = React.useState<boolean>(false)
  const [addScanModalOpen, setAddScanModalOpen] = React.useState<ShipRock | false>(false)
  const [editScanModalOpen, setEditScanModalOpen] = React.useState<[number, ShipRock | false]>([-1, false])

  // Convenience type guards
  const shipFind = scoutingFind as ShipClusterFind
  const vehicleFind = scoutingFind as VehicleClusterFind
  const salvageFind = scoutingFind as SalvageFind

  // Some convenience variables
  const hasCount = Boolean(scoutingFind.clusterCount)
  let hasScans = false
  let scanComplete = false
  let numScans = 0
  const clusterCount = scoutingFind.clusterCount || 0

  let Icon: SvgIconComponent = ClawIcon
  let itemName = ''
  const plural = scoutingFind?.clusterCount && scoutingFind.clusterCount > 1
  switch (scoutingFind.clusterType) {
    case ScoutingFindTypeEnum.Salvage:
      hasScans = salvageFind.wrecks && salvageFind.wrecks.length > 0
      scanComplete = hasScans && hasCount && salvageFind.wrecks.length === scoutingFind.clusterCount
      numScans = hasScans ? salvageFind.wrecks.length : 0
      Icon = ClawIcon
      itemName = plural ? 'Wrecks' : 'Wreck'
      break
    case ScoutingFindTypeEnum.Ship:
      hasScans = shipFind.shipRocks && shipFind.shipRocks.length > 0
      scanComplete = hasScans && hasCount && shipFind.shipRocks.length === scoutingFind.clusterCount
      numScans = hasScans ? shipFind.shipRocks.length : 0
      Icon = RockIcon
      itemName = plural ? 'Rocks' : 'Rock'
      break
    case ScoutingFindTypeEnum.Vehicle:
      hasScans = vehicleFind.vehicleRocks && vehicleFind.vehicleRocks.length > 0
      scanComplete = hasScans && hasCount && vehicleFind.vehicleRocks.length === scoutingFind.clusterCount
      numScans = hasScans ? vehicleFind.vehicleRocks.length : 0
      Icon = GemIcon
      itemName = plural ? 'Gems' : 'Gem'
      break
  }
  const summary = clusterCalc(scoutingFind as ScoutingFind)
  let profitSymbol = '~'
  if (scanComplete) profitSymbol = ''
  else if (hasCount && hasScans && numScans < clusterCount) profitSymbol = '>'

  let myAttendanceState = AttendanceStateEnum.NotJoined
  if (scoutingFind.attendanceIds?.includes(me.owner?.userId as string)) {
    myAttendanceState =
      me.state === SessionUserStateEnum.Travelling ? AttendanceStateEnum.EnRoute : AttendanceStateEnum.Joined
  }

  // Just a handy array to map over
  const placeholderRocks: unknown[] =
    clusterCount > 0 && clusterCount > numScans ? Array.from({ length: clusterCount - numScans }, (_, i) => 1) : []

  const onSiteUsers: User[] =
    scoutingFind.attendance?.filter((a) => a.state === SessionUserStateEnum.OnSite).map(({ owner }) => owner as User) ||
    []
  const enRouteUsers: User[] =
    scoutingFind.attendance
      ?.filter((a) => a.state === SessionUserStateEnum.Travelling)
      .map(({ owner }) => owner as User) || []

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2} padding={2} sx={styles.containerGrid}>
        {standalone && (
          <Box>
            <Typography component="div" variant="h5" sx={styles.title}>
              Cluster Calculator
            </Typography>
            <Typography component="div" paragraph>
              Add a scan to get started
            </Typography>
          </Box>
        )}
        {!standalone && !isNew && (
          <Typography sx={styles.scoutingFindId}>{scoutingFind.scoutingFindId.split('_')[0]}</Typography>
        )}
        {!standalone && (
          <Box sx={styles.stateBox}>
            {allowEdit ? (
              <Select
                sx={styles.stateSelect}
                variant="standard"
                onChange={(e) => {
                  onChange({ ...scoutingFind, state: e.target.value as ScoutingFindStateEnum })
                }}
                renderValue={(value) => getScoutingFindStateName(value as ScoutingFindStateEnum)}
                value={(scoutingFind.state as string) || (ScoutingFindStateEnum.Discovered as string)}
              >
                {Object.values(ScoutingFindStateEnum).map((state) => (
                  <MenuItem key={state} value={state}>
                    {getScoutingFindStateName(state)}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <Box sx={styles.stateNoSelect}>
                {getScoutingFindStateName(scoutingFind.state as ScoutingFindStateEnum)}
              </Box>
            )}
          </Box>
        )}
        {/* Top row grid */}
        <Grid container spacing={2} padding={2} xs={12}>
          {/* Hero card */}
          <Grid xs={6} sm={3} sx={styles.topRowGrid}>
            <Box sx={styles.numberBox}>
              <Typography sx={styles.itemName}>{itemName}</Typography>
              <Badge overlap="circular" badgeContent={<Icon />} sx={styles.clusterCountBadge}>
                <Avatar
                  sx={styles.clusterCount}
                  onClick={() => {
                    !standalone && allowEdit && setEditCountModalOpen(true)
                  }}
                >
                  {standalone ? (shipFind.shipRocks || []).length : scoutingFind.clusterCount || 1}
                  {!standalone && allowEdit && (
                    <Button
                      size="small"
                      sx={styles.editButton}
                      onClick={() => {
                        setEditCountModalOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </Avatar>
              </Badge>
            </Box>
            {!standalone && (
              <>
                <Typography variant="overline" component="div">
                  Found {dayjs(scoutingFind.createdAt).from(dayjs(Date.now()))} By:
                </Typography>
                <ScoutingFindUserList
                  users={[scoutingFind.owner as User]}
                  meId={me.owner?.userId as string}
                  ownerId={scoutingFind.ownerId}
                />
              </>
            )}
          </Grid>
          {/* Cluster stats */}
          <Grid xs={6} sm={standalone ? 9 : 5} sx={styles.topRowGrid}>
            <Typography variant="overline" component="div">
              Cluster Stats
            </Typography>
            <TableContainer sx={{ opacity: scoutingFind.clusterType === ScoutingFindTypeEnum.Ship ? 1 : 0.2 }}>
              <Table size="small" sx={styles.statsTable}>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="right">SCU</TableCell>
                    <TableCell align="right">aUEC</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {summary.potentialProfit > 0 &&
                    summary.oreSort?.map((oreKey) => {
                      const { mass, potentialProfit, volume } = (summary.byOre || {})[oreKey] as FindSummary
                      return (
                        <TableRow key={oreKey}>
                          <TableCell>{getOreName(oreKey)}</TableCell>
                          <TableCell align="right">{MValueFormatter(volume, MValueFormat.number_sm, 1)}</TableCell>
                          <TableCell align="right">
                            {MValueFormatter(potentialProfit, MValueFormat.number_sm)}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
                <TableFooter>
                  <TableRow sx={styles.totalRow}>
                    <TableCell>Total</TableCell>
                    <TableCell align="right">{MValueFormatter(summary.volume, MValueFormat.number_sm, 1)}</TableCell>
                    <TableCell align="right">
                      {profitSymbol}
                      {MValueFormatter(summary.potentialProfit, MValueFormat.number_sm)}
                    </TableCell>
                  </TableRow>
                  {scoutingFind.clusterType === ScoutingFindTypeEnum.Ship && (
                    <>
                      <TableRow>
                        <TableCell>Prospector(s)</TableCell>
                        <TableCell align="right">{(summary.volume / 32).toFixed(1)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Mole(s)</TableCell>
                        <TableCell align="right">{(summary.volume / 96).toFixed(1)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </>
                  )}
                </TableFooter>
              </Table>
            </TableContainer>

            {!standalone && (
              <Box sx={{ display: 'flex' }}>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{ fontSize: '0.8em', color: theme.palette.primary.main, py: 2 }}
                >
                  {scoutingFind.state === ScoutingFindStateEnum.Abandonned && 'This find has been abandonned and lost'}
                  {scoutingFind.state === ScoutingFindStateEnum.ReadyForWorkers && 'This find needs workers.'}
                  {scoutingFind.state === ScoutingFindStateEnum.Working && 'This find is being worked on.'}
                  {scoutingFind.state === ScoutingFindStateEnum.Discovered &&
                    'This find has been discovered and is currently being scanned.'}
                  {scoutingFind.state === ScoutingFindStateEnum.Depleted &&
                    'This find has been depleted of all its minerals.'}
                </Typography>
              </Box>
            )}
            {!standalone && joinScoutingFind && leaveScoutingFind && (
              <Box sx={styles.stateBtnGrp}>
                <Typography variant="overline" component="div">
                  I am:
                </Typography>
                <ToggleButtonGroup
                  size="small"
                  value={myAttendanceState}
                  sx={{
                    py: 2,
                  }}
                >
                  <ToggleButton
                    value={AttendanceStateEnum.EnRoute}
                    onClick={() => {
                      myAttendanceState !== AttendanceStateEnum.EnRoute &&
                        joinScoutingFind &&
                        joinScoutingFind(scoutingFind.scoutingFindId, true)
                    }}
                    key="left"
                    sx={{ flexGrow: 1 }}
                  >
                    <RocketLaunch />
                    En-Route
                  </ToggleButton>
                  <ToggleButton
                    value={AttendanceStateEnum.Joined}
                    onClick={() => {
                      myAttendanceState !== AttendanceStateEnum.Joined &&
                        joinScoutingFind &&
                        joinScoutingFind(scoutingFind.scoutingFindId, false)
                    }}
                    key="center"
                    sx={{ flexGrow: 1 }}
                  >
                    <EmojiPeople />
                    Here
                  </ToggleButton>
                  <ToggleButton
                    value="NONE"
                    disabled={myAttendanceState === AttendanceStateEnum.NotJoined}
                    key="justify"
                    onClick={() => {
                      myAttendanceState !== AttendanceStateEnum.NotJoined &&
                        leaveScoutingFind &&
                        leaveScoutingFind(scoutingFind.scoutingFindId)
                    }}
                    sx={{ flexGrow: 1 }}
                  >
                    <ExitToApp />
                    Leaving
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            )}
          </Grid>
          {/* Actions and attendance */}
          {!standalone && (
            <Grid xs={12} sm={4} sx={styles.topRowGrid}>
              <Typography variant="overline" component="div">
                En-Route:
              </Typography>
              <ScoutingFindUserList
                meId={me.owner?.userId as string}
                users={enRouteUsers}
                ownerId={scoutingFind.ownerId}
              />

              <Typography variant="overline" component="div">
                On-Site:
              </Typography>
              <ScoutingFindUserList
                meId={me.owner?.userId as string}
                users={onSiteUsers}
                ownerId={scoutingFind.ownerId}
              />
            </Grid>
          )}
        </Grid>
        {/* Rock scans */}
        {scoutingFind.clusterType === ScoutingFindTypeEnum.Ship && (
          <Grid container paddingX={2} xs={12} sx={styles.bottomRowGrid}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="overline" component="div">
                  Rocks Scanned: {shipFind.shipRocks?.length || vehicleFind.vehicleRocks?.length}/
                  {shipFind.clusterCount || 0}
                </Typography>
                <div style={{ flexGrow: 1 }} />
                <Button
                  startIcon={<AddCircle />}
                  size="small"
                  variant="text"
                  onClick={() => {
                    setEditScanModalOpen([-1, false])
                    setAddScanModalOpen({
                      __typename: 'ShipRock',
                      state: RockStateEnum.Ready,
                      mass: 3000,
                      ores: [],
                    })
                  }}
                >
                  Add Scan
                </Button>
              </Box>
              <Grid container sx={styles.scansGrid} margin={1} spacing={3}>
                {scoutingFind.clusterType === ScoutingFindTypeEnum.Ship &&
                  (shipFind.shipRocks || []).map((rock, idx) => {
                    const newOres = [...(rock.ores || [])]
                    newOres.sort((a, b) => (b.percent || 0) - (a.percent || 0))
                    const newRock = { ...rock, ores: newOres }
                    return (
                      <Grid key={idx} xs={6} sm={4} md={3}>
                        <ShipRockCard
                          rock={newRock}
                          rockValue={summary.byRock ? summary.byRock[idx] : undefined}
                          onChangeState={(newState) => {
                            onChange({
                              ...shipFind,
                              shipRocks: (shipFind.shipRocks || []).map((r, idxx) => ({
                                ...r,
                                state: idxx === idx ? newState : r.state,
                              })),
                            })
                          }}
                          onEditClick={() => {
                            setAddScanModalOpen(false)
                            setEditScanModalOpen([idx, rock])
                          }}
                        />
                      </Grid>
                    )
                  })}
                {scoutingFind.clusterType === ScoutingFindTypeEnum.Ship &&
                  placeholderRocks.map((_, idx) => (
                    <Grid key={idx} xs={6} sm={4} md={3}>
                      <EmptyScanCard
                        Icon={RockIcon}
                        onClick={() => {
                          setEditScanModalOpen([-1, false])
                          setAddScanModalOpen({
                            __typename: 'ShipRock',
                            state: RockStateEnum.Ready,
                            mass: 3000,
                            ores: [],
                          })
                        }}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Grid>
        )}
      </Grid>
      {scoutingFind.clusterType === ScoutingFindTypeEnum.Ship && (
        <ShipRockEntryModal
          open={addScanModalOpen !== false || editScanModalOpen[1] !== false}
          isNew={addScanModalOpen !== false}
          onClose={() => {
            addScanModalOpen !== false && setAddScanModalOpen(false)
            editScanModalOpen[1] !== false && setEditScanModalOpen([-1, false])
          }}
          onDelete={() => {
            // Just discard. No harm, no foul
            addScanModalOpen !== false && setAddScanModalOpen(false)
            // Actually remove the rock from the list
            if (editScanModalOpen[1] !== false) {
              onChange({
                ...(shipFind || {}),
                shipRocks: (shipFind?.shipRocks || []).filter((rock, idx) => idx !== editScanModalOpen[0]),
              })
              setEditScanModalOpen([-1, false])
            }
          }}
          onSubmit={(rock) => {
            if (addScanModalOpen !== false) {
              onChange({
                ...(shipFind || {}),
                shipRocks: [...(shipFind?.shipRocks || []), rock],
              })
              setAddScanModalOpen(false)
            } else if (editScanModalOpen[1] !== false) {
              onChange({
                ...(shipFind || {}),
                shipRocks: (shipFind?.shipRocks || []).map((r, idx) => (idx === editScanModalOpen[0] ? rock : r)),
              })
              setEditScanModalOpen([-1, false])
            }
          }}
          shipRock={addScanModalOpen !== false ? addScanModalOpen : (editScanModalOpen[1] as ShipRock)}
        />
      )}
      <ScoutingClusterCountModal
        open={editCountModalOpen}
        clusterCount={shipFind?.clusterCount || 1}
        clusterType={shipFind?.clusterType as ScoutingFindTypeEnum}
        onClose={() => {
          setEditCountModalOpen(false)
        }}
        onSave={(newCount) => {
          setEditCountModalOpen(false)
          onChange({ ...shipFind, clusterCount: newCount })
        }}
        isNew={isNew}
      />
      <DeleteModal
        open={deleteModalOpen}
        message="Are you sure you want to delete this find?"
        title="Delete Scouting Find"
        onClose={() => {
          setDeleteModalOpen(false)
        }}
        onConfirm={() => {
          setDeleteModalOpen(false)
          onDelete && onDelete()
        }}
      />
    </ThemeProvider>
  )
}
