import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ScoutingClusterCountModal as ScoutingClusterCountModalC } from './ScoutingClusterCountModal'
import { fakeShipClusterFind } from '@regolithco/common/dist/mock'

export default {
  title: 'Modals/ScoutingClusterCountModal',
  component: ScoutingClusterCountModalC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof ScoutingClusterCountModalC>

const Template: StoryFn<typeof ScoutingClusterCountModalC> = (args) => <ScoutingClusterCountModalC {...args} />

export const ShareModal = Template.bind({})
ShareModal.args = {
  onClose: () => {
    console.log('Closed')
  },
  clusterCount: 1,
  open: true,
  // shipRock
}
