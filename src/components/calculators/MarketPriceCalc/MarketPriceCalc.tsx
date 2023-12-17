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
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { Box, Stack, SxProps, Theme } from '@mui/system'
import {
  ActivityEnum,
  AnyOreEnum,
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
import { ClawIcon, GemIcon, RockIcon } from '../../../icons'

export interface MarketPriceCalc {
  propA?: string
}

type OreStateType = {
  [ActivityEnum.ShipMining]: Partial<Record<ShipOreEnum, number>>
  [ActivityEnum.VehicleMining]: Partial<Record<VehicleOreEnum, number>>
  [ActivityEnum.Salvage]: Partial<Record<SalvageOreEnum, number>>
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
  const [ores, setOres] = React.useState<OreStateType>({
    [ActivityEnum.ShipMining]: { [ShipOreEnum.Agricium]: 3200 },
    [ActivityEnum.VehicleMining]: {
      [VehicleOreEnum.Hadanite]: 100,
    },
    [ActivityEnum.Salvage]: {
      [SalvageOreEnum.Rmc]: 100,
      [SalvageOreEnum.Cmat]: 100,
    },
  })
  const [ship, setShip] = React.useState<Vehicle | null>(null)
  const [activityTab, setActivityTab] = React.useState<ActivityEnum>(ActivityEnum.ShipMining)

  const { oreSummary, storeChoices, oreTotal } = React.useMemo(() => {
    const oreSummary: OreSummary = Object.entries(ores[activityTab as keyof OreStateType]).reduce(
      (acc, [oreName, oreValue]) => {
        return {
          ...acc,
          [oreName]: {
            collected: 0,
            refined: oreValue || 0,
          },
        }
      },
      {} as OreSummary
    )
    const oreTotal = Object.values(ores[activityTab as keyof OreStateType]).reduce((acc, ore) => acc + ore, 0)

    return { storeChoices: findAllStoreChoices(oreSummary, true), oreSummary, oreTotal }
  }, [ores, activityTab])

  const quaColors = [theme.palette.success.light, theme.palette.warning.light, theme.palette.error.light]
  const bgColors = new Gradient()
    .setColorGradient(...quaColors)
    .setMidpoint(storeChoices.length) // 100 is the number of colors to generate. Should be enough stops for our ores
    .getColors()

  const cargoFilled = React.useMemo<number>(() => {
    if (!ship || activityTab === ActivityEnum.VehicleMining) return 0

    const shipSum = Object.values(ores[ActivityEnum.ShipMining]).reduce((acc, oreValue) => acc + (oreValue || 0), 0)
    const salvageSum = Object.values(ores[ActivityEnum.ShipMining]).reduce((acc, oreValue) => acc + (oreValue || 0), 0)

    if (activityTab === ActivityEnum.ShipMining) return shipSum / 100
    else if (activityTab === ActivityEnum.Salvage) return salvageSum / 100
    else return 0
  }, [ores, ship, activityTab])

  const percentFull = ship?.cargo ? (100 * cargoFilled) / (ship?.cargo || 0.001) : 0
  const progressText = `${cargoFilled.toFixed(0)} / ${ship?.cargo || 0} SCU (${percentFull.toFixed(0)}%)`

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
      <Tabs
        value={activityTab}
        onChange={(e, activity) => {
          setActivityTab(activity)
        }}
        sx={{
          mb: 3,
        }}
      >
        <Tab label="Ship Mining" value={ActivityEnum.ShipMining} icon={<RockIcon />} />
        <Tab label="ROC Mining" value={ActivityEnum.VehicleMining} icon={<GemIcon />} />
        <Tab label="Salvage" value={ActivityEnum.Salvage} icon={<ClawIcon />} />
      </Tabs>
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          {activityTab === ActivityEnum.ShipMining && (
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
                Ore Chooser
              </FormLabel>
              <ShipOreChooser
                values={Object.keys(ores[ActivityEnum.ShipMining]) as ShipOreEnum[]}
                multiple
                onChange={(oreNames) => {
                  // Do a thing
                  // setores(ores)
                  setOres((oldOres) => {
                    const newOres = { ...oldOres }
                    oreNames.forEach((oreName) => {
                      if (!newOres[ActivityEnum.ShipMining][oreName]) {
                        newOres[ActivityEnum.ShipMining][oreName] = 100
                      }
                    })
                    // Now loop over ShipOreEnum and remove any that aren't in oreNames
                    Object.keys(newOres[ActivityEnum.ShipMining]).forEach((oreName) => {
                      if (!oreNames.includes(oreName as ShipOreEnum)) {
                        delete newOres[ActivityEnum.ShipMining][oreName as ShipOreEnum]
                      }
                    })
                    return newOres
                  })
                }}
              />
              <OreChooserList
                ores={ores[ActivityEnum.ShipMining] as Record<ShipOreEnum | VehicleOreEnum | SalvageOreEnum, number>}
                activityTab={activityTab}
                onDelete={(oreName) => {
                  setOres((oldOres) => {
                    const newOres = { ...oldOres }
                    delete newOres[ActivityEnum.ShipMining][oreName as ShipOreEnum]
                    return newOres
                  })
                }}
                onChange={(oreName, value) => {
                  setOres((oldOres) => {
                    return {
                      ...oldOres,
                      [ActivityEnum.ShipMining]: {
                        ...oldOres[ActivityEnum.ShipMining],
                        [oreName]: value,
                      },
                    }
                  })
                }}
              />
            </FormControl>
          )}
          {activityTab === ActivityEnum.VehicleMining && (
            <>
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
                  Ore Chooser
                </FormLabel>
                <VehicleOreChooser
                  values={Object.keys(ores[ActivityEnum.VehicleMining]) as VehicleOreEnum[]}
                  multiple
                  onChange={(oreNames) => {
                    // Do a thing
                    // setores(ores)
                    setOres((oldOres) => {
                      const newOres = { ...oldOres }
                      oreNames.forEach((oreName) => {
                        if (!newOres[ActivityEnum.VehicleMining][oreName]) {
                          newOres[ActivityEnum.VehicleMining][oreName] = 1
                        }
                      })
                      // Now loop over ShipOreEnum and remove any that aren't in oreNames
                      Object.keys(newOres[ActivityEnum.VehicleMining]).forEach((oreName) => {
                        if (!oreNames.includes(oreName as VehicleOreEnum)) {
                          delete newOres[ActivityEnum.VehicleMining][oreName as VehicleOreEnum]
                        }
                      })
                      return newOres
                    })
                  }}
                />
              </FormControl>

              <OreChooserList
                ores={ores[ActivityEnum.VehicleMining] as Record<ShipOreEnum | VehicleOreEnum | SalvageOreEnum, number>}
                activityTab={activityTab}
                onDelete={(oreName) => {
                  setOres((oldOres) => {
                    const newOres = { ...oldOres }
                    delete newOres[ActivityEnum.VehicleMining][oreName as VehicleOreEnum]
                    return newOres
                  })
                }}
                onChange={(oreName, value) => {
                  setOres((oldOres) => {
                    return {
                      ...oldOres,
                      [ActivityEnum.VehicleMining]: {
                        ...oldOres[ActivityEnum.VehicleMining],
                        [oreName]: value,
                      },
                    }
                  })
                }}
              />
            </>
          )}

          {activityTab === ActivityEnum.Salvage && (
            <>
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
                  Ore Chooser
                </FormLabel>
                <SalvageOreChooser
                  values={Object.keys(ores[ActivityEnum.Salvage]) as SalvageOreEnum[]}
                  multiple
                  onChange={(oreNames) => {
                    // Do a thing
                    // setores(ores)
                    setOres((oldOres) => {
                      const newOres = { ...oldOres }
                      oreNames.forEach((oreName) => {
                        if (!newOres[ActivityEnum.Salvage][oreName]) {
                          newOres[ActivityEnum.Salvage][oreName] = 100
                        }
                      })
                      // Now loop over ShipOreEnum and remove any that aren't in oreNames
                      Object.keys(newOres[ActivityEnum.Salvage]).forEach((oreName) => {
                        if (!oreNames.includes(oreName as SalvageOreEnum)) {
                          delete newOres[ActivityEnum.Salvage][oreName as SalvageOreEnum]
                        }
                      })
                      return newOres
                    })
                  }}
                />
              </FormControl>

              <OreChooserList
                ores={ores[ActivityEnum.Salvage] as Record<ShipOreEnum | VehicleOreEnum | SalvageOreEnum, number>}
                onDelete={(oreName) => {
                  setOres((oldOres) => {
                    const newOres = { ...oldOres }
                    delete newOres[ActivityEnum.Salvage][oreName as SalvageOreEnum]
                    return newOres
                  })
                }}
                onChange={(oreName, value) => {
                  setOres((oldOres) => {
                    return {
                      ...oldOres,
                      [ActivityEnum.Salvage]: {
                        ...oldOres[ActivityEnum.Salvage],
                        [oreName]: value,
                      },
                    }
                  })
                }}
                activityTab={activityTab}
              />
            </>
          )}
        </Grid>
        <Grid xs={12} md={6}>
          {activityTab !== ActivityEnum.VehicleMining && (
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
                vehicle={ship?.code}
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
          )}
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
            {oreTotal > 0 && storeChoices.length === 0 && (
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
            <List sx={{ overflowY: 'scroll', flexGrow: 1, px: 2 }}>
              {storeChoices.map((choice, index) => (
                <StoreChooserListItem
                  key={`store-${index}`}
                  ores={oreSummary}
                  storeChoice={choice}
                  priceColor={bgColors[index]}
                  isMax={index === 0}
                  onClick={() => {
                    // Do a thing
                  }}
                />
              ))}
            </List>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  )
}

interface OreChooserListProps {
  ores: Record<ShipOreEnum | VehicleOreEnum | SalvageOreEnum, number>
  onChange: (oreName: AnyOreEnum, value: number) => void
  onDelete: (oreName: AnyOreEnum) => void
  activityTab: ActivityEnum
}

const OreChooserList: React.FC<OreChooserListProps> = ({ ores, onChange, onDelete, activityTab }) => {
  if (!ores || Object.keys(ores).length === 0) return null
  const isVehicleOre = activityTab === ActivityEnum.VehicleMining
  return (
    <>
      <List dense>
        {Object.entries(ores).map(([oreName, oreValue], idx) => {
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
                value={oreValue * (isVehicleOre ? 10 : 0.01)}
                id={`ore-${idx}`}
                sx={{ flex: '1 1 40%' }}
                type="number"
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
                  const newValue = e.target.value
                  // If not numeric then revert
                  if (newValue.match(/^[0-9]+$/)) {
                    // This is fine. Do nothing
                  } else {
                    return
                  }
                  onChange(oreName as AnyOreEnum, Number(newValue) * (isVehicleOre ? 0.1 : 100))
                }}
              />
              <IconButton color="error" onClick={() => onDelete(oreName as AnyOreEnum)} sx={{ p: 0, ml: 1 }}>
                <Cancel />
              </IconButton>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
