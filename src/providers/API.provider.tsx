import React, { useContext, useMemo, useState } from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from, split, ApolloError } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import config from '../config'
import log from 'loglevel'
import {
  CrewShare,
  PendingUser,
  mergeSessionSettingsInplace,
  SessionSettings,
  SessionUser,
  SurveyData,
  scVersion,
  getEpochFromVersion,
  obfuscateUserId,
} from '@regolithco/common'
import { StrictTypedTypePolicies } from '../schema'
import { errorLinkThunk, makeLogLink, retryLink } from '../lib/apolloLinks'
import { devQueries, DEV_HEADERS } from '../lib/devFunctions'
import { getMainDefinition } from '@apollo/client/utilities'
import { SnackbarKey, useSnackbar } from 'notistack'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { DiscordIcon } from '../icons'
import { CopyAll, Replay } from '@mui/icons-material'
import { fontFamilies } from '../theme'
import { wipeLocalLookups } from '../lib/utils'
import { LoginContext } from '../context/auth.context'
import { AppContext } from '../context/app.context'

const CURRENT_SC_VERSION = scVersion
const CURRENT_SC_EPOCH = getEpochFromVersion(CURRENT_SC_VERSION)

/**
 * This is only here to show an error dialog provided by a snackbar
 */
export type ApolloErrorDialog = {
  error: ApolloError
  notisKey: SnackbarKey
  timestamp: string
  queryName: string
}
export type ApolloErrorDialogContext = {
  errorDialog: ApolloErrorDialog | null
  setErrorDialog: (error: ApolloErrorDialog | null) => void
}
export const ApolloErrorContext = React.createContext<ApolloErrorDialogContext>({
  errorDialog: null,
  setErrorDialog: () => {
    throw new Error('Not implemented')
  },
})

// Create HttpLinks for each endpoint
const privateLink = new HttpLink({
  uri: config.apiUrl.replace(/\/?$/, '/oauth'), // change this to your private API url
})

const publicLink = new HttpLink({
  uri: config.apiUrlPub, // change this to your public API url
})

const getVersion = (): string => {
  let version = 'UNKNOWN'
  try {
    version = document.querySelector<HTMLMetaElement>('meta[name=version]')?.content || 'UNKNOWN'
  } catch (err) {
    log.error('Failed to get version from meta tag', err)
  }
  return version
}

// Use the split function to direct requests to different endpoints
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return Boolean(
      definition.kind === 'OperationDefinition' &&
        definition.operation === 'query' &&
        definition.name?.value.startsWith('getPublic') // change this condition based on your needs
    )
  },
  publicLink,
  privateLink
)

/**
 * The second component in the stack is the APIProvider. It sets up the Apollo client and passes it down to the next component
 * @param param0
 * @returns
 */
