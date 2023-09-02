import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { LoadoutPage as LoadoutPageC, LoadoutTabIndex } from './LoadoutPage'

export default {
  title: 'Pages/LoadoutPage',
  component: LoadoutPageC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof LoadoutPageC>

const Template: StoryFn<typeof LoadoutPageC> = (args) => <LoadoutPageC {...args} />

export const LoadoutPage = Template.bind({})
LoadoutPage.args = {
  isLoggedIn: true,
  navigate: () => {
    console.log('navigate')
  },
  tab: LoadoutTabIndex.Calculator,
}
