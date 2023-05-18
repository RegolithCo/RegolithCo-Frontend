import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { StoreChooserModal as StoreChooserModalC } from './StoreChooserModal'

export default {
  title: 'Modals/StoreChooserModals',
  component: StoreChooserModalC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof StoreChooserModalC>

const Template: ComponentStory<typeof StoreChooserModalC> = (args) => <StoreChooserModalC {...args} />

export const StoreChooserModal = Template.bind({})
StoreChooserModal.args = {
  onClose: () => {
    console.log('Closed')
  },
  ores: {},
  open: true,
  initStore: undefined,
}
