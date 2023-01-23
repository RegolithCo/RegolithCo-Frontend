import * as React from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  InputAdornment,
  Slider,
  SxProps,
  TextField,
  Theme,
  ThemeProvider,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import {
  lookups,
  MarketPriceLookupValue,
  RockStateEnum,
  ShipOreEnum,
  ShipRock,
  shipRockCalc,
  ShipRockOre,
} from '@regolithco/common'
import { ShipOreChooser } from '../fields/ShipOreChooser'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { RockIcon } from '../../icons'
import { Stack } from '@mui/system'
import { MValue, MValueFormat } from '../fields/MValue'
import { fontFamilies, theme as themeOrig } from '../../theme'
import { Cancel, Delete, Save } from '@mui/icons-material'
import { isEqual } from 'lodash'
import { DeleteModal } from './DeleteModal'

export const SHIP_ROCK_BOUNDS = [3000, 9000]

export interface ShipRockEntryModalProps {
  open?: boolean
  isNew?: boolean
  shipRock?: ShipRock
  onClose: () => void
  onDelete?: () => void
  onSubmit?: (newRock: ShipRock) => void
}

const styleThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  paper: {
    '& .MuiDialog-paper': {
      [theme.breakpoints.up('md')]: {
        minHeight: 550,
        maxHeight: 900,
        overflow: 'visible',
      },
      backgroundColor: '#282828ee',
      backgroundImage: 'none',
      borderRadius: 4,
      position: 'relative',
      outline: `10px solid ${theme.palette.primary.contrastText}`,
      border: `10px solid ${theme.palette.primary.dark}`,
    },
  },
  dialogContent: {
    py: 1,
    px: 2,
    borderRadius: 3,
    outline: `10px solid ${theme.palette.primary.dark}`,
  },
  headTitles: {
    // fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
    // lineHeight: 1.5,
    fontSize: '0.8rem',
    // textAlign: 'center',
    // p: 1,
    // my: 1,
    // color: theme.palette.secondary.light,
    // borderBottom: `3px solid ${theme.palette.secondary.main}`,
    // borderBottom: `3px dashed`,
  },
  headerBar: {
    color: theme.palette.primary.contrastText,
    background: theme.palette.primary.dark,
    display: 'flex',
    justifyContent: 'space-between',
    px: 2,
    py: 1,
  },
  numfields: {
    '& .MuiInputBase-root': {
      paddingRight: 0,
    },
    '& .MuiOutlinedInput-input': {
      textAlign: 'right',
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
      padding: 0.5,
    },
  },
  cardTitle: {
    fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
    [theme.breakpoints.up('md')]: {
      fontSize: 28,
    },
  },
  compositionGrid: {
    py: 0,
    my: 0,
  },
  massSlider: {
    pt: 0,
    pb: 4,
    my: 0,
  },
  compositionSlider: {
    marginBottom: 0,
  },
  sliderOreName: {
    fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
  },
  icon: {
    [theme.breakpoints.up('md')]: {
      fontSize: 90,
      height: 80,
      width: 80,
      padding: 1,
    },
    padding: 1,
    top: -50,
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 40,
    height: 50,
    width: 50,
    position: 'absolute',
    zIndex: 100,
    border: `8px solid ${theme.palette.primary.dark}`,
    color: theme.palette.primary.dark,
    background: 'black',
    borderRadius: '50%',
  },
})

const markIntervals = [3, 4, 5, 6, 7, 8, 9]
const marks = markIntervals.map((mark) => ({ value: mark * 1000, label: mark + 'K' }))

