import * as React from 'react'
import { Typography, Box, Button, Stepper, Step, StepButton, Divider, Link, AlertTitle, Alert } from '@mui/material'
import { LoginContextObj } from '../../../types'
import { PageWrapper } from '../../PageWrapper'
import { PageLoader } from '../../pages/PageLoader'
import { SCUsernameField } from '../../fields/SCUsernameField'
import { VerifyCodeField } from '../../fields/VerifyCodeField'
import { UserProfile } from '@orgminer/common'

interface InitializeUserProps {
  verifyOnly?: boolean
  userProfile?: UserProfile
  login: LoginContextObj
  loading: boolean
  verifyError?: string
  fns: {
    backToPage: () => void
    initializeUser: (scName: string) => void
    requestVerify: () => void
    verifyUser: () => void
    deleteUser: () => void
  }
}

export const InitializeUser: React.FC<InitializeUserProps> = ({
  login,
  userProfile,
  loading,
  verifyError,
  fns,
  verifyOnly,
}) => {
  const [userName, setUserName] = React.useState<string | null>()
  const pageTitle = !login.isInitialized ? 'Initialize User' : 'Verify User'
  const redirectTimerRef = React.useRef<NodeJS.Timeout>()

  if (login.isVerified) {
    // Wait 5 seconds and then redirect to the page they were on
    if (!redirectTimerRef.current) {
      redirectTimerRef.current = setTimeout(fns.backToPage, 5000)
    }
    return (
      <PageWrapper title="You are verified!">
        Congratulations
        <br />
      </PageWrapper>
    )
  }

  const userNameIsValid = userName && userName.length > 0

  return (
    <PageWrapper title={pageTitle}>
      <PageLoader loading={loading} title="Loading..." />

      <Stepper activeStep={1}>
        <Step completed={true}>
          <StepButton color="inherit">Authenticate</StepButton>
        </Step>
        <Step completed={login.isInitialized}>
          <StepButton color="inherit">Enter Username</StepButton>
        </Step>
        <Step completed={login.isVerified}>
          <StepButton color="inherit">Verify (Optional)</StepButton>
        </Step>
      </Stepper>

      {!login.isInitialized && (
        <>
          <Typography sx={{ pt: 4 }}>
            Before you can use this logged-in section, you need to tell us your Star Citizen user name. This is so
            people you share your session with can know who to pay/thank.
          </Typography>
          <SCUsernameField
            onSubmit={() => {
              userNameIsValid && fns.initializeUser(userName)
            }}
            onChange={(newUserName) => setUserName(newUserName)}
            defaultValue={userName}
          />
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="secondary"
              size="large"
              onClick={() => {
                fns.backToPage()
              }}
            >
              Cancel
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button
              onClick={() => userNameIsValid && fns.initializeUser(userName)}
              disabled={!userNameIsValid || loading}
              sx={{ mr: 1 }}
              variant="contained"
              size="large"
            >
              Go
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography paragraph>
            <em>
              Note: You can still use all the calculators without signing in. This is just for the collaborative mining
              sessions.
            </em>
          </Typography>
        </>
      )}
      {!login.isVerified && userProfile && login.isInitialized && (
        <>
          {verifyError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <AlertTitle>Could not Verify Account</AlertTitle>
              <Typography>
                This can happen for a number of reasons. You can wait a few seconds and try again. If it doesn't succeed
                after a few times there may be a more serious issues.
              </Typography>
            </Alert>
          )}
          <Typography sx={{ pt: 4 }}>
            You can verify your handle to match your Star Citizen username. This will prevent new users from
            impersonating you on the app. (This will not affect existing users with the same name).
          </Typography>
          <Typography sx={{ pt: 4 }}>
            <strong>Step 1:</strong> Click the button below to request a new verification code.
          </Typography>
          <Button
            color="primary"
            size="large"
            disabled={loading}
            variant="contained"
            sx={{ width: '80%', margin: '0 auto', display: 'block', mt: 4, fontSize: 30 }}
            onClick={fns.requestVerify}
          >
            Get New Code
          </Button>
          {userProfile.verifyCode && (
            <>
              <Typography sx={{ pt: 4 }}>
                <strong>Step 2:</strong> Copy the text below and put it in your "Short Bio" at{' '}
                <Link href="https://robertsspaceindustries.com/account/profile" target="_blank">
                  robertsspaceindustries.com
                </Link>
                . (Don't worry, you can remove it again once the process is done)
              </Typography>
              <VerifyCodeField code={userProfile.verifyCode} />

              <Typography>
                <strong>Step 3:</strong> Wait a few seconds, then click the button below to verify your account.
              </Typography>
              <Button
                color="primary"
                size="large"
                disabled={loading}
                sx={{ width: '80%', margin: '0 auto', display: 'block', mt: 4, fontSize: 30 }}
                variant="contained"
                onClick={fns.verifyUser}
              >
                Verify
              </Button>
            </>
          )}
          {!verifyOnly && (
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button color="secondary" size="large" onClick={fns.deleteUser}>
                No thanks, I'm good.
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
            </Box>
          )}
        </>
      )}
    </PageWrapper>
  )
}
