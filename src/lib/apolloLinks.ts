import { ApolloLink, ServerError } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { ErrorCode } from '@regolithco/common'
import * as Sentry from '@sentry/react'

// Log any GraphQL errors or network error that occurred
export const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 5,
    retryIf: (error, _operation) => {
      if (error.statusCode) return false
      return !!error
    },
  },
})
export const makeLogLink = (logFn: (...args: unknown[]) => void): ApolloLink =>
  new ApolloLink((operation, forward) => {
    return forward(operation).map((data) => {
      try {
        const queryBody = operation.query.loc?.source.body
        const queryMatch = queryBody?.match(/(query|mutation|document) (\w+).+/)
        if (queryMatch) {
          const [_wholeMatch, type, name] = queryMatch
          let prefix = ''
          let css = ''
          switch (type) {
            case 'mutation':
              prefix = '✍️'
              css =
                'background-color: #ff8c00; color: white; font-size: 1.2em; padding: 0.2em 0.6em; border-radius: 0.4em'
              break
            case 'query':
              prefix = '👓'
              css =
                'background-color: #25beff; color: white; font-size: 1.2em; padding: 0.2em 0.6em; border-radius: 0.4em'
              break
            case 'document':
              prefix = '📄'
              css =
                'background-color: #25ff29; color: white; font-size: 1.2em; padding: 0.2em 0.6em; border-radius: 0.4em'
              break
            default:
              prefix = '🤷‍♂️'
              break
          }

          const displayObj: Record<string, unknown> = {
            query: queryBody?.trim(),
            variables: operation.variables,
            response: data.data,
          }

          if (data.errors) displayObj.errors = data.errors
          logFn(
            `%c${prefix} ${name}%c %c${data.errors ? 'ERROR' : ''}`,
            css,
            'background-color: unset, color: unset',
            'background-color: red; color: white; font-size: 1.2em; padding: 0.2em 0.6em; border-radius: 0.4em',
            displayObj
          )
        }
      } catch {
        // Fallback gracefully so we don't need to debug our debugger
        logFn(
          '%cFALLBACK',
          'background-color: red; color: white; font-size: 1.2em; padding: 0.2em 0.6em; border-radius: 0.4em',
          operation
        )
      }
      return data
    })
  })

export type ErrorLinkThunk = (args: {
  setMaintenanceMode?: (msg: string) => void
  setAPIWorking?: (working: boolean) => void
  logOut?: () => void
}) => ApolloLink

export class GQLError extends Error {
  constructor(
    qryName: string,
    qryType: string,
    message: string,
    public details: Record<string, unknown>
  ) {
    super(message)
    this.name = `GQLError ${qryType.toUpperCase()}::${qryName}`
    Object.setPrototypeOf(this, GQLError.prototype)
  }
}

export const errorLinkThunk: ErrorLinkThunk = ({ setMaintenanceMode, setAPIWorking, logOut }) =>
  onError(({ graphQLErrors, networkError, forward, operation }) => {
    if (graphQLErrors) {
      const queryBody = operation.query.loc?.source.body
      const queryMatch = queryBody?.match(/(query|mutation|document) (\w+).+/)
      const [_wholeMatch, qryType, name] = queryMatch || []
      graphQLErrors.forEach(({ message, locations, path }) => {
        Sentry.captureException(
          new GQLError(name, qryType, message, {
            locations,
            path,
            operation,
          }),
          {
            extra: { locations, path, operation, variables: operation.variables },
          }
        )
      })
    }
    if (networkError) {
      try {
        const result = (networkError as ServerError).result
        Sentry.captureException(networkError) // Capture the error with Sentry
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((result as Record<string, any>).extensions.code === ErrorCode.MAINENANCE_MODE) {
          setMaintenanceMode && setMaintenanceMode((result as Record<string, string>).message)
          localStorage.removeItem('LookupData:Data')
          localStorage.removeItem('LookupData:lastUpdate')
          localStorage.removeItem('LookupData:version')
          logOut && logOut()
          console.error(`🔧 [Maintenance mode]: ${(result as Record<string, string>).message}`)
          return
        }
      } catch {
        console.error('Error parsing network error', networkError)
      }

      console.error(`❌🔌 [Network error]: ${networkError}`)
      if (!(networkError as ServerError).statusCode && setAPIWorking) setAPIWorking(false)
    }
    forward(operation)
  })
