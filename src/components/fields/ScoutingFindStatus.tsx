import * as React from 'react'
import { ScoutingFindTypeEnum } from '@regolithco/common'
import { useTheme } from '@mui/system'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { SvgIconComponent } from '@mui/icons-material'
import { Chip, Tooltip } from '@mui/material'
import { fontFamilies } from '../../theme'

interface WorkOrderStatusProps {
  num: number
  sfType: ScoutingFindTypeEnum
}

export const ScoutingFindStatus: React.FC<WorkOrderStatusProps> = ({ num, sfType }) => {
  const theme = useTheme()
  if (!num || num === 0) return <></>
  let Icon: SvgIconComponent
  let tooltip = ''
  switch (sfType) {
    case ScoutingFindTypeEnum.Salvage:
      tooltip = `${num} Salvage Cluster${num > 1 ? 's' : ''}`
      Icon = ClawIcon
      break
    case ScoutingFindTypeEnum.Ship:
      tooltip = `${num} Ship Cluster${num > 1 ? 's' : ''}`
      Icon = RockIcon
      break
    case ScoutingFindTypeEnum.Vehicle:
      tooltip = `${num} Vehicle Gem Cluster${num > 1 ? 's' : ''}`
      Icon = GemIcon
      break
  }
  const fgColor = theme.palette.grey[50]
  const bgColor = theme.palette.grey[700]

  return (
    <Tooltip placement="top" arrow title={tooltip}>
      <Chip
        size="small"
        sx={{
          background: bgColor,
          color: fgColor,
          fontFamily: fontFamilies.robotoMono,
          fontWeight: 'bold',
          fontSize: '0.8rem',
        }}
        label={num}
        avatar={<Icon sx={{ color: fgColor, fontSize: '1.5rem' }} />}
      />
    </Tooltip>
  )
}
