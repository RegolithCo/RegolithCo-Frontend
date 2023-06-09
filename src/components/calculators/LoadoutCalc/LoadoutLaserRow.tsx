import React from 'react'
import { MenuItem, Select, Typography, useTheme } from '@mui/material'
import { ActiveMiningLaserLoadout, Maybe, MiningLaserEnum, MiningModuleEnum, lookups } from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { LoadoutLaserChip, LoadoutModuleChip } from './LoadoutLaserChip'
import { LaserChooserMenu, ModuleChooserMenu } from './loadoutMenus'

const LASERS = lookups.loadout.lasers
const GADGETS = lookups.loadout.gadgets
const MODULES = lookups.loadout.modules

export interface LoadoutLaserRowProps {
  activeLaser: Maybe<ActiveMiningLaserLoadout>
  laserSize: number
  label: string
  onChange: (laser: ActiveMiningLaserLoadout | null, hover: boolean) => void
}

export const LoadoutLaserRow: React.FC<LoadoutLaserRowProps> = ({ activeLaser, laserSize, label, onChange }) => {
  const theme = useTheme()
  const hasLaser = Boolean(activeLaser && activeLaser.laser)
  const laserCode = activeLaser?.laser
  const laser = hasLaser ? LASERS[laserCode as MiningLaserEnum] : undefined
  const slots = hasLaser ? LASERS[activeLaser?.laser as MiningLaserEnum].slots : 0

  const activeModuleSelectValues: (MiningModuleEnum | string)[] = (activeLaser?.modules as MiningModuleEnum[]) || []
  while (activeModuleSelectValues.length < slots) {
    activeModuleSelectValues.push('')
  }

  const onLaserChange = (laser: MiningLaserEnum | '', hover: boolean) => {
    onChange(
      {
        laser: laser !== '' ? laser : null,
        modules: activeLaser?.modules || [],
        __typename: 'ActiveMiningLaserLoadout',
      },
      hover
    )
  }

  const onModuleChange = (laser: MiningModuleEnum | '', hover: boolean) => {
    onChange(
      {
        laser: laserCode,
        modules: [activeModuleSelectValues[0], activeModuleSelectValues[1], laser as MiningModuleEnum].filter(
          (d) => d && d.length > 0
        ) as MiningModuleEnum[],
        __typename: 'ActiveMiningLaserLoadout',
      },
      hover
    )
  }

  return (
    <Grid container spacing={1}>
      <Grid xs={3}>
        <LaserChooserMenu label={label} laserSize={laserSize} value={laserCode || null} onChange={onLaserChange} />
      </Grid>
      <Grid xs={3}>
        {slots > 0 && (
          <ModuleChooserMenu
            value={(activeModuleSelectValues[0] as MiningModuleEnum) || null}
            onChange={onModuleChange}
            label={'Slot 1'}
          />
        )}
      </Grid>
      <Grid xs={3}>
        {slots > 1 && (
          <ModuleChooserMenu
            value={(activeModuleSelectValues[1] as MiningModuleEnum) || null}
            onChange={onModuleChange}
            label={'Slot 2'}
          />
        )}
      </Grid>
      <Grid xs={3}>
        {slots > 2 && (
          <ModuleChooserMenu
            value={(activeModuleSelectValues[2] as MiningModuleEnum) || null}
            onChange={onModuleChange}
            label={'Slot 3'}
          />
        )}
      </Grid>
    </Grid>
  )
}
