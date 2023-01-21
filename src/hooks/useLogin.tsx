import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Auth } from 'aws-amplify'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from, NormalizedCacheObject } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import path from 'path'
import config from '../config'
import log from 'loglevel'
import { LoginContextObj } from '../types'
import { CrewShare, mergeSessionSettingsInplace, SessionSettings, UserProfile, UserStateEnum } from '@regolithco/common'
import { useGetUserProfileQuery } from '../schema'
import { errorLinkThunk, makeLogLink, retryLink } from '../lib/apolloLinks'

const redirectUrl = new URL(process.env.PUBLIC_URL, window.location.origin).toString()

Auth.configure({
  region: 'us-west-2',
  userPoolId: config.userPool,
  userPoolWebClientId: config.userPoolClientId,
  mandatorySignIn: false,
  oauth: {
    domain: config.authDomain,
    scope: ['openid'],
    redirectSignIn: redirectUrl,
    redirectSignOut: redirectUrl,
    responseType: 'code',
  },
})

const DEFAULT_LOGIN_CONTEXT: LoginContextObj = {
  isAuthenticated: false,
  isInitialized: false,
  isVerified: false,
  APIWorking: true,
  signIn: () => Auth.federatedSignIn(),
  signOut: (): Promise<void> => Auth.signOut(),
  loading: false,
}

const LoginContext = React.createContext<LoginContextObj>(DEFAULT_LOGIN_CONTEXT)

export function useLogin(): LoginContextObj {
  const context = useContext<LoginContextObj>(LoginContext)
  if (typeof context === 'undefined') {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}

/**
 * The second component in the stack is the APIProvider. It sets up the Apollo client and passes it down to the next component
 * @param param0
 * @returns
 */
export const APIProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [APIWorking, setAPIWorking] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState<string>()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await Auth.currentSession()
        if (session.isValid()) setIsAuthenticated(true)
      } catch (error) {
        if (isAuthenticated) setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  const client = useMemo(() => {
    const authLink = setContext(async (_, { headers }) => {
      const session = await Auth.currentSession()
      const token = session.getAccessToken().getJwtToken()
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        },
      }
    })

    return new ApolloClient({
      link: from([
        errorLinkThunk({ setAPIWorking, setMaintenanceMode }),
        retryLink,
        makeLogLink(log.debug),
        authLink,
        new HttpLink({
          uri: config.apiUrl,
        }),
      ]),
      connectToDevTools: process.env.NODE_ENV === 'development',
      cache: new InMemoryCache({
        possibleTypes: {
          WorkOrderInterface: ['VehicleMiningOrder', 'OtherOrder', 'SalvageOrder', 'ShipMiningOrder'],
          ScoutingFindInterface: ['ShipClusterFind', 'VehicleClusterFind', 'SalvageFind'],
          UserInterface: ['User', 'UserProfile'],
        },
        typePolicies: {
          UserInterface: {
            keyFields: ['userId'],
          },
          UserProfile: {
            fields: {
              sessionSettings: {
                merge(existing: Partial<SessionSettings> = {}, incoming: Partial<SessionSettings> = {}) {
                  const merged = mergeSessionSettingsInplace(existing, incoming)
                  return merged
                },
              },
            },
          },
          WorkOrderInterface: {
            keyFields: ['orderId'],
            fields: {
              crewShares: {
                merge(existing: CrewShare[] = [], incoming: CrewShare[]) {
                  const merged = incoming || existing
                  return merged
                },
              },
            },
          },
          ScoutingFindInterface: {
            keyFields: ['sessionId', 'scoutingFindId'],
          },
          CrewShare: {
            keyFields: ['sessionId', 'scName', 'orderId'],
          },
          SessionUser: {
            keyFields: ['sessionId', 'ownerId'],
          },
          Session: {
            keyFields: ['sessionId'],
            fields: {
              settings: {
                merge(existing: Partial<SessionSettings> = {}, incoming: Partial<SessionSettings> = {}) {
                  const merged = mergeSessionSettingsInplace(existing, incoming)
                  return merged
                },
              },
            },
          },
          // Some fields we don't normalize
          SessionSettings: {
            keyFields: false,
          },
          CrewShareTemplate: {
            keyFields: false,
          },
          WorkOrderDefaults: {
            keyFields: false,
          },
        },
      }),
    })
  }, [isAuthenticated])

  return (
    <ApolloProvider client={client}>
      <UserProfileProvider
        apolloClient={client}
        isAuthenticated={isAuthenticated}
        APIWorking={APIWorking}
        maintenanceMode={maintenanceMode}
      >
        {children}
      </UserProfileProvider>
    </ApolloProvider>
  )
}

interface UserProfileProviderProps {
  children: React.ReactNode
  apolloClient: ApolloClient<NormalizedCacheObject>
  isAuthenticated: boolean
  APIWorking?: boolean
  maintenanceMode?: string
}
/**
 * Finallly, the third component in the stack goes and gets the user profile (if there is one)
 * @param param0
 * @returns
 */
const UserProfileProvider: React.FC<UserProfileProviderProps> = ({
  children,
  apolloClient,
  isAuthenticated,
  APIWorking,
  maintenanceMode,
}) => {
  const userProfileQry = useGetUserProfileQuery({
    skip: !isAuthenticated,
  })

  useEffect(() => {
    if (!isAuthenticated && apolloClient) {
      log.debug('User is not authenticated, clearing cache')
      apolloClient.resetStore()
    }
  }, [isAuthenticated, apolloClient])

  return (
    <LoginContext.Provider
      value={{
        isAuthenticated,
        APIWorking,
        maintenanceMode,
        isInitialized: Boolean(userProfileQry.data?.profile),
        isVerified: Boolean(
          userProfileQry.data?.profile?.userId && userProfileQry.data?.profile?.state === UserStateEnum.Verified
        ),
        userProfile: userProfileQry.data?.profile as UserProfile,
        signIn: () => {
          // Set up a redirect for later look in <TopbarContainer /> for the code that actions this
          // When the user returns
          const baseUrl = process.env.PUBLIC_URL
          // I want the path relative to the base url using window.location.pathname
          const relpath = window.location.pathname.replace(baseUrl, '')
          localStorage.setItem('redirect', relpath)
          return Auth.federatedSignIn()
        },
        signOut: () =>
          Auth.signOut().then(() => {
            log.debug('Signed out')
            apolloClient.resetStore()
          }),
        loading: userProfileQry.loading,
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}
