import ReactGA from 'react-ga4'
import log from 'loglevel'
import Cookies from 'js-cookie' // Import js-cookie
import { useState } from 'react'

export const GDPR_COOKIE_NAME = 'gdpr_consent'
export type ConsentStatus = 'granted' | 'denied' | null

export const PRODUCTION_GA = 'G-M3N6E5P1FP'
export const STAGING_GA = 'G-GGGZ6TSDZ5'
export const LOCALHOST_GA = 'G-3LCK4H15P1'

export type GAUserProps = {
  userId: string
  userType: 'verified' | 'unverified' | 'anonymous'
}

export const useConsentCookie = () => {
  const [consent, setConsentState] = useState<ConsentStatus>((Cookies.get(GDPR_COOKIE_NAME) as ConsentStatus) || null)

  const setConsent = (choice: ConsentStatus) => {
    if (choice === 'granted' || choice === 'denied') {
      Cookies.set(GDPR_COOKIE_NAME, choice, { expires: 365 }) // Set cookie with 1-year expiration
    } else {
      Cookies.remove(GDPR_COOKIE_NAME) // Remove the cookie if consent is reset
    }
    setConsentState(choice)
  }

  return {
    consent,
    setConsent,
  }
}

/**
 * Initialize Google Analytics with the given tracking ID.
 * This function should be called when the user gives consent.
 */
export const initGA = () => {
  try {
    let trackingId = PRODUCTION_GA // Default to production GA
    if (window.location.hostname.startsWith('staging.')) {
      trackingId = STAGING_GA // Use staging GA for staging environments
    } else if (window.location.hostname.startsWith('localhost') || window.location.hostname.startsWith('127.0.1')) {
      trackingId = LOCALHOST_GA // Use localhost GA for local development
    }
    // Pull stage information out of html -> head -> meta <meta name="stage" content="staging" />
    ReactGA.initialize(trackingId, {
      gaOptions: {
        anonymizeIp: true,
      },
    })
  } catch (error) {
    log.error('Error initializing Google Analytics:', error)
  }
}

/**
 * Track a page view in Google Analytics.
 * This function should be called when the user navigates to a new page.
 * @param path
 * @param stage
 */
export const trackPageview = (path: string, props: Record<string, boolean | string | number>) => {
  ReactGA.event('page_view', {
    page_location: path,
    ...props,
  })
}

/**
 * Track an event in Google Analytics.
 * @param action
 * @param category
 * @param label
 * @param stage
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  props?: Record<string, string | number>
) => {
  const params: Record<string, string> = {
    category,
    ...(label && { label }),
    ...props,
  }

  ReactGA.event(action, params)
}

/**
 * Set the user identity in Google Analytics.
 * @param props
 */
export const setGAUser = (props: GAUserProps) => {
  try {
    ReactGA.set({
      user_id: props.userId,
      user_type: props.userType,
    })
    log.debug('GA User set:', props)
  } catch (error) {
    log.error('Error setting GA user:', error)
  }
}

/**
 * Clear the user identity in Google Analytics.
 */
export const clearGAUser = () => {
  try {
    ReactGA.set({
      user_id: undefined,
      user_type: 'anonymous',
    })
    log.debug('GA User cleared')
  } catch (error) {
    log.error('Error clearing GA user:', error)
  }
}

/**
 * Track a search event in Google Analytics.
 * @param searchParams Object with flat key-value search filters
 */
export const trackSearch = (searchParams: Record<string, unknown>) => {
  try {
    ReactGA.event('search', {
      ...searchParams,
    })
  } catch (error) {
    log.error('Error tracking search event:', error)
  }
}
