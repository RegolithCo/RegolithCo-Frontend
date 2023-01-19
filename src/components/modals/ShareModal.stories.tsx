import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ShareModal as ShareModalC } from './ShareModal'

export default {
  title: 'Modals/ShareModal',
  component: ShareModalC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ShareModalC>

const Template: ComponentStory<typeof ShareModalC> = (args) => <ShareModalC {...args} />

export const ShareModal = Template.bind({})
ShareModal.args = {
  open: true,
  url: 'https://google.com/Sdfsdfsdafsdfsdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfsd',
  onClose: () => {
    console.log('Closed')
  },
}
