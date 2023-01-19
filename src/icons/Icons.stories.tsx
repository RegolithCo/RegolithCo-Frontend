import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { RockIcon, ClawIcon, GemIcon } from './index'
import { SvgIcon, Typography } from '@mui/material'

export default {
  title: 'Icons',
  component: SvgIcon,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof SvgIcon>

const Template: ComponentStory<typeof SvgIcon> = (args) => (
  <div>
    <RockIcon {...args} />
    <ClawIcon {...args} />
    <GemIcon {...args} />
  </div>
)

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  sx: {
    color: 'primary.main',
    fontSize: 100,
  },
}
