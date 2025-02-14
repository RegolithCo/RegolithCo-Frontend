/* eslint-disable @typescript-eslint/no-explicit-any */
import { Config } from './types'

// const is_dev = import.meta.env.MODE === 'development'

const config: Config =
  (window as any).CLIENT_CONFIG && !(window as any).CLIENT_CONFIG.note
    ? (window as any).CLIENT_CONFIG
    : {
        apiUrl: import.meta.env.VITE_API_URL,
        stage: import.meta.env.VITE_STAGE,
        apiUrlPub: import.meta.env.VITE_API_URL_PUB,
        googleAuth: import.meta.env.VITE_GOOGLE_AUTH,
        shareUrl: import.meta.env.VITE_SHARE_URL,
        googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        discordClientId: import.meta.env.VITE_DISCORD_CLIENT_ID,
      }

export default config