export const ShipRockEntryModal: React.FC<ShipRockEntryModalProps> = ({
  open,
  isNew,
  shipRock,
  onClose,
  onDelete,
  onSubmit,
}) => {
  const theme = useTheme()
  const styles = styleThunk(theme)
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)
  const [newShipRock, setNewShipRock] = React.useState<ShipRock>(
    !isNew && shipRock ? shipRock : { state: RockStateEnum.Ready, mass: 0, ores: [], __typename: 'ShipRock' }
  )

  React.useEffect(() => {
    if (shipRock && !isEqual(shipRock, newShipRock)) setNewShipRock(shipRock)
  }, [shipRock])

  const [volume, value] = React.useMemo(() => {
    try {
      const [volume, value] = shipRockCalc(newShipRock)
      return [volume, value]
    } catch (e) {
      console.log(e)
      return [0, 0]
    }
  }, [newShipRock])

  const ores: ShipRockOre[] = [...(newShipRock.ores || [])]
  // alphabetical sort
  ores.sort(({ ore: a }, { ore: b }) => {
    const aPrice = lookups.marketPriceLookup[a as ShipOreEnum] as MarketPriceLookupValue
    const bPrice = lookups.marketPriceLookup[b as ShipOreEnum] as MarketPriceLookupValue
    return bPrice.refined - aPrice.refined
  })
  const disabled =
    !newShipRock.mass ||
    !newShipRock.ores ||
    !newShipRock.ores.length ||
    newShipRock.mass <= SHIP_ROCK_BOUNDS[0] ||
    newShipRock.mass > SHIP_ROCK_BOUNDS[1]

  return (
    <>
      <Dialog open={Boolean(open)} onClose={onClose} sx={styles.paper} maxWidth="xs">
        <RockIcon sx={styles.icon} />
        <Box sx={styles.headerBar}>
          <Typography variant="h6" sx={styles.cardTitle}>
            Rock Scan
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <Stack>
            <Tooltip title="Potential value of all the ore, after refining, using Dinyx Solventation" placement="right">
              <Typography sx={{ fontWeight: 'bold' }} align="right">
                Value: <MValue value={value} format={MValueFormat.currency} />
              </Typography>
            </Tooltip>
            <Tooltip title="Total volume of all the unrefined ore in this rock" placement="right">
              <Typography sx={{ fontWeight: 'bold' }} align="right">
                Material: <MValue value={volume} format={MValueFormat.volSCU} />
              </Typography>
            </Tooltip>
          </Stack>
        </Box>
        <DialogContent sx={styles.dialogContent}>
          <Typography variant="overline" sx={styles.headTitles} component="div">
            Size (mass in kg)
          </Typography>
          <Grid2 container spacing={3} paddingX={1} sx={styles.compositionGrid}>
            <Grid2 xs={9}>
              <Slider
                step={1}
                sx={styles.massSlider}
                color="secondary"
                valueLabelDisplay="auto"
                value={newShipRock.mass as number}
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === 'number') {
                    setNewShipRock({ ...newShipRock, mass: newValue })
                  }
                }}
                marks={marks}
                min={SHIP_ROCK_BOUNDS[0]}
                max={SHIP_ROCK_BOUNDS[1]}
              />
            </Grid2>
            <Grid2 xs={3}>
              <TextField
                sx={styles.numfields}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
                value={(newShipRock.mass as number).toFixed(0)}
                onChange={(event) => {
                  setNewShipRock({ ...newShipRock, mass: Number(event.target.value) })
                }}
                variant="outlined"
                type="number"
                size="small"
              />
            </Grid2>
          </Grid2>
          <Typography variant="overline" sx={styles.headTitles} component="div">
            Composition
          </Typography>
          <Box sx={{ mb: 2 }}>
            <ThemeProvider theme={themeOrig}>
              <ShipOreChooser
                multiple
                values={ores.map((o) => o.ore as ShipOreEnum)}
                onChange={(shipOreEnum) => {
                  setNewShipRock({
                    ...newShipRock,
                    ores: shipOreEnum.map((ore) => {
                      const found = (newShipRock.ores || []).find((o) => o.ore === ore)
                      return found || { ore, percent: 0, __typename: 'ShipRockOre' }
                    }),
                  })
                }}
              />
            </ThemeProvider>
          </Box>
          <Box>
            {ores.map((ore, idx) => (
              <Grid2 container spacing={3} paddingX={1} paddingY={0} key={`ore-${idx}`}>
                <Grid2 xs={2}>
                  <Box sx={styles.sliderOreName}>{ore.ore?.slice(0, 4)}</Box>
                </Grid2>
                <Grid2 xs={7}>
                  <Slider
                    sx={styles.compositionSlider}
                    step={1}
                    getAriaValueText={(value) => `${value}%`}
                    valueLabelFormat={(value) => `${value.toFixed(0)}%`}
                    value={(ore.percent as number) * 100}
                    onChange={(event: Event, newValue: number | number[]) => {
                      if (typeof newValue === 'number') {
                        let retVal = Math.round(newValue + Number.EPSILON) / 100
                        if (retVal < 0) retVal = 0
                        if (retVal > 0.5) retVal = 0.5
                        const newOres = newShipRock.ores?.map((o) => {
                          if (o.ore === ore.ore) {
                            return { ...o, percent: retVal }
                          } else {
                            return o
                          }
                        })
                        setNewShipRock({ ...newShipRock, ores: newOres })
                      }
                    }}
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 50, label: '50%' },
                    ]}
                    min={0}
                    max={50}
                    valueLabelDisplay="auto"
                  />
                </Grid2>
                <Grid2 xs={3}>
                  <TextField
                    value={((ore.percent as number) * 100).toFixed(0)}
                    sx={styles.numfields}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    onChange={(event) => {
                      const newOres = newShipRock.ores?.map((o) => {
                        let retVal = Math.round(Number(event.target.value) + Number.EPSILON) / 100
                        if (retVal < 0) retVal = 0
                        if (retVal > 0.5) retVal = 0.5
                        if (o.ore === ore.ore) {
                          return { ...o, percent: retVal }
                        }
                        return o
                      })
                      setNewShipRock({ ...newShipRock, ores: newOres })
                    }}
                    variant="outlined"
                    type="number"
                    size="small"
                  />
                </Grid2>
              </Grid2>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ background: theme.palette.primary.dark }}>
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            <Button color="error" onClick={onClose} variant="contained" startIcon={<Cancel />}>
              Cancel
            </Button>
            <div style={{ flexGrow: 1 }} />
            {!isNew && (
              <Button
                color="error"
                startIcon={<Delete />}
                sx={{ background: theme.palette.background.paper }}
                variant="outlined"
                onClick={() => {
                  setDeleteModalOpen(true)
                }}
              >
                Delete
              </Button>
            )}
            <div style={{ flexGrow: 1 }} />
            <Button
              color="secondary"
              startIcon={<Save />}
              size="small"
              disabled={disabled}
              variant={'contained'}
              onClick={() => {
                onSubmit && onSubmit(newShipRock)
                onClose()
              }}
            >
              Save
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
      <DeleteModal
        title="Delete Rock Scan"
        message="Are you sure you want to delete this rock?"
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          onDelete && onDelete()
          setDeleteModalOpen(false)
          onClose()
        }}
      />
    </>
  )
}
