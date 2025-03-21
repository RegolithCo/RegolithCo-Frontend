import * as React from 'react'
import { Badge, useTheme } from '@mui/material'
import { Factory } from '@mui/icons-material'
import { fontFamilies } from '../../theme'
import { getRefineryAbbrev, RefineryEnum } from '@regolithco/common'

export interface RefineryIconProps {
  refinery: RefineryEnum
}

export const RefineryIcon: React.FC<RefineryIconProps> = ({ refinery }) => {
  const theme = useTheme()
  return (
    <Badge
      color="primary"
      badgeContent={getRefineryAbbrev(refinery).toUpperCase()}
      sx={{
        border: `3px solid ${theme.palette.secondary.light}`,
        borderRadius: '50%',
        '& .MuiBadge-badge': {
          backgroundColor: '#00000055',
          color: 'white',
          textShadow: '0px -2px 2px #000; 0px -2px 4px #000; 0px -4px 2px #000',
          fontSize: '0.8rem',
          fontFamily: fontFamilies.robotoMono,
          fontWeight: 'bold',
          padding: 0,
          top: '10%',
          right: '50%',
        },
      }}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
    >
      <Factory
        sx={{
          m: 1,
          width: 15,
          height: 15,
        }}
      />
    </Badge>
  )
}
