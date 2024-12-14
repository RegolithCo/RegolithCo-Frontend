import { SessionRoleEnum, ShipRoleEnum } from '@regolithco/common'
import {
  Engineering,
  Handyman,
  LocalPolice,
  LocalShipping,
  ManageAccounts,
  RocketLaunch,
  Security,
  Support,
  TravelExplore,
  Warehouse,
} from '@mui/icons-material'
import { LaserIcon } from '../icons'

export type RoleIconType = typeof RocketLaunch

// THIS IS ALSO THE ORDER TO SORT IN
export const ShipRoleNames: Record<ShipRoleEnum, string> = {
  [ShipRoleEnum.Pilot]: 'Pilot',
  [ShipRoleEnum.Copilot]: 'Co-Pilot',
  [ShipRoleEnum.LaserOperator]: 'Laser Operator',
  [ShipRoleEnum.Stevedore]: 'Stevedore',
  [ShipRoleEnum.Turret]: 'Turret',
  [ShipRoleEnum.Security]: 'Security',
  [ShipRoleEnum.Medic]: 'Medic',
  [ShipRoleEnum.Engineer]: 'Engineer',
}

export const ShipRoleIcons: Record<ShipRoleEnum, RoleIconType> = {
  [ShipRoleEnum.Pilot]: RocketLaunch,
  [ShipRoleEnum.Copilot]: RocketLaunch,
  [ShipRoleEnum.Engineer]: Handyman,
  [ShipRoleEnum.Turret]: Security,
  [ShipRoleEnum.LaserOperator]: LaserIcon,
  [ShipRoleEnum.Security]: Security,
  [ShipRoleEnum.Medic]: Support,
  [ShipRoleEnum.Stevedore]: Warehouse,
}

export const ShipRoleColors: Record<ShipRoleEnum, string> = {
  [ShipRoleEnum.Pilot]: '#ff0',
  [ShipRoleEnum.Copilot]: '#ff0',
  [ShipRoleEnum.Engineer]: '#b26eff',
  [ShipRoleEnum.Turret]: '#f00',
  [ShipRoleEnum.LaserOperator]: '#0f0',
  [ShipRoleEnum.Security]: '#f00',
  [ShipRoleEnum.Medic]: '#0ff',
  [ShipRoleEnum.Stevedore]: '#ff8400',
}

// THIS IS ALSO THE ORDER TO SORT IN
export const SessionRoleNames: Record<SessionRoleEnum, string> = {
  [SessionRoleEnum.Manager]: 'Manager',
  [SessionRoleEnum.Scout]: 'Surveyor / Scout',
  [SessionRoleEnum.Logistics]: 'Logistics & Support',
  [SessionRoleEnum.Medical]: 'Medical & Rescue',
  [SessionRoleEnum.Security]: 'Security',
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
