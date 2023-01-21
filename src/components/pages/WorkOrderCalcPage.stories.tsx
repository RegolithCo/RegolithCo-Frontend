import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { WorkOrderCalcPage as WorkOrderCalcPageComponent } from './WorkOrderCalcPage'
import { fakeUserProfile } from '@regolithco/common/dist/mock'

export default {
  title: 'Pages/WorkOrderCalcPage',
  component: WorkOrderCalcPageComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof WorkOrderCalcPageComponent>

const Template: ComponentStory<typeof WorkOrderCalcPageComponent> = (args) => <WorkOrderCalcPageComponent {...args} />

export const WorkOrderCalcPage = Template.bind({})
WorkOrderCalcPage.args = {
  userProfile: fakeUserProfile(),
}
