import React, { useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TextField,
  Box,
  useTheme,
  keyframes,
  SxProps,
  Theme,
} from '@mui/material'
import {
  ActivityEnum,
  RefineryEnum,
  RefineryMethodEnum,
  RefineryRow,
  ShipMiningOrder,
  ShipOreEnum,
  VehicleMiningOrder,
  VehicleMiningRow,
  VehicleOreEnum,
  WorkOrder,
  WorkOrderSummary,
  oreAmtCalc,
  getOreName,
  SalvageRow,
  SalvageOreEnum,
  SalvageOrder,
  findPrice,
} from '@regolithco/common'
import { MValue } from '../../../fields/MValue'
import { RefineryControl } from '../../../fields/RefineryControl'
import { RefineryMethodControl } from '../../../fields/RefiningMethodControl'
import { WorkOrderCalcProps } from '../WorkOrderCalc'
import { ShipOreChooser } from '../../../fields/ShipOreChooser'
import { VehicleOreChooser } from '../../../fields/VehicleOreChooser'
import { SalvageOreChooser } from '../../../fields/SalvageOreChooser'

import log from 'loglevel'
import { fontFamilies } from '../../../../theme'
import { RefineryProgress } from '../../../fields/RefineryProgress'
import { RefineryProgressShare } from '../../../fields/RefineryProgressShare'
import { LookupsContext } from '../../../../context/lookupsContext'

export type OreCardProps = WorkOrderCalcProps & {
  summary: WorkOrderSummary
}

const stylesThunk = (theme: Theme, isCalculator?: boolean): Record<string, SxProps<Theme>> => ({
  title: {
    display: 'flex',
    fontFamily: fontFamilies.robotoMono,
    overflow: 'hidden',
    fontWeight: 'bold',
    fontSize: {
      xs: '0.7rem',
      md: '0.8rem',
      lg: '0.9rem',
    },
  },
  cardContent: {
    display: 'flex',
    flex: '1 1',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: { md: 'scroll', lg: isCalculator ? 'visible' : 'scroll' },
  },
  table: {
    '& *': {
      fontFamily: fontFamilies.robotoMono,
      fontSize: {
        // lg: '0.8rem',
        // sm: '0.7rem',
        // xs: '0.6rem',
      },
    },
  },
})

