import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { DeleteProfileModal as DeleteProfileModalC } from './DeleteProfileModal'

export default {
  title: 'Modals/DeleteProfileModal',
  component: DeleteProfileModalC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof DeleteProfileModalC>

const Template: StoryFn<typeof DeleteProfileModalC> = (args) => <DeleteProfileModalC {...args} />

export const DeleteProfileModal = Template.bind({})
DeleteProfileModal.args = {
  open: true,
  scName: 'starcitizenuser',
  onClose: () => {
    console.log('Closed')
  },
  onConfirm: () => {
    console.log('Confirmed')
  },
}
