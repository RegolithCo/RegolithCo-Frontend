import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ShipRockEntryModal as ShipRockEntryModalC } from './ShipRockEntryModal'

export default {
  title: 'Modals/ShipRockEntryModal',
  component: ShipRockEntryModalC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof ShipRockEntryModalC>

const Template: StoryFn<typeof ShipRockEntryModalC> = (args) => <ShipRockEntryModalC {...args} />

export const ShipRockEntryModal = Template.bind({})
ShipRockEntryModal.args = {
  onClose: () => {
    console.log('Closed')
  },
  onSubmit: (newRock) => {
    console.log('Submitted', newRock)
  },
  open: true,
  // shipRock
}
