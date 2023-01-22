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
  Stack,
  Divider,
  Avatar,
  Badge,
  ToggleButton,
  ToggleButtonGroup,
  ThemeProvider,
  ListItemText,
  ListItem,
  List,
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
} from '@regolithco/common'
import { ClawIcon, GemIcon, RockIcon } from '../../../icons'
import { AddCircle, Person, Public, RocketLaunch, Room, SvgIconComponent } from '@mui/icons-material'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { ShipRockCard } from '../../cards/ShipRockCard'
import { DeleteModal } from '../../modals/DeleteModal'
import { ShipRockEntryModal } from '../../modals/ShipRockEntryModal'
import { ScoutingClusterCountModal } from '../../modals/ScoutingClusterCountModal'
import { fontFamilies, scoutingFindStateThemes } from '../../../theme'

export interface ScoutingFindCalcProps {
  scoutingFind: ScoutingFind
  me: SessionUser
  allowEdit?: boolean
  allowWork?: boolean
  standalone?: boolean
  isNew?: boolean
  onChange: (scoutingFind: ScoutingFind) => void
  onDelete?: () => void
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  containerGrid: {
    background: theme.palette.background.default,
    overflow: 'hidden',
    height: '100%',
    width: '100%',
    '* .MuiTypography-overline': {
      color: theme.palette.text.secondary,
      borderBottom: '1px solid',
    },
  },
  numberBox: {
    position: 'relative',
    textAlign: 'center',
    mt: 3,
    pb: 2,
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
  attendanceList: {
    '& .MuiListItem-root': {
      p: 0,
    },
    '& .MuiTypography-root': {
      display: 'block',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  },
  statsTable: {
    // maxWidth: 300,
    '& .MuiTableCell-root, & .MuiTableCell-root *': {
      // fontSize: 10,
      padding: 0,
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
  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2} padding={2} sx={styles.containerGrid}>
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
              <Box>{getScoutingFindStateName(scoutingFind.state as ScoutingFindStateEnum)}</Box>
            )}
          </Box>
        )}
        {/* Top row grid */}
        <Grid container spacing={2} padding={2} xs={12}>
          {/* Hero card */}
          {!standalone && (
            <Grid xs={standalone ? 5 : 4} sx={styles.topRowGrid}>
              <Box sx={styles.numberBox}>
                <Typography sx={styles.itemName}>{itemName}</Typography>
                <Badge overlap="circular" badgeContent={<Icon />} sx={styles.clusterCountBadge}>
                  <Avatar
                    sx={styles.clusterCount}
                    onClick={() => {
                      allowEdit && setEditCountModalOpen(true)
                    }}
                  >
                    {scoutingFind.clusterCount || 1}
                    {allowEdit && (
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
              )}
            </Grid>
          )}
          {/* Cluster stats */}
          <Grid xs={standalone ? 7 : 5} sx={styles.topRowGrid}>
            <Typography variant="overline" component="div">
              Cluster Stats
            </Typography>
            <TableContainer>
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
                    <TableCell align="right">{MValueFormatter(summary.volume, MValueFormat.number_sm, 1)}</TableCell>
                    <TableCell align="right">
                      {profitSymbol}
                      {MValueFormatter(summary.potentialProfit, MValueFormat.number_sm)}
                    </TableCell>
                  </TableRow>
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
                </TableFooter>
              </Table>
            </TableContainer>
          </Grid>
          {/* Actions and attendance */}
          {!standalone && (
            <Grid xs={3} sx={styles.topRowGrid}>
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
                {scoutingFind.owner?.scName}
              </Typography>
              <Typography variant="overline" component="div">
                On Site:
              </Typography>
              <List dense disablePadding sx={styles.attendanceList}>
                {scoutingFind.attendance?.map((att, idx) => (
                  <ListItem key={`user-${idx}`} divider>
                    <ListItemText
                      primary={
                        <>
                          <Person sx={{ height: 20, width: 20, pr: 1, lineHeight: 1, mb: -0.5 }} /> {att.owner?.scName}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}
        </Grid>
        {/* Rock scans */}
        {scoutingFind.clusterType === ScoutingFindTypeEnum.Ship && (
          <Grid container paddingX={2} xs={12} sx={styles.bottomRowGrid}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="overline" component="div">
                  Rock Scans
                </Typography>
                <div style={{ flexGrow: 1 }} />
                <Button
                  startIcon={<AddCircle />}
                  size="small"
                  variant="contained"
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
                {scoutingFind.clusterType === ScoutingFindTypeEnum.Ship &&
                  (shipFind.shipRocks || []).map((rock, idx) => {
                    rock.ores?.sort((a, b) => (b.percent || 0) - (a.percent || 0))
                    return (
                      <Grid key={idx} xs={6} sm={4}>
                        <ShipRockCard
                          rock={rock}
                          rockValue={summary.byRock ? summary.byRock[idx] : undefined}
                          onChangeState={(newState) => {
                            const newRocks = [...(shipFind.shipRocks || [])]
                            newRocks[idx].state = newState
                            onChange({
                              ...shipFind,
                              shipRocks: newRocks,
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
