import * as React from 'react'
import { ActivityEnum, SessionSummaryWorkOrder } from '@regolithco/common'
import { Box, useTheme } from '@mui/system'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { AccountBalance, SvgIconComponent } from '@mui/icons-material'
import { Chip, Tooltip, Typography } from '@mui/material'

interface WorkOrderStatusProps {
  woSumm: SessionSummaryWorkOrder
}

export const WorkOrderStatus: React.FC<WorkOrderStatusProps> = ({ woSumm }) => {
  const theme = useTheme()
  let WorkIcon: SvgIconComponent
  const title = ''
  switch (woSumm.orderType) {
    case ActivityEnum.Salvage:
      WorkIcon = ClawIcon
      break
    case ActivityEnum.ShipMining:
      WorkIcon = RockIcon
      break
    case ActivityEnum.VehicleMining:
      WorkIcon = GemIcon
      break
    case ActivityEnum.Other:
      WorkIcon = AccountBalance
      break
    default:
      return <>DisplayError</>
  }
  const goodColor = theme.palette.secondary.light
  const badColor = theme.palette.error.dark
  const leftState = woSumm.isSold
  const rightState = woSumm.paidShares && woSumm.unpaidShares === 0 && woSumm.paidShares > 0
  const leftColor = leftState ? goodColor : badColor
  const rightColor = rightState ? goodColor : badColor

  return (
    <Tooltip
      placement="top"
      arrow
      title={
        <Chip
          sx={{ background: 'black' }}
          label={
            <>
              <Typography variant="caption" sx={{ color: leftColor }}>
                {woSumm.isSold ? 'SOLD' : 'UNSOLD'}
              </Typography>{' '}
              -{' '}
              <Typography variant="caption" sx={{ color: rightColor }}>
                {woSumm.paidShares && woSumm.unpaidShares === 0 && woSumm.paidShares > 0 ? 'PAID' : 'UNPAID'}
              </Typography>
            </>
          }
        />
      }
    >
      <Box
        sx={{
          display: 'flex',
          m: 0.3,
          alignItems: 'center',
          justifyContent: 'center',
          width: '1.5rem',
          border: '1px solid',
          borderColor: leftState && rightState ? goodColor : theme.palette.error.main,
          height: '1.5rem',
          textAlign: 'center',
          borderRadius: '50%',
          background: `linear-gradient(to right, ${leftColor} 50%, ${rightColor} 50%)`,
        }}
      >
        <WorkIcon
          sx={{
            color: theme.palette.secondary.contrastText,
            fontSize: '1rem',
            opacity: 0.8,
          }}
        />
      </Box>
    </Tooltip>
  )
}
