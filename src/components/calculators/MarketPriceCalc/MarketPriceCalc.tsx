import * as React from 'react'
import {
  Alert,
  AlertTitle,
  Chip,
  FormControl,
  FormLabel,
  IconButton,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { Box, Stack, SxProps, Theme } from '@mui/system'
import {
  ActivityEnum,
  findAllStoreChoices,
  OreSummary,
  SalvageOreEnum,
  ShipOreEnum,
  Vehicle,
  VehicleOreEnum,
} from '@regolithco/common'
import { StoreChooserListItem } from '../../fields/StoreChooserListItem'
import Gradient from 'javascript-color-gradient'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { ShipOreChooser } from '../../fields/ShipOreChooser'
import { VehicleOreChooser } from '../../fields/VehicleOreChooser'
import { SalvageOreChooser } from '../../fields/SalvageOreChooser'
import { fontFamilies } from '../../../theme'
import { VehicleChooser } from '../../fields/VehicleChooser'
import { Cancel } from '@mui/icons-material'
import { LookupsContext } from '../../../context/lookupsContext'
import { throttle } from 'lodash'
import numeral from 'numeral'

export interface MarketPriceCalc {
  propA?: string
}

type OreStateType = {
  [ActivityEnum.ShipMining]: [ShipOreEnum, number][]
  [ActivityEnum.VehicleMining]: [VehicleOreEnum, number][]
  [ActivityEnum.Salvage]: [SalvageOreEnum, number][]
}

const styleThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  tinyChips: {
    fontSize: '0.7rem',
    mr: 0.5,
    height: 14,
    borderRadius: 1,
    fontWeight: 'bold',
  },
})

