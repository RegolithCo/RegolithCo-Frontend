/* eslint-disable @typescript-eslint/no-explicit-any */
import log from 'loglevel'
import { Config } from './types'

// const is_dev = import.meta.env.MODE === 'development'
export const getVersions = (): {
  appVersion: string
  commit: string
  stage: string
} => {
  let appVersion = '0.0.0'
  let commit = '0000000'
  let stage = 'dev'
  try {
    appVersion = document.querySelector<HTMLMetaElement>('meta[name=version]')?.content || '0.0.0'
    commit = document.querySelector<HTMLMetaElement>('meta[name=commit]')?.content || '0000000'
    stage = document.querySelector<HTMLMetaElement>('meta[name=stage]')?.content || 'dev'
  } catch (e) {
    log.error(e)
  }
  return {
    appVersion,
    commit,
    stage,
  }
}

const config: Config =
  (window as any).CLIENT_CONFIG && !(window as any).CLIENT_CONFIG.note
    ? (window as any).CLIENT_CONFIG
    : {
        apiUrl: import.meta.env.VITE_API_URL,
        stage: import.meta.env.VITE_STAGE || 'development',
        apiUrlPub: import.meta.env.VITE_API_URL_PUB,
        googleAuth: import.meta.env.VITE_GOOGLE_AUTH,
        shareUrl: import.meta.env.VITE_SHARE_URL,
        googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        discordClientId: import.meta.env.VITE_DISCORD_CLIENT_ID,
      }

export default config
