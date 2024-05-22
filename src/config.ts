/* eslint-disable @typescript-eslint/no-explicit-any */
import { Config } from './types'
import.meta.env
// import log from 'loglevel'

const is_dev = import.meta.env.MODE === 'development'

const config: Config = {
  apiUrl: (window as any).CLIENT_CONFIG.apiUrl || import.meta.env.VITE_API_URL,
  stage: (window as any).CLIENT_CONFIG.stage || import.meta.env.VITE_STAGE,
  apiUrlPub: (window as any).CLIENT_CONFIG.apiUrlPub || import.meta.env.VITE_API_URL_PUB,
  shareUrl: (window as any).CLIENT_CONFIG.shareUrl || import.meta.env.VITE_SHARE_URL,
  googleClientId: (window as any).CLIENT_CONFIG.googleClientId || import.meta.env.VITE_GOOGLE_CLIENT_ID,
  discordClientId: (window as any).CLIENT_CONFIG.discordClientId || import.meta.env.VITE_DISCORD_CLIENT_ID,
}

export default config
