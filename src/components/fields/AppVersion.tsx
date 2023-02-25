import * as React from 'react'
import { Box, useTheme } from '@mui/material'
import { fontFamilies, theme } from '../../theme'

export type AppVersion = {
  version: string
  commit: string
  stage: string
}

export const AppVersion: React.FC = () => {
  const theme = useTheme()
  const [version, setVersion] = React.useState<AppVersion>({
    version: '0.0.0',
    commit: '0000000',
    stage: 'dev',
  })

  React.useEffect(() => {
    const version = document.querySelector<HTMLMetaElement>('meta[name=version]')?.content
    const commit = document.querySelector<HTMLMetaElement>('meta[name=commit]')?.content
    const stage = document.querySelector<HTMLMetaElement>('meta[name=stage]')?.content
    setVersion({
      version: !version || version === '%VERSION%' ? '0.0.0' : version,
      commit: !commit || commit === '%COMMIT%' ? '0000000' : commit,
      stage: !stage || stage === '%STAGE%' ? 'dev' : stage,
    })
  }, [])

  let versionStr = `v${version?.version}`
  const isProd = version.stage === 'production'
  if (!isProd) {
    versionStr += `-${version?.stage} [#${version.commit}]`
  }
  // Turn this off on production
  if (isProd) return null
  return (
    <Box
      sx={{
        zIndex: 0,
        outline: 'none',
        userSelect: 'none',
        position: 'absolute',
        bottom: 0,
        fontFamily: fontFamilies.robotoMono,
        fontSize: 8,
        color: isProd ? 'white' : theme.palette.error.main,
        textShadow: '1px 1px 3px #000',
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'center',

        [theme.breakpoints.up('md')]: {
          fontSize: isProd ? 10 : 15,
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
      >
        {isProd
          ? 'This product is still in soft launch. Expect data wipes until launch is announced!'
          : 'THIS IS A TEST SERVER!!'}
      </Box>
    </Box>
  )
}
