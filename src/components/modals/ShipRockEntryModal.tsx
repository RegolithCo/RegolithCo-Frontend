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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Theme,
  ThemeProvider,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
} from '@mui/material'
import {
  AnyOreEnum,
  findPrice,
  FindSummary,
  getOreName,
  getShipOreAbbrev,
  getShipOreName,
  jsRound,
  RockStateEnum,
  RockType,
  ShipOreEnum,
  ShipRock,
  shipRockCalc,
  ShipRockOre,
} from '@regolithco/common'
import { ShipOreChooser } from '../fields/ShipOreChooser'
import { RockIcon } from '../../icons'
import { MValue, MValueFormat } from '../fields/MValue'
import { fontFamilies, theme as themeOrig } from '../../theme'
import { Cancel, Delete, Save } from '@mui/icons-material'
import { isEqual } from 'lodash'
import { DeleteModal } from './DeleteModal'
import Numeral from 'numeral'
import log from 'loglevel'
import { LookupsContext } from '../../context/lookupsContext'
import { RockTypeChooser } from '../fields/RockTypeChooser'

export const SHIP_ROCK_BOUNDS = [1, 200000]

export interface ShipRockEntryModalProps {
  open?: boolean
  isNew?: boolean
  shipRock?: ShipRock
  defaultRockType?: RockType
  onClose: () => void
  onDelete?: () => void
  onSubmit?: (newRock: ShipRock) => void
}

const styleThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  paper: {
    '& .MuiDialog-paper': {
      overflow: 'hidden',
      height: '100%',
      [theme.breakpoints.up('md')]: {
        overflow: 'visible',
        minHeight: 550,
        maxHeight: 900,
        borderRadius: 4,
        outline: `10px solid ${theme.palette.primary.contrastText}`,
        border: `10px solid ${theme.palette.primary.main}`,
      },
      backgroundColor: '#282828ee',
      backgroundImage: 'none',
      position: 'relative',
    },
  },
  dialogContent: {
    py: 1,
    px: 2,
    [theme.breakpoints.up('md')]: {
      borderRadius: 3,
      outline: `10px solid ${theme.palette.primary.main}`,
    },
  },
  headTitles: {
    // fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
    // lineHeight: 1.5,
    fontSize: '0.8rem',
    color: theme.palette.secondary.light,
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
    textTransform: 'uppercase',
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

function parseNum(inputVal: string, numDecimals: number, numDigits: number) {
  if (inputVal === '') return ''
  else if (inputVal === '0') return '0'
  const parsedVal = inputVal
    // Europeans might not be happy with this but we need to keep the standard
    .replace(/[,]/g, '.')
    // Replace the second occurance of a period with an empty string
    .replace(/(\..*)(\.)/g, '$1')
    .replace(/[^0-9.]/g, '')
    .replace(/^0+/, '')
    .split('.')
  // limit the number of digits after the decimal to 2 and the number of digits before the decimal to 3
  if (parsedVal.length > 0) parsedVal[0] = parsedVal[0].slice(0, numDigits)
  if (parsedVal.length > 1) parsedVal[1] = parsedVal[1].slice(0, numDecimals)
  return parsedVal.join('.')
}

export const ShipRockEntryModal: React.FC<ShipRockEntryModalProps> = ({
  open,
  isNew,
  shipRock,
  defaultRockType,
  onClose,
  onDelete,
  onSubmit,
}) => {
  const theme = useTheme()
  const styles = styleThunk(theme)
  const dataStore = React.useContext(LookupsContext)
  const [ores, setOres] = React.useState<ShipRockOre[]>([])
  const [oreProps, setOreProps] = React.useState<[number, number, number, Partial<Record<AnyOreEnum, FindSummary>>]>([
    0,
    0,
    0,
    {},
  ])

  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)
  const [activeOrePercentText, setActiveOrePercentText] = React.useState<[number, string] | null>(null)
  const [inputRefs, setInputRefs] = React.useState<Record<string, React.RefObject<HTMLInputElement | null>>>(
    {} as Record<string, React.RefObject<HTMLInputElement | null>>
  )

  const [newShipRock, _setNewShipRock] = React.useState<ShipRock>(
    !isNew && shipRock
      ? shipRock
      : { state: RockStateEnum.Ready, mass: 0, rockType: defaultRockType, ores: [], __typename: 'ShipRock' }
  )
  const [instTextValue, setInstTextValue] = React.useState<string>(shipRock?.inst ? shipRock.inst.toFixed(2) : '')
  const [resTextValue, setResTextValue] = React.useState<string>(shipRock?.res ? (shipRock.res * 100).toFixed(0) : '')

  const instabilkityF = instTextValue.length > 0 ? parseFloat(instTextValue) : null
  const instabilityError =
    instabilkityF === null || instabilkityF < 0 || instabilkityF >= 1000 ? 'Instability must be >= 0' : null

  const resistanceF = resTextValue.length > 0 ? parseFloat(resTextValue) : null
  const resistanceError =
    resTextValue.trim().length === 0 ||
    resistanceF === null ||
    resistanceF < 0 ||
    resistanceF >= 100 ||
    resistanceF.toString() !== resTextValue
      ? 'Resistance must be between 0 and 100%'
      : null

  const setNewShipRock = React.useCallback(
    async (newRock: ShipRock) => {
      if (!newRock || !dataStore.ready) return
      const newOres = [...(newRock.ores || []).filter(({ ore }) => ore !== ShipOreEnum.Inertmaterial)]
      // Set the entry for ShipOreEnum.Inertmaterial to be 1- the sum of all other ores
      const total = newOres.reduce(
        (acc, { ore, percent }) => (ore === ShipOreEnum.Inertmaterial ? acc : acc + percent),
        0
      )
      newOres.push({ ore: ShipOreEnum.Inertmaterial, percent: 1 - total, __typename: 'ShipRockOre' })
      // Fetch the prices
      const prices = await Promise.all(
        newOres.map((ore) => findPrice(dataStore, ore.ore as ShipOreEnum, undefined, true))
      )
      newOres.sort((a, b) => {
        const aPrice = prices[newOres.indexOf(a)]
        const bPrice = prices[newOres.indexOf(b)]
        return bPrice - aPrice
      })
      _setNewShipRock((oldRock) => {
        return { ...oldRock, ...newRock, ores: newOres }
      })
    },
    [dataStore]
  )

  React.useEffect(() => {
    if (!setNewShipRock || !shipRock) return
    if (!isEqual(shipRock, newShipRock)) {
      setNewShipRock(shipRock)
    }
  }, [shipRock, setNewShipRock])

  React.useEffect(() => {
    const calcOreProps = async () => {
      try {
        const {
          rock: { volume, value },
          byOre,
        } = await shipRockCalc(dataStore, newShipRock)
        const percentTotal = (newShipRock.ores || [])
          .filter(({ ore }) => ore !== ShipOreEnum.Inertmaterial)
          .reduce((acc, { percent }) => acc + percent, 0)
        setOreProps([volume, Number(value), percentTotal, byOre])
      } catch (e) {
        log.error(e)
        return [0, 0, 0, {}]
      }
    }
    calcOreProps()
  }, [newShipRock])

  React.useEffect(() => {
    if (!dataStore.ready) return
    const calcOres = async () => {
      const newOres = await Promise.all(
        (newShipRock.ores || []).map(async (ore) => {
          const price = await findPrice(dataStore, ore.ore as ShipOreEnum, undefined, true)
          return { ...ore, price }
        })
      )
      newOres.sort(({ price: priceA }, { price: priceB }) => priceB - priceA)
      setOres(newOres)
    }
    calcOres()
  }, [newShipRock, dataStore])

  if (!oreProps || !ores || !dataStore.ready) return <div>Loading...</div>
  // NO HOOKS BELOW HERE
  const [volume, value, percentTotal, byOre] = oreProps || [0, 0, 0, {}]

  // This can be disabled for a whole bunch of reasons
  const disabled =
    !newShipRock.mass ||
    Boolean(instabilityError) ||
    Boolean(resistanceError) ||
    !newShipRock.ores ||
    !newShipRock.ores.length ||
    newShipRock.mass <= SHIP_ROCK_BOUNDS[0] ||
    newShipRock.mass > SHIP_ROCK_BOUNDS[1] ||
    Boolean(percentTotal && percentTotal > 1) ||
    Boolean(percentTotal === 0)

  let massErrorReason = ''
  if (!newShipRock.mass) massErrorReason = 'Mass is required'
  else if (newShipRock.mass <= SHIP_ROCK_BOUNDS[0] || newShipRock.mass > SHIP_ROCK_BOUNDS[1]) {
    massErrorReason = `Mass must be between ${Numeral(Number(SHIP_ROCK_BOUNDS[0])).format('0,0')} and ${Numeral(
      Number(SHIP_ROCK_BOUNDS[1])
    ).format('0,0')} tonnes`
  }
  const massError = Boolean(massErrorReason.length > 0)
  return (
    <>
      <Dialog
        open={Boolean(open)}
        onClose={onClose}
        sx={styles.paper}
        maxWidth="xs"
        fullScreen={isSmall}
        onKeyDown={(e) => {
          if (!disabled && e.key === 'Enter') {
            onSubmit && onSubmit(newShipRock)
            onClose()
          }
        }}
      >
        <RockIcon sx={styles.icon} />
        <Tooltip
          title={
            <>
              <Typography variant="caption">
                Values are after refining, using Dinyx Solventation and at the maximum stanton price for each element:
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="none">Ore</TableCell>
                      <TableCell padding="none" align="right">
                        SCU
                      </TableCell>
                      <TableCell padding="none" align="right">
                        aUEC
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(byOre || {}).map(([ore, { value: oreValue, volume: oreVolume }], idx) => (
                      <TableRow key={`tt-row-${idx}`}>
                        <TableCell padding="none">{getShipOreName(ore as ShipOreEnum)}</TableCell>
                        <TableCell padding="none" align="right">
                          <MValue value={oreVolume} />
                        </TableCell>
                        <TableCell padding="none" align="right">
                          <MValue value={oreValue} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow
                      sx={{
                        '& > *': {
                          borderTop: '2px solid black',
                          color: 'white',
                          fontWeight: 'bold',
                        },
                      }}
                    >
                      <TableCell padding="none">Total</TableCell>
                      <TableCell padding="none" align="right">
                        <MValue value={volume} />
                      </TableCell>
                      <TableCell padding="none" align="right">
                        <MValue value={value} />
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </>
          }
          placement="right"
        >
          <Box sx={styles.headerBar}>
            <Typography variant="h6" sx={styles.cardTitle}>
              Rock Scan
            </Typography>
            <div style={{ flexGrow: 1 }} />
            <Stack>
              <Typography sx={{ fontWeight: 'bold' }} align="right">
                Value: <MValue value={value} format={MValueFormat.currency_sm} />
              </Typography>

              <Typography sx={{ fontWeight: 'bold' }} align="right">
                Material: <MValue value={volume} format={MValueFormat.volSCU} decimals={volume > 10 ? 0 : 1} />
              </Typography>
            </Stack>
          </Box>
        </Tooltip>
        <DialogContent sx={styles.dialogContent}>
          <Alert severity="warning">
            <Typography variant="caption">Enter all minerals for maximum SCU and value accuracy.</Typography>
          </Alert>

          {/* These are the fields for the rock */}
          <Typography variant="overline" sx={styles.headTitles} component="div">
            Properties
          </Typography>
          <Box
            sx={{
              mx: 2,
              mb: 1,
              '& .MuiInputAdornment-positionStart *': {
                color: theme.palette.text.secondary,
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
                textTransform: 'uppercase',
              },
              '& .MuiInputAdornment-positionEnd *': {
                color: theme.palette.secondary.light,
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
              },
              '& .MuiInputBase-root': {
                paddingRight: 0,
              },
              '& .MuiInput-input': {
                textAlign: 'right',
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
                fontSize: 15,
                padding: 0.5,
              },
            }}
          >
            <RockTypeChooser
              onChange={(choice) => setNewShipRock({ ...newShipRock, rockType: choice })}
              value={newShipRock.rockType}
            />
            <TextField
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">Mass</InputAdornment>,
                endAdornment: <InputAdornment position="end">t</InputAdornment>,
              }}
              onFocus={(event) => {
                event.target.select()
              }}
              error={massError}
              helperText={disabled ? massErrorReason : ''}
              value={Numeral(Number(jsRound(newShipRock.mass as number, 0))).format(`0,0`)}
              onChange={(event) => {
                const rawValue = event.target.value.replace(/[^\d.]/g, '').replace(/^0+/, '')
                const value = jsRound(parseInt(rawValue, 10), 0)
                setNewShipRock({ ...newShipRock, mass: value })
              }}
              variant="standard"
              type="text"
            />

            {/* RESISTANCE */}
            <TextField
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">Resistance</InputAdornment>,
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              onFocus={(event) => {
                event.target.select()
              }}
              error={Boolean(resistanceError)}
              helperText={resistanceError}
              value={resTextValue || ''}
              onChange={(event) => {
                const parsedVal = parseNum(event.target.value, 0, 2)
                setResTextValue(parsedVal)
                try {
                  const value = parseInt(parsedVal, 10)
                  if (value <= 100 && value >= 0) setNewShipRock({ ...newShipRock, res: value / 100 })
                } catch (e) {
                  log.error(e)
                }
              }}
              variant="standard"
              type="text"
            />

            {/* INSTABILITY */}
            <TextField
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start">Instability</InputAdornment>,
                endAdornment: <InputAdornment position="end">&nbsp;</InputAdornment>,
              }}
              onFocus={(event) => {
                event.target.select()
              }}
              error={Boolean(instabilityError)}
              helperText={instabilityError}
              value={instTextValue || ''}
              onChange={(event) => {
                const parsedVal = parseNum(event.target.value, 2, 3)
                setInstTextValue(parsedVal)
                try {
                  const value = jsRound(parseFloat(parsedVal), 2)
                  setNewShipRock({ ...newShipRock, inst: value })
                } catch (e) {
                  log.error(e)
                }
              }}
              variant="standard"
              type="text"
            />
          </Box>
          <Typography variant="overline" sx={styles.headTitles} component="div">
            Composition
          </Typography>
          <Box sx={{ mb: 2 }}>
            <ThemeProvider theme={themeOrig}>
              <ShipOreChooser
                multiple
                showAllBtn
                showNoneBtn
                showInnert
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
            {ores.map((ore, idx) => {
              if (!inputRefs[ore.ore]) {
                inputRefs[ore.ore] = React.createRef()
                setInputRefs({ ...inputRefs })
              }
              return (
                <Stack
                  direction={'row'}
                  spacing={3}
                  key={`ore-${idx}`}
                  sx={{ width: '100%', mb: 2 }}
                  alignItems={'center'}
                >
                  <Box sx={{ flex: '1 0 10%' }}>
                    <Tooltip title={getOreName(ore.ore as AnyOreEnum)} placement="right">
                      <Box sx={styles.sliderOreName}>{getShipOreAbbrev(ore.ore as ShipOreEnum, 4)}</Box>
                    </Tooltip>
                  </Box>
                  <Box sx={{ flex: '1 1 65%' }}>
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
                          let retVal = Math.round(newValue * 100 + Number.EPSILON) / 10000
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
                  </Box>
                  <Box sx={{ flex: '1 0 25%' }}>
                    <TextField
                      inputRef={inputRefs[ore.ore]}
                      value={
                        activeOrePercentText && activeOrePercentText[0] === idx
                          ? activeOrePercentText[1]
                          : ore.percent > 0
                            ? ((ore.percent as number) * 100).toFixed(2)
                            : '0'
                      }
                      sx={styles.numfields}
                      disabled={ore.ore === ShipOreEnum.Inertmaterial}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      onBlur={() => {
                        setActiveOrePercentText(null)
                      }}
                      onFocus={(event) => {
                        if (ore.percent > 0)
                          setActiveOrePercentText([idx, parseNum(((ore.percent as number) * 100).toFixed(2), 2, 2)])
                        // inputRefs[ore.ore]?.current?.select()
                        event.target.select()
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Tab') {
                          const newIdx = event.shiftKey ? idx - 1 : idx + 1
                          if (newIdx >= 0 && newIdx < ores.length) {
                            event.preventDefault()
                            const inputRef = inputRefs[ores[newIdx].ore]?.current

                            setActiveOrePercentText(null)
                            inputRef?.focus()
                            inputRef?.select()
                          }
                        }
                      }}
                      onChange={(event) => {
                        const parsedVal = parseNum(event.target.value, 2, 2)
                        const newOres = newShipRock.ores?.map((o) => {
                          let retVal = Math.round(Number(parsedVal) * 100 + Number.EPSILON) / 10000
                          if (retVal < 0) retVal = 0
                          if (retVal > 1) retVal = 1
                          if (o.ore === ore.ore) {
                            return { ...o, percent: retVal }
                          }
                          return o
                        })
                        setActiveOrePercentText([idx, parseNum(event.target.value, 2, 2)])
                        setNewShipRock({ ...newShipRock, ores: newOres })
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Stack>
              )
            })}
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
