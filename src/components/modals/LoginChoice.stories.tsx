import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { LoginChoice as LoginChoiceC } from './LoginChoice'
import { AuthTypeEnum } from '@regolithco/common'

export default {
  title: 'Modals/LoginChoice',
  component: LoginChoiceC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof LoginChoiceC>

const Template: ComponentStory<typeof LoginChoiceC> = (args) => <LoginChoiceC {...args} />

export const DeleteProfileModal = Template.bind({})
DeleteProfileModal.args = {
  open: true,
  onClose: () => {
    console.log('Closed')
  },
  authType: AuthTypeEnum.DISCORD,
  setAuthType: (authType: AuthTypeEnum) => {
    console.log('Set Auth Type', authType)
  },
  login: () => {
    console.log('Login')
  },
}
