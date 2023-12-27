import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { RockIcon, ClawIcon, GemIcon, DiscordIcon, LaserIcon, ModuleIcon } from './index'
import { SvgIcon } from '@mui/material'

export default {
  title: 'Icons',
  component: SvgIcon,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof SvgIcon>

const Template: StoryFn<typeof SvgIcon> = (args) => (
  <div>
    <RockIcon {...args} />
    <ClawIcon {...args} />
    <GemIcon {...args} />
    <DiscordIcon {...args} />
    <LaserIcon {...args} />
    <ModuleIcon {...args} />
  </div>
)

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  sx: {
    color: 'primary.main',
    fontSize: 100,
  },
}
