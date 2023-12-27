import * as React from 'react'
import {
  Alert,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  SxProps,
  Theme,
  Typography,
  alpha,
  useTheme,
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
} from '@regolithco/common'
import { DeleteModal } from '../modals/DeleteModal'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { MODMAP, statsOrder } from '../calculators/LoadoutCalc/LoadoutCalcStats'
import { LoadoutStat } from '../calculators/LoadoutCalc/LoadoutStat'
import { MValue, MValueFormat } from '../fields/MValue'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { useLookups } from '../../hooks/useLookups'
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
  const styles = stylesThunk(theme)
  const store = useLookups()
  const [deleteModalOpen, setDeleteModalOpen] = React.useState<string | null>(null)

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

  const [statsArr, setStatsArr] = React.useState<(AllStats | null)[]>([])

  React.useEffect(() => {
    const fetchStatsArr = async () => {
      const results = await Promise.all(
        sortedLoadouts.map(async (loadout) => {
          if (!loadout) return null
          const sanitizedLoadout = await sanitizeLoadout(store, loadout)
          return await calcLoadoutStats(store, sanitizedLoadout)
        })
      )
      setStatsArr(results)
    }
    fetchStatsArr()
  }, [sortedLoadouts])

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

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Saved Loadouts
      </Typography>
      <List>
        {loading && <Typography>Loading...</Typography>}
        {!loading && sortedLoadouts.length === 0 && (
          <ListItem sx={{ pb: 20 }}>
            <Alert severity="info">No saved loadouts found. Use the calculator to create and save one</Alert>
          </ListItem>
        )}
        {!loading &&
          sortedLoadouts.length > 0 &&
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
                  <ListItemText
                    sx={{
                      flex: '1 1 10%',
                    }}
                    primaryTypographyProps={{
                      component: 'div',
                    }}
                    primary={
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
                    }
                    secondaryTypographyProps={{
                      component: 'div',
                    }}
                    secondary={
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
                    }
                  />
                  <Box
                    sx={{
                      overflow: 'hidden',
                      maxHeight: 200,
                      maxWidth: 650,
                      borderRadius: 4,
                      flex: '1 1 75%',
                      display: 'flex',
                      marginRight: 4,
                      flexDirection: 'row',
                    }}
                  >
                    <Grid2
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
                            <Grid2 sx={{ width: 90 }} key={`stat-${key}-${idx}`}>
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
                            </Grid2>
                          )
                        })}
                    </Grid2>
                  </Box>
                </Stack>

                <ListItemSecondaryAction>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      setDeleteModalOpen(loadout.loadoutId)
                    }}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
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
