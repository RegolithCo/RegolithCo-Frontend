import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ActiveUser as ActiveUserComponent } from './ActiveUser'
import { fakeSessionUser } from '@regolithco/common/dist/mock'
import { List, Typography } from '@mui/material'
import { SessionUser, SessionUserStateEnum, User, UserStateEnum } from '@regolithco/common'
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
  const userStates: SessionUser[] = [
    { ...args.sessionUser, state: SessionUserStateEnum.Unknown },
    { ...args.sessionUser, state: SessionUserStateEnum.Afk },
    { ...args.sessionUser, state: SessionUserStateEnum.RefineryRun },
    { ...args.sessionUser, state: SessionUserStateEnum.Scouting },
    { ...args.sessionUser, state: SessionUserStateEnum.OnSite },
    { ...args.sessionUser, state: SessionUserStateEnum.Travelling },
  ]
  const userAvatarStates: SessionUser[] = [
    {
      ...args.sessionUser,
      owner: { ...(args.sessionUser.owner as User), avatarUrl: undefined, state: UserStateEnum.Verified },
    },
    {
      ...args.sessionUser,
      owner: { ...(args.sessionUser.owner as User), avatarUrl: undefined, state: UserStateEnum.Unverified },
    },
    { ...args.sessionUser, owner: { ...(args.sessionUser.owner as User), avatarUrl: 'https://localhost/noimage.png' } },
    { ...args.sessionUser, owner: { ...(args.sessionUser.owner as User) } },
  ]
  return (
    <SessionContext.Provider
      value={{
        ...sessionContextDefault,
      }}
    >
      <List sx={{ maxWidth: 400, border: '1px solid blue' }}>
        <Typography variant="h6">Me</Typography>
        <ActiveUserComponent {...args} />
        <Typography variant="h6">Session Owner</Typography>
        <ActiveUserComponent {...args} />
        <Typography variant="h6">Is Friend</Typography>
        <ActiveUserComponent {...args} />
      </List>
      <Typography variant="h6">User States</Typography>
      <List sx={{ maxWidth: 400, border: '1px solid blue' }}>
        {userStates.map((u, idx) => (
          <ActiveUserComponent {...args} sessionUser={u} key={idx} />
        ))}
      </List>
      <Typography variant="h6">Avatar States</Typography>
      <List sx={{ maxWidth: 400, border: '1px solid blue' }}>
        {userAvatarStates.map((u, idx) => (
          <ActiveUserComponent {...args} sessionUser={u} key={idx} />
        ))}
      </List>
    </SessionContext.Provider>
  )
}

export const ActiveUser = Template.bind({})
ActiveUser.args = {
  sessionUser: otherUser,
  captain: undefined,
}
