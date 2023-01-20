import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ShipRockEntryModal as ShipRockEntryModalC } from './ShipRockEntryModal'

export default {
  title: 'Modals/ShipRockEntryModal',
  component: ShipRockEntryModalC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ShipRockEntryModalC>

const Template: ComponentStory<typeof ShipRockEntryModalC> = (args) => <ShipRockEntryModalC {...args} />

export const ShareModal = Template.bind({})
ShareModal.args = {
  onClose: () => {
    console.log('Closed')
  },
  onSubmit: (newRock) => {
    console.log('Submitted', newRock)
  },
  open: true,
  // shipRock
}
