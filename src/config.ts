/* eslint-disable @typescript-eslint/no-explicit-any */
import { Config } from './types'
// import log from 'loglevel'

const config: Config = {
  authDomain: (window as any).CLIENT_CONFIG.authDomain || process.env.REACT_APP_AUTH_DOMAIN,
  userPool: (window as any).CLIENT_CONFIG.userPool || process.env.REACT_APP_USERPOOL,
  apiUrl: (window as any).CLIENT_CONFIG.apiUrl || process.env.REACT_APP_API_URL,
  userPoolClientId: (window as any).CLIENT_CONFIG.userPoolClientId || process.env.REACT_APP_CLIENTID,
}

export default config