export const OreCard: React.FC<OreCardProps> = ({
  workOrder,
  summary,
  onChange,
  isShare,
  isCalculator,
  allowEdit,
  templateJob,
  isEditing,
  sx,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme, isCalculator)
  const [editCell, setEditCell] = React.useState<[string, boolean]>()
  const dataStore = React.useContext(LookupsContext)
  const [oreTableRows, setOreTableRows] = React.useState<[string, { collected: number; refined: number }][]>([])
  const editCellOre = editCell ? editCell[0] : null
  const editCellQty = editCell ? editCell[1] : null

  const shipOrder = workOrder as ShipMiningOrder
  const vehicleOrder = workOrder as VehicleMiningOrder
  const salvageOrder = workOrder as SalvageOrder

  const pulse = keyframes`
    0% { background-color: transparent; }
    70% { background-color:  ${theme.palette.warning.light}44; }
    100% { background-color: transparent; }
  `
  const pulseCssThunk = (doPulse: boolean): SxProps<Theme> => ({
    animation: doPulse ? `${pulse} 2s infinite ease` : '',
    backgroundColor: 'transparent',
  })
  // helpful permissions variables
  const isRefineryLocked = (templateJob?.lockedFields || [])?.includes('isRefined')
  const isRefineryMethodLocked = (templateJob?.lockedFields || [])?.includes('method')

  // Creating and sorting the ore table rows shouldn't happen on every render. It's expensive.
  useEffect(() => {
    const calcOreTableRows = async () => {
      if (!dataStore.ready) return
      const newOreTableRows = Object.entries(summary?.oreSummary || [])
      const prices = await Promise.all(newOreTableRows.map(([oreKey]) => findPrice(dataStore, oreKey as ShipOreEnum)))
      newOreTableRows.sort(([a, { refined: ra }], [b, { refined: rb }]) => {
        const aPrice = prices[newOreTableRows.findIndex(([oreKey]) => oreKey === a)]
        const bPrice = prices[newOreTableRows.findIndex(([oreKey]) => oreKey === b)]
        // Sort the ore by price. The refinery sorts by value of the ore, but that would create chaos while the user
        // is editing the ore amounts. So we sort by the price of the ore.
        if (isEditing) return aPrice - bPrice
        else return rb * bPrice - ra * aPrice
      })
      setOreTableRows(newOreTableRows)
    }
    calcOreTableRows()
  }, [summary.oreSummary, isEditing])

  const oreAmtCalcWrapped = React.useCallback<
    (amt: number, ore: ShipOreEnum, refinery: RefineryEnum, method: RefineryMethodEnum) => Promise<number>
  >(
    (amt: number, ore: ShipOreEnum, refinery: RefineryEnum, method: RefineryMethodEnum) => {
      if (dataStore.ready) return oreAmtCalc(dataStore, amt, ore, refinery, method)
      else return Promise.resolve(0)
    },
    [dataStore]
  )

  let unit = 'SCU'
  switch (workOrder.orderType) {
    case ActivityEnum.ShipMining:
      unit = 'cSCU'
      break
    case ActivityEnum.VehicleMining:
      unit = 'mSCU'
      break
    case ActivityEnum.Salvage:
      unit = 'SCU'
      break
  }

  if (!oreAmtCalcWrapped || !dataStore.ready) return null
  return (
    <Card sx={sx}>
      <CardHeader
        sx={{
          flex: '0 0',
          padding: 1.5,
          color: theme.palette.secondary.contrastText,
          backgroundColor: theme.palette.secondary.light,
        }}
        title={
          <Box sx={styles.title}>
            {(workOrder.orderType !== ActivityEnum.ShipMining || !shipOrder.isRefined) && (
              <>
                {workOrder.orderType === ActivityEnum.ShipMining && 'Raw Ore'}
                {workOrder.orderType === ActivityEnum.VehicleMining && 'Mineable Gems'}
                {workOrder.orderType === ActivityEnum.Salvage && 'Salvage'}
              </>
            )}
            {workOrder.orderType === ActivityEnum.ShipMining && shipOrder.isRefined && (
              <RefineryControl
                value={shipOrder.refinery || RefineryEnum.Arcl1}
                disabled={!isEditing || isRefineryLocked}
                onChange={(refinery) => {
                  refinery && onChange({ ...shipOrder, refinery })
                }}
              />
            )}
          </Box>
        }
        subheaderTypographyProps={{ color: 'inherit' }}
      />
      <CardContent sx={styles.cardContent}>
        {workOrder.orderType === ActivityEnum.ShipMining && shipOrder.isRefined && (
          <RefineryMethodControl
            value={shipOrder.method || RefineryMethodEnum.DinyxSolventation}
            disabled={!isEditing || isRefineryMethodLocked}
            onChange={(method) => {
              method && onChange({ ...shipOrder, method })
            }}
          />
        )}
        {isEditing && workOrder.orderType === ActivityEnum.ShipMining && (
          <ShipOreChooser
            multiple
            showAllBtn
            showNoneBtn
            showInnert
            values={(shipOrder.shipOres as RefineryRow[])?.map(({ ore }) => ore) || []}
            onChange={(oreChoices) => {
              const oldOres: RefineryRow[] = (shipOrder.shipOres as RefineryRow[]) || []
              const newOres: RefineryRow[] = oreChoices.map((oreChoice) => ({
                ore: oreChoice,
                amt: oldOres.find(({ ore }) => ore === oreChoice)?.amt || 0,
                yield: 0, // NOTE: we calculate yield on the fly in the app
                __typename: 'RefineryRow',
              }))
              onChange({ ...shipOrder, shipOres: newOres })
            }}
          />
        )}
        {isEditing && workOrder.orderType === ActivityEnum.VehicleMining && (
          <VehicleOreChooser
            multiple
            values={(vehicleOrder.vehicleOres as VehicleMiningRow[])?.map(({ ore }) => ore) || []}
            onChange={(oreChoices) => {
              const oldvehicleOres: VehicleMiningRow[] = (vehicleOrder.vehicleOres as VehicleMiningRow[]) || []
              const newvehicleOres: VehicleMiningRow[] = oreChoices.map((oreChoice) => ({
                ore: oreChoice,
                amt: oldvehicleOres.find(({ ore }) => ore === oreChoice)?.amt || 0,
                __typename: 'VehicleMiningRow',
              }))
              onChange({ ...vehicleOrder, vehicleOres: newvehicleOres })
            }}
          />
        )}
        {isEditing && workOrder.orderType === ActivityEnum.Salvage && (
          <SalvageOreChooser
            multiple
            values={(salvageOrder.salvageOres as SalvageRow[])?.map(({ ore }) => ore) || []}
            onChange={(oreChoices) => {
              const oldSalvageOres: SalvageRow[] = (salvageOrder.salvageOres as SalvageRow[]) || []
              const newSalvageOres: SalvageRow[] = oreChoices.map((oreChoice) => ({
                ore: oreChoice,
                amt: oldSalvageOres.find(({ ore }) => ore === oreChoice)?.amt || 0,
                __typename: 'SalvageRow',
              }))
              onChange({ ...salvageOrder, salvageOres: newSalvageOres })
            }}
          />
        )}

        {/* To make this more like the SC refinery console we need to give it somespace */}

        <Table size="small" sx={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                sx={{
                  pt: 2,
                  borderBottom: '2px solid',
                  width: '50%',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                Material
              </TableCell>
              <TableCell align="right" sx={{ pt: 2, borderBottom: '2px solid', width: '25%' }}>
                QTY
                <div style={{ fontSize: 11 }}>({unit})</div>
              </TableCell>
              {shipOrder?.isRefined && (
                <TableCell align="right" sx={{ pt: 2, borderBottom: '2px solid', width: '25%' }}>
                  <Typography component="div" variant="tablecell">
                    Yield
                  </Typography>
                  <Typography component="div" variant="tablecell" sx={{ fontSize: 10 }}>
                    (cSCU)
                  </Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {!summary ||
              ((!summary.oreSummary || Object.keys(summary?.oreSummary).length === 0) && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography
                      component="div"
                      variant="subtitle1"
                      sx={{ fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}
                      color="error"
                    >
                      <em>No ore selected</em>
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}

            {/* THIS IS THE MAIN ORE TABLE */}
            {oreTableRows.map(([oreKey, { collected, refined }], idx) => {
              let convertedCollected = 0
              if (workOrder.orderType === ActivityEnum.ShipMining) {
                convertedCollected = collected
              } else if (workOrder.orderType === ActivityEnum.VehicleMining) {
                convertedCollected = collected * 10
              } else if (workOrder.orderType === ActivityEnum.Salvage) {
                convertedCollected = collected / 100
              }

              return (
                <TableRow key={`oreRow-${idx}`}>
                  <TableCell component="th" scope="row">
                    <Typography sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} variant="tablecell">
                      {getOreName(oreKey as ShipOreEnum).toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="right"
                    onClick={() => isEditing && setEditCell([oreKey, true])}
                    sx={isEditing ? pulseCssThunk(convertedCollected === 0 && editCellOre !== oreKey) : undefined}
                  >
                    {editCellOre === oreKey && editCellQty ? (
                      <TextField
                        type="number"
                        autoFocus
                        defaultValue={convertedCollected.toFixed(0)}
                        onFocus={(event) => {
                          event.target.select()
                        }}
                        onChange={(e) =>
                          tableChange(
                            oreKey as ShipOreEnum,
                            shipOrder,
                            onChange,
                            e.target.value,
                            false,
                            workOrder.orderType,
                            oreAmtCalcWrapped
                          )
                        }
                        onBlur={() => setEditCell(undefined)}
                        onKeyDown={(event) => {
                          // This should stop exponents and scientific notation
                          if (event.key === 'e') {
                            event.preventDefault()
                          }
                          if (event.key === 'Enter') {
                            // Set next cell down to edit mode
                            event.preventDefault()
                            setEditCell(oreTableRows.length > idx + 1 ? [oreTableRows[idx + 1][0], true] : undefined)
                          } else if (event.key === 'Tab') {
                            const isShiftPressed = event.shiftKey
                            event.preventDefault()
                            // Set next cell down to edit mode
                            if (isShiftPressed) {
                              const prevIdx = idx - 1
                              setEditCell(prevIdx > 0 ? [oreTableRows[prevIdx][0], true] : undefined)
                            } else {
                              const nextIdx = idx + 1
                              setEditCell(oreTableRows.length > nextIdx ? [oreTableRows[nextIdx][0], true] : undefined)
                            }
                          } else if (event.key === 'Escape') {
                            event.preventDefault()
                            setEditCell(undefined)
                          } else if (event.key.match(/^[0-9]+$/)) {
                            // This is fine. Do nothing
                          } else if (event.key.match(/^[!@#$%^&*()-_+{}[\].,/\\|`~]+$/)) {
                            // Physically stop any other keys being pressed. not a complete set but useful anyway
                            event.preventDefault()
                          }
                        }}
                        inputProps={{
                          sx: {
                            p: 0,
                            textAlign: 'right',
                            fontFamily: fontFamilies.robotoMono,
                          },
                        }}
                      />
                    ) : (
                      <MValue value={convertedCollected} typoProps={{}} />
                    )}
                  </TableCell>
                  {shipOrder?.isRefined && (
                    <TableCell
                      align="right"
                      onClick={() => isEditing && setEditCell([oreKey, false])}
                      sx={isEditing ? pulseCssThunk(refined === 0 && editCellOre !== oreKey) : undefined}
                    >
                      {editCellOre === oreKey && !editCellQty ? (
                        <TextField
                          type="number"
                          autoFocus
                          defaultValue={refined > 0 ? refined.toFixed(0) : 0}
                          onChange={(e) =>
                            tableChange(
                              oreKey as ShipOreEnum,
                              shipOrder,
                              onChange,
                              e.target.value,
                              true,
                              workOrder.orderType,
                              oreAmtCalcWrapped
                            )
                          }
                          onFocus={(event) => {
                            event.target.select()
                          }}
                          onBlur={() => setEditCell(undefined)}
                          onKeyDown={(event) => {
                            // This should stop exponents and scientific notation
                            if (event.key === 'e') {
                              event.preventDefault()
                            }
                            if (event.key === 'Enter') {
                              // Set next cell down to edit mode
                              event.preventDefault()
                              setEditCell(oreTableRows.length > idx + 1 ? [oreTableRows[idx + 1][0], false] : undefined)
                            } else if (event.key === 'Tab') {
                              const isShiftPressed = event.shiftKey
                              event.preventDefault()

                              // Set next cell down to edit mode
                              if (isShiftPressed) {
                                const prevIdx = idx - 1
                                setEditCell(prevIdx > 0 ? [oreTableRows[prevIdx][0], false] : undefined)
                              } else {
                                const nextIdx = idx + 1
                                setEditCell(
                                  oreTableRows.length > nextIdx ? [oreTableRows[nextIdx][0], false] : undefined
                                )
                              }
                            } else if (event.key === 'Escape') {
                              event.preventDefault()
                              setEditCell(undefined)
                            } else if (event.key.match(/^[0-9]+$/)) {
                              // This is fine. Do nothing
                            } else if (event.key.match(/^[!@#$%^&*()-_+{}[\].,/\\|`~]+$/)) {
                              // Physically stop any other keys being pressed. not a complete set but useful anyway
                              event.preventDefault()
                            }
                          }}
                          inputProps={{
                            sx: {
                              p: 0,
                              textAlign: 'right',
                              fontFamily: fontFamilies.robotoMono,
                            },
                          }}
                        />
                      ) : (
                        <MValue value={refined} />
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <Box sx={{ flexGrow: 1 }} />
        {workOrder.orderType === ActivityEnum.ShipMining && shipOrder.isRefined && isShare && (
          <RefineryProgressShare
            startTime={shipOrder.processStartTime as number}
            totalTimeS={shipOrder.processDurationS || 0}
          />
        )}
        {workOrder.orderType === ActivityEnum.ShipMining && shipOrder.isRefined && !isShare && (
          <RefineryProgress
            startTime={shipOrder.processStartTime as number}
            totalTimeS={shipOrder.processDurationS || 0}
            editable={isEditing}
            onChange={(newTime) => onChange({ ...shipOrder, processStartTime: Date.now(), processDurationS: newTime })}
          />
        )}
      </CardContent>
    </Card>
  )
}

const tableChange = async (
  oreKey: string,
  order: WorkOrder,
  onChange: (workOrder: WorkOrder) => void,
  targetVal: string,
  isYield: boolean,
  orderType: ActivityEnum,
  oreAmtCalcWrapped: (
    amt: number,
    ore: ShipOreEnum,
    refinery: RefineryEnum,
    method: RefineryMethodEnum
  ) => Promise<number>
): Promise<void> => {
  let newTargetVal = targetVal
  if (targetVal.trim() === '') {
    newTargetVal = '0'
  }
  try {
    let tValParsed = parseFloat(newTargetVal)
    // remember salvage is done in SCU
    if (orderType === ActivityEnum.Salvage) tValParsed *= 100
    if (tValParsed >= 0) {
      if (order.orderType === ActivityEnum.ShipMining) {
        const shipOre = oreKey as ShipOreEnum
        const shipOrder = order as ShipMiningOrder
        const existingOres: RefineryRow[] = [...((shipOrder.shipOres as RefineryRow[]) || [])]
        const amt = isYield
          ? await oreAmtCalcWrapped(
              tValParsed,
              shipOre,
              shipOrder.refinery as RefineryEnum,
              shipOrder.method as RefineryMethodEnum
            )
          : tValParsed
        const existingRowIdx = existingOres.findIndex((row) => row?.ore === oreKey)

        if (existingRowIdx > -1) {
          existingOres[existingRowIdx] = { ore: shipOre, amt, yield: 0, __typename: 'RefineryRow' }
        } else {
          existingOres.push({ ore: shipOre, amt, yield: 0, __typename: 'RefineryRow' })
        }
        onChange({
          ...shipOrder,
          shipOres: existingOres,
        })
      } else if (order.orderType === ActivityEnum.Salvage) {
        const vehicleOrder = order as SalvageOrder
        const salvageOre = oreKey as SalvageOreEnum
        const existingHaul: SalvageRow[] = [...((vehicleOrder.salvageOres as SalvageRow[]) || [])]
        const existingHaulIdx = existingHaul.findIndex((row) => row?.ore === oreKey)
        if (existingHaulIdx > -1) {
          existingHaul[existingHaulIdx] = { ore: salvageOre, amt: tValParsed, __typename: 'SalvageRow' }
        } else {
          existingHaul.push({ ore: salvageOre, amt: tValParsed, __typename: 'SalvageRow' })
        }
        onChange({
          ...vehicleOrder,
          salvageOres: existingHaul,
        })
      } else {
        const vehicleOrder = order as VehicleMiningOrder
        const vehicleOre = oreKey as VehicleOreEnum
        const existingHaul: VehicleMiningRow[] = [...((vehicleOrder.vehicleOres as VehicleMiningRow[]) || [])]
        const existingHaulIdx = existingHaul.findIndex((row) => row?.ore === oreKey)
        if (existingHaulIdx > -1) {
          existingHaul[existingHaulIdx] = { ore: vehicleOre, amt: tValParsed, __typename: 'VehicleMiningRow' }
        } else {
          existingHaul.push({ ore: vehicleOre, amt: tValParsed, __typename: 'VehicleMiningRow' })
        }
        onChange({
          ...vehicleOrder,
          vehicleOres: existingHaul,
        })
      }
    }
  } catch (e) {
    log.error(e)
  }
}
