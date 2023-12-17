import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { TopBar as TopBarComponent } from './TopBar'
import { fakeUserProfile } from '@regolithco/common/dist/mock'

export default {
  title: 'TopBar',
  component: TopBarComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof TopBarComponent>

const Template: StoryFn<typeof TopBarComponent> = (args) => <TopBarComponent {...args} />

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  userCtx: {
    login: () => {
      console.log('sign in')
    },
    popup: null,
    openPopup: () => {
      console.log('open popup')
    },
    logOut: () => {
      console.log('sign out')
      return Promise.resolve()
    },
    refreshPopupOpen: false,
    refreshPopup: null,
    setRefreshPopupOpen: () => {
      console.log('setRefreshPopupOpen')
    },
    isAuthenticated: true,
    isInitialized: true,
    isVerified: true,
    APIWorking: true,
    loading: false,
    error: undefined,
    maintenanceMode: undefined,
    userProfile: fakeUserProfile(),
  },
}

export const LoggedOut = Template.bind({})
LoggedOut.args = {
  userCtx: {
    login: () => {
      console.log('sign in')
    },
    popup: null,
    openPopup: () => {
      console.log('open popup')
    },
    logOut: () => {
      console.log('sign out')
      return Promise.resolve()
    },
    refreshPopupOpen: false,
    refreshPopup: null,
    setRefreshPopupOpen: () => {
      console.log('setRefreshPopupOpen')
    },
    isAuthenticated: false,
    isInitialized: false,
    isVerified: false,
    APIWorking: true,
    loading: false,
  },
}
