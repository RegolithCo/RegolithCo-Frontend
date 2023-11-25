import * as React from 'react'
import { Fab, Tooltip, useMediaQuery, useTheme } from '@mui/material'
import { Coffee } from '@mui/icons-material'
import { alpha, keyframes } from '@mui/system'

export type AnnoyingCoffeeProps = {
  show?: boolean
  navigate?: () => void
}

export const AnnoyingCoffee: React.FC<AnnoyingCoffeeProps> = ({ show, navigate }) => {
  const theme = useTheme()
  const mediumDown = useMediaQuery(theme.breakpoints.down('md'))

  const pulse = keyframes`
  0% { 
    box-shadow: 0 0 0 0 transparent; 
  }
  50% { 
    box-shadow: 0 0 5px 5px ${alpha(theme.palette.primary.dark, 0.5)}; 
  }
  100% { 
    box-shadow: 0 0 0 0 transparent; 
  }
  `

  const rotate = keyframes`
    0% { 
      transform: rotate(0deg); 
    }
    20% { 
      transform: rotate(0deg); 
    }
    100% { 
      transform: rotate(360deg); 
    }
    `
  const gradient = keyframes`
      0% { 
        background-position: 0% 50%; 
      }
      50% { 
        background-position: 100% 50%; 
      }
      100% { 
        background-position: 0% 50%; 
      }
      `

  if (!show || !navigate || mediumDown) return null
  return (
    <Tooltip title="Buy me a coffee" placement="left">
      <Fab
        color="primary"
        aria-label="add"
        onClick={navigate}
        sx={{
          border: `3px solid black`,
          position: 'fixed',
          animation: `${pulse} 1.5s infinite, ${gradient} 3s ease infinite`,
          bottom: theme.spacing(3),
          right: theme.spacing(2),
          background: `linear-gradient(270deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
          backgroundSize: '200% 200%',
        }}
      >
        <Coffee
          sx={{
            animation: `${rotate} 10s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite`,
          }}
        />
      </Fab>
    </Tooltip>
  )
}
