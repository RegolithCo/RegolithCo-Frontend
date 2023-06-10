import React from 'react'
import { Card, CardContent, CardHeader, Typography, useTheme } from '@mui/material'
import { ActiveMiningLaserLoadout, Maybe, MiningLaserEnum, MiningModuleEnum, lookups } from '@regolithco/common'
import { LaserChooserMenu, ModuleChooserMenu } from './loadoutMenus'

const LASERS = lookups.loadout.lasers
const GADGETS = lookups.loadout.gadgets
const MODULES = lookups.loadout.modules

export interface LoadoutLaserRowProps {
  activeLaser: Maybe<ActiveMiningLaserLoadout | null>
  laserSize: number
  label: string
  onChange: (laser: ActiveMiningLaserLoadout | null, hover: boolean) => void
}

export const LoadoutLaserTool: React.FC<LoadoutLaserRowProps> = ({ activeLaser, laserSize, label, onChange }) => {
  const theme = useTheme()
  const hasLaser = Boolean(activeLaser && activeLaser.laser)
  const laserCode = activeLaser?.laser
  const laserIsActive = activeLaser?.laserActive
  const laser = hasLaser ? LASERS[laserCode as MiningLaserEnum] : undefined
  const slots = hasLaser ? LASERS[activeLaser?.laser as MiningLaserEnum].slots : 0

  const activeModuleSelectValues: (MiningModuleEnum | string)[] = (activeLaser?.modules as MiningModuleEnum[]) || []
  while (activeModuleSelectValues.length < slots) {
    activeModuleSelectValues.push('')
  }

  const onLaserChange = (laser: MiningLaserEnum | '', isActive: boolean, hover: boolean) => {
    if (laser !== '') onChange(null, hover)
    onChange(
      {
        laser: laser as MiningLaserEnum,
        laserActive: isActive,
        modules: activeLaser?.modules || [],
        modulesActive: activeLaser?.modulesActive || [],
        __typename: 'ActiveMiningLaserLoadout',
      },
      hover
    )
  }

  const onModuleChange = (module: MiningModuleEnum | '', slotIdx: number, isActive: boolean, hover: boolean) => {
    if (!hasLaser) return onChange(null, hover)
    const newModules = Array.from({ length: slots }).map((_, idx) => {
      if ((activeLaser?.modules || []).length <= idx) return null
      if (idx !== slotIdx) return activeLaser?.modules[idx] || null
      if (!module) return null
      return module
    })
    const newModulesActive = Array.from({ length: slots }).map((_, idx) => {
      if (idx !== slotIdx)
        return (activeLaser?.modulesActive || []).length > idx ? Boolean(activeLaser?.modulesActive[idx]) : false

      const moduleCode = activeLaser?.modules[idx] || null
      const module = moduleCode ? MODULES[moduleCode as MiningModuleEnum] : null

      return Boolean(laserIsActive && module && (module.active || isActive))
    })
    onChange(
      {
        laser: laserCode as MiningLaserEnum,
        laserActive: laserIsActive || false,
        modules: newModules,
        modulesActive: newModulesActive,
        __typename: 'ActiveMiningLaserLoadout',
      },
      hover
    )
  }

  return (
    <Card sx={{ borderRadius: 5, height: '100%' }}>
      <CardHeader title={label} />
      <CardContent>
        <LaserChooserMenu laserSize={laserSize} value={laserCode || null} onChange={onLaserChange} />
        {slots > 0 ? (
          <ModuleChooserMenu
            value={(activeModuleSelectValues[0] as MiningModuleEnum) || null}
            label="Module 1"
            onChange={onModuleChange}
          />
        ) : (
          <ModulePlaceholder />
        )}
        {slots > 1 ? (
          <ModuleChooserMenu
            value={(activeModuleSelectValues[1] as MiningModuleEnum) || null}
            label="Module 2"
            onChange={onModuleChange}
          />
        ) : (
          <ModulePlaceholder />
        )}
        {slots > 2 ? (
          <ModuleChooserMenu
            value={(activeModuleSelectValues[2] as MiningModuleEnum) || null}
            label="Module 3"
            onChange={onModuleChange}
          />
        ) : (
          <ModulePlaceholder />
        )}
      </CardContent>
    </Card>
  )
}

const ModulePlaceholder: React.FC = () => {
  const theme = useTheme()
  return (
    <Typography
      component="div"
      sx={{
        textAlign: 'center',
        fontStyle: 'italic',
        color: theme.palette.text.disabled,
      }}
    >
      No Slot
    </Typography>
  )
}
