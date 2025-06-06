import * as React from 'react'
import {
  Alert,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  SxProps,
  Theme,
  Typography,
  alpha,
  useTheme,
  PaletteColor,
  Grid,
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import { LoadoutCalc } from '../calculators/LoadoutCalc/LoadoutCalc'
import {
  AllStats,
  BackwardStats,
  LoadoutShipEnum,
  MiningLoadout,
  UserProfile,
  calcLoadoutStats,
  sanitizeLoadout,
  MiningLaserEnum,
  LoadoutLookup,
  MiningModuleEnum,
} from '@regolithco/common'
import { DeleteModal } from '../modals/DeleteModal'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { MODMAP, statsOrder } from '../calculators/LoadoutCalc/LoadoutCalcStats'
import { LoadoutStat } from '../calculators/LoadoutCalc/LoadoutStat'
import { MValue, MValueFormat } from '../fields/MValue'
import { LookupsContext } from '../../context/lookupsContext'
import { fontFamilies } from '../../theme'

dayjs.extend(relativeTime)

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  innerPaper: {
    p: 3,
    mb: 4,
  },
})

export interface MyLoadoutsProps {
  loadouts: MiningLoadout[]
  loading: boolean
  userProfile: UserProfile
  activeLoadout?: string
  onOpenDialog: (loadoutId: string) => void
  onCloseDialog: () => void
  onDeleteLoadout: (id: string) => void
  onCreateLoadout?: (loadout: MiningLoadout) => void
  onUpdateLoadout: (loadout: MiningLoadout) => void
}

