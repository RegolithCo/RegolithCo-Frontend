import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { FAQPage as AboutComponent } from './FAQPage'
import { fakeUserProfile } from '@orgminer/common/dist/mock'

export default {
  title: 'Pages/FAQPage',
  component: AboutComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof AboutComponent>

const Template: ComponentStory<typeof AboutComponent> = (args) => <AboutComponent {...args} />

export const FAQPage = Template.bind({})
FAQPage.args = {
  // userProfile: fakeUserProfile(),
}
