import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { CollaborateModal as CollaborateModalC } from './CollaborateModal'

export default {
  title: 'Modals/Collaborate',
  component: CollaborateModalC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof CollaborateModalC>

const Template: StoryFn<typeof CollaborateModalC> = (args) => <CollaborateModalC {...args} />

export const CollaborateModal = Template.bind({})
CollaborateModal.args = {
  open: true,
  url: 'https://google.com/Sdfsdfsdafsdfsdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfsd',
  onClose: () => {
    console.log('Closed')
  },
}
