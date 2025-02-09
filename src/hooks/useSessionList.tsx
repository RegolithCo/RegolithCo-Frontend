import {
  GetMyUserSessionsDocument,
  GetMyUserSessionsQuery,
  useCreateSessionMutation,
  useGetJoinedUserSessionsQuery,
  useGetMyUserSessionsQuery,
  useGetUserProfileQuery,
} from '../schema'
import {
  defaultSessionName,
  mergeSessionSettings,
  PaginatedSessions,
  RefineryEnum,
  RefineryMethodEnum,
  SalvageOreEnum,
  Session,
  SessionSettings,
  ShipOreEnum,
  UserProfile,
  VehicleOreEnum,
} from '@regolithco/common'
import { useGQLErrors } from './useGQLErrors'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { useSnackbar } from 'notistack'
import React, { useEffect } from 'react'
import log from 'loglevel'

type useSessionsReturn = {
  mySessions?: UserProfile['mySessions']
  joinedSessions?: UserProfile['joinedSessions']
  paginationDate: number
  setPaginationDate: (timestamp: number) => void
  fetchMoreSessions: () => void
  allLoaded: boolean
  loading: boolean
  mutating: boolean
  createSession: () => void
}

/**
 * Returns a timestamp 15 days ago and rounded to the start of the month from the last item in the list
 * @param items
 * @returns
 */
const getNewPaginationDate = (items?: Session[]): number => {
  if (!items || items.length === 0) return dayjs().subtract(15, 'days').startOf('month').valueOf()
  const lastDate = items?.[items.length - 1]?.createdAt
  return lastDate
}

