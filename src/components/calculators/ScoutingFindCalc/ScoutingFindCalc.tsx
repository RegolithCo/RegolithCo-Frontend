import * as React from 'react'
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TableFooter,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Slider,
  SxProps,
  Theme,
  useTheme,
  Box,
  Button,
} from '@mui/material'
import {
  SalvageFind,
  ScoutingFind,
  ShipClusterFind,
  VehicleClusterFind,
  clusterCalc,
  FindSummary,
  getOreName,
  getVehicleOreName,
  ScoutingFindTypeEnum,
  SessionUser,
} from '@orgminer/common'
import { ClawIcon, GemIcon, RockIcon } from '../../../icons'
import { AddCircle, Rocket, SvgIconComponent } from '@mui/icons-material'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { ShipRockCard } from '../../cards/ShipRockCard'
import { ShipOreChooser } from '../../fields/ShipOreChooser'
import { ActiveUserList } from '../../fields/ActiveUserList'

export interface ScoutingFindCalcProps {
  scoutingFind: ScoutingFind
}

function valuetext(value: number) {
  return `${value}°C`
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  containerGrid: {
    overflow: 'hidden',
    height: '100%',
  },
  topRowGrid: {
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
export const ScoutingFindCalc: React.FC<ScoutingFindCalcProps> = ({ scoutingFind }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)

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
  switch (scoutingFind.clusterType) {
    case ScoutingFindTypeEnum.Salvage:
      hasScans = salvageFind.wrecks && salvageFind.wrecks.length > 0
      scanComplete = hasScans && hasCount && salvageFind.wrecks.length === scoutingFind.clusterCount
      numScans = hasScans ? salvageFind.wrecks.length : 0
      Icon = ClawIcon
      break
    case ScoutingFindTypeEnum.Ship:
      hasScans = shipFind.shipRocks && shipFind.shipRocks.length > 0
      scanComplete = hasScans && hasCount && shipFind.shipRocks.length === scoutingFind.clusterCount
      numScans = hasScans ? shipFind.shipRocks.length : 0
      Icon = RockIcon
      break
    case ScoutingFindTypeEnum.Vehicle:
      hasScans = vehicleFind.vehicleRocks && vehicleFind.vehicleRocks.length > 0
      scanComplete = hasScans && hasCount && vehicleFind.vehicleRocks.length === scoutingFind.clusterCount
      numScans = hasScans ? vehicleFind.vehicleRocks.length : 0
      Icon = GemIcon
      break
  }
  const summary = clusterCalc(scoutingFind)
  let profitSymbol = '~'
  if (scanComplete) profitSymbol = ''
  else if (hasCount && hasScans && numScans < clusterCount) profitSymbol = '>'
  return (
    <Grid container spacing={2} padding={2} sx={styles.containerGrid}>
      {/* Top row grid */}
      <Grid container spacing={2} padding={2} xs={12}>
        {/* Hero card */}
        <Grid xs={3} sx={styles.topRowGrid}>
          <Typography sx={{ fontSize: 20 }}>{scoutingFind.clusterCount}</Typography>
          <Typography>{scoutingFind.state}</Typography>
          <Typography>{scoutingFind.owner?.scName}</Typography>
          <Slider
            aria-label="Temperature"
            defaultValue={3}
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={16}
          />
        </Grid>
        {/* Cluster stats */}
        <Grid xs={4} sx={styles.topRowGrid}>
          <TableContainer>
            <Table size="small" sx={{ maxWidth: 300, '& .MuiTableCell-root': { fontSize: 10, padding: 0 } }}>
              <TableHead>
                <TableRow>
                  <TableCell>Ore</TableCell>
                  <TableCell align="right">SCU</TableCell>
                  <TableCell align="right">aUEC</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell align="right">
                    {MValueFormatter(summary.volume / 100, MValueFormat.number_sm, 1)}
                  </TableCell>
                  <TableCell align="right">
                    {profitSymbol}
                    {MValueFormatter(summary.potentialProfit, MValueFormat.number_sm)}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.oreSort?.map((oreKey) => {
                  const { mass, potentialProfit, volume } = (summary.byOre || {})[oreKey] as FindSummary
                  return (
                    <TableRow key={oreKey}>
                      <TableCell>{getOreName(oreKey)}</TableCell>
                      <TableCell align="right">{MValueFormatter(volume / 100, MValueFormat.number_sm, 1)}</TableCell>
                      <TableCell align="right">{MValueFormatter(potentialProfit, MValueFormat.number_sm)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} sx={{ display: 'flex' }}>
                    Prsptr: 7<div style={{ flex: '1 1' }} /> Moles: 3
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Grid>
        {/* Actions and attendance */}
        <Grid xs={5} sx={styles.topRowGrid}>
          <Typography variant="overline">On Site:</Typography>
          <ActiveUserList small sessionUsers={(scoutingFind.attendance || []) as SessionUser[]} />
        </Grid>
      </Grid>
      {/* Rock scans */}
      {scoutingFind.clusterType === ScoutingFindTypeEnum.Ship && (
        <Grid container paddingX={2} xs={12} sx={styles.bottomRowGrid}>
          <Box>
            <Box sx={{ display: 'flex' }}>
              <Typography variant="overline">Scans</Typography>
              <div style={{ flexGrow: 1 }} />
              <Button
                startIcon={<AddCircle />}
                size="small"
                variant="text"
                onClick={() => {
                  //
                }}
              >
                Add Scan
              </Button>
            </Box>
            <Grid container sx={styles.scansGrid}>
              {/* {!scanComplete && (
              <Grid>
                <Card sx={{ border: '2px dashed', width: 100, height: 100 }}>
                  <CardContent>
                    <AddCircle />
                    Add Scan
                  </CardContent>
                </Card>
              </Grid>
            )} */}

              {/* {scoutingFind.clusterType === ScoutingFindTypeEnum.Salvage &&
              salvageFind.wrecks.map((wreck, idx) => (
                <Grid xs={2} key={idx}>
                  <Typography>
                    <Rocket />
                    {wreck.size}
                  </Typography>
                </Grid>
              ))} */}
              {scoutingFind.clusterType === ScoutingFindTypeEnum.Ship &&
                shipFind.shipRocks.map((rock, idx) => {
                  rock.ores?.sort((a, b) => (b.percent || 0) - (a.percent || 0))
                  return (
                    <Grid key={idx}>
                      <ShipRockCard rock={rock} rockValue={summary.byRock ? summary.byRock[idx] : undefined} />
                    </Grid>
                  )
                })}
              {/* {scoutingFind.clusterType === ScoutingFindTypeEnum.Vehicle &&
              vehicleFind.vehicleRocks.map((rock) => (
                <>
                  <Card>
                    <CardMedia>
                      <GemIcon />
                    </CardMedia>
                  </Card>
                  <Chip icon={<GemIcon />} title={'something'} />

                  {rock.mass}
                  {rock.ores &&
                    rock.ores
                      .map(
                        ({ percent, ore }) =>
                          `${percent ? percent * 100 : '??%'} ${ore ? getVehicleOreName(ore) : '???'}`
                      )
                      .join(', ')}
                </>
              ))} */}
            </Grid>
          </Box>
        </Grid>
      )}
    </Grid>
  )
}
