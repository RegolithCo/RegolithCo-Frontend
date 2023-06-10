import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  PaletteColor,
  Stack,
  Switch,
  SxProps,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'
import {
  LoadoutShipEnum,
  MiningGadgetEnum,
  MiningLoadout,
  MiningModuleEnum,
  UserProfile,
  calcLoadoutStats,
  sanitizeLoadout,
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
import { LoadoutLaserTool } from './LoadoutLaserTool'

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
    const loadout = hoverLoadout || newLoadout || miningLoadout
    if (!loadout) return null
    const sanitizedLoadout = sanitizeLoadout(loadout)
    return calcLoadoutStats(sanitizedLoadout)
  }, [miningLoadout, newLoadout, hoverLoadout])

  const activeLasers = newLoadout.activeLasers || []
  const laserSize = newLoadout.ship === LoadoutShipEnum.Mole ? 2 : 1

  const handleShipChange = (event: React.MouseEvent<HTMLElement>, newShip: LoadoutShipEnum) => {
    if (newShip === newLoadout.ship || !newShip) return
    setNewLoadout(newMiningLoadout(newShip, owner))
  }

  return (
    <Card
      elevation={6}
      sx={{
        m: 3,
        backgroundColor: theme.palette.background.default,
        borderRadius: 10,
        border: `10px solid ${theme.palette.secondary.light}`,
        // border: `1px solid #444444`,
        boxShadow: 24,
        mb: 6,
      }}
    >
      <CardHeader
        sx={{
          color: theme.palette.secondary.contrastText,
          backgroundColor: theme.palette.secondary.light,
        }}
        title={
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Don't show the name if it's a new loadout */}
            <Typography variant="h5">
              {miningLoadout && miningLoadout.name ? miningLoadout.name : 'Loadout Calculator'}
            </Typography>
            <div style={{ flexGrow: 1 }} />
            <ShipChooser ship={newLoadout.ship} onChange={handleShipChange} />
          </Stack>
        }
      ></CardHeader>
      <CardContent>
        <Typography variant="h6">Mounted</Typography>
        <Typography variant="caption">Choose your ship's mounted lasers and components</Typography>

        <Grid container spacing={2}>
          {/* This grid has the lasers and the stats */}
          <Grid container xs={12} sm={12} md={7} lg={8}>
            <Grid xs={6}>
              <LoadoutLaserTool
                activeLaser={activeLasers[0]}
                laserSize={laserSize}
                label={laserSize < 2 ? 'Laser' : 'Front Turret'}
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
            </Grid>
            {newLoadout.ship === LoadoutShipEnum.Mole && (
              <Grid xs={6}>
                <LoadoutLaserTool
                  activeLaser={activeLasers[1]}
                  laserSize={laserSize}
                  label="Port Turret"
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
              </Grid>
            )}
            {newLoadout.ship === LoadoutShipEnum.Mole && (
              <Grid xs={6}>
                <LoadoutLaserTool
                  activeLaser={activeLasers[2]}
                  laserSize={laserSize}
                  label="Starboard Turret"
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
              </Grid>
            )}
            <Grid xs={6}>
              <Card sx={{ borderRadius: 5, height: '100%' }}>
                <CardHeader title="Inventory" />
                <CardContent>
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
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid xs={12} sm={12} md={5} lg={4}>
            {stats && (
              <>
                <LoadoutCalcStats stats={stats} />
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
              </>
            )}
          </Grid>
        </Grid>

        {/* MENU */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setNewLoadout(miningLoadout || newMiningLoadout(newLoadout.ship as LoadoutShipEnum, owner))}
            startIcon={<Refresh />}
          >
            Reset
          </Button>
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
      </CardContent>
      <DeleteModal
        onConfirm={() => onDelete && onDelete()}
        title="Delete Loadout"
        cancelBtnText="Cancel"
        confirmBtnText="Confirm"
        message="Are you sure you want to delete this loadout?"
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </Card>
  )
}

export interface ShipChooserProps {
  onChange: (event: React.MouseEvent<HTMLElement>, newShip: LoadoutShipEnum) => void
  ship: LoadoutShipEnum
}

const makeButtonTheme = (active: boolean, color: PaletteColor): SxProps<Theme> => ({
  // color: color.dark,
  // border: `1px solid ${color.dark}`,
  // background: alpha(color.contrastText, 0.5),
  '&.Mui-selected, &:hover, &.Mui-selected:hover': {
    boxShadow: `0 0 4px 2px ${color.main}66, 0 0 10px 5px ${color.light}33`,
    border: `1px solid ${color.dark}`,
    background: color.main,
    color: color.contrastText,
  },
  '&:hover': {
    border: `1px solid ${color.dark}`,
    background: color.light,
  },
})

export const ShipChooser: React.FC<ShipChooserProps> = ({ onChange, ship: value }) => {
  const theme = useTheme()
  return (
    <ToggleButtonGroup value={value} exclusive size="small" onChange={onChange} color="primary">
      <ToggleButton
        value={LoadoutShipEnum.Prospector}
        aria-label="centered"
        sx={makeButtonTheme(value === LoadoutShipEnum.Prospector, theme.palette.info)}
      >
        Prospector
      </ToggleButton>
      <ToggleButton
        value={LoadoutShipEnum.Mole}
        aria-label="right aligned"
        sx={makeButtonTheme(value === LoadoutShipEnum.Mole, theme.palette.success)}
      >
        Mole
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
