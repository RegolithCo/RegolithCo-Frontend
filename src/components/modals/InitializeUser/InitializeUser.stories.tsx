import React from 'react'
import { AuthTypeEnum } from '@regolithco/common'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import log from 'loglevel'
import { LoginContextObj } from '../../../hooks/useOAuth2'
import { InitializeUser } from './InitializeUser'

export default {
  title: 'Modals/InitializeUser',
  component: InitializeUser,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof InitializeUser>

const Template: ComponentStory<typeof InitializeUser> = (args) => <InitializeUser {...args} />

const fns = {
  backToPage: () => {
    log.info('backToPage')
  },
  initializeUser: () => {
    log.info('initializeUser')
  },
  requestVerify: () => {
    log.info('requestVerify')
  },
  verifyUser: () => {
    log.info('verifyUser')
  },
  deleteUser: () => {
    log.info('deleteUser')
  },
}
const login: LoginContextObj = {
  isAuthenticated: true,
  isInitialized: false,
  APIWorking: true,
  isVerified: false,
  loading: false,
  popup: null,
  refreshPopupOpen: false,
  refreshPopup: null,
  setRefreshPopupOpen: () => {
    log.info('setRefreshPopupOpen')
  },

  openPopup: () => {
    log.info('openPopup')
  },
  login: (authType: AuthTypeEnum) => {
    log.info('signIn', authType)
  },
  logOut: () => {
    log.info('signOut')
    return Promise.resolve()
  },
}

export const Initialize = Template.bind({})
Initialize.args = {
  login: {
    ...login,
    isAuthenticated: true,
    isInitialized: false,
    isVerified: false,
  },
  loading: false,
  fns,
}

export const Verify = Template.bind({})
Verify.args = {
  login: {
    ...login,
    isAuthenticated: true,
    isInitialized: true,
    isVerified: false,
  },
  loading: false,
  fns,
}

export const Done = Template.bind({})
Done.args = {
  login: {
    ...login,
    isAuthenticated: true,
    isInitialized: true,
    isVerified: true,
  },
  loading: false,
  fns,
}
