import React from 'react'
import { MenuItem, Select, Typography } from '@mui/material'
import { MiningLaserEnum, MiningModuleEnum, lookups } from '@regolithco/common'
import { LoadoutLaserChip, LoadoutModuleChip } from './LoadoutLaserChip'

const LASERS = lookups.loadout.lasers
const GADGETS = lookups.loadout.gadgets
const MODULES = lookups.loadout.modules

export interface ModuleChooserMenuProps {
  value: MiningModuleEnum | null
  onChange: (value: MiningModuleEnum | '', isHover: boolean) => void
  label: string
}

const NoneMenu: React.FC = () => (
  <MenuItem value="">
    <em>-- None -- </em>
  </MenuItem>
)

const baseProps: React.ComponentProps<typeof Select> = {
  fullWidth: true,
  variant: 'standard',
  displayEmpty: true,
}

export const ModuleChooserMenu: React.FC<ModuleChooserMenuProps> = ({ onChange, label, value }) => {
  return (
    <Select
      {...baseProps}
      value={value || ''}
      renderValue={(value) => {
        if (!value) {
          return <Typography variant="caption">{label} (empty)</Typography>
        }
        return <LoadoutModuleChip moduleCode={value as MiningModuleEnum} canBeOn />
      }}
    >
      <NoneMenu />
      {Object.keys(MODULES).map((key, idx) => (
        <MenuItem
          key={`${key}-${idx}`}
          value={key}
          onMouseOut={() => onChange('', true)}
          onMouseOver={() => onChange(key as MiningModuleEnum, true)}
        >
          {MODULES[key as MiningModuleEnum].name}
        </MenuItem>
      ))}
    </Select>
  )
}

export interface LaserChooserMenuProps {
  value: MiningLaserEnum | null
  onChange: (value: MiningLaserEnum | '', isHover: boolean) => void
  label: string
  laserSize: number
}

export const LaserChooserMenu: React.FC<LaserChooserMenuProps> = ({ onChange, label, value, laserSize }) => {
  const laserChoices: MiningLaserEnum[] = Object.keys(LASERS)
    .filter((key) => LASERS[key as MiningLaserEnum].size === laserSize)
    .map((l) => l as MiningLaserEnum)

  return (
    <Select
      {...baseProps}
      value={value}
      renderValue={(laserCode) => {
        if (!laserCode) {
          return <em>{label}</em>
        }
        return <LoadoutLaserChip laserCode={laserCode as MiningLaserEnum} isOn />
      }}
    >
      <NoneMenu />
      {laserChoices.map((key, idx) => (
        <MenuItem
          key={`${key}-${idx}`}
          value={key}
          onMouseOut={() => onChange('', true)}
          onMouseOver={() => onChange(key, true)}
        >
          {LASERS[key as MiningLaserEnum].name}
        </MenuItem>
      ))}
    </Select>
  )
}
