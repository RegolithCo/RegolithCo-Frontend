import { AuthTypeEnum } from '@regolithco/common'
import log from 'loglevel'
import axios from 'axios'
import config from '../config'

export let DEV_HEADERS: Record<string, string> = {}

declare global {
  interface Window {
    dev_user: (devUserId?: string) => void
    reanimateSession: (sessionId: string) => Promise<void>
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
  window.dev_user = (authId?: string, authType?: AuthTypeEnum) => {
    if (!authId && DEV_HEADERS['dev_user']) {
      delete DEV_HEADERS['dev_user']
      localStorage.setItem('DEV_HEADERS', JSON.stringify(DEV_HEADERS))
      log.debug('DEV_USER: Switched user to', authId)
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

export const devQueries = (headers: Record<string, string>) => {
  /**
   * Reanimate the session if it has ended: THIS ONLY WORKS IN DEVELOPMENT
   * @param sessionId
   * @returns
   */
  window.reanimateSession = async (sessionId: string) => {
    return axios
      .post(
        config.apiUrl,
        {
          query: `
            mutation {
              reanimateSession(sessionId: "${sessionId}") {
                sessionId
                name
                updatedAt
              }
            }
          `,
        },
        {
          headers,
        }
      )
      .then((resp) => {
        if (!resp || !resp.data || (resp.data.errors && resp.data.errors.length > 0))
          throw new Error('ERROR:' + JSON.stringify(resp.data.errors))
        log.info('SUCCESSFULLY REANIMATED SESSION. DO a hard refresh')
      })
      .catch((err) => {
        log.error('Error reanimating session', err)
      })
  }
}
