import React from 'react'
import { Box, useTheme } from '@mui/material'
import { AllStats, BackwardStats } from '@regolithco/common'
import { NumberStat } from './LoadoutStat'
import Grid from '@mui/material/Unstable_Grid2/Grid2'

export interface LoadoutCalcStatsProps {
  stats: AllStats
}

export const statsOrder: { key: keyof AllStats; label: string; tooltip: string; percent?: boolean; unit?: string }[] = [
  { key: 'minPower', label: 'Min Pwr', tooltip: 'Minimum Laser Power (All Active lasers combined)' },
  { key: 'maxPower', label: 'Max Pwr', tooltip: 'Maximum Laser Power (All active lasers combined)' },
  {
    key: 'optimumRange',
    label: 'Opt Rng',
    percent: false,
    unit: 'm',
    tooltip: 'Optimum Range (Average for all active lasers)',
  },
  {
    key: 'maxRange',
    label: 'Max Rng',
    percent: false,
    unit: 'm',
    tooltip: 'Maximum Range (Average for all active lasers)',
  },
  { key: 'resistance', label: 'Resistance', percent: true, tooltip: 'Resistance Modifier' },
  { key: 'instability', label: 'Instability', percent: true, tooltip: 'Instability Modifier' },
  { key: 'overchargeRate', label: 'Overcharge', percent: true, tooltip: 'Overcharge Rate Modifier' },
  { key: 'clusterMod', label: 'Clust.', percent: true, tooltip: 'Cluster Modifier' },
  { key: 'inertMaterials', label: 'Inert', percent: true, tooltip: 'Inert Materials filtering' },
  { key: 'optimalChargeRate', label: 'Opt Chrg Rt', percent: true, tooltip: 'Optimal Charge Rate Modifier' },
  { key: 'optimalChargeWindow', label: 'Opt Chrg Wnd', percent: true, tooltip: 'Optimal Charge Window Modifier' },
  { key: 'shatterDamage', label: 'Shatter', percent: true, tooltip: 'Shatter Damage Modifier' },
  { key: 'extrPower', label: 'Ext Pwr', tooltip: 'Total extraction power (All Active lasers combined)' },

  // minPowerPct: { label: 'Min Power %', percent: true },
  // extrPowerMod: { label: 'Extraction Power Mod', percent: true },
  // powerMod: { label: 'Power Mod', percent: true },
]

const MODMAP: Partial<Record<keyof AllStats, keyof AllStats>> = {
  maxPower: 'powerMod',
  minPower: 'powerMod',
  extrPower: 'extrPowerMod',
}

export const LoadoutCalcStats: React.FC<LoadoutCalcStatsProps> = ({ stats }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        ml: 2,
        // border: '4px solid black',
        backgroundColor: 'black',
        border: `1px solid ${theme.palette.secondary.light}`,
        borderRadius: 4,
        p: 1,
        mb: 1,
      }}
    >
      <Grid container>
        {statsOrder.map(({ key, label, percent, unit, tooltip }) => {
          const modPercent = MODMAP[key as keyof AllStats]
            ? stats[MODMAP[key as keyof AllStats] as keyof AllStats]
            : undefined
          return (
            <Grid key={key} xs={4}>
              <NumberStat
                label={label}
                isPercent={percent}
                modPercent={modPercent}
                unit={unit}
                tooltip={tooltip}
                value={stats[key as keyof AllStats]}
                reversed={BackwardStats.includes(key)}
              />
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}
