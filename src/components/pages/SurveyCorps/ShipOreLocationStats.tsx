import * as React from 'react'

import {
  alpha,
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material'
import { getGravityWellOptions, GravityWellChooser, GravityWellNameRender } from '../../fields/GravityWellChooser'
import { LongCellHeader, tableStylesThunk } from '../../tables/tableCommon'
import { LookupsContext } from '../../../context/lookupsContext'
import { Lookups, SurveyData, SystemLookupItem } from '@regolithco/common'
import { ClearAll, Refresh } from '@mui/icons-material'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { fontFamilies } from '../../../theme'
import { isUndefined } from 'lodash'
import { hoverColor, selectColor } from './types'

export interface ShipOreLocationStatsProps {
  // Props here
  data?: SurveyData | null
  bonuses?: SurveyData | null
}

export const ShipOreLocationStats: React.FC<ShipOreLocationStatsProps> = ({ data, bonuses }) => {
  const theme = useTheme()
  const styles = tableStylesThunk(theme)
  // Filters
  const [selected, setSelected] = React.useState<string[]>([])
  const [hover, setHover] = React.useState<[number, number] | null>(null)
  const [rockTypeFilter, setRockTypeFilter] = React.useState<('SURFACE' | 'ASTEROID')[]>(['SURFACE', 'ASTEROID'])
  const [filterSelected, setFilterSelected] = React.useState<boolean>(false)
  const [gravityWellFilter, setGravityWellFilter] = React.useState<string | null>(null)

  const dataStore = React.useContext(LookupsContext)

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
      <Paper sx={{ mb: 4 }}>
        <TableContainer sx={styles.table}>
          <Table size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={styles.shortHeaderFirst}> </TableCell>

                <StatsTableHeader label="Scan Bonus" isHovered={Boolean(hover && hover[1] === 1)} />
                <StatsTableHeader label="Clusters Scanned" isHovered={Boolean(hover && hover[1] === 2)} />
                <StatsTableHeader label="Rocks Scanned" isHovered={Boolean(hover && hover[1] === 3)} />
                <StatsTableHeader label="Corps. Users Involved" isHovered={Boolean(hover && hover[1] === 4)} />

                <StatsTableHeader
                  label="Cluster Rock Count"
                  isHeader
                  isHovered={Boolean(hover && (hover[1] === 5 || hover[1] === 6 || hover[1] === 7))}
                />
                <StatsTableHeader
                  label=" "
                  isHovered={Boolean(hover && (hover[1] === 5 || hover[1] === 6 || hover[1] === 7))}
                />
                <StatsTableHeader
                  label=" "
                  isHovered={Boolean(hover && (hover[1] === 5 || hover[1] === 6 || hover[1] === 7))}
                />

                <StatsTableHeader
                  label="Rock Mass"
                  isHeader
                  isHovered={Boolean(hover && (hover[1] === 8 || hover[1] === 9 || hover[1] === 10))}
                />
                <StatsTableHeader
                  label=" "
                  isHovered={Boolean(hover && (hover[1] === 8 || hover[1] === 9 || hover[1] === 10))}
                />
                <StatsTableHeader
                  label=" "
                  isHovered={Boolean(hover && (hover[1] === 8 || hover[1] === 9 || hover[1] === 10))}
                />

                <StatsTableHeader
                  label="Instability"
                  isHeader
                  isHovered={Boolean(hover && (hover[1] === 11 || hover[1] === 12 || hover[1] === 13))}
                />
                <StatsTableHeader
                  label=" "
                  isHovered={Boolean(hover && (hover[1] === 11 || hover[1] === 12 || hover[1] === 13))}
                />
                <StatsTableHeader
                  label=" "
                  isHovered={Boolean(hover && (hover[1] === 11 || hover[1] === 12 || hover[1] === 13))}
                />

                <StatsTableHeader
                  label="Resistance"
                  isHeader
                  isHovered={Boolean(hover && (hover[1] === 14 || hover[1] === 15 || hover[1] === 16))}
                />
                <StatsTableHeader
                  label=" "
                  isHovered={Boolean(hover && (hover[1] === 14 || hover[1] === 15 || hover[1] === 16))}
                />
                <StatsTableHeader
                  label=" "
                  isHovered={Boolean(hover && (hover[1] === 14 || hover[1] === 15 || hover[1] === 16))}
                />

                <TableCell sx={styles.spacerCell}> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody onMouseLeave={() => setHover(null)}>
              <TableRow
                sx={{
                  '& *': {
                    textAlign: 'center',
                    // fontSize: '0.6rem',
                  },
                  '& .MuiTableCell-root': {
                    // borderTop: `3px solid ${theme.palette.primary.main}`,
                  },
                  color: theme.palette.primary.contrastText,
                  backgroundColor: theme.palette.secondary.dark,
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'left',
                  }}
                >
                  Gravity Well
                </TableCell>
                <TableCell sx={{ borderLeft: `3px solid ${theme.palette.primary.main}` }}></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>

                <TableCell sx={{ borderLeft: `3px solid ${theme.palette.primary.main}` }}>MIN</TableCell>
                <TableCell>MAX</TableCell>
                <TableCell>AVG</TableCell>

                <TableCell sx={{ borderLeft: `3px solid ${theme.palette.primary.main}` }}>MIN</TableCell>
                <TableCell>MAX</TableCell>
                <TableCell>AVG</TableCell>

                <TableCell sx={{ borderLeft: `3px solid ${theme.palette.primary.main}` }}>MIN</TableCell>
                <TableCell>MAX</TableCell>
                <TableCell>AVG</TableCell>

                <TableCell sx={{ borderLeft: `3px solid ${theme.palette.primary.main}` }}>MIN</TableCell>
                <TableCell>MAX</TableCell>
                <TableCell>AVG</TableCell>
              </TableRow>

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
                const rowData = data && data.data ? data?.data[row.id] : null
                if (rowData) console.log('MARZIPAN', rowData)
                // Only render this option if the
                const isRowHovered = hover && hover[0] === idr
                const colHovered = hover && hover[1]
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
                    {/* GravityWell */}
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        // STICKY FIRST COLUMN
                        position: 'sticky',
                        backgroundColor: rowSelected
                          ? selectColor
                          : isRowHovered
                            ? hoverColor
                            : theme.palette.background.paper,
                        '&:hover': {
                          color: theme.palette.primary.contrastText,
                          backgroundColor: rowSelected ? selectColor : hoverColor,
                        },
                        zIndex: 3,
                        borderRight: `3px solid ${theme.palette.primary.main}`,
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
                        backgroundColor: theme.palette.info.dark,
                      }}
                      onMouseOver={() => setHover([idr, 1])}
                    >
                      {bonuses && bonuses.data && MValueFormatter(bonuses.data[row.id], MValueFormat.number) + 'X'}
                    </TableCell>

                    <StatsTableCell
                      value={rowData?.clusters}
                      onHover={() => setHover([idr, 2])}
                      isHovered={isRowHovered || colHovered === 2}
                    />
                    <StatsTableCell
                      value={rowData?.scans}
                      onHover={() => setHover([idr, 3])}
                      isHovered={isRowHovered || colHovered === 3}
                    />
                    <StatsTableCell
                      value={rowData?.users}
                      onHover={() => setHover([idr, 4])}
                      isHovered={isRowHovered || colHovered === 4}
                    />
                    <StatsTableCell
                      isHeader
                      value={rowData?.clusterCount?.min}
                      onHover={() => setHover([idr, 5])}
                      isHovered={isRowHovered || colHovered === 5}
                    />
                    <StatsTableCell
                      value={rowData?.clusterCount?.max}
                      onHover={() => setHover([idr, 6])}
                      isHovered={isRowHovered || colHovered === 6}
                    />
                    <StatsTableCell
                      value={rowData?.clusterCount?.avg}
                      onHover={() => setHover([idr, 7])}
                      isHovered={isRowHovered || colHovered === 7}
                    />
                    <StatsTableCell
                      isHeader
                      value={rowData?.mass?.min}
                      onHover={() => setHover([idr, 8])}
                      isHovered={isRowHovered || colHovered === 8}
                    />
                    <StatsTableCell
                      value={rowData?.mass?.max}
                      onHover={() => setHover([idr, 9])}
                      isHovered={isRowHovered || colHovered === 9}
                    />
                    <StatsTableCell
                      value={rowData?.mass?.avg}
                      onHover={() => setHover([idr, 10])}
                      isHovered={isRowHovered || colHovered === 10}
                    />

                    <StatsTableCell
                      isHeader
                      value={rowData?.inst?.min}
                      onHover={() => setHover([idr, 11])}
                      isHovered={isRowHovered || colHovered === 11}
                    />
                    <StatsTableCell
                      value={rowData?.inst?.max}
                      onHover={() => setHover([idr, 12])}
                      isHovered={isRowHovered || colHovered === 12}
                    />
                    <StatsTableCell
                      value={rowData?.inst?.avg}
                      onHover={() => setHover([idr, 13])}
                      isHovered={isRowHovered || colHovered === 13}
                    />

                    <StatsTableCell
                      isHeader
                      value={rowData?.res.min}
                      format={MValueFormat.percent}
                      onHover={() => setHover([idr, 14])}
                      isHovered={isRowHovered || colHovered === 14}
                    />
                    <StatsTableCell
                      value={rowData?.res.max}
                      format={MValueFormat.percent}
                      onHover={() => setHover([idr, 15])}
                      isHovered={isRowHovered || colHovered === 15}
                    />
                    <StatsTableCell
                      value={rowData?.res.avg}
                      format={MValueFormat.percent}
                      onHover={() => setHover([idr, 16])}
                      isHovered={isRowHovered || colHovered === 16}
                    />
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

