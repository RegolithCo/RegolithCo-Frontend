import React, { useContext, useRef } from 'react'
import { Card, CardContent, CardHeader, Stack, Typography, useTheme } from '@mui/material'
import { ActiveMiningLaserLoadout, LoadoutLookup, Maybe, MiningLaserEnum, MiningModuleEnum } from '@regolithco/common'
import { LaserChooserMenu, ModuleChooserMenu } from './loadoutMenus'
import { LookupsContext } from '../../../context/lookupsContext'

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

  const dataStore = useContext(LookupsContext)
  const loadoutLookups = dataStore.getLookup('loadout') as LoadoutLookup

  const hasLaser = Boolean(activeLaser && activeLaser.laser)
  const laserCode = activeLaser?.laser
  const laserIsActive = activeLaser?.laserActive
  // const laser = hasLaser ? loadoutLookups.lasers[laserCode as MiningLaserEnum] : undefined
  const slots = hasLaser ? loadoutLookups.lasers[activeLaser?.laser as MiningLaserEnum].slots : 0

  const activeModuleSelectValues: (MiningModuleEnum | string)[] = (activeLaser?.modules as MiningModuleEnum[]) || []
  while (activeModuleSelectValues.length < slots) {
    activeModuleSelectValues.push('')
  }

  const previousLoadout = useRef(activeLaser)

  const onLaserChange = (laser: MiningLaserEnum | '', isActive: boolean, hover: boolean) => {
    if (laser === '') return onChange(hover ? previousLoadout.current : null, hover)
    const loadout: ActiveMiningLaserLoadout = {
      laser: laser as MiningLaserEnum,
      laserActive: isActive,
      modules: activeLaser?.modules || [],
      modulesActive: activeLaser?.modulesActive || [],
      __typename: 'ActiveMiningLaserLoadout',
    }
    onChange(loadout, hover)
    // If loadout actually changed, update previous loadout value
    if (!hover) previousLoadout.current = loadout
  }

  const onLaserClose = (isChanged: boolean) => {
    if (!isChanged) onChange(previousLoadout.current, false)
  }

  const onModuleChange = (slotIdx: number) => (module: MiningModuleEnum | '', isActive: boolean, hover: boolean) => {
    if (!hasLaser) return onChange(null, hover)
    if (module === '' && hover) return onChange(previousLoadout.current, hover)

    // If the laser is off, we can't change the modules
    const newModules = Array.from({ length: slots }).map((_, idx) => {
      if ((activeLaser?.modules || []).length <= idx) return null
      if (idx !== slotIdx) return activeLaser?.modules[idx] || null
      if (!module) return null
      return module
    })
    // const thisModule = module ? loadoutLookups.modules[module] : null
    const newModulesActive = Array.from({ length: slots }).map((_, idx) => {
      // const thisModule = activeLaser?.modules[idx] || null
      const thisActive = activeLaser?.modulesActive[idx] || false
      if (idx !== slotIdx) return thisActive
      else return isActive
    })
    const loadout: ActiveMiningLaserLoadout = {
      laser: laserCode as MiningLaserEnum,
      laserActive: laserIsActive || false,
      modules: newModules,
      modulesActive: newModulesActive,
      __typename: 'ActiveMiningLaserLoadout',
    }
    // Now just check that this active m is the only one that's on
    onChange(loadout, hover)
    // If loadout actually changed, update previous loadout value
    if (!hover) previousLoadout.current = loadout
  }

  const onModuleClose = (isChanged: boolean) => {
    if (!isChanged) onChange(previousLoadout.current, false)
  }

  if (!dataStore.ready) return null
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
          onClose={onLaserClose}
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
            onClose={onModuleClose}
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
            onClose={onModuleClose}
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
            onClose={onModuleClose}
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
