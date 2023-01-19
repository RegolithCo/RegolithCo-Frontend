import { Box, useTheme } from '@mui/material'
import { SxProps, Theme } from '@mui/system'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { Copyright } from './Copyright'
import { AppVersion } from './fields/AppVersion'
import { SCVersion } from './fields/SCVersion'
// import { Box, SxProps, Theme } from '@mui/material'

/* eslint-disable no-unused-vars */
export enum BGImages {
  DEFAULT = 'bg1.png',
  OPTION1 = 'bg2.png',
  OPTION2 = 'bg3.png',
  SALVAGE1 = 'salvage1.png',
  SALVAGE2 = 'salvage2.png',
  ASTEROIDS1 = 'asteroids1.png',
  REFINERY1 = 'refinery1.png',
}
/* eslint-enable no-unused-vars */

const styles: Record<string, SxProps<Theme>> = {
  container: {
    flex: '1 1',
    margin: 0,
    overflow: 'hidden',
    backgroundImage: {
      md: `url('${process.env.PUBLIC_URL}/images/bg/${BGImages.OPTION1}')`,
    },
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

  // console.log('AppWrapperContainer', location)
  const pathnameRegex = pathname.match(/^(\/[^/]*)/)
  const allMatches = pathnameRegex && pathnameRegex.length > 0 ? pathnameRegex : ['/']

  let bgImage
  switch (allMatches[0]) {
    case '/':
      bgImage = BGImages.OPTION2
      break
    case '/profile':
      bgImage = BGImages.OPTION1
      break
    case '/tables':
      bgImage = BGImages.SALVAGE2
      break
    case '/about':
      bgImage = BGImages.SALVAGE1
      break
    case '/workorder':
      bgImage = BGImages.REFINERY1
      break
    case '/session':
      bgImage = BGImages.OPTION2
      break
    default:
      bgImage = BGImages.DEFAULT
  }

  return <AppWrapper bgImage={bgImage} children={children} />
}

export const AppWrapper = ({ children, bgImage }: { children: React.ReactNode; bgImage?: BGImages }): JSX.Element => {
  const theme = useTheme()
  const bgImageFinal = bgImage ? bgImage : BGImages.DEFAULT
  return (
    <Box
      sx={{
        ...styles.container,
        backgroundImage: {
          md: `url('${process.env.PUBLIC_URL}/images/bg/${bgImageFinal}')`,
        },
      }}
    >
      <Box sx={styles.overlay}>{children}</Box>
      <Box sx={{ position: 'absolute', bottom: 10, left: 10, [theme.breakpoints.down('sm')]: { display: 'None' } }}>
        <SCVersion semver="3.18" />
      </Box>
      <AppVersion />
      <Box sx={{ position: 'absolute', bottom: 10, right: 10 }}>
        <Copyright />
      </Box>
    </Box>
  )
}
