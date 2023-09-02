import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ClusterCalcPage as ClusterCalcPageC } from './ClusterCalcPage'
import { fakeUserProfile } from '@regolithco/common/dist/mock'

export default {
  title: 'Pages/ClusterCalcPage',
  component: ClusterCalcPageC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof ClusterCalcPageC>

const Template: StoryFn<typeof ClusterCalcPageC> = (args) => <ClusterCalcPageC {...args} />

export const AboutPage = Template.bind({})
AboutPage.args = {
  // userProfile: fakeUserProfile(),
}
