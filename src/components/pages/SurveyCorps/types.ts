import { Theme, lighten } from '@mui/material'
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
  [SystemEnum.Nyx]: theme.palette.info.light,
})

export const OreTierColors: Record<OreTierEnum, string> = {
  [OreTierEnum.STier]: 'success',
  [OreTierEnum.ATier]: 'info',
  [OreTierEnum.BTier]: 'warning',
  [OreTierEnum.CTier]: 'error',
}

export const hoverColor = '#242424'
export const selectColor = 'rgba(55,55,55)'
export const selectBorderColor = lighten(selectColor, 0.5)
