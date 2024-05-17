import { AlertProps } from '@mui/material'

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
