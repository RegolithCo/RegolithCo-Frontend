import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { HomePage as HomePageComponent } from './HomePage'
import { fakeUserProfile } from '@regolithco/common/dist/mock'

export default {
  title: 'Pages/HomePage',
  component: HomePageComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof HomePageComponent>

const Template: ComponentStory<typeof HomePageComponent> = (args) => <HomePageComponent {...args} />

export const HomePage = Template.bind({})
HomePage.args = {
  userCtx: {
    signIn: () => {
      console.log('sign in')
    },
    signOut: () => {
      console.log('sign out')
      return Promise.resolve()
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
