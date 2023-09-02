import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { Crew as CrewComponent } from './Crew'
import { fakeSession, fakeSessionUser, fakeUserProfile } from '@regolithco/common/dist/mock'
import { SessionUser, SessionUserStateEnum } from '@regolithco/common'
import { SessionContext, sessionContextDefault, SessionContextType } from '../../../../context/session.context'

export default {
  title: 'UserList/Crew',
  component: CrewComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof CrewComponent>

const meUser = fakeSessionUser(
  { state: SessionUserStateEnum.Unknown },
  { avatarUrl: '/images/avatars/dummyAvatar.png' }
)
const otherUser = fakeSessionUser(
  { state: SessionUserStateEnum.Unknown },
  { avatarUrl: '/images/avatars/dummyAvatar.png' }
)

interface TemplateProps {
  componentProps: SessionUser
  contextProps: Partial<SessionContextType>
}

const Template: StoryFn<TemplateProps> = ({ componentProps, contextProps }: TemplateProps) => {
  const session = fakeSession()
  const meUser = fakeUserProfile({ friends: ['userB_Friend'] })
  // const userStates: SessionUser[] = [
  //   { ...args.captain, state: SessionUserStateEnum.Unknown },
  //   { ...args.captain, state: SessionUserStateEnum.Afk },
  //   { ...args.captain, state: SessionUserStateEnum.RefineryRun },
  //   { ...args.captain, state: SessionUserStateEnum.Scouting },
  //   { ...args.captain, state: SessionUserStateEnum.OnSite },
  //   { ...args.captain, state: SessionUserStateEnum.Travelling },
  // ]
  // const userAvatarStates: SessionUser[] = [
  //   {
  //     ...args.captain,
  //     owner: { ...(args.captain.owner as User), avatarUrl: undefined, state: UserStateEnum.Verified },
  //   },
  //   {
  //     ...args.captain,
  //     owner: { ...(args.captain.owner as User), avatarUrl: undefined, state: UserStateEnum.Unverified },
  //   },
  //   { ...args.captain, owner: { ...(args.captain.owner as User), avatarUrl: 'https://localhost/noimage.png' } },
  //   { ...args.captain, owner: { ...(args.captain.owner as User) } },
  // ]
  return (
    <SessionContext.Provider
      value={{
        ...sessionContextDefault,
        session,
        myUserProfile: meUser,
        ...contextProps,
      }}
    >
      {/* <List sx={{ maxWidth: 400, border: '1px solid blue' }}>
        <Typography variant="h6">Me</Typography>
        <CrewComponent {...args} />
        <Typography variant="h6">Session Owner</Typography>
        <CrewComponent {...args} />
        <Typography variant="h6">Is Friend</Typography>
        <CrewComponent {...args} />
      </List>
      <Typography variant="h6">User States</Typography>
      <List sx={{ maxWidth: 400, border: '1px solid blue' }}>
        {userStates.map((u, idx) => (
          <CrewComponent {...args} captain={u} key={idx} />
        ))}
      </List>
      <Typography variant="h6">Avatar States</Typography>
      <List sx={{ maxWidth: 400, border: '1px solid blue' }}>
        {userAvatarStates.map((u, idx) => (
          <CrewComponent {...args} captain={u} key={idx} />
        ))}
      </List> */}
    </SessionContext.Provider>
  )
}

export const ActiveUser = Template.bind({})
ActiveUser.args = {
  componentProps: {
    ...meUser,
  },
  contextProps: {},
}
