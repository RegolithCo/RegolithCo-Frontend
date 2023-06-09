import React from 'react'
import { Chip, ChipProps, Switch, useTheme } from '@mui/material'
import { MiningGadgetEnum, MiningLaserEnum, MiningModuleEnum, lookups } from '@regolithco/common'
import { Delete } from '@mui/icons-material'

const LASERS = lookups.loadout.lasers
const GADGETS = lookups.loadout.gadgets
const MODULES = lookups.loadout.modules

export interface LoadoutLaserChipProps {
  laserCode: MiningLaserEnum
  isOn?: boolean
  onToggle?: (isOn: boolean) => void
  onDelete?: () => void
  isMenu?: boolean
}

export const LoadoutLaserChip: React.FC<LoadoutLaserChipProps> = ({ laserCode, isOn, onDelete, onToggle, isMenu }) => {
  const theme = useTheme()
  const laser = LASERS[laserCode]
  return (
    <Chip
      label={laser.name}
      color="error"
      clickable
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        onToggle && onToggle(!isOn)
      }}
      sx={{ width: '100%' }}
      size="small"
      icon={
        !isMenu ? (
          <Switch checked={isOn} size="small" onChange={(e) => onToggle && onToggle(e.target.checked)} />
        ) : undefined
      }
      onDelete={onDelete}
      deleteIcon={<Delete />}
    />
  )
}

export interface LoadoutModuleChipProps {
  moduleCode: MiningGadgetEnum | MiningModuleEnum
  isOn?: boolean
  canBeOn?: boolean
  onToggle?: (isOn: boolean) => void
  onDelete?: () => void
}

export const LoadoutModuleChip: React.FC<LoadoutModuleChipProps> = ({
  moduleCode,
  isOn,
  canBeOn,
  onToggle,
  onDelete,
}) => {
  const theme = useTheme()
  const module = MODULES[moduleCode as MiningModuleEnum] || GADGETS[moduleCode as MiningGadgetEnum]
  const canBeOnFinal = (canBeOn && module.category === 'A') || module.category === 'G'
  let color: ChipProps['color'] = 'error'
  switch (module.category) {
    case 'A':
      color = 'primary'
      break
    case 'P':
      color = 'secondary'
      break
    case 'G':
      color = 'info'
      break
  }
  console.log('color', color)
  return (
    <Chip
      label={module.name}
      color={color}
      sx={{ width: '100%' }}
      size="small"
      icon={
        canBeOnFinal ? (
          <Switch
            color="default"
            size="small"
            checked={isOn}
            onChange={(e) => onToggle && onToggle(e.target.checked)}
          />
        ) : undefined
      }
      onDelete={onDelete}
      deleteIcon={<Delete />}
    />
  )
}
