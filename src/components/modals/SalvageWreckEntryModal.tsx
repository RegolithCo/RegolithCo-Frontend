import * as React from 'react'

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  InputAdornment,
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
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
  Grid,
} from '@mui/material'
import {
  AnyOreEnum,
  findPrice,
  getOreName,
  getSalvageOreName,
  SalvageOreEnum,
  SalvageWreck,
  SalvageWreckOre,
  WreckStateEnum,
} from '@regolithco/common'
import { ClawIcon } from '../../icons'
import { MValue, MValueFormat } from '../fields/MValue'
import { fontFamilies } from '../../theme'
import { Cancel, Delete, Rocket, Save } from '@mui/icons-material'
import { DeleteModal } from './DeleteModal'
import Numeral from 'numeral'
import { LookupsContext } from '../../context/lookupsContext'
import { VehicleChooser } from '../fields/VehicleChooser'
// import log from 'loglevel'

export const SHIP_ROCK_BOUNDS = [1, 200000]

export interface SalvageWreckEntryModalProps {
  open?: boolean
  isNew?: boolean
  wreck?: SalvageWreck
  onClose: () => void
  onDelete?: () => void
  onSubmit?: (newRock: SalvageWreck) => void
}

const styleThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  paper: {
    '& .MuiDialog-paper': {
      overflow: 'hidden',
      height: '100%',
      [theme.breakpoints.up('md')]: {
        overflow: 'visible',
        minHeight: 450,
        maxHeight: 600,
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

export const SalvageWreckEntryModal: React.FC<SalvageWreckEntryModalProps> = ({
  open,
  isNew,
  wreck,
  onClose,
  onDelete,
  onSubmit,
}) => {
  const theme = useTheme()
  const styles = styleThunk(theme)
  const dataStore = React.useContext(LookupsContext)

  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const [[value, volume], setValueVolume] = React.useState<[number, number]>([0, 0])
  const [prices, setPrices] = React.useState<{
    [key in SalvageOreEnum]?: number
  }>({})
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)
  const [inputRefs, setInputRefs] = React.useState<Record<string, React.RefObject<HTMLInputElement | null>>>({})
  const sortOres = React.useCallback((ores: SalvageWreckOre[]): SalvageWreckOre[] => {
    const newOres = [...(ores || [])]
    newOres.sort((a, b) => {
      const aPrice = prices[newOres.indexOf(a)]
      const bPrice = prices[newOres.indexOf(b)]
      return bPrice - aPrice
    })
    return newOres
  }, [])

  const [newWreck, _setNewWreck] = React.useState<SalvageWreck>(
    !isNew && wreck
      ? wreck
      : ({
          state: WreckStateEnum.Ready,
          isShip: true,
          salvageOres: sortOres(Object.values(SalvageOreEnum).map((ore) => ({ ore, scu: 0 }) as SalvageWreckOre)),
          sellableAUEC: null,
          shipCode: null,
          __typename: 'SalvageWreck',
        } as SalvageWreck)
  )

  React.useEffect(() => {
    if (open && wreck) {
      setNewWreck(wreck)
    }
  }, [open, wreck])

  const setNewWreck = React.useCallback(
    async (newWreck: SalvageWreck) => {
      if (!newWreck || !dataStore.ready) return
      let value = newWreck.sellableAUEC || 0
      let volume = 0
      const newOres = [...(newWreck.salvageOres || [])]
      // Fetch the prices
      const prices = await Promise.all(
        newOres.map((ore) => findPrice(dataStore, ore.ore as SalvageOreEnum, undefined, true))
      )
      setPrices(
        newOres.reduce(
          (acc, ore, idx) => {
            acc[ore.ore] = prices[idx]
            return acc
          },
          {} as { [key in SalvageOreEnum]?: number }
        )
      )
      newOres.forEach((ore) => {
        const price = prices[newOres.indexOf(ore)]
        value += price * (ore.scu || 0)
        volume += ore.scu || 0
      })

      const sortedOres = sortOres(newOres)
      setValueVolume([value, volume])
      _setNewWreck((oldWreck) => {
        return { ...oldWreck, ...newWreck, salvageOres: sortedOres }
      })
    },
    [dataStore]
  )

  // This can be disabled for a whole bunch of reasons
  const disabled = false

  // const sellableAUECError = false
  return (
    <>
      <Dialog
        open={Boolean(open)}
        onClose={onClose}
        sx={styles.paper}
        maxWidth="xs"
        fullScreen={isSmall}
        fullWidth
        onKeyDown={(e) => {
          if (!disabled && e.key === 'Enter') {
            onSubmit && onSubmit(newWreck)
            onClose()
          }
        }}
      >
        <ClawIcon sx={styles.icon} />
        <Tooltip
          title={
            <>
              <Typography variant="caption">
                Values are using the maximum price in all systems for each element:
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
                    {(newWreck?.salvageOres || []).map(({ scu, ore }, idx) => (
                      <TableRow key={`tt-row-${idx}`}>
                        <TableCell padding="none">{getSalvageOreName(ore as SalvageOreEnum).slice(0, 15)}</TableCell>
                        <TableCell padding="none" align="right">
                          <MValue value={scu} />
                        </TableCell>
                        <TableCell padding="none" align="right">
                          <MValue
                            value={(prices[ore as SalvageOreEnum] || 0) * scu}
                            format={MValueFormat.currency_sm}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell padding="none">Cargo + Comp.</TableCell>
                      <TableCell padding="none" align="right"></TableCell>
                      <TableCell padding="none" align="right">
                        <MValue value={newWreck.sellableAUEC || 0} format={MValueFormat.currency_sm} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter></TableFooter>
                </Table>
              </TableContainer>
            </>
          }
          placement="right"
        >
          <Box sx={styles.headerBar}>
            <Typography variant="h6" sx={styles.cardTitle}>
              Wreck Scan
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
            <Typography variant="caption">All values are meant to be rough estimates and totally optional.</Typography>
          </Alert>
          <Grid container spacing={2} paddingX={0} sx={styles.compositionGrid}>
            <Grid size={{ xs: 5 }}>
              <ToggleButtonGroup
                value={newWreck.isShip}
                exclusive
                // size="small"
                onChange={(e, newIsShip: boolean | null) => {
                  if (newIsShip === null) return
                  setNewWreck({
                    ...newWreck,
                    isShip: newIsShip,
                    shipCode: newIsShip ? newWreck.shipCode : null,
                  })
                }}
                color="primary"
              >
                <ToggleButton value={true} aria-label="centered">
                  <Rocket />
                  Ship
                </ToggleButton>
                <ToggleButton value={false} aria-label="right aligned">
                  Panel
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid size={{ xs: 7 }}>
              <VehicleChooser
                label="Ship being salvaged"
                disabled={!newWreck.isShip}
                vehicle={newWreck.shipCode as string | undefined}
                onChange={(newVehicle) => {
                  setNewWreck({ ...newWreck, shipCode: newVehicle ? newVehicle.UEXID : null })
                }}
              />
            </Grid>
          </Grid>
          <Typography variant="overline" sx={styles.headTitles} component="div">
            Composition
          </Typography>

          <Box sx={{ mb: 2 }}>
            {newWreck.salvageOres.map((ore, idx) => {
              const oreName = ore.ore
              if (!inputRefs[oreName]) {
                inputRefs[oreName] = React.createRef()
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
                  <Box sx={{ flex: '1 0 60%' }}>
                    <Tooltip title={getOreName(oreName as AnyOreEnum)} placement="right">
                      <Box sx={styles.sliderOreName}>
                        {ore.ore}
                        {/* {getSalvageOreName(oreName)} ({oreName}) */}
                      </Box>
                    </Tooltip>
                  </Box>
                  <Box sx={{ flex: '1 0 30%' }}>
                    <TextField
                      inputRef={inputRefs[oreName]}
                      value={Numeral(ore.scu || 0).format(`0,0`)}
                      sx={styles.numfields}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">SCU</InputAdornment>,
                      }}
                      onBlur={() => {
                        // setActiveOrePercentText(null)
                      }}
                      onFocus={(event) => {
                        // if (ore.percent > 0)
                        //   setActiveOrePercentText([idx, parseNum(((ore.percent as number) * 100).toFixed(2), 2, 2)])
                        // inputRefs[oreName]?.current?.select()
                        event.target.select()
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === 'Tab') {
                          const newIdx = event.shiftKey ? idx - 1 : idx + 1
                          if (newIdx >= 0 && newIdx < newWreck.salvageOres.length) {
                            event.preventDefault()
                            const inputRef = inputRefs[newWreck.salvageOres[newIdx].ore]?.current

                            // setActiveOrePercentText(null)
                            inputRef?.focus()
                            inputRef?.select()
                          }
                        }
                      }}
                      onChange={(event) => {
                        const rawValue = parseInt(event.target.value.replace(/[^\d.]/g, '').replace(/^0+/, '')) || 0
                        if (rawValue < 0) return
                        if (rawValue > 5000) return

                        const newOres = newWreck.salvageOres?.map((ore) => {
                          let retVal = ore.scu
                          if (retVal < 0) retVal = 0
                          if (retVal > 1) retVal = 1
                          if (ore.ore === oreName) {
                            return { ...ore, scu: rawValue }
                          }
                          return ore
                        })
                        // setActiveOrePercentText([idx, parseNum(event.target.value, 2, 2)])
                        setNewWreck({ ...newWreck, salvageOres: newOres })
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Stack>
              )
            })}
            <Divider />

            <Stack direction={'row'} spacing={3} sx={{ width: '100%', mb: 2 }} alignItems={'center'}>
              <Box sx={{ flex: '1 0 50%' }}>
                <Tooltip
                  title={'A rough estimate of the value of the components + cargo of this wreck'}
                  placement="right"
                >
                  <Box sx={styles.sliderOreName}>Cargo + Components</Box>
                </Tooltip>
              </Box>
              <Box sx={{ flex: '1 0 40%' }}>
                <TextField
                  value={Numeral(newWreck.sellableAUEC || 0).format(`0,0`)}
                  sx={styles.numfields}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">aUEC</InputAdornment>,
                  }}
                  onBlur={() => {
                    // setActiveOrePercentText(null)
                  }}
                  onFocus={(event) => {
                    // if (ore.percent > 0)
                    //   setActiveOrePercentText([idx, parseNum(((ore.percent as number) * 100).toFixed(2), 2, 2)])
                    // inputRefs[ore.ore]?.current?.select()
                    // event.target.select()
                  }}
                  onKeyDown={(event) => {
                    // if (event.key === 'Enter' || event.key === 'Tab') {
                    //   const newIdx = event.shiftKey ? idx - 1 : idx + 1
                    //   if (newIdx >= 0 && newIdx < ores.length) {
                    //     event.preventDefault()
                    //     const inputRef = inputRefs[ores[newIdx].ore]?.current
                    //     setActiveOrePercentText(null)
                    //     inputRef?.focus()
                    //     inputRef?.select()
                    //   }
                    // }
                  }}
                  onChange={(event) => {
                    const rawValue = parseInt(event.target.value.replace(/[^\d.]/g, '').replace(/^0+/, '')) || 0
                    if (rawValue < 0) return
                    if (rawValue > 50000000) return
                    setNewWreck({ ...newWreck, sellableAUEC: rawValue })
                  }}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Stack>
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
                onSubmit && onSubmit(newWreck)
                onClose()
              }}
            >
              Save
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
      <DeleteModal
        title="Delete Wreck Scan"
        message="Are you sure you want to delete this wreck?"
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
