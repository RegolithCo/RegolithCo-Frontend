import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { SessionChooserPage as SessionChooserPageC } from './SessionChooserPage'
import { fakeSession, fakeUserProfile } from '@orgminer/common/dist/mock'
import { User } from '@orgminer/common'

export default {
  title: 'Pages/SessionChooserPage',
  component: SessionChooserPageC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof SessionChooserPageC>

const Template: ComponentStory<typeof SessionChooserPageC> = (args) => <SessionChooserPageC {...args} />

export const SessionChooserPage = Template.bind({})
const userProfile = fakeUserProfile()
const { userId, scName, createdAt, updatedAt, state } = userProfile
const user: User = { userId, scName, createdAt, updatedAt, state, __typename: 'User' }
SessionChooserPage.args = {
  userProfile,
  mySessions: Array.from({ length: 0 }, () => fakeSession({ owner: user })),
  joinedSessions: Array.from({ length: 0 }, () => fakeSession()),
  loading: false,
  navigate: (path: string) => {
    console.log('navigate', path)
  },
  onCreateNewSession: () => {
    console.log('onCreateNewSession')
  },
}
