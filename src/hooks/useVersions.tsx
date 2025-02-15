import { scVersion } from '@regolithco/common'
import * as React from 'react'
import { getVersions } from '../config'

export type AppVersion = {
  appVersion: string
  scVersion: string
  commit: string
  stage: string
  isProd: boolean
}

export const useVersions = () => {
  const [version, setVersion] = React.useState<AppVersion>({
    appVersion: '0.0.0',
    commit: '0000000',
    scVersion,
    stage: 'dev',
    isProd: false,
  })

  React.useEffect(() => {
    const { appVersion, commit, stage } = getVersions()

    setVersion({
      appVersion: !appVersion || appVersion === '%VERSION%' ? '0.0.0' : appVersion,
      scVersion,
      commit: !commit || commit === '%COMMIT%' ? '0000000' : commit,
      stage: !stage || stage === '%STAGE%' ? 'dev' : stage,
      isProd: stage === 'production',
    })
  }, [])

  return version
}
