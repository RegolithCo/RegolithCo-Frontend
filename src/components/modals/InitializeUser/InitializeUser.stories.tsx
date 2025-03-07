import React from 'react'
import { AuthTypeEnum } from '@regolithco/common'
import { StoryFn, Meta } from '@storybook/react'
import log from 'loglevel'
import { InitializeUser } from './InitializeUser'
import { LoginContext, LoginContextObj } from '../../../context/auth.context'

export default {
  title: 'Modals/InitializeUser',
  component: InitializeUser,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof InitializeUser>

const Template: StoryFn<typeof InitializeUser> = (args) => (
  <LoginContext.Provider value={loginCtxMock}>
    <InitializeUser {...args} />
  </LoginContext.Provider>
)

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
const loginCtxMock: LoginContextObj = {
  isAuthenticated: true,
  loading: false,
  closePopup: () => {
    log.info('closePopup')
  },
  popupOpen: false,
  setPopupOpen: () => {
    log.info('setPopupOpen')
  },
  postLoginRedirect: null,
  authType: AuthTypeEnum.Discord,
  setAuthType: () => {
    log.info('setAuthType')
  },
  token: 'SOME_TOKEN',
  authLogIn: (authType: AuthTypeEnum) => {
    log.info('signIn', authType)
  },
  authLogOut: () => {
    log.info('signOut')
    return Promise.resolve()
  },
}

export const Initialize = Template.bind({})
Initialize.args = {
  loading: false,
  fns,
}

export const Verify = Template.bind({})
Verify.args = {
  loading: false,
  fns,
}

export const Done = Template.bind({})
Done.args = {
  loading: false,
  fns,
}
