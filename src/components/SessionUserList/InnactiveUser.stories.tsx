import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ActiveUser as ActiveUserComponent } from './ActiveUser'
import { fakeSessionUser } from '@regolithco/common/dist/mock'
import { List, Typography } from '@mui/material'
import { SessionUserStateEnum } from '@regolithco/common'
import { InnactiveUserRow } from './InnactiveUser'
import { SessionContext, sessionContextDefault } from '../../context/session.context'

export default {
  title: 'UserList/ActiveUser',
  component: ActiveUserComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof ActiveUserComponent>

const meUser = fakeSessionUser(
  { state: SessionUserStateEnum.Unknown },
  { avatarUrl: '/images/avatars/dummyAvatar.png' }
)
const otherUser = fakeSessionUser(
  { state: SessionUserStateEnum.Unknown },
  { avatarUrl: '/images/avatars/dummyAvatar.png' }
)

const Template: StoryFn<typeof ActiveUserComponent> = (args) => {
  return (
    <SessionContext.Provider
      value={{
        ...sessionContextDefault,
      }}
    >
      <Typography variant="h6">Innactive Users</Typography>
      <List sx={{ maxWidth: 400, border: '1px solid blue' }}>
        <InnactiveUserRow innactiveUser={{ scName: 'userA', __typename: 'InnactiveUser' }} />
        <InnactiveUserRow innactiveUser={{ scName: 'userB Friend', __typename: 'InnactiveUser' }} />
      </List>
    </SessionContext.Provider>
  )
}

export const ActiveUser = Template.bind({})
ActiveUser.args = {
  sessionUser: otherUser,
  captain: undefined,
}
