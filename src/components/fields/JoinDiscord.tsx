import * as React from 'react'
import { Box, Button, useMediaQuery, useTheme, alpha, keyframes } from '@mui/material'
import { DiscordIcon } from '../../icons/Discord'

export type JoinDiscordProps = {
  show?: boolean
}

export const JoinDiscord: React.FC<JoinDiscordProps> = ({ show }) => {
  const theme = useTheme()
  const mediumDown = useMediaQuery(theme.breakpoints.down('md'))

  const pulse = keyframes`
  0%   { box-shadow: 0 0 0 0 transparent; }
  50%  { box-shadow: 0 0 5px 5px ${alpha('#5865F2', 0.5)}; }
  100% { box-shadow: 0 0 0 0 transparent; }
  `
  const rotate = keyframes`
  0%   {  transform: rotate(0deg);  }
  20%  { transform: rotate(-15deg); }
  40%  { transform: rotate(15deg); }
  60%  { transform: rotate(-15deg); }
  80%  { transform: rotate(15deg); }
  100% { transform: rotate(0deg); }
  `

  if (!show) return null

  return (
    <Box
      sx={{
        position: mediumDown ? 'initial' : 'fixed',
        bottom: theme.spacing(3),
        left: theme.spacing(2),
        zIndex: 100,
      }}
    >
      <Button
        href="https://discord.gg/6TKSYHNJha"
        target="_blank"
        variant="contained"
        size="large"
        sx={{
          backgroundColor: '#5865F2',
          color: '#ffffff',
          borderRadius: 50,
          animation: `${pulse} 2s infinite`,
          '&:hover': {
            backgroundColor: alpha('#5865F2', 0.8),
          },
        }}
        startIcon={
          <DiscordIcon
            sx={{
              animation: `${rotate} 2s ease-in-out infinite`,
            }}
          />
        }
      >
        Join Discord
      </Button>
    </Box>
  )
}
