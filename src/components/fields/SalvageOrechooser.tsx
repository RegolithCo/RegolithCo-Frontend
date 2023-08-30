import React from 'react'
import { ToggleButton, Tooltip } from '@mui/material'
import { getVehicleOreName, findPrice, SalvageOreEnum, getSalvageOreName } from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { blue, green } from '@mui/material/colors'

export interface SalvageOreChooserProps {
  multiple?: boolean
  requireValue?: boolean
  showAllBtn?: boolean
  values?: SalvageOreEnum[]
  onChange?: (value: SalvageOreEnum[]) => void
}

export const SalvageOreChooser: React.FC<SalvageOreChooserProps> = ({
  multiple,
  onChange,
  values,
  showAllBtn,
  requireValue,
}) => {
  const [selected, setSelected] = React.useState<SalvageOreEnum[]>(values || [])
  // const theme = useTheme()
  const vehicleRowKeys = Object.values(SalvageOreEnum)
  const bgColors = ['#666666', '#aaaaaa']
  const fgColors = ['#000000', '#000000']
  // Sort descendng value
  vehicleRowKeys.sort((a, b) => {
    const aPrice = findPrice(a as SalvageOreEnum)
    const bPrice = findPrice(b as SalvageOreEnum)
    return bPrice - aPrice
  })

  return (
    <Grid container spacing={0.5}>
      {vehicleRowKeys.map((salvageOreKey, rowIdx) => {
        const fgc = fgColors[rowIdx]
        const bgc = bgColors[rowIdx]
        const active = selected.includes(salvageOreKey)
        return (
          <Grid xs={3} key={`grid-${rowIdx}`}>
            <ToggleButton
              value={salvageOreKey}
              fullWidth
              tabIndex={-1}
              selected={active}
              size="small"
              key={`tbutt-${salvageOreKey}`}
              onChange={() => {
                let newValue: SalvageOreEnum[] = []
                if (!active) {
                  if (multiple) {
                    newValue = [...selected, salvageOreKey]
                  } else {
                    newValue = [salvageOreKey]
                  }
                } else {
                  newValue = selected.filter((v) => v !== salvageOreKey)
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
              {getSalvageOreName(salvageOreKey)}
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
