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
import { hoverColor, OreTierColors, OreTierEnum, OreTierNames, selectColor, ShipOreTiers } from './types'
import { LongCellHeader, tableStylesThunk } from '../../tables/tableCommon'
import { LookupsContext } from '../../../context/lookupsContext'
import { Lookups, SurveyData, SystemLookupItem } from '@regolithco/common'
import { ClearAll, Refresh } from '@mui/icons-material'
import { AsteroidWellTypes, SurfaceWellTypes } from '../../../types'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'

export interface ShipOreDistributionProps {
  // Props here
  data?: SurveyData | null
}

export const ShipOreDistribution: React.FC<ShipOreDistributionProps> = ({ data }) => {
  const theme = useTheme()
  const styles = tableStylesThunk(theme)
  // Filters
  const [selected, setSelected] = React.useState<string[]>([])
  const [hoverCol, setHoverCol] = React.useState<number | null>(null)

  const [oreTierFilter, setOreTierFilter] = React.useState<OreTierEnum[]>([
    OreTierEnum.STier,
    OreTierEnum.ATier,
    OreTierEnum.BTier,
    OreTierEnum.CTier,
  ])
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
        <TableContainer sx={styles.table}>
          <Table size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={styles.shortHeaderFirst}>Gravity Well</TableCell>

                {Object.keys(OreTierNames).reduce((acc, tier, idx) => {
                  if (oreTierFilter.includes(tier as OreTierEnum)) {
                    ShipOreTiers[tier as OreTierEnum].map((ore, ido) => {
                      const colNum = idx * ShipOreTiers[tier as OreTierEnum].length + ido
                      const colHovered = hoverCol && hoverCol === colNum
                      acc.push(
                        <LongCellHeader
                          key={ore}
                          sx={{
                            borderBottom: colHovered
                              ? `3px solid ${theme.palette[OreTierColors[tier as OreTierEnum]].main}`
                              : '3px solid transparent',
                            '& .MuiTypography-caption': {
                              fontWeight: colHovered ? 'bold' : undefined,
                              paddingLeft: theme.spacing(10),
                              borderTop:
                                ido === 0
                                  ? `3px solid ${theme.palette[OreTierColors[tier as OreTierEnum]].main}`
                                  : `1px solid ${alpha(theme.palette[OreTierColors[tier as OreTierEnum]].dark, 0.5)}`,
                            },
                            fontSize: '1.2em',
                            '& *': {
                              fontSize: '1.2em',
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
              onMouseLeave={() => {
                if (hoverCol) setHoverCol(null)
              }}
            >
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

                if (!rockTypeFilter.includes('SURFACE') && SurfaceWellTypes.includes(row.type)) return null
                if (!rockTypeFilter.includes('ASTEROID') && AsteroidWellTypes.includes(row.type)) return null

                if (!rowSelected && filterSelected) return null
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
                      backgroundColor: bgColor,
                      '&:hover': {
                        backgroundColor: rowSelected ? selectColor : hoverColor,
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        // STICKY FIRST COLUMN
                        position: 'sticky',
                        whiteSpace: 'nowrap',
                        backgroundColor: rowSelected ? selectColor : theme.palette.background.paper,
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

                    {/* Ore Tiers */}
                    {Object.keys(OreTierNames).reduce((acc, tier, idx) => {
                      if (oreTierFilter.includes(tier as OreTierEnum)) {
                        ShipOreTiers[tier as OreTierEnum].map((ore, idy) => {
                          const isNewTier = idy === 0
                          const colNum = idx * ShipOreTiers[tier as OreTierEnum].length + idy
                          let prob: number | null = null
                          if (data && data.data && data.data[row.id] && data.data[row.id].ores[ore]) {
                            prob = data.data[row.id].ores[ore].prob
                          }
                          acc.push(
                            <TableCell
                              key={ore}
                              onMouseOver={() => {
                                if (colNum !== hoverCol) setHoverCol(colNum)
                              }}
                              sx={{
                                background: hoverCol === colNum ? hoverColor : 'transparent',
                                borderLeft: isNewTier
                                  ? `3px solid ${theme.palette[OreTierColors[tier as OreTierEnum]].main}`
                                  : `1px solid ${alpha(theme.palette[OreTierColors[tier as OreTierEnum]].dark, 0.5)}`,
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  textAlign: 'center',
                                  minWidth: 50,
                                }}
                              >
                                {prob ? MValueFormatter(prob, MValueFormat.percent) : ' '}
                              </Typography>
                            </TableCell>
                          )
                        })
                      }

                      return acc
                    }, [] as React.ReactNode[])}
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
