import React from 'react'
import { AuthTypeEnum } from '@regolithco/common'
import { GetUserProfileQuery } from '../schema'
import { GraphQLError } from 'graphql'
import { ApolloError } from '@apollo/client'

export type LoginSwitcherObj = {
  authType: AuthTypeEnum | null
  setAuthType: (authType: AuthTypeEnum | null) => void
  popupOpen: boolean
  setPopupOpen: (redirect?: string) => void
  postLoginRedirect: string | null
}

export const LoginContextWrapper = React.createContext<LoginSwitcherObj>({
  authType: AuthTypeEnum.Discord,
  setAuthType: () => {
    // Nothing to do here
  },
  popupOpen: false,
  setPopupOpen: () => {
    // Nothing to do here
  },
  postLoginRedirect: null,
})

export interface LoginContextObj {
  isAuthenticated: boolean
  loading: boolean
  token: string | null
  logIn?: (authType: AuthTypeEnum) => void
  logOut?: () => void
}

export const DEFAULT_LOGIN_CONTEXT: LoginContextObj = {
  isAuthenticated: false,
  loading: false,
  token: null,
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
