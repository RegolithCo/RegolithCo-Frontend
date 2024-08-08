import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { StoreChooserModal as StoreChooserModalC } from './StoreChooserModal'
import { ShipOreEnum, VehicleOreEnum } from '@regolithco/common'

export default {
  title: 'Modals/StoreChooserModals',
  component: StoreChooserModalC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof StoreChooserModalC>

const Template: StoryFn<typeof StoreChooserModalC> = (args) => <StoreChooserModalC {...args} />

export const StoreChooserModal = Template.bind({})
StoreChooserModal.args = {
  onClose: () => {
    console.log('Closed')
  },
  ores: {
    [VehicleOreEnum.Hadanite]: { collected: 80, refined: 80 },
    [ShipOreEnum.Bexalite]: { collected: 1000, refined: 1000 },
    [ShipOreEnum.Diamond]: { collected: 1000, refined: 1000 },
    [ShipOreEnum.Corundum]: { collected: 1000, refined: 1000 },
    [ShipOreEnum.Iron]: { collected: 1000, refined: 1000 },
  },
  open: true,
  initStore: 'CRUTD',
}
