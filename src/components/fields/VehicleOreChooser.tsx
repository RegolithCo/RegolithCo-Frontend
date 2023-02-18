import React from 'react'
import { ToggleButton, Tooltip, useTheme } from '@mui/material'
import { lookups, MarketPriceLookupValue, VehicleOreEnum, getVehicleOreName } from '@regolithco/common'
import Gradient from 'javascript-color-gradient'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Clear } from '@mui/icons-material'

export interface VehicleOreChooserProps {
  multiple?: boolean
  requireValue?: boolean
  values?: VehicleOreEnum[]
  onChange?: (value: VehicleOreEnum[]) => void
}

export const VehicleOreChooser: React.FC<VehicleOreChooserProps> = ({ multiple, onChange, values, requireValue }) => {
  const [selected, setSelected] = React.useState<VehicleOreEnum[]>(values || [])
  const theme = useTheme()
  const vehicleRowKeys = Object.values(VehicleOreEnum)
  const bgColors = new Gradient()
    .setColorGradient(theme.palette.secondary.main, theme.palette.primary.light)
    .setMidpoint(vehicleRowKeys.length) // 100 is the number of colors to generate. Should be enough stops for our ores
    .getColors()
  const fgColors = bgColors.map((color) => theme.palette.getContrastText(color))
  // Sort descendng value
  vehicleRowKeys.sort((a, b) => {
    const aPrice = lookups.marketPriceLookup[a] as MarketPriceLookupValue
    const bPrice = lookups.marketPriceLookup[b] as MarketPriceLookupValue
    return bPrice.refined - aPrice.refined
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
                opacity: 0.7,
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
      {!requireValue && (
        <Grid xs={3}>
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
            <Clear />
          </ToggleButton>
        </Grid>
      )}
    </Grid>
  )
}
