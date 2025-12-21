import { Box, useMediaQuery, useTheme, SxProps, Theme } from '@mui/material'
import { alpha, darken } from '@mui/material/styles'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { Copyright } from './Copyright'
import { AnnoyingCoffee } from './fields/AnnoyingCoffee'
import { JoinDiscord } from './fields/JoinDiscord'
import { MatrixBackground } from './backgrounds/MatrixBackground'
import { StarsParallax } from './backgrounds/StarsParallax'
import { VHSBackground } from './backgrounds/VHSBackground'
import { ObjectValues } from '@regolithco/common'

const BackgroundEffectEnum = {
  //
  MATRIX: 'matrix',
  MATRIX_ERROR: 'matrix-error',
  STARS: 'stars',
  STARS_BLUE: 'stars-blue',
  VHS: 'vhs',
  NONE: 'none',
} as const
export type BackgroundEffectEnum = ObjectValues<typeof BackgroundEffectEnum>

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

  let backgroundEffect: BackgroundEffectEnum = BackgroundEffectEnum.STARS
  switch (allMatches[0]) {
    case '/':
      backgroundEffect = BackgroundEffectEnum.STARS_BLUE
      break
    case '/about':
    case '/loadouts':
      backgroundEffect = BackgroundEffectEnum.VHS
      break
    case '/cluster':
      backgroundEffect = BackgroundEffectEnum.STARS_BLUE
      break
    case '/workorder':
      backgroundEffect = BackgroundEffectEnum.MATRIX
      break
    // Those survey tables are so non-performant that we really can't have any background
    case '/survey':
      backgroundEffect = BackgroundEffectEnum.NONE
      break
    default:
      backgroundEffect = BackgroundEffectEnum.STARS
      break
  }

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
  backgroundEffect?: BackgroundEffectEnum
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children, showCoffee, rootPath, backgroundEffect }) => {
  const theme = useTheme()
  const mediumUp = useMediaQuery(theme.breakpoints.up('md'))
  const isHome = rootPath === '/'

  return (
    <Box sx={styles.container}>
      {mediumUp && backgroundEffect === 'matrix' && (
        <MatrixBackground
          color={alpha(theme.palette.secondary.dark, 0.55)}
          backgroundColor={alpha(darken(theme.palette.secondary.dark, 0.95), 0.3)}
          redrawInterval={100}
        />
      )}
      {mediumUp && backgroundEffect === 'stars' && (
        <StarsParallax color1={theme.palette.primary.main} color2={theme.palette.secondary.dark} starColor="#ffffff" />
      )}
      {mediumUp && backgroundEffect === 'stars-blue' && (
        <StarsParallax color1={theme.palette.info.main} color2={theme.palette.info.main} starColor="#ffffff" />
      )}
      {mediumUp && backgroundEffect === 'vhs' && (
        <VHSBackground
          backgroundColor={darken(theme.palette.background.default, 0.6)}
          overlayColor={darken(theme.palette.info.dark, 0.6)}
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
