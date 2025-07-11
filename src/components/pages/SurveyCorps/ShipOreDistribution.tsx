import * as React from 'react'

import {
  alpha,
  Box,
  Button,
  Container,
  darken,
  FormControlLabel,
  IconButton,
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
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { getGravityWellOptions, GravityWellChooser, GravityWellNameRender } from '../../fields/GravityWellChooser'
import { hoverColor, OreTierColors, OreTierEnum, selectBorderColor, selectColor, ShipOreTiers } from './types'
import { LongCellHeader, tableStylesThunk } from '../../tables/tableCommon'
import { LookupsContext } from '../../../context/lookupsContext'
import { GravityWell, Lookups, OreTierNames, SurveyData } from '@regolithco/common'
import { ClearAll, FilterAlt, FilterAltOff, Refresh } from '@mui/icons-material'
import { AsteroidWellTypes, SurfaceWellTypes } from '../../../types'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { fontFamilies } from '../../../theme'
import Gradient from 'javascript-color-gradient'
import { useQueryParams, useURLArrayState, useURLState } from '../../../hooks/useURLState'
import { debounce } from 'lodash'

export interface ShipOreDistributionProps {
  // Props here
  data?: SurveyData | null
  bonuses?: SurveyData | null
}

export const ShipOreDistribution: React.FC<ShipOreDistributionProps> = ({ data, bonuses }) => {
  const theme = useTheme()
  const styles = tableStylesThunk(theme)
  const tBodyRef = React.useRef<HTMLTableSectionElement>(null)
  const tHeadRef = React.useRef<HTMLTableSectionElement>(null)
  const tContainerRef = React.useRef<HTMLDivElement>(null)
  const [maxMins, setMaxMins] = React.useState<Record<string, { max: number | null; min: number | null }>>({
    STAT_BONUS: { max: 1, min: 1 },
    STAT_USERS: { max: 0, min: 0 },
    STAT_SCANS: { max: 0, min: 0 },
    STAT_CLUSTERS: { max: 0, min: 0 },
    STAT_CLUSTER_SIZE: { max: 0, min: 0 },
    STAT_ROCK_MASS: { max: 0, min: 0 },
  })
  // Filters
  // const [selected, setSelected] = React.useState<string[]>([])
  // Hover state: [colNum, left, width, color]
  const [hoverCol, setHoverCol] = React.useState<[number, number, number, string] | null>(null)
  // Hover state: [colNum, top, height, color]
  const [hoverRow, setHoverRow] = React.useState<[number, number, number, string] | null>(null)

  const { resetQueryValues } = useQueryParams()

  const [selected, setSelected] = useURLArrayState<string>('s', [])

  const [filterSelected, setFilterSelected] = useURLState<boolean>(
    'fs',
    false,
    (v) => (v ? '1' : ''),
    (v) => v === '1'
  )

  const [showExtendedStats, setShowExtendedStats] = useURLState<boolean>(
    'adv',
    false,
    (v) => (v ? '1' : ''),
    (v) => v === '1'
  )

  const [gravityWellFilter, setGravityWellFilter] = useURLState<string | null>('gw', null)
  const [rockTypeFilter, setRockTypeFilter] = useURLArrayState<'SURFACE' | 'ASTEROID'>('rt', ['SURFACE', 'ASTEROID'])

  const [oreTierFilter, setOreTierFilter] = useURLArrayState<OreTierEnum>('ot', [
    OreTierEnum.STier,
    OreTierEnum.ATier,
    OreTierEnum.BTier,
    OreTierEnum.CTier,
  ])

  const dataStore = React.useContext(LookupsContext)

  const handleRowClick = React.useCallback((gravWellId: string) => {
    setSelected((prev) => {
      if (prev.includes(gravWellId)) {
        return prev.filter((id) => id !== gravWellId)
      }
      const newSelected = [...prev, gravWellId]
      if (newSelected.length === 0 && filterSelected) {
        setFilterSelected(false)
      }
      return newSelected
    })
  }, [])

  const handleGravityWellFilter = React.useCallback((newGrav: string | null) => {
    setGravityWellFilter((prev) => (prev === newGrav ? null : newGrav))
    // if tContainerRef exists scroll to the top
    setTimeout(() => {
      if (tContainerRef.current) {
        tContainerRef.current.scrollTo({ top: 0, behavior: 'instant' })
      }
    }, 100)
  }, [])

  const handleMouseEnter = React.useCallback((e: React.MouseEvent<HTMLTableCellElement>, tier, idr, colNum) => {
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
  }, [])

  const gravityWells = React.useMemo(
    () => dataStore.getLookup('gravityWellLookups') as Lookups['gravityWellLookups'],
    [dataStore]
  ) as GravityWell[]

  const gravityWellOptions = React.useMemo(() => getGravityWellOptions(theme, gravityWells), [gravityWells])

  const debouncedSetMaxMins = React.useMemo(() => debounce(setMaxMins, 300), [])

  React.useEffect(() => {
    // prepopulate the maxMins array

    const retVal: Record<string, { max: number | null; min: number | null }> = {
      STAT_BONUS: { max: 1, min: 1 },
      STAT_USERS: { max: 0, min: 0 },
      STAT_SCANS: { max: 0, min: 0 },
      STAT_CLUSTERS: { max: 0, min: 0 },
      STAT_CLUSTER_SIZE: { max: 0, min: 0 },
      STAT_ROCK_MASS: { max: 0, min: 0 },
    }
    if (gravityWellOptions && data?.data && bonuses?.data) {
      gravityWellOptions
        .filter((row) => {
          if (gravityWellFilter) return row.id === gravityWellFilter || row.parents.includes(gravityWellFilter)
          else if (filterSelected) return selected.includes(row.id)
          else if (rockTypeFilter.length === 2) return true
          else if (rockTypeFilter.includes('SURFACE')) return SurfaceWellTypes.includes(row.wellType)
          else if (rockTypeFilter.includes('ASTEROID')) return AsteroidWellTypes.includes(row.wellType)
          else return true
        })
        .forEach((row) => {
          const dataCols = data?.data || {}
          // Calculate the bonus
          const bonusCols = bonuses?.data || {}
          const bonus = bonusCols[row.id] || 1
          const oldBonusMax = retVal['STAT_BONUS'].max || 0
          retVal['STAT_BONUS'].max = Math.max(oldBonusMax, bonus)
          // Calculate the users
          const users = dataCols[row.id]?.users || 0
          const oldUsersMax = retVal['STAT_USERS'].max || 0
          retVal['STAT_USERS'].max = Math.max(oldUsersMax, users)

          // Calculate the scans
          const scans = dataCols[row.id]?.scans || 0
          const oldScansMax = retVal['STAT_SCANS'].max || 0
          retVal['STAT_SCANS'].max = Math.max(oldScansMax, scans)

          // Calculate the clusters
          const clusters = dataCols[row.id]?.clusters || 0
          const oldClustersMax = retVal['STAT_CLUSTERS'].max || 0
          retVal['STAT_CLUSTERS'].max = Math.max(oldClustersMax, clusters)

          // Calculate max clusterSizeMax
          const clusterSizeMax = dataCols[row.id]?.clusterCount.max || 0
          const oldClusterSizeMax = retVal['STAT_CLUSTER_SIZE'].max || 0
          const oldClusterSizeMin = retVal['STAT_CLUSTER_SIZE'].min || 0
          retVal['STAT_CLUSTER_SIZE'].max = Math.max(oldClusterSizeMax, clusterSizeMax)
          retVal['STAT_CLUSTER_SIZE'].min = Math.min(oldClusterSizeMin, clusterSizeMax)

          // Then the rock mass
          const rockMassMax = dataCols[row.id]?.mass.max || 0
          const rockMassMin = dataCols[row.id]?.mass.min || 0
          const oldRockMassMax = retVal['STAT_ROCK_MASS'].max || 0
          const oldRockMassMin = retVal['STAT_ROCK_MASS'].min || 0
          retVal['STAT_ROCK_MASS'].max = Math.max(oldRockMassMax, rockMassMax)
          retVal['STAT_ROCK_MASS'].min = Math.min(oldRockMassMin, rockMassMin)

          // Then the ores
          Object.keys(OreTierNames).forEach((tier, idx) => {
            if (oreTierFilter.includes(tier as OreTierEnum)) {
              ShipOreTiers[tier as OreTierEnum].forEach((ore, idy) => {
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
    debouncedSetMaxMins(retVal)
  }, [gravityWellOptions, data?.data, bonuses?.data, rockTypeFilter, filterSelected, selected, gravityWellFilter])

  const gradients = React.useMemo(() => {
    const retVal = Object.values(OreTierColors).reduce(
      (acc, color) => {
        const light = theme.palette[color].main
        const dark = rgbToHex(darken(theme.palette[color].dark, 0.5))
        acc[color] = new Gradient()
          .setColorGradient(dark, light)
          .setMidpoint(100) // 100 is the number of colors to generate. Should be enough stops for our ores
          .getColors()
          .map((color) => alpha(color, 0.4))
        return acc
      },
      {} as Record<string, string[]>
    )
    // A generic one for statistics
    const statsLight = theme.palette.info.main
    const statsDark = rgbToHex(darken(theme.palette.info.dark, 0.5))
    retVal['STATS'] = new Gradient()
      .setColorGradient(statsDark, statsLight)
      .setMidpoint(100) // 100 is the number of colors to generate. Should be enough stops for our ores
      .getColors()
      .map((color) => alpha(color, 0.4))

    return retVal
  }, [])

  const tableRows = React.useMemo(() => {
    if (!gravityWellOptions || !maxMins || !data) return null
    const maxMinsBonus = maxMins['STAT_BONUS'] || { max: 1, min: 0 }
    const maxMinsUsers = maxMins['STAT_USERS'] || { max: 1, min: 0 }
    // const maxMinScans = maxMins['STAT_SCANS'] || { max: 1, min: 0 }
    const maxMinClusters = maxMins['STAT_CLUSTERS'] || { max: 1, min: 0 }
    const maxMinClusterSize = maxMins['STAT_CLUSTER_SIZE'] || { max: 1, min: 0 }

    return gravityWellOptions.map((row, idr) => {
      let hide = false
      if (gravityWellFilter && row.id !== gravityWellFilter && !row.parents.includes(gravityWellFilter)) {
        hide = true
      }

      const rowEven = idr % 2 === 0
      const rowSelected = selected.includes(row.id)
      const bgColor = rowSelected ? selectColor : rowEven ? 'rgba(34,34,34)' : 'rgb(39,39,39)'
      // const isBlank = !row.hasRocks

      if (!rockTypeFilter.includes('SURFACE') && SurfaceWellTypes.includes(row.wellType)) hide = true
      if (!rockTypeFilter.includes('ASTEROID') && AsteroidWellTypes.includes(row.wellType)) hide = true

      const bonus = bonuses && bonuses.data && bonuses.data[row.id] ? bonuses.data[row.id] : 1

      // The normalized value between 0 and 1 that prob is
      const normBonus = calculateNormalizedProbability(bonus, maxMinsBonus.min, maxMinsBonus.max)

      let normUsers = 0
      // const normScans = 0
      let normClusters = 0
      let normClusterSize = 0
      let normRockMass = 0

      let users = 0
      let clusters = 0
      let scans = 0

      let maxMass = 0
      let minMass = 0
      let medianMass = 0

      let cluserSizeMin = 0
      let clusterSizeMax = 0
      let clusterSizemedian = 0

      if (data && data.data && data.data[row.id]) {
        scans = data.data[row.id].scans
        users = data.data[row.id].users
        clusters = data.data[row.id].clusters

        normUsers = calculateNormalizedProbability(users, maxMinsUsers.min, maxMinsUsers.max)
        // normScans = calculateNormalizedProbability(scans, maxMinScans.min, maxMinScans.max)
        normClusters = calculateNormalizedProbability(clusters, maxMinClusters.min, maxMinClusters.max)
        normClusterSize = calculateNormalizedProbability(
          data.data[row.id].clusterCount.max,
          maxMinClusterSize.min,
          maxMinClusterSize.max
        )
        normRockMass = calculateNormalizedProbability(
          data.data[row.id].mass.max,
          maxMins['STAT_ROCK_MASS'].min,
          maxMins['STAT_ROCK_MASS'].max
        )

        maxMass = data.data[row.id].mass.max
        minMass = data.data[row.id].mass.min
        medianMass = data.data[row.id].mass.med

        cluserSizeMin = data.data[row.id].clusterCount.min
        clusterSizeMax = data.data[row.id].clusterCount.max
        clusterSizemedian = data.data[row.id].clusterCount.med
      }

      if (!rowSelected && filterSelected) hide = true
      // Only render this option if the
      return (
        <SurveyTableRow
          key={`${row.id}-${idr}`}
          gravWell={row}
          handleRowClick={handleRowClick}
          idx={idr}
          isSelected={rowSelected}
          hidden={hide}
        >
          {/* --------- GRAVITY WELL CELL --------- */}
          <TableCell
            component="th"
            scope="row"
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
              '& .MuiIconButton-root': {
                display: 'none',
              },
              '&:hover .MuiIconButton-root': {
                display: 'block',
              },
              zIndex: 3,
              borderRight: `3px solid ${theme.palette.primary.main}`,
              borderTop: `1px solid ${rowSelected ? selectBorderColor : 'transparent'}`,
              borderBottom: `1px solid ${rowSelected ? selectBorderColor : 'transparent'}`,
              '& .MuiTypography-root': {
                ...theme.typography.h6,
              },
              pl: rockTypeFilter.length === 2 ? theme.spacing(row.depth * 3) : 0,
            }}
          >
            {/* FILTER BUTTON */}
            <Tooltip
              title={gravityWellFilter === row.id ? 'Remove Filter' : `Filter to ${row.label} and children`}
              placement="top"
            >
              <IconButton
                color={gravityWellFilter === row.id ? 'error' : 'primary'}
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  handleGravityWellFilter(row.id)
                }}
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                {gravityWellFilter === row.id ? <FilterAltOff /> : <FilterAlt />}
              </IconButton>
            </Tooltip>
            <GravityWellNameRender options={row} />
          </TableCell>

          {/* --------- SCAN BONUS CELL --------- */}
          <TableCell
            sx={{
              textAlign: 'center',
              fontFamily: fontFamilies.robotoMono,
              borderLeft: `3px solid ${theme.palette.info.main}`,
              backgroundColor: row.hasRocks && normBonus ? gradients['STATS'][normBonus] : 'rgba(0,0,0,0)',
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
            {row.hasRocks && (
              <Tooltip title={`The bonus multiplier you get for scanning in this gravity well.`} placement="top">
                <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }} component="div">
                  {MValueFormatter(bonus, MValueFormat.number, 1) + 'X'}
                </Typography>
              </Tooltip>
            )}
          </TableCell>

          {/* --------- ROCKS / CLUSTERS CELL --------- */}
          {showExtendedStats && (
            <TableCell
              sx={{
                textAlign: 'center',
                fontFamily: fontFamilies.robotoMono,
                backgroundColor: normClusters ? gradients['STATS'][normClusters] : 'rgba(0,0,0,0)',
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
                  setHoverCol([-2, left, width, theme.palette.info.main])
                  const top = rect.top - tableTop
                  const height = rect.height
                  setHoverRow([idr, top, height, theme.palette.info.main])
                }
              }}
            >
              {scans && clusters ? (
                <Tooltip title={`Based on ${scans} rock scans inside ${clusters} clusters`} placement="top">
                  <Typography variant="body2" sx={{ minWidth: 90, textAlign: 'center' }} component={'div'}>
                    {scans} / {clusters}
                  </Typography>
                </Tooltip>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ minWidth: 90, textAlign: 'center' }}
                  component={'div'}
                  color="text.secondary"
                >
                  {' '}
                </Typography>
              )}
            </TableCell>
          )}

          {/* --------- USERS PARTICIPATED CELL --------- */}
          {showExtendedStats && (
            <TableCell
              sx={{
                textAlign: 'center',
                fontFamily: fontFamilies.robotoMono,
                backgroundColor: normUsers ? gradients['STATS'][normUsers] : 'rgba(0,0,0,0)',
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
                  setHoverCol([-3, left, width, theme.palette.info.main])
                  const top = rect.top - tableTop
                  const height = rect.height
                  setHoverRow([idr, top, height, theme.palette.info.main])
                }
              }}
            >
              {users ? (
                <Tooltip title={`Users that collected this data`} placement="top">
                  <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'center' }} component={'div'}>
                    {users}
                  </Typography>
                </Tooltip>
              ) : (
                <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'center' }} component={'div'}>
                  {' '}
                </Typography>
              )}
            </TableCell>
          )}

          {/* --------- CLUSTER SIZE STATS --------- */}
          {showExtendedStats && (
            <TableCell
              sx={{
                textAlign: 'center',
                fontFamily: fontFamilies.robotoMono,
                backgroundColor: normUsers ? gradients['STATS'][normClusterSize] : 'rgba(0,0,0,0)',
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
                  setHoverCol([-4, left, width, theme.palette.info.main])
                  const top = rect.top - tableTop
                  const height = rect.height
                  setHoverRow([idr, top, height, theme.palette.info.main])
                }
              }}
            >
              {clusterSizeMax ? (
                <Tooltip title={`Cluster size: Median (Min - Max)`} placement="top">
                  <Typography variant="body2" sx={{ minWidth: 100, textAlign: 'center' }} component={'div'}>
                    <strong>{MValueFormatter(clusterSizemedian, MValueFormat.number_sm, 1)}</strong> (
                    {MValueFormatter(cluserSizeMin, MValueFormat.number_sm)}
                    {' - '}
                    {MValueFormatter(clusterSizeMax, MValueFormat.number_sm)})
                  </Typography>
                </Tooltip>
              ) : (
                <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'center' }} component={'div'}>
                  {' '}
                </Typography>
              )}
            </TableCell>
          )}
          {/* --------- ROCK MASS STATS  --------- */}
          {showExtendedStats && (
            <TableCell
              sx={{
                textAlign: 'center',
                fontFamily: fontFamilies.robotoMono,
                backgroundColor: normUsers ? gradients['STATS'][normRockMass] : 'rgba(0,0,0,0)',
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
                  setHoverCol([-5, left, width, theme.palette.info.main])
                  const top = rect.top - tableTop
                  const height = rect.height
                  setHoverRow([idr, top, height, theme.palette.info.main])
                }
              }}
            >
              {maxMass ? (
                <Tooltip title={`Rock Mass: Median (Min - Max)`} placement="top">
                  <Typography variant="body2" sx={{ minWidth: 150, textAlign: 'center' }} component={'div'}>
                    <strong>{MValueFormatter(medianMass, MValueFormat.number_sm, 1)}</strong> (
                    {MValueFormatter(minMass, MValueFormat.number_sm)}
                    {' - '}
                    {MValueFormatter(maxMass, MValueFormat.number_sm)})
                  </Typography>
                </Tooltip>
              ) : (
                <Typography variant="caption" sx={{ minWidth: 80, textAlign: 'center' }} component={'div'}>
                  {' '}
                </Typography>
              )}
            </TableCell>
          )}

          {/* Ore Tiers */}
          {Object.keys(OreTierNames).reduce((acc, tier, idx) => {
            if (oreTierFilter.includes(tier as OreTierEnum)) {
              ShipOreTiers[tier as OreTierEnum].map((ore, idy) => {
                const isNewTier = idy === 0
                const colNum = idx * ShipOreTiers[tier as OreTierEnum].length + idy

                let prob: number | null = null
                let maxPct = 0
                let minPct = 0
                let medPct = 0

                let normProb: number | null = null

                if (data && data.data && data.data[row.id] && data.data[row.id].ores[ore]) {
                  prob = data.data[row.id].ores[ore].prob
                  maxPct = data.data[row.id].ores[ore].maxPct
                  minPct = data.data[row.id].ores[ore].minPct
                  medPct = data.data[row.id].ores[ore].medPct

                  if (prob !== null) {
                    const oreMax = maxMins[ore] && maxMins[ore].max !== null ? maxMins[ore].max : 1
                    const oreMin = maxMins[ore] && maxMins[ore].min !== null ? maxMins[ore].min : 0
                    // The normalized value between 0 and 1 that prob is
                    normProb = calculateNormalizedProbability(prob, oreMin, oreMax)
                  }
                }
                acc.push(
                  <SurveyTableOreCell
                    key={ore}
                    theme={theme}
                    handleMouseEnter={(e) => handleMouseEnter(e, tier, idr, colNum)}
                    prob={prob}
                    normProb={normProb}
                    minPct={minPct}
                    maxPct={maxPct}
                    medPct={medPct}
                    gradientColor={gradients[OreTierColors[tier as OreTierEnum]][normProb || 0]}
                    isNewTier={isNewTier}
                    showExtendedStats={showExtendedStats}
                    toolTipText={`Probability of finding ${ore} in a rock at ${row.label}`}
                    tierColor={OreTierColors[tier as OreTierEnum]}
                  />
                )
              })
            }

            return acc
          }, [] as React.ReactNode[])}
        </SurveyTableRow>
      )
    })
  }, [
    gravityWellOptions,
    data,
    bonuses,
    gradients,
    maxMins,
    oreTierFilter,
    rockTypeFilter,
    filterSelected,
    selected,
    gravityWellFilter,
    showExtendedStats,
  ])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth={'lg'} sx={{ borderBottom: 1, borderColor: 'divider', flex: '0 0' }}>
        {/* Fitler box */}
        <Typography variant="overline" sx={{ marginBottom: theme.spacing(2) }}>
          Filter Options:
        </Typography>
        <Stack direction="row" spacing={2} sx={{ marginBottom: theme.spacing(2) }}>
          <GravityWellChooser
            onClick={(newGrav) => {
              handleGravityWellFilter(newGrav)
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
              if (newFilter.length > 0) {
                setRockTypeFilter(newFilter)
              } else {
                // setRockTypeFilter([])
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
              resetQueryValues(['s', 'fs'])
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
      </Container>

      {/* Table Box */}
      <Paper
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* the table header background box */}
        <Box
          sx={{
            pt: 16,
            position: 'absolute',
            pointerEvents: 'none', // Make the box transparent to all mouse events
            zIndex: 1,
            top: 0,
            left: 0,
            width: '100%',
            backgroundColor: theme.palette.background.paper,
          }}
        />
        {data && (
          <TableContainer sx={{ ...styles.tableStickyHead, maxHeight: '100%' }} ref={tContainerRef}>
            <Table size="small" aria-label="simple table" stickyHeader>
              <TableHead ref={tHeadRef}>
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      ...styles.shortHeaderFirst,
                      background: theme.palette.background.paper,
                    }}
                  >
                    Gravity Well
                  </TableCell>

                  <LongCellHeader
                    sx={{
                      backgroundColor: 'transparent',
                      borderBottom:
                        hoverCol && hoverCol[0] === -1
                          ? `3px solid ${theme.palette.info.main}`
                          : `3px solid ${hoverColor}`,
                      '& .MuiTypography-caption': {
                        fontSize: '1.2em',
                        fontWeight: hoverCol && hoverCol[0] === -1 ? 'bold' : undefined,
                        paddingLeft: theme.spacing(5),
                        borderTop: `3px solid ${theme.palette.info.main}`,
                      },
                    }}
                  >
                    Score Bonus
                  </LongCellHeader>
                  {showExtendedStats && (
                    <LongCellHeader
                      sx={{
                        backgroundColor: 'transparent',
                        borderBottom:
                          hoverCol && hoverCol[0] === -2
                            ? `3px solid ${theme.palette.info.main}`
                            : `3px solid ${hoverColor}`,
                        '& .MuiTypography-caption': {
                          fontSize: '1.2em',
                          fontWeight: hoverCol && hoverCol[0] === -2 ? 'bold' : undefined,
                          paddingLeft: theme.spacing(5),
                        },
                      }}
                    >
                      Rocks / Clusters Surveyed
                    </LongCellHeader>
                  )}

                  {showExtendedStats && (
                    <LongCellHeader
                      sx={{
                        backgroundColor: 'transparent',
                        borderBottom:
                          hoverCol && hoverCol[0] === -3
                            ? `3px solid ${theme.palette.info.main}`
                            : `3px solid ${hoverColor}`,
                        '& .MuiTypography-caption': {
                          fontSize: '1.2em',
                          fontWeight: hoverCol && hoverCol[0] === -3 ? 'bold' : undefined,
                          paddingLeft: theme.spacing(5),
                        },
                      }}
                    >
                      Survey Users
                    </LongCellHeader>
                  )}
                  {showExtendedStats && (
                    <LongCellHeader
                      sx={{
                        backgroundColor: 'transparent',
                        borderBottom:
                          hoverCol && hoverCol[0] === -4
                            ? `3px solid ${theme.palette.info.main}`
                            : `3px solid ${hoverColor}`,
                        '& .MuiTypography-caption': {
                          fontSize: '1.2em',
                          fontWeight: hoverCol && hoverCol[0] === -4 ? 'bold' : undefined,
                          paddingLeft: theme.spacing(5),
                        },
                      }}
                    >
                      Cluster Size
                    </LongCellHeader>
                  )}
                  {showExtendedStats && (
                    <LongCellHeader
                      sx={{
                        backgroundColor: 'transparent',
                        borderBottom:
                          hoverCol && hoverCol[0] === -5
                            ? `3px solid ${theme.palette.info.main}`
                            : `3px solid ${hoverColor}`,
                        '& .MuiTypography-caption': {
                          fontSize: '1.2em',
                          fontWeight: hoverCol && hoverCol[0] === -5 ? 'bold' : undefined,
                          paddingLeft: theme.spacing(5),
                        },
                      }}
                    >
                      Rock Mass
                    </LongCellHeader>
                  )}

                  {Object.keys(OreTierNames).reduce((acc, tier, idx) => {
                    if (oreTierFilter.includes(tier as OreTierEnum)) {
                      ShipOreTiers[tier as OreTierEnum].map((ore, ido) => {
                        const colNum = idx * ShipOreTiers[tier as OreTierEnum].length + ido
                        const colHovered = hoverCol && hoverCol[0] === colNum
                        acc.push(
                          <LongCellHeader
                            key={ore}
                            sx={{
                              backgroundColor: 'transparent',
                              borderBottom: colHovered
                                ? `3px solid ${theme.palette[OreTierColors[tier as OreTierEnum]].main}`
                                : `3px solid ${hoverColor}`,
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

                  <TableCell
                    sx={{
                      ...styles.spacerCell,
                      backgroundColor: 'transparent',
                    }}
                  >
                    {' '}
                  </TableCell>
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
                {tableRows}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  )
}

export const calculateNormalizedProbability = (prob: number, oreMin: number | null, oreMax: number | null): number => {
  if (oreMin === oreMax) return 99
  if (oreMin === null || oreMax === null) return 0
  // Normalize the probability to a percentage and round to the nearest integer
  const normProb = Math.round((100 * (prob - oreMin)) / (oreMax - oreMin)) - 1
  if (normProb > 100) return 99
  if (normProb < 0) return 0
  return normProb
}

interface SurveyTableRowProps extends React.PropsWithChildren {
  idx: number
  gravWell: GravityWell
  isSelected: boolean
  hidden: boolean
  handleRowClick: (gravWellId: string) => void
}

export const SurveyTableRow: React.FC<SurveyTableRowProps> = ({
  children,
  gravWell,
  isSelected,
  hidden,
  handleRowClick,
  ...props
}) => {
  const rowEven = props.idx % 2 === 0
  const blank = !gravWell?.hasRocks
  const bgColor = blank ? 'black ' : isSelected ? selectColor : rowEven ? 'rgba(34,34,34)' : 'rgb(39,39,39)'
  return (
    <TableRow
      key={gravWell.id}
      onClick={() => handleRowClick(gravWell.id)}
      sx={{
        display: hidden ? 'none' : undefined,
        position: 'relative',
        backgroundColor: bgColor,
        '& .MuiTableCell-root': {
          borderTop: `1px solid ${isSelected ? selectBorderColor : 'transparent'}`,
          borderBottom: `1px solid ${isSelected ? selectBorderColor : 'transparent'}`,
        },
      }}
    >
      {children}
    </TableRow>
  )
}

export interface SurveyTableOreCellProps {
  theme: Theme
  prob: number | null
  normProb: number | null
  minPct: number | null
  maxPct: number | null
  medPct: number | null
  showExtendedStats: boolean
  isNewTier: boolean
  tierColor: string
  gradientColor: string
  toolTipText: string
  handleMouseEnter: (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => void
}

export const SurveyTableOreCell: React.FC<SurveyTableOreCellProps> = ({
  theme,
  prob,
  normProb,
  minPct,
  maxPct,
  medPct,
  showExtendedStats,
  isNewTier,
  tierColor,
  gradientColor,
  toolTipText,
  handleMouseEnter,
}) =>
  React.useMemo(() => {
    return (
      <TableCell
        onMouseEnter={handleMouseEnter}
        sx={{
          position: 'relative',
          backgroundColor: normProb ? gradientColor : 'rgba(0,0,0,0)',
          borderLeft: isNewTier
            ? `3px solid ${theme.palette[tierColor].main}`
            : `1px solid ${alpha(theme.palette[tierColor].dark, 0.5)}`,
        }}
      >
        <Stack
          spacing={1}
          sx={{
            textAlign: 'center',
            width: showExtendedStats ? 110 : 'auto',
          }}
        >
          <Tooltip title={toolTipText} placement="top">
            <Typography
              variant="h6"
              component="div"
              sx={{
                textAlign: 'center',
                minWidth: 30,
              }}
            >
              {prob ? MValueFormatter(prob, MValueFormat.percent) : ' '}
            </Typography>
          </Tooltip>
          {showExtendedStats && prob && (
            <Tooltip title={`Composition Percent: Median (Min - Max)`} placement="top">
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }} textAlign={'center'}>
                <strong>{MValueFormatter(medPct, MValueFormat.percent)}</strong> (
                {MValueFormatter(minPct, MValueFormat.percent)}
                {' - '}
                {MValueFormatter(maxPct, MValueFormat.percent)})
              </Typography>
            </Tooltip>
          )}
        </Stack>
      </TableCell>
    )
  }, [prob, normProb, minPct, maxPct, medPct, showExtendedStats, isNewTier, tierColor, gradientColor])
