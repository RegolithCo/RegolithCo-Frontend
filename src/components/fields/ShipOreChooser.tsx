import React, { useEffect } from 'react'
import { ToggleButton, useTheme } from '@mui/material'
import { lookups, MarketPriceLookupValue, ShipOreEnum, getShipOreName } from '@regolithco/common'
import Gradient from 'javascript-color-gradient'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Clear } from '@mui/icons-material'

export interface ShipOreChooserProps {
  values?: ShipOreEnum[]
  multiple?: boolean
  onChange?: (value: ShipOreEnum[]) => void
}

export const ShipOreChooser: React.FC<ShipOreChooserProps> = ({ multiple, onChange, values }) => {
  const [selected, setSelected] = React.useState<ShipOreEnum[]>(values || [])
  const theme = useTheme()

  useEffect(() => {
    setSelected(values || [])
  }, [values])

  const shipRowKeys = Object.values(ShipOreEnum)
  const quaColors = ['#f700ff', '#ffffff']
  const innertColors = ['#848484', '#000000']
  const bgColors = new Gradient()
    .setColorGradient(theme.palette.secondary.dark, theme.palette.primary.main, theme.palette.grey[500])
    .setMidpoint(shipRowKeys.length) // 100 is the number of colors to generate. Should be enough stops for our ores
    .getColors()
  const fgColors = bgColors.map((color) => theme.palette.getContrastText(color))
  // Sort descendng value
  shipRowKeys.sort((a, b) => {
    const aPrice = lookups.marketPriceLookup[a] as MarketPriceLookupValue
    const bPrice = lookups.marketPriceLookup[b] as MarketPriceLookupValue
    return bPrice.refined - aPrice.refined
  })

  return (
    <Grid container spacing={0.5} margin={0}>
      {shipRowKeys.map((shipOreKey, rowIdx) => {
        let fgc = fgColors[rowIdx]
        let bgc = bgColors[rowIdx]
        if (shipOreKey === ShipOreEnum.Quantanium) {
          fgc = quaColors[1]
          bgc = quaColors[0]
        }
        if (shipOreKey === ShipOreEnum.Inertmaterial) {
          fgc = innertColors[1]
          bgc = innertColors[0]
        }
        const active = selected.includes(shipOreKey)
        return (
          <Grid xs={2} key={`orechooserow-${rowIdx}`}>
            <ToggleButton
              value={shipOreKey}
              fullWidth
              selected={active}
              size="small"
              key={`tbutt-${shipOreKey}`}
              onChange={() => {
                let newValue: ShipOreEnum[] = []
                if (!active) {
                  if (multiple) {
                    newValue = [...selected, shipOreKey]
                  } else {
                    newValue = [shipOreKey]
                  }
                } else {
                  newValue = selected.filter((v) => v !== shipOreKey)
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
                  sm: 12,
                },
                opacity: 0.3,
                p: 0,
                '&:hover': {
                  color: 'white',
                  border: '2px solid white',
                  opacity: 1,
                },
                '&.Mui-selected': {
                  color: fgc,
                  border: '2px solid white',
                  opacity: 1,
                  backgroundColor: bgc,
                },
              }}
            >
              {getShipOreName(shipOreKey).slice(0, 4)}
            </ToggleButton>
          </Grid>
        )
      })}
      <Grid xs={2}>
        <ToggleButton
          value={''}
          size="small"
          fullWidth
          sx={{
            fontSize: 14,
            p: 0,
          }}
          onChange={() => {
            onChange && onChange([])
            setSelected([])
          }}
        >
          <Clear />
        </ToggleButton>
      </Grid>
    </Grid>
  )
}
