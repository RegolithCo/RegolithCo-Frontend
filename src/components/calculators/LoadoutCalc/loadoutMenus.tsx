import React, { useContext, useRef } from 'react'
import { Box, ListSubheader, MenuItem, Select, Stack, Typography, lighten, useTheme } from '@mui/material'
import {
  AllStats,
  BackwardStats,
  LaserLoadoutStats,
  MiningGadgetEnum,
  MiningLaserEnum,
  MiningModuleEnum,
  ModuleLoadoutStats,
  MiningModule,
  LoadoutLookup,
} from '@regolithco/common'
import { LoadoutLaserChip, LoadoutModuleChip } from './LoadoutLaserChip'
import { LoadoutStat } from './LoadoutStat'
import { toolMenuStatsOrder } from './LoadoutCalcStats'
import { ModuleIcon } from '../../../icons/Module'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { fontFamilies } from '../../../theme'
import { LookupsContext } from '../../../context/lookupsContext'

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
  // 'minPower',
  // 'minPowerPct',
  // 'maxPower',
  // 'maxRange',
  // 'optimumRange',
  // 'clusterMod',
  // 'extrPower',
  // 'extrPowerMod',
]

export interface ModuleChooserMenuProps {
  value: MiningModuleEnum | null
  isOn?: boolean
  locked?: boolean
  isShare?: boolean
  readonly?: boolean
  onChange: (value: MiningModuleEnum | '', isActive: boolean, isHover: boolean) => void
  onClose: (isChanged: boolean) => void
  label: string
}

export const ModuleChooserMenu: React.FC<ModuleChooserMenuProps> = ({
  onChange,
  onClose,
  value,
  isOn,
  locked,
  isShare,
  label,
  readonly,
}) => {
  const theme = useTheme()
  const dataStore = useContext(LookupsContext)
  const loadoutLookups = dataStore.getLookup('loadout') as LoadoutLookup

  if (!loadoutLookups || !dataStore.ready) return <div>Loading...</div>

  const activeModules: MiningModuleEnum[] = Object.keys(loadoutLookups.modules)
    .filter((key) => loadoutLookups.modules[key as MiningModuleEnum].active)
    .map((key) => key as MiningModuleEnum)
  const passiveModules: MiningModuleEnum[] = Object.keys(loadoutLookups.modules)
    .filter((key) => !loadoutLookups.modules[key as MiningModuleEnum].active)
    .map((key) => key as MiningModuleEnum)
  // Sort first by size then by name
  activeModules.sort((a, b) => {
    const aMod = loadoutLookups.modules[a as MiningModuleEnum]
    const bMod = loadoutLookups.modules[b as MiningModuleEnum]
    // Now sort alphabetically by name
    if (aMod.name > bMod.name) return 1
    if (aMod.name < bMod.name) return -1
    return 0
  })
  passiveModules.sort((a, b) => {
    const aMod = loadoutLookups.modules[a as MiningModuleEnum]
    const bMod = loadoutLookups.modules[b as MiningModuleEnum]
    // Now sort alphabetically by name
    if (aMod.name > bMod.name) return 1
    if (aMod.name < bMod.name) return -1
    return 0
  })

  const isChanged = useRef(false)
  const isOpen = useRef(false)

  const moduleKeys: MiningModuleEnum[] = Object.keys(loadoutLookups.modules).map((key) => key as MiningModuleEnum)
  return (
    <Stack direction="row" spacing={1} paddingBottom={2}>
      {value && (
        <LoadoutModuleChip
          canBeOn
          isOn={isOn}
          locked={locked}
          readonly={readonly}
          moduleCode={value as MiningModuleEnum | MiningGadgetEnum}
          onToggle={(isOn: boolean) => onChange(value, isOn, false)}
          onDelete={() => onChange('', true, false)}
        />
      )}
      {!isShare && !readonly && (
        <Select
          {...baseProps}
          disabled={readonly}
          value={value || ''}
          sx={{
            minWidth: value ? 0 : undefined,
            width: value ? 20 : undefined,
          }}
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
          onOpen={() => (isOpen.current = true)}
          onChange={(e) => {
            onChange(e.target.value as MiningModuleEnum, true, false)
            isChanged.current = true
          }}
          onClose={() => {
            isOpen.current = false
            onClose(isChanged.current)
            isChanged.current = false
          }}
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
                  {readonly ? 'No Module Mounted' : `CHOOSE ${label}`}
                </Typography>
              )
            }
            return <div />
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
          {activeModules.reduce((acc, key, idx) => {
            const module = loadoutLookups.modules[key as MiningModuleEnum] as MiningModule
            if (!module.active) return acc
            return [
              ...acc,
              <MenuItem
                key={key}
                sx={{
                  backgroundColor:
                    idx % 2 === 0 ? theme.palette.background.paper : lighten(theme.palette.background.paper, 0.05),
                }}
                value={module.code}
                onMouseOut={() => {
                  if (isOpen.current) onChange('', true, true)
                }}
                onMouseOver={() => {
                  if (isOpen.current) onChange(module.code as MiningModuleEnum, true, true)
                }}
              >
                <ModuleMenuItem moduleCode={key} />
              </MenuItem>,
            ]
          }, [] as React.ReactNode[])}
          <ListSubheader
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            Passive Modules
          </ListSubheader>
          {passiveModules.reduce((acc, key, idx) => {
            const module = loadoutLookups.modules[key as MiningModuleEnum] as MiningModule
            if (module.active) return acc
            return [
              ...acc,
              <MenuItem
                key={key}
                sx={{
                  backgroundColor:
                    idx % 2 === 0 ? theme.palette.background.paper : lighten(theme.palette.background.paper, 0.05),
                }}
                value={module.code}
                onMouseOut={() => {
                  if (isOpen.current) onChange('', true, true)
                }}
                onMouseOver={() => {
                  if (isOpen.current) onChange(module.code as MiningModuleEnum, true, true)
                }}
              >
                <ModuleMenuItem moduleCode={key} />
              </MenuItem>,
            ]
          }, [] as React.ReactNode[])}
        </Select>
      )}
    </Stack>
  )
}

