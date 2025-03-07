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
  alpha,
  TableCellProps,
  Box,
} from '@mui/material'
import {
  BackwardStats,
  LoadoutShipEnum,
  MiningGadgetEnum,
  MiningModuleEnum,
  ObjectValues,
  Lookups,
  SystemEnum,
} from '@regolithco/common'
import { Bolt, Check, ClearAll, Refresh, Store } from '@mui/icons-material'
import { fontFamilies } from '../../theme'
import { MValue, MValueFormat, MValueFormatter } from '../fields/MValue'
import { LongCellHeader, LongCellHeaderProps, StatsCell, tableStylesThunk } from './tableCommon'
import { LookupsContext } from '../../context/lookupsContext'
import { SystemColors } from '../pages/SurveyCorps/types'

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
  const styles = tableStylesThunk(theme)
  const [categoryFilter, setCategoryFilter] = React.useState<string[]>(['A', 'P', 'G'])
  const dataStore = React.useContext(LookupsContext)

  const tBodyRef = React.useRef<HTMLTableSectionElement>(null)
  const sysColors = SystemColors(theme)

  // Hover state: [colNum, left, width, color]
  const [hoverCol, setHoverCol] = React.useState<[number, number, number, string] | null>(null)
  // Hover state: [colNum, top, height, color]
  const [hoverRow, setHoverRow] = React.useState<[number, number, number, string] | null>(null)

  const [selected, setSelected] = React.useState<(MiningGadgetEnum | MiningModuleEnum)[]>([])
  const [columnGroups, setColumnGroups] = React.useState<ColumnGroupEnum[]>(Object.values(ColumnGroupEnum))
  const [filterSelected, setFilterSelected] = React.useState<boolean>(false)
  const [filterSystem, setFilterSystem] = React.useState<SystemEnum | null>(null)
  const [showPrices, setShowPrices] = React.useState<boolean>(false)

  const [filteredValues, filteredStores] = React.useMemo(() => {
    if (!dataStore.ready) return [[], []]
    const loadoutLookup = dataStore.getLookup('loadout') as Lookups['loadout']
    const filteredVals = [...Object.values(loadoutLookup.modules), ...Object.values(loadoutLookup.gadgets)]
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
    filteredVals.sort((a, b) => {
      // Sort by category In this EXACT order: 1. active, 2. passive, 3. gadget
      const sortOrder = ['A', 'P', 'G']
      if (a.category !== b.category) return sortOrder.indexOf(a.category) - sortOrder.indexOf(b.category)

      // Then sort by name
      return a.name.localeCompare(b.name)
    })

    const filteredStores = Object.values(loadoutLookup.stores).filter((store) => {
      return filterSystem === null || filterSystem === store.system
    })
    filteredStores.sort((a, b) => {
      // Sort by system first (stanton then pyro)
      if (a.system !== b.system) return a.system === SystemEnum.Stanton ? -1 : 1
      // Then sort by nickname
      return a.nickname.localeCompare(b.nickname)
    })
    return [filteredVals, filteredStores]
  }, [categoryFilter, filterSelected, filterSystem, dataStore.ready])

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

  const handleMouseEnter = React.useCallback((e: React.MouseEvent<HTMLTableCellElement>, color, idr, colNum) => {
    if (tBodyRef.current) {
      // Get the left of the table
      const tableRect = tBodyRef.current.getBoundingClientRect()
      const tableLeft = tableRect.left
      const tableTop = tableRect.top
      // Get the left and wdith of this tableCell
      const rect = e.currentTarget.getBoundingClientRect()
      const left = rect.left - tableLeft
      const width = rect.width
      setHoverCol([colNum, left, width, color])
      const top = rect.top - tableTop
      const height = rect.height
      setHoverRow([idr, top, height, color])
    }
  }, [])

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

  const modTypeIcons: Record<string, React.ReactNode> = {
    A: <Chip label="Active" size="small" color="primary" />,
    P: <Chip label="Passive" size="small" color="secondary" />,
    G: <Chip label="Gadget" size="small" color="info" />,
  }

  if (!dataStore.ready) return <div>Loading...</div>
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

        <ToggleButtonGroup
          size="small"
          disabled={!columnGroups.includes(ColumnGroupEnum.Market)}
          value={filterSystem || 'ALL'}
          exclusive
          onChange={(e, newSystem) => {
            if (newSystem === 'ALL') setFilterSystem(null)
            else setFilterSystem(newSystem)
          }}
          aria-label="text alignment"
        >
          <ToggleButton value={'ALL'} aria-label="ALL" color="info">
            All
          </ToggleButton>
          <ToggleButton
            value={SystemEnum.Stanton}
            aria-label="Stanton"
            color="info"
            sx={{
              color: theme.palette.info.dark,
            }}
          >
            Stanton
          </ToggleButton>
          <ToggleButton
            value={SystemEnum.Pyro}
            aria-label="Pyro"
            color="primary"
            sx={{
              color: theme.palette.primary.dark,
            }}
          >
            Pyro
          </ToggleButton>
        </ToggleButtonGroup>

        <FormControlLabel
          disabled={!columnGroups.includes(ColumnGroupEnum.Market)}
          control={<Switch checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />}
          label="Prices (aUEC)"
        />

        <FormControlLabel
          disabled={selected.length === 0}
          control={
            <Switch
              checked={filterSelected && selected.length > 0}
              onChange={(e) => setFilterSelected(e.target.checked)}
            />
          }
          label={`Filter Selected ${selected.length ? `(${selected.length})` : ''}`}
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
            setShowPrices(false)
            setFilterSystem(null)
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
                <HeaderCell theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -1)}>
                  Module
                </HeaderCell>
                <HeaderCell theme={theme} align="center" hovered={Boolean(hoverCol && hoverCol[0] === -2)}>
                  Type
                </HeaderCell>
                {filteredValues.length > 0 && columnGroups.includes(ColumnGroupEnum.Buffs) && (
                  <>
                    <LongCellHeaderWrapped theme={theme} first hovered={Boolean(hoverCol && hoverCol[0] === -101)}>
                      Laser Power Mod
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -102)}>
                      Resistance
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -103)}>
                      Instability
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -104)}>
                      Optimal Charge Rate
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -105)}>
                      Optimal Charge Window
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -106)}>
                      Inert Materials
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -107)}>
                      Overcharge Rate
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -108)}>
                      Clustering
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -109)}>
                      Shatter Damage
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -110)}>
                      Extract Power Mod
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -111)}>
                      Uses
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -112)}>
                      Duration
                    </LongCellHeaderWrapped>
                  </>
                )}
                {filteredValues.length > 0 && columnGroups.includes(ColumnGroupEnum.Market) && (
                  <>
                    {filteredStores.map((store, idx) => (
                      <LongCellHeaderWrapped
                        key={`${store}-${idx}`}
                        theme={theme}
                        first={idx === 0}
                        hovered={Boolean(hoverCol && hoverCol[0] === idx)}
                        sx={{
                          color: sysColors[store.system],
                        }}
                      >
                        {store.nickname}
                      </LongCellHeaderWrapped>
                    ))}
                  </>
                )}
                {/* We add a cell at the end to let it grow*/}
                <TableCell sx={styles.spacerCell}> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              ref={tBodyRef}
              sx={{
                zIndex: 0,
                position: 'relative',
              }}
              onMouseLeave={() => {
                if (hoverCol) setHoverCol(null)
                if (hoverRow) setHoverRow(null)
              }}
            >
              {hoverCol && (
                <Box
                  component="tr"
                  sx={{
                    pointerEvents: 'none', // Make the box transparent to all mouse events
                    zIndex: 4,
                    position: 'absolute',
                    top: 0,
                    left: hoverCol[1],
                    width: hoverCol[2],
                    height: '100%',
                    // mixBlendMode: 'difference',
                    border: `1px solid ${alpha(hoverCol[3], 0.3)}`,
                    backgroundColor: alpha(hoverCol[3], 0.1),
                  }}
                />
              )}
              {hoverRow && (
                <Box
                  component="tr"
                  sx={{
                    pointerEvents: 'none', // Make the box transparent to all mouse events
                    zIndex: 4,
                    position: 'absolute',
                    left: 0,
                    top: hoverRow[1],
                    height: hoverRow[2],
                    width: '100%',
                    // mixBlendMode: 'difference',
                    border: `1px solid ${alpha(hoverRow[3], 0.3)}`,
                    backgroundColor: alpha(hoverRow[3], 0.1),
                  }}
                />
              )}

              {filteredValues.length === 0 && (
                <TableRow>
                  <TableCell colSpan={100} sx={{ textAlign: 'center' }}>
                    <Typography variant="overline">
                      <em>No modules found after filtering</em>
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {filteredValues.map((lm, idr) => {
                const topBorder: SxProps<Theme> =
                  idr > 0 && filteredValues[idr - 1].category !== lm.category
                    ? { borderTop: `6px solid ${theme.palette.divider}` }
                    : {}

                const rowSelected = selected.includes(lm.code as MiningGadgetEnum | MiningModuleEnum)
                const rowEven = idr % 2 === 0

                const bgColor =
                  rowSelected && !filterSelected
                    ? theme.palette.action.selected
                    : rowEven
                      ? theme.palette.background.paper
                      : theme.palette.background.default

                return (
                  <TableRow
                    key={`${lm.code}-${idr}`}
                    onClick={() => handleSelectedChange(lm.code as MiningGadgetEnum | MiningModuleEnum, !rowSelected)}
                    sx={{
                      backgroundColor: bgColor,
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -1)}
                      sx={{
                        fontFamily: fontFamilies.robotoMono,
                        whiteSpace: 'nowrap',
                        fontWeight: 'bold',
                        // STICKY FIRST COLUMN
                        position: 'sticky',
                        backgroundColor: rowSelected && !filterSelected ? '#444' : theme.palette.background.paper,
                        zIndex: 3,
                        borderRight: `3px solid ${theme.palette.primary.main}`,
                      }}
                    >
                      {lm.name}
                    </TableCell>
                    <TableCell
                      sx={topBorder}
                      align="center"
                      onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -2)}
                    >
                      {modTypeIcons[lm.category]}
                    </TableCell>

                    {columnGroups.includes(ColumnGroupEnum.Buffs) && (
                      <>
                        <StatsCell
                          theme={theme}
                          value={lm.stats.powerMod}
                          maxMin={maxMin['powerMod']}
                          sx={topBorder}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -101)}
                          reversed={BackwardStats.includes('powerMod')}
                        />
                        <StatsCell
                          theme={theme}
                          value={lm.stats.resistance}
                          maxMin={maxMin['resistance']}
                          sx={topBorder}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -102)}
                          reversed={BackwardStats.includes('resistance')}
                        />
                        <StatsCell
                          theme={theme}
                          value={lm.stats.instability}
                          maxMin={maxMin['instability']}
                          sx={topBorder}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -103)}
                          reversed={BackwardStats.includes('instability')}
                        />
                        <StatsCell
                          theme={theme}
                          value={lm.stats.optimalChargeRate}
                          maxMin={maxMin['optimalChargeRate']}
                          sx={topBorder}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -104)}
                          reversed={BackwardStats.includes('optimalChargeRate')}
                        />
                        <StatsCell
                          theme={theme}
                          value={lm.stats.optimalChargeWindow}
                          maxMin={maxMin['optimalChargeWindow']}
                          sx={topBorder}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -105)}
                          reversed={BackwardStats.includes('optimalChargeWindow')}
                        />
                        <StatsCell
                          theme={theme}
                          value={lm.stats.inertMaterials}
                          maxMin={maxMin['inertMaterials']}
                          sx={topBorder}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -106)}
                          reversed={BackwardStats.includes('inertMaterials')}
                        />
                        <StatsCell
                          theme={theme}
                          value={lm.stats.overchargeRate}
                          maxMin={maxMin['overchargeRate']}
                          sx={topBorder}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -107)}
                          reversed={BackwardStats.includes('overchargeRate')}
                        />
                        <StatsCell
                          theme={theme}
                          value={lm.stats.clusterMod}
                          maxMin={maxMin['clusterMod']}
                          sx={topBorder}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -108)}
                          reversed={BackwardStats.includes('clusterMod')}
                        />
                        <StatsCell
                          theme={theme}
                          value={lm.stats.shatterDamage}
                          maxMin={maxMin['shatterDamage']}
                          sx={topBorder}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -109)}
                          reversed={BackwardStats.includes('shatterDamage')}
                        />
                        <StatsCell
                          theme={theme}
                          value={lm.stats.extrPowerMod}
                          maxMin={maxMin['extrPowerMod']}
                          sx={topBorder}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -110)}
                          reversed={BackwardStats.includes('powerMod')}
                        />
                        <TableCell
                          sx={Object.assign({}, styles.numericCell, topBorder)}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -111)}
                        >
                          {
                            // Convert value from decimal for % display to integer
                            lm.stats.uses && (lm.stats.uses - 1) * 100 > 0
                              ? MValueFormatter((lm.stats.uses - 1) * 100, MValueFormat.number)
                              : ' '
                          }
                        </TableCell>
                        <TableCell
                          sx={Object.assign({}, styles.numericCell, styles.sectionDivider, topBorder)}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -112)}
                        >
                          {
                            // Convert value from decimal for % display to integer
                            lm.stats.duration && (lm.stats.duration - 1) * 100 > 0
                              ? `${MValueFormatter((lm.stats.duration - 1) * 100, MValueFormat.number)}s`
                              : ' '
                          }
                        </TableCell>
                      </>
                    )}

                    {columnGroups.includes(ColumnGroupEnum.Market) && (
                      <>
                        {filteredStores.map((store, colNum) => {
                          const price = lm.prices[store.UEXID] || 0
                          return (
                            <TableCell
                              key={`${store}-${colNum}`}
                              onMouseEnter={(e) => handleMouseEnter(e, sysColors[store.system], idr, colNum)}
                              sx={Object.assign({}, styles.cellDivider, styles.storeCell)}
                              padding="checkbox"
                            >
                              {showPrices ? (
                                price ? (
                                  <MValue
                                    value={price}
                                    format={MValueFormat.currency_sm}
                                    typoProps={{
                                      whiteSpace: 'nowrap',
                                    }}
                                  />
                                ) : (
                                  ''
                                )
                              ) : Object.keys(lm.prices).includes(store.UEXID) ? (
                                <Check color="success" />
                              ) : null}
                            </TableCell>
                          )
                        })}
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

interface HeaderCellProps extends React.PropsWithChildren {
  theme: Theme
  hovered?: boolean
  first?: boolean
}

const HeaderCell: React.FC<HeaderCellProps & TableCellProps> = ({ theme, children, hovered, first, sx: outerSx }) =>
  React.useMemo(() => {
    const styles = tableStylesThunk(theme)
    const sx: SxProps<Theme> = Object.assign(
      {
        color: hovered ? theme.palette.grey[200] : theme.palette.grey[500],
        fontWeight: 'bold',
        ...(outerSx || {}),
      },
      first ? styles.shortHeaderFirst : styles.shortHeader
    )

    return <TableCell sx={sx}>{children}</TableCell>
  }, [hovered])

const LongCellHeaderWrapped: React.FC<HeaderCellProps & LongCellHeaderProps> = ({
  theme,
  hovered,
  first,
  sx: outerSx,
  ...longProps
}) =>
  React.useMemo(() => {
    const sx: SxProps<Theme> = Object.assign({
      backgroundColor: 'transparent',
      borderBottom: hovered ? `3px solid ${theme.palette.grey[200]}` : `3px solid ${theme.palette.grey[500]}`,
      '& .MuiTypography-caption': {
        fontWeight: hovered ? 'bold' : undefined,
        ...(outerSx || {}),
      },
    })

    return <LongCellHeader {...longProps} sx={sx} />
  }, [hovered])
