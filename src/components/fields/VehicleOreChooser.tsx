import React from 'react'
import { alpha, ToggleButton, Tooltip, useTheme } from '@mui/material'
import { VehicleOreEnum, getVehicleOreName } from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { useVehicleOreColors } from '../../hooks/useVehicleOreColors'

export interface VehicleOreChooserProps {
  multiple?: boolean
  requireValue?: boolean
  showAllBtn?: boolean
  showNoneBtn?: boolean
  values?: VehicleOreEnum[]
  onChange?: (value: VehicleOreEnum[]) => void
  onClick?: (value: VehicleOreEnum) => void
}

export const VehicleOreChooser: React.FC<VehicleOreChooserProps> = ({
  multiple,
  onChange,
  onClick,
  values,
  showAllBtn,
  showNoneBtn,
  requireValue,
}) => {
  const [selected, setSelected] = React.useState<VehicleOreEnum[]>(values || [])
  const theme = useTheme()
  const vehicleOreColors = useVehicleOreColors()
  // If you pass undefined as values then it will be treated as an empty array
  // and we will treat this as buttons instead of toggle values
  const isToggleButtons = Array.isArray(values)

  return (
    <Grid container spacing={0.5}>
      {vehicleOreColors.map(({ bg, fg, ore }, rowIdx) => {
        const active = isToggleButtons ? selected.includes(ore) : true
        return (
          <Grid xs={3} key={`grid-${rowIdx}`}>
            <ToggleButton
              value={ore}
              fullWidth
              tabIndex={-1}
              selected={active}
              size="small"
              key={`tbutt-${ore}`}
              onClick={(e, value) => {
                onClick && onClick(value)
              }}
              onChange={() => {
                let newValue: VehicleOreEnum[] = []
                if (isToggleButtons) {
                  if (!active) {
                    if (multiple) {
                      newValue = [...selected, ore]
                    } else {
                      newValue = [ore]
                    }
                  } else {
                    newValue = selected.filter((v) => v !== ore)
                  }
                  if (requireValue && newValue.length === 0) {
                    return
                  }
                  setSelected(newValue)
                }
                onChange && onChange(newValue)
              }}
              sx={{
                backgroundColor: alpha(bg, 0.4),
                border: '2px solid transparent',
                color: fg,
                fontSize: {
                  xs: 12,
                  sm: 12,
                  md: 12,
                },
                p: [0.5, 0.5],
                '&:hover': {
                  color: 'white',
                  border: '2px solid white',
                  opacity: 1,
                },
                '&.Mui-selected, &.Mui-selected:hover': {
                  color: fg,
                  border: '2px solid white',
                  backgroundColor: bg,
                },
              }}
            >
              {getVehicleOreName(ore)}
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
                setSelected(vehicleOreColors.map((v) => v.ore))
                onChange && onChange(vehicleOreColors.map((v) => v.ore))
              }}
            >
              All
            </ToggleButton>
          </Tooltip>
        </Grid>
      )}
      {!requireValue && showNoneBtn && (
        <Grid xs={3}>
          <Tooltip title="Remove all selected ores">
            <ToggleButton
              value={''}
              size="small"
              fullWidth
              tabIndex={-1}
              sx={{
                border: `1px solid ${theme.palette.error.dark}}`,
                color: theme.palette.error.main,
                fontSize: {
                  xs: 12,
                  sm: 12,
                  md: 12,
                },
                p: [0.5, 0.5],
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