export interface LaserChooserMenuProps {
  value: MiningLaserEnum | null
  isOn?: boolean
  isShare?: boolean
  onChange: (value: MiningLaserEnum | '', isActive: boolean, isHover: boolean) => void
  onClose: (isChanged: boolean) => void
  readonly?: boolean
  laserSize: number
}

const LASER_NO_MENU_STAT: (keyof AllStats)[] = ['shatterDamage', 'overchargeRate', 'clusterMod', 'extrPower']

export const LaserChooserMenu: React.FC<LaserChooserMenuProps> = ({
  onChange,
  onClose,
  value,
  laserSize,
  isOn,
  isShare,
  readonly,
}) => {
  const theme = useTheme()
  const dataStore = useContext(LookupsContext)
  const loadoutLookups = dataStore.getLookup('loadout') as LoadoutLookup
  if (!dataStore.ready) return null

  const laserChoices: MiningLaserEnum[] = Object.keys(loadoutLookups.lasers)
    .filter((key) => laserSize >= loadoutLookups.lasers[key as MiningLaserEnum].size)
    // .filter((key) => laserSize === LASERS[key as MiningLaserEnum].size)
    .map((l) => l as MiningLaserEnum)
  // Sort first by size then by name
  laserChoices.sort((a, b) => {
    const laserA = loadoutLookups.lasers[a]
    const laserB = loadoutLookups.lasers[b]
    if (laserA.size < laserB.size) return 1
    if (laserA.size > laserB.size) return -1
    if (laserA.name > laserB.name) return 1
    if (laserA.name < laserB.name) return -1
    return 0
  })

  const isChanged = useRef(false)
  const isOpen = useRef(false)

  return (
    <Stack direction="row" spacing={1} paddingBottom={2}>
      {value && (
        <LoadoutLaserChip
          canBeOn
          isOn={isOn}
          readonly={readonly}
          laserCode={value as MiningLaserEnum}
          onToggle={(isOn: boolean) => onChange(value, isOn, false)}
          onDelete={() => onChange('', true, false)}
        />
      )}
      {!isShare && !readonly && (
        <Select
          {...baseProps}
          disabled={readonly}
          value={value || ''}
          sx={{
            minWidth: value ? 0 : undefined,
            width: value ? 20 : undefined,
          }}
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
          onOpen={() => (isOpen.current = true)}
          onChange={(e) => {
            onChange(e.target.value as MiningLaserEnum, true, false)
            isChanged.current = true
          }}
          onClose={() => {
            isOpen.current = false
            onClose(isChanged.current)
            isChanged.current = false
          }}
          renderValue={(laserCode) => {
            if (!laserCode) {
              return (
                <Typography
                  component="div"
                  variant="overline"
                  sx={{
                    textAlign: 'center',
                    fontStyle: 'italic',
                  }}
                >
                  {readonly ? 'No Laser Mounted' : 'Choose a laser'}
                </Typography>
              )
            }
            return <div />
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
          {laserChoices.reduce((acc, key, idx) => {
            const thisLaser = loadoutLookups.lasers[key as MiningLaserEnum]
            const lastLaserKey = idx > 0 ? (laserChoices[idx - 1] as MiningLaserEnum) : null

            const showSubheader =
              (laserSize > 1 && idx === 0) ||
              (lastLaserKey && thisLaser.size !== loadoutLookups.lasers[lastLaserKey as MiningLaserEnum].size)

            if (showSubheader)
              acc.push(
                <ListSubheader
                  key={`passive-subheader-${key}-${idx}`}
                  sx={{
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                  }}
                >
                  Size {loadoutLookups.lasers[key as MiningLaserEnum].size} Mining Lasers
                </ListSubheader>
              )
            acc.push(
              <MenuItem
                key={`menu${key}-${idx}`}
                value={key}
                onMouseOut={() => {
                  if (isOpen.current) onChange('', true, true)
                }}
                onMouseOver={() => {
                  if (isOpen.current) onChange(key, true, true)
                }}
                sx={{
                  backgroundColor:
                    idx % 2 === 0 ? theme.palette.background.paper : lighten(theme.palette.background.paper, 0.05),
                }}
              >
                <LaserMenuItem laserCode={key} />
              </MenuItem>
            )
            return acc
          }, [] as React.ReactNode[])}
        </Select>
      )}
    </Stack>
  )
}

export interface LaserMenuItemProps {
  laserCode: MiningLaserEnum
}

export const LaserMenuItem: React.FC<LaserMenuItemProps> = ({ laserCode }) => {
  const theme = useTheme()
  const dataStore = useContext(LookupsContext)
  const loadoutLookups = dataStore.getLookup('loadout') as LoadoutLookup
  if (!dataStore.ready) return null
  const laser = loadoutLookups.lasers[laserCode as MiningLaserEnum]
  const allPrices = (Object.values(laser.prices).filter((price) => price > 0) as number[]) || [0]
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : null

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
          {minPrice !== null ? MValueFormatter(minPrice, MValueFormat.currency_sm) : '--'}
        </Box>
        {toolMenuStatsOrder
          .filter(({ key }) => !LASER_NO_MENU_STAT.includes(key as keyof LaserLoadoutStats))
          .map(({ key, label, percent, unit, tooltip }, idx) => (
            <LoadoutStat
              label={label}
              key={`lmi-${key}-${idx}`}
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
  moduleCode: MiningModuleEnum | MiningGadgetEnum
}

export const ModuleMenuItem: React.FC<ModuleMenuItemProps> = ({ moduleCode }) => {
  const theme = useTheme()
  const dataStore = useContext(LookupsContext)
  const loadoutLookups = dataStore.getLookup('loadout') as LoadoutLookup
  if (!dataStore.ready) return null
  const module =
    loadoutLookups.modules[moduleCode as MiningModuleEnum] || loadoutLookups.gadgets[moduleCode as MiningGadgetEnum]
  if (!module) return null
  const isGadget = module.category === 'G'
  const allPrices = (Object.values(module.prices).filter((price) => price > 0) as number[]) || [0]
  const minPrice = Math.min(...allPrices)
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
            color: isGadget
              ? theme.palette.info.main
              : module.active
                ? theme.palette.primary.main
                : theme.palette.secondary.main,
          }}
        >
          {module.name}
        </Box>
        <Box sx={{ width: 60, fontFamily: fontFamilies.robotoMono, textAlign: 'right' }}>
          {MValueFormatter(minPrice, MValueFormat.currency_sm)}
        </Box>
        {toolMenuStatsOrder
          .filter(
            ({ key }) =>
              !MODULE_NO_MENU_STAT.includes(key as keyof ModuleLoadoutStats) &&
              module.stats[key as keyof ModuleLoadoutStats] !== undefined &&
              module.stats[key as keyof ModuleLoadoutStats] !== 1
          )
          .map(({ key, label, percent, unit, tooltip }) => (
            <LoadoutStat
              label={label}
              isPercent={percent}
              key={key}
              unit={unit}
              value={module.stats[key as keyof ModuleLoadoutStats]}
              reversed={BackwardStats.includes(key)}
            />
          ))}
      </Stack>
    </>
  )
}
