import * as React from 'react'

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  FormControlLabel,
  Paper,
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
import {
  findPrice,
  GravityWellTypeEnum,
  Lookups,
  SurveyData,
  SystemLookupItem,
  VehicleOreEnum,
} from '@regolithco/common'
import { ClearAll, Refresh } from '@mui/icons-material'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { blue, green } from '@mui/material/colors'
import { GemIcon } from '../../../icons'
import { hoverColor, selectColor } from './types'

export interface VehicleOreDistributionProps {
  // Props here
  data?: SurveyData | null
}

export const VehicleOreDistribution: React.FC<VehicleOreDistributionProps> = ({ data }) => {
  const theme = useTheme()
  const styles = tableStylesThunk(theme)
  const [sortedVehicleRowKeys, setSortedVehicleRowKeys] = React.useState<VehicleOreEnum[]>([])
  // Filters
  const [selected, setSelected] = React.useState<string[]>([])
  const [hover, setHover] = React.useState<[number, number] | null>(null)

  const [filterSelected, setFilterSelected] = React.useState<boolean>(false)
  const [showExtendedStats, setShowExtendedStats] = React.useState<boolean>(false)
  const [gravityWellFilter, setGravityWellFilter] = React.useState<string | null>(null)

  const dataStore = React.useContext(LookupsContext)

  const bgColors = ['#fff200', '#ff00c3', blue[500], green[500]]
  const fgColors = ['#000000', '#ffffff', '#ffffff']

  React.useEffect(() => {
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

  const systemLookup = React.useMemo(
    () => dataStore.getLookup('gravityWellLookups') as Lookups['gravityWellLookups'],
    [dataStore]
  ) as SystemLookupItem[]

  const gravityWellOptions = React.useMemo(() => {
    return getGravityWellOptions(theme, systemLookup)
  }, [])

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
        </Stack>
        <Stack direction="row" spacing={2} sx={{ marginBottom: theme.spacing(2) }}>
          <FormControlLabel
            control={<Switch checked={showExtendedStats} onChange={(e) => setShowExtendedStats(e.target.checked)} />}
            label="Extended Stats"
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

        {/* Table Box */}
        <Paper sx={{ mb: 4 }}>
          <Alert severity="info" sx={{ borderRadius: 0 }}>
            <AlertTitle>Vehicle Ore Distribution</AlertTitle>
            <Typography variant="caption">
              The percentages underneath the ore types are the probability that a cluster you find in this area will be
              of that type
            </Typography>
          </Alert>

          <TableContainer sx={styles.table}>
            <Table size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.shortHeaderFirst}>Gravity Well</TableCell>
                  {showExtendedStats && (
                    <LongCellHeader
                      sx={{
                        borderBottom: hover && hover[1] === -1 ? `3px solid #ffffff` : '3px solid transparent',
                        '& .MuiTypography-caption': {
                          fontWeight: hover && hover[1] === -1 ? 'bold' : undefined,
                          borderTop: `1px solid #ffffff`,
                        },
                        '& *': {
                          // color: fgc,
                        },
                      }}
                    >
                      Clusters Scanned
                    </LongCellHeader>
                  )}
                  {showExtendedStats && (
                    <LongCellHeader
                      sx={{
                        borderBottom: hover && hover[1] === -2 ? `3px solid #ffffff` : '3px solid transparent',
                        '& .MuiTypography-caption': {
                          fontWeight: hover && hover[1] === -2 ? 'bold' : undefined,
                          borderTop: `1px solid #ffffff`,
                        },
                        '& *': {
                          // color: fgc,
                        },
                      }}
                    >
                      Collected by users
                    </LongCellHeader>
                  )}

                  {sortedVehicleRowKeys.map((ore, colIdx) => {
                    const colHovered = hover && hover[1] === colIdx
                    const fgc = fgColors[colIdx]
                    const bgc = bgColors[colIdx]
                    return (
                      <LongCellHeader
                        key={ore}
                        sx={{
                          borderBottom: colHovered ? `3px solid ${bgc}` : '3px solid transparent',
                          '& .MuiTypography-caption': {
                            fontWeight: colHovered ? 'bold' : undefined,
                            borderTop: `1px solid ${bgc}`,
                          },
                          '& *': {
                            fontSize: '1.3em',
                            fontWeight: 'bold',
                            color: bgc,
                          },
                        }}
                      >
                        {ore}
                      </LongCellHeader>
                    )
                  })}

                  <TableCell sx={styles.spacerCell}> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody onMouseLeave={() => setHover(null)}>
                {gravityWellOptions.map((row, idr) => {
                  if (gravityWellFilter && row.id !== gravityWellFilter && !row.parents.includes(gravityWellFilter)) {
                    return null
                  }
                  const rowEven = idr % 2 === 0
                  const rowSelected = selected.includes(row.id)
                  const bgColor = rowSelected
                    ? selectColor
                    : rowEven
                      ? theme.palette.background.paper
                      : theme.palette.background.default

                  if (!rowSelected && filterSelected) return null
                  // Only render this option if the
                  const isRowHovered = hover && hover[0] === idr
                  const colHovered = hover && hover[1]

                  const rowData = (data && data.data && data.data[row.id]) || null
                  if (row.type === GravityWellTypeEnum.PLANET || row.type === GravityWellTypeEnum.SATELLITE) {
                    // keep these always
                  } else if (!rowData && (row.depth >= 2 || row.type === GravityWellTypeEnum.CLUSTER)) return null

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
                        backgroundColor: bgColor,
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        onMouseEnter={() => setHover(null)}
                        sx={{
                          // STICKY FIRST COLUMN
                          position: 'sticky',
                          backgroundColor: rowSelected
                            ? selectColor
                            : isRowHovered
                              ? hoverColor
                              : theme.palette.background.paper,
                          zIndex: 3,
                          borderRight: `3px solid ${theme.palette.primary.main}`,
                          pl: theme.spacing(row.depth * 3),
                        }}
                      >
                        <GravityWellNameRender options={row} />
                      </TableCell>

                      {showExtendedStats && (
                        <TableCell
                          onMouseOver={() => setHover([idr, -1])}
                          sx={{
                            background: isRowHovered || colHovered === -1 ? hoverColor : 'transparent',
                            borderLeft: `1px solid #ffffff`,
                          }}
                        >
                          {rowData?.finds}
                        </TableCell>
                      )}
                      {showExtendedStats && (
                        <TableCell
                          onMouseOver={() => setHover([idr, -2])}
                          sx={{
                            background: isRowHovered || colHovered === -2 ? hoverColor : 'transparent',
                            borderLeft: `1px solid #ffffff`,
                          }}
                        >
                          {rowData?.users}
                        </TableCell>
                      )}

                      {/* Ore Tiers */}
                      {sortedVehicleRowKeys.map((ore, rowIdx) => {
                        let prob: number | null = null
                        let minNum: number | null = null
                        let maxNum: number | null = null
                        let avgNum: number | null = null
                        const fgc = fgColors[rowIdx]
                        const bgc = bgColors[rowIdx]
                        if (data && data.data && data.data[row.id] && data.data[row.id].ores[ore]) {
                          prob = data.data[row.id].ores[ore].prob
                          minNum = data.data[row.id].ores[ore].minRocks
                          maxNum = data.data[row.id].ores[ore].maxRocks
                          avgNum = data.data[row.id].ores[ore].avgRocks
                        }
                        return (
                          <TableCell
                            key={ore}
                            onMouseOver={() => setHover([idr, rowIdx])}
                            sx={{
                              width: '300px',
                              background: isRowHovered || colHovered === rowIdx ? '#333333' : 'transparent',
                              borderLeft: `1px solid ${bgc}`,
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
                                sx={
                                  {
                                    //
                                  }
                                }
                              >
                                {prob ? MValueFormatter(prob, MValueFormat.percent) : ' '}
                              </Typography>
                              {showExtendedStats && minNum && (
                                <Tooltip title={`Rocks in cluster: Min: ${minNum} Max: ${maxNum} Avg: ${avgNum}`}>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: theme.palette.text.secondary }}
                                    textAlign={'center'}
                                  >
                                    <GemIcon
                                      sx={{
                                        fontSize: '0.8rem',
                                        color: theme.palette.text.secondary,
                                        marginRight: theme.spacing(1),
                                      }}
                                    />
                                    ⬇ {minNum} ⬆ {maxNum} AVG: {avgNum}
                                  </Typography>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  )
}
