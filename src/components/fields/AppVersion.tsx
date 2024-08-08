import * as React from 'react'
import { Box, useTheme } from '@mui/material'
import { fontFamilies } from '../../theme'
import { useVersions } from '../../hooks/useVersions'

export type AppVersion = {
  version: string
  commit: string
  stage: string
}

export const AppVersion: React.FC = () => {
  const theme = useTheme()
  const { commit, isProd, stage, appVersion } = useVersions()

  let versionStr = `v${appVersion}`
  if (!isProd) {
    versionStr += `-${stage} [#${commit}]`
  }

  return (
    <Box
      sx={{
        zIndex: 0,
        outline: 'none',
        userSelect: 'none',
        fontFamily: fontFamilies.robotoMono,
        // fontSize: 8,
        color: isProd ? 'white' : theme.palette.error.main,
        textShadow: '1px 1px 3px #000',

        [theme.breakpoints.up('md')]: {
          // fontSize: 10,
          bottom: 3,
        },
      }}
    >
      Regolith Co. {versionStr}
      <Box
        sx={{
          display: 'inline',
          [theme.breakpoints.down('sm')]: {
            display: 'None',
          },
        }}
      ></Box>
    </Box>
  )
}
