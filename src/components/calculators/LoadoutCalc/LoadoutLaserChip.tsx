import React from 'react'
import { Chip, PaletteColor, Switch, useTheme } from '@mui/material'
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
      clickable
      onClickCapture={(e) => {
        e.stopPropagation()
        e.preventDefault()
        onToggle && onToggle(!isOn)
      }}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        onToggle && onToggle(!isOn)
      }}
      sx={{
        width: '100%',
        color: theme.palette.error.contrastText,
        boxShadow: isOn
          ? `0 0 4px 2px ${theme.palette.error.main}66, 0 0 10px 5px ${theme.palette.error.light}33`
          : undefined,
        backgroundColor: isOn ? theme.palette.error.main : theme.palette.error.dark,
        '&:hover': {
          backgroundColor: theme.palette.error.light,
        },
      }}
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
  let pColor: PaletteColor = theme.palette.error
  switch (module.category) {
    case 'A':
      pColor = theme.palette.primary
      break
    case 'P':
      pColor = theme.palette.secondary
      break
    case 'G':
      pColor = theme.palette.info
      break
    default:
      pColor = theme.palette.error
  }

  return (
    <Chip
      label={module.name}
      clickable={canBeOnFinal}
      sx={{
        width: '100%',
        color: pColor.contrastText,
        backgroundColor: isOn ? pColor.main : pColor.dark,
        '&:hover': {
          backgroundColor: canBeOnFinal ? pColor.light : undefined,
        },
      }}
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
