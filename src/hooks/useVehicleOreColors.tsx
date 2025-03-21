import React, { useEffect } from 'react'
import { VehicleOreEnum, findPrice } from '@regolithco/common'
import { LookupsContext } from '../context/lookupsContext'
import { blue, green, grey, red, teal } from '@mui/material/colors'

export type SortedVehicleOreColor = { ore: VehicleOreEnum; fg: string; bg: string }
export type SortedVehicleOreColors = SortedVehicleOreColor[]

export const vehicleOreColorMap: Record<VehicleOreEnum, [string, string]> = {
  [VehicleOreEnum.Janalite]: ['#fff200', '#000000'],
  [VehicleOreEnum.Hadanite]: ['#ff00c3', '#ffffff'],
  [VehicleOreEnum.Aphorite]: [blue[500], '#ffffff'],
  [VehicleOreEnum.Dolivine]: [green[500], '#ffffff'],
  [VehicleOreEnum.Beradom]: [blue[900], '#ffffff'],
  [VehicleOreEnum.Glacosite]: [green[900], '#ffffff'],
  [VehicleOreEnum.Feynmaline]: ['#970074', '#ffffff'],
  [VehicleOreEnum.Jaclium]: [teal[400], '#ffffff'],
  [VehicleOreEnum.Saldynium]: [grey[500], '#ffffff'],
  [VehicleOreEnum.Carinite]: [red[500], '#ffffff'],
}
export const useVehicleOreColors = (): SortedVehicleOreColors => {
  const [sortedVehicleRowKeys, setSortedVehicleRowKeys] = React.useState<VehicleOreEnum[]>([])

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
    const fgc = vehicleOreColorMap[vehicleOreKey][1]
    const bgc = vehicleOreColorMap[vehicleOreKey][0]
    return { ore: vehicleOreKey, fg: fgc, bg: bgc } as SortedVehicleOreColor
  })
}
