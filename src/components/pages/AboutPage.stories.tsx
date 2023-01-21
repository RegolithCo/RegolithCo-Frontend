import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { AboutPage as AboutComponent } from './AboutPage'
import { fakeUserProfile } from '@regolithco/common/dist/mock'

export default {
  title: 'Pages/AboutPage',
  component: AboutComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof AboutComponent>

const Template: ComponentStory<typeof AboutComponent> = (args) => <AboutComponent {...args} />

export const AboutPage = Template.bind({})
AboutPage.args = {
  // userProfile: fakeUserProfile(),
}
