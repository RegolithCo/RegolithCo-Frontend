import React, { useEffect } from 'react'
import { alpha, ToggleButton, Tooltip, useTheme } from '@mui/material'
import { ShipOreEnum, getShipOreName, findPrice } from '@regolithco/common'
import Gradient from 'javascript-color-gradient'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { LookupsContext } from '../../context/lookupsContext'

export interface ShipOreChooserProps {
  values?: ShipOreEnum[]
  multiple?: boolean
  requireValue?: boolean
  showAllBtn?: boolean
  onChange?: (value: ShipOreEnum[]) => void
}

export const ShipOreChooser: React.FC<ShipOreChooserProps> = ({
  multiple,
  onChange,
  values,
  requireValue,
  showAllBtn,
}) => {
  const [selected, setSelected] = React.useState<ShipOreEnum[]>(values || [])
  const theme = useTheme()

  useEffect(() => {
    setSelected(values || [])
  }, [values])

  const [sortedShipRowKeys, setSortedShipRowKeys] = React.useState<ShipOreEnum[]>([])
  const [bgColors, setBgColors] = React.useState<string[]>([])
  const [fgColors, setFgColors] = React.useState<string[]>([])

  const quaColors = ['#f700ff', '#ffffff']
  const innertColors = ['#848484', '#000000']

  const dataStore = React.useContext(LookupsContext)

  useEffect(() => {
    const calcShipRowKeys = async () => {
      const shipRowKeys = Object.values(ShipOreEnum)
      const prices = await Promise.all(shipRowKeys.map((shipOreKey) => findPrice(dataStore, shipOreKey)))
      const newSorted = [...shipRowKeys].sort((a, b) => {
        const aPrice = prices[shipRowKeys.indexOf(a)]
        const bPrice = prices[shipRowKeys.indexOf(b)]
        return bPrice - aPrice
      })

      const bgColors = new Gradient()
        .setColorGradient(theme.palette.success.main, theme.palette.secondary.main, theme.palette.grey[500])
        .setMidpoint(newSorted.length) // 100 is the number of colors to generate. Should be enough stops for our ores
        .getColors()
      const fgColors = bgColors.map((color) => theme.palette.getContrastText(color))

      setSortedShipRowKeys(newSorted)
      setBgColors(bgColors)
      setFgColors(fgColors)
    }
    calcShipRowKeys()
  }, [dataStore])

  return (
    <Grid container spacing={0.5} margin={0}>
      {sortedShipRowKeys.map((shipOreKey, rowIdx) => {
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
              tabIndex={-1}
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
                backgroundColor: alpha(bgc, 0.2),
                border: '2px solid transparent',
                color: '#aaa',
                fontSize: {
                  xs: 12,
                  sm: 12,
                },
                p: [0.5, 0.5],
                '&:hover': {
                  color: 'white',
                  border: '2px solid white',
                  opacity: 1,
                },
                '&.Mui-selected': {
                  color: fgc,
                  border: '2px solid white',
                  backgroundColor: bgc,
                },
              }}
            >
              {getShipOreName(shipOreKey).slice(0, 4)}
            </ToggleButton>
          </Grid>
        )
      })}
      {multiple && (
        // {multiple && showAllBtn && (
        <Grid xs={2}>
          <Tooltip title="Select all ores">
            <ToggleButton
              value={''}
              size="small"
              fullWidth
              tabIndex={-1}
              sx={{
                border: `1px solid ${theme.palette.info.dark}}`,
                color: theme.palette.info.main,
                fontSize: {
                  xs: 12,
                  sm: 12,
                  md: 12,
                },
                p: [0.5, 0.5],
              }}
              onChange={() => {
                setSelected(sortedShipRowKeys)
                onChange && onChange(sortedShipRowKeys)
              }}
            >
              All
            </ToggleButton>
          </Tooltip>
        </Grid>
      )}
      {!requireValue && (
        <Grid xs={2}>
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
