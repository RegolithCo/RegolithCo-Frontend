import {
  GetUserProfileDocument,
  useAddFriendsMutation,
  useDeleteUserProfileMutation,
  useGetUserProfileQuery,
  useRefreshAvatarMutation,
  useRemoveFriendsMutation,
  useRequestAccountVerifyMutation,
  useUpsertUserMutation,
  useVerifyUserMutation,
} from '../schema'
import {
  DestructuredSettings,
  destructureSettings,
  mergeDestructuredSessionSettings,
  reverseDestructured,
  SessionSystemDefaults,
  UserProfile,
  UserProfileInput,
} from '@regolithco/common'
import { useGQLErrors } from './useGQLErrors'
import { useNavigate } from 'react-router-dom'

import { ApolloError } from '@apollo/client'
import { useEffect } from 'react'
import { useLogin } from './useOAuth2'
import LogRocket from 'logrocket'

type useSessionsReturn = {
  userProfile?: UserProfile
  verifyError?: ApolloError
  loading: boolean
  mutating: boolean
  initializeUser: (scName: string) => void
  requestVerify: () => void
  verifyUser: () => void
  deleteUser: () => void
  updateUserProfile: (newUserProfile: UserProfileInput, settings?: DestructuredSettings) => void
  deleteProfile: (leaveData: boolean) => void
  resetDefaultSettings: () => void
  addFriend: (friend: string) => void
  refreshAvatar: (remove?: boolean) => void
  removeFriend: (friend: string) => void
}

export const useUserProfile = (): useSessionsReturn => {
  const ctx = useLogin()
  const navigate = useNavigate()
  const userProfileQry = useGetUserProfileQuery()

  useEffect(() => {
    // Logrocket only runs when not in production since we only get the free plan
    if (process.env.NODE_ENV !== 'production') {
      const logrocketname = userProfileQry.data?.profile?.scName || 'UNAUTHENTICATED'
      const logRocketObj: Record<string, string | number | boolean> = userProfileQry.data
        ? {
            scName: userProfileQry.data?.profile?.scName as string,
            avatar: userProfileQry.data?.profile?.avatarUrl as string,
            userId: userProfileQry.data?.profile?.userId as string,
          }
        : {}
      LogRocket.identify(logrocketname, logRocketObj)
    }
  }, [userProfileQry.data])

  const upsertUserMutation = useUpsertUserMutation()
  const deleteUserProfileMutation = useDeleteUserProfileMutation()
  const requestAccountVerifyMutation = useRequestAccountVerifyMutation()
  const verifyUserMutation = useVerifyUserMutation()
  const addFriendsMutation = useAddFriendsMutation()
  const removeFriendsMutation = useRemoveFriendsMutation()

  const refreshAvatarMutation = useRefreshAvatarMutation()

  const queries = [userProfileQry]
  const mutations = [
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
    loading,
    mutating,
    verifyError: verifyUserMutation[1].error,
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
          updateUserProfile: {
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
          updateUserProfile: {
            ...optimisticResponse,
          },
          __typename: 'Mutation',
        },
      })
    },
    deleteProfile: (leaveData) =>
      deleteUserProfileMutation[0]({
        variables: {
          leaveData,
        },
      }).then(() => navigate('/')),
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
