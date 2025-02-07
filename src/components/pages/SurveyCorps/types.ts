import { Theme } from '@mui/material'
import { lighten } from '@mui/system'
import { ObjectValues, ShipOreEnum, SystemEnum } from '@regolithco/common'

export const OreTierEnum = {
  STier: 'S',
  ATier: 'A',
  BTier: 'B',
  CTier: 'C',
} as const
export type OreTierEnum = ObjectValues<typeof OreTierEnum>

export const SystemColors: (theme: Theme) => Record<SystemEnum, string> = (theme: Theme) => ({
  [SystemEnum.Stanton]: theme.palette.info.main,
  [SystemEnum.Pyro]: theme.palette.error.main,
})

export const ShipOreTiers: Record<OreTierEnum, ShipOreEnum[]> = {
  [OreTierEnum.STier]: [ShipOreEnum.Quantanium, ShipOreEnum.Stileron, ShipOreEnum.Riccite],
  [OreTierEnum.ATier]: [ShipOreEnum.Taranite, ShipOreEnum.Bexalite, ShipOreEnum.Gold],
  [OreTierEnum.BTier]: [
    ShipOreEnum.Laranite,
    ShipOreEnum.Borase,
    ShipOreEnum.Beryl,
    ShipOreEnum.Agricium,
    ShipOreEnum.Hephaestanite,
  ],
  [OreTierEnum.CTier]: [
    ShipOreEnum.Tungsten,
    ShipOreEnum.Titanium,
    ShipOreEnum.Silicon,
    ShipOreEnum.Iron,
    ShipOreEnum.Quartz,
    ShipOreEnum.Corundum,
    ShipOreEnum.Copper,
    ShipOreEnum.Tin,
    ShipOreEnum.Aluminum,
    ShipOreEnum.Ice,
  ],
}

export const OreTierColors: Record<OreTierEnum, string> = {
  [OreTierEnum.STier]: 'success',
  [OreTierEnum.ATier]: 'info',
  [OreTierEnum.BTier]: 'warning',
  [OreTierEnum.CTier]: 'error',
}

export const hoverColor = '#242424'
export const selectColor = 'rgba(55,55,55)'
export const selectBorderColor = lighten(selectColor, 0.5)
