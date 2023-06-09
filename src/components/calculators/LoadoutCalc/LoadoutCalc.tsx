import React from 'react'
import { Box, Button, MenuItem, Paper, Select, Stack, Tooltip, Typography, useTheme } from '@mui/material'
import {
  ActiveMiningLaserLoadout,
  AllStats,
  BackwardStats,
  LoadoutShipEnum,
  Maybe,
  MiningGadgetEnum,
  MiningLaserEnum,
  MiningLoadout,
  MiningModuleEnum,
  UserProfile,
  calcLoadoutStats,
  lookups,
} from '@regolithco/common'
import { NumberStat } from './LoadoutStat'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { LoadoutLaserChip, LoadoutModuleChip } from './LoadoutLaserChip'
import { Delete, Refresh, Save } from '@mui/icons-material'
import { noop } from 'lodash'
import { fontFamilies } from '../../../theme'
import { dummyUserProfile, newMiningLoadout } from '../../../lib/newObjectFactories'
import { DeleteModal } from '../../modals/DeleteModal'

export interface LoadoutCalcProps {
  miningLoadout?: MiningLoadout
  userProfile?: UserProfile
  onSave?: (newLoadout: MiningLoadout) => void
  onDelete?: () => void
}

const LASERS = lookups.loadout.lasers
const GADGETS = lookups.loadout.gadgets
const MODULES = lookups.loadout.modules

const statsOrder: Record<string, { label: string; tooltip: string; percent?: boolean; unit?: string }> = {
  minPower: { label: 'Min Pwr', tooltip: 'Minimum Laser Power (All Active lasers combined)' },
  maxPower: { label: 'Max Pwr', tooltip: 'Maximum Laser Power (All active lasers combined)' },
  extrPower: { label: 'Ext Pwr', tooltip: 'Total extraction power (All Active lasers combined)' },
  optimumRange: {
    label: 'Opt Rng',
    percent: false,
    unit: 'm',
    tooltip: 'Optimum Range (Average for all active lasers)',
  },
  maxRange: { label: 'Max Rng', percent: false, unit: 'm', tooltip: 'Maximum Range (Average for all active lasers)' },
  resistance: { label: 'Resistance', percent: true, tooltip: 'Resistance Modifier' },
  instability: { label: 'Instability', percent: true, tooltip: 'Instability Modifier' },
  overchargeRate: { label: 'Overcharge', percent: true, tooltip: 'Overcharge Rate Modifier' },
  clusterMod: { label: 'Clust.', percent: true, tooltip: 'Cluster Modifier' },
  inertMaterials: { label: 'Inert', percent: true, tooltip: 'Inert Materials filtering' },
  optimalChargeRate: { label: 'Opt Chrg Rt', percent: true, tooltip: 'Optimal Charge Rate Modifier' },
  optimalChargeWindow: { label: 'Opt Chrg Wnd', percent: true, tooltip: 'Optimal Charge Window Modifier' },
  shatterDamage: { label: 'Shatter', percent: true, tooltip: 'Shatter Damage Modifier' },

  // minPowerPct: { label: 'Min Power %', percent: true },
  // extrPowerMod: { label: 'Extraction Power Mod', percent: true },
  // powerMod: { label: 'Power Mod', percent: true },
}

