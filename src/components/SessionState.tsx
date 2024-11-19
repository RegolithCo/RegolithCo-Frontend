import * as React from 'react'

import { SessionStateEnum } from '@regolithco/common'
import { Tooltip, Typography, useTheme } from '@mui/material'

export interface SessionStateProps {
  sessionState: SessionStateEnum
  size: 'small' | 'large'
  hasTooltip?: boolean
}

// const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({})

export const SessionState: React.FC<SessionStateProps> = ({ sessionState, size, hasTooltip }) => {
  const theme = useTheme()
  // const styles = stylesThunk(theme)
  if (sessionState === SessionStateEnum.Active) return null
  return (
    <Tooltip
      arrow
      title={
        hasTooltip &&
        (sessionState !== SessionStateEnum.Closed
          ? 'Session is currently active'
          : 'Session has ended. You can still edit work orders and pay shares but you cannot create new work orders or scouting finds')
      }
    >
      <Typography
        sx={{
          fontWeight: 'bold',
          lineHeight: 1.2,
          my: 1,
          px: 2,
          maxWidth: 100,
          textAlign: 'center',
          borderRadius: 2,
          border: `2px solid ${
            sessionState !== SessionStateEnum.Closed ? theme.palette.success.main : theme.palette.grey[500]
          }`,
          textShadow: '1px 1px 4px #000',
          color: sessionState !== SessionStateEnum.Closed ? theme.palette.success.main : theme.palette.grey[500],
          textTransform: 'uppercase',
          fontSize: '1rem',
        }}
      >
        {sessionState !== SessionStateEnum.Closed ? 'Active' : 'Closed'}
      </Typography>
    </Tooltip>
  )
}
