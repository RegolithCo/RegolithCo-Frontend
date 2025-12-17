import { Box, useMediaQuery, useTheme, SxProps, Theme } from '@mui/material'
import { alpha, darken } from '@mui/material/styles'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { Copyright } from './Copyright'
import { AnnoyingCoffee } from './fields/AnnoyingCoffee'
import { JoinDiscord } from './fields/JoinDiscord'
import { MatrixBackground } from './MatrixBackground'

const styles: Record<string, SxProps<Theme>> = {
  container: {
    flex: '1 1',
    margin: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  overlay: {
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'relative',
    zIndex: 1,
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

  return (
    <Box sx={styles.container}>
      <MatrixBackground
        color={alpha(theme.palette.primary.main, 0.55)}
        backgroundColor={alpha(darken(theme.palette.secondary.dark, 0.95), 0.05)}
        redrawInterval={150}
      />
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
