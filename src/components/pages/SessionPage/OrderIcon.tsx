import { ActivityEnum } from '@regolithco/common'
import React from 'react'
import { ClawIcon, GemIcon, RockIcon } from '../../../icons'
import { AccountBalance, SvgIconComponent } from '@mui/icons-material'
import { SvgIconProps } from '@mui/material'

export const OrderIcon: React.FC<{ orderType?: ActivityEnum } & SvgIconProps> = ({ orderType, ...props }) => {
  let OrderIcon: SvgIconComponent
  switch (orderType) {
    case ActivityEnum.ShipMining:
      OrderIcon = RockIcon
      break
    case ActivityEnum.Salvage:
      OrderIcon = ClawIcon
      break
    case ActivityEnum.VehicleMining:
      OrderIcon = GemIcon
      break
    case ActivityEnum.Other:
      OrderIcon = AccountBalance
      break
    default:
      OrderIcon = RockIcon
      break
  }

  return <OrderIcon {...props} />
}
