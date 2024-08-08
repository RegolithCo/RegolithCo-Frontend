import React, { useCallback, useContext, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  FormControlLabel,
  Grid2Props,
  IconButton,
  PaletteColor,
  Stack,
  Switch,
  SxProps,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  LoadoutShipEnum,
  MiningLoadout,
  UserProfile,
  calcLoadoutStats,
  sanitizeLoadout,
  ActiveMiningLaserLoadout,
  AllStats,
} from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { Close, Delete, Edit, Refresh, Save } from '@mui/icons-material'
import { fontFamilies } from '../../../theme'
import { dummyUserProfile, newMiningLoadout } from '../../../lib/newObjectFactories'
import { DeleteModal } from '../../modals/DeleteModal'
import { LoadoutCalcStats } from './LoadoutCalcStats'
import { LoadoutLaserTool } from './LoadoutLaserTool'
import { LoadoutInventory } from './LoadoutInventory'
import { LoadoutCreateModal } from '../../modals/LoadoutCreateModal'
import { WarningModal } from '../../modals/WarningModal'
import { LoadoutShareModal } from '../../modals/LoadoutShareModal'
import { ExportImageIcon } from '../../../icons/badges'
import { LookupsContext } from '../../../context/lookupsContext'

export interface LoadoutCalcProps {
  miningLoadout?: MiningLoadout
  userProfile?: UserProfile
  loading?: boolean
  isModal?: boolean
  isShare?: boolean
  open?: boolean
  readonly?: boolean
  loadoutCount?: number
  onClose?: () => void
  onUpdate?: (newLoadout: MiningLoadout) => void
  onCreate?: (newLoadout: MiningLoadout) => void
  onDelete?: () => void
}

const DEFAULT_SHIP = LoadoutShipEnum.Mole

interface ToolGridProps {
  ship: LoadoutShipEnum
  isShare?: boolean
  children: React.ReactNode | React.ReactNode[]
}

const ToolGrid: React.FC<ToolGridProps> = ({ ship, children, isShare }) => {
  const gridProps: Grid2Props =
    ship === LoadoutShipEnum.Mole
      ? isShare
        ? { xs: 3 }
        : {
            xs: 12,
            sm: 6,
            md: 6,
            lg: 4,
          }
      : isShare
        ? { xs: 3 }
        : {
            xs: 12,
            sm: 6,
            md: 6,
            lg: 4,
          }
  return <Grid {...gridProps}>{children}</Grid>
}

