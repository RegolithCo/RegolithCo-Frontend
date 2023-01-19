import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { SessionJoin as SessionJoinComponent } from './SessionJoin'
import { fakeSession } from '@orgminer/common/dist/mock'

export default {
  title: 'Pages/SessionJoin',
  component: SessionJoinComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof SessionJoinComponent>

const Template: ComponentStory<typeof SessionJoinComponent> = (args) => <SessionJoinComponent {...args} />

export const SessionJoin = Template.bind({})
SessionJoin.args = {
  session: fakeSession(),
}
