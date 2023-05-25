import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { RefineryDurationModal as RefineryDurationModalC } from './RefineryDurationModal'

export default {
  title: 'Modals/RefineryDurationModal',
  component: RefineryDurationModalC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof RefineryDurationModalC>

const Template: ComponentStory<typeof RefineryDurationModalC> = (args) => <RefineryDurationModalC {...args} />

export const DeleteProfileModal = Template.bind({})
DeleteProfileModal.args = {
  open: true,
  onClose: () => {
    console.log('Closed')
  },
  onChange: (value: number) => {
    console.log(value)
  },
}
