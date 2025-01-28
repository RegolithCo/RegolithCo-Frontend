import { AuthTypeEnum } from '@regolithco/common'
import log from 'loglevel'
import { wipeLocalLookups } from './utils'

export let DEV_HEADERS: Record<string, string> = {}

declare global {
  interface Window {
    clearLookups: () => void
    dev_user: (devUserId?: string) => void
  }
}

if (import.meta.env.MODE === 'development') {
  // Fetch DEV_HEADERS from localStorage and make sure to account for the case where it's not set
  DEV_HEADERS = JSON.parse(localStorage.getItem('DEV_HEADERS') || '{}') as Record<string, string>
  log.debug('DEV_USER: Using DEV_HEADERS', JSON.stringify(DEV_HEADERS))

  /**
   * Set the user. THIS ONLY WORKS IN DEVELOPMENT
   * @param authId
   * @param authType
   */
  window.clearLookups = () => {
    wipeLocalLookups()
  }
  window.dev_user = (authId?: string, authType?: AuthTypeEnum) => {
    if (!authId) {
      delete DEV_HEADERS['dev_user']
      localStorage.removeItem('DEV_HEADERS')
      log.debug('DEV_USER: Removing DEV Users')
    } else if (authId && authType && authId.length > 5) {
      DEV_HEADERS['dev_user'] = authId
      DEV_HEADERS['authType'] = authType
      localStorage.setItem('DEV_HEADERS', JSON.stringify(DEV_HEADERS))
      log.debug('Switched user to', authId)
    }
    // Regardless, clear the apollo cache and do a hard window reload
    window.location.reload()
  }
} // End if (import.meta.env.MODE === 'development')

export const devQueries = (headers: Record<string, string>) => {}
