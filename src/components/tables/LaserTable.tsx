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
  Button,
  Box,
  TableCellProps,
} from '@mui/material'
import {
  BackwardStats,
  LaserLoadoutStats,
  LoadoutShipEnum,
  MiningLaserEnum,
  ObjectValues,
  Lookups,
  SystemEnum,
} from '@regolithco/common'
import { BarChart, Bolt, Check, ClearAll, Refresh, Store } from '@mui/icons-material'
import Gradient from 'javascript-color-gradient'
import { LongCellHeader, LongCellHeaderProps, StatsCell, tableStylesThunk } from './tableCommon'
import { fontFamilies } from '../../theme'
import { MValue, MValueFormat, MValueFormatter } from '../fields/MValue'
import { LookupsContext } from '../../context/lookupsContext'
import { SystemColors } from '../pages/SurveyCorps/types'
import { useQueryParams, useURLArrayState, useURLState } from '../../hooks/useURLState'

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

  const tBodyRef = React.useRef<HTMLTableSectionElement>(null)
  const sysColors = SystemColors(theme)

  // Hover state: [colNum, left, width, color]
  const [hoverCol, setHoverCol] = React.useState<[number, number, number, string] | null>(null)
  // Hover state: [colNum, top, height, color]
  const [hoverRow, setHoverRow] = React.useState<[number, number, number, string] | null>(null)

  const { resetQueryValues } = useQueryParams()

  const [shipFilter, setShipFilter] = useURLState<LoadoutShipEnum | null>('shp', null, undefined, (qryVal) => {
    if (qryVal === 'ALL' || !Object.values(LoadoutShipEnum).includes(qryVal as LoadoutShipEnum)) return null
    return (qryVal as LoadoutShipEnum) || null
  })
  const [columnGroups, setColumnGroups] = useURLArrayState<ColumnGroupEnum>(
    'g',
    Object.values(ColumnGroupEnum),
    undefined,
    (qryVal) =>
      Object.values(ColumnGroupEnum).includes(qryVal as ColumnGroupEnum) ? (qryVal as ColumnGroupEnum) : null
  )
  const [showPrices, setShowPrices] = useURLState<boolean>(
    'p',
    false,
    (v) => (v ? '1' : ''),
    (v) => v === '1'
  )

  const [selected, setSelected] = useURLArrayState<MiningLaserEnum>('s', [], undefined, (qryVal) =>
    Object.values(MiningLaserEnum).includes(qryVal as MiningLaserEnum) ? (qryVal as MiningLaserEnum) : null
  )

  const [filterSelected, setFilterSelected] = useURLState<boolean>(
    'fs',
    false,
    (v) => (v ? '1' : ''),
    (v) => v === '1'
  )

  const [filterSystem, setFilterSystem] = useURLState<SystemEnum | null>('fsys', null, undefined, (value) => {
    if (value === 'ALL' || !Object.values(SystemEnum).includes(value as SystemEnum)) return null
    return (value as SystemEnum) || null
  })

  const dataStore = React.useContext(LookupsContext)

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

  const bgColors = new Gradient()
    .setColorGradient('#b93327', '#229f63')
    .setMidpoint(100)
    .getColors()
    .map((c) => alpha(c, 0.3))
  const fgColors = bgColors.map((color) => theme.palette.getContrastText(color))

  const [filteredVals, filteredStores] = React.useMemo(() => {
    if (!dataStore.ready) return [[], []]
    const loadoutLookup = dataStore.getLookup('loadout') as Lookups['loadout']
    const filteredVals = Object.values(loadoutLookup.lasers)
      .filter((laser) => {
        if (shipFilter === LoadoutShipEnum.Mole) return laser.size === 2
        if (shipFilter === LoadoutShipEnum.Prospector) return laser.size === 1
        if (shipFilter === LoadoutShipEnum.Roc) return laser.size === 0
        return true
      })
      .filter((laser) => {
        if (!filterSelected) return true
        if (selected.length === 0) return true
        return selected.includes(laser.code as MiningLaserEnum)
      })
    filteredVals.sort((a, b) => a.name.localeCompare(b.name))

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
  }, [filterSelected, selected, shipFilter, filterSystem, dataStore.ready])

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
            value={LoadoutShipEnum.Roc}
            aria-label="centered"
            // color="de"
            sx={{
              color: theme.palette.grey[500],
            }}
          >
            ROC
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
            resetQueryValues(['s', 'fs'])
          }}
          variant="text"
          size="small"
          startIcon={<ClearAll />}
        >
          Clear Selection
        </Button>
        <Button
          onClick={() => {
            resetQueryValues()
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
                <HeaderCell theme={theme} first hovered={Boolean(hoverCol && hoverCol[0] === -1)}>
                  Laser
                </HeaderCell>
                <HeaderCell theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -2)} align="center">
                  Size
                </HeaderCell>
                <HeaderCell theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -4)} align="center">
                  Slots
                </HeaderCell>

                {filteredVals.length > 0 && columnGroups.includes(ColumnGroupEnum.Base) && (
                  <>
                    <LongCellHeaderWrapped theme={theme} first hovered={Boolean(hoverCol && hoverCol[0] === -10)}>
                      Optimum Range
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -11)}>
                      Max. Range
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -12)}>
                      Min. Power %
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -13)}>
                      Min. Power
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -14)}>
                      Max. Power
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -15)}>
                      Extract Power
                    </LongCellHeaderWrapped>
                  </>
                )}
                {filteredVals.length > 0 && columnGroups.includes(ColumnGroupEnum.Buffs) && (
                  <>
                    <LongCellHeaderWrapped theme={theme} first hovered={Boolean(hoverCol && hoverCol[0] === -101)}>
                      Resistance
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -102)}>
                      Instability
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -103)}>
                      Optimal Charge Rate
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -104)}>
                      Optimal Charge Window
                    </LongCellHeaderWrapped>
                    <LongCellHeaderWrapped theme={theme} hovered={Boolean(hoverCol && hoverCol[0] === -105)}>
                      Inert Materials
                    </LongCellHeaderWrapped>
                    {/* <LongCellHeader>Overcharge Rate</LongCellHeader>
              <LongCellHeader>Clustering</LongCellHeader>
              <LongCellHeader>Shatter Damage</LongCellHeader> */}
                  </>
                )}
                {filteredVals.length > 0 && columnGroups.includes(ColumnGroupEnum.Market) && (
                  <>
                    {filteredStores.map((store, colNum) => (
                      <LongCellHeaderWrapped
                        key={`${store.UEXID}-${colNum}`}
                        theme={theme}
                        first={colNum === 0}
                        hovered={Boolean(hoverCol && hoverCol[0] === colNum)}
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

              {filteredVals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={100} sx={{ textAlign: 'center' }}>
                    <Typography variant="overline">
                      <em>No lasers found after filtering</em>
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {filteredVals.map((laser, idr) => {
                const rowSelected = selected.includes(laser.code as MiningLaserEnum)
                const rowEven = idr % 2 === 0

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
                const bgColor =
                  rowSelected && !filterSelected
                    ? theme.palette.action.selected
                    : rowEven
                      ? theme.palette.background.paper
                      : theme.palette.background.default

                let sizeChip = <Chip color="info" label="1" size="small" />
                switch (laser.size) {
                  case 0:
                    sizeChip = <Chip label="0" size="small" />
                    break
                  case 1:
                    sizeChip = <Chip color="info" label="1" size="small" />
                    break
                  case 2:
                    sizeChip = <Chip color="success" label="2" size="small" />
                    break
                }

                return (
                  <TableRow
                    key={`${laser.code}-${idr}`}
                    onClick={() => handleSelectedChange(laser.code as MiningLaserEnum, !rowSelected)}
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
                      {laser.name}
                    </TableCell>
                    <TableCell
                      padding="checkbox"
                      align="center"
                      sx={styles.tinyCell}
                      onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -2)}
                    >
                      {sizeChip}
                    </TableCell>
                    <TableCell
                      sx={Object.assign({}, styles.sectionDivider, styles.tinyCell)}
                      align="center"
                      onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -4)}
                    >
                      {laser.slots}
                    </TableCell>

                    {columnGroups.includes(ColumnGroupEnum.Base) && (
                      <>
                        <TableCell
                          align="center"
                          sx={Object.assign({}, styles.numericCell, rankColors['optimumRange'])}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -10)}
                        >
                          {laser.stats.optimumRange}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={Object.assign({}, styles.numericCell, rankColors['maxRange'])}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -11)}
                        >
                          {laser.stats.maxRange}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={Object.assign({}, styles.numericCell, rankColors['minPowerPct'])}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -12)}
                        >
                          {MValueFormatter(laser.stats.minPowerPct, MValueFormat.percent)}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={Object.assign({}, styles.numericCell, rankColors['minPower'])}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -13)}
                        >
                          {laser.stats.minPower}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={Object.assign({}, styles.numericCell, rankColors['maxPower'])}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -14)}
                        >
                          {laser.stats.maxPower}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={Object.assign({}, styles.numericCell, styles.sectionDivider, rankColors['extrPower'])}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -15)}
                        >
                          {laser.stats.extrPower}
                        </TableCell>
                      </>
                    )}
                    {columnGroups.includes(ColumnGroupEnum.Buffs) && (
                      <>
                        <StatsCell
                          theme={theme}
                          value={laser.stats.resistance}
                          maxMin={maxMin['resistance']}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -101)}
                          reversed={BackwardStats.includes('resistance')}
                        />
                        <StatsCell
                          theme={theme}
                          value={laser.stats.instability}
                          maxMin={maxMin['instability']}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -102)}
                          reversed={BackwardStats.includes('instability')}
                        />
                        <StatsCell
                          theme={theme}
                          value={laser.stats.optimalChargeRate}
                          maxMin={maxMin['optimalChargeRate']}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -103)}
                          reversed={BackwardStats.includes('optimalChargeRate')}
                        />
                        <StatsCell
                          theme={theme}
                          value={laser.stats.optimalChargeWindow}
                          maxMin={maxMin['optimalChargeWindow']}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -104)}
                          reversed={BackwardStats.includes('optimalChargeWindow')}
                        />
                        <StatsCell
                          theme={theme}
                          value={laser.stats.inertMaterials}
                          maxMin={maxMin['inertMaterials']}
                          onMouseEnter={(e) => handleMouseEnter(e, theme.palette.grey[100], idr, -105)}
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
                        {filteredStores.map((store, colNum) => {
                          const price = laser.prices[store.UEXID as MiningLaserEnum] || 0
                          return (
                            <TableCell
                              key={`${store}-${idr}-${colNum}`}
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
                              ) : Object.keys(laser.prices).includes(store.UEXID) ? (
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