interface StatsTableHeaderProps {
  label: string
  isHeader?: boolean
  isHovered?: boolean
}

const StatsTableHeader: React.FC<StatsTableHeaderProps> = ({ label, isHeader, isHovered }) => {
  const theme = useTheme()
  return (
    <LongCellHeader
      sx={{
        '& .MuiTypography-caption': {
          backgroundColor: isHovered ? hoverColor : 'transparent',
          borderTop: isHeader
            ? `3px solid ${theme.palette.primary.main}`
            : `1px solid ${alpha(theme.palette.primary.dark, 0.5)}`,
        },
        '& *': {
          fontSize: '0.9rem',
          color: theme.palette.primary.main,
        },
      }}
    >
      {label}
    </LongCellHeader>
  )
}

interface StatsTableCellProps {
  value?: string | number | null
  isHovered?: boolean
  onHover?: () => void
  isHeader?: boolean
  format?: MValueFormat
  tooltip?: string
}

const StatsTableCell: React.FC<StatsTableCellProps> = ({ value, isHeader, format, isHovered, onHover }) => {
  const theme = useTheme()
  return (
    <TableCell
      onMouseOver={onHover}
      sx={{
        background: isHovered ? hoverColor : 'transparent',
        textAlign: 'center',
        fontFamily: fontFamilies.robotoMono,
        borderLeft: isHeader
          ? `3px solid ${theme.palette.primary.main}`
          : `1px solid ${alpha(theme.palette.primary.dark, 0.5)}`,
      }}
    >
      {!isUndefined(value) && value !== null ? MValueFormatter(value, format || MValueFormat.number) : ' '}
    </TableCell>
  )
}
