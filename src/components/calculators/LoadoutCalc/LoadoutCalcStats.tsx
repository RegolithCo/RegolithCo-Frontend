import React from 'react'
import { Box, useTheme } from '@mui/material'
import { AllStats, BackwardStats } from '@regolithco/common'
import { NumberStat } from './LoadoutStat'
import Grid from '@mui/material/Unstable_Grid2/Grid2'

export interface LoadoutCalcStatsProps {
  stats: AllStats
}

const statsOrder: Record<string, { label: string; tooltip: string; percent?: boolean; unit?: string }> = {
  minPower: { label: 'Min Pwr', tooltip: 'Minimum Laser Power (All Active lasers combined)' },
  maxPower: { label: 'Max Pwr', tooltip: 'Maximum Laser Power (All active lasers combined)' },
  extrPower: { label: 'Ext Pwr', tooltip: 'Total extraction power (All Active lasers combined)' },
  optimumRange: {
    label: 'Opt Rng',
    percent: false,
    unit: 'm',
    tooltip: 'Optimum Range (Average for all active lasers)',
  },
  maxRange: { label: 'Max Rng', percent: false, unit: 'm', tooltip: 'Maximum Range (Average for all active lasers)' },
  resistance: { label: 'Resistance', percent: true, tooltip: 'Resistance Modifier' },
  instability: { label: 'Instability', percent: true, tooltip: 'Instability Modifier' },
  overchargeRate: { label: 'Overcharge', percent: true, tooltip: 'Overcharge Rate Modifier' },
  clusterMod: { label: 'Clust.', percent: true, tooltip: 'Cluster Modifier' },
  inertMaterials: { label: 'Inert', percent: true, tooltip: 'Inert Materials filtering' },
  optimalChargeRate: { label: 'Opt Chrg Rt', percent: true, tooltip: 'Optimal Charge Rate Modifier' },
  optimalChargeWindow: { label: 'Opt Chrg Wnd', percent: true, tooltip: 'Optimal Charge Window Modifier' },
  shatterDamage: { label: 'Shatter', percent: true, tooltip: 'Shatter Damage Modifier' },

  // minPowerPct: { label: 'Min Power %', percent: true },
  // extrPowerMod: { label: 'Extraction Power Mod', percent: true },
  // powerMod: { label: 'Power Mod', percent: true },
}

export const LoadoutCalcStats: React.FC<LoadoutCalcStatsProps> = ({ stats }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        ml: 2,
        border: '4px solid black',
        backgroundColor: 'black',
        borderRadius: 4,
      }}
    >
      <Grid container>
        {Object.entries(statsOrder).map(([key, { label, percent, unit, tooltip }]) => (
          <Grid key={key} xs={3}>
            <NumberStat
              label={label}
              percent={percent}
              unit={unit}
              tooltip={tooltip}
              value={stats[key as keyof AllStats]}
              reversed={BackwardStats.includes(key)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
