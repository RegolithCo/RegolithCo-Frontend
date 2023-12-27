import React from 'react'
import { alpha, ToggleButton, Tooltip, useTheme } from '@mui/material'
import { SalvageOreEnum, findPrice } from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { useAsyncLookupData } from '../../hooks/useLookups'

export interface SalvageOreChooserProps {
  multiple?: boolean
  requireValue?: boolean
  showAllBtn?: boolean
  values?: SalvageOreEnum[]
  onChange?: (value: SalvageOreEnum[]) => void
}

const btnNames: Record<SalvageOreEnum, string> = {
  [SalvageOreEnum.Rmc]: 'RMC',
  [SalvageOreEnum.Cmat]: 'CMAT',
}

export const SalvageOreChooser: React.FC<SalvageOreChooserProps> = ({
  multiple,
  onChange,
  values,
  showAllBtn,
  requireValue,
}) => {
  const [selected, setSelected] = React.useState<SalvageOreEnum[]>(values || [])
  const theme = useTheme()
  const salvageRowKeys = Object.values(SalvageOreEnum)
  const bgColors = ['#a1a1a1', '#4b4b4b']
  const fgColors = ['#ffffff', '#ffffff']

  const sortedSalvageRowKeys =
    useAsyncLookupData(async (ds) => {
      const prices = await Promise.all(salvageRowKeys.map((shipOreKey) => findPrice(ds, shipOreKey)))
      return salvageRowKeys.sort((a, b) => {
        const aPrice = prices[salvageRowKeys.indexOf(a)]
        const bPrice = prices[salvageRowKeys.indexOf(b)]
        return bPrice - aPrice
      })
    }) || []

  return (
    <Grid container spacing={0.5}>
      {sortedSalvageRowKeys.map((salvageOreKey, rowIdx) => {
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
                backgroundColor: alpha(bgc, 0.4),
                border: '2px solid transparent',
                color: fgc,
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
                  color: fgc,
                  border: '2px solid white',
                  backgroundColor: bgc,
                },
              }}
            >
              {btnNames[salvageOreKey]}
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
                setSelected(salvageRowKeys)
                onChange && onChange(salvageRowKeys)
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
