import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { HomePage as HomePageComponent } from './HomePage'
import { fakeUserProfile } from '@regolithco/common/dist/mock'

export default {
  title: 'Pages/HomePage',
  component: HomePageComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof HomePageComponent>

const Template: StoryFn<typeof HomePageComponent> = (args) => <HomePageComponent {...args} />

export const HomePage = Template.bind({})
HomePage.args = {
  userCtx: {
    logIn: () => {
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
