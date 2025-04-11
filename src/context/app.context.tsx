import { createContext } from 'react'
import log from 'loglevel'

export interface AppContextType {
  hideNames: boolean
  setHideNames: (hideNames: boolean) => void
  getSafeName: (scName?: string) => string
  maintenanceMode?: string
  APIWorking?: boolean
}

const notAvailable =
  (name: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any) => {
    log.error(`${name} not available in app context`, args)
  }

export const appContextDefault: AppContextType = {
  hideNames: false,
  setHideNames: notAvailable('setHideNames'),
  getSafeName: (scName?: string) => scName || 'UNNAMEDUSER',
}

export const AppContext = createContext<AppContextType>(appContextDefault)
