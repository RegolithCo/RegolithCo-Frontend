import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { WorkOrderCalcPage as WorkOrderCalcPageComponent } from './WorkOrderCalcPage'
import { fakeUserProfile } from '@regolithco/common/dist/__mocks__'

export default {
  title: 'Pages/WorkOrderCalcPage',
  component: WorkOrderCalcPageComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof WorkOrderCalcPageComponent>

const Template: StoryFn<typeof WorkOrderCalcPageComponent> = (args) => <WorkOrderCalcPageComponent {...args} />

export const WorkOrderCalcPage = Template.bind({})
WorkOrderCalcPage.args = {
  userProfile: fakeUserProfile(),
}
