import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ModuleTable as ModuleTableC } from './ModuleTable'

export default {
  title: 'Tables/ModuleTable',
  component: ModuleTableC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof ModuleTableC>

const Template: StoryFn<typeof ModuleTableC> = (args) => <ModuleTableC {...args} />

export const ModuleTable = Template.bind({})
ModuleTable.args = {
  onAddToLoadout: (module) => {
    console.log('onAddToLoadout', module)
  },
}
