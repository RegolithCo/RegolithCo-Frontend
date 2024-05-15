import React, { useEffect } from 'react'
import { Autocomplete, MenuItem, TextField, Theme, Typography, useTheme } from '@mui/material'
import { Vehicle, ShipLookups, VehicleRoleEnum } from '@regolithco/common'
import numeral from 'numeral'
import { LookupsContext } from '../../context/lookupsContext'

export interface VehicleChooserProps {
  label?: string
  vehicle?: string
  disabled?: boolean
  onChange: (vehicleCode: Vehicle | null) => void
  hide?: [VehicleRoleEnum]
  show?: [VehicleRoleEnum]
  onlyCargo?: boolean
}

export const shipColorLookup = (theme: Theme): Record<VehicleRoleEnum, string> => ({
  [VehicleRoleEnum.Mining]: theme.palette.secondary.main,
  [VehicleRoleEnum.Freight]: theme.palette.info.main,
  [VehicleRoleEnum.Fighter]: theme.palette.error.main,
  [VehicleRoleEnum.Other]: theme.palette.grey[500],
})

const NONEOPTION: Vehicle = {
  UEXID: '0',
  name: 'None',
  role: VehicleRoleEnum.Other,
  cargo: 0,
  miningHold: 0,
  maker: '',
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
  const [sortedShips, setSortedShips] = React.useState<Vehicle[]>([])
  const dataStore = React.useContext(LookupsContext)

  if (hide && show) throw new Error('Cannot use both hide and show')

  useEffect(() => {
    if (!dataStore.ready) return
    const shipLookups = dataStore.getLookup('shipLookups') as ShipLookups
    const calcShipRowKeys = async () => {
      const newShips = [...shipLookups].filter((ship) => {
        if (hide) return !hide.includes(ship.role as VehicleRoleEnum)
        if (show) return show.includes(ship.role as VehicleRoleEnum)
        if (onlyCargo) return ship.role !== VehicleRoleEnum.Mining && ship.cargo && ship.cargo > 0
        return true
      })
      newShips.sort((a, b) => {
        if (a.miningHold || b.miningHold) {
          return (b.miningHold || 0) - (a.miningHold || 0)
        }
        return (b.cargo || 0) - (a.cargo || 0)
      })
      setSortedShips(newShips)
    }
    calcShipRowKeys()
  }, [])

  if (!dataStore.ready) return <div>Loading...</div>

  const currVal: Vehicle = sortedShips ? sortedShips.find((ship) => ship.UEXID === vehicle) || NONEOPTION : NONEOPTION

  return (
    <Autocomplete
      id="shipChooser"
      value={currVal}
      disabled={disabled}
      renderOption={(props, ship) => {
        const shipSCUVAl = ship.miningHold || ship.cargo || 0
        return (
          <MenuItem
            {...props}
            value={ship.UEXID}
            sx={{
              color: shipColorLookup(theme)[ship.role as VehicleRoleEnum] || 'inherit',
            }}
          >
            {ship.name}
            <div style={{ flexGrow: 1 }} />
            <Typography variant="caption">
              {ship.role} {ship.UEXID !== 'NONE' && shipSCUVAl > 0 && `(${numeral(shipSCUVAl).format('0,0')} SCU)`}
            </Typography>
          </MenuItem>
        )
      }}
      clearOnBlur
      blurOnSelect
      fullWidth
      getOptionLabel={(option) => {
        if (option === null) return ''
        if (typeof option === 'string') return option
        else {
          const shipSCUVAl = option.miningHold || option.cargo || 0
          const scuAmt = option.UEXID !== 'NONE' && shipSCUVAl > 0 ? ` (${numeral(shipSCUVAl).format('0,0')} SCU)` : ''
          return option.name + scuAmt
        }
      }}
      options={[NONEOPTION, ...sortedShips]}
      renderInput={(params) => <TextField {...params} label={label || 'Current Ship'} />}
      onChange={(event, option) => {
        if (disabled) return
        if (option && option.UEXID === NONEOPTION.UEXID) return onChange(null)
        if (option && !sortedShips.find((ship) => ship.UEXID === option.UEXID)) {
          return onChange(null)
        }
        return onChange(option)
      }}
    />
  )
}
