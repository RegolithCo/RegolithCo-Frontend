import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { MValue } from './MValue'
import { Typography } from '@mui/material'

export default {
  title: 'Fields/MValue',
  component: MValue,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof MValue>

const Template: ComponentStory<typeof MValue> = (args) => (
  <div>
    <Typography>Zero</Typography>
    <MValue {...args} value={0} />
    <Typography>null</Typography>
    <MValue {...args} value={null} />
    <Typography>NaN</Typography>
    <MValue {...args} value={NaN} />
    <Typography>undefined</Typography>
    <MValue {...args} value={undefined} />
    <Typography>large</Typography>
    <MValue {...args} value={1234567890} />
    <Typography>small</Typography>
    <MValue {...args} value={0.00001} decimals={10} />
  </div>
)

export const Variations = Template.bind({})
Variations.args = {}
