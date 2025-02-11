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
import { hoverColor, selectBorderColor, selectColor } from './types'
import { LongCellHeader, tableStylesThunk } from '../../tables/tableCommon'
import { LookupsContext } from '../../../context/lookupsContext'
import {
  AsteroidTypeEnum,
  DepositTypeEnum,
  getRockTypeName,
  GravityWell,
  Lookups,
  SurveyData,
} from '@regolithco/common'
import { ClearAll, FilterAlt, FilterAltOff, Refresh } from '@mui/icons-material'
import { AsteroidWellTypes, SurfaceWellTypes } from '../../../types'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { fontFamilies } from '../../../theme'
import Gradient from 'javascript-color-gradient'

export interface ShipClassLocationProps {
  // Props here
  data?: SurveyData | null
  bonuses?: SurveyData | null
}

export const ShipClassLocation: React.FC<ShipClassLocationProps> = ({ data, bonuses }) => {
  const theme = useTheme()
  const styles = tableStylesThunk(theme)
  const tBodyRef = React.useRef<HTMLTableSectionElement>(null)
  const tHeadRef = React.useRef<HTMLTableSectionElement>(null)
  const tContainerRef = React.useRef<HTMLDivElement>(null)

  const [maxMins, setMaxMins] = React.useState<Record<string, { max: number | null; min: number | null }>>({})
  // Filters
  const [selected, setSelected] = React.useState<string[]>([])
  // Hover state: [colNum, left, width, color]
  const [hoverCol, setHoverCol] = React.useState<[number, number, number, string] | null>(null)
  // Hover state: [colNum, top, height, color]
  const [hoverRow, setHoverRow] = React.useState<[number, number, number, string] | null>(null)

  const [showExtendedStats, setShowExtendedStats] = React.useState<boolean>(false)
  const [rockTypeFilter, setRockTypeFilter] = React.useState<('SURFACE' | 'ASTEROID')[]>(['SURFACE', 'ASTEROID'])
  const [filterSelected, setFilterSelected] = React.useState<boolean>(false)
  const [gravityWellFilter, setGravityWellFilter] = React.useState<string | null>(null)

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

  const gravityWells = React.useMemo(
    () => dataStore.getLookup('gravityWellLookups') as Lookups['gravityWellLookups'],
    [dataStore]
  ) as GravityWell[]

  const handleMouseEnter = React.useCallback((e: React.MouseEvent<HTMLTableCellElement>, oreKey, idr, colNum) => {
    if (tBodyRef.current) {
      // Get the left of the table
      const tableRect = tBodyRef.current.getBoundingClientRect()
      const tableLeft = tableRect.left
      const tableTop = tableRect.top
      // Get the left and wdith of this tableCell
      const rect = e.currentTarget.getBoundingClientRect()
      const left = rect.left - tableLeft
      const width = rect.width
      const isSpace = oreKey === 'ASTEROID'
      setHoverCol([colNum, left, width, theme.palette[isSpace ? 'info' : 'primary'].main])
      const top = rect.top - tableTop
      const height = rect.height
      setHoverRow([idr, top, height, theme.palette[isSpace ? 'info' : 'primary'].main])
    }
  }, [])

  const gravityWellOptions = React.useMemo(() => getGravityWellOptions(theme, gravityWells), [gravityWells])

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
      gravityWellOptions.forEach((row) => {
        const dataCols = data?.data || {}
        // Calculate the bonus
        const bonusCols = bonuses?.data || {}
        const bonus = bonusCols[row.id] || 1
        const oldBonusMax = retVal['STAT_BONUS'].max || 1
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

        // Then the types
        const allOres = [...Object.values(AsteroidTypeEnum), ...Object.values(DepositTypeEnum)]
        allOres.forEach((aType, ido) => {
          const prob = dataCols[row.id]?.rockTypes[aType]?.prob
          if (!retVal[aType]) retVal[aType] = { max: null, min: null }
          const old = retVal[aType]
          retVal[aType].max = prob ? (old.max ? Math.max(old.max, prob) : prob) : old.max
          retVal[aType].min = prob ? (old.min ? Math.min(old.min, prob) : prob) : old.min
        })
      })
      setMaxMins(retVal)
    }
  }, [gravityWellOptions, data?.data, bonuses?.data])

  const gradients = React.useMemo(() => {
    const retVal = {
      ASTEROID: new Gradient()
        .setColorGradient(rgbToHex(darken(theme.palette.info.dark, 0.5)), theme.palette.info.main)
        .setMidpoint(100) // 100 is the number of colors to generate. Should be enough stops for our ores
        .getColors()
        .map((color) => alpha(color, 0.4)),
      SURFACE: new Gradient()
        .setColorGradient(rgbToHex(darken(theme.palette.primary.dark, 0.5)), theme.palette.primary.main)
        .setMidpoint(100) // 100 is the number of colors to generate. Should be enough stops for our ores
        .getColors()
        .map((color) => alpha(color, 0.4)),
      BONUS: new Gradient()
        .setColorGradient(rgbToHex(darken(theme.palette.info.dark, 0.5)), theme.palette.info.main)
        .setMidpoint(100) // 100 is the number of colors to generate. Should be enough stops for our ores
        .getColors()
        .map((color) => alpha(color, 0.4)),
      STATS: new Gradient()
        .setColorGradient(rgbToHex(darken(theme.palette.grey[700], 0.5)), theme.palette.grey[100])
        .setMidpoint(100) // 100 is the number of colors to generate. Should be enough stops for our ores
        .getColors()
        .map((color) => alpha(color, 0.4)),
    }
    return retVal
  }, [])

  const tableRows = React.useMemo(() => {
    if (!gravityWellOptions || !maxMins || !data) return null
    const maxMinsBonus = maxMins['STAT_BONUS'] || { max: 1, min: 0 }
    const maxMinsUsers = maxMins['STAT_USERS'] || { max: 1, min: 0 }
    const maxMinScans = maxMins['STAT_SCANS'] || { max: 1, min: 0 }
    const maxMinClusters = maxMins['STAT_CLUSTERS'] || { max: 1, min: 0 }
    // const maxMinClusterSize = maxMins['STAT_CLUSTER_SIZE'] || { max: 1, min: 0 }

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
      // let normScans = 0
      let normClusters = 0

      let users = 0
      let clusters = 0
      let scans = 0

      if (data && data.data && data.data[row.id]) {
        scans = data.data[row.id].scans
        users = data.data[row.id].users
        clusters = data.data[row.id].clusters

        normUsers = calculateNormalizedProbability(users, maxMinsUsers.min, maxMinsUsers.max)
        // normScans = calculateNormalizedProbability(scans, maxMinScans.min, maxMinScans.max)
        normClusters = calculateNormalizedProbability(clusters, maxMinClusters.min, maxMinClusters.max)
      }

      if (!rowSelected && filterSelected) hide = true
      // Only render this option if the
      return (
        <SurveyTableRow
          key={row.id}
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
              backgroundColor: normBonus ? gradients['BONUS'][normBonus] : 'rgba(0,0,0,0)',
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
            <Tooltip title={`The bonus multiplier you get for scanning in this gravity well.`} placement="top">
              <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }} component="div">
                {MValueFormatter(bonus, MValueFormat.number, 1) + 'X'}
              </Typography>
            </Tooltip>
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
                  setHoverCol([-2, left, width, theme.palette.grey[500]])
                  const top = rect.top - tableTop
                  const height = rect.height
                  setHoverRow([idr, top, height, theme.palette.grey[500]])
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

          {[...Object.values(AsteroidTypeEnum), ...Object.values(DepositTypeEnum)].map((aType, ido) => {
            const isNewTier = ido === 0 || ido === Object.values(AsteroidTypeEnum).length
            const colNum = ido
            const isAsteroid = ido < Object.values(AsteroidTypeEnum).length

            const hide =
              (isAsteroid && !rockTypeFilter.includes('ASTEROID')) ||
              (!isAsteroid && !rockTypeFilter.includes('SURFACE'))
            if (hide) return null

            let prob: number | null = null

            let maxMass = 0
            let minMass = 0
            let medMass = 0

            let maxInst = 0
            let minInst = 0
            let medInst = 0

            let maxRes = 0
            let minRes = 0
            let medRes = 0

            let normProb: number | null = null

            if (data && data.data && data.data[row.id] && data.data[row.id].rockTypes[aType]) {
              prob = data.data[row.id].rockTypes[aType].prob

              maxMass = data.data[row.id].rockTypes[aType].mass.max
              minMass = data.data[row.id].rockTypes[aType].mass.min
              medMass = data.data[row.id].rockTypes[aType].mass.med

              maxInst = data.data[row.id].rockTypes[aType].inst.max
              minInst = data.data[row.id].rockTypes[aType].inst.min
              medInst = data.data[row.id].rockTypes[aType].inst.med

              maxRes = data.data[row.id].rockTypes[aType].res.max
              minRes = data.data[row.id].rockTypes[aType].res.min
              medRes = data.data[row.id].rockTypes[aType].res.med

              if (prob !== null) {
                const oreMax = maxMins[aType] && maxMins[aType].max !== null ? maxMins[aType].max : 1
                const oreMin = maxMins[aType] && maxMins[aType].min !== null ? maxMins[aType].min : 0
                // The normalized value between 0 and 1 that prob is
                normProb = calculateNormalizedProbability(prob, oreMin, oreMax)
              }
            }
            return (
              <SurveyTableOreCell
                key={aType}
                theme={theme}
                handleMouseEnter={(e) => handleMouseEnter(e, isAsteroid ? 'ASTEROID' : 'SURFACE', idr, colNum)}
                prob={prob}
                normProb={normProb}
                maxMass={maxMass}
                minMass={minMass}
                medMass={medMass}
                maxInst={maxInst}
                minInst={minInst}
                medInst={medInst}
                maxRes={maxRes}
                minRes={minRes}
                medRes={medRes}
                gradientColor={gradients[isAsteroid ? 'ASTEROID' : 'SURFACE'][normProb || 0]}
                isNewTier={isNewTier}
                showExtendedStats={showExtendedStats}
                toolTipText={`Probability of finding asteroid of type ${aType} at ${row.label}`}
                typeColor={isAsteroid ? 'info' : 'primary'}
              />
            )
          })}
        </SurveyTableRow>
      )
    })
  }, [
    gravityWellOptions,
    data,
    gradients,
    maxMins,
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
            value={rockTypeFilter}
            fullWidth
            onChange={(_, newFilter) => {
              if (newFilter && newFilter.length > 0) {
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
              setSelected([])
              setFilterSelected(false)
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
                  {rockTypeFilter.includes('ASTEROID') &&
                    Object.values(AsteroidTypeEnum).map((asteroidType, ido) => {
                      const colHovered = hoverCol && hoverCol[0] === ido
                      return (
                        <LongCellHeader
                          key={asteroidType}
                          sx={{
                            backgroundColor: 'transparent',
                            borderBottom: colHovered
                              ? `3px solid ${theme.palette.info.main}`
                              : `3px solid ${hoverColor}`,
                            '& .MuiTypography-caption': {
                              fontSize: '1.2em',
                              fontWeight: colHovered ? 'bold' : undefined,
                              paddingLeft: theme.spacing(5),
                              borderTop:
                                ido === 0
                                  ? `3px solid ${theme.palette.info.main}`
                                  : `1px solid ${alpha(theme.palette.info.dark, 0.5)}`,
                            },
                            '& *': {
                              color: theme.palette.info.main,
                            },
                          }}
                        >
                          {getRockTypeName(asteroidType)}
                        </LongCellHeader>
                      )
                    })}
                  {rockTypeFilter.includes('SURFACE') &&
                    Object.values(DepositTypeEnum).map((depositType, ido) => {
                      const colHovered = hoverCol && hoverCol[0] === ido + Object.values(AsteroidTypeEnum).length
                      return (
                        <LongCellHeader
                          key={depositType}
                          sx={{
                            backgroundColor: 'transparent',
                            borderBottom: colHovered
                              ? `3px solid ${theme.palette.primary.main}`
                              : `3px solid ${hoverColor}`,
                            '& .MuiTypography-caption': {
                              fontSize: '1.2em',
                              fontWeight: colHovered ? 'bold' : undefined,
                              paddingLeft: theme.spacing(5),
                              borderTop:
                                ido === 0
                                  ? `3px solid ${theme.palette.primary.main}`
                                  : `1px solid ${alpha(theme.palette.primary.dark, 0.5)}`,
                            },
                            '& *': {
                              color: theme.palette.primary.main,
                            },
                          }}
                        >
                          {getRockTypeName(depositType)}
                        </LongCellHeader>
                      )
                    })}
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

const calculateNormalizedProbability = (prob: number, oreMin: number | null, oreMax: number | null): number => {
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
  maxMass: number | null
  minMass: number | null
  medMass: number | null
  maxInst: number | null
  minInst: number | null
  medInst: number | null
  maxRes: number | null
  minRes: number | null
  medRes: number

  showExtendedStats: boolean
  isNewTier: boolean
  typeColor: string
  gradientColor: string
  toolTipText: string
  handleMouseEnter: (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => void
}

export const SurveyTableOreCell: React.FC<SurveyTableOreCellProps> = ({
  theme,
  prob,
  normProb,
  maxMass,
  minMass,
  medMass,
  maxInst,
  minInst,
  medInst,
  maxRes,
  minRes,
  medRes,
  showExtendedStats,
  isNewTier,
  typeColor,
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
            ? `3px solid ${theme.palette[typeColor].main}`
            : `1px solid ${alpha(theme.palette[typeColor].dark, 0.5)}`,
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
            <Box
              sx={{
                '& .MuiTypography-caption': {
                  display: 'flex',
                  justifyContent: 'space-around',
                  flexDirection: 'row',
                  color: theme.palette.text.secondary,
                  lineHeight: 1.5,
                  fontSize: '0.8em',
                },
              }}
            >
              <Tooltip title={`Rock Mass: Median (Min - Max)`}>
                <Typography variant="caption" component="div">
                  <strong>{MValueFormatter(medMass, MValueFormat.number_sm)}</strong>
                  <span>
                    ({MValueFormatter(minMass, MValueFormat.number_sm)}
                    {' - '}
                    {MValueFormatter(maxMass, MValueFormat.number_sm)})
                  </span>
                </Typography>
              </Tooltip>
              <Tooltip title={`Resistance: Median (Min - Max)`}>
                <Typography variant="caption">
                  <strong>{MValueFormatter(medRes, MValueFormat.percent)}</strong>{' '}
                  <span>
                    ({MValueFormatter(minRes, MValueFormat.percent)}
                    {' - '}
                    {MValueFormatter(maxRes, MValueFormat.percent)})
                  </span>
                </Typography>
              </Tooltip>
              <Tooltip title={`Instability: Median (Min - Max)`}>
                <Typography variant="caption">
                  <strong>{MValueFormatter(medInst, MValueFormat.number)}</strong>{' '}
                  <span>
                    ({MValueFormatter(minInst, MValueFormat.number)}
                    {' - '}
                    {MValueFormatter(maxInst, MValueFormat.number)})
                  </span>
                </Typography>
              </Tooltip>
            </Box>
          )}
        </Stack>
      </TableCell>
    )
  }, [
    prob,
    normProb,
    normProb,
    maxMass,
    minMass,
    medMass,
    maxInst,
    minInst,
    medInst,
    maxRes,
    minRes,
    medRes,
    showExtendedStats,
    isNewTier,
    typeColor,
    gradientColor,
  ])
