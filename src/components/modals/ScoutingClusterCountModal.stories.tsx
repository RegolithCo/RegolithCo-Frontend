import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ScoutingClusterCountModal as ScoutingClusterCountModalC } from './ScoutingClusterCountModal'
import { fakeShipClusterFind } from '@regolithco/common/dist/mock'

export default {
  title: 'Modals/ScoutingClusterCountModal',
  component: ScoutingClusterCountModalC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ScoutingClusterCountModalC>

const Template: ComponentStory<typeof ScoutingClusterCountModalC> = (args) => <ScoutingClusterCountModalC {...args} />

export const ShareModal = Template.bind({})
ShareModal.args = {
  onClose: () => {
    console.log('Closed')
  },
  scoutingFind: fakeShipClusterFind(),
  open: true,
  // shipRock
}
