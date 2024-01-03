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
  MenuItem,
  Select,
  Stack,
  Tooltip,
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
  VehicleRock,
  VehicleOreEnum,
  makeHumanIds,
  ShipOreEnum,
  FindClusterSummary,
} from '@regolithco/common'
import { ClawIcon, GemIcon, RockIcon } from '../../../icons'
import { AddCircle, EmojiPeople, ExitToApp, NoteAdd, RocketLaunch, SvgIconComponent } from '@mui/icons-material'
import { MValueFormat, MValueFormatter, findDecimals } from '../../fields/MValue'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { ShipRockCard } from '../../cards/ShipRockCard'
import { ShipRockEntryModal } from '../../modals/ShipRockEntryModal'
import { ScoutingClusterCountModal } from '../../modals/ScoutingClusterCountModal'
import { fontFamilies, scoutingFindStateThemes } from '../../../theme'
import { ScoutingFindUserList } from './ScoutingFindUserList'
import { EmptyScanCard } from '../../cards/EmptyScanCard'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { NoteAddDialog } from '../../modals/NoteAddDialog'
import { yellow } from '@mui/material/colors'
import { AppContext } from '../../../context/app.context'
import { LookupsContext } from '../../../context/lookupsContext'
dayjs.extend(relativeTime)

// Object.values(ScoutingFindStateEnum)
export const SCOUTING_FIND_STATE_NAMES: ScoutingFindStateEnum[] = [
  ScoutingFindStateEnum.Discovered,
  ScoutingFindStateEnum.ReadyForWorkers,
  ScoutingFindStateEnum.Working,
  ScoutingFindStateEnum.Depleted,
  ScoutingFindStateEnum.Abandonned,
]

export interface ScoutingFindCalcProps {
  scoutingFind: ScoutingFind
  me?: SessionUser
  allowEdit?: boolean
  allowDelete?: boolean
  standalone?: boolean
  isNew?: boolean
  isShare?: boolean
  joinScoutingFind?: (findId: string, enRoute: boolean) => void
  leaveScoutingFind?: (findId: string) => void
  onChange?: (scoutingFind: ScoutingFind) => void
}

