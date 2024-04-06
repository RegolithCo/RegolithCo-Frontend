export type Config = {
  apiUrl: string
  stage: string
  apiUrlPub: string
  shareUrl: string
  googleClientId: string
  discordClientId: string
}

export type ScoutingFindTypenames = 'SalvageFind' | 'ShipClusterFind' | 'VehicleClusterFind'
export type WorkOrderTypenames = 'OtherOrder' | 'SalvageOrder' | 'ShipMiningOrder' | 'VehicleMiningOrder'
