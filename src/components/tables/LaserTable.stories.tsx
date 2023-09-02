import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { LaserTable as LaserTableC } from './LaserTable'

export default {
  title: 'Tables/LaserTable',
  component: LaserTableC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof LaserTableC>

const Template: StoryFn<typeof LaserTableC> = (args) => <LaserTableC {...args} />

export const LaserTable = Template.bind({})
LaserTable.args = {
  onAddToLoadout: (module) => console.log(module),
}
