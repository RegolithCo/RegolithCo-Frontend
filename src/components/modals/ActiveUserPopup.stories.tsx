import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ActiveUserPopup as ActiveUserPopupC } from './ActiveUserPopup'

export default {
  title: 'Modals/DeleteProfileModal',
  component: ActiveUserPopupC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ActiveUserPopupC>

const Template: ComponentStory<typeof ActiveUserPopupC> = (args) => <ActiveUserPopupC {...args} />

export const DeleteProfileModal = Template.bind({})
DeleteProfileModal.args = {
  open: true,
  onClose: () => {
    console.log('Closed')
  },
}
