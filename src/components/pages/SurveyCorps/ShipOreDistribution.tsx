import * as React from 'react'

import {
  alpha,
  Box,
  Button,
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
import { OreTierColors, OreTierEnum, OreTierNames, ShipOreTiers } from './types'
import { LongCellHeader, tableStylesThunk } from '../../tables/tableCommon'
import { LookupsContext } from '../../../context/lookupsContext'
import { Lookups, SystemLookupItem } from '@regolithco/common'
import { ClearAll, Refresh } from '@mui/icons-material'
import { AsteroidWellTypes, SurfaceWellTypes } from '../../../types'

export interface ShipOreDistributionProps {
  // Props here
  a?: string
}

export const ShipOreDistribution: React.FC<ShipOreDistributionProps> = () => {
  const theme = useTheme()
  const styles = tableStylesThunk(theme)
  // Filters
  const [selected, setSelected] = React.useState<string[]>([])
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

      {/* Table Box */}
      <Paper sx={{ mb: 4 }}>
        <TableContainer sx={styles.table}>
          <Table size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={styles.shortHeaderFirst}>Gravity Well</TableCell>
                {/* Ore Tiers */}
                {Object.keys(OreTierNames).reduce((acc, tier, idx) => {
                  if (oreTierFilter.includes(tier as OreTierEnum)) {
                    ShipOreTiers[tier as OreTierEnum].map((ore, ido) => {
                      acc.push(
                        <LongCellHeader
                          key={ore}
                          sx={{
                            '& .MuiTypography-caption': {
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
            <TableBody>
              {gravityWellOptions.map((row, idr) => {
                if (gravityWellFilter && row.id !== gravityWellFilter && !row.parents.includes(gravityWellFilter)) {
                  return null
                }
                const rowEven = idr % 2 === 0
                const rowSelected = selected.includes(row.id)
                const bgColor = rowSelected
                  ? theme.palette.action.selected
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
                        backgroundColor: rowSelected ? theme.palette.action.selected : theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        // STICKY FIRST COLUMN
                        position: 'sticky',
                        backgroundColor: rowSelected ? '#444' : theme.palette.background.paper,
                        '&:hover': {
                          color: theme.palette.primary.contrastText,
                          backgroundColor: rowSelected
                            ? alpha(theme.palette.action.selected, 1)
                            : alpha(theme.palette.action.hover, 1),
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
                          acc.push(
                            <TableCell
                              key={ore}
                              sx={{
                                borderLeft: isNewTier
                                  ? `3px solid ${theme.palette[OreTierColors[tier as OreTierEnum]].main}`
                                  : `1px solid ${alpha(theme.palette[OreTierColors[tier as OreTierEnum]].dark, 0.5)}`,
                              }}
                            >
                              0
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
