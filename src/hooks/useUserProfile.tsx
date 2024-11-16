import {
  GetUserProfileDocument,
  useAddFriendsMutation,
  useDeletApiKeyMutation,
  useDeleteUserProfileMutation,
  useGetUserProfileQuery,
  useRefreshAvatarMutation,
  useRemoveFriendsMutation,
  useRequestAccountVerifyMutation,
  useUpsertApiKeyMutation,
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
// import LogRocket from 'logrocket'

type useSessionsReturn = {
  userProfile?: UserProfile
  verifyError?: ApolloError
  loading: boolean
  mutating: boolean
  initializeUser: (scName: string) => Promise<void>
  requestVerify: () => Promise<void>
  verifyUser: () => Promise<void>
  deleteUser: () => Promise<void>
  updateUserProfile: (newUserProfile: UserProfileInput, settings?: DestructuredSettings) => Promise<void>
  deleteProfile: (leaveData: boolean) => Promise<void>
  resetDefaultSettings: () => Promise<void>
  addFriend: (friend: string) => Promise<void>
  refreshAvatar: (remove?: boolean) => Promise<void>
  removeFriend: (friend: string) => Promise<void>
  upsertAPIKey: () => Promise<void>
  deleteAPIKey: () => Promise<void>
}

export const useUserProfile = (): useSessionsReturn => {
  const ctx = useLogin()
  const navigate = useNavigate()
  const userProfileQry = useGetUserProfileQuery({
    // returnPartialData: true,
  })

  useEffect(() => {
    // Logrocket only runs when not in production since we only get the free plan
    if (import.meta.env.MODE !== 'production') {
      // const logrocketname = userProfileQry.data?.profile?.scName || 'UNAUTHENTICATED'
      // const logRocketObj: Record<string, string | number | boolean> = userProfileQry.data
      //   ? {
      //       scName: userProfileQry.data?.profile?.scName as string,
      //       avatar: userProfileQry.data?.profile?.avatarUrl as string,
      //       userId: userProfileQry.data?.profile?.userId as string,
      //     }
      //   : {}
      // LogRocket.identify(logrocketname, logRocketObj)
    }
  }, [userProfileQry.data?.profile?.userId])

  const upsertUserMutation = useUpsertUserMutation()
  const deleteUserProfileMutation = useDeleteUserProfileMutation()
  const requestAccountVerifyMutation = useRequestAccountVerifyMutation()
  const verifyUserMutation = useVerifyUserMutation()
  const addFriendsMutation = useAddFriendsMutation()
  const removeFriendsMutation = useRemoveFriendsMutation()
  const upsertAPIKeyMutation = useUpsertApiKeyMutation()
  const deleteAPIKeyMutation = useDeletApiKeyMutation()

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
    upsertAPIKeyMutation,
    deleteAPIKeyMutation,
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
      return upsertUserMutation[0]({
        variables: {
          userProfile: {
            scName,
          },
        },
        refetchQueries: [GetUserProfileDocument],
      }).then()
    },
    upsertAPIKey: () => {
      return upsertAPIKeyMutation[0]({
        refetchQueries: [GetUserProfileDocument],
      }).then()
    },
    deleteAPIKey: () => {
      return deleteAPIKeyMutation[0]({
        refetchQueries: [GetUserProfileDocument],
      }).then()
    },
    resetDefaultSettings: () => {
      const newSettings = SessionSystemDefaults()
      const reversed = reverseDestructured(newSettings)
      return upsertUserMutation[0]({
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
      }).then()
    },

    requestVerify: () => {
      return requestAccountVerifyMutation[0]({
        refetchQueries: [GetUserProfileDocument],
      }).then()
    },
    verifyUser: () => {
      return verifyUserMutation[0]({
        refetchQueries: [GetUserProfileDocument],
      }).then()
    },
    deleteUser: () => {
      return deleteUserProfileMutation[0]({
        refetchQueries: [GetUserProfileDocument],
      })
        .then(() => {
          ctx.logOut()
          localStorage.clear()
          navigate('/')
        })
        .then()
    },
    updateUserProfile: (newUserProfile: UserProfileInput, newSettings?: DestructuredSettings) => {
      const oldSettings = userProfileQry.data?.profile?.sessionSettings || { __typename: 'SessionSettings' }

      const newSessionSettingsForInputs = mergeDestructuredSessionSettings(
        destructureSettings(oldSettings),
        newSettings || {}
      )

      const optimisticResponse = Object.assign({}, userProfileQry.data?.profile, newUserProfile)

      return upsertUserMutation[0]({
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
      }).then()
    },
    deleteProfile: (leaveData) =>
      deleteUserProfileMutation[0]({
        variables: {
          leaveData,
        },
      }).then(() => navigate('/')),
    addFriend: (friend: string) => {
      return addFriendsMutation[0]({
        variables: {
          friends: [friend],
        },
        optimisticResponse: {
          addFriends: {
            ...(userProfileQry.data?.profile as UserProfile),
            friends: [...(userProfileQry.data?.profile as UserProfile).friends, friend],
          },
          __typename: 'Mutation',
        },
      }).then()
    },
    removeFriend: (friend: string) => {
      return removeFriendsMutation[0]({
        variables: {
          friends: [friend],
        },
        optimisticResponse: {
          removeFriends: {
            ...(userProfileQry.data?.profile as UserProfile),
            friends: (userProfileQry.data?.profile as UserProfile).friends.filter((f) => f !== friend),
          },
          __typename: 'Mutation',
        },
      }).then()
    },
    refreshAvatar: (remove?: boolean) => {
      return refreshAvatarMutation[0]({
        variables: {
          remove,
        },
      }).then()
    },
  }
}
