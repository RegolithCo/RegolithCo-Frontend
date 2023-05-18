import React from 'react'
import { ToggleButton, Tooltip, useTheme } from '@mui/material'
import { lookups, VehicleOreEnum, getVehicleOreName, findPrice } from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { blue, green } from '@mui/material/colors'

export interface VehicleOreChooserProps {
  multiple?: boolean
  requireValue?: boolean
  showAllBtn?: boolean
  values?: VehicleOreEnum[]
  onChange?: (value: VehicleOreEnum[]) => void
}

export const VehicleOreChooser: React.FC<VehicleOreChooserProps> = ({
  multiple,
  onChange,
  values,
  showAllBtn,
  requireValue,
}) => {
  const [selected, setSelected] = React.useState<VehicleOreEnum[]>(values || [])
  // const theme = useTheme()
  const vehicleRowKeys = Object.values(VehicleOreEnum)
  const bgColors = ['#fff200', '#ff00c3', blue[500], green[500]]
  const fgColors = ['#000000', '#ffffff', '#ffffff']
  // Sort descendng value
  vehicleRowKeys.sort((a, b) => {
    const aPrice = findPrice(a as VehicleOreEnum)
    const bPrice = findPrice(b as VehicleOreEnum)
    return bPrice - aPrice
  })

  return (
    <Grid container spacing={0.5}>
      {vehicleRowKeys.map((vehicleOreKey, rowIdx) => {
        const fgc = fgColors[rowIdx]
        const bgc = bgColors[rowIdx]
        const active = selected.includes(vehicleOreKey)
        return (
          <Grid xs={3} key={`grid-${rowIdx}`}>
            <ToggleButton
              value={vehicleOreKey}
              fullWidth
              tabIndex={-1}
              selected={active}
              size="small"
              key={`tbutt-${vehicleOreKey}`}
              onChange={() => {
                let newValue: VehicleOreEnum[] = []
                if (!active) {
                  if (multiple) {
                    newValue = [...selected, vehicleOreKey]
                  } else {
                    newValue = [vehicleOreKey]
                  }
                } else {
                  newValue = selected.filter((v) => v !== vehicleOreKey)
                }
                if (requireValue && newValue.length === 0) {
                  return
                }
                setSelected(newValue)
                onChange && onChange(newValue)
              }}
              sx={{
                backgroundColor: bgc,
                border: '2px solid transparent',
                color: fgc,
                fontSize: {
                  xs: 10,
                  sm: 10,
                  md: 10,
                },
                opacity: 0.5,
                p: 0,
                '&:hover': {
                  color: 'white',
                  border: '2px solid white',
                  opacity: 1,
                },
                '&.Mui-selected, &.Mui-selected:hover': {
                  color: fgc,
                  border: '2px solid white',
                  opacity: 1,
                  backgroundColor: bgc,
                },
              }}
            >
              {getVehicleOreName(vehicleOreKey)}
            </ToggleButton>
          </Grid>
        )
      })}
      {multiple && showAllBtn && (
        <Grid xs={3}>
          <Tooltip title="Select all ores">
            <ToggleButton
              value={''}
              size="small"
              fullWidth
              tabIndex={-1}
              sx={{
                fontSize: {
                  xs: 10,
                  sm: 10,
                  md: 10,
                },
                p: 0,
              }}
              onChange={() => {
                setSelected(vehicleRowKeys)
                onChange && onChange(vehicleRowKeys)
              }}
            >
              All
            </ToggleButton>
          </Tooltip>
        </Grid>
      )}
      {!requireValue && (
        <Grid xs={3}>
          <Tooltip title="Remove all selected ores">
            <ToggleButton
              value={''}
              size="small"
              fullWidth
              tabIndex={-1}
              sx={{
                fontSize: {
                  xs: 10,
                  sm: 10,
                  md: 10,
                },
                p: 0,
              }}
              onChange={() => {
                setSelected([])
                onChange && onChange([])
              }}
            >
              None
            </ToggleButton>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  )
}
