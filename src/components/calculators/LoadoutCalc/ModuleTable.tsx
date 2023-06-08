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
  SxProps,
  Theme,
  IconButton,
  Chip,
} from '@mui/material'
import {
  LoadoutShipEnum,
  MiningGadgetEnum,
  MiningModuleEnum,
  MiningStoreEnum,
  getMiningStoreName,
  lookups,
} from '@regolithco/common'
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

export interface ModuleTableProps {
  onAddToLoadout: (module: MiningModuleEnum | MiningGadgetEnum) => void
}

export const ModuleTable: React.FC<ModuleTableProps> = ({ onAddToLoadout }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const [filter, setFilter] = React.useState<LoadoutShipEnum | null>()

  const bgColors = new Gradient()
    .setColorGradient('#b93327', '#229f63')
    .setMidpoint(100) // 100 is the number of colors to generate. Should be enough stops for our ores
    .getColors()
  const fgColors = bgColors.map((color) => theme.palette.getContrastText(color))

  const stores = Object.values(MiningStoreEnum)

  const modTypeIcons: Record<string, React.ReactNode> = {
    A: <Chip label="Active" size="small" color="primary" />,
    P: <Chip label="Passive" size="small" color="secondary" />,
    G: <Chip label="Gadget" size="small" color="info" />,
  }

  const filteredValues = [...Object.values(lookups.loadout.modules), ...Object.values(lookups.loadout.gadgets)]
  return (
    <>
      <TableContainer sx={{ pt: 10 }}>
        <Table sx={{ minWidth: 400, maxWidth: 900, mx: 'auto' }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Add</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Price</TableCell>

              <LongCellHeader>Resistance</LongCellHeader>
              <LongCellHeader>Instability</LongCellHeader>
              <LongCellHeader>Optimal Charge Rate</LongCellHeader>
              <LongCellHeader>Optimal Charge Window</LongCellHeader>
              <LongCellHeader>Inert Materials</LongCellHeader>
              <LongCellHeader>Overcharge Rate</LongCellHeader>
              <LongCellHeader>Clustering</LongCellHeader>
              <LongCellHeader>Shatter Damage</LongCellHeader>
              <LongCellHeader>Extract Power Mod</LongCellHeader>

              {stores.map((store, idx) => (
                <LongCellHeader key={`${store}-${idx}`}>{getMiningStoreName(store)}</LongCellHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredValues.map((lm, idx) => {
              const topBorder =
                idx > 0 && filteredValues[idx - 1].category !== lm.category ? { borderTop: '2px solid' } : {}
              return (
                <TableRow
                  key={`${lm.code}-${idx}`}
                  sx={{
                    '&:nth-of-type(even)': { backgroundColor: theme.palette.action.hover },
                  }}
                >
                  <TableCell sx={topBorder}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onAddToLoadout(lm.code as MiningModuleEnum | MiningGadgetEnum)}
                    >
                      <AddShoppingCart />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={topBorder}>{lm.name}</TableCell>
                  <TableCell sx={topBorder}>{modTypeIcons[lm.category]}</TableCell>
                  <TableCell sx={topBorder}>
                    {lm.price ? MValueFormatter(lm.price, MValueFormat.currency_sm) : ' '}
                  </TableCell>

                  <StatsCell value={lm.stats.resistance} sx={topBorder} />
                  <StatsCell value={lm.stats.instability} sx={topBorder} />
                  <StatsCell value={lm.stats.optimalChargeRate} sx={topBorder} />
                  <StatsCell value={lm.stats.optimalChargeWindow} sx={topBorder} />
                  <StatsCell value={lm.stats.inertMaterials} sx={topBorder} />
                  <StatsCell value={lm.stats.overchargeRate} sx={topBorder} />
                  <StatsCell value={lm.stats.clusterMod} sx={topBorder} />
                  <StatsCell value={lm.stats.shatterDamage} sx={topBorder} />
                  <StatsCell value={lm.stats.powerMod} sx={topBorder} />

                  {stores.map((store, idx) => (
                    <TableCell
                      key={`${store}-${idx}`}
                      sx={Object.assign({}, styles.cellDivider, topBorder)}
                      padding="checkbox"
                    >
                      {lm.stores.includes(store) ? <Check color="success" /> : null}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

const StatsCell: React.FC<{ value?: number; sx?: SxProps<Theme> }> = ({ value, sx }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const finalSx: SxProps<Theme> = Object.assign({}, styles.cellDivider, sx || {})

  if (typeof value === 'undefined') {
    return <TableCell sx={finalSx}> </TableCell>
  }
  const color = value > 0 ? theme.palette.success.main : theme.palette.error.main
  return (
    <TableCell sx={finalSx}>
      <span style={{ color }}>{MValueFormatter(value, MValueFormat.percent)}</span>
    </TableCell>
  )
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
