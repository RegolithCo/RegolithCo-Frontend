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
  SxProps,
  Theme,
  IconButton,
} from '@mui/material'
import { LoadoutShipEnum, MiningLaserEnum, MiningStoreEnum, getMiningStoreName, lookups } from '@regolithco/common'
import { AddShoppingCart, Check } from '@mui/icons-material'
import Gradient from 'javascript-color-gradient'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  cellDivider: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  longHeaders: {
    position: 'relative',
    '& .MuiTypography-root': {
      position: 'absolute',
      transform: 'rotate(-30deg)',
      transformOrigin: '0% 0%',
      whiteSpace: 'nowrap',
    },
  },
})

export interface LaserTableProps {
  onAddToLoadout: (module: MiningLaserEnum) => void
}

export const LaserTable: React.FC<LaserTableProps> = ({ onAddToLoadout }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const [filter, setFilter] = React.useState<LoadoutShipEnum | null>()

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newFilter: LoadoutShipEnum | 'ALL') => {
    if (newFilter === 'ALL') setFilter(null)
    else setFilter(newFilter)
  }

  const filteredVals = Object.values(lookups.loadout.lasers).filter((laser) => {
    if (filter === LoadoutShipEnum.Mole) return laser.size === 2
    if (filter === LoadoutShipEnum.Prospector) return laser.size === 1
    return true
  })

  const bgColors = new Gradient()
    .setColorGradient('#b93327', '#229f63')
    .setMidpoint(100) // 100 is the number of colors to generate. Should be enough stops for our ores
    .getColors()
  const fgColors = bgColors.map((color) => theme.palette.getContrastText(color))

  const stores = Object.values(MiningStoreEnum)
  return (
    <>
      <ToggleButtonGroup value={filter || 'all'} exclusive onChange={handleAlignment} aria-label="text alignment">
        <ToggleButton value={'all'} aria-label="left aligned">
          All
        </ToggleButton>
        <ToggleButton value={LoadoutShipEnum.Prospector} aria-label="centered">
          Prospector
        </ToggleButton>
        <ToggleButton value={LoadoutShipEnum.Mole} aria-label="right aligned">
          Mole
        </ToggleButton>
      </ToggleButtonGroup>
      <TableContainer sx={{ pt: 10 }}>
        <Table sx={{ minWidth: 400, maxWidth: 900, mx: 'auto' }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Add</TableCell>
              <TableCell>Laser</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Slots</TableCell>

              <LongCellHeader>Optimum Range</LongCellHeader>
              <LongCellHeader>Max. Range</LongCellHeader>
              <LongCellHeader>Min. Power</LongCellHeader>
              <LongCellHeader>Max. Power</LongCellHeader>
              <LongCellHeader>Extract Power</LongCellHeader>
              <LongCellHeader>Min. Power %</LongCellHeader>

              <LongCellHeader>Resistance</LongCellHeader>
              <LongCellHeader>Instability</LongCellHeader>
              <LongCellHeader>Optimal Charge Rate</LongCellHeader>
              <LongCellHeader>Optimal Charge Window</LongCellHeader>
              <LongCellHeader>Inert Materials</LongCellHeader>
              {/* <LongCellHeader>Overcharge Rate</LongCellHeader>
              <LongCellHeader>Clustering</LongCellHeader>
              <LongCellHeader>Shatter Damage</LongCellHeader> */}

              {stores.map((store, idx) => (
                <LongCellHeader key={`${store}-${idx}`}>{getMiningStoreName(store)}</LongCellHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVals.map((laser, idx) => (
              <TableRow
                key={`${laser.code}-${idx}`}
                sx={{
                  '&:nth-of-type(even)': { backgroundColor: theme.palette.action.hover },
                }}
              >
                <TableCell>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onAddToLoadout(laser.code as MiningLaserEnum)}
                  >
                    <AddShoppingCart />
                  </IconButton>
                </TableCell>
                <TableCell>{laser.name}</TableCell>
                <TableCell>{laser.size}</TableCell>
                <TableCell>{laser.price ? MValueFormatter(laser.price, MValueFormat.currency_sm) : '--'}</TableCell>
                <TableCell sx={styles.cellDivider}>{laser.slots}</TableCell>

                <TableCell>{laser.stats.optimumRange}</TableCell>
                <TableCell>{laser.stats.maxRange}</TableCell>
                <TableCell>{laser.stats.minPower}</TableCell>
                <TableCell>{laser.stats.maxPower}</TableCell>
                <TableCell>{laser.stats.extrPower}</TableCell>
                <TableCell sx={styles.cellDivider}>
                  {MValueFormatter(laser.stats.minPowerPct, MValueFormat.percent)}
                </TableCell>

                <StatsCell value={laser.stats.resistance} />
                <StatsCell value={laser.stats.instability} />
                <StatsCell value={laser.stats.optimalChargeRate} />
                <StatsCell value={laser.stats.optimalChargeWindow} />
                <StatsCell value={laser.stats.inertMaterials} />
                {/* <StatsCell value={laser.stats.overchargeRate} />
                <StatsCell value={laser.stats.clusterMod} />
                <StatsCell value={laser.stats.shatterDamage} /> */}

                {stores.map((store, idx) => (
                  <TableCell key={`${store}-${idx}`} sx={styles.cellDivider} padding="checkbox">
                    {laser.stores.includes(store) ? <Check color="success" /> : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

const StatsCell: React.FC<{ value?: number }> = ({ value }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)

  if (typeof value === 'undefined') {
    return <TableCell sx={styles.cellDivider}>--</TableCell>
  }
  const color = value > 0 ? theme.palette.success.main : theme.palette.error.main
  return <TableCell sx={{ color, ...styles.cellDivider }}>{MValueFormatter(value, MValueFormat.percent)}</TableCell>
}

const LongCellHeader: React.FC<React.PropsWithChildren> = ({ children }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  return (
    <TableCell sx={styles.longHeaders}>
      <Typography variant="caption" component="div">
        {children}
      </Typography>
    </TableCell>
  )
}
