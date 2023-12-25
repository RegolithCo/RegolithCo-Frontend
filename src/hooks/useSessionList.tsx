import {
  GetMyUserSessionsDocument,
  useCreateSessionMutation,
  useGetJoinedUserSessionsQuery,
  useGetMyUserSessionsQuery,
  useGetUserProfileQuery,
} from '../schema'
import {
  defaultSessionName,
  GetMyUserSessionsQuery,
  mergeSessionSettings,
  PaginatedSessions,
  RefineryEnum,
  RefineryMethodEnum,
  SalvageOreEnum,
  SessionSettings,
  ShipOreEnum,
  UserProfile,
  VehicleOreEnum,
} from '@regolithco/common'
import { useGQLErrors } from './useGQLErrors'
import { useNavigate } from 'react-router-dom'

import { useSnackbar } from 'notistack'
import { useEffect } from 'react'

type useSessionsReturn = {
  mySessions?: UserProfile['mySessions']
  joinedSessions?: UserProfile['joinedSessions']
  loading: boolean
  mutating: boolean
  createSession: () => void
}

export const useSessionList = (): useSessionsReturn => {
  const navigate = useNavigate()
  const userProfileQry = useGetUserProfileQuery()
  const { enqueueSnackbar } = useSnackbar()

  const mySessionsQry = useGetMyUserSessionsQuery({
    variables: {
      nextToken: null,
    },
    notifyOnNetworkStatusChange: true,
    skip: !userProfileQry.data?.profile,
  })

  useEffect(() => {
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
  }, [mySessionsQry.data?.profile?.mySessions?.nextToken])

  const joinedSessionsQry = useGetJoinedUserSessionsQuery({
    variables: {
      nextToken: null,
    },
    notifyOnNetworkStatusChange: true,
    skip: !userProfileQry.data?.profile,
  })

  useEffect(() => {
    if (joinedSessionsQry.data?.profile?.joinedSessions?.nextToken) {
      joinedSessionsQry.fetchMore({
        variables: {
          nextToken: joinedSessionsQry.data?.profile?.joinedSessions?.nextToken,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          const oldList = (prev.profile?.joinedSessions as PaginatedSessions) || {}
          const newList = (fetchMoreResult.profile?.joinedSessions as PaginatedSessions) || {}
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
  }, [joinedSessionsQry.data?.profile?.joinedSessions?.nextToken])

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
              items: [...(newMySessions.profile?.mySessions?.items || []), data?.createSession],
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

  const queries = [userProfileQry, mySessionsQry, joinedSessionsQry]
  const mutations = [createSessionMutation]

  const loading = queries.some((q) => q.loading)
  const mutating = mutations.some((m) => m[1].loading)

  useGQLErrors(queries, mutations)

  return {
    mySessions: mySessionsQry.data?.profile?.mySessions as UserProfile['mySessions'],
    joinedSessions: joinedSessionsQry.data?.profile?.joinedSessions as UserProfile['joinedSessions'],
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
