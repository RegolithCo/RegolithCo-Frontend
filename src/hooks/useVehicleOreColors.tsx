import React, { useEffect } from 'react'
import { VehicleOreEnum, findPrice } from '@regolithco/common'
import { LookupsContext } from '../context/lookupsContext'
import { blue, green } from '@mui/material/colors'

export type SortedVehicleOreColor = { ore: VehicleOreEnum; fg: string; bg: string }
export type SortedVehicleOreColors = SortedVehicleOreColor[]

export const useVehicleOreColors = (): SortedVehicleOreColors => {
  const [sortedVehicleRowKeys, setSortedVehicleRowKeys] = React.useState<VehicleOreEnum[]>([])

  const bgColors = ['#fff200', '#ff00c3', blue[500], green[500]]
  const fgColors = ['#000000', '#ffffff', '#ffffff', '#ffffff']

  const dataStore = React.useContext(LookupsContext)

  useEffect(() => {
    const calcVehicleRowKeys = async () => {
      const vehicleRowKeys = Object.values(VehicleOreEnum)
      const prices = await Promise.all(vehicleRowKeys.map((vehicleOreKey) => findPrice(dataStore, vehicleOreKey)))
      const newSorted = [...vehicleRowKeys].sort((a, b) => {
        const aPrice = prices[vehicleRowKeys.indexOf(a)]
        const bPrice = prices[vehicleRowKeys.indexOf(b)]
        return bPrice - aPrice
      })
      setSortedVehicleRowKeys(newSorted)
    }
    calcVehicleRowKeys()
  }, [dataStore])

  return sortedVehicleRowKeys.map((vehicleOreKey, rowIdx) => {
    const fgc = fgColors[rowIdx]
    const bgc = bgColors[rowIdx]
    return { ore: vehicleOreKey, fg: fgc, bg: bgc } as SortedVehicleOreColor
  })
}
