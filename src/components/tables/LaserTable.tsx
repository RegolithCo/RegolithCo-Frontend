import * as React from 'react'
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Stack,
  FormControlLabel,
  Switch,
  Chip,
  SxProps,
  Theme,
  alpha,
  Tooltip,
  Button,
} from '@mui/material'
import {
  BackwardStats,
  LaserLoadoutStats,
  LoadoutShipEnum,
  MiningLaserEnum,
  MiningStoreEnum,
  ObjectValues,
  getMiningStoreName,
  Lookups,
} from '@regolithco/common'
import { BarChart, Bolt, Check, ClearAll, Store } from '@mui/icons-material'
import Gradient from 'javascript-color-gradient'
import { LongCellHeader, StatsCell, tableStylesThunk } from './tableCommon'
import { fontFamilies } from '../../theme'
import { MValueFormat, MValueFormatter } from '../fields/MValue'
import { LookupsContext } from '../../context/lookupsContext'

export interface LaserTableProps {
  onAddToLoadout: (module: MiningLaserEnum) => void
}

const ColumnGroupEnum = {
  Base: 'Base',
  Buffs: 'Buffs',
  Market: 'Market',
} as const
type ColumnGroupEnum = ObjectValues<typeof ColumnGroupEnum>

export const LaserTable: React.FC<LaserTableProps> = ({ onAddToLoadout }) => {
  const theme = useTheme()
  const styles = tableStylesThunk(theme)
  const [selected, setSelected] = React.useState<MiningLaserEnum[]>([])
  const [columnGroups, setColumnGroups] = React.useState<ColumnGroupEnum[]>(Object.values(ColumnGroupEnum))
  const [filterSelected, setFilterSelected] = React.useState<boolean>(false)
  const [shipFilter, setShipFilter] = React.useState<LoadoutShipEnum | null>(null)

  const dataStore = React.useContext(LookupsContext)

  const bgColors = new Gradient()
    .setColorGradient('#b93327', '#229f63')
    .setMidpoint(100)
    .getColors()
    .map((c) => alpha(c, 0.3))
  const fgColors = bgColors.map((color) => theme.palette.getContrastText(color))

  const filteredVals = React.useMemo(() => {
    if (!dataStore.ready) return []
    const loadoutLookup = dataStore.getLookup('loadout') as Lookups['loadout']
    return Object.values(loadoutLookup.lasers)
      .filter((laser) => {
        if (shipFilter === LoadoutShipEnum.Mole) return laser.size === 2
        if (shipFilter === LoadoutShipEnum.Prospector) return laser.size === 1
        return true
      })
      .filter((laser) => {
        if (!filterSelected) return true
        if (selected.length === 0) return true
        return selected.includes(laser.code as MiningLaserEnum)
      })
  }, [filterSelected, selected, shipFilter, dataStore.ready])

  const [maxMin, statsRank] = React.useMemo(() => {
    // Create a dictionary of max and min values for each of the following laser.stats:
    // optimumRange,maxRange,minPower,maxPower,extrPower,minPowerPct,resistance,instability,optimalChargeRate,optimalChargeWindow,inertMaterials,overchargeRate,clusterMod,shatterDamage,  }, [])
    const maxMin: Record<string, { max: number; min: number }> = {}
    filteredVals.forEach((laser) => {
      Object.entries(laser.stats).forEach(([key, value]) => {
        if (typeof value === 'number') {
          if (!maxMin[key]) maxMin[key] = { max: value, min: value }
          else {
            maxMin[key].max = Math.max(maxMin[key].max, value)
            maxMin[key].min = Math.min(maxMin[key].min, value)
          }
        }
      })
    })
    // Now I want each value for each laser to be a number between 0 and 1, where 0 is the min and 1 is the max. User null for values that are not numbers.
    const statsRank: Record<string, Partial<Record<MiningLaserEnum, number | null>>> = {}
    Object.entries(maxMin).forEach(([key, { max, min }]) => {
      statsRank[key] = {}
      filteredVals.forEach((laser) => {
        const value = laser.stats[key as keyof LaserLoadoutStats] as number | undefined
        if (typeof value === 'number') {
          statsRank[key][laser.code as MiningLaserEnum] = (value - min) / (max - min)
        } else {
          statsRank[key][laser.code as MiningLaserEnum] = null
        }
      })
    })

    return [maxMin, statsRank]
  }, [filteredVals])

  const handleShipFilter = (event: React.MouseEvent<HTMLElement>, newFilter: LoadoutShipEnum | 'ALL') => {
    if (newFilter === 'ALL') setShipFilter(null)
    else setShipFilter(newFilter)
  }

  const handleColumnGroupChange = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    newColumnGroups: ColumnGroupEnum[]
  ) => {
    setColumnGroups(newColumnGroups)
  }

  const handleSelectedChange = (laser: MiningLaserEnum, checked: boolean) => {
    if (checked) setSelected([...selected, laser])
    else {
      const newSelected = selected.filter((s) => s !== laser)
      setSelected(newSelected)
      if (newSelected.length === 0) setFilterSelected(false)
    }
  }

  const stores = Object.values(MiningStoreEnum)
  if (!dataStore.ready) return <div>Loading...</div>
  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Mining Lasers
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <Typography variant="overline" sx={{ alignSelf: 'center' }}>
          Filter:
        </Typography>
        <ToggleButtonGroup
          size="small"
          value={shipFilter || 'ALL'}
          exclusive
          onChange={handleShipFilter}
          aria-label="text alignment"
        >
          <ToggleButton value={'ALL'} aria-label="left aligned">
            All
          </ToggleButton>
          <ToggleButton
            value={LoadoutShipEnum.Prospector}
            aria-label="centered"
            color="info"
            sx={{
              color: theme.palette.info.dark,
            }}
          >
            Prospector
          </ToggleButton>
          <ToggleButton
            value={LoadoutShipEnum.Mole}
            aria-label="right aligned"
            color="success"
            sx={{
              color: theme.palette.success.dark,
            }}
          >
            Mole
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          size="small"
          value={columnGroups}
          onChange={handleColumnGroupChange}
          aria-label="text alignment"
        >
          <ToggleButton value={ColumnGroupEnum.Base} aria-label="Base stats">
            <BarChart /> Attributes
          </ToggleButton>
          <ToggleButton value={ColumnGroupEnum.Buffs} aria-label="Buffs">
            <Bolt /> Buffs
          </ToggleButton>
          <ToggleButton value={ColumnGroupEnum.Market} aria-label="Stores">
            <Store /> Stores
          </ToggleButton>
        </ToggleButtonGroup>

        <FormControlLabel
          disabled={selected.length === 0}
          control={
            <Switch
              checked={filterSelected && selected.length > 0}
              onChange={(e) => setFilterSelected(e.target.checked)}
            />
          }
          label="Selected"
        />
        <Button
          onClick={() => {
            setSelected([])
            setFilterSelected(false)
          }}
          variant="text"
          size="small"
          startIcon={<ClearAll />}
        >
          Clear Selection
        </Button>
      </Stack>
      <Paper sx={{ mb: 4 }}>
        <TableContainer sx={styles.table}>
          <Table size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={styles.shortHeaderFirst}>Laser</TableCell>
                <TableCell sx={styles.shortHeader} align="center">
                  Size
                </TableCell>
                <TableCell sx={styles.shortHeader} align="right">
                  Price
                </TableCell>
                <TableCell sx={styles.shortHeader} align="center">
                  Slots
                </TableCell>

                {filteredVals.length > 0 && columnGroups.includes(ColumnGroupEnum.Base) && (
                  <>
                    <LongCellHeader>Optimum Range</LongCellHeader>
                    <LongCellHeader>Max. Range</LongCellHeader>
                    <LongCellHeader>Min. Power %</LongCellHeader>
                    <LongCellHeader>Min. Power</LongCellHeader>
                    <LongCellHeader>Max. Power</LongCellHeader>
                    <LongCellHeader>Extract Power</LongCellHeader>
                  </>
                )}
                {filteredVals.length > 0 && columnGroups.includes(ColumnGroupEnum.Buffs) && (
                  <>
                    <LongCellHeader>Resistance</LongCellHeader>
                    <LongCellHeader>Instability</LongCellHeader>
                    <LongCellHeader>Optimal Charge Rate</LongCellHeader>
                    <LongCellHeader>Optimal Charge Window</LongCellHeader>
                    <LongCellHeader>Inert Materials</LongCellHeader>
                    {/* <LongCellHeader>Overcharge Rate</LongCellHeader>
              <LongCellHeader>Clustering</LongCellHeader>
              <LongCellHeader>Shatter Damage</LongCellHeader> */}
                  </>
                )}
                {filteredVals.length > 0 && columnGroups.includes(ColumnGroupEnum.Market) && (
                  <>
                    {stores.map((store, idx) => (
                      <LongCellHeader key={`${store}-${idx}`}>{getMiningStoreName(store)}</LongCellHeader>
                    ))}
                  </>
                )}
                {/* We add a cell at the end to let it grow*/}
                <TableCell sx={styles.spacerCell}> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={100} sx={{ textAlign: 'center' }}>
                    <Typography variant="overline">
                      <em>No lasers found after filtering</em>
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {filteredVals.map((laser, idx) => {
                const rowSelected = selected.includes(laser.code as MiningLaserEnum)
                const rowEven = idx % 2 === 0

                const rankColors: Record<string, SxProps<Theme>> = Object.entries(statsRank).reduce(
                  (acc, [statName, statObj]) => {
                    const isReversed = BackwardStats.includes(statName)
                    const statVal = statObj[laser.code as MiningLaserEnum]
                    acc[statName] = {}
                    if (typeof statVal === 'number') {
                      const normRank = isReversed ? 1 - statVal : statVal
                      const colIndex = Math.round(normRank * 99)
                      acc[statName] = {
                        color: fgColors[colIndex],
                        backgroundColor: bgColors[colIndex],
                      }
                    }
                    return acc
                  },
                  {} as Record<string, SxProps<Theme>>
                )
                const bgColor = rowSelected
                  ? theme.palette.action.selected
                  : rowEven
                  ? theme.palette.background.paper
                  : theme.palette.background.default
                return (
                  <TableRow
                    key={`${laser.code}-${idx}`}
                    onClick={() => handleSelectedChange(laser.code as MiningLaserEnum, !rowSelected)}
                    sx={{
                      backgroundColor: bgColor,
                      '&:hover': {
                        backgroundColor: rowSelected ? theme.palette.action.selected : theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        fontFamily: fontFamilies.robotoMono,
                        whiteSpace: 'nowrap',
                        fontWeight: 'bold',
                        // STICKY FIRST COLUMN
                        position: 'sticky',
                        backgroundColor: rowSelected ? '#444' : theme.palette.background.paper,
                        '&:hover': {
                          backgroundColor: rowSelected
                            ? alpha(theme.palette.action.selected, 1)
                            : alpha(theme.palette.action.hover, 1),
                        },
                        zIndex: 3,
                        borderRight: `3px solid ${theme.palette.primary.main}`,
                      }}
                    >
                      {laser.name}
                    </TableCell>
                    <TableCell padding="checkbox" align="center" sx={styles.tinyCell}>
                      {laser.size === 1 ? (
                        <Chip color="info" label="1" size="small" />
                      ) : (
                        <Chip color="success" label="2" size="small" />
                      )}
                    </TableCell>
                    <Tooltip
                      placement="top"
                      title={laser.price ? MValueFormatter(laser.price, MValueFormat.currency) : 'Price Unknown'}
                    >
                      <TableCell sx={{ fontFamily: fontFamilies.robotoMono, whiteSpace: 'nowrap' }} align="right">
                        {laser.price ? MValueFormatter(laser.price, MValueFormat.currency_sm) : '--'}
                      </TableCell>
                    </Tooltip>
                    <TableCell sx={Object.assign({}, styles.sectionDivider, styles.tinyCell)} align="center">
                      {laser.slots}
                    </TableCell>

                    {columnGroups.includes(ColumnGroupEnum.Base) && (
                      <>
                        <TableCell sx={Object.assign({}, styles.numericCell, rankColors['optimumRange'])}>
                          {laser.stats.optimumRange}
                        </TableCell>
                        <TableCell sx={Object.assign({}, styles.numericCell, rankColors['maxRange'])}>
                          {laser.stats.maxRange}
                        </TableCell>
                        <TableCell sx={Object.assign({}, styles.numericCell, rankColors['minPowerPct'])}>
                          {MValueFormatter(laser.stats.minPowerPct, MValueFormat.percent)}
                        </TableCell>
                        <TableCell sx={Object.assign({}, styles.numericCell, rankColors['minPower'])}>
                          {laser.stats.minPower}
                        </TableCell>
                        <TableCell sx={Object.assign({}, styles.numericCell, rankColors['maxPower'])}>
                          {laser.stats.maxPower}
                        </TableCell>
                        <TableCell
                          sx={Object.assign({}, styles.numericCell, styles.sectionDivider, rankColors['extrPower'])}
                        >
                          {laser.stats.extrPower}
                        </TableCell>
                      </>
                    )}
                    {columnGroups.includes(ColumnGroupEnum.Buffs) && (
                      <>
                        <StatsCell
                          value={laser.stats.resistance}
                          maxMin={maxMin['resistance']}
                          reversed={BackwardStats.includes('resistance')}
                        />
                        <StatsCell
                          value={laser.stats.instability}
                          maxMin={maxMin['instability']}
                          reversed={BackwardStats.includes('instability')}
                        />
                        <StatsCell
                          value={laser.stats.optimalChargeRate}
                          maxMin={maxMin['optimalChargeRate']}
                          reversed={BackwardStats.includes('optimalChargeRate')}
                        />
                        <StatsCell
                          value={laser.stats.optimalChargeWindow}
                          maxMin={maxMin['optimalChargeWindow']}
                          reversed={BackwardStats.includes('optimalChargeWindow')}
                        />
                        <StatsCell
                          value={laser.stats.inertMaterials}
                          maxMin={maxMin['inertMaterials']}
                          reversed={BackwardStats.includes('inertMaterials')}
                          sx={styles.sectionDivider}
                        />
                        {/* <StatsCell value={laser.stats.overchargeRate} />
                <StatsCell value={laser.stats.clusterMod} />
                <StatsCell value={laser.stats.shatterDamage} /> */}
                      </>
                    )}
                    {columnGroups.includes(ColumnGroupEnum.Market) && (
                      <>
                        {stores.map((store, idx) => (
                          <TableCell
                            key={`${store}-${idx}`}
                            sx={Object.assign({}, styles.cellDivider, styles.storeCell)}
                            padding="checkbox"
                          >
                            {laser.stores.includes(store) ? <Check color="success" /> : null}
                          </TableCell>
                        ))}
                      </>
                    )}

                    {/* We add a cell at the end to let it grow*/}
                    <TableCell sx={styles.spacerCell}> </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}
