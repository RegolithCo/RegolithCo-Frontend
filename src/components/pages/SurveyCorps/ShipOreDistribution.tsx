import * as React from 'react'

import {
  alpha,
  Box,
  Button,
  Container,
  darken,
  FormControlLabel,
  Paper,
  rgbToHex,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { getGravityWellOptions, GravityWellChooser, GravityWellNameRender } from '../../fields/GravityWellChooser'
import {
  hoverColor,
  OreTierColors,
  OreTierEnum,
  OreTierNames,
  selectBorderColor,
  selectColor,
  ShipOreTiers,
} from './types'
import { LongCellHeader, tableStylesThunk } from '../../tables/tableCommon'
import { LookupsContext } from '../../../context/lookupsContext'
import { Lookups, SurveyData, SystemLookupItem } from '@regolithco/common'
import { ClearAll, PeopleAlt, Refresh } from '@mui/icons-material'
import { AsteroidWellTypes, SurfaceWellTypes } from '../../../types'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { fontFamilies } from '../../../theme'
import Gradient from 'javascript-color-gradient'
import { RockIcon } from '../../../icons'

export interface ShipOreDistributionProps {
  // Props here
  data?: SurveyData | null
  bonuses?: SurveyData | null
}

export const ShipOreDistribution: React.FC<ShipOreDistributionProps> = ({ data, bonuses }) => {
  const theme = useTheme()
  const styles = tableStylesThunk(theme)
  const tBodyRef = React.useRef<HTMLTableSectionElement>(null)
  // Filters
  const [selected, setSelected] = React.useState<string[]>([])
  // Hover state: [colNum, left, width, color]
  const [hoverCol, setHoverCol] = React.useState<[number, number, number, string] | null>(null)
  // Hover state: [colNum, top, height, color]
  const [hoverRow, setHoverRow] = React.useState<[number, number, number, string] | null>(null)

  const [oreTierFilter, setOreTierFilter] = React.useState<OreTierEnum[]>([
    OreTierEnum.STier,
    OreTierEnum.ATier,
    OreTierEnum.BTier,
    OreTierEnum.CTier,
  ])
  const [showExtendedStats, setShowExtendedStats] = React.useState<boolean>(false)
  const [rockTypeFilter, setRockTypeFilter] = React.useState<('SURFACE' | 'ASTEROID')[]>(['SURFACE', 'ASTEROID'])
  const [filterSelected, setFilterSelected] = React.useState<boolean>(false)
  const [gravityWellFilter, setGravityWellFilter] = React.useState<string | null>(null)

  const dataStore = React.useContext(LookupsContext)

  const systemLookup = React.useMemo(
    () => dataStore.getLookup('gravityWellLookups') as Lookups['gravityWellLookups'],
    [dataStore]
  ) as SystemLookupItem[]

  const gravityWellOptions = React.useMemo(() => getGravityWellOptions(theme, systemLookup), [systemLookup])

  const maxMins: Record<string, { max: number | null; min: number | null }> = React.useMemo(() => {
    // prepopulate the maxMins array
    const retVal: Record<string, { max: number | null; min: number | null }> = {}
    if (data?.data || bonuses?.data) {
      gravityWellOptions.forEach((row) => {
        const dataCols = data?.data || {}
        const bonusCols = bonuses?.data || {}
        const bonus = bonusCols[row.id] || 0
        if (!retVal['BONUS']) retVal['BONUS'] = { max: 0, min: 0 }
        const oldBonusMax = retVal['BONUS'].max || 0

        retVal['BONUS'].max = Math.max(oldBonusMax, bonus)

        // Then the ores
        Object.keys(OreTierNames).forEach((tier, idx) => {
          if (oreTierFilter.includes(tier as OreTierEnum)) {
            ShipOreTiers[tier as OreTierEnum].map((ore, idy) => {
              const prob = dataCols[row.id]?.ores[ore]?.prob
              if (!retVal[ore]) retVal[ore] = { max: null, min: null }
              const old = retVal[ore]
              retVal[ore].max = prob ? (old.max ? Math.max(old.max, prob) : prob) : old.max
              retVal[ore].min = prob ? (old.min ? Math.min(old.min, prob) : prob) : old.min
            })
          }
        })
      })
    }
    return retVal
  }, [gravityWellOptions, data?.data, bonuses?.data])

  const bonusGradient = React.useMemo(() => {
    const light = theme.palette.info.main
    const dark = rgbToHex(darken(theme.palette.info.dark, 0.5))
    return new Gradient()
      .setColorGradient(dark, light)
      .setMidpoint(100) // 100 is the number of colors to generate. Should be enough stops for our ores
      .getColors()
  }, [])
  const gradients = React.useMemo(() => {
    return Object.values(OreTierColors).reduce(
      (acc, color) => {
        const light = theme.palette[color].main
        const dark = rgbToHex(darken(theme.palette[color].dark, 0.5))
        acc[color] = new Gradient()
          .setColorGradient(dark, light)
          .setMidpoint(100) // 100 is the number of colors to generate. Should be enough stops for our ores
          .getColors()
        return acc
      },
      {} as Record<string, string[]>
    )
  }, [])

  const tableRows = React.useMemo(() => {
    return gravityWellOptions.map((row, idr) => {
      let hide = false
      if (gravityWellFilter && row.id !== gravityWellFilter && !row.parents.includes(gravityWellFilter)) {
        hide = true
      }
      const rowEven = idr % 2 === 0
      const rowSelected = selected.includes(row.id)
      const bgColor = rowSelected ? selectColor : rowEven ? 'rgba(34,34,34)' : 'rgb(39,39,39)'

      if (!rockTypeFilter.includes('SURFACE') && SurfaceWellTypes.includes(row.type)) return null
      if (!rockTypeFilter.includes('ASTEROID') && AsteroidWellTypes.includes(row.type)) return null

      const bonus = bonuses && bonuses.data && bonuses.data[row.id] ? bonuses.data[row.id] : 0

      const bonusMax = maxMins['BONUS'] && maxMins['BONUS'].max !== null ? maxMins['BONUS'].max : 1
      const bonusMin = maxMins['BONUS'] && maxMins['BONUS'].min !== null ? maxMins['BONUS'].min : 0
      // The normalized value between 0 and 1 that prob is
      const normBonus = calculateNormalizedProbability(bonus, bonusMin, bonusMax)

      if (!rowSelected && filterSelected) hide = true
      // Only render this option if the
      return (
        <TableRow
          key={row.id}
          onClick={() => {
            setSelected((prev) => {
              if (prev.includes(row.id)) {
                return prev.filter((id) => id !== row.id)
              }
              const newSelected = [...prev, row.id]
              if (newSelected.length === 0 && filterSelected) {
                setFilterSelected(false)
              }
              return newSelected
            })
          }}
          sx={{
            display: hide ? 'none' : undefined,
            position: 'relative',
            backgroundColor: bgColor,
            '&:hover': {
              backgroundColor: rowSelected ? selectColor : hoverColor,
            },
          }}
        >
          <TableCell
            component="th"
            scope="row"
            onClick={(e) => {
              setGravityWellFilter(row.id)
            }}
            onMouseEnter={(e) => {
              if (tBodyRef.current) {
                // Get the left of the table
                const tableRect = tBodyRef.current.getBoundingClientRect()
                const tableTop = tableRect.top
                // Get the left and wdith of this tableCell
                const rect = e.currentTarget.getBoundingClientRect()
                const top = rect.top - tableTop
                const height = rect.height
                setHoverRow([idr, top, height, theme.palette.info.dark])
              }
            }}
            sx={{
              // STICKY FIRST COLUMN
              cursor: 'pointer',
              position: 'sticky',
              whiteSpace: 'nowrap',
              backgroundColor: rowSelected ? selectColor : bgColor,
              '&:hover': {
                color: theme.palette.primary.contrastText,
                backgroundColor: rowSelected ? selectColor : hoverColor,
              },
              zIndex: 3,
              borderRight: `3px solid ${theme.palette.primary.main}`,
              borderTop: `1px solid ${rowSelected ? selectBorderColor : 'transparent'}`,
              borderBottom: `1px solid ${rowSelected ? selectBorderColor : 'transparent'}`,

              pl: theme.spacing(row.depth * 3),
            }}
          >
            <GravityWellNameRender options={row} />
          </TableCell>

          <TableCell
            sx={{
              textAlign: 'center',
              fontFamily: fontFamilies.robotoMono,
              borderLeft: `3px solid ${theme.palette.primary.main}`,
              backgroundColor: normBonus ? alpha(bonusGradient[normBonus], 0.4) : 'rgba(0,0,0,0)',
            }}
            onMouseEnter={(e) => {
              if (tBodyRef.current) {
                // Get the left of the table
                const tableRect = tBodyRef.current.getBoundingClientRect()
                const tableLeft = tableRect.left
                const tableTop = tableRect.top
                // Get the left and wdith of this tableCell
                const rect = e.currentTarget.getBoundingClientRect()
                const left = rect.left - tableLeft
                const width = rect.width
                setHoverCol([-1, left, width, theme.palette.info.main])
                const top = rect.top - tableTop
                const height = rect.height
                setHoverRow([idr, top, height, theme.palette.info.main])
              }
            }}
          >
            {bonuses && bonuses.data && MValueFormatter(bonuses.data[row.id], MValueFormat.number) + 'X'}
          </TableCell>

          {/* Ore Tiers */}
          {Object.keys(OreTierNames).reduce((acc, tier, idx) => {
            if (oreTierFilter.includes(tier as OreTierEnum)) {
              ShipOreTiers[tier as OreTierEnum].map((ore, idy) => {
                const isNewTier = idy === 0
                const colNum = idx * ShipOreTiers[tier as OreTierEnum].length + idy

                let prob: number | null = null
                let maxPct = 0
                let minPct = 0
                let avgPct = 0

                let users = 0
                let clusters = 0
                let scans = 0

                let maxMass = 0
                let minMass = 0
                let avgMass = 0
                let normProb: number | null = null

                if (data && data.data && data.data[row.id] && data.data[row.id].ores[ore]) {
                  prob = data.data[row.id].ores[ore].prob
                  maxPct = data.data[row.id].ores[ore].maxPct
                  minPct = data.data[row.id].ores[ore].minPct
                  avgPct = data.data[row.id].ores[ore].avgPct

                  maxMass = data.data[row.id].mass.max
                  minMass = data.data[row.id].mass.min
                  avgMass = data.data[row.id].mass.avg

                  scans = data.data[row.id].scans
                  users = data.data[row.id].users
                  clusters = data.data[row.id].clusters

                  if (prob !== null) {
                    const oreMax = maxMins[ore] && maxMins[ore].max !== null ? maxMins[ore].max : 1
                    const oreMin = maxMins[ore] && maxMins[ore].min !== null ? maxMins[ore].min : 0
                    // The normalized value between 0 and 1 that prob is
                    normProb = calculateNormalizedProbability(prob, oreMin, oreMax)
                  }
                }

                acc.push(
                  <TableCell
                    key={ore}
                    onMouseEnter={(e) => {
                      if (tBodyRef.current) {
                        // Get the left of the table
                        const tableRect = tBodyRef.current.getBoundingClientRect()
                        const tableLeft = tableRect.left
                        const tableTop = tableRect.top
                        // Get the left and wdith of this tableCell
                        const rect = e.currentTarget.getBoundingClientRect()
                        const left = rect.left - tableLeft
                        const width = rect.width
                        setHoverCol([colNum, left, width, theme.palette[OreTierColors[tier as OreTierEnum]].main])
                        const top = rect.top - tableTop
                        const height = rect.height
                        setHoverRow([idr, top, height, theme.palette[OreTierColors[tier as OreTierEnum]].main])
                      }
                    }}
                    sx={{
                      position: 'relative',
                      borderTop: `1px solid ${rowSelected ? selectBorderColor : 'transparent'}`,
                      borderBottom: `1px solid ${rowSelected ? selectBorderColor : 'transparent'}`,
                      backgroundColor: normProb
                        ? alpha(gradients[OreTierColors[tier as OreTierEnum]][normProb], 0.4)
                        : 'rgba(0,0,0,0)',
                      borderLeft: isNewTier
                        ? `3px solid ${theme.palette[OreTierColors[tier as OreTierEnum]].main}`
                        : `1px solid ${alpha(theme.palette[OreTierColors[tier as OreTierEnum]].dark, 0.5)}`,
                    }}
                  >
                    {showExtendedStats && prob && (
                      <Tooltip title={`Based on ${scans} rock scans inside ${clusters} clusters`} placement="top">
                        <Stack
                          direction={'row'}
                          alignItems={'center'}
                          sx={{
                            position: 'absolute',
                            top: 5,
                            left: 10,
                            '& *': {
                              fontSize: '0.8rem',
                            },
                          }}
                        >
                          <RockIcon />
                          <span>
                            {scans} / {clusters}
                          </span>
                        </Stack>
                      </Tooltip>
                    )}
                    {showExtendedStats && prob && (
                      <Tooltip title={`Users that collected this data`} placement="top">
                        <Stack
                          direction={'row'}
                          alignItems={'center'}
                          sx={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            '& *': {
                              fontSize: '0.8rem',
                            },
                          }}
                        >
                          <PeopleAlt />
                          {users}
                        </Stack>
                      </Tooltip>
                    )}
                    <Stack
                      spacing={1}
                      sx={{
                        textAlign: 'center',
                        width: showExtendedStats ? 110 : 'auto',
                      }}
                    >
                      <Tooltip title={`Probability of finding ${ore} in a rock at ${row.label}`} placement="top">
                        <Typography
                          variant="h6"
                          sx={{
                            pt: prob && showExtendedStats ? 3 : 0,
                            textAlign: 'center',
                            minWidth: 30,
                          }}
                        >
                          <span
                            style={{
                              borderRadius: 50,
                              padding: prob && showExtendedStats ? 10 : 0,
                              border:
                                prob && showExtendedStats
                                  ? `1px solid ${theme.palette[OreTierColors[tier as OreTierEnum]].main}`
                                  : 'none',
                            }}
                          >
                            {prob ? MValueFormatter(prob, MValueFormat.percent) : ' '}
                          </span>
                        </Typography>
                      </Tooltip>
                      {showExtendedStats && prob && (
                        <Tooltip title={`Composition Percent: Min - Max - Avg`}>
                          <Typography
                            variant="caption"
                            sx={{ color: theme.palette.text.secondary }}
                            textAlign={'center'}
                          >
                            {MValueFormatter(minPct, MValueFormat.percent)}
                            {' - '}
                            {MValueFormatter(maxPct, MValueFormat.percent)}
                            {' - '}
                            <strong>{MValueFormatter(avgPct, MValueFormat.percent)}</strong>
                          </Typography>
                        </Tooltip>
                      )}
                      {showExtendedStats && prob && (
                        <Tooltip title={`Rock Mass: Min - Max - Avg`}>
                          <Typography
                            variant="caption"
                            sx={{ color: theme.palette.text.secondary }}
                            textAlign={'center'}
                          >
                            {MValueFormatter(minMass, MValueFormat.number_sm)}
                            {' - '}
                            {MValueFormatter(maxMass, MValueFormat.number_sm)}
                            {' - '}
                            <strong>{MValueFormatter(avgMass, MValueFormat.number_sm)}</strong>
                          </Typography>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                )
              })
            }

            return acc
          }, [] as React.ReactNode[])}
        </TableRow>
      )
    })
  }, [
    gravityWellOptions,
    data,
    oreTierFilter,
    rockTypeFilter,
    filterSelected,
    selected,
    gravityWellFilter,
    showExtendedStats,
  ])

  return (
    <Box>
      <Container maxWidth={'lg'} sx={{ borderBottom: 1, borderColor: 'divider', flex: '0 0' }}>
        {/* Fitler box */}
        <Typography variant="overline" sx={{ marginBottom: theme.spacing(2) }}>
          Filter Options:
        </Typography>
        <Stack direction="row" spacing={2} sx={{ marginBottom: theme.spacing(2) }}>
          <GravityWellChooser
            onClick={(newGrav) => {
              setGravityWellFilter(newGrav)
            }}
            wellId={gravityWellFilter}
          />

          <ToggleButtonGroup
            size="small"
            value={oreTierFilter}
            fullWidth
            onChange={(_, newFilter) => {
              if (newFilter) {
                setOreTierFilter(newFilter)
              } else {
                setOreTierFilter([])
              }
            }}
            aria-label="text alignment"
          >
            {Object.keys(OreTierNames).map((tier) => (
              <ToggleButton key={tier} value={tier} aria-label={OreTierNames[tier]} color={OreTierColors[tier]}>
                {OreTierNames[tier]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <ToggleButtonGroup
            size="small"
            value={rockTypeFilter}
            fullWidth
            onChange={(_, newFilter) => {
              if (newFilter) {
                setRockTypeFilter(newFilter)
              } else {
                setRockTypeFilter([])
              }
            }}
            aria-label="text alignment"
          >
            <ToggleButton color="info" value={'ASTEROID'}>
              Asteroid
            </ToggleButton>
            <ToggleButton color="primary" value={'SURFACE'}>
              Surface
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ marginBottom: theme.spacing(2) }}>
          <FormControlLabel
            control={<Switch checked={showExtendedStats} onChange={(e) => setShowExtendedStats(e.target.checked)} />}
            label="Advanced Stats"
          />
          <FormControlLabel
            disabled={selected.length === 0}
            control={
              <Switch
                checked={filterSelected && selected.length > 0}
                onChange={(e) => setFilterSelected(e.target.checked)}
              />
            }
            label={`Filter to ${selected.length} selected rows`}
          />

          <Button
            onClick={() => {
              setSelected([])
              setFilterSelected(false)
              setGravityWellFilter(null)
              setOreTierFilter([OreTierEnum.STier, OreTierEnum.ATier, OreTierEnum.BTier, OreTierEnum.CTier])
            }}
            variant="text"
            size="small"
            startIcon={<ClearAll />}
          >
            Clear Selection
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            onClick={() => {
              setSelected([])
              setFilterSelected(false)
              setGravityWellFilter(null)
              setOreTierFilter([OreTierEnum.STier, OreTierEnum.ATier, OreTierEnum.BTier, OreTierEnum.CTier])
            }}
            color="error"
            variant="text"
            size="small"
            startIcon={<Refresh />}
          >
            Reset Form
          </Button>
        </Stack>
      </Container>

      {/* Table Box */}
      <Paper sx={{ mb: 4 }}>
        {data && (
          <TableContainer sx={styles.table}>
            <Table size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.shortHeaderFirst}>Gravity Well</TableCell>

                  <LongCellHeader
                    sx={{
                      borderBottom:
                        hoverCol && hoverCol[0] === -1
                          ? `3px solid ${theme.palette.info.main}`
                          : '3px solid transparent',
                      '& .MuiTypography-caption': {
                        fontSize: '1.2em',
                        fontWeight: hoverCol && hoverCol[0] === -1 ? 'bold' : undefined,
                        paddingLeft: theme.spacing(5),
                        borderTop: `3px solid ${theme.palette.info.main}`,
                      },
                      // '& *': {
                      //   color: theme.palette[OreTierColors[tier as OreTierEnum]].main,
                      // },
                    }}
                  >
                    Scan Bonus
                  </LongCellHeader>

                  {Object.keys(OreTierNames).reduce((acc, tier, idx) => {
                    if (oreTierFilter.includes(tier as OreTierEnum)) {
                      ShipOreTiers[tier as OreTierEnum].map((ore, ido) => {
                        const colNum = idx * ShipOreTiers[tier as OreTierEnum].length + ido
                        const colHovered = hoverCol && hoverCol[0] === colNum
                        acc.push(
                          <LongCellHeader
                            key={ore}
                            sx={{
                              borderBottom: colHovered
                                ? `3px solid ${theme.palette[OreTierColors[tier as OreTierEnum]].main}`
                                : '3px solid transparent',
                              '& .MuiTypography-caption': {
                                fontSize: '1.2em',
                                fontWeight: colHovered ? 'bold' : undefined,
                                paddingLeft: theme.spacing(5),
                                borderTop:
                                  ido === 0
                                    ? `3px solid ${theme.palette[OreTierColors[tier as OreTierEnum]].main}`
                                    : `1px solid ${alpha(theme.palette[OreTierColors[tier as OreTierEnum]].dark, 0.5)}`,
                              },
                              '& *': {
                                color: theme.palette[OreTierColors[tier as OreTierEnum]].main,
                              },
                            }}
                          >
                            {ore}
                          </LongCellHeader>
                        )
                      })
                    }
                    return acc
                  }, [] as React.ReactNode[])}

                  <TableCell sx={styles.spacerCell}> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                ref={tBodyRef}
                sx={{
                  position: 'relative',
                }}
                onMouseLeave={() => {
                  if (hoverCol) setHoverCol(null)
                  if (hoverRow) setHoverRow(null)
                }}
              >
                {hoverCol && (
                  <Box
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
                {tableRows}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  )
}

const calculateNormalizedProbability = (prob: number, oreMin: number, oreMax: number): number => {
  // Normalize the probability to a percentage and round to the nearest integer
  const normProb = Math.round((100 * (prob - oreMin)) / (oreMax - oreMin)) - 1
  if (normProb > 100) return 100
  if (normProb < 0) return 0
  return normProb
}
