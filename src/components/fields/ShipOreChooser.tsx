import React, { useEffect } from 'react'
import { alpha, ToggleButton, Tooltip, useTheme } from '@mui/material'
import { ShipOreEnum, getShipOreAbbrev } from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { useShipOreColors } from '../../hooks/useShipOreColors'

export interface ShipOreChooserProps {
  values?: ShipOreEnum[]
  multiple?: boolean
  requireValue?: boolean
  showAllBtn?: boolean
  showNoneBtn?: boolean
  showInnert?: boolean
  onChange?: (value: ShipOreEnum[]) => void
  onClick?: (value: ShipOreEnum) => void
}

export const ShipOreChooser: React.FC<ShipOreChooserProps> = ({
  multiple,
  onChange,
  onClick,
  values,
  requireValue,
  showAllBtn,
  showNoneBtn,
  showInnert,
}) => {
  const [selected, setSelected] = React.useState<ShipOreEnum[]>(values || [])
  // If you pass undefined as values then it will be treated as an empty array
  // and we will treat this as buttons instead of toggle values
  const isToggleButtons = Array.isArray(values)
  const theme = useTheme()
  const sortedShipRowColors = useShipOreColors()

  useEffect(() => {
    setSelected(values || [])
  }, [values])

  return (
    <Grid container spacing={0.5} margin={0}>
      {sortedShipRowColors.map(({ ore: shipOreKey, fg: fgc, bg: bgc }, rowIdx) => {
        const active = isToggleButtons ? selected.includes(shipOreKey) : true
        return (
          <Grid xs={2} key={`orechooserow-${rowIdx}`}>
            <ToggleButton
              value={shipOreKey}
              fullWidth
              tabIndex={-1}
              selected={active}
              size="small"
              key={`tbutt-${shipOreKey}`}
              onClick={(e, value) => {
                onClick && onClick(value)
              }}
              onChange={() => {
                let newValue: ShipOreEnum[] = []
                if (isToggleButtons) {
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
                }
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
              {getShipOreAbbrev(shipOreKey, 4)}
            </ToggleButton>
          </Grid>
        )
      })}
      {multiple && showAllBtn && (
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
                setSelected(sortedShipRowColors.map((v) => v.ore))
                onChange && onChange(sortedShipRowColors.map((v) => v.ore))
              }}
            >
              All
            </ToggleButton>
          </Tooltip>
        </Grid>
      )}
      {!requireValue && showNoneBtn && (
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
