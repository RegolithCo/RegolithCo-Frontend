import * as React from 'react'

import { PageWrapper } from '../../PageWrapper'
import {
  Box,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from '@mui/material'
import { getGravityWellOptions, GravityWellChooser, GravityWellNameRender } from '../../fields/GravityWellChooser'
import { OreTierColors, OreTierEnum, OreTierNames, ShipOreTiers } from './types'
import { LongCellHeader, tableStylesThunk } from '../../tables/tableCommon'
import { LookupsContext } from '../../../context/lookupsContext'
import { Lookups, SystemLookupItem } from '@regolithco/common'

export interface SurveyCorpsHomeProps {
  loading?: boolean
  activeTab?: number
  setActiveTab?: (tab: number) => void
}

export const SurveyCorpsHome: React.FC<SurveyCorpsHomeProps> = ({ loading, activeTab, setActiveTab }) => {
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
    <PageWrapper
      title="Survey Corps."
      loading={loading}
      maxWidth={'lg'}
      sx={
        {
          //
        }
      }
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', flex: '0 0' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => {
            // setActiveTab(newValue)
          }}
        >
          <Tab label="Ship Ores" value={1} />
          <Tab label="Vehicle / Hand Ores" value={1} />
          <Tab label="About Survey Corps." value={2} />
        </Tabs>
      </Box>
      <Box
        sx={
          {
            //
          }
        }
      >
        {/* Fitler box */}
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

          <FormControlLabel
            disabled={selected.length === 0}
            control={
              <Switch
                checked={filterSelected && selected.length > 0}
                onChange={(e) => setFilterSelected(e.target.checked)}
              />
            }
            label="Selected"
          />
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
                      ShipOreTiers[tier as OreTierEnum].map((ore) => {
                        acc.push(
                          <LongCellHeader
                            key={ore}
                            sx={{
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
                        sx={{
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
                                    ? `2px solid ${theme.palette[OreTierColors[tier as OreTierEnum]].main}`
                                    : 'none',
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
    </PageWrapper>
  )
}
