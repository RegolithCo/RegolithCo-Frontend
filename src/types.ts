import { AlertProps } from '@mui/material'
import { GravityWell, GravityWellTypeEnum, ObjectValues } from '@regolithco/common'

export type Config = {
  apiUrl: string
  stage: string
  apiUrlPub: string
  shareUrl: string
  googleAuth: string
  googleClientId: string
  discordClientId: string
}

export type RegolithAlert = {
  title: string
  message: string
  endDate?: string
  severity?: AlertProps['severity']
}

export type ScoutingFindTypenames = 'SalvageFind' | 'ShipClusterFind' | 'VehicleClusterFind'
export type WorkOrderTypenames = 'OtherOrder' | 'SalvageOrder' | 'ShipMiningOrder' | 'VehicleMiningOrder'

export const SurfaceWellTypes: GravityWellTypeEnum[] = [GravityWellTypeEnum.PLANET, GravityWellTypeEnum.SATELLITE]
export const AsteroidWellTypes: GravityWellTypeEnum[] = [
  GravityWellTypeEnum.BELT,
  GravityWellTypeEnum.CLUSTER,
  GravityWellTypeEnum.LAGRANGE,
]

// We rework this slightly so it's easier to work with
export type GravityWellOptions = GravityWell & {
  icon: React.ReactNode
  color: string
}
