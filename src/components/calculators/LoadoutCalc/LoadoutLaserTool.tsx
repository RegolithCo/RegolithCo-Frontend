import React from 'react'
import { Card, CardContent, CardHeader, Stack, Typography, useTheme } from '@mui/material'
import { ActiveMiningLaserLoadout, Maybe, MiningLaserEnum, MiningModuleEnum, lookups } from '@regolithco/common'
import { LaserChooserMenu, ModuleChooserMenu } from './loadoutMenus'

const LASERS = lookups.loadout.lasers
const GADGETS = lookups.loadout.gadgets
const MODULES = lookups.loadout.modules

export interface LoadoutLaserRowProps {
  activeLaser: Maybe<ActiveMiningLaserLoadout | null>
  laserSize: number
  label: string
  isShare?: boolean
  readonly?: boolean
  onChange: (laser: ActiveMiningLaserLoadout | null, hover: boolean) => void
}

export const LoadoutLaserTool: React.FC<LoadoutLaserRowProps> = ({
  activeLaser,
  laserSize,
  label,
  isShare,
  onChange,
  readonly,
}) => {
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
    if (laser === '') return onChange(null, hover)
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

  const onModuleChange = (slotIdx: number) => (module: MiningModuleEnum | '', isActive: boolean, hover: boolean) => {
    if (!hasLaser) return onChange(null, hover)
    const newModules = Array.from({ length: slots }).map((_, idx) => {
      if ((activeLaser?.modules || []).length <= idx) return null
      if (idx !== slotIdx) return activeLaser?.modules[idx] || null
      if (!module) return null
      return module
    })
    const thisModule = module ? MODULES[module] : null
    const newModulesActive = Array.from({ length: slots }).map((_, idx) => {
      const mapModule = activeLaser?.modules[idx] || null
      if (mapModule && idx !== slotIdx) {
        const arrModule = MODULES[mapModule as MiningModuleEnum]
        const value = Boolean(arrModule && activeLaser?.modulesActive[idx])
        if (
          // Only one active module can be on at a time on a laser
          value === true &&
          thisModule?.active &&
          arrModule.active &&
          thisModule?.code === arrModule.code
        )
          return false
        return value
      }

      if (!mapModule) return false

      const module = MODULES[mapModule as MiningModuleEnum]
      // Passive modules are alwaus active if the laser is
      if (laserIsActive && !module.active) return true

      return Boolean(laserIsActive && module.active && isActive)
    })
    // Now just check that this active m is the only one that's on
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
    <Card
      elevation={hasLaser && laserIsActive ? 8 : 1}
      sx={{
        //
        borderRadius: 4,
        height: '100%',
        minWidth: theme.spacing(25),
      }}
    >
      <CardHeader
        title={label}
        titleTypographyProps={{ variant: 'subtitle1' }}
        sx={{
          fontWeight: 'bold',
          fontSize: '1.2rem',
          px: 2,
          py: 0.5,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.grey[800],
        }}
      />
      <CardContent>
        <LaserChooserMenu
          laserSize={laserSize}
          readonly={readonly}
          isShare={isShare}
          value={laserCode || null}
          onChange={onLaserChange}
          isOn={laserIsActive}
        />
        {slots > 0 ? (
          <ModuleChooserMenu
            value={(activeModuleSelectValues[0] as MiningModuleEnum) || null}
            readonly={readonly}
            isOn={laserIsActive && activeLaser?.modulesActive[0]}
            isShare={isShare}
            locked={!laserIsActive}
            label="Module 1"
            onChange={onModuleChange(0)}
          />
        ) : (
          <ModulePlaceholder />
        )}
        {slots > 1 ? (
          <ModuleChooserMenu
            value={(activeModuleSelectValues[1] as MiningModuleEnum) || null}
            readonly={readonly}
            isOn={laserIsActive && activeLaser?.modulesActive[1]}
            isShare={isShare}
            locked={!laserIsActive}
            label="Module 2"
            onChange={onModuleChange(1)}
          />
        ) : (
          <ModulePlaceholder />
        )}
        {slots > 2 ? (
          <ModuleChooserMenu
            value={(activeModuleSelectValues[2] as MiningModuleEnum) || null}
            readonly={readonly}
            isOn={laserIsActive && activeLaser?.modulesActive[2]}
            isShare={isShare}
            locked={!laserIsActive}
            label="Module 3"
            onChange={onModuleChange(2)}
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
    <Stack direction="row" spacing={1} paddingBottom={2}>
      <Typography
        variant="overline"
        sx={{
          opacity: 0.5,
          width: '100%',
          textAlign: 'center',
          fontStyle: 'italic',
          color: theme.palette.text.disabled,
        }}
      >
        No Slot
      </Typography>
    </Stack>
  )
}
