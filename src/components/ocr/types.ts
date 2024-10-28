import { ObjectValues } from '@regolithco/common'

export const CaptureTypeEnum = {
  SHIP_ROCK: 'SHIP_ROCK',
  REFINERY_ORDER: 'REFINERY_ORDER',
} as const
export type CaptureTypeEnum = ObjectValues<typeof CaptureTypeEnum>

export const CaptureStepEnum = {
  CAPTURE: 'CAPTURE',
  APPROVE: 'APPROVE',
} as const
export type CaptureStepEnum = ObjectValues<typeof CaptureStepEnum>
