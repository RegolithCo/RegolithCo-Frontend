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
  useTheme,
  Box,
  Button,
  Stack,
  Divider,
  Avatar,
  Badge,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
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
} from '@regolithco/common'
import { ClawIcon, GemIcon, RockIcon } from '../../../icons'
import {
  AddCircle,
  FlightLand,
  FlightTakeoff,
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
  Person,
  Public,
  RocketLaunch,
  Room,
  SvgIconComponent,
} from '@mui/icons-material'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { ShipRockCard } from '../../cards/ShipRockCard'
import { ActiveUserList } from '../../fields/ActiveUserList'
import { DeleteModal } from '../../modals/DeleteModal'
import { isEqual, omit } from 'lodash'
import { ShipRockEntryModal } from '../../modals/ShipRockEntryModal'
import { ScoutingClusterCountModal } from '../../modals/ScoutingClusterCountModal'
import { fontFamilies } from '../../../theme'

export interface ScoutingFindCalcProps {
  scoutingFind: ScoutingFind
  isNew?: boolean
  onChange?: (scoutingFind: ScoutingFind) => void
  onDelete?: () => void
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  containerGrid: {
    background: theme.palette.background.default,
    overflow: 'hidden',
    height: '100%',
    '* .MuiTypography-overline': {
      fontSize: 10,
      color: theme.palette.text.secondary,
      borderBottom: '1px solid',
    },
  },
  clusterCountBadge: {
    '& .MuiBadge-badge': {
      height: '60px',
      width: '60px',
      top: '50%',
      left: '60%',
      borderRadius: '50%',
      background: theme.palette.primary.dark,
      color: theme.palette.background.default,
    },
  },
  clusterCount: {
    height: 100,
    width: 100,
    fontSize: 70,
    fontWeight: 'bold',
    color: theme.palette.primary.dark,
    border: `5px solid ${theme.palette.primary.dark}`,
    background: theme.palette.background.default,
  },
  topRowGrid: {
    position: 'relative',
    // border: '1px solid blue!important',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      maxHeight: 150,
      overflow: 'hidden',
    },
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
export const ScoutingFindCalc: React.FC<ScoutingFindCalcProps> = ({ scoutingFind, isNew, onChange, onDelete }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const [editFind, setEditFind] = React.useState<Partial<ScoutingFind>>(
    omit(scoutingFind, ['attendance', 'attendanceIds'])
  )
  const [editCountModalOpen, setEditCountModalOpen] = React.useState<boolean>(Boolean(isNew))
  const [deleteModalOpen, setDeleteModalOpen] = React.useState<boolean>(false)
  const [addScanModalOpen, setAddScanModalOpen] = React.useState<ShipRock | false>(false)
  const [editScanModalOpen, setEditScanModalOpen] = React.useState<[number, ShipRock | false]>([-1, false])

  React.useEffect(() => {
    const noAttendanceNew = omit(scoutingFind, ['attendance', 'attendanceIds'])
    if (!isEqual(noAttendanceNew, editFind)) setEditFind(scoutingFind)
  }, [scoutingFind])

  // Convenience type guards
  const shipFind = editFind as ShipClusterFind
  const vehicleFind = editFind as VehicleClusterFind
  const salvageFind = editFind as SalvageFind

  // Some convenience variables
  const hasCount = Boolean(editFind.clusterCount)
  let hasScans = false
  let scanComplete = false
  let numScans = 0
  const clusterCount = editFind.clusterCount || 0

  let Icon: SvgIconComponent = ClawIcon
  switch (editFind.clusterType) {
    case ScoutingFindTypeEnum.Salvage:
      hasScans = salvageFind.wrecks && salvageFind.wrecks.length > 0
      scanComplete = hasScans && hasCount && salvageFind.wrecks.length === editFind.clusterCount
      numScans = hasScans ? salvageFind.wrecks.length : 0
      Icon = ClawIcon
      break
    case ScoutingFindTypeEnum.Ship:
      hasScans = shipFind.shipRocks && shipFind.shipRocks.length > 0
      scanComplete = hasScans && hasCount && shipFind.shipRocks.length === editFind.clusterCount
      numScans = hasScans ? shipFind.shipRocks.length : 0
      Icon = RockIcon
      break
    case ScoutingFindTypeEnum.Vehicle:
      hasScans = vehicleFind.vehicleRocks && vehicleFind.vehicleRocks.length > 0
      scanComplete = hasScans && hasCount && vehicleFind.vehicleRocks.length === editFind.clusterCount
      numScans = hasScans ? vehicleFind.vehicleRocks.length : 0
      Icon = GemIcon
      break
  }
  const summary = clusterCalc(editFind as ScoutingFind)
  let profitSymbol = '~'
  if (scanComplete) profitSymbol = ''
  else if (hasCount && hasScans && numScans < clusterCount) profitSymbol = '>'
  return (
    <>
      <Grid container spacing={2} padding={2} sx={styles.containerGrid}>
        <Chip
          label={editFind.state}
          sx={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translate(-50%, 0%)',
            fontSize: 10,
            color: theme.palette.primary.contrastText,
            background: theme.palette.primary.dark,
          }}
        />
        {/* Top row grid */}
        <Grid container spacing={2} padding={2} xs={12}>
          {/* Hero card */}
          <Grid xs={4} sx={styles.topRowGrid}>
            <Badge overlap="rectangular" badgeContent={<Icon />} sx={styles.clusterCountBadge}>
              <Avatar sx={styles.clusterCount}>
                {editFind.clusterCount || 1}
                <Button
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: -5,
                    color: theme.palette.primary.dark,
                    fontSize: 10,
                    right: '50%',
                    transform: 'translate(50%, 0%)',
                  }}
                  onClick={() => {
                    setEditCountModalOpen(true)
                  }}
                >
                  Edit
                </Button>
              </Avatar>
            </Badge>
            <ToggleButtonGroup
              size="small"
              aria-label="Small sizes"
              sx={{
                py: 2,
                width: '100%',
              }}
            >
              <ToggleButton value="left" key="left" sx={{ flexGrow: 1 }}>
                <Public />
                <Box
                  sx={{
                    position: 'absolute',
                    fontSize: 6,
                    bottom: 0,
                  }}
                >
                  On my way
                </Box>
              </ToggleButton>
              <ToggleButton value="center" key="center" sx={{ flexGrow: 1 }}>
                <Room />
                <Box
                  sx={{
                    position: 'absolute',
                    fontSize: 6,
                    bottom: 0,
                  }}
                >
                  I'm here
                </Box>
              </ToggleButton>
              <ToggleButton value="justify" key="justify" sx={{ flexGrow: 1 }}>
                <RocketLaunch />
                <Box
                  sx={{
                    position: 'absolute',
                    fontSize: 6,
                    bottom: 0,
                  }}
                >
                  I'm Leaving
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          {/* Cluster stats */}
          <Grid xs={4} sx={styles.topRowGrid}>
            <Typography variant="overline" component="div">
              Cluster Stats
            </Typography>
            <TableContainer>
              <Table
                size="small"
                sx={{
                  maxWidth: 300,
                  '& .MuiTableCell-root, & .MuiTableCell-root *': {
                    fontSize: 10,
                    padding: 0,
                    fontFamily: fontFamilies.robotoMono,
                    fontWeight: 'bold',
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Ore</TableCell>
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
                          <TableCell align="right">
                            {MValueFormatter(volume / 100, MValueFormat.number_sm, 1)}
                          </TableCell>
                          <TableCell align="right">
                            {MValueFormatter(potentialProfit, MValueFormat.number_sm)}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
                <TableFooter>
                  <TableRow
                    sx={{
                      '& .MuiTableCell-root': {
                        borderTop: '2px solid',
                        color: theme.palette.primary.main,
                        borderBottom: '2px solid',
                      },
                    }}
                  >
                    <TableCell>Total</TableCell>
                    <TableCell align="right">
                      {MValueFormatter(summary.volume / 100, MValueFormat.number_sm, 1)}
                    </TableCell>
                    <TableCell align="right">
                      {profitSymbol}
                      {MValueFormatter(summary.potentialProfit, MValueFormat.number_sm)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      sx={{
                        '& *': {
                          textAlign: 'center',
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        divider={<Divider orientation="vertical" flexItem sx={{ py: 1 }} />}
                        sx={{
                          width: '100%',
                        }}
                      >
                        <Stack sx={{ flexGrow: 1 }}>
                          <Typography>{(summary.volume / (32 * 100)).toFixed(1)}</Typography>
                          <Typography>Prosp.</Typography>
                        </Stack>
                        <Stack>
                          <Typography sx={{ lineHeight: 3, fontSize: 10 }}>or</Typography>
                        </Stack>
                        <Stack sx={{ flexGrow: 1 }}>
                          <Typography>{(summary.volume / (96 * 100)).toFixed(1)}</Typography>
                          <Typography>Mole</Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Grid>
          {/* Actions and attendance */}
          <Grid xs={4} sx={styles.topRowGrid}>
            <Typography variant="overline" component="div">
              Discoverd By:
            </Typography>
            <Typography
              component="div"
              variant="caption"
              sx={{
                textAlign: 'center',
                borderTop: `1px solid ${theme.palette.primary.dark}`,
                borderBottom: `1px solid ${theme.palette.primary.dark}`,
              }}
            >
              <Person sx={{ height: 20, width: 20, pr: 1, lineHeight: 1, mb: -0.5 }} />
              {editFind.owner?.scName}
            </Typography>
            <Typography variant="overline" component="div">
              On Site:
            </Typography>
            <ActiveUserList small sessionUsers={(editFind.attendance || []) as SessionUser[]} />
          </Grid>
        </Grid>
        {/* Rock scans */}
        {editFind.clusterType === ScoutingFindTypeEnum.Ship && (
          <Grid container paddingX={2} xs={12} sx={styles.bottomRowGrid}>
            <Box>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="overline" component="div">
                  Rock Scans
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
              <Grid container sx={styles.scansGrid}>
                {editFind.clusterType === ScoutingFindTypeEnum.Ship &&
                  (shipFind.shipRocks || []).map((rock, idx) => {
                    rock.ores?.sort((a, b) => (b.percent || 0) - (a.percent || 0))
                    return (
                      <Grid
                        key={idx}
                        onClick={() => {
                          setAddScanModalOpen(false)
                          setEditScanModalOpen([idx, rock])
                        }}
                      >
                        <ShipRockCard rock={rock} rockValue={summary.byRock ? summary.byRock[idx] : undefined} />
                      </Grid>
                    )
                  })}
              </Grid>
            </Box>
          </Grid>
        )}
      </Grid>
      {editFind.clusterType === ScoutingFindTypeEnum.Ship && (
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
              const shipEditFind = editFind as ShipClusterFind
              setEditFind({
                ...(shipEditFind || {}),
                shipRocks: (shipEditFind?.shipRocks || []).filter((rock, idx) => idx !== editScanModalOpen[0]),
              })
              setEditScanModalOpen([-1, false])
            }
          }}
          onSubmit={(rock) => {
            if (addScanModalOpen !== false) {
              const shipEditFind = editFind as ShipClusterFind
              setEditFind({
                ...(shipEditFind || {}),
                shipRocks: [...(shipEditFind?.shipRocks || []), rock],
              })
              setAddScanModalOpen(false)
            } else if (editScanModalOpen[1] !== false) {
              const shipEditFind = editFind as ShipClusterFind
              setEditFind({
                ...(shipEditFind || {}),
                shipRocks: (shipEditFind?.shipRocks || []).map((r, idx) => (idx === editScanModalOpen[0] ? rock : r)),
              })
              setEditScanModalOpen([-1, false])
            }
          }}
          shipRock={addScanModalOpen !== false ? addScanModalOpen : (editScanModalOpen[1] as ShipRock)}
        />
      )}
      <ScoutingClusterCountModal
        open={editCountModalOpen}
        clusterCount={editFind?.clusterCount || 1}
        clusterType={editFind?.clusterType as ScoutingFindTypeEnum}
        onClose={() => {
          setEditCountModalOpen(false)
        }}
        onSave={(newCount) => {
          setEditCountModalOpen(false)
          setEditFind({ ...editFind, clusterCount: newCount })
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
    </>
  )
}
