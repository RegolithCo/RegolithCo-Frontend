import { Box, useMediaQuery, useTheme, SxProps, Theme, keyframes } from '@mui/material'
import { alpha, darken } from '@mui/material/styles'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { Copyright } from './Copyright'
import { AnnoyingCoffee } from './fields/AnnoyingCoffee'
import { JoinDiscord } from './fields/JoinDiscord'

const moveBackground = keyframes`
  0% {
    background-position: 
      50% 50%, 
      0px 0px,
      0px 0px,
      0px 0px, 
      0px 0px, 
      0% 50%, 
      100% 50%;
  }
  50% {
    background-position: 
      50% 50%, 
      0px 0px,
      0px 0px,
      30px 30px, 
      -55px 55px, 
      100% 50%, 
      0% 50%;
  }
  100% {
    background-position: 
      50% 50%, 
      0px 0px,
      0px 0px,
      60px 60px, 
      -110px 110px, 
      0% 50%, 
      100% 50%;
  }
`

const styles: Record<string, SxProps<Theme>> = {
  container: {
    flex: '1 1',
    margin: 0,
    overflow: 'hidden',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  },
  overlay: {
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    // margin: 0,
    // display: 'flex',
    // flexDirection: 'column',
    // backgroundColor: 'rgba(39, 41, 53, 0.4)',
  },
}

export const AppWrapperContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { pathname } = useLocation()

  const pathnameRegex = pathname.match(/^(\/[^/]*)/)
  const allMatches = pathnameRegex && pathnameRegex.length > 0 ? pathnameRegex : ['/']

  // match /session/20780cc1-28b8-4169-a004-b874687c79cd/dash but not /session
  const hideCoffee = pathname.match(/^\/session\/[0-9a-f-]+/)

  return (
    <AppWrapper showCoffee={!hideCoffee} rootPath={allMatches[0]}>
      {children}
    </AppWrapper>
  )
}

export interface AppWrapperProps {
  rootPath?: string
  showCoffee?: boolean
  children: React.ReactNode
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children, showCoffee, rootPath }) => {
  const theme = useTheme()
  const mediumUp = useMediaQuery(theme.breakpoints.up('md'))
  const isHome = rootPath === '/'

  const dotColor = alpha(theme.palette.secondary.dark, 0.2)
  const starColor = alpha(theme.palette.text.primary, 0.2)
  const bgColor = darken(theme.palette.secondary.dark, 0.8)
  const nebula1 = alpha(theme.palette.secondary.dark, 0.5)
  const nebula2 = alpha(theme.palette.secondary.main, 0.2)
  const gridColor = alpha(theme.palette.divider, 0.04)

  return (
    <Box
      sx={{
        ...styles.container,
        backgroundColor: bgColor,
        backgroundImage: `
          radial-gradient(circle at 50% 50%, transparent 20%, ${bgColor} 120%),
          linear-gradient(${gridColor} 1px, transparent 1px),
          linear-gradient(90deg, ${gridColor} 1px, transparent 1px),
          radial-gradient(${dotColor} 2px, transparent 2px),
          radial-gradient(${starColor} 1px, transparent 1px),
          radial-gradient(circle at 50% 50%, ${nebula1} 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, ${nebula2} 0%, transparent 50%)
        `,
        backgroundSize: `
          100% 100%, 
          40px 40px,
          40px 40px,
          60px 60px, 
          110px 110px, 
          100vw 100vh, 
          100vw 100vh
        `,
        animation: `${moveBackground} 60s linear infinite`,
      }}
    >
      <Box sx={styles.overlay}>
        {children}

        {(mediumUp || isHome) && (
          <Box
            sx={
              mediumUp
                ? { position: 'absolute', bottom: 5, right: 5 }
                : {
                    display: showCoffee ? undefined : 'none',
                  }
            }
          >
            <Copyright />
          </Box>
        )}
        <AnnoyingCoffee show={showCoffee && (mediumUp || isHome)} />
        <JoinDiscord show={showCoffee && (mediumUp || isHome)} />
      </Box>
    </Box>
  )
}
