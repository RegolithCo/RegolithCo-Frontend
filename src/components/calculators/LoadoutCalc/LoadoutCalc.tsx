import React from 'react'
import {
  Box,
  Button,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import {
  LoadoutShipEnum,
  MiningGadgetEnum,
  MiningLoadout,
  MiningModuleEnum,
  UserProfile,
  calcLoadoutStats,
} from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { LoadoutModuleChip } from './LoadoutLaserChip'
import { Delete, Refresh, Save } from '@mui/icons-material'
import { noop } from 'lodash'
import { fontFamilies } from '../../../theme'
import { dummyUserProfile, newMiningLoadout } from '../../../lib/newObjectFactories'
import { DeleteModal } from '../../modals/DeleteModal'
import { LoadoutCalcStats } from './LoadoutCalcStats'
import { LoadoutLaserRow } from './LoadoutLaserRow'

export interface LoadoutCalcProps {
  miningLoadout?: MiningLoadout
  userProfile?: UserProfile
  onSave?: (newLoadout: MiningLoadout) => void
  onDelete?: () => void
}

const DEFAULT_SHIP = LoadoutShipEnum.Mole

export const LoadoutCalc: React.FC<LoadoutCalcProps> = ({ miningLoadout, userProfile, onSave, onDelete }) => {
  const theme = useTheme()
  const owner = userProfile || dummyUserProfile()
  const [newLoadout, setNewLoadout] = React.useState<MiningLoadout>(
    miningLoadout || newMiningLoadout(DEFAULT_SHIP, owner)
  )
  const [hoverLoadout, setHoverLoadout] = React.useState<MiningLoadout | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)
  const [includeStockPrices, setIncludeStockPrices] = React.useState(false)

  const stats = React.useMemo(() => {
    return calcLoadoutStats(hoverLoadout || newLoadout || miningLoadout)
  }, [miningLoadout, newLoadout, hoverLoadout])

  const activeLasers = newLoadout.activeLasers || []
  const laserSize = newLoadout.ship === LoadoutShipEnum.Mole ? 2 : 1

  const handleShipChange = (event: React.MouseEvent<HTMLElement>, newShip: LoadoutShipEnum) => {
    if (newShip === newLoadout.ship) return
    setNewLoadout(newMiningLoadout(newShip, owner))
  }

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
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        {/* Don't show the name if it's a new loadout */}
        <Typography variant="h5">
          {miningLoadout && miningLoadout.name ? miningLoadout.name : 'Loadout Calculator'}
        </Typography>
        <div style={{ flexGrow: 1 }} />
        <ToggleButtonGroup
          size="small"
          value={newLoadout.ship}
          exclusive
          onChange={handleShipChange}
          aria-label="text alignment"
        >
          <ToggleButton
            value={LoadoutShipEnum.Prospector}
            aria-label="centered"
            color="info"
            sx={{
              color: theme.palette.info.dark,
            }}
          >
            Prospector
          </ToggleButton>
          <ToggleButton
            value={LoadoutShipEnum.Mole}
            aria-label="right aligned"
            color="success"
            sx={{
              color: theme.palette.success.dark,
            }}
          >
            Mole
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Grid container>
        <Grid xs={12} sm={12} md={7} lg={8}>
          <Typography variant="h6">Lasers</Typography>
          <Typography variant="caption">Choose your ship's mounted lasers and components</Typography>

          <LoadoutLaserRow
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
              <LoadoutLaserRow
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
              <LoadoutLaserRow
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
          <LoadoutCalcStats stats={stats} />
        </Grid>
      </Grid>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setNewLoadout(miningLoadout || newMiningLoadout(newLoadout.ship as LoadoutShipEnum, owner))}
          startIcon={<Refresh />}
        >
          Reset
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Typography>
          Loadout Price:{' '}
          <span style={{ fontFamily: fontFamilies.robotoMono }}>
            {MValueFormatter(includeStockPrices ? stats.price : stats.priceNoStock, MValueFormat.currency_sm)}
          </span>
        </Typography>
        <FormControlLabel
          required
          control={
            <Switch
              size="small"
              checked={includeStockPrices}
              onChange={(e) => setIncludeStockPrices(e.target.checked)}
            />
          }
          label="Incl. Stock lasers"
        />
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
