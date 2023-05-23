import * as React from 'react'

import {
  Alert,
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
  AnyOreEnum,
  findPrice,
  getOreName,
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

export const SHIP_ROCK_BOUNDS = [1, 150000]

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
      border: `10px solid ${theme.palette.primary.main}`,
    },
  },
  dialogContent: {
    py: 1,
    px: 2,
    borderRadius: 3,
    outline: `10px solid ${theme.palette.primary.main}`,
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
    background: theme.palette.primary.main,
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
  massField: {
    '& .MuiInputBase-root': {
      paddingRight: 0,
    },
    '& .MuiOutlinedInput-input': {
      textAlign: 'right',
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
      fontSize: 20,
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
    border: `8px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    background: 'black',
    borderRadius: '50%',
  },
})

const markIntervals = [3, 4, 5, 6, 7, 8, 9]
const marks = markIntervals.map((mark) => ({ value: mark * 10000, label: mark + 'K' }))

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
  const [newShipRock, _setNewShipRock] = React.useState<ShipRock>(
    !isNew && shipRock ? shipRock : { state: RockStateEnum.Ready, mass: 0, ores: [], __typename: 'ShipRock' }
  )

  const setNewShipRock = React.useCallback(
    (newRock: ShipRock) => {
      _setNewShipRock((oldRock) => {
        const newOres = [...(newRock.ores || [])]
        // if ShipOreEnum.Inertmaterial isn't in the list, add it
        if (!newOres.find(({ ore }) => ore === ShipOreEnum.Inertmaterial)) {
          newOres.push({ ore: ShipOreEnum.Inertmaterial, percent: 0, __typename: 'ShipRockOre' })
        }
        // Set the entry for ShipOreEnum.Inertmaterial to be 1- the sum of all other ores
        const total = newOres.reduce(
          (acc, { ore, percent }) => (ore === ShipOreEnum.Inertmaterial ? acc : acc + percent),
          0
        )
        const inertMaterial = newOres.find(({ ore }) => ore === ShipOreEnum.Inertmaterial)
        if (inertMaterial) {
          inertMaterial.percent = 1 - total
          if (inertMaterial?.percent < 0) inertMaterial.percent = 0
        }
        newOres.sort((a, b) => {
          const aPrice = findPrice(a.ore as ShipOreEnum, undefined, true)
          const bPrice = findPrice(b.ore as ShipOreEnum, undefined, true)
          return bPrice - aPrice
        })
        return { ...oldRock, ...newRock, ores: newOres }
      })
    },
    [_setNewShipRock]
  )

  React.useEffect(() => {
    if (shipRock && !isEqual(shipRock, newShipRock)) setNewShipRock(shipRock)
  }, [shipRock])

  const [volume, value, percentTotal] = React.useMemo(() => {
    try {
      const {
        rock: { volume, value },
      } = shipRockCalc(newShipRock)
      const percentTotal = (newShipRock.ores || []).reduce((acc, { percent }) => acc + percent, 0)
      return [volume, value, percentTotal]
    } catch (e) {
      console.log(e)
      return [0, 0]
    }
  }, [newShipRock])

  const ores: ShipRockOre[] = [...(newShipRock.ores || [])]
  // alphabetical sort
  ores.sort(({ ore: a }, { ore: b }) => {
    const aPrice = findPrice(a as ShipOreEnum, undefined, true)
    const bPrice = findPrice(b as ShipOreEnum, undefined, true)
    return bPrice - aPrice
  })
  const disabled =
    !newShipRock.mass ||
    !newShipRock.ores ||
    !newShipRock.ores.length ||
    newShipRock.mass <= SHIP_ROCK_BOUNDS[0] ||
    newShipRock.mass > SHIP_ROCK_BOUNDS[1] ||
    Boolean(percentTotal && percentTotal > 1) ||
    Boolean(percentTotal === 0)

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
                Value: <MValue value={value} format={MValueFormat.currency_sm} />
              </Typography>
            </Tooltip>
            <Tooltip
              title="Total volume of all the unrefined ore in this rock (not including inert material)"
              placement="right"
            >
              <Typography sx={{ fontWeight: 'bold' }} align="right">
                Material: <MValue value={volume} format={MValueFormat.volSCU} decimals={volume > 10 ? 0 : 1} />
              </Typography>
            </Tooltip>
          </Stack>
        </Box>
        <DialogContent sx={styles.dialogContent}>
          <Alert severity="warning">
            <Typography variant="caption">Enter all minerals for maximum SCU and value accuracy.</Typography>
          </Alert>
          <Typography variant="overline" sx={styles.headTitles} component="div">
            Rock Mass
          </Typography>
          <Grid2 container spacing={3} paddingX={1} sx={styles.compositionGrid}>
            <Grid2 xs={12}>
              <TextField
                sx={styles.massField}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
                value={(newShipRock.mass as number).toFixed(0)}
                onChange={(event) => {
                  setNewShipRock({ ...newShipRock, mass: Number(event.target.value) })
                }}
                variant="outlined"
                type="number"
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
                  const chosenOres = shipOreEnum.map<ShipRockOre>((ore) => {
                    const found = (newShipRock.ores || []).find((o) => o.ore === ore)
                    return found || { ore, percent: 0, __typename: 'ShipRockOre' }
                  })
                  setNewShipRock({
                    ...newShipRock,
                    ores: chosenOres,
                  })
                }}
              />
            </ThemeProvider>
          </Box>
          {percentTotal && percentTotal > 1 ? (
            <Typography variant="caption" sx={styles.headTitles} component="div" color="error">
              <em>Percents cannot add to greater than 100%</em>
            </Typography>
          ) : null}
          <Box sx={{ mb: 2 }}>
            {ores.map((ore, idx) => (
              <Grid2 container spacing={3} paddingX={1} paddingY={0} key={`ore-${idx}`}>
                <Grid2 xs={2}>
                  <Tooltip title={getOreName(ore.ore as AnyOreEnum)} placement="right">
                    <Box sx={styles.sliderOreName}>{ore.ore?.slice(0, 4)}</Box>
                  </Tooltip>
                </Grid2>
                <Grid2 xs={7}>
                  <Slider
                    sx={styles.compositionSlider}
                    step={1}
                    tabIndex={-1}
                    disabled={ore.ore === ShipOreEnum.Inertmaterial}
                    getAriaValueText={(value) => `${value}%`}
                    valueLabelFormat={(value) => `${value.toFixed(0)}%`}
                    value={(ore.percent as number) * 100}
                    onChange={(event: Event, newValue: number | number[]) => {
                      if (typeof newValue === 'number') {
                        let retVal = Math.round(newValue + Number.EPSILON) / 100
                        if (retVal < 0) retVal = 0
                        if (retVal > 1) retVal = 1
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
                      { value: 25, label: '25%' },
                      { value: 50, label: '50%' },
                      { value: 75, label: '75%' },
                      { value: 100, label: '100%' },
                    ]}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                  />
                </Grid2>
                <Grid2 xs={3}>
                  <TextField
                    value={((ore.percent as number) * 100).toFixed(0)}
                    sx={styles.numfields}
                    disabled={ore.ore === ShipOreEnum.Inertmaterial}
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
        <DialogActions sx={{ background: theme.palette.primary.main }}>
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            <Button color="error" onClick={onClose} variant="contained" startIcon={<Cancel />}>
              Cancel
            </Button>
            <div style={{ flexGrow: 1 }} />
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
