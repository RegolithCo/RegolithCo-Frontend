import React from 'react'
import { Box, ListSubheader, MenuItem, Select, Stack, Typography, lighten, useTheme } from '@mui/material'
import {
  AllStats,
  BackwardStats,
  LaserLoadoutStats,
  MiningLaserEnum,
  MiningModuleEnum,
  ModuleLoadoutStats,
  lookups,
} from '@regolithco/common'
import { LoadoutLaserChip, LoadoutModuleChip } from './LoadoutLaserChip'
import { NumberStat } from './LoadoutStat'
import { statsOrder } from './LoadoutCalcStats'
import { ModuleIcon } from '../../../icons/Module'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { fontFamilies } from '../../../theme'

const LASERS = lookups.loadout.lasers
const GADGETS = lookups.loadout.gadgets
const MODULES = lookups.loadout.modules

export interface ModuleChooserMenuProps {
  value: MiningModuleEnum | null
  onChange: (value: MiningModuleEnum | '', isActive: boolean, isHover: boolean) => void
  label: string
}

const baseProps: React.ComponentProps<typeof Select> = {
  fullWidth: true,
  variant: 'standard',
  displayEmpty: true,
  sx: {
    '& .MuiInput-input': {
      overflow: 'visible',
    },
  },
}

const MODULE_NO_MENU_STAT: (keyof AllStats)[] = [
  'minPower',
  'minPowerPct',
  'maxPower',
  'maxRange',
  'optimumRange',
  'clusterMod',
  'extrPower',
  'extrPowerMod',
]

export const ModuleChooserMenu: React.FC<ModuleChooserMenuProps> = ({ onChange, value, label }) => {
  const theme = useTheme()
  const moduleKeys: MiningModuleEnum[] = Object.keys(MODULES).map((key) => key as MiningModuleEnum)
  return (
    <Select
      {...baseProps}
      disableUnderline
      value={value || ''}
      sx={{}}
      MenuProps={{
        MenuListProps: {
          dense: true,
        },
        PaperProps: {
          elevation: 6,
          sx: {
            maxHeight: 500,
          },
        },
      }}
      onChange={(e) => onChange(e.target.value as MiningModuleEnum, true, false)}
      renderValue={(value) => {
        if (!value) {
          return (
            <Typography
              component="div"
              variant="overline"
              sx={{
                textAlign: 'center',
                fontStyle: 'italic',
                color: theme.palette.text.disabled,
              }}
            >
              {label} (Empty)
            </Typography>
          )
        }
        return <LoadoutModuleChip moduleCode={value as MiningModuleEnum} canBeOn />
      }}
    >
      <MenuItem
        value=""
        sx={{
          fontFamily: fontFamilies.robotoMono,
          fontSize: '1rem',
          border: `4px solid ${theme.palette.divider}`,
        }}
      >
        <em>Select None</em>
      </MenuItem>
      <ListSubheader
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        Active Modules
      </ListSubheader>
      {moduleKeys.reduce((acc, key, idx) => {
        const module = MODULES[key as MiningModuleEnum]
        const lastModule = idx > 0 ? MODULES[moduleKeys[idx - 1]] : null
        return [
          ...acc,
          !module.active && lastModule && lastModule.active ? (
            <ListSubheader
              key="passive-subheader"
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
              }}
            >
              Passive Modules
            </ListSubheader>
          ) : null,
          <MenuItem
            key={key}
            sx={{
              backgroundColor:
                idx % 2 === 0 ? theme.palette.background.paper : lighten(theme.palette.background.paper, 0.05),
            }}
            value={module.code}
            onMouseOut={() => onChange('', true, true)}
            onMouseOver={() => onChange(module.code as MiningModuleEnum, true, true)}
          >
            <ModuleMenuItem moduleCode={key} />
          </MenuItem>,
        ]
      }, [] as React.ReactNode[])}
    </Select>
  )
}

export interface LaserChooserMenuProps {
  value: MiningLaserEnum | null
  onChange: (value: MiningLaserEnum | '', isActive: boolean, isHover: boolean) => void
  laserSize: number
}

