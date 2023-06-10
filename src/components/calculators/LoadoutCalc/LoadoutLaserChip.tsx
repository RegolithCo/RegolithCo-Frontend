import React from 'react'
import { Chip, PaletteColor, Switch, keyframes, useTheme } from '@mui/material'
import { MiningGadgetEnum, MiningLaserEnum, MiningModuleEnum, lookups } from '@regolithco/common'
import { Cancel } from '@mui/icons-material'
import { fontFamilies } from '../../../theme'

const LASERS = lookups.loadout.lasers
const GADGETS = lookups.loadout.gadgets
const MODULES = lookups.loadout.modules

export interface LoadoutLaserChipProps {
  laserCode: MiningLaserEnum
  isOn?: boolean
  canBeOn?: boolean
  onToggle?: (isOn: boolean) => void
  onDelete?: () => void
  isMenu?: boolean
}

export const LoadoutLaserChip: React.FC<LoadoutLaserChipProps> = ({
  laserCode,
  isOn,
  onDelete,
  onToggle,
  isMenu,
  canBeOn,
}) => {
  const theme = useTheme()
  const laser = LASERS[laserCode]
  return (
    <Chip
      label={laser.name}
      clickable
      size="medium"
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
        display: 'flex',
        width: '100%',
        color: theme.palette.error.contrastText,
        fontWeight: 'bold',
        fontFamily: fontFamilies.robotoMono,
        borderRadius: 3,
        boxShadow: isOn
          ? `0 0 4px 2px ${theme.palette.error.main}66, 0 0 10px 5px ${theme.palette.error.light}33`
          : undefined,
        backgroundColor: isOn ? theme.palette.error.main : theme.palette.error.dark,
        '& .MuiChip-label': {
          flex: '1 1',
        },
        '&:hover': {
          backgroundColor: theme.palette.error.light,
        },
      }}
      icon={
        <Switch
          checked={isOn}
          color="default"
          disabled={!canBeOn}
          sx={{ flexGrow: 0, opacity: canBeOn ? 1 : 0 }}
          size="small"
          onChange={(e) => onToggle && onToggle(e.target.checked)}
        />
      }
      onDelete={onDelete}
      deleteIcon={<Cancel />}
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

const pulse = (color: PaletteColor) => keyframes`
0% { 
  box-shadow: 0 0 0 0 transparent; 
  background-color: ${color.dark} 
}
50% { 
  box-shadow: 0 0 10px 10px  ${color.light}44; 
  background-color: ${color.light} 
}
100% { 
  box-shadow: 0 0 0 0 transparent; 
  background-color:  ${color.dark}
}
`

export const LoadoutModuleChip: React.FC<LoadoutModuleChipProps> = ({
  moduleCode,
  isOn,
  canBeOn,
  onToggle,
  onDelete,
}) => {
  const theme = useTheme()
  const module = MODULES[moduleCode as MiningModuleEnum] || GADGETS[moduleCode as MiningGadgetEnum]
  const canBeOnFinal = (canBeOn && module.category === 'A') || (canBeOn && module.category === 'G')
  const isPulsing = isOn && canBeOnFinal && module.category !== 'P'

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
      size="medium"
      onClick={(e) => onToggle && canBeOnFinal && onToggle(!isOn)}
      sx={{
        display: 'flex',
        width: '100%',
        fontWeight: 'bold',
        borderRadius: 3,
        fontFamily: fontFamilies.robotoMono,
        color: pColor.contrastText,
        boxShadow: isOn ? `0 0 4px 2px ${pColor.main}66, 0 0 10px 5px ${pColor.light}33` : undefined,
        backgroundColor: isOn ? pColor.main : pColor.dark,
        animation: isPulsing ? `${pulse(pColor)} 1s infinite` : '',
        '& .MuiChip-label': {
          flex: '1 1',
        },
        '&:hover': {
          backgroundColor: canBeOnFinal ? pColor.light : undefined,
        },
      }}
      icon={
        <Switch
          color="default"
          size="small"
          checked={isOn}
          disabled={!canBeOnFinal}
          sx={{ flexGrow: 0, opacity: canBeOnFinal ? 1 : 0 }}
          onChange={(e) => onToggle && onToggle(e.target.checked)}
        />
      }
      onDelete={onDelete}
      deleteIcon={<Cancel />}
    />
  )
}
