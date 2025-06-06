import * as React from 'react'
import { Box, Button, useMediaQuery, useTheme, alpha, keyframes } from '@mui/material'

export type AnnoyingCoffeeProps = {
  show?: boolean
}

export const AnnoyingCoffee: React.FC<AnnoyingCoffeeProps> = ({ show }) => {
  const theme = useTheme()
  const mediumDown = useMediaQuery(theme.breakpoints.down('md'))

  const pulse = keyframes`
  0%   { box-shadow: 0 0 0 0 transparent; }
  50%  { box-shadow: 0 0 5px 5px ${alpha(theme.palette.error.light, 0.5)}; }
  100% { box-shadow: 0 0 0 0 transparent; }
  `
  const rotate = keyframes`
  0%   {  transform: rotate(0deg);  }
  20%  { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
  `

  const gradient = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
  `

  if (!show) return null

  return (
    <Box
      sx={{
        position: mediumDown ? 'initial' : 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(2),
        zIndex: 100,
      }}
    >
      <Button
        href="https://ko-fi.com/D1D4I6VJV"
        target="_blank"
        variant="contained"
        size="large"
        sx={{
          backgroundColor: theme.palette.secondary.dark,
          borderRadius: 50,
          animation: `${pulse} 1.5s infinite, ${gradient} 3s ease infinite`,
        }}
        startIcon={
          <Box
            sx={{
              mr: 0.5,
              height: 24,
              width: 24,
              animation: `${rotate} 5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite`,
            }}
          >
            <img height="24" style={{}} src="/images/icons/kofi_symbol_sm.png" alt="Buy Me a Coffee" />
          </Box>
        }
      >
        Support Us!
      </Button>
    </Box>
  )
}
