import * as React from 'react'
import { useSnackbar } from 'notistack'
import { MutationTuple, QueryResult } from '@apollo/client'
import log from 'loglevel'
import { ErrorCode } from '@regolithco/common'
import { IconButton } from '@mui/material'
import { Close, Info } from '@mui/icons-material'
import { ApolloErrorContext } from './useLogin'
/**
 * Just a handy hook to handle errors from queries and mutations
 *
 * By default it throws errors into the snackbar but we may have to suppress those if it gets too noisy
 * @param queries
 * @param mutations
 * @returns
 */
// Some errors we handle in other ways
const ExceptList: ErrorCode[] = [
  ErrorCode.NOT_FOUND,
  ErrorCode.SESSION_NOT_FOUND,
  ErrorCode.SESSIONJOIN_NOT_VERIFIED,
  ErrorCode.SESSIONJOIN_NOT_ON_LIST,
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useGQLErrors = (queries: QueryResult<any, any>[], mutations: MutationTuple<any, any>[]) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { errorDialog, setErrorDialog } = React.useContext(ApolloErrorContext)
  React.useEffect(() => {
    queries.forEach(({ error, observable }) => {
      try {
        if (error) {
          if (error.graphQLErrors) {
            error.graphQLErrors.forEach((gqlErr) => {
              if (gqlErr.extensions && ExceptList.includes(gqlErr.extensions.code as ErrorCode)) return
              log.error(`❌ [GraphQL error]:  ${observable.queryName} ${JSON.stringify(error, null, 2)}`)
              enqueueSnackbar('Error:' + (error.message || error.name), {
                variant: 'error',
                autoHideDuration: errorDialog ? null : 5000,
                persist: Boolean(errorDialog),
                action: (key) => {
                  return (
                    <>
                      <IconButton
                        onClick={() =>
                          setErrorDialog({
                            error: error,
                            notisKey: key,
                            timestamp: new Date().toISOString(),
                            queryName: observable.queryName || 'UNKNOWN',
                          })
                        }
                      >
                        <Info />
                      </IconButton>
                      <IconButton onClick={() => closeSnackbar(key)}>
                        <Close />
                      </IconButton>
                    </>
                  )
                },
              })
            })
          }
          log.debug(error)
        }
      } catch (e) {
        console.error('Your error has errors', e)
      }
    })
    mutations.forEach(([_, { error }]) => {
      if (error) {
        enqueueSnackbar('Error:' + (error.message || error.name), {
          variant: 'error',
          autoHideDuration: errorDialog ? null : 5000,
          persist: Boolean(errorDialog),
          action: (key) => {
            return (
              <>
                <IconButton
                  onClick={() =>
                    setErrorDialog({
                      error: error,
                      notisKey: key,
                      timestamp: new Date().toISOString(),
                      queryName: 'ERROR',
                    })
                  }
                >
                  <Info />
                </IconButton>
                <IconButton onClick={() => closeSnackbar(key)}>
                  <Close />
                </IconButton>
              </>
            )
          },
        })
      }
    })
  }, [...queries.map((q) => q.error), ...mutations.map((op) => op[1].error)])

  return errorDialog
}
