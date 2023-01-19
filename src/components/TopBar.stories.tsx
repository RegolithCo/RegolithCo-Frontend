import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { TopBar as TopBarComponent } from './TopBar'

export default {
  title: 'TopBar',
  component: TopBarComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof TopBarComponent>

const Template: ComponentStory<typeof TopBarComponent> = (args) => <TopBarComponent {...args} />

export const LoggedIn = Template.bind({})
LoggedIn.args = {}

export const LoggedOut = Template.bind({})
LoggedOut.args = {}
