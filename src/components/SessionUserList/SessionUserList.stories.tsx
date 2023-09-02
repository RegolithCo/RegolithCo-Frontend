import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { SessionUserList as SessionUserListComponent } from './SessionUserList'
import { fakeSessionUser } from '@regolithco/common/dist/mock'
import { Box } from '@mui/system'

export default {
  title: 'UserList/UserList',
  component: SessionUserListComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof SessionUserListComponent>

const Template: StoryFn<typeof SessionUserListComponent> = (args) => (
  <Box sx={{ maxWidth: 400 }}>
    <SessionUserListComponent {...args} />
  </Box>
)

const fakeSessionUsers = Array.from({ length: 20 }, (_, i) => fakeSessionUser())

export const UserList = Template.bind({})
UserList.args = {
  meId: fakeSessionUsers[3].ownerId,
  friends: fakeSessionUsers.slice(0, 4).map((u) => u.owner?.scName as string),
  // sessionUsers: fakeUsers.map((u) => ({
  //   fakeSessionUser,
  // })),
  listUsers: fakeSessionUsers,
}