export const MarketPriceCalc: React.FC<MarketPriceCalc> = ({ propA }) => {
  const theme = useTheme()
  const styles = styleThunk(theme)
  const dataStore = React.useContext(LookupsContext)
  const [storeEls, setStoreEls] = React.useState<JSX.Element[]>([])
  const [oreSummary, setOreSummary] = React.useState<OreSummary>({})
  const [oreTotal, setOreTotal] = React.useState<number>(0)
  const [ores, setOres] = React.useState<OreStateType>({
    [ActivityEnum.ShipMining]: [[ShipOreEnum.Agricium, 3200]],
    [ActivityEnum.VehicleMining]: [[VehicleOreEnum.Hadanite, 100]],
    [ActivityEnum.Salvage]: [
      [SalvageOreEnum.Rmc, 100],
      [SalvageOreEnum.Cmat, 100],
    ],
  })
  const [ship, setShip] = React.useState<Vehicle | null>(null)

  React.useEffect(() => {
    async function calcStats() {
      let oreTotal = 0
      const oreSummary: OreSummary = Object.entries(ores).reduce((acc, [activity, oreTable]) => {
        return {
          ...acc,
          ...Object.fromEntries(
            oreTable.map(([oreName, oreValue]) => {
              if (activity !== ActivityEnum.ShipMining) oreTotal += oreValue
              const existing = acc[oreName] || { collected: 0, refined: 0 }
              return [
                oreName,
                {
                  collected: existing.collected + activity === ActivityEnum.ShipMining ? 0 : oreValue,
                  refined: existing.refined + oreValue,
                },
              ]
            })
          ),
        }
      }, {} as OreSummary)
      setOreSummary(oreSummary)
      setOreTotal(oreTotal)
    }
    if (dataStore.ready) calcStats()
  }, [ores, dataStore])

  // Inside your component
  React.useEffect(() => {
    throttledFindAllStoreChoices(theme, dataStore, oreSummary, setStoreEls)
  }, [oreTotal, oreSummary, dataStore])

  const cargoFilled = React.useMemo<number>(() => {
    if (!ship) return 0

    const shipSum = ores[ActivityEnum.ShipMining].reduce((acc, [, oreValue]) => acc + (oreValue || 0), 0)
    const salvageSum = ores[ActivityEnum.Salvage].reduce((acc, [, oreValue]) => acc + (oreValue || 0), 0)
    return shipSum / 100 + salvageSum / 100
  }, [ores, ship])

  const percentFull = ship?.cargo ? (100 * cargoFilled) / (ship?.cargo || 0.001) : 0
  const progressText = `${cargoFilled.toFixed(0)} / ${ship?.cargo || 0} SCU (${percentFull.toFixed(0)}%)`

  if (!dataStore.ready) return <div>Loading...</div>
  return (
    <Box sx={{}}>
      <Alert severity="warning" sx={{ mb: 2 }}>
        <AlertTitle>Prices are variable</AlertTitle>
        <Typography>
          Our prices are updated regularly from{' '}
          <Link href="https://uexcorp.space/" target="_blank">
            UEXCorp
          </Link>{' '}
          however they may change.
        </Typography>
      </Alert>
      <Grid container spacing={4}>
        <Grid xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <FormLabel
                sx={{
                  fontFamily: fontFamilies.robotoMono,
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: theme.palette.secondary.main,
                  mb: 1,
                }}
              >
                Ship Ores
              </FormLabel>
              <ShipOreChooser
                onClick={(newOreName) => {
                  // Do a thing
                  // setores(ores)
                  setOres((oldOres) => {
                    const newOres = { ...oldOres }
                    // Add the ore to the list
                    newOres[ActivityEnum.ShipMining].push([newOreName, 100])
                    // Now sort the array first by ore name and second by the existing index
                    newOres[ActivityEnum.ShipMining].sort((a, b) => {
                      if (a[0] > b[0]) return 1
                      if (a[0] < b[0]) return -1
                      return 0
                    })
                    return newOres
                  })
                }}
              />
              <OreChooserList
                ores={ores[ActivityEnum.ShipMining] as [ShipOreEnum | VehicleOreEnum | SalvageOreEnum, number][]}
                activityTab={ActivityEnum.ShipMining}
                onDelete={(idx) => {
                  setOres((oldOres) => {
                    const newOres = { ...oldOres }
                    // Remove the table row with idx from the array
                    newOres[ActivityEnum.ShipMining].splice(idx, 1)
                    return newOres
                  })
                }}
                onChange={(idx, value) => {
                  setOres((oldOres) => {
                    return {
                      ...oldOres,
                      [ActivityEnum.ShipMining]: oldOres[ActivityEnum.ShipMining].map((ore, i) => {
                        if (i === idx) {
                          return [ore[0], value]
                        }
                        return ore
                      }),
                    }
                  })
                }}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 2 }}>
            <FormControl fullWidth>
              <FormLabel
                sx={{
                  fontFamily: fontFamilies.robotoMono,
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: theme.palette.secondary.main,
                  mb: 1,
                }}
              >
                Vehicle Ores
              </FormLabel>
              <VehicleOreChooser
                onClick={(newOreName) => {
                  // Do a thing
                  // setores(ores)
                  setOres((oldOres) => {
                    const newOres = { ...oldOres }
                    // Add the ore to the list
                    newOres[ActivityEnum.VehicleMining].push([newOreName, 100])
                    // Now sort the array first by ore name and second by the existing index
                    newOres[ActivityEnum.VehicleMining].sort((a, b) => {
                      if (a[0] > b[0]) return 1
                      if (a[0] < b[0]) return -1
                      return 0
                    })
                    return newOres
                  })
                }}
              />
            </FormControl>
            <OreChooserList
              ores={ores[ActivityEnum.VehicleMining] as [ShipOreEnum | VehicleOreEnum | SalvageOreEnum, number][]}
              activityTab={ActivityEnum.VehicleMining}
              onDelete={(idx) => {
                setOres((oldOres) => {
                  const newOres = { ...oldOres }
                  // Remove the table row with idx from the array
                  newOres[ActivityEnum.VehicleMining].splice(idx, 1)
                  return newOres
                })
              }}
              onChange={(idx, value) => {
                setOres((oldOres) => {
                  return {
                    ...oldOres,
                    [ActivityEnum.VehicleMining]: oldOres[ActivityEnum.VehicleMining].map((ore, i) => {
                      if (i === idx) {
                        return [ore[0], value]
                      }
                      return ore
                    }),
                  }
                })
              }}
            />
          </Box>
          <Box sx={{ my: 2 }}>
            <FormControl fullWidth>
              <FormLabel
                sx={{
                  fontFamily: fontFamilies.robotoMono,
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: theme.palette.secondary.main,
                  mb: 1,
                }}
              >
                Salvage Materials
              </FormLabel>
              <SalvageOreChooser
                onClick={(newOreName) => {
                  // Do a thing
                  // setores(ores)
                  setOres((oldOres) => {
                    const newOres = { ...oldOres }
                    // Add the ore to the list
                    newOres[ActivityEnum.Salvage].push([newOreName, 100])
                    // Now sort the array first by ore name and second by the existing index
                    newOres[ActivityEnum.Salvage].sort((a, b) => {
                      if (a[0] > b[0]) return 1
                      if (a[0] < b[0]) return -1
                      return 0
                    })
                    return newOres
                  })
                }}
              />
            </FormControl>
            <OreChooserList
              ores={ores[ActivityEnum.Salvage] as [ShipOreEnum | VehicleOreEnum | SalvageOreEnum, number][]}
              activityTab={ActivityEnum.Salvage}
              onDelete={(idx) => {
                setOres((oldOres) => {
                  const newOres = { ...oldOres }
                  // Remove the table row with idx from the array
                  newOres[ActivityEnum.Salvage].splice(idx, 1)
                  return newOres
                })
              }}
              onChange={(idx, value) => {
                setOres((oldOres) => {
                  return {
                    ...oldOres,
                    [ActivityEnum.Salvage]: oldOres[ActivityEnum.Salvage].map((ore, i) => {
                      if (i === idx) {
                        return [ore[0], value]
                      }
                      return ore
                    }),
                  }
                })
              }}
            />
          </Box>
        </Grid>
        <Grid xs={12} md={6}>
          <Box>
            <Typography
              sx={{
                fontFamily: fontFamilies.robotoMono,
                fontSize: 16,
                fontWeight: 'bold',
                color: theme.palette.secondary.main,
                mb: 2,
              }}
            >
              Ship Capacity
            </Typography>
            <VehicleChooser
              label={'Cargo Ship (Optional)'}
              onlyCargo
              vehicle={ship?.UEXID}
              onChange={(vcode) => setShip(vcode)}
            />
            {ship && (
              <FormControl
                fullWidth
                sx={{
                  mt: 2,
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={percentFull > 100 ? 100 : percentFull}
                  color={percentFull > 90 ? (percentFull > 100 ? 'error' : 'warning') : 'success'}
                  sx={{
                    // Change the height of the bar to 30px
                    height: 30,
                    borderRadius: 2,
                    position: 'relative',
                    '&:before': {
                      zIndex: 100,
                      content: `'${progressText}'`,
                      position: 'absolute',
                      textShadow: `1px 1px 4px black`,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 'bold',
                      fontFamily: fontFamilies.robotoMono,
                    },
                  }}
                />
              </FormControl>
            )}
          </Box>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <FormLabel
              sx={{
                fontFamily: fontFamilies.robotoMono,
                fontSize: 20,
                fontWeight: 'bold',
                color: theme.palette.secondary.main,
                mb: 1,
              }}
            >
              Seller Choices
            </FormLabel>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                // make the baseline vertically centered
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="overline">Legend</Typography>
              <Chip
                label="Available"
                size="small"
                sx={{
                  ...styles.tinyChips,
                  background: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                }}
              />
              <Chip
                label="Not Available"
                size="small"
                sx={{
                  ...styles.tinyChips,
                  background: theme.palette.primary.contrastText,
                  color: theme.palette.primary.dark,
                }}
              />
            </Stack>
            {oreTotal === 0 && (
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  fontSize: 20,
                  color: theme.palette.secondary.light,
                }}
              >
                No ores selected
              </Typography>
            )}
            {oreTotal > 0 && storeEls.length === 0 && (
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  fontSize: 20,
                  color: theme.palette.secondary.light,
                }}
              >
                No stores found
              </Typography>
            )}
            <List sx={{ overflowY: 'scroll', flexGrow: 1, px: 2 }}>{storeEls}</List>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  )
}

