import * as React from 'react'
import { Theme, Typography, useTheme } from '@mui/material'
import { RockIcon } from '../../icons'
import { Box, keyframes } from '@mui/system'
import { fontFamilies } from '../../theme'

export interface PageLoaderProps {
  title?: string
  subtitle?: string
  loading?: boolean
  small?: boolean
}

const pulse = (theme: Theme) => keyframes`
0% { 
  text-shadow: 0 0 5px black, 0 0 5px black;
  color: ${theme.palette.primary.main};
}
50% { 
  text-shadow: 0 0 2px black, 0 0 5px black;
  color: ${theme.palette.secondary.dark};
}
100% { 
  text-shadow: 0 0 5px black, 0 0 5px black;
  color:  ${theme.palette.primary.main};
}
`

const rotationAnimation = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`

const useStyleBig = (theme: Theme): Record<string, React.CSSProperties> => ({
  wrapper: {
    zIndex: 2000,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    textAlign: 'center',
  },
  iconWrapper: {
    width: '180px',
    height: '180px',
  },
  iconShadow: {
    fontSize: 150,
  },
  icon: {
    fontSize: 130,
  },
  primaryText: {
    fontSize: 30,
  },
})

const useStyleSmall = (theme: Theme): Record<string, React.CSSProperties> => ({
  wrapper: {
    position: 'absolute',
    top: '70px',
    right: '2%',
    textAlign: 'center',
  },
  iconWrapper: {
    width: '60px',
    height: '60px',
  },
  iconShadow: {
    fontSize: 70,
  },
  icon: {
    fontSize: 60,
  },
  primaryText: {
    fontSize: 12,
  },
})

export const PageLoader: React.FC<PageLoaderProps> = ({ title, subtitle, loading, small }) => {
  const theme = useTheme()
  const style = small ? useStyleSmall(theme) : useStyleBig(theme)
  if (!loading) return null

  return (
    <Box style={style.wrapper}>
      <Box
        sx={{
          ...style.iconWrapper,
          margin: 'auto',
          position: 'relative',
          zIndex: 2,
          animation: `${rotationAnimation} 3s infinite`,
        }}
      >
        <RockIcon
          sx={{
            ...style.iconShadow,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            color: 'black',
            filter: 'blur(5px)',
            opacity: 0.5,
            zIndex: 1,
          }}
        />
        <RockIcon
          sx={{
            ...style.icon,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            color: theme.palette.primary.main,
            zIndex: 2,
          }}
        />
      </Box>
      {title && (
        <Typography
          sx={{
            ...style.primaryText,
            fontWeight: 'bold',
            mt: 2,
            color: theme.palette.primary.main,
            fontFamily: fontFamilies.robotoMono,
            animation: `${pulse(theme)} 3s infinite`,
          }}
        >
          {title}
        </Typography>
      )}
      {subtitle && <Typography variant="caption">{subtitle}</Typography>}
    </Box>
  )
}
