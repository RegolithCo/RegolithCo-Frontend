import { useLocation } from 'react-router-dom'
import { createContext, PropsWithChildren, useContext, useEffect } from 'react'
import { ConsentStatus, initGA, trackEvent, trackPageview, useConsentCookie } from '../lib/analytics'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Typography,
  useTheme,
} from '@mui/material'
import { Stack } from '@mui/system'
import { Cancel, Cookie } from '@mui/icons-material'
import { LoginContext } from '../context/auth.context'
import config from '../config'

/**
 * The AppContext is anything (settings, themes etc.) that is shared across the app.
 */
export const AnalyticsContext = createContext<{
  // Consent is the GDPR Consent to use Analytics. It is stored in a cookie.
  consent: ConsentStatus
  setConsent: (choice: ConsentStatus) => void
  // trackEvent is a function to track events in Google Analytics.
  trackEvent: (action: string, category: string, label?: string) => void
}>({
  consent: null,
  setConsent: () => {
    throw new Error('setConsent function not implemented')
  },
  trackEvent: () => {
    throw new Error('trackEvent function not implemented')
  },
})

/**
 * This should be instantiated INSIDE the router component so that useLocation can work properly
 * The app router holds the state of the app, including the user's consent status and units preference.
 * It also initializes Google Analytics and tracks page views.
 * @returns
 */
export const AnalyticsContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation() // THIS IS WHY THIS COMPONENT MUST BE INSIDE THE ROUTER
  const { consent, setConsent } = useConsentCookie()
  const { isAuthenticated, authType } = useContext(LoginContext)

  // Initialize Google Analytics if consent is granted
  useEffect(() => {
    if (consent === 'granted') initGA()
    else {
      console.debug('Google Analytics initialization skipped due to lack of consent.')
    }
  }, [consent, isAuthenticated, authType])

  // GOOGLE ANALYTICS Tracks every page view automatically
  useEffect(() => {
    if (consent === 'granted')
      trackPageview(location.pathname, {
        stage: config.stage,
        isAuthenticated,
        authType: authType || 'none',
      })
  }, [consent, location.pathname])

  const handleTrackEvent = (action: string, category: string, label?: string) => {
    if (consent === 'granted') {
      trackEvent(action, category, label)
    } else {
      console.debug('Event tracking is disabled due to lack of consent.')
      return
    }
  }

  return (
    <AnalyticsContext.Provider value={{ consent, setConsent, trackEvent: handleTrackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

/**
 *
 * @returns
 */
export const GDPRDialog: React.FC = () => {
  const theme = useTheme()
  const { consent, setConsent } = useContext(AnalyticsContext)

  return (
    <Dialog
      open={!consent}
      disableEscapeKeyDown
      aria-labelledby="gdpr-dialog-title"
      aria-describedby="gdpr-dialog-description"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 10,
          boxShadow: `0px 0px 20px 5px ${theme.palette.info.light}, 0px 0px 60px 40px black`,
          background: theme.palette.background.default,
          border: `10px solid ${theme.palette.info.main}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: (theme) => theme.palette.info.main,
          color: (theme) => theme.palette.info.contrastText,
          fontWeight: 'bold',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <Cookie sx={{ mr: 1, fontSize: '2rem', color: theme.palette.info.contrastText }} />
          <Typography variant="h5">Cookies and Google Analytics</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 5 }}>
        <Typography mt={4} mb={2}>
          This site uses cookies for analytics. Do you consent to the use of{' '}
          <Link
            href="https://support.google.com/analytics/answer/6004245?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            Google Analytics
          </Link>{' '}
          to help us understand how our site is used?
        </Typography>
        <Accordion>
          <AccordionSummary>
            <Typography variant="subtitle1" fontWeight="bold">
              What information does Regolith collect if I say "yes"?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" component={'div'}>
              Regolith uses Google Analytics to collects anonymized data about how you use the site, including:
              <ul>
                <li>Page views</li>
                <li>Whether or not you are logged in (but not who you are)</li>
                <li>Time spent on each page</li>
                <li>Interactions with elements on the page</li>
              </ul>
              This data helps us improve the site and understand user behavior.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>
            <Typography variant="subtitle1" fontWeight="bold">
              Can I say "no"?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" component={'div'} mb={2}>
              Yes, you can choose not to allow tracking. If you do, Regolith will not enable Google Analytics data about
              your usage of the site.
            </Typography>
            <Typography color="secondary.dark" my={2} fontWeight={'bold'}>
              Your choice will not affect what you are allowed to do and you can change your choice later on the profile
              page.
            </Typography>
            <Typography variant="body2" component={'div'} my={2}>
              We appreciate your privacy and understand that not everyone is comfortable with tracking but we want to
              balance that with the need to improve the site based on user feedback. If you have any questions or
              concerns, please feel free to reach out to us.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>
            <Typography variant="subtitle1" fontWeight="bold">
              What do you do with the data collected?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" component={'div'} mb={2}>
              The data collected is used to improve the site and understand what people are using it for. We do not sell
              or share this data with third parties. The data is anonymized and aggregated, meaning that it cannot be
              used to identify individual users.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions sx={{ p: 4 }}>
        <Button onClick={() => setConsent('denied')} color="primary" variant="outlined" startIcon={<Cancel />}>
          No, Do not track
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={() => setConsent('granted')} variant="contained" color="info" autoFocus startIcon={<Cookie />}>
          Yes, I give consent
        </Button>
      </DialogActions>
    </Dialog>
  )
}
