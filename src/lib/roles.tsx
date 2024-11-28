import * as React from 'react'
import { SessionRoleEnum, ShipRoleEnum } from '@regolithco/common'
import {
  Engineering,
  Handyman,
  Inventory,
  LocalPolice,
  LocalShipping,
  ManageAccounts,
  RocketLaunch,
  Security,
  Support,
  TravelExplore,
} from '@mui/icons-material'

export type RoleIconType = typeof RocketLaunch

export const ShipRoleNames: Record<ShipRoleEnum, string> = {
  [ShipRoleEnum.Pilot]: 'Pilot',
  [ShipRoleEnum.Copilot]: 'Co-Pilot',
  [ShipRoleEnum.Engineer]: 'Engineer',
  [ShipRoleEnum.Turret]: 'Turret',
  [ShipRoleEnum.Security]: 'Security',
  [ShipRoleEnum.Medic]: 'Medic',
  [ShipRoleEnum.Stevedore]: 'Stevedore',
}

export const ShipRoleIcons: Record<ShipRoleEnum, RoleIconType> = {
  [ShipRoleEnum.Pilot]: RocketLaunch,
  [ShipRoleEnum.Copilot]: RocketLaunch,
  [ShipRoleEnum.Engineer]: Handyman,
  [ShipRoleEnum.Turret]: Security,
  [ShipRoleEnum.Security]: Security,
  [ShipRoleEnum.Medic]: Support,
  [ShipRoleEnum.Stevedore]: Inventory,
}

export const ShipRoleColors: Record<ShipRoleEnum, string> = {
  [ShipRoleEnum.Pilot]: '#ff0',
  [ShipRoleEnum.Copilot]: '#ff0',
  [ShipRoleEnum.Engineer]: '#b26eff',
  [ShipRoleEnum.Turret]: '#f00',
  [ShipRoleEnum.Security]: '#f00',
  [ShipRoleEnum.Medic]: '#0ff',
  [ShipRoleEnum.Stevedore]: '#ccc',
}

export const SessionRoleNames: Record<SessionRoleEnum, string> = {
  [SessionRoleEnum.Manager]: 'Manager',
  [SessionRoleEnum.Scout]: 'Surveyor / Scout',
  [SessionRoleEnum.Medical]: 'Medical & Rescue',
  [SessionRoleEnum.Security]: 'Security',
  [SessionRoleEnum.Logistics]: 'Logistics & Support',
  [SessionRoleEnum.Transport]: 'Transport',
}

export const SessionRoleIcons: Record<SessionRoleEnum, RoleIconType> = {
  [SessionRoleEnum.Manager]: ManageAccounts,
  [SessionRoleEnum.Scout]: TravelExplore,
  [SessionRoleEnum.Medical]: Support,
  [SessionRoleEnum.Security]: LocalPolice,
  [SessionRoleEnum.Logistics]: Engineering,
  [SessionRoleEnum.Transport]: LocalShipping,
}
export const SessionRoleColors: Record<SessionRoleEnum, string> = {
  [SessionRoleEnum.Manager]: '#ff0',
  [SessionRoleEnum.Scout]: '#0f0',
  [SessionRoleEnum.Medical]: '#0ff',
  [SessionRoleEnum.Security]: '#f00',
  [SessionRoleEnum.Logistics]: '#ccc',
  [SessionRoleEnum.Transport]: '#f0f',
}