export const MyLoadouts: React.FC<MyLoadoutsProps> = ({
  loadouts,
  loading,
  userProfile,
  onOpenDialog,
  onCloseDialog,
  activeLoadout,
  onDeleteLoadout,
  onCreateLoadout,
  onUpdateLoadout,
}) => {
  const theme = useTheme()

  const [statsArr, setStatsArr] = React.useState<(AllStats | null)[]>([])
  const dataStore = React.useContext(LookupsContext)
  const loadoutLookups = dataStore.getLookup('loadout') as LoadoutLookup

  const sortedLoadouts = React.useMemo(() => {
    if (!loadouts || loadouts.length === 0) return []
    const loadoutsCopy = [...loadouts]
    loadoutsCopy.sort((a, b) => {
      if (a.createdAt > b.createdAt) return -1
      if (a.createdAt < b.createdAt) return 1
      return 0
    })
    return loadoutsCopy
  }, [loadouts])

  React.useEffect(() => {
    if (!dataStore.ready) return
    const calcStatsArr = async () => {
      const statsArr = await Promise.all(
        sortedLoadouts.map(async (loadout) => {
          if (!loadout) return null
          const sanitizedLoadout = await sanitizeLoadout(dataStore, loadout)
          return calcLoadoutStats(dataStore, sanitizedLoadout)
        })
      )
      setStatsArr(statsArr)
    }
    calcStatsArr()
  }, [dataStore.ready])

  const [deleteModalOpen, setDeleteModalOpen] = React.useState<string | null>(null)

  // Load an object if we need to
  const activeLoadoutObj = React.useMemo(() => {
    if (!activeLoadout) return undefined
    const found = loadouts.find((l) => l.loadoutId === activeLoadout)
    if (found) {
      return found
    } else {
      onCloseDialog()
      return undefined
    }
  }, [activeLoadout, loadouts])

  if (!dataStore.ready) return <div>Loading Lookups...</div>

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Saved Loadouts
      </Typography>
      <List>
        {loading && sortedLoadouts.length === 0 && <Typography>Loading...</Typography>}
        {!loading && sortedLoadouts.length === 0 && (
          <ListItem sx={{ pb: 20 }}>
            <Alert severity="info">No saved loadouts found. Use the calculator to create and save one</Alert>
          </ListItem>
        )}
        {sortedLoadouts.length > 0 &&
          sortedLoadouts.map((loadout, idx) => {
            const stats = statsArr[idx]
            return (
              <ListItemButton
                onClick={() => onOpenDialog(loadout.loadoutId)}
                key={loadout.loadoutId}
                sx={{
                  backgroundColor: idx % 2 === 0 ? alpha(theme.palette.background.paper, 0.5) : undefined,
                }}
              >
                <Stack direction={{ sm: 'column', md: 'row' }}>
                  <Box
                    flex={{
                      sm: '1 1 100%',
                      md: '1 1 20%',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {loadout.name}
                    </Typography>
                    <Stack spacing={1}>
                      {loadout.ship === LoadoutShipEnum.Mole ? (
                        <Chip size="small" label="Mole" color="success" sx={{ width: 100 }} />
                      ) : (
                        <Chip size="small" label="Prospector" color="info" sx={{ width: 100 }} />
                      )}
                      <Typography variant="caption">{dayjs(loadout.createdAt).fromNow()}</Typography>
                      <Typography>
                        <MValue value={stats?.priceNoStock} format={MValueFormat.currency_sm} />
                      </Typography>
                    </Stack>
                  </Box>
                  <Box
                    flex={{
                      sm: '1 1 100%',
                      md: '1 1 25%',
                    }}
                  >
                    <Stack>
                      {loadout.activeLasers.map((laserObj, idx) => {
                        const laser = loadoutLookups.lasers[laserObj?.laser as MiningLaserEnum]
                        if (!laser) return null
                        const isOn = laserObj?.laserActive
                        return (
                          <Box key={`laser-${idx}`} sx={{ mb: 1 }}>
                            <Chip
                              key={`laser-${idx}`}
                              size="small"
                              label={laser.name}
                              sx={{
                                color: theme.palette.error.contrastText,
                                fontWeight: 'bold',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                mr: 0.5,

                                fontFamily: fontFamilies.robotoMono,
                                borderRadius: 3,
                                boxShadow: isOn
                                  ? `0 0 4px 2px ${theme.palette.error.main}66, 0 0 10px 5px ${theme.palette.error.light}33`
                                  : undefined,
                                backgroundColor: isOn ? theme.palette.error.main : alpha(theme.palette.error.dark, 0.5),
                              }}
                            />
                            {laserObj?.modules.map((moduleCode, idy) => {
                              const module = loadoutLookups.modules[moduleCode as MiningModuleEnum]
                              if (!module) return null
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
                                  key={`module-${idx}-${idy}`}
                                  label={module.name}
                                  size="small"
                                  sx={{
                                    textOverflow: 'hidden',
                                    fontWeight: 'bold',
                                    mr: 0.5,

                                    borderRadius: 3,
                                    fontFamily: fontFamilies.robotoMono,
                                    color: pColor.contrastText,
                                    // boxShadow: isOn ? `0 0 4px 2px ${pColor.main}66, 0 0 10px 5px ${pColor.light}33` : undefined,
                                    boxShadow: isOn ? `0 0 10px 10px  ${pColor.light}44` : undefined,
                                    backgroundColor: isOn ? pColor.main : alpha(pColor.dark, 0.5),
                                    '& .MuiChip-label': {
                                      flex: '1 1',
                                    },
                                  }}
                                />
                              )
                            })}
                          </Box>
                        )
                      })}
                    </Stack>
                  </Box>
                  <Box
                    flex={{
                      sm: '1 1 100%',
                      md: '1 1 50%',
                    }}
                    sx={{
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    <Grid
                      container
                      sx={{
                        width: '100%',
                      }}
                    >
                      {statsOrder
                        // PowerMod is a special case and it gets folded into other stats
                        .filter(({ key }) => key !== 'powerMod')
                        .map(({ key, label, percent, unit, tooltip }, idy) => {
                          if (!stats) return null
                          const modPercent = MODMAP[key as keyof AllStats]
                            ? stats[MODMAP[key as keyof AllStats] as keyof AllStats]
                            : undefined
                          return (
                            <Grid sx={{ width: 90 }} key={`stat-${key}-${idx}`}>
                              <LoadoutStat
                                label={label}
                                key={`key-${key}-${idy}`}
                                isPercent={percent}
                                modPercent={modPercent}
                                unit={unit}
                                tooltip={tooltip}
                                value={stats[key as keyof AllStats]}
                                reversed={BackwardStats.includes(key)}
                              />
                            </Grid>
                          )
                        })}
                    </Grid>
                  </Box>
                </Stack>
                <Box sx={{ flex: '0 0 5%' }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      setDeleteModalOpen(loadout.loadoutId)
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </ListItemButton>
            )
          })}
      </List>
      {activeLoadoutObj && (
        <LoadoutCalc
          isModal
          loading={loading}
          open
          miningLoadout={activeLoadoutObj}
          onClose={onCloseDialog}
          onDelete={() => {
            onDeleteLoadout(activeLoadoutObj?.loadoutId as string)
            onCloseDialog()
          }}
          onUpdate={(loadout) => {
            onUpdateLoadout(loadout)
          }}
          userProfile={userProfile}
        />
      )}
      {deleteModalOpen && (
        <DeleteModal
          onConfirm={() => onDeleteLoadout && onDeleteLoadout(deleteModalOpen)}
          open
          title="Delete Loadout"
          cancelBtnText="Cancel"
          confirmBtnText="Confirm"
          message="Are you sure you want to delete this loadout?"
          onClose={() => setDeleteModalOpen(null)}
        />
      )}
    </Box>
  )
}