interface OreChooserListProps {
  ores: [ShipOreEnum | VehicleOreEnum | SalvageOreEnum, number][]
  onChange: (tableIndex: number, value: number) => void
  onDelete: (tableIndex: number) => void
  activityTab: ActivityEnum
}

// Define the throttled function outside of the component
const throttledFindAllStoreChoices = throttle(
  async (theme, dataStore, oreSummary, setStoreEls) => {
    const newStoresGrouped = await findAllStoreChoices(dataStore, oreSummary, true)
    const quaColors = [theme.palette.success.light, theme.palette.warning.light, theme.palette.error.light]
    const bgColors = new Gradient()
      .setColorGradient(...quaColors)
      .setMidpoint(newStoresGrouped.length) // 100 is the number of colors to generate. Should be enough stops for our ores
      .getColors()

    const newStores = newStoresGrouped.map((cityStores, index) => (
      <StoreChooserListItem
        key={`store-${index}`}
        ores={oreSummary}
        cityStores={cityStores}
        priceColor={bgColors[index]}
        isMax={index === 0}
        onClick={() => {
          // Do a thing
        }}
      />
    ))
    setStoreEls(newStores)
  },
  1000,
  { trailing: true }
)

const OreChooserList: React.FC<OreChooserListProps> = ({ ores, onChange, onDelete, activityTab }) => {
  if (!ores || Object.keys(ores).length === 0) return null
  const isVehicleOre = activityTab === ActivityEnum.VehicleMining
  return (
    <>
      <List dense>
        {ores.map(([oreName, oreValue], idx) => {
          const incValue = isVehicleOre ? 0.1 : 100
          return (
            <ListItem
              key={`ore-${idx}`}
              sx={{
                // Alternate background color
                backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.3)',
              }}
            >
              <ListItemText
                primary={oreName}
                primaryTypographyProps={{
                  sx: {
                    fontFamily: fontFamilies.robotoMono,
                    fontSize: 20,
                    fontWeight: 'bold',
                  },
                }}
                sx={{
                  flex: '1 1 40%',
                }}
              />
              <TextField
                value={numeral(oreValue * (isVehicleOre ? 10 : 0.01)).format('0,0')}
                id={`ore-${idx}`}
                sx={{ flex: '1 1 40%' }}
                onFocus={(e) => {
                  e.target.select()
                }}
                tabIndex={idx + 1}
                inputProps={{
                  sx: {
                    p: 0,
                    fontSize: 30,
                    textAlign: 'right',
                    fontFamily: fontFamilies.robotoMono,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <Box
                      sx={{
                        fontSize: 12,
                        px: 0.5,
                      }}
                    >
                      {isVehicleOre ? 'mSCU' : 'SCU'}
                    </Box>
                  ),
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    // Set next cell down to edit mode
                    event.preventDefault()
                  } else if (event.key === 'Tab') {
                    event.preventDefault()
                    // if shift is held
                    if (event.shiftKey) {
                      // Get the previous cell if there is one by id
                      const prevCell = document.getElementById(`ore-${idx - 1}`)
                      if (prevCell) {
                        prevCell.focus()
                      }
                    } else {
                      // Get the next cell if there is one by id
                      const nextCell = document.getElementById(`ore-${idx + 1}`)
                      if (nextCell) {
                        nextCell.focus()
                      }
                    }
                  } else if (event.key === 'ArrowUp') {
                    // increment the value by 1
                    event.preventDefault()
                    onChange(idx, (oreValue || 0) + incValue)
                  } else if (event.key === 'ArrowDown') {
                    // Set next cell down to edit mode
                    event.preventDefault()
                    if (oreValue >= incValue) onChange(idx, oreValue - incValue)
                  } else if (event.key === 'Escape') {
                    event.preventDefault()
                  } else if (event.key.match(/^[0-9]+$/)) {
                    // This is fine. Do nothing
                  } else if (event.key.match(/^[!@#$%^&*()-_+{}[\].,/\\|`~]+$/)) {
                    // Physically stop any other keys being pressed. not a complete set but useful anyway
                    event.preventDefault()
                  }
                }}
                onChange={(e) => {
                  // strip the commas
                  const newValue = e.target.value.replace(/,/g, '')
                  if (newValue === '') {
                    onChange(idx, 0)
                    return
                  }
                  // If not numeric then revert
                  if (newValue.match(/^[0-9]+$/)) {
                    // This is fine. Do nothing
                  } else {
                    return
                  }
                  const finalVal = parseInt(newValue, 10) * incValue
                  onChange(idx, finalVal)
                }}
              />
              <IconButton color="error" onClick={() => onDelete(idx)} sx={{ p: 0, ml: 1 }}>
                <Cancel />
              </IconButton>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