export const useSessionList = (): useSessionsReturn => {
  const navigate = useNavigate()
  const userProfileQry = useGetUserProfileQuery()
  // set the date to the start of the month as of 15 days ago
  const [paginationDate, _setPaginationDate] = React.useState<number>(getNewPaginationDate())
  const { enqueueSnackbar } = useSnackbar()

  const setPaginationDate = (timestamp: number) => {
    if (timestamp < paginationDate) _setPaginationDate(timestamp)
  }

  const mySessionsQry = useGetMyUserSessionsQuery({
    variables: {
      nextToken: null,
    },
    onCompleted: (data) => {
      const items = data.profile?.mySessions?.items || []
      if (items.length > 0) {
        setPaginationDate(items[items.length - 1]?.createdAt)
      }
    },
    notifyOnNetworkStatusChange: true,
    skip: !userProfileQry.data?.profile,
  })

  const joinedSessionsQry = useGetJoinedUserSessionsQuery({
    variables: {
      nextToken: null,
    },
    notifyOnNetworkStatusChange: true,
    skip: !userProfileQry.data?.profile,
  })

  const createSessionMutation = useCreateSessionMutation({
    update: (cache, { data }) => {
      // Add this session to the mySessionsQry list
      const mySessions = cache.readQuery({
        query: GetMyUserSessionsDocument,
        variables: {
          nextToken: null,
        },
      })
      if (!mySessions) return
      const newMySessions = mySessions as GetMyUserSessionsQuery

      cache.writeQuery({
        query: GetMyUserSessionsDocument,
        variables: {
          nextToken: null,
        },
        data: {
          ...mySessions,
          profile: {
            ...newMySessions.profile,
            mySessions: {
              ...(newMySessions.profile?.mySessions || {}),
              items: [
                ...(newMySessions.profile?.mySessions?.items || []),
                {
                  ...data?.createSession,
                },
              ],
            },
          },
        },
      })
      // consle.log('cache updated')
    },

    onCompleted: (data) => {
      enqueueSnackbar('Session created', { variant: 'success' })
      navigate(`/session/${data.createSession?.sessionId}`)
    },
  })

  // We want to paginate query until
  useEffect(() => {
    const monthFetchQuery = async (query: typeof mySessionsQry) => {
      if (!joinedSessionsQry.data?.profile?.joinedSessions?.nextToken) return
      if (query.loading || query.data?.profile?.mySessions?.items.length === 0) {
        log.debug(
          'NEWPAGINATE',
          `Nothing to do because loading: ${query.loading} or items.length: ${query.data?.profile?.mySessions?.items.length} is 0`
        )
        return
      }
      const items = mySessionsQry.data?.profile?.mySessions?.items || []
      // If we are not loading and the last session is newer than the pagination date fetch more until it is
      if (items[items.length - 1]?.createdAt && items[items.length - 1]?.createdAt > paginationDate) {
        log.debug(
          'NEWPAGINATE',
          `fetching more sessions because date: ${items[items.length - 1]?.createdAt} is after ${paginationDate}`
        )
        mySessionsQry.fetchMore({
          variables: {
            nextToken: mySessionsQry.data?.profile?.mySessions?.nextToken,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev
            const oldList = (prev.profile?.mySessions as PaginatedSessions) || {}
            const newList = (fetchMoreResult.profile?.mySessions as PaginatedSessions) || {}
            const oldListFiltered = (oldList.items || []).filter((s) => s?.sessionId !== newList.items?.[0]?.sessionId)

            if (newList.items.length > 0) {
              setPaginationDate(newList.items?.[newList.items.length - 1]?.createdAt)
            }
            return {
              ...prev,
              profile: {
                ...(prev.profile as UserProfile),
                mySessions: {
                  ...oldList,
                  items: [...oldListFiltered, ...(newList?.items || [])],
                  nextToken: newList?.nextToken,
                },
              },
            }
          },
        })
      }
    }
    monthFetchQuery(mySessionsQry)
    monthFetchQuery(joinedSessionsQry)
  }, [paginationDate, mySessionsQry, joinedSessionsQry])

  const fetchMoreSessions = () => {
    if (mySessionsQry.data?.profile?.mySessions?.nextToken) {
      mySessionsQry.fetchMore({
        variables: {
          nextToken: mySessionsQry.data?.profile?.mySessions?.nextToken,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          const oldList = (prev.profile?.mySessions as PaginatedSessions) || {}
          const newList = (fetchMoreResult.profile?.mySessions as PaginatedSessions) || {}
          const oldListFiltered = (oldList.items || []).filter((s) => s?.sessionId !== newList.items?.[0]?.sessionId)
          if (newList.items.length > 0) {
            setPaginationDate(newList.items?.[newList.items.length - 1]?.createdAt)
          }
          return {
            ...prev,
            profile: {
              ...(prev.profile as UserProfile),
              mySessions: {
                ...oldList,
                items: [...oldListFiltered, ...(newList?.items || [])],
                nextToken: newList?.nextToken,
              },
            },
          }
        },
      })
    }
    if (joinedSessionsQry.data?.profile?.joinedSessions?.nextToken) {
      joinedSessionsQry.fetchMore({
        variables: {
          nextToken: joinedSessionsQry.data?.profile?.joinedSessions?.nextToken,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          const oldList = (prev.profile?.joinedSessions as PaginatedSessions) || {}
          const newList = (fetchMoreResult.profile?.joinedSessions as PaginatedSessions) || {}
          if (newList.items.length > 0) {
            setPaginationDate(newList.items?.[newList.items.length - 1]?.createdAt)
          }
          return {
            ...prev,
            profile: {
              ...(prev.profile as UserProfile),
              joinedSessions: {
                ...oldList,
                items: [...(oldList?.items || []), ...(newList?.items || [])],
                nextToken: newList?.nextToken,
              },
            },
          }
        },
      })
    }
  }

  const queries = [userProfileQry, mySessionsQry, joinedSessionsQry]
  const mutations = [createSessionMutation]

  const loading = queries.some((q) => q.loading)
  const mutating = mutations.some((m) => m[1].loading)

  useGQLErrors(queries, mutations)

  return {
    mySessions: mySessionsQry.data?.profile?.mySessions as UserProfile['mySessions'],
    joinedSessions: joinedSessionsQry.data?.profile?.joinedSessions as UserProfile['joinedSessions'],
    paginationDate,
    setPaginationDate,
    fetchMoreSessions,
    allLoaded:
      mySessionsQry.data?.profile?.mySessions?.nextToken === null &&
      joinedSessionsQry.data?.profile?.joinedSessions?.nextToken === null,
    loading,
    mutating,
    createSession: () => {
      const userSessionDefaults: SessionSettings = userProfileQry.data?.profile?.sessionSettings || {
        __typename: 'SessionSettings',
      }
      // Here are some sensible defaults for a new session
      const initialSessionSettings = mergeSessionSettings(
        {
          allowUnverifiedUsers: true,
          specifyUsers: false,
          // activity,
          // gravityWell,
          // location,
          lockedFields: [],
          workOrderDefaults: {
            includeTransferFee: true,
            shareRefinedValue: true,
            lockedFields: [],
            isRefined: true,
            refinery: RefineryEnum.Arcl1,
            method: RefineryMethodEnum.DinyxSolventation,
            salvageOres: [SalvageOreEnum.Rmc],
            shipOres: [ShipOreEnum.Quantanium],
            vehicleOres: [VehicleOreEnum.Hadanite],
            crewShares: [],
            __typename: 'WorkOrderDefaults',
          },
          __typename: 'SessionSettings',
        },
        userSessionDefaults
      )

      createSessionMutation[0]({
        variables: {
          session: {
            mentionedUsers: [],
            name: defaultSessionName(),
          },
          ...initialSessionSettings,
        },
        refetchQueries: [GetMyUserSessionsDocument],
      })
    },
  }
}
