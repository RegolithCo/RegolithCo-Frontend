// import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { Dashboard as DashboardC } from './Dashboard'
// import { fakeUserProfile } from '@regolithco/common/dist/mock'
// import { User } from '@regolithco/common'
// import log from 'loglevel'

export default {
  title: 'Pages/SessionChooserPage',
  component: DashboardC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof DashboardC>

const Template: StoryFn<typeof DashboardC> = (args) => <DashboardC {...args} />

export const SessionChooserPage = Template.bind({})
// const userProfile = fakeUserProfile()
// const { userId, scName, createdAt, updatedAt, state } = userProfile
// const user: User = { userId, scName, createdAt, updatedAt, state, __typename: 'User' }
// SessionChooserPage.args = {
//   userProfile,
//   mySessions: Array.from({ length: 20 }, () => fakeSession({ owner: user })),
//   joinedSessions: Array.from({ length: 20 }, () => fakeSession()),
//   loading: false,
//   navigate: (path: string) => {
//     log.debug('navigate', path)
//   },
//   onCreateNewSession: () => {
//     log.debug('onCreateNewSession')
//   },
// }