export const LoadoutCalc: React.FC<LoadoutCalcProps> = ({
  miningLoadout,
  userProfile,
  loading,
  open,
  isModal,
  isShare,
  readonly,
  loadoutCount,
  onClose,
  onUpdate,
  onCreate,
  onDelete,
}) => {
  const theme = useTheme()
  const owner = userProfile || dummyUserProfile()
  const dataStore = useContext(LookupsContext)
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

  const [stats, setStats] = React.useState<AllStats>()
  const [activeLasers, setActiveLasers] = React.useState<ActiveMiningLaserLoadout[]>([])
  const [laserSize, setLaserSize] = React.useState(0)

  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [countWarningModalOpen, setCountWarningModalOpen] = React.useState(false)
  const [editingName, setEditingName] = React.useState(false)
  const [shareModalOpen, setShareModalOpen] = React.useState(false)
  const [newLoadout, _setNewLoadout] = React.useState<MiningLoadout>()
  const [hoverLoadout, _setHoverLoadout] = React.useState<MiningLoadout | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)
  const [includeStockPrices, setIncludeStockPrices] = React.useState(false)

  const setNewLoadout = useCallback(
    async (sbl?: MiningLoadout) => {
      if (!newLoadout || isShare) return
      if (hoverLoadout) _setHoverLoadout(null)
      const finalLoadout = sbl || (await newMiningLoadout(dataStore, newLoadout.ship as LoadoutShipEnum, owner))
      const sanitizedLoadout = await sanitizeLoadout(dataStore, finalLoadout)
      _setNewLoadout(sanitizedLoadout)
    },
    [dataStore, newLoadout]
  )

  const setHoverLoadout = useCallback(
    async (hl: MiningLoadout | null) => {
      if (isShare) return
      if (hl === null) return _setHoverLoadout(null)
      const sanitizedLoadout = await sanitizeLoadout(dataStore, hl)
      _setHoverLoadout(sanitizedLoadout)
    },
    [dataStore]
  )

  const handleShipChange = useCallback(
    async (event: React.MouseEvent<HTMLElement>, newShip: LoadoutShipEnum) => {
      if (!newLoadout || isShare) return
      if (newShip === newLoadout?.ship || !newShip) return
      const newLoadoutCopy = await newMiningLoadout(dataStore, newShip, owner)
      setNewLoadout({
        ...newLoadout,
        ship: newShip,
        activeLasers: newLoadoutCopy.activeLasers,
      })
    },
    [newLoadout, owner]
  )

  useEffect(() => {
    const asyncCalc = async () => {
      if (!dataStore.ready) return
      const myNewLoadout: MiningLoadout = newLoadout
        ? { ...newLoadout }
        : miningLoadout || (await newMiningLoadout(dataStore, DEFAULT_SHIP, owner))

      if (!newLoadout) _setNewLoadout(myNewLoadout)
    }
    asyncCalc()
  }, [dataStore.ready])

  useEffect(() => {
    if (!dataStore.ready) return
    const asyncCalc = async () => {
      const loadout = hoverLoadout || newLoadout
      if (!loadout) return

      const stats = await calcLoadoutStats(dataStore, loadout)
      setStats(stats)

      if (!newLoadout) return
      const activeLasers = (newLoadout.activeLasers as ActiveMiningLaserLoadout[]) || []
      const laserSize = newLoadout.ship === LoadoutShipEnum.Mole ? 2 : 1

      setActiveLasers(activeLasers)
      setLaserSize(laserSize)
    }
    asyncCalc()
  }, [dataStore.ready, hoverLoadout, newLoadout])

  if (!dataStore.ready || !newLoadout) return <div>Loading Loadout Stats...</div>

  return (
    <LoadoutWrapper isModal={isModal} isShare={isShare} open={open || false} onClose={onClose}>
      <Card
        sx={{
          [theme.breakpoints.down('sm')]: {
            borderRadius: 0,
          },
          [theme.breakpoints.up('md')]: {
            borderRadius: 10,
          },
          boxShadow: 'none',
          backgroundImage: 'none',
          background: 'none',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardHeader
          title={
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              {/* Don't show the name if it's a new loadout */}
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography variant="h5" sx={{ m: 0 }}>
                  {miningLoadout && miningLoadout.name ? newLoadout.name : 'Calculator'}
                </Typography>
                {miningLoadout && miningLoadout.name && !readonly && (
                  <IconButton onClick={() => setEditingName(!editingName)} size="small" sx={{ ml: 1 }}>
                    <Edit />
                  </IconButton>
                )}

                {isSmall && isModal && (
                  <>
                    <div style={{ flexGrow: 1 }} />
                    <IconButton color="primary" onClick={() => setShareModalOpen(true)} size="small" sx={{ ml: 1 }}>
                      <ExportImageIcon />
                    </IconButton>
                    <IconButton onClick={onClose} size="small" sx={{ ml: 1 }}>
                      <Close />
                    </IconButton>
                  </>
                )}
              </Box>
              <div style={{ flexGrow: 1 }} />
              <ShipChooser ship={newLoadout.ship} onChange={handleShipChange} readonly={readonly} />
              {!isSmall && !isShare && (
                <IconButton color="primary" onClick={() => setShareModalOpen(true)} size="small" sx={{ ml: 1 }}>
                  <ExportImageIcon />
                </IconButton>
              )}
              {!isSmall && isModal && (
                <IconButton onClick={onClose} size="small" sx={{ ml: 1 }}>
                  <Close />
                </IconButton>
              )}
            </Stack>
          }
        />
        <CardContent
          sx={{
            overflowY: 'scroll',
          }}
        >
          <Grid container spacing={3}>
            {/* This grid has the lasers and the stats */}
            <Grid
              xs={12}
              sm={12}
              md={isShare ? 12 : 8}
              sx={{
                border: {
                  // xs: '1px solid blue',
                  // md: '1px solid red',
                },
              }}
            >
              <Grid container spacing={3} rowSpacing={3}>
                <ToolGrid ship={newLoadout.ship} isShare={isShare}>
                  <LoadoutLaserTool
                    activeLaser={activeLasers[0]}
                    readonly={readonly}
                    isShare={isShare}
                    laserSize={laserSize}
                    label={laserSize < 2 ? 'Laser' : 'Front Turret'}
                    onChange={(currAl, isHover) => {
                      if (isHover) {
                        setHoverLoadout({
                          ...newLoadout,
                          activeLasers: [currAl, activeLasers[1], activeLasers[2]],
                        })
                      } else {
                        setNewLoadout({
                          ...newLoadout,
                          activeLasers: [currAl, activeLasers[1], activeLasers[2]],
                        })
                      }
                    }}
                  />
                </ToolGrid>
                {newLoadout.ship === LoadoutShipEnum.Mole && (
                  <ToolGrid ship={newLoadout.ship} isShare={isShare}>
                    <LoadoutLaserTool
                      activeLaser={activeLasers[1]}
                      laserSize={laserSize}
                      isShare={isShare}
                      readonly={readonly}
                      label="Port Turret"
                      onChange={(currAl, isHover) => {
                        if (isHover) {
                          setHoverLoadout({
                            ...newLoadout,
                            activeLasers: [activeLasers[0], currAl, activeLasers[2]],
                          })
                        } else {
                          setNewLoadout({
                            ...newLoadout,
                            activeLasers: [activeLasers[0], currAl, activeLasers[2]],
                          })
                        }
                      }}
                    />
                  </ToolGrid>
                )}
                {newLoadout.ship === LoadoutShipEnum.Mole && (
                  <ToolGrid ship={newLoadout.ship} isShare={isShare}>
                    <LoadoutLaserTool
                      activeLaser={activeLasers[2]}
                      laserSize={laserSize}
                      isShare={isShare}
                      readonly={readonly}
                      label="Starboard Turret"
                      onChange={(currAl, isHover) => {
                        if (isHover) {
                          setHoverLoadout({
                            ...newLoadout,
                            activeLasers: [activeLasers[0], activeLasers[1], currAl],
                          })
                        } else {
                          setNewLoadout({
                            ...newLoadout,
                            activeLasers: [activeLasers[0], activeLasers[1], currAl],
                          })
                        }
                      }}
                    />
                  </ToolGrid>
                )}
                <ToolGrid ship={newLoadout.ship} isShare={isShare}>
                  <LoadoutInventory loadout={newLoadout} onChange={setNewLoadout} readonly={readonly} />
                </ToolGrid>
              </Grid>
            </Grid>
            <Grid
              container
              xs={12}
              sm={12}
              md={isShare ? 12 : 4}
              sx={{ display: 'flex', flexDirection: isShare ? 'row' : 'column' }}
              spacing={2}
            >
              <Grid xs={isShare ? 8 : 12}>{stats && <LoadoutCalcStats stats={stats} />}</Grid>
              {stats && (
                <Grid xs={isShare ? 4 : 12}>
                  <Box
                    sx={{
                      py: 2,
                      px: 4,
                      borderRadius: 4,
                      flex: '1 1',
                      textAlign: 'center',
                      backgroundColor: theme.palette.background.paper,
                      border: `4px solid ${theme.palette.background.default}`,
                    }}
                  >
                    <Typography variant="overline" sx={{ textAlign: 'center' }} component="div">
                      Loadout Price
                    </Typography>
                    <Typography variant="h4" sx={{ fontFamily: fontFamilies.robotoMono, textAlign: 'center' }}>
                      {MValueFormatter(includeStockPrices ? stats.price : stats.priceNoStock, MValueFormat.currency)}
                    </Typography>
                    {!isShare && (
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            color="secondary"
                            checked={includeStockPrices}
                            onChange={(e) => setIncludeStockPrices(e.target.checked)}
                          />
                        }
                        sx={{
                          pt: 2,
                          '& .MuiTypography-root': {
                            fontSize: '0.7rem',
                            color: theme.palette.text.secondary,
                          },
                        }}
                        label="Incl. Stock lasers"
                      />
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </CardContent>
        {/* MENU */}
        {!readonly && (
          <Stack direction="row" spacing={2} sx={{ mt: 3, p: 1, px: 2 }}>
            {onDelete && userProfile && (
              <Tooltip title="Permanently delete this loadout">
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setDeleteModalOpen(true)}
                  startIcon={<Delete />}
                  disabled={loading}
                >
                  Delete
                </Button>
              </Tooltip>
            )}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setNewLoadout(miningLoadout)}
              startIcon={<Refresh />}
            >
              Reset
            </Button>
            <div style={{ flexGrow: 1 }} />
            <Tooltip title={!onCreate || !userProfile ? 'Log in to save multiple loadouts' : 'Save Loadout'}>
              <>
                <Button
                  variant="contained"
                  disabled={!userProfile || loading}
                  onClick={() => {
                    if (onCreate && !miningLoadout && loadoutCount && loadoutCount >= 20) {
                      setCountWarningModalOpen(true)
                      return
                    }
                    if (onCreate && !miningLoadout) {
                      setCreateModalOpen(true)
                    }
                    if (onUpdate && miningLoadout) {
                      onUpdate(newLoadout)
                    }
                  }}
                  startIcon={<Save />}
                >
                  {loading && <>Loading...</>}
                  {!loading && !miningLoadout ? <>Save New</> : <>Save</>}
                </Button>
              </>
            </Tooltip>
          </Stack>
        )}
        {/* This component is the edit component */}
        <LoadoutCreateModal
          open={editingName}
          edit
          value={newLoadout.name}
          onClose={() => setEditingName(false)}
          onConfirm={(name) => {
            setNewLoadout({
              ...newLoadout,
              name,
            })
          }}
        />
        {/* This component is the create component */}
        <LoadoutCreateModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onConfirm={(name) => {
            if (onCreate) {
              onCreate({
                ...newLoadout,
                name,
              })
            }
          }}
        />
        <WarningModal
          open={countWarningModalOpen}
          title="Too many loadouts"
          message={
            <>
              <Typography variant="body1" paragraph>
                You have reached the maximum number of loadouts (20). Please delete some before creating more.
              </Typography>
              <Typography variant="caption" paragraph>
                If you think this app needs more than 20, please get in touch and let us know. It was an arbitrary
                decision to make things nice for the developers. We can change it if there is demand.
              </Typography>
            </>
          }
          onClose={() => setCountWarningModalOpen(false)}
        />
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
      {!isShare && (
        <LoadoutShareModal open={shareModalOpen} onClose={() => setShareModalOpen(false)} loadout={newLoadout} />
      )}
    </LoadoutWrapper>
  )
}

export interface ShipChooserProps {
  onChange: (event: React.MouseEvent<HTMLElement>, newShip: LoadoutShipEnum) => void
  ship: LoadoutShipEnum
  readonly?: boolean
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

export const ShipChooser: React.FC<ShipChooserProps> = ({ onChange, ship: value, readonly }) => {
  const theme = useTheme()
  return (
    <ToggleButtonGroup value={value} exclusive size="small" onChange={onChange} color="primary" disabled={readonly}>
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

interface LoadoutWrapperProps extends React.PropsWithChildren {
  isModal?: boolean
  isShare?: boolean
  open: boolean
  onClose?: () => void
}

const LoadoutWrapper: React.FC<LoadoutWrapperProps> = ({ children, isModal, isShare, open, onClose }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const bgImage = 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05));'
  if (isModal)
    return (
      <Dialog
        open={!!open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        fullScreen={isSmall}
        sx={{
          '& .MuiDialog-paper': {
            [theme.breakpoints.down('md')]: {
              margin: 0,
              borderRadius: 0,
              maxHeight: '100%',
              width: '100%',
            },
            [theme.breakpoints.up('md')]: isShare
              ? {}
              : {
                  m: 0,
                  p: 2,
                  borderRadius: 10,
                  boxShadow: `0px 0px 20px 5px ${theme.palette.primary.light}, 0px 0px 60px 40px black`,
                  border: `10px solid ${theme.palette.primary.main}`,
                },
            background: theme.palette.background.default,
            backgroundImage: bgImage,
          },
        }}
      >
        {children}
      </Dialog>
    )
  else
    return (
      <Box
        sx={{
          [theme.breakpoints.down('sm')]: {
            borderRadius: 0,
          },
          [theme.breakpoints.up('md')]: isShare
            ? {}
            : {
                mx: 3,
                my: 6,
                px: 2,
                py: 2,
                borderRadius: 10,
                boxShadow: `0px 0px 20px 5px ${theme.palette.primary.light}, 0px 0px 60px 40px black`,
                border: `10px solid ${theme.palette.primary.main}`,
              },
          background: theme.palette.background.default,
          backgroundImage: bgImage,
        }}
      >
        {children}
      </Box>
    )
}
