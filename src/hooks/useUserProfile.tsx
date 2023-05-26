import {
  GetMyUserSessionsDocument,
  GetUserProfileDocument,
  useAddFriendsMutation,
  useCreateSessionMutation,
  useDeleteUserProfileMutation,
  useGetJoinedUserSessionsQuery,
  useGetMyUserSessionsQuery,
  useGetUserProfileQuery,
  useRefreshAvatarMutation,
  useRemoveFriendsMutation,
  useRequestAccountVerifyMutation,
  useUpsertUserMutation,
  useVerifyUserMutation,
} from '../schema'
import {
  defaultSessionName,
  DestructuredSettings,
  destructureSettings,
  GetMyUserSessionsQuery,
  mergeDestructuredSessionSettings,
  mergeSessionSettings,
  PaginatedSessions,
  RefineryEnum,
  RefineryMethodEnum,
  reverseDestructured,
  SalvageOreEnum,
  SessionSettings,
  SessionSystemDefaults,
  ShipOreEnum,
  UserProfile,
  UserProfileInput,
  VehicleOreEnum,
} from '@regolithco/common'
import { useGQLErrors } from './useGQLErrors'
import { useNavigate } from 'react-router-dom'

import { ApolloError } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import { useLogin } from './useOAuth2'

type useSessionsReturn = {
  userProfile?: UserProfile
  mySessions?: UserProfile['mySessions']
  verifyError?: ApolloError
  joinedSessions?: UserProfile['joinedSessions']
  loading: boolean
  mutating: boolean
  createSession: () => void
  initializeUser: (scName: string) => void
  requestVerify: () => void
  verifyUser: () => void
  deleteUser: () => void
  updateUserProfile: (newUserProfile: UserProfileInput, settings?: DestructuredSettings) => void
  deleteProfile: () => void
  resetDefaultSettings: () => void
  addFriend: (friend: string) => void
  refreshAvatar: (remove?: boolean) => void
  removeFriend: (friend: string) => void
}

export const useUserProfile = (): useSessionsReturn => {
  const ctx = useLogin()
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
      // console.log('cache updated')
    },

    onCompleted: (data) => {
      enqueueSnackbar('Session created', { variant: 'success' })
      navigate(`/session/${data.createSession?.sessionId}`)
    },
  })
  const upsertUserMutation = useUpsertUserMutation()
  const deleteUserProfileMutation = useDeleteUserProfileMutation()
  const requestAccountVerifyMutation = useRequestAccountVerifyMutation()
  const verifyUserMutation = useVerifyUserMutation()
  const addFriendsMutation = useAddFriendsMutation()
  const removeFriendsMutation = useRemoveFriendsMutation()

  const refreshAvatarMutation = useRefreshAvatarMutation()

  const queries = [userProfileQry, mySessionsQry, joinedSessionsQry]
  const mutations = [
    createSessionMutation,
    upsertUserMutation,
    deleteUserProfileMutation,
    requestAccountVerifyMutation,
    verifyUserMutation,
    addFriendsMutation,
    removeFriendsMutation,
    refreshAvatarMutation,
  ]

  const loading = queries.some((q) => q.loading)
  const mutating = mutations.some((m) => m[1].loading)

  useGQLErrors(queries, mutations)

  return {
    userProfile: userProfileQry.data?.profile as UserProfile,
    mySessions: mySessionsQry.data?.profile?.mySessions as UserProfile['mySessions'],
    joinedSessions: joinedSessionsQry.data?.profile?.joinedSessions as UserProfile['joinedSessions'],
    loading,
    mutating,
    verifyError: verifyUserMutation[1].error,
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
    initializeUser: (scName: string) => {
      upsertUserMutation[0]({
        variables: {
          userProfile: {
            scName,
          },
        },
        refetchQueries: [GetUserProfileDocument],
      })
    },
    resetDefaultSettings: () => {
      const newSettings = SessionSystemDefaults()
      const reversed = reverseDestructured(newSettings)
      upsertUserMutation[0]({
        variables: {
          userProfile: {},
          ...newSettings,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          upsertUserProfile: {
            ...(userProfileQry.data?.profile as UserProfile),
            sessionSettings: reversed,
            __typename: 'UserProfile',
          },
        },
      })
    },

    requestVerify: () => {
      requestAccountVerifyMutation[0]({
        refetchQueries: [GetUserProfileDocument],
      })
    },
    verifyUser: () => {
      verifyUserMutation[0]({
        refetchQueries: [GetUserProfileDocument],
      })
    },
    deleteUser: () => {
      deleteUserProfileMutation[0]({
        refetchQueries: [GetUserProfileDocument],
      }).then(() => {
        ctx.logOut()
        localStorage.clear()
        navigate('/')
      })
    },
    updateUserProfile: (newUserProfile: UserProfileInput, newSettings?: DestructuredSettings) => {
      const oldSettings = userProfileQry.data?.profile?.sessionSettings || { __typename: 'SessionSettings' }

      const newSessionSettingsForInputs = mergeDestructuredSessionSettings(
        destructureSettings(oldSettings),
        newSettings || {}
      )

      const optimisticResponse = Object.assign({}, userProfileQry.data?.profile, newUserProfile)

      upsertUserMutation[0]({
        variables: {
          userProfile: newUserProfile,
          ...newSessionSettingsForInputs,
        },
        optimisticResponse: {
          upsertUserProfile: {
            ...optimisticResponse,
          },
          __typename: 'Mutation',
        },
      })
    },
    deleteProfile: () => deleteUserProfileMutation[0]().then(() => navigate('/')),
    addFriend: (friend: string) => {
      addFriendsMutation[0]({
        variables: {
          friends: [friend],
        },
        optimisticResponse: {
          addFriends: {
            ...(userProfileQry.data?.profile as UserProfile),
            friends: [...(userProfileQry.data?.profile as UserProfile).friends, friend],
            __typename: 'UserProfile',
          },
          __typename: 'Mutation',
        },
      })
    },
    removeFriend: (friend: string) => {
      removeFriendsMutation[0]({
        variables: {
          friends: [friend],
        },
        optimisticResponse: {
          removeFriends: {
            ...(userProfileQry.data?.profile as UserProfile),
            friends: (userProfileQry.data?.profile as UserProfile).friends.filter((f) => f !== friend),
            __typename: 'UserProfile',
          },
          __typename: 'Mutation',
        },
      })
    },
    refreshAvatar: (remove?: boolean) => {
      refreshAvatarMutation[0]({
        variables: {
          remove,
        },
      })
    },
  }
}
