import * as React from 'react'
import { Box, useTheme } from '@mui/system'
import { AccountCircle, NoAccounts } from '@mui/icons-material'
import { Chip, Tooltip } from '@mui/material'
import { fontFamilies } from '../../theme'

interface SessionUsersStatusProps {
  numActive: number
  numTotal: number
}

export const SessionUsersStatus: React.FC<SessionUsersStatusProps> = ({ numActive, numTotal }) => {
  const theme = useTheme()
  const tooltip = ''

  const fgColor = theme.palette.grey[200]
  const bgColor = theme.palette.grey[900]

  const numInnactive = numTotal - numActive

  return (
    <Tooltip placement="top" arrow title={tooltip}>
      <Box>
        <Chip
          size="small"
          sx={{
            background: bgColor,
            color: fgColor,
            fontFamily: fontFamilies.robotoMono,
            fontWeight: 'bold',
            fontSize: '0.8rem',
          }}
          label={numActive}
          avatar={<AccountCircle sx={{ fontSize: '1.5rem' }} />}
        />
        {numInnactive > 0 && (
          <Chip
            size="small"
            sx={{
              ml: 0.5,
              background: bgColor,
              color: fgColor,
              fontFamily: fontFamilies.robotoMono,
              fontWeight: 'bold',
              fontSize: '0.8rem',
            }}
            label={numInnactive}
            avatar={<NoAccounts sx={{ color: fgColor, fontSize: '1.5rem' }} />}
          />
        )}
      </Box>
    </Tooltip>
  )
}
