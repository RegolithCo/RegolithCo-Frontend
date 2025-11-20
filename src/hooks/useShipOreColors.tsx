import React, { useEffect } from 'react'
import { useTheme } from '@mui/material'
import { ShipOreEnum, findPrice } from '@regolithco/common'
import Gradient from 'javascript-color-gradient'
import { LookupsContext } from '../context/lookupsContext'

export type SortedShipOreColor = { ore: ShipOreEnum; fg: string; bg: string }
export type SortedShipOreColors = SortedShipOreColor[]

export const useShipOreColors = (): SortedShipOreColors => {
  const theme = useTheme()
  const [sortedShipRowKeys, setSortedShipRowKeys] = React.useState<ShipOreEnum[]>([])
  const [bgColors, setBgColors] = React.useState<string[]>([])
  const [fgColors, setFgColors] = React.useState<string[]>([])

  const quaColors = ['#f700ff', '#ffffff']
  const stilColors = ['#f700ff', '#ffffff']
  const riccitColors = ['#f700ff', '#ffffff']
  const savrilColors = ['#f700ff', '#ffffff']
  const innertColors = ['#848484', '#000000']

  const dataStore = React.useContext(LookupsContext)

  useEffect(() => {
    const calcShipRowKeys = async () => {
      const shipRowKeys = Object.values(ShipOreEnum)
      const prices = await Promise.all(
        // Note we choose the refined price here to sort by because that's what most people will do
        shipRowKeys.map((shipOreKey) => findPrice(dataStore, shipOreKey, undefined, true))
      )
      const newSorted = [...shipRowKeys].sort((a, b) => {
        const aPrice = prices[shipRowKeys.indexOf(a)]
        const bPrice = prices[shipRowKeys.indexOf(b)]
        // Inert is always at the bottom:
        if (a === ShipOreEnum.Inertmaterial) return 1
        if (b === ShipOreEnum.Inertmaterial) return -1
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

  return sortedShipRowKeys.map((shipOreKey, rowIdx) => {
    let fgc = fgColors[rowIdx] || '#000'
    let bgc = bgColors[rowIdx] || '#fff'
    if (shipOreKey === ShipOreEnum.Quantanium) {
      fgc = quaColors[1] || '#000'
      bgc = quaColors[0] || '#fff'
    }
    if (shipOreKey === ShipOreEnum.Stileron) {
      fgc = stilColors[1] || '#000'
      bgc = stilColors[0] || '#fff'
    }
    if (shipOreKey === ShipOreEnum.Riccite) {
      fgc = riccitColors[1] || '#000'
      bgc = riccitColors[0] || '#fff'
    }
    if (shipOreKey === ShipOreEnum.Savrilium) {
      fgc = savrilColors[1] || '#000'
      bgc = savrilColors[0] || '#fff'
    }
    if (shipOreKey === ShipOreEnum.Inertmaterial) {
      fgc = innertColors[1] || '#fff'
      bgc = innertColors[0] || '#000'
    }

    return { ore: shipOreKey, fg: fgc, bg: bgc } as SortedShipOreColor
  })
}
