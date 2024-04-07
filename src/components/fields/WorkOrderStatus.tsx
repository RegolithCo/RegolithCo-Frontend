import * as React from 'react'
import { ActivityEnum, SessionSummaryWorkOrder } from '@regolithco/common'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { AccountBalance, SvgIconComponent } from '@mui/icons-material'
import { Box, Chip, Tooltip, Typography, useTheme } from '@mui/material'

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
  const badColor = theme.palette.grey[500]
  const errorColor = theme.palette.error.main
  const leftState = woSumm.isSold
  const rightState = woSumm.paidShares && woSumm.unpaidShares === 0 && woSumm.paidShares > 0

  let leftColor = leftState ? goodColor : badColor
  let rightColor = rightState ? goodColor : badColor
  let borderColor = leftState && rightState ? goodColor : theme.palette.error.main

  if (woSumm.isFailed) {
    leftColor = errorColor
    rightColor = errorColor
    borderColor = errorColor
  }

  return (
    <Tooltip
      placement="top"
      arrow
      title={
        <Chip
          sx={{ background: 'black' }}
          label={
            woSumm.isFailed ? (
              <Typography variant="caption" sx={{ color: errorColor }}>
                FAILED
              </Typography>
            ) : (
              <>
                <Typography variant="caption" sx={{ color: leftColor }}>
                  {woSumm.isSold ? 'SOLD' : 'UNSOLD'}
                </Typography>{' '}
                -{' '}
                <Typography variant="caption" sx={{ color: rightColor }}>
                  {woSumm.paidShares && woSumm.unpaidShares === 0 && woSumm.paidShares > 0 ? 'PAID' : 'UNPAID'}
                </Typography>
              </>
            )
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
          borderColor,
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
