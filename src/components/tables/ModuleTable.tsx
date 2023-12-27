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
  SxProps,
  Theme,
  Chip,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  FormControlLabel,
  Button,
  Switch,
  Tooltip,
} from '@mui/material'
import {
  BackwardStats,
  LoadoutShipEnum,
  MiningGadgetEnum,
  MiningModuleEnum,
  MiningStoreEnum,
  ObjectValues,
  getMiningStoreName,
  LoadoutLookup,
} from '@regolithco/common'
import { Bolt, Check, ClearAll, Refresh, Store } from '@mui/icons-material'
import { fontFamilies } from '../../theme'
import { MValueFormat, MValueFormatter } from '../fields/MValue'
import { LongCellHeader, StatsCell, tableStylesThunk } from './tableCommon'
import { useLookups } from '../../hooks/useLookups'

export interface ModuleTableProps {
  onAddToLoadout: (module: MiningModuleEnum | MiningGadgetEnum) => void
}

const ColumnGroupEnum = {
  Buffs: 'Buffs',
  Market: 'Market',
} as const
type ColumnGroupEnum = ObjectValues<typeof ColumnGroupEnum>

export const ModuleTable: React.FC<ModuleTableProps> = ({ onAddToLoadout }) => {
  const theme = useTheme()
  const store = useLookups()
  const styles = tableStylesThunk(theme)
  const [loadoutLookup, setLoadoutLookup] = React.useState<LoadoutLookup | null>(null)
  const [categoryFilter, setCategoryFilter] = React.useState<string[]>(['A', 'P', 'G'])

  React.useEffect(() => {
    const getLoadout = async () => {
      const loadoutResult = await store.getLookup('loadout')
      setLoadoutLookup(loadoutResult)
    }
    getLoadout()
  }, [store])

  const [selected, setSelected] = React.useState<(MiningGadgetEnum | MiningModuleEnum)[]>([])
  const [columnGroups, setColumnGroups] = React.useState<ColumnGroupEnum[]>(Object.values(ColumnGroupEnum))
  const [filterSelected, setFilterSelected] = React.useState<boolean>(false)

  const filteredValues = React.useMemo(() => {
    if (!loadoutLookup) return []
    return [...Object.values(loadoutLookup.modules), ...Object.values(loadoutLookup.gadgets)]
      .filter((mod) => {
        if (filterSelected && !selected.includes(mod.code as MiningGadgetEnum | MiningModuleEnum)) return false
        return true
      })
      .filter((mod) => {
        if (categoryFilter === null) return true
        if (categoryFilter.includes('A') && mod.category === 'A') return true
        if (categoryFilter.includes('P') && mod.category === 'P') return true
        if (categoryFilter.includes('G') && mod.category === 'G') return true
      })
  }, [categoryFilter, filterSelected, loadoutLookup])

  const [maxMin] = React.useMemo(() => {
    // Create a dictionary of max and min values for each of the following laser.stats:
    // optimumRange,maxRange,minPower,maxPower,extrPower,minPowerPct,resistance,instability,optimalChargeRate,optimalChargeWindow,inertMaterials,overchargeRate,clusterMod,shatterDamage,  }, [])
    const maxMin: Record<string, { max: number; min: number }> = {}
    filteredValues.forEach((mod) => {
      Object.entries(mod.stats).forEach(([key, value]) => {
        if (typeof value === 'number') {
          if (!maxMin[key]) maxMin[key] = { max: value, min: value }
          else {
            maxMin[key].max = Math.max(maxMin[key].max, value)
            maxMin[key].min = Math.min(maxMin[key].min, value)
          }
        }
      })
    })
    return [maxMin]
  }, [filteredValues])

  const handleCategoryFilter = (event: React.MouseEvent<HTMLElement>, newFilter: LoadoutShipEnum[]) => {
    if (newFilter.length === 0) setCategoryFilter([])
    else setCategoryFilter(newFilter)
  }

  const handleColumnGroupChange = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    newColumnGroups: ColumnGroupEnum[]
  ) => {
    setColumnGroups(newColumnGroups)
  }

  const handleSelectedChange = (laser: MiningGadgetEnum | MiningModuleEnum, checked: boolean) => {
    if (checked) setSelected([...selected, laser])
    else {
      const newSelected = selected.filter((s) => s !== laser)
      setSelected(newSelected)
      if (newSelected.length === 0) setFilterSelected(false)
    }
  }

  const stores = Object.values(MiningStoreEnum)

  const modTypeIcons: Record<string, React.ReactNode> = {
    A: <Chip label="Active" size="small" color="primary" />,
    P: <Chip label="Passive" size="small" color="secondary" />,
    G: <Chip label="Gadget" size="small" color="info" />,
  }

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Mining Modules
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <Typography variant="overline" sx={{ alignSelf: 'center' }}>
          Filter:
        </Typography>
        <ToggleButtonGroup
          value={categoryFilter || 'all'}
          size="small"
          onChange={handleCategoryFilter}
          aria-label="text alignment"
        >
          <ToggleButton
            value={'A'}
            color="primary"
            sx={{
              color: theme.palette.primary.dark,
            }}
          >
            Active
          </ToggleButton>
          <ToggleButton
            value={'P'}
            color="secondary"
            sx={{
              color: theme.palette.secondary.dark,
            }}
          >
            Passive
          </ToggleButton>
          <ToggleButton
            value={'G'}
            color="info"
            sx={{
              color: theme.palette.info.dark,
            }}
          >
            Gadgets
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          size="small"
          value={columnGroups}
          onChange={handleColumnGroupChange}
          aria-label="text alignment"
        >
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
          disabled={selected.length === 0}
          startIcon={<ClearAll />}
        >
          Clear Selection
        </Button>
        <Button
          onClick={() => {
            setSelected([])
            setFilterSelected(false)
            setCategoryFilter(['A', 'P', 'G'])
            setColumnGroups([ColumnGroupEnum.Buffs, ColumnGroupEnum.Market])
          }}
          color="error"
          variant="text"
          size="small"
          startIcon={<Refresh />}
        >
          Reset Form
        </Button>
      </Stack>

      <Paper sx={{ mb: 4 }}>
        <TableContainer sx={styles.table}>
          <Table size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={styles.shortHeader}>Module</TableCell>
                <TableCell sx={styles.shortHeader} align="center">
                  Type
                </TableCell>
                <TableCell sx={styles.shortHeader} align="right">
                  Price
                </TableCell>
                {filteredValues.length > 0 && columnGroups.includes(ColumnGroupEnum.Buffs) && (
                  <>
                    <LongCellHeader>Laser Power Mod</LongCellHeader>
                    <LongCellHeader>Resistance</LongCellHeader>
                    <LongCellHeader>Instability</LongCellHeader>
                    <LongCellHeader>Optimal Charge Rate</LongCellHeader>
                    <LongCellHeader>Optimal Charge Window</LongCellHeader>
                    <LongCellHeader>Inert Materials</LongCellHeader>
                    <LongCellHeader>Overcharge Rate</LongCellHeader>
                    <LongCellHeader>Clustering</LongCellHeader>
                    <LongCellHeader>Shatter Damage</LongCellHeader>
                    <LongCellHeader>Extract Power Mod</LongCellHeader>
                  </>
                )}
                {filteredValues.length > 0 && columnGroups.includes(ColumnGroupEnum.Market) && (
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
              {filteredValues.length === 0 && (
                <TableRow>
                  <TableCell colSpan={100} sx={{ textAlign: 'center' }}>
                    <Typography variant="overline">
                      <em>No modules found after filtering</em>
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {filteredValues.map((lm, idx) => {
                const topBorder: SxProps<Theme> =
                  idx > 0 && filteredValues[idx - 1].category !== lm.category
                    ? { borderTop: `6px solid ${theme.palette.divider}` }
                    : {}

                const rowSelected = selected.includes(lm.code as MiningGadgetEnum | MiningModuleEnum)
                const rowEven = idx % 2 === 0

                const bgColor = rowSelected
                  ? theme.palette.action.selected
                  : rowEven
                  ? theme.palette.background.paper
                  : theme.palette.background.default

                return (
                  <TableRow
                    key={`${lm.code}-${idx}`}
                    onClick={() => handleSelectedChange(lm.code as MiningGadgetEnum | MiningModuleEnum, !rowSelected)}
                    sx={{
                      backgroundColor: bgColor,
                      '&:hover': {
                        backgroundColor: rowSelected ? theme.palette.action.selected : theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell
                      sx={Object.assign({}, topBorder, {
                        fontFamily: fontFamilies.robotoMono,
                        whiteSpace: 'nowrap',
                        fontWeight: 'bold',
                      })}
                    >
                      {lm.name}
                    </TableCell>
                    <TableCell sx={topBorder} align="center">
                      {modTypeIcons[lm.category]}
                    </TableCell>
                    <Tooltip
                      placement="top"
                      title={lm.price ? MValueFormatter(lm.price, MValueFormat.currency) : 'Price Unknown'}
                    >
                      <TableCell
                        sx={Object.assign({}, topBorder, styles.sectionDivider, {
                          fontFamily: fontFamilies.robotoMono,
                          whiteSpace: 'nowrap',
                        })}
                        align="right"
                      >
                        {lm.price ? MValueFormatter(lm.price, MValueFormat.currency_sm) : '--'}
                      </TableCell>
                    </Tooltip>

                    {columnGroups.includes(ColumnGroupEnum.Buffs) && (
                      <>
                        <StatsCell
                          value={lm.stats.powerMod}
                          maxMin={maxMin['powerMod']}
                          sx={Object.assign({}, topBorder)}
                          reversed={BackwardStats.includes('powerMod')}
                        />
                        <StatsCell
                          value={lm.stats.resistance}
                          maxMin={maxMin['resistance']}
                          sx={Object.assign({}, topBorder)}
                          reversed={BackwardStats.includes('resistance')}
                        />
                        <StatsCell
                          value={lm.stats.instability}
                          maxMin={maxMin['instability']}
                          sx={Object.assign({}, topBorder)}
                          reversed={BackwardStats.includes('instability')}
                        />
                        <StatsCell
                          value={lm.stats.optimalChargeRate}
                          maxMin={maxMin['optimalChargeRate']}
                          sx={Object.assign({}, topBorder)}
                          reversed={BackwardStats.includes('optimalChargeRate')}
                        />
                        <StatsCell
                          value={lm.stats.optimalChargeWindow}
                          maxMin={maxMin['optimalChargeWindow']}
                          sx={Object.assign({}, topBorder)}
                          reversed={BackwardStats.includes('optimalChargeWindow')}
                        />
                        <StatsCell
                          value={lm.stats.inertMaterials}
                          maxMin={maxMin['inertMaterials']}
                          sx={Object.assign({}, topBorder)}
                          reversed={BackwardStats.includes('inertMaterials')}
                        />
                        <StatsCell
                          value={lm.stats.overchargeRate}
                          maxMin={maxMin['overchargeRate']}
                          sx={Object.assign({}, topBorder)}
                          reversed={BackwardStats.includes('overchargeRate')}
                        />
                        <StatsCell
                          value={lm.stats.clusterMod}
                          maxMin={maxMin['clusterMod']}
                          sx={Object.assign({}, topBorder)}
                          reversed={BackwardStats.includes('clusterMod')}
                        />
                        <StatsCell
                          value={lm.stats.shatterDamage}
                          maxMin={maxMin['shatterDamage']}
                          sx={Object.assign({}, topBorder)}
                          reversed={BackwardStats.includes('shatterDamage')}
                        />
                        <StatsCell
                          value={lm.stats.extrPowerMod}
                          maxMin={maxMin['extrPowerMod']}
                          sx={Object.assign({}, styles.sectionDivider, topBorder)}
                          reversed={BackwardStats.includes('powerMod')}
                        />
                      </>
                    )}

                    {columnGroups.includes(ColumnGroupEnum.Market) && (
                      <>
                        {stores.map((store, idx) => (
                          <TableCell
                            key={`${store}-${idx}`}
                            sx={Object.assign({}, styles.cellDivider, topBorder)}
                            padding="checkbox"
                          >
                            {lm.stores.includes(store) ? <Check color="success" /> : null}
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
