import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { SessionSettingsModal as SessionSettingsModalC } from './SessionSettingsModal'
import { fakeSession } from '@regolithco/common/dist/mock'

export default {
  title: 'Modals/SessionSettingsModal',
  component: SessionSettingsModalC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof SessionSettingsModalC>

const Template: ComponentStory<typeof SessionSettingsModalC> = (args) => <SessionSettingsModalC {...args} />

export const SessionSettingsModal = Template.bind({})
SessionSettingsModal.args = {
  session: fakeSession(),
  open: true,
  onCloseSession: () => {
    console.log('onCloseSession')
  },

  onChangeSession: (newSession) => {
    console.log('onChange', newSession)
  },
}
