import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { DeletionModal } from './DeletionModal'

export default {
  title: 'Modals/Deletion',
  component: DeletionModal,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof DeletionModal>

const Template: ComponentStory<typeof DeletionModal> = (args) => <DeletionModal {...args} />

export const Default = Template.bind({})
Default.args = {
  user: {
    name: 'Jane Doe',
  },
}
