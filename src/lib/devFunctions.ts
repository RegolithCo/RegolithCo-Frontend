import { AuthTypeEnum } from '@regolithco/common'
import log from 'loglevel'
import { wipeLocalLookups } from './utils'

export let DEV_HEADERS: Record<string, string> = {}

declare global {
  interface Window {
    clearLookups: () => void
    dev_user: (devUserId?: string) => void
    toggleDevLogs: () => void
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
    // Wipe away and re-fetch all the lookup data
    wipeLocalLookups()
  }

  // Turn on extra logging
  window.toggleDevLogs = () => {
    if (log.getLevel() === log.levels.DEBUG) {
      log.setLevel(log.levels.INFO)
      log.info('Logging is set to INFO')
    } else {
      log.setLevel(log.levels.DEBUG)
      log.debug('Logging is set to DEBUG')
    }
  }

  /**
   * This function lets you impersonate users in the syste, THIS ONLY WORKS IN DEVELOPMENT
   * AND ONLY WHEN YOU'RE RUNNING AGAINST A LOCALHOST API WITH DOCKER. Production and staging
   * filter these headers out anyway.
   * @param authId
   * @param authType
   */
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
