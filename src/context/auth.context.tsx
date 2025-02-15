import React from 'react'
import { AuthTypeEnum } from '@regolithco/common'
import { GetUserProfileQuery } from '../schema'
import { GraphQLError } from 'graphql'
import { ApolloError } from '@apollo/client'

export type InnerLoginContextObj = {
  isAuthenticated: boolean
  loading: boolean
  token: string | null
  authLogIn?: (authType: AuthTypeEnum) => void
  authLogOut?: () => void
}

export type LoginContextObj = InnerLoginContextObj & {
  authType: AuthTypeEnum | null
  setAuthType: (authType: AuthTypeEnum | null) => void
  popupOpen: boolean
  setPopupOpen: (redirect?: string) => void
  closePopup: () => void
  postLoginRedirect: string | null
}

export const DEFAULT_INNER_LOGIN_CONTEXT: InnerLoginContextObj = {
  isAuthenticated: false,
  loading: false,
  token: null,
}

export const DEFAULT_LOGIN_CONTEXT: LoginContextObj = {
  ...DEFAULT_INNER_LOGIN_CONTEXT,
  authType: null,
  setAuthType: () => {
    // Nothing to do here
  },
  popupOpen: false,
  setPopupOpen: () => {
    // Nothing to do here
  },
  postLoginRedirect: null,
  closePopup: () => {
    // Nothing to do here
  },
}

export const LoginContext = React.createContext<LoginContextObj>(DEFAULT_LOGIN_CONTEXT)

export interface UserProfileContextObj {
  myProfile: GetUserProfileQuery['profile'] | null
  loading: boolean
  isVerified: boolean
  isInitialized: boolean
  error?: ApolloError | GraphQLError
}

export const UserProfileContext = React.createContext<UserProfileContextObj>({
  myProfile: null,
  isInitialized: false,
  isVerified: false,
  loading: false,
})
