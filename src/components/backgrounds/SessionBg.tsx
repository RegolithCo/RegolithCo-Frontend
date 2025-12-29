import { Box, useTheme } from '@mui/material'
import { darken } from '@mui/material/styles'
import React from 'react'

interface SessionBgProps {
  color1?: string
  color2?: string
}

export const SessionBg: React.FC<SessionBgProps> = ({ color1, color2 }) => {
  const theme = useTheme()
  const bgFg = darken(color1 || theme.palette.secondary.dark, 0.6)
  const bgMg = darken(color2 || theme.palette.primary.main, 0.9)

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        background: `radial-gradient(ellipse at center bottom, ${bgFg} 0%, ${bgMg} 100%)`,
      }}
    />
  )
}