export const AttendanceStateEnum = {
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
      background: theme.palette.primary.main,
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
    color: theme.palette.primary.main,
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
      background: theme.palette.primary.main,
      color: theme.palette.background.default,
    },
  },
  clusterCount: {
    height: 100,
    width: 100,
    fontSize: 70,
    margin: '0 auto',
    fontWeight: 'bold',
    border: `7px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    background: theme.palette.background.default,
  },
  editButton: {
    position: 'absolute',
    top: -2,
    color: theme.palette.primary.main,
    fontSize: 10,
    right: '50%',
    transform: 'translate(50%, 0%)',
  },
  itemName: {
    position: 'absolute',
    zIndex: 1000,
    color: theme.palette.primary.main,
    textShadow: '1px 1px 3px #000, -1px -1px 3px #000, 1px -1px 3px #000, -1px 1px 3px #000',
    fontSize: 30,
    bottom: '-28%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  gemName: {
    color: theme.palette.primary.main,
    textShadow: '1px 1px 3px #000, -1px -1px 3px #000, 1px -1px 3px #000, -1px 1px 3px #000',
    fontSize: 30,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
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
    background: theme.palette.primary.main,
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
  scansGridShare: {
    //
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
  isShare,
  allowEdit,
  standalone,
  joinScoutingFind,
  leaveScoutingFind,
  onChange,
}) => {
  const theme = scoutingFindStateThemes[scoutingFind.state || ScoutingFindStateEnum.Discovered]
  const styles = stylesThunk(theme)
  const [editCountModalOpen, setEditCountModalOpen] = React.useState<boolean>(Boolean(isNew))
  const [openNoteDialog, setOpenNoteDialog] = React.useState<boolean>(false)
  const [summary, setSummary] = React.useState<FindClusterSummary>()
  const [addScanModalOpen, setAddScanModalOpen] = React.useState<ShipRock | false>(false)
  const [editScanModalOpen, setEditScanModalOpen] = React.useState<[number, ShipRock | false]>([-1, false])
  const { getSafeName } = React.useContext(AppContext)
  const dataStore = React.useContext(LookupsContext)

  const hasNote = scoutingFind.note && scoutingFind.note.trim().length > 0

  // Convenience type guards
  const shipFind = scoutingFind as ShipClusterFind
  const vehicleFind = scoutingFind as VehicleClusterFind
  const salvageFind = scoutingFind as SalvageFind

  // Some convenience variables
  // const hasCount = Boolean(scoutingFind.clusterCount)
  let hasScans = false
  // let scanComplete = false
  let numScans = 0
  const clusterCount = scoutingFind.clusterCount || 0

  let Icon: SvgIconComponent = ClawIcon
  let itemName = ''
  const plural = scoutingFind?.clusterCount && scoutingFind.clusterCount > 1
  switch (scoutingFind.clusterType) {
    case ScoutingFindTypeEnum.Salvage:
      hasScans = salvageFind.wrecks && salvageFind.wrecks.length > 0
      // scanComplete = hasScans && hasCount && salvageFind.wrecks.length === scoutingFind.clusterCount
      numScans = hasScans ? salvageFind.wrecks.length : 0
      Icon = ClawIcon
      itemName = plural ? 'Wrecks' : 'Wreck'
      break
    case ScoutingFindTypeEnum.Ship:
      hasScans = shipFind.shipRocks && shipFind.shipRocks.length > 0
      // scanComplete = hasScans && hasCount && shipFind.shipRocks.length === scoutingFind.clusterCount
      numScans = hasScans ? shipFind.shipRocks.length : 0
      Icon = RockIcon
      itemName = plural ? 'Rocks' : 'Rock'
      break
    case ScoutingFindTypeEnum.Vehicle:
      hasScans = vehicleFind.vehicleRocks && vehicleFind.vehicleRocks.length > 0
      // scanComplete = hasScans && hasCount && vehicleFind.vehicleRocks.length === scoutingFind.clusterCount
      numScans = hasScans ? vehicleFind.vehicleRocks.length : 0
      Icon = GemIcon
      itemName = plural ? 'Gems' : 'Gem'
      break
  }
  // const { lookupData: summary, lookupLoading } = useAsyncLookupData(clusterCalc, [scoutingFind as ScoutingFind])
  React.useEffect(() => {
    const calcSummary = async () => {
      if (!dataStore.ready) return
      const newSummary = await clusterCalc(dataStore, scoutingFind as ScoutingFind)
      setSummary(newSummary)
    }
    calcSummary()
  }, [scoutingFind, dataStore.ready])

  // let profitSymbol = '~'
  // if (scanComplete) profitSymbol = ''
  // else if (hasCount && hasScans && numScans < clusterCount) profitSymbol = '>'

  let myAttendanceState = AttendanceStateEnum.NotJoined
  if (scoutingFind.attendanceIds?.includes(me?.owner?.userId as string)) {
    myAttendanceState = me
      ? me.state === SessionUserStateEnum.Travelling
        ? AttendanceStateEnum.EnRoute
        : AttendanceStateEnum.Joined
      : AttendanceStateEnum.NotJoined
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

  const scoutId = makeHumanIds(getSafeName(scoutingFind.owner?.scName), scoutingFind.scoutingFindId)

  const enableEditButton = (standalone && scoutingFind.clusterType !== ScoutingFindTypeEnum.Ship) || allowEdit

  if (!summary || !dataStore.ready) return <div>loading lookups...</div>

  const summaryVolume =
    scoutingFind.clusterType === ScoutingFindTypeEnum.Vehicle ? summary.volume * 10000 : summary.volume

  return (
    <>
      <Grid container spacing={{ xs: 1, sm: 2 }} padding={{ xs: 1, sm: 2 }} sx={styles.containerGrid}>
        {!standalone && !isNew && <Typography sx={styles.scoutingFindId}>{scoutId}</Typography>}

        {/* THE STATE (WITH DROPDOWN) */}
        {!standalone && (
          <Box sx={styles.stateBox}>
            {allowEdit ? (
              <Select
                sx={styles.stateSelect}
                variant="standard"
                onChange={(e) => {
                  onChange && onChange({ ...scoutingFind, state: e.target.value as ScoutingFindStateEnum })
                }}
                renderValue={(value) => getScoutingFindStateName(value as ScoutingFindStateEnum)}
                value={(scoutingFind.state as string) || (ScoutingFindStateEnum.Discovered as string)}
              >
                {SCOUTING_FIND_STATE_NAMES.map((state) => (
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
        <Grid container spacing={{ xs: 0, sm: 2 }} padding={{ xs: 0, sm: 2 }} xs={12}>
          {/* Hero card */}
          <Grid xs={12} sm={3} sx={styles.topRowGrid}>
            <Box sx={styles.numberBox}>
              <Typography sx={styles.itemName}>{itemName}</Typography>
              <Badge overlap="circular" badgeContent={<Icon />} sx={styles.clusterCountBadge}>
                <Avatar
                  sx={styles.clusterCount}
                  onClick={() => {
                    enableEditButton && setEditCountModalOpen(true)
                  }}
                >
                  {scoutingFind.clusterCount || 1}
                  {enableEditButton && (
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
            {scoutingFind.clusterType === ScoutingFindTypeEnum.Vehicle &&
              vehicleFind.vehicleRocks[0] &&
              vehicleFind.vehicleRocks[0].ores[0] && (
                <Typography sx={styles.gemName}>{vehicleFind.vehicleRocks[0].ores[0].ore}</Typography>
              )}
            {!standalone && !isShare && (
              <Box>
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
            {!standalone && (
              <>
                <Typography variant="overline" component="div">
                  {isShare ? (
                    <>Found {dayjs(scoutingFind.createdAt).format('MMM D, h:mm a')} By:</>
                  ) : (
                    <>Found {dayjs(scoutingFind.createdAt).from(dayjs(Date.now()))} By:</>
                  )}
                </Typography>
                <ScoutingFindUserList
                  users={[scoutingFind.owner as User]}
                  meId={me?.owner?.userId as string}
                  ownerId={scoutingFind.ownerId}
                />
              </>
            )}
          </Grid>
          {/* Cluster stats */}
          <Grid xs={12} sm={standalone || isShare ? 9 : 4.5} sx={styles.topRowGrid}>
            <Typography variant="overline" component="div">
              Cluster Stats
            </Typography>
            <TableContainer sx={{ opacity: scoutingFind.clusterType !== ScoutingFindTypeEnum.Salvage ? 1 : 0.2 }}>
              <Table size="small" sx={styles.statsTable}>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="right">
                      {scoutingFind.clusterType === ScoutingFindTypeEnum.Vehicle ? 'mSCU' : 'SCU'}
                    </TableCell>
                    <TableCell align="right">aUEC</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {summary.value > 0 &&
                    summary.oreSort
                      ?.filter((ore) => ore !== ShipOreEnum.Inertmaterial)
                      .map((oreKey) => {
                        const { value, volume } = (summary.byOre || {})[oreKey] as FindSummary
                        const volumeUnitted =
                          scoutingFind.clusterType === ScoutingFindTypeEnum.Vehicle ? volume * 10000 : volume
                        return (
                          <TableRow key={oreKey}>
                            <TableCell>{getOreName(oreKey)}</TableCell>
                            <TableCell align="right">
                              {MValueFormatter(
                                volumeUnitted,
                                MValueFormat.number_sm,
                                findDecimals(volumeUnitted, true)
                              )}
                            </TableCell>
                            <TableCell align="right">
                              {MValueFormatter(value, MValueFormat.number_sm, findDecimals(value))}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                </TableBody>
                <TableFooter>
                  <TableRow sx={styles.totalRow}>
                    <TableCell>Total</TableCell>
                    <TableCell align="right">
                      {MValueFormatter(summaryVolume, MValueFormat.number_sm, findDecimals(summaryVolume, true))}
                    </TableCell>
                    <TableCell align="right">
                      {/* {profitSymbol} */}
                      {MValueFormatter(summary.value, MValueFormat.number_sm, findDecimals(summary.value))}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
            <Stack direction="row" spacing={1} sx={{ my: 2 }}>
              {scoutingFind.clusterType === ScoutingFindTypeEnum.Ship && (
                <Box
                  sx={{
                    maxWidth: 150,
                    color: 'text.secondary',
                    opacity: 0.8,
                    border: '1px solid',
                    borderRadius: 2,
                    p: 1,
                    '& .MuiTableCell-root': {
                      p: 0.2,
                      m: 0,
                      fontSize: '0.7rem',
                    },
                  }}
                >
                  <TableContainer>
                    <Table size="small" sx={styles.statsTable}>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={2}> Enough ore for:</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="right">{(summary.volume / 32).toFixed(1)}</TableCell>
                          <TableCell>Prospector(s)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="right">{(summary.volume / 96).toFixed(1)}</TableCell>
                          <TableCell>Mole(s)</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Stack>

            {scoutingFind.clusterType === ScoutingFindTypeEnum.Salvage && (
              <Typography
                variant="caption"
                component="div"
                sx={{
                  maxWidth: 300,
                  color: theme.palette.primary.main,
                  fontStyle: 'italic',
                }}
              >
                Note: Salvage scouting is still pretty new so all you can do for now is report the number of wrecks in
                an area.
              </Typography>
            )}
            {!standalone && (
              <Tooltip title="Add a note">
                <Box onClick={() => setOpenNoteDialog(true)}>
                  {isShare ? (
                    <Typography variant="caption">{scoutingFind.note}</Typography>
                  ) : (
                    <>
                      <Typography variant="overline" component="div">
                        <NoteAdd
                          sx={{ color: hasNote ? yellow[500] : 'inherit', fontSize: 14, lineHeight: 10, mx: 0.2 }}
                        />
                        {hasNote ? 'Note' : 'Add a note'}
                      </Typography>
                      <Typography variant="caption">{scoutingFind.note}</Typography>
                    </>
                  )}
                </Box>
              </Tooltip>
            )}
          </Grid>
          {/* Actions and attendance */}
          {!standalone && !isShare && (
            <Grid xs={12} sm={4.5} sx={styles.topRowGrid}>
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
                      sx={{ flexGrow: 1, color: theme.palette.error.main }}
                    >
                      <ExitToApp color={myAttendanceState === AttendanceStateEnum.NotJoined ? undefined : 'error'} />
                      Depart
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              )}

              {enRouteUsers.length > 0 && (
                <>
                  <Typography variant="overline" component="div">
                    En-Route:
                  </Typography>
                  {me && (
                    <ScoutingFindUserList
                      meId={me.owner?.userId as string}
                      users={enRouteUsers}
                      ownerId={scoutingFind.ownerId}
                    />
                  )}
                </>
              )}

              <Typography variant="overline" component="div">
                On-Site:
              </Typography>
              {me && (
                <ScoutingFindUserList
                  meId={me.owner?.userId as string}
                  users={onSiteUsers}
                  ownerId={scoutingFind.ownerId}
                />
              )}
            </Grid>
          )}
        </Grid>
        {/* Rock scans */}
        {scoutingFind.clusterType === ScoutingFindTypeEnum.Ship && (
          <Grid container paddingX={2} xs={12} sx={styles.bottomRowGrid}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="overline" component="div">
                  Rocks Scanned: {shipFind.shipRocks?.length || vehicleFind.vehicleRocks?.length || 0}/
                  {shipFind.clusterCount || 0}
                </Typography>
                <div style={{ flexGrow: 1 }} />
                {allowEdit && (
                  <Button
                    startIcon={<AddCircle />}
                    size="small"
                    variant="text"
                    onClick={() => {
                      setEditScanModalOpen([-1, false])
                      // setAddScanModalOpen({
                      //   __typename: 'ShipRock',
                      //   state: RockStateEnum.Ready,
                      //   mass: 3000,
                      //   ores: [],
                      // })
                      onChange &&
                        onChange({
                          ...shipFind,
                          clusterCount: (shipFind.clusterCount || 0) + 1,
                        })
                    }}
                  >
                    Add Rock
                  </Button>
                )}
              </Box>
              <Grid
                container
                sx={isShare ? styles.scansGridShare : styles.scansGrid}
                margin={{ xs: 0, sm: 1 }}
                spacing={{ xs: 1, sm: 2 }}
              >
                {scoutingFind.clusterType === ScoutingFindTypeEnum.Ship &&
                  (shipFind.shipRocks || []).map((rock, idx) => {
                    const newOres = [...(rock.ores || [])]
                    newOres.sort((a, b) => (b.percent || 0) - (a.percent || 0))
                    const newRock = { ...rock, ores: newOres }
                    return (
                      <Grid key={idx} xs={6} sm={4} md={3}>
                        <ShipRockCard
                          rock={newRock}
                          rockValue={
                            summary.byRock && summary.byRock.length > idx ? summary.byRock[idx].value : undefined
                          }
                          allowEdit={allowEdit}
                          onChangeState={(newState) => {
                            onChange &&
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
                        onDelete={() => {
                          if (!shipFind.shipRocks || !shipFind.clusterCount) return
                          if (shipFind.clusterCount <= shipFind.shipRocks.length) return
                          onChange &&
                            onChange({
                              ...shipFind,
                              clusterCount: shipFind.clusterCount - 1,
                            })
                        }}
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
              onChange &&
                onChange({
                  ...(shipFind || {}),
                  shipRocks: (shipFind?.shipRocks || []).filter((rock, idx) => idx !== editScanModalOpen[0]),
                })
              setEditScanModalOpen([-1, false])
            }
          }}
          onSubmit={(rock) => {
            if (addScanModalOpen !== false) {
              onChange &&
                onChange({
                  ...(shipFind || {}),
                  clusterCount: Math.max(shipFind?.clusterCount || 0, shipFind?.shipRocks.length + 1),
                  shipRocks: [...(shipFind?.shipRocks || []), rock],
                })
              setAddScanModalOpen(false)
            } else if (editScanModalOpen[1] !== false) {
              onChange &&
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
        numScans={numScans}
        clusterType={shipFind?.clusterType as ScoutingFindTypeEnum}
        onClose={() => {
          setEditCountModalOpen(false)
        }}
        onSave={(newCount, gemType, gemSize) => {
          setEditCountModalOpen(false)
          if (shipFind?.clusterType === ScoutingFindTypeEnum.Ship) {
            onChange && onChange({ ...shipFind, clusterCount: newCount })
          } else if (shipFind?.clusterType === ScoutingFindTypeEnum.Vehicle) {
            const vehicleRocks: VehicleRock[] = Array.from({ length: newCount }, (_, idx) => ({
              __typename: 'VehicleRock',
              mass: gemSize as number,
              ores: [
                {
                  ore: gemType as VehicleOreEnum,
                  percent: 1.0,
                  __typename: 'VehicleRockOre',
                },
              ],
            }))
            onChange && onChange({ ...vehicleFind, clusterCount: newCount, vehicleRocks })
          } else {
            onChange && onChange({ ...shipFind, clusterCount: newCount })
          }
        }}
        isNew={isNew}
      />
      {/* NOTE DIALOG */}
      <NoteAddDialog
        title={`Note for: ${scoutId}`}
        open={openNoteDialog}
        onClose={() => setOpenNoteDialog(false)}
        note={scoutingFind.note as string}
        onChange={(note) => {
          onChange && onChange({ ...scoutingFind, note })
        }}
      />
    </>
  )
}
