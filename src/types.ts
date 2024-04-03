export type Config = {
  apiUrl: string
  apiUrlPub: string
  shareUrl: string
  googleClientId: string
  discordClientId: string
  webApiKey: string
}

export type ScoutingFindTypenames = 'SalvageFind' | 'ShipClusterFind' | 'VehicleClusterFind'
export type WorkOrderTypenames = 'OtherOrder' | 'SalvageOrder' | 'ShipMiningOrder' | 'VehicleMiningOrder'