export const LoadoutCalc: React.FC<LoadoutCalcProps> = ({ miningLoadout, userProfile, onSave, onDelete }) => {
  const theme = useTheme()
  const owner = userProfile || dummyUserProfile()
  const [newLoadout, setNewLoadout] = React.useState<MiningLoadout>(miningLoadout || newMiningLoadout(owner))
  const [hoverLoadout, setHoverLoadout] = React.useState<MiningLoadout | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)

  const stats = React.useMemo(
    () => calcLoadoutStats(hoverLoadout || newLoadout || miningLoadout),
    [miningLoadout, newLoadout, hoverLoadout]
  )
  console.log('MARZIPAN', stats)
  const activeLasers = newLoadout.activeLasers || []
  const laserSize = newLoadout.ship === LoadoutShipEnum.Mole ? 2 : 1
  return (
    <Paper
      sx={{
        m: 3,
        bgcolor: 'background.paper',
        borderRadius: 10,
        border: `10px solid ${theme.palette.primary.main}`,
        boxShadow: 24,
        p: 4,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="h5">My Loadout #1</Typography>
        <div style={{ flexGrow: 1 }} />
        <Typography
          color="primary"
          sx={{
            px: 1,
            py: 0.5,
            fontFamily: fontFamilies.robotoMono,
            border: '3px solid',
            borderRadius: 2,
          }}
        >
          {newLoadout.ship}
        </Typography>
      </Stack>
      <Grid container>
        <Grid xs={12} sm={12} md={7} lg={8}>
          <Typography variant="h6">Laser Loadout</Typography>
          <Typography variant="caption">Choose your ship's mounted lasers and components</Typography>

          <LaserRow
            activeLaser={activeLasers[0]}
            laserSize={laserSize}
            label={laserSize < 2 ? 'Laser' : 'Center'}
            onChange={(activeLaser, isHover) => {
              if (isHover) {
                setHoverLoadout({
                  ...newLoadout,
                  activeLasers: [activeLaser, ...activeLasers.slice(1)],
                })
              } else {
                setNewLoadout({
                  ...newLoadout,
                  activeLasers: [activeLaser, ...activeLasers.slice(1)],
                })
              }
            }}
          />
          {newLoadout.ship === LoadoutShipEnum.Mole && (
            <>
              <LaserRow
                activeLaser={activeLasers[1]}
                laserSize={laserSize}
                label="Port"
                onChange={(activeLaser, isHover) => {
                  if (isHover) {
                    setHoverLoadout({
                      ...newLoadout,
                      activeLasers: [activeLasers[0], activeLaser, activeLasers[2]],
                    })
                  } else {
                    setNewLoadout({
                      ...newLoadout,
                      activeLasers: [activeLasers[0], activeLaser, activeLasers[2]],
                    })
                  }
                }}
              />
              <LaserRow
                activeLaser={activeLasers[2]}
                laserSize={laserSize}
                label="Starboard"
                onChange={(activeLaser, isHover) => {
                  if (isHover) {
                    setHoverLoadout({
                      ...newLoadout,
                      activeLasers: [activeLasers[0], activeLasers[1], activeLaser],
                    })
                  } else {
                    setNewLoadout({
                      ...newLoadout,
                      activeLasers: [activeLasers[0], activeLasers[1], activeLaser],
                    })
                  }
                }}
              />
            </>
          )}
          <Box sx={{ my: 2 }}>
            <Typography variant="h6">Ship Inventory</Typography>
            <Typography variant="caption">Gadgets and backup modules</Typography>
            <Grid container spacing={2}>
              <Grid xs={3}>
                <LoadoutModuleChip moduleCode={MiningGadgetEnum.Optimax} canBeOn onDelete={noop} />
              </Grid>
              <Grid xs={3}>
                <LoadoutModuleChip moduleCode={MiningGadgetEnum.Boremax} canBeOn onDelete={noop} />
              </Grid>
              <Grid xs={3}>
                <LoadoutModuleChip moduleCode={MiningModuleEnum.Brandt} canBeOn onDelete={noop} />
              </Grid>
              <Grid xs={3}>
                <LoadoutModuleChip moduleCode={MiningModuleEnum.Fltrxl} canBeOn onDelete={noop} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid xs={12} sm={12} md={5} lg={4}>
          <Box
            sx={{
              ml: 2,
              border: '4px solid black',
              backgroundColor: 'black',
              borderRadius: 4,
            }}
          >
            <Grid container>
              {Object.entries(statsOrder).map(([key, { label, percent, unit, tooltip }]) => (
                <Grid key={key} xs={3}>
                  <NumberStat
                    label={label}
                    percent={percent}
                    unit={unit}
                    tooltip={tooltip}
                    value={stats[key as keyof AllStats]}
                    reversed={BackwardStats.includes(key)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setNewLoadout(miningLoadout || newMiningLoadout(owner))}
          startIcon={<Refresh />}
        >
          Reset
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Typography>Loadout Price: {MValueFormatter(stats.price, MValueFormat.currency_sm)}</Typography>
        <div style={{ flexGrow: 1 }} />
        {onDelete && (
          <Tooltip title="Permanently delete this loadout">
            <Button variant="contained" onClick={onDelete} startIcon={<Delete />}>
              Save
            </Button>
          </Tooltip>
        )}
        <Tooltip title={!onSave || !userProfile ? 'Log in to save multiple loadouts' : 'Save Loadout'}>
          <Box>
            <Button
              disabled={!onSave}
              variant="contained"
              onClick={() => onSave && onSave(newLoadout)}
              startIcon={<Save />}
            >
              Save
            </Button>
          </Box>
        </Tooltip>
      </Stack>
      <DeleteModal
        onConfirm={() => onDelete && onDelete()}
        title="Delete Loadout"
        cancelBtnText="Cancel"
        confirmBtnText="Confirm"
        message="Are you sure you want to delete this loadout?"
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </Paper>
  )
}

export interface LaserRow {
  activeLaser: Maybe<ActiveMiningLaserLoadout>
  laserSize: number
  label: string
  onChange: (laser: ActiveMiningLaserLoadout | null, hover: boolean) => void
}

export const LaserRow: React.FC<LaserRow> = ({ activeLaser, laserSize, label, onChange }) => {
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
                  modules: newModules as MiningModuleEnum[],
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
                      modules: [key as MiningModuleEnum, ...activeModuleSelectValues.slice(1)] as MiningModuleEnum[],
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
                      ] as MiningModuleEnum[],
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
                      ] as MiningModuleEnum[],
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