const LASER_NO_MENU_STAT: (keyof AllStats)[] = ['shatterDamage', 'overchargeRate', 'clusterMod', 'extrPower']

export const LaserChooserMenu: React.FC<LaserChooserMenuProps> = ({ onChange, value, laserSize }) => {
  const theme = useTheme()
  const laserChoices: MiningLaserEnum[] = Object.keys(LASERS)
    .filter((key) => LASERS[key as MiningLaserEnum].size === laserSize)
    .map((l) => l as MiningLaserEnum)

  return (
    <Select
      {...baseProps}
      value={value}
      onChange={(e) => {
        onChange(e.target.value as MiningLaserEnum, true, false)
      }}
      renderValue={(laserCode) => {
        if (!laserCode) {
          return <em>No Laser</em>
        }
        return <LoadoutLaserChip canBeOn isOn laserCode={laserCode as MiningLaserEnum} />
      }}
    >
      <MenuItem
        value=""
        sx={{
          fontFamily: fontFamilies.robotoMono,
          fontSize: '1rem',
          border: `4px solid ${theme.palette.divider}`,
        }}
      >
        <em>Select None</em>
      </MenuItem>
      {laserChoices.map((key, idx) => (
        <MenuItem
          key={key}
          value={key}
          onMouseOut={() => onChange('', true, true)}
          onMouseOver={() => onChange(key, true, true)}
          sx={{
            backgroundColor:
              idx % 2 === 0 ? theme.palette.background.paper : lighten(theme.palette.background.paper, 0.05),
          }}
        >
          <LaserMenuItem laserCode={key} />
        </MenuItem>
      ))}
    </Select>
  )
}

export interface LaserMenuItemProps {
  laserCode: MiningLaserEnum
}

const LaserMenuItem: React.FC<LaserMenuItemProps> = ({ laserCode }) => {
  const theme = useTheme()
  const laser = LASERS[laserCode as MiningLaserEnum]
  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: '0.8rem' }}>
        <Box
          sx={{
            width: 80,
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            color: theme.palette.error.main,
          }}
        >
          {laser.name}
        </Box>
        <Box sx={{ width: 30, color: theme.palette.info.light }}>
          <ModuleIcon style={{ fontSize: 15 }} /> {laser.slots}
        </Box>
        <Box sx={{ width: 50, textAlign: 'right', fontFamily: fontFamilies.robotoMono }}>
          {MValueFormatter(laser.price, MValueFormat.currency_sm)}
        </Box>
        {statsOrder
          .filter(({ key }) => !LASER_NO_MENU_STAT.includes(key as keyof LaserLoadoutStats))
          .map(({ key, label, percent, unit, tooltip }) => (
            <NumberStat
              label={label}
              isPercent={percent}
              unit={unit}
              value={laser.stats[key as keyof LaserLoadoutStats]}
              reversed={BackwardStats.includes(key)}
            />
          ))}
      </Stack>
    </>
  )
}

export interface ModuleMenuItemProps {
  moduleCode: MiningModuleEnum
}

const ModuleMenuItem: React.FC<ModuleMenuItemProps> = ({ moduleCode }) => {
  const theme = useTheme()
  const module = MODULES[moduleCode as MiningModuleEnum]
  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          fontSize: '0.8rem',
        }}
      >
        <Box
          sx={{
            width: 60,
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            color: module.active ? theme.palette.primary.main : theme.palette.secondary.main,
          }}
        >
          {module.name}
        </Box>
        <Box sx={{ width: 60, fontFamily: fontFamilies.robotoMono, textAlign: 'right' }}>
          {MValueFormatter(module.price, MValueFormat.currency_sm)}
        </Box>
        {statsOrder
          .filter(
            ({ key }) =>
              !MODULE_NO_MENU_STAT.includes(key as keyof ModuleLoadoutStats) &&
              module.stats[key as keyof ModuleLoadoutStats] !== undefined
          )
          .map(({ key, label, percent, unit, tooltip }) => (
            <NumberStat
              label={label}
              isPercent={percent}
              unit={unit}
              value={module.stats[key as keyof ModuleLoadoutStats]}
              reversed={BackwardStats.includes(key)}
            />
          ))}
      </Stack>
    </>
  )
}
