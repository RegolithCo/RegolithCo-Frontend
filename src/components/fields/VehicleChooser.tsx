import React, { useMemo } from 'react'
import { Autocomplete, MenuItem, TextField, Typography, useTheme } from '@mui/material'
import { Vehicle, lookups, ObjectValues } from '@regolithco/common'

export const ShipTypeEnum = {
  Mining: 'Mining',
  Freight: 'Freight',
  Transport: 'Transport',
  Gunship: 'Gunship',
  Fighter: 'Fighter',
} as const
export type ShipTypeEnum = ObjectValues<typeof ShipTypeEnum>

export interface VehicleChooserProps {
  label?: string
  vehicle?: string
  disabled?: boolean
  onChange: (vehicleCode: Vehicle | null) => void
  hide?: [ShipTypeEnum]
  show?: [ShipTypeEnum]
  onlyCargo?: boolean
}

const NONEOPTION: Vehicle = {
  code: 'NONE',
  name: 'None',
  role: '',
  cargo: 0,
  miningHold: 0,
  buyAt: [],
  maker: '',
  rentAt: [],
  __typename: 'Vehicle',
}

export const VehicleChooser: React.FC<VehicleChooserProps> = ({
  label,
  vehicle,
  disabled,
  onChange,
  hide,
  show,
  onlyCargo,
}) => {
  const theme = useTheme()

  if (hide && show) throw new Error('Cannot use both hide and show')

  const sortedShips: Vehicle[] = useMemo(() => {
    const newShips = [...lookups.shipLookups].filter((ship) => {
      if (hide) return !hide.includes(ship.role as ShipTypeEnum)
      if (show) return show.includes(ship.role as ShipTypeEnum)
      if (onlyCargo) return ship.role !== ShipTypeEnum.Mining && ship.cargo && ship.cargo > 0
      return true
    })
    newShips.sort((a, b) => {
      if (a.miningHold || b.miningHold) {
        return (b.miningHold || 0) - (a.miningHold || 0)
      }
      return (b.cargo || 0) - (a.cargo || 0)
    })
    return newShips
  }, [])

  const shipColorLookup: Record<ShipTypeEnum, string> = {
    [ShipTypeEnum.Mining]: theme.palette.secondary.main,
    [ShipTypeEnum.Freight]: theme.palette.primary.main,
    [ShipTypeEnum.Transport]: theme.palette.primary.main,
    [ShipTypeEnum.Gunship]: theme.palette.error.main,
    [ShipTypeEnum.Fighter]: theme.palette.error.main,
  }

  const currVal: Vehicle = sortedShips ? sortedShips.find((ship) => ship.code === vehicle) || NONEOPTION : NONEOPTION

  return (
    <Autocomplete
      id="shipChooser"
      value={currVal}
      disabled={disabled}
      renderOption={(props, ship) => (
        <MenuItem
          {...props}
          value={ship.code}
          sx={{
            color: shipColorLookup[ship.role as ShipTypeEnum] || 'inherit',
          }}
        >
          {ship.name}
          <div style={{ flexGrow: 1 }} />
          <Typography variant="caption">
            {ship.role} {ship.code !== 'NONE' && `(${ship.miningHold || ship.cargo || '0'} SCU)`}
          </Typography>
        </MenuItem>
      )}
      clearOnBlur
      blurOnSelect
      fullWidth
      getOptionLabel={(option) => {
        if (option === null) return ''
        if (typeof option === 'string') return option
        else {
          const scuAmt = option.code !== 'NONE' ? ` (${option.miningHold || option.cargo || '0'} SCU)` : ''
          return option.name + scuAmt
        }
      }}
      options={[NONEOPTION, ...sortedShips]}
      renderInput={(params) => <TextField {...params} label={label || 'Current Ship'} />}
      onChange={(event, option) => {
        if (disabled) return
        if (option && option.code === NONEOPTION.code) return onChange(null)
        if (option && !sortedShips.find((ship) => ship.code === option.code)) {
          return onChange(null)
        }
        return onChange(option)
      }}
    />
  )
}
