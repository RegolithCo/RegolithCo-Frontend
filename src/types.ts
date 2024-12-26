import { AlertProps } from '@mui/material'
import { GravityWellTypeEnum, SystemEnum } from '@regolithco/common'

export type Config = {
  apiUrl: string
  stage: string
  apiUrlPub: string
  shareUrl: string
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

// We rework this slightly so it's easier to work with
export type GravityWellOptions = {
  label: string
  type: GravityWellTypeEnum
  id: string
  system: SystemEnum
  icon: React.ReactNode
  color: string
  depth: number
  parents: string[]
  parentType: GravityWellTypeEnum | null
}
