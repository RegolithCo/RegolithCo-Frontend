import { ObjectValues, ShipOreEnum } from '@regolithco/common'

export const OreTierEnum = {
  STier: 'S',
  ATier: 'A',
  BTier: 'B',
  CTier: 'C',
} as const
export type OreTierEnum = ObjectValues<typeof OreTierEnum>

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
export const OreTierNames: Record<OreTierEnum, string> = {
  [OreTierEnum.STier]: 'S-Tier',
  [OreTierEnum.ATier]: 'A-Tier',
  [OreTierEnum.BTier]: 'B-Tier',
  [OreTierEnum.CTier]: 'C-Tier',
}

export const hoverColor = '#242424'
export const selectColor = '#222222'
