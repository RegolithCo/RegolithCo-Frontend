import React, { useEffect } from 'react'
import { alpha, ToggleButton, Tooltip, useTheme, Grid } from '@mui/material'
import { SalvageOreEnum, findPrice } from '@regolithco/common'
import { LookupsContext } from '../../context/lookupsContext'

export interface SalvageOreChooserProps {
  multiple?: boolean
  requireValue?: boolean
  showAllBtn?: boolean
  showNoneBtn?: boolean
  values?: SalvageOreEnum[]
  onChange?: (value: SalvageOreEnum[]) => void
  onClick?: (value: SalvageOreEnum) => void
}

const btnNames: Record<SalvageOreEnum, string> = {
  [SalvageOreEnum.Rmc]: 'RMC',
  [SalvageOreEnum.Cmat]: 'CMAT',
}

export const SalvageOreChooser: React.FC<SalvageOreChooserProps> = ({
  multiple,
  onChange,
  onClick,
  values,
  showAllBtn,
  showNoneBtn,
  requireValue,
}) => {
  const [selected, setSelected] = React.useState<SalvageOreEnum[]>(values || [])
  const theme = useTheme()
  // If you pass undefined as values then it will be treated as an empty array
  // and we will treat this as buttons instead of toggle values
  const isToggleButtons = Array.isArray(values)
  const [sortedSalvageRowKeys, setSortedSalvageRowKeys] = React.useState<SalvageOreEnum[]>([])
  const salvageRowKeys = Object.values(SalvageOreEnum)
  const bgColors = ['#b7af3f', '#3f7bb7']
  const fgColors = ['#ffffff', '#ffffff']

  const dataStore = React.useContext(LookupsContext)

  useEffect(() => {
    const calcSalvageRowKeys = async () => {
      const salvageRowKeys = Object.values(SalvageOreEnum)
      const prices = await Promise.all(salvageRowKeys.map((shipOreKey) => findPrice(dataStore, shipOreKey)))
      const newSorted = [...salvageRowKeys].sort((a, b) => {
        const aPrice = prices[salvageRowKeys.indexOf(a)]
        const bPrice = prices[salvageRowKeys.indexOf(b)]
        return bPrice - aPrice
      })
      setSortedSalvageRowKeys(newSorted)
    }
    calcSalvageRowKeys()
  }, [dataStore.ready])

  return (
    <Grid container spacing={0.5}>
      {sortedSalvageRowKeys.map((salvageOreKey, rowIdx) => {
        const fgc = fgColors[rowIdx]
        const bgc = bgColors[rowIdx]
        const active = isToggleButtons ? selected.includes(salvageOreKey) : true
        return (
          <Grid size={{ xs: 3 }} key={`grid-${rowIdx}`}>
            <ToggleButton
              value={salvageOreKey}
              fullWidth
              tabIndex={-1}
              selected={active}
              size="small"
              key={`tbutt-${salvageOreKey}`}
              onClick={(e, value) => {
                onClick && onClick(value)
              }}
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
        <Grid size={{ xs: 3 }}>
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
      {!requireValue && showNoneBtn && (
        <Grid size={{ xs: 3 }}>
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
