import * as React from 'react'

import {
  Alert,
  AlertTitle,
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
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { getGravityWellOptions, GravityWellChooser, GravityWellNameRender } from '../../fields/GravityWellChooser'
import { LongCellHeader, tableStylesThunk } from '../../tables/tableCommon'
import { LookupsContext } from '../../../context/lookupsContext'
import { findPrice, GravityWell, GravityWellTypeEnum, Lookups, SurveyData, VehicleOreEnum } from '@regolithco/common'
import { ClearAll, FilterAlt, FilterAltOff, Refresh } from '@mui/icons-material'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { blue, green } from '@mui/material/colors'
import { hoverColor, selectBorderColor, selectColor } from './types'
import Gradient from 'javascript-color-gradient'

export interface VehicleOreDistributionProps {
  // Props here
  data?: SurveyData | null
}

export const VehicleOreDistribution: React.FC<VehicleOreDistributionProps> = ({ data }) => {
  const theme = useTheme()
  const styles = tableStylesThunk(theme)
  const tBodyRef = React.useRef<HTMLTableSectionElement>(null)
  const tContainerRef = React.useRef<HTMLDivElement>(null)
  const [sortedVehicleRowKeys, setSortedVehicleRowKeys] = React.useState<VehicleOreEnum[]>([])
  const [maxMins, setMaxMins] = React.useState<Record<string, { max: number | null; min: number | null }>>({})
  // Filters
  const [selected, setSelected] = React.useState<string[]>([])
  // Hover state: [colNum, left, width, color]
  const [hoverCol, setHoverCol] = React.useState<[number, number, number, string] | null>(null)
  // Hover state: [colNum, top, height, color]
  const [hoverRow, setHoverRow] = React.useState<[number, number, number, string] | null>(null)

  const [filterSelected, setFilterSelected] = React.useState<boolean>(false)
  const [showExtendedStats, setShowExtendedStats] = React.useState<boolean>(false)
  const [gravityWellFilter, setGravityWellFilter] = React.useState<string | null>(null)

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
    }, 1000)
  }, [])

  const handleMouseEnter = React.useCallback((e: React.MouseEvent<HTMLTableCellElement>, tier, idr, colIdx, bgc) => {
    if (tBodyRef.current) {
      // Get the left of the table
      const tableRect = tBodyRef.current.getBoundingClientRect()
      const tableLeft = tableRect.left
      const tableTop = tableRect.top
      // Get the left and wdith of this tableCell
      const rect = e.currentTarget.getBoundingClientRect()
      const left = rect.left - tableLeft
      const width = rect.width
      setHoverCol([colIdx, left, width, bgc])
      const top = rect.top - tableTop
      const height = rect.height
      setHoverRow([idr, top, height, bgc])
    }
  }, [])

  const dataStore = React.useContext(LookupsContext)

  const bgColors = ['#fff200', '#ff00c3', blue[500], green[500]]
  const fgColors = ['#000000', '#ffffff', '#ffffff']

  React.useEffect(() => {
    if (!dataStore) return
    const calcVehicleRowKeys = async () => {
      const vehicleRowKeys = Object.values(VehicleOreEnum)
      const prices = await Promise.all(vehicleRowKeys.map((vehicleOreKey) => findPrice(dataStore, vehicleOreKey)))
      const newSorted = [...vehicleRowKeys].sort((a, b) => {
        const aPrice = prices[vehicleRowKeys.indexOf(a)]
        const bPrice = prices[vehicleRowKeys.indexOf(b)]
        return bPrice - aPrice
      })
      setSortedVehicleRowKeys(newSorted)
    }
    calcVehicleRowKeys()
  }, [dataStore])

  const gravityWells = React.useMemo(
    () => dataStore.getLookup('gravityWellLookups') as Lookups['gravityWellLookups'],
    [dataStore]
  ) as GravityWell[]

  const gravityWellOptions = React.useMemo(() => {
    return getGravityWellOptions(theme, gravityWells)
  }, [gravityWells])

  // Calculate the max and min values for each ore
  React.useEffect(() => {
    // prepopulate the maxMins array
    const retVal: Record<string, { max: number | null; min: number | null }> = {}
    if (data?.data && gravityWellOptions) {
      gravityWellOptions
        .filter((row) => {
          if (gravityWellFilter) return row.id === gravityWellFilter || row.parents.includes(gravityWellFilter)
          else if (filterSelected) return selected.includes(row.id)
        })
        .forEach((row) => {
          const dataCols = data?.data || {}
          // Then the ores
          Object.values(VehicleOreEnum).forEach((ore, idy) => {
            const prob = dataCols[row.id]?.ores[ore]?.prob
            if (!retVal[ore]) retVal[ore] = { max: null, min: null }
            const old = retVal[ore]
            retVal[ore].max = prob ? (old.max ? Math.max(old.max, prob) : prob) : old.max
            retVal[ore].min = prob ? (old.min ? Math.min(old.min, prob) : prob) : old.min
          })
        })
    }
    setMaxMins(retVal)
  }, [gravityWellOptions, data?.data, selected, filterSelected, gravityWellFilter])

  const gradients = React.useMemo(() => {
    return Object.values(sortedVehicleRowKeys).reduce(
      (acc, color, idx) => {
        const light = bgColors[idx]
        const dark = rgbToHex(darken(light, 0.5))
        acc[color] = new Gradient()
          .setColorGradient(dark, light)
          .setMidpoint(100) // 100 is the number of colors to generate. Should be enough stops for our ores
          .getColors()
        return acc
      },
      {} as Record<string, string[]>
    )
  }, [sortedVehicleRowKeys])

  const tableRows = React.useMemo(() => {
    return gravityWellOptions.map((row, idr) => {
      let hide = false
      if (gravityWellFilter && row.id !== gravityWellFilter && !row.parents.includes(gravityWellFilter)) {
        hide = true
      }

      const rowEven = idr % 2 === 0
      const rowSelected = selected.includes(row.id)
      const bgColor = rowSelected ? selectColor : rowEven ? 'rgba(34,34,34)' : 'rgb(39,39,39)'

      if (!rowSelected && filterSelected) return null

      const rowData = (data && data.data && data.data[row.id]) || null
      if (row.wellType === GravityWellTypeEnum.PLANET || row.wellType === GravityWellTypeEnum.SATELLITE) {
        // keep these always
      } else if (!rowData && (row.depth >= 2 || row.wellType === GravityWellTypeEnum.CLUSTER)) return null

      return (
        <SurveyTableRow
          key={row.id}
          idx={idr}
          gravWell={row}
          isSelected={rowSelected}
          hidden={hide}
          handleRowClick={handleRowClick}
        >
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
              // backgroundColor: rowSelected ? selectColor : isRowHovered ? hoverColor : theme.palette.background.paper,
              zIndex: 3,
              borderRight: `3px solid ${theme.palette.primary.main}`,
              pl: theme.spacing(row.depth * 3),
              '& .MuiIconButton-root': {
                display: 'none',
              },
              '&:hover .MuiIconButton-root': {
                display: 'block',
              },
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

          {showExtendedStats && (
            <TableCell
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
                  setHoverCol([-2, left, width, theme.palette.info.dark])
                  const top = rect.top - tableTop
                  const height = rect.height
                  setHoverRow([idr, top, height, theme.palette.info.dark])
                }
              }}
              sx={{
                // background: isRowHovered || colHovered === -1 ? hoverColor : 'transparent',
                borderLeft: `1px solid #ffffff`,
              }}
            >
              <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }}>
                {rowData?.finds}
              </Typography>
            </TableCell>
          )}
          {showExtendedStats && (
            <TableCell
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
                  setHoverCol([-2, left, width, theme.palette.info.dark])
                  const top = rect.top - tableTop
                  const height = rect.height
                  setHoverRow([idr, top, height, theme.palette.info.dark])
                }
              }}
              sx={{
                // background: isRowHovered || colHovered === -2 ? hoverColor : 'transparent',
                borderLeft: `1px solid #ffffff`,
              }}
            >
              <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }}>
                {rowData?.users}
              </Typography>
            </TableCell>
          )}

          {/* Ore Tiers */}
          {sortedVehicleRowKeys.map((ore, colIdx) => {
            let prob: number | null = null
            let minNum: number | null = null
            let maxNum: number | null = null
            let avgNum: number | null = null
            let normProb: number | null = null
            let bgColor: string | undefined = undefined

            const fgc = fgColors[colIdx]
            const bgc = bgColors[colIdx]
            if (data && data.data && data.data[row.id] && data.data[row.id].ores[ore]) {
              prob = data.data[row.id].ores[ore].prob
              minNum = data.data[row.id].ores[ore].minRocks
              maxNum = data.data[row.id].ores[ore].maxRocks
              avgNum = data.data[row.id].ores[ore].avgRocks
            }

            if (prob !== null) {
              const oreMax = maxMins[ore] && maxMins[ore].max !== null ? maxMins[ore].max : 1
              const oreMin = maxMins[ore] && maxMins[ore].min !== null ? maxMins[ore].min : 0
              // The normalized value between 0 and 1 that prob is
              normProb = calculateNormalizedProbability(prob, oreMin, oreMax)
              bgColor = gradients && gradients[ore] ? alpha(gradients[ore][normProb], 0.4) : undefined
            }

            return (
              <SurveyTableOreCell
                key={ore}
                prob={prob}
                normProb={normProb}
                minNum={minNum}
                maxNum={maxNum}
                avgNum={avgNum}
                showExtendedStats={showExtendedStats}
                isNewTier={false}
                oreColor={bgc}
                backgroundColor={bgColor}
                handleMouseEnter={(e) => handleMouseEnter(e, 'primary', idr, colIdx, bgc)}
              />
            )
          })}
        </SurveyTableRow>
      )
    })
  }, [data, sortedVehicleRowKeys, selected, filterSelected, showExtendedStats, gravityWellFilter])

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
            label="Filter Selected Rows"
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
        <TableContainer sx={{ ...styles.tableStickyHead, maxHeight: '100%' }} ref={tContainerRef}>
          <Table size="small" aria-label="simple table" stickyHeader>
            <TableHead>
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
                {showExtendedStats && (
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
                      '& *': {
                        fontSize: '1.3em',
                        fontWeight: 'bold',
                      },
                    }}
                  >
                    Clusters Scanned
                  </LongCellHeader>
                )}
                {showExtendedStats && (
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
                      '& *': {
                        fontSize: '1.3em',
                        fontWeight: 'bold',
                      },
                    }}
                  >
                    Users Participated
                  </LongCellHeader>
                )}

                {sortedVehicleRowKeys.map((ore, colIdx) => {
                  // const colHovered = hover && hover[1] === colIdx
                  const fgc = fgColors[colIdx]
                  const bgc = bgColors[colIdx]
                  const colHovered = hoverCol && hoverCol[0] === colIdx

                  return (
                    <LongCellHeader
                      key={ore}
                      sx={{
                        backgroundColor: 'transparent',
                        borderBottom: colHovered ? `3px solid ${bgc}` : `3px solid ${hoverColor}`,
                        '& .MuiTypography-caption': {
                          fontSize: '1.2em',
                          fontWeight: colHovered ? 'bold' : undefined,
                          paddingLeft: theme.spacing(5),
                          borderTop: colIdx === 0 ? `3px solid ${bgc}` : `1px solid ${alpha(bgc, 0.5)}`,
                        },
                        '& *': {
                          color: bgc,
                        },
                      }}
                    >
                      {ore}
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
                setHoverCol(null)
                setHoverRow(null)
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
        <Alert severity="info" sx={{ borderRadius: 0, mt: 4 }}>
          <AlertTitle>Legend:</AlertTitle>
          <Typography variant="body2" paragraph>
            The percentages in the table cells represent the probability that a cluster you find will be of that type.
          </Typography>
          {showExtendedStats && (
            <Typography variant="body2" paragraph>
              The numbers in the form of "Min - Max - Avg" are the number of rocks in a cluster of that type
            </Typography>
          )}
        </Alert>
      </Paper>
    </Box>
  )
}

const calculateNormalizedProbability = (prob: number, oreMin: number, oreMax: number): number => {
  // Normalize the probability to a percentage and round to the nearest integer
  if (oreMax === oreMin) return 99
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
  const bgColor = isSelected ? selectColor : rowEven ? 'rgba(34,34,34)' : 'rgb(39,39,39)'
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
  prob: number | null
  normProb: number | null
  minNum: number | null
  maxNum: number | null
  avgNum: number | null
  showExtendedStats: boolean
  isNewTier: boolean
  oreColor: string | undefined
  backgroundColor: string | undefined
  handleMouseEnter: (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => void
}

export const SurveyTableOreCell: React.FC<SurveyTableOreCellProps> = ({
  prob,
  normProb,
  minNum,
  maxNum,
  avgNum,
  showExtendedStats,
  isNewTier,
  oreColor,
  backgroundColor,
  handleMouseEnter,
}) =>
  React.useMemo(() => {
    const theme = useTheme()

    return (
      <TableCell
        onMouseEnter={handleMouseEnter}
        sx={{
          position: 'relative',
          backgroundColor: backgroundColor,
          // borderLeft: `2px solid ${oreColor}`,
        }}
      >
        <Stack
          spacing={1}
          sx={{
            textAlign: 'center',
            width: showExtendedStats ? 150 : 'auto',
          }}
        >
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
          {showExtendedStats && minNum && (
            <Tooltip title={`Number of rocks in cluster: Min - Max - Avg`}>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }} textAlign={'center'}>
                {MValueFormatter(minNum, MValueFormat.number)}
                {' - '}
                {MValueFormatter(maxNum, MValueFormat.number)}
                {' - '}
                <strong>{MValueFormatter(avgNum, MValueFormat.number)}</strong>
              </Typography>
            </Tooltip>
          )}
        </Stack>
      </TableCell>
    )
  }, [prob, normProb, minNum, maxNum, avgNum, showExtendedStats, isNewTier, oreColor, backgroundColor])
