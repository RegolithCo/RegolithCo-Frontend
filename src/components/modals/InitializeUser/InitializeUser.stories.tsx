import { ComponentStory, ComponentMeta } from '@storybook/react'
import log from 'loglevel'
import { InitializeUser } from './InitializeUser'
import { LoginContextObj } from '../../../types'

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
  signIn: () => {
    log.info('signIn')
  },
  signOut: () => {
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
