import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { SessionJoin as SessionJoinComponent } from './SessionJoin'
import { fakeSession } from '@regolithco/common/dist/mock'

export default {
  title: 'Pages/SessionJoin',
  component: SessionJoinComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof SessionJoinComponent>

const Template: StoryFn<typeof SessionJoinComponent> = (args) => <SessionJoinComponent {...args} />

export const SessionJoin = Template.bind({})
SessionJoin.args = {
  session: fakeSession(),
}
