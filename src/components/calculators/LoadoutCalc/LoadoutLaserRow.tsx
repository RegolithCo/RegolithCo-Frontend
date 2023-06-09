import React from 'react'
import { MenuItem, Select, Typography, useTheme } from '@mui/material'
import { ActiveMiningLaserLoadout, Maybe, MiningLaserEnum, MiningModuleEnum, lookups } from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { LoadoutLaserChip, LoadoutModuleChip } from './LoadoutLaserChip'

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
  const laserChoices: MiningLaserEnum[] = Object.keys(LASERS)
    .filter((key) => LASERS[key as MiningLaserEnum].size === laserSize)
    .map((l) => l as MiningLaserEnum)

  const activeModuleSelectValues: (MiningModuleEnum | string)[] = (activeLaser?.modules as MiningModuleEnum[]) || []
  while (activeModuleSelectValues.length < slots) {
    activeModuleSelectValues.push('')
  }
  return (
    <Grid container spacing={1}>
      <Grid xs={3}>
        <Select
          fullWidth
          variant="standard"
          value={laserCode}
          displayEmpty
          renderValue={(laserCode) => {
            if (!laserCode || laserCode.length === 0) {
              return <em>{label}</em>
            }
            return <LoadoutLaserChip laserCode={laserCode as MiningLaserEnum} isOn />
          }}
        >
          <MenuItem value="">
            <em>-- None -- </em>
          </MenuItem>
          {laserChoices.map((key, idx) => (
            <MenuItem
              key={`${key}-${idx}`}
              value={key}
              onMouseOut={() => onChange(null, true)}
              onMouseOver={() =>
                onChange(
                  {
                    modules: activeLaser?.modules || [],
                    laser: key,
                    __typename: 'ActiveMiningLaserLoadout',
                  },
                  true
                )
              }
            >
              {LASERS[key as MiningLaserEnum].name}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid xs={3}>
        {slots > 0 && (
          <Select
            fullWidth
            variant="standard"
            value={activeModuleSelectValues[0]}
            displayEmpty
            renderValue={(moduleCode) => {
              if (!moduleCode || moduleCode.length === 0) {
                return <Typography variant="caption">Slot 1 (empty)</Typography>
              }
              return <LoadoutModuleChip moduleCode={moduleCode as MiningModuleEnum} canBeOn />
            }}
            onChange={(e) => {
              const value = e.target.value
              const newModules = [...activeModuleSelectValues]
              newModules[0] = value
              onChange(
                {
                  modules: newModules.filter((d) => d.length > 0) as MiningModuleEnum[],
                  laser: laserCode,
                  __typename: 'ActiveMiningLaserLoadout',
                },
                false
              )
            }}
          >
            <MenuItem value="">
              <em>-- None -- </em>
            </MenuItem>
            {Object.keys(MODULES).map((key, idx) => (
              <MenuItem
                key={`${key}-${idx}`}
                value={key}
                onMouseOut={() => onChange(null, true)}
                onMouseOver={() =>
                  onChange(
                    {
                      laser: laserCode,
                      modules: [key as MiningModuleEnum, ...activeModuleSelectValues.slice(1)].filter(
                        (d) => d.length > 0
                      ) as MiningModuleEnum[],
                      __typename: 'ActiveMiningLaserLoadout',
                    },
                    true
                  )
                }
              >
                {MODULES[key as MiningModuleEnum].name}
              </MenuItem>
            ))}
          </Select>
        )}
      </Grid>
      <Grid xs={3}>
        {slots > 1 && (
          <Select
            fullWidth
            placeholder={'Slot 2'}
            variant="standard"
            value={activeModuleSelectValues[1]}
            displayEmpty
            renderValue={(moduleCode) => {
              if (!moduleCode || moduleCode.length === 0) {
                return <Typography variant="caption">Slot 2 (empty)</Typography>
              }
              return <LoadoutModuleChip moduleCode={moduleCode as MiningModuleEnum} canBeOn />
            }}
          >
            <MenuItem value="">
              <em>-- None -- </em>
            </MenuItem>
            {Object.keys(MODULES).map((key, idx) => (
              <MenuItem
                key={`${key}-${idx}`}
                value={key}
                onMouseOut={() => onChange(null, true)}
                onMouseOver={() =>
                  onChange(
                    {
                      laser: laserCode,
                      modules: [
                        activeModuleSelectValues[0],
                        key as MiningModuleEnum,
                        ...activeModuleSelectValues.slice(2),
                      ].filter((d) => d.length > 0) as MiningModuleEnum[],
                      __typename: 'ActiveMiningLaserLoadout',
                    },
                    true
                  )
                }
              >
                {MODULES[key as MiningModuleEnum].name}
              </MenuItem>
            ))}
          </Select>
        )}
      </Grid>
      <Grid xs={3}>
        {slots > 2 && (
          <Select
            fullWidth
            placeholder={'Slot 2'}
            variant="standard"
            value={activeModuleSelectValues[2]}
            displayEmpty
            renderValue={(moduleCode) => {
              if (!moduleCode || moduleCode.length === 0) {
                return <Typography variant="caption">Slot 3 (empty)</Typography>
              }
              return <LoadoutModuleChip moduleCode={moduleCode as MiningModuleEnum} canBeOn />
            }}
          >
            <MenuItem value="">
              <em>-- None -- </em>
            </MenuItem>
            {Object.keys(MODULES).map((key, idx) => (
              <MenuItem
                key={`${key}-${idx}`}
                value={key}
                onMouseOut={() => onChange(null, true)}
                onMouseOver={() =>
                  onChange(
                    {
                      laser: laserCode,
                      modules: [
                        activeModuleSelectValues[0],
                        activeModuleSelectValues[1],
                        key as MiningModuleEnum,
                      ].filter((d) => d.length > 0) as MiningModuleEnum[],
                      __typename: 'ActiveMiningLaserLoadout',
                    },
                    true
                  )
                }
              >
                {MODULES[key as MiningModuleEnum].name}
              </MenuItem>
            ))}
          </Select>
        )}
      </Grid>
    </Grid>
  )
}