export const APIProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { authType, token, isAuthenticated, loading, authLogIn, authLogOut } = useContext(LoginContext)
  const [APIWorking, setAPIWorking] = useState(true)
  const [hideNames, setHideNames] = React.useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState<string>()
  const [errorDialog, setErrorDialog] = useState<ApolloErrorDialog | null>(null)
  const { enqueueSnackbar } = useSnackbar()

  const getSafeName = React.useCallback(
    (scName?: string) => {
      const finalName = scName || 'UNNAMEDUSER'
      return hideNames ? obfuscateUserId(finalName) : finalName
    },
    [hideNames]
  )

  const client = useMemo(() => {
    const authLink = setContext(async (_, { headers }) => {
      const finalHeaders: Record<string, string> = {
        ...headers,
        ...DEV_HEADERS,
        authorization: token ? `Bearer ${token}` : '',
      }
      if (!DEV_HEADERS.authType && authType) finalHeaders.authType = authType
      devQueries(finalHeaders)
      return { headers: finalHeaders }
    })

    return new ApolloClient({
      link: from([
        errorLinkThunk({ setAPIWorking, setMaintenanceMode, logOut: authLogOut }),
        retryLink,
        makeLogLink(log.debug),
        authLink,
        splitLink,
      ]),
      devtools: {
        enabled: import.meta.env.MODE === 'development',
      },
      cache: new InMemoryCache({
        possibleTypes: {
          WorkOrderInterface: ['VehicleMiningOrder', 'OtherOrder', 'SalvageOrder', 'ShipMiningOrder'],
          ScoutingFindInterface: ['ShipClusterFind', 'VehicleClusterFind', 'SalvageFind'],
          UserInterface: ['User', 'UserProfile'],
        },
        typePolicies: {
          Query: {
            fields: {
              surveyData: {
                keyArgs: ['dataName', 'epoch'],
                read(existingData, { args }) {
                  const storedVersion = localStorage.getItem('LookupData:version')
                  // log.debug('Reading SurveyData from cache', args)
                  const { dataName, epoch } = args as { dataName: string; epoch: string }
                  if (!dataName || !epoch) return existingData

                  const cached = localStorage.getItem(`SurveyData:${epoch}:${dataName}`)
                  if (!cached) return existingData

                  const version = getVersion()
                  const parsed = JSON.parse(cached)

                  // If the data is older than 30 minutes, we need to refresh
                  if (
                    version === storedVersion &&
                    (epoch !== CURRENT_SC_EPOCH || Date.now() - Number(parsed.lastUpdated) < 30 * 60 * 1000)
                  ) {
                    // log.debug(`SurveyData CACHE HIT: ${epoch} ${dataName}`, parsed)
                    return parsed
                  }

                  // log.debug(`SurveyData CACHE MISS: ${epoch} ${dataName}`)
                  return existingData
                },
                merge(existingData, incomingData) {
                  if (!incomingData) return incomingData

                  const { dataName, epoch } = incomingData as SurveyData
                  // log.debug(`Merging SurveyData from cache: ${epoch} ${dataName}`, incomingData)
                  localStorage.setItem(`SurveyData:${epoch}:${dataName}`, JSON.stringify(incomingData))
                  return incomingData
                },
              },
              lookups: {
                read(existingData) {
                  const storedData = localStorage.getItem('LookupData:Data')
                  // Anything older than an hour is stale
                  const storedTimestamp = localStorage.getItem('LookupData:lastUpdate')
                  // If the version changes, we need to refresh
                  const storedVersion = localStorage.getItem('LookupData:version')
                  const version = getVersion()
                  if (
                    storedData &&
                    storedTimestamp &&
                    // If the app version is the same, we can use the data
                    version === storedVersion &&
                    // If the data is less than an hour old, return it from the cache
                    Date.now() - Number(storedTimestamp) < 60 * 60 * 1000
                  ) {
                    // log.debug('LookupData is fresh, returning from cache')
                    return JSON.parse(storedData)
                  }
                  // log.debug('LookupData is stale, returning from server')
                  return existingData
                },
                merge(existingData, incomingData) {
                  log.debug('Merging LookupData from cache')
                  localStorage.setItem('LookupData:Data', JSON.stringify(incomingData))
                  localStorage.setItem('LookupData:lastUpdate', String(Date.now()))
                  localStorage.setItem('LookupData:version', getVersion())
                  return incomingData
                },
              },
            },
          },
          UserInterface: {
            keyFields: ['userId'],
          },
          UserProfile: {
            fields: {
              friends: {
                merge(existing: string[] = [], incoming: string[]) {
                  const merged = incoming || existing
                  return merged
                },
              },
              sessionSettings: {
                merge(existing: Partial<SessionSettings> = {}, incoming: Partial<SessionSettings> = {}) {
                  const merged = mergeSessionSettingsInplace(existing, incoming)
                  return merged
                },
              },
            },
          },
          ShipClusterFind: {
            fields: {
              shipRocks: {
                merge(existing: CrewShare[] = [], incoming: CrewShare[]) {
                  const merged = incoming || existing
                  return merged
                },
              },
            },
          },
          WorkOrderInterface: {
            keyFields: ['sessionId', 'orderId'],
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
            fields: {
              attendance: {
                merge(existing: CrewShare[] = [], incoming: CrewShare[]) {
                  const merged = incoming || existing
                  return merged
                },
              },
            },
          },
          PaginatedSessionUsers: {
            fields: {
              items: {
                merge(existing: SessionUser[] = [], incoming: SessionUser[]) {
                  const merged = incoming || existing
                  return merged
                },
              },
            },
          },
          MiningLoadout: {
            keyFields: ['loadoutId'],
          },
          CrewShare: {
            keyFields: ['sessionId', 'payeeScName', 'orderId'],
          },
          SessionUser: {
            keyFields: ['sessionId', 'ownerId'],
          },
          Session: {
            keyFields: ['sessionId'],
            fields: {
              mentionedUsers: {
                merge(existing: PendingUser[] = [], incoming: PendingUser[]) {
                  const merged = incoming || existing
                  return merged
                },
              },
              settings: {
                merge(existing: Partial<SessionSettings> = {}, incoming: Partial<SessionSettings> = {}) {
                  const merged = mergeSessionSettingsInplace(existing, incoming)
                  return merged
                },
              },
            },
          },
          // THis is not EVER cached so we don't need to worry about it
          // SessionUpdate: {
          // },
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
        } as StrictTypedTypePolicies,
      }),
    })
  }, [token, loading, authType, isAuthenticated])

  // See useGQLErrors.tsx for the error handling
  const errorDialogEl = React.useMemo(() => {
    if (!errorDialog) return null
    const errorText = {
      queryName: errorDialog.queryName,
      timestamp: errorDialog.timestamp,
      error: errorDialog.error,
    }
    return (
      <Dialog open={errorDialog !== null} onClose={() => setErrorDialog(null)}>
        <DialogTitle>Regolith Error</DialogTitle>

        <DialogContent>
          <Typography variant="body2">You can send this error to support for help.</Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: fontFamilies.robotoMono,
            }}
          >
            <code>
              <pre>{JSON.stringify(errorText, null, 2)}</pre>
            </code>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<Replay />}
            color="info"
            variant="contained"
            size="large"
            onClick={() => {
              wipeLocalLookups()
              window.location.reload()
            }}
          >
            Try Reloading
          </Button>
          <Button
            startIcon={<CopyAll />}
            color="info"
            size="small"
            onClick={() => {
              const text = JSON.stringify(errorText, null, 2)
              navigator.clipboard.writeText(text)
              // Now notify
              enqueueSnackbar('Copied to clipboard', { variant: 'info' })
            }}
          >
            Copy to clipboard
          </Button>
          <Button
            startIcon={<DiscordIcon />}
            variant="contained"
            size="small"
            color="primary"
            sx={{ fontSize: '1rem', p: 2 }}
            href="https://discord.gg/6TKSYHNJha"
            target="_blank"
          >
            Regolith Discord Server
          </Button>
        </DialogActions>
      </Dialog>
    )
  }, [errorDialog])

  return (
    <AppContext.Provider
      value={{
        maintenanceMode,
        APIWorking,
        hideNames,
        setHideNames,
        getSafeName,
      }}
    >
      <ApolloProvider client={client}>
        <ApolloErrorContext.Provider
          value={{
            errorDialog: errorDialog,
            setErrorDialog: (error: ApolloErrorDialog | null) => setErrorDialog(error),
          }}
        >
          {errorDialogEl}
          {children}
        </ApolloErrorContext.Provider>
      </ApolloProvider>
    </AppContext.Provider>
  )
}
