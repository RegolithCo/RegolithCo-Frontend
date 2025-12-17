import { Box, useMediaQuery, useTheme, SxProps, Theme } from '@mui/material'
import { alpha, darken } from '@mui/material/styles'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { Copyright } from './Copyright'
import { AnnoyingCoffee } from './fields/AnnoyingCoffee'
import { JoinDiscord } from './fields/JoinDiscord'
import { MatrixBackground } from './MatrixBackground'
import { StarsParallax } from './StarsParallax'
import { VHSBackground } from './VHSBackground'

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

export const AppWrapperContainer: React.FC<
  React.PropsWithChildren<{ backgroundEffect?: 'matrix' | 'stars' | 'vhs' }>
> = ({ children, backgroundEffect }) => {
  const { pathname } = useLocation()

  const pathnameRegex = pathname.match(/^(\/[^/]*)/)
  const allMatches = pathnameRegex && pathnameRegex.length > 0 ? pathnameRegex : ['/']

  // match /session/20780cc1-28b8-4169-a004-b874687c79cd/dash but not /session
  const hideCoffee = pathname.match(/^\/session\/[0-9a-f-]+/)

  return (
    <AppWrapper showCoffee={!hideCoffee} rootPath={allMatches[0]} backgroundEffect={backgroundEffect}>
      {children}
    </AppWrapper>
  )
}

export interface AppWrapperProps {
  rootPath?: string
  showCoffee?: boolean
  children: React.ReactNode
  backgroundEffect?: 'matrix' | 'stars' | 'vhs'
}

export const AppWrapper: React.FC<AppWrapperProps> = ({
  children,
  showCoffee,
  rootPath,
  backgroundEffect = 'stars',
}) => {
  const theme = useTheme()
  const mediumUp = useMediaQuery(theme.breakpoints.up('md'))
  const isHome = rootPath === '/'

  return (
    <Box sx={styles.container}>
      {backgroundEffect === 'matrix' && (
        <MatrixBackground
          color={alpha(theme.palette.primary.main, 0.55)}
          backgroundColor={alpha(darken(theme.palette.secondary.dark, 0.95), 0.05)}
          redrawInterval={250}
        />
      )}
      {backgroundEffect === 'stars' && <StarsParallax />}
      {backgroundEffect === 'vhs' && (
        <VHSBackground
          backgroundColor={theme.palette.background.default}
          overlayColor={darken(theme.palette.primary.main, 0.5)}
          textColor={theme.palette.primary.contrastText}
          shadowColors={[
            theme.palette.secondary.main,
            theme.palette.info.main,
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.error.main,
          ]}
        />
      )}
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
