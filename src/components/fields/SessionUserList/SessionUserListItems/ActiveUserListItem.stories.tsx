import React, { useEffect } from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ActiveUserListItem as ActiveUserComponent, ActiveUserListItemProps } from './ActiveUserListItem'
import { fakeSession, fakeSessionUser } from '@regolithco/common/dist/mock'
import { List, Typography } from '@mui/material'
import { Session, SessionUser, SessionUserStateEnum, User, UserStateEnum } from '@regolithco/common'
import { SessionContext, sessionContextDefault, SessionContextType } from '../../../../context/session.context'
import { useStorybookLookups } from '../../../../hooks/useLookupStorybook'

export default {
  title: 'UserList/ActiveUser',
  component: ActiveUserComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof ActiveUserComponent>

// const meUser = fakeSessionUser(
//   { state: SessionUserStateEnum.Unknown },
//   { avatarUrl: '/images/avatars/dummyAvatar.png' }
// )
const otherUser = fakeSessionUser(
  { state: SessionUserStateEnum.Unknown },
  { avatarUrl: '/images/avatars/dummyAvatar.png' }
)

interface TemplateProps {
  componentProps: ActiveUserListItemProps
  contextProps: Partial<SessionContextType>
}

const Template: StoryFn<TemplateProps> = ({ componentProps, contextProps }: TemplateProps) => {
  const [fakeSessionObj, setFakeSessionObj] = React.useState<Session>()

  const dataStore = useStorybookLookups()

  useEffect(() => {
    const calcFakeSession = async () => {
      const fakeSess = await fakeSession(dataStore)
      setFakeSessionObj(fakeSess)
    }
    calcFakeSession()
  }, [dataStore])

  if (!fakeSessionObj) return <div>Loading Fake session...</div>
  const sessionUser = componentProps?.sessionUser as SessionUser

  // Test all the different user states
  const userStates: SessionUser[] = [
    { ...sessionUser, state: SessionUserStateEnum.Unknown },
    { ...sessionUser, state: SessionUserStateEnum.Afk },
    { ...sessionUser, state: SessionUserStateEnum.RefineryRun },
    { ...sessionUser, state: SessionUserStateEnum.Scouting },
    { ...sessionUser, state: SessionUserStateEnum.OnSite },
    { ...sessionUser, state: SessionUserStateEnum.Travelling },
  ]

  // Test all the different avatar states
  const userAvatarStates: SessionUser[] = [
    {
      ...sessionUser,
      owner: { ...(sessionUser.owner as User), avatarUrl: undefined, state: UserStateEnum.Verified },
    },
    {
      ...sessionUser,
      owner: { ...(sessionUser.owner as User), avatarUrl: undefined, state: UserStateEnum.Unverified },
    },
    {
      ...sessionUser,
      owner: { ...(sessionUser.owner as User), avatarUrl: 'https://localhost/noimage.png' },
    },
    { ...sessionUser, owner: { ...(sessionUser.owner as User) } },
  ]

  return (
    <SessionContext.Provider
      value={{
        ...sessionContextDefault,
        session: fakeSessionObj,
        ...contextProps,
      }}
    >
      <List sx={{ maxWidth: 400, border: '1px solid blue' }}>
        <Typography variant="h6">Me</Typography>
        <ActiveUserComponent {...componentProps} />
        <Typography variant="h6">Session Owner</Typography>
        <ActiveUserComponent {...componentProps} />
        <Typography variant="h6">Is Friend</Typography>
        <ActiveUserComponent {...componentProps} />
      </List>
      <Typography variant="h6">User States</Typography>
      <List sx={{ maxWidth: 400, border: '1px solid blue' }}>
        {userStates.map((u, idx) => (
          <ActiveUserComponent {...componentProps} sessionUser={u} key={idx} />
        ))}
      </List>
      <Typography variant="h6">Avatar States</Typography>
      <List sx={{ maxWidth: 400, border: '1px solid blue' }}>
        {userAvatarStates.map((u, idx) => (
          <ActiveUserComponent {...componentProps} sessionUser={u} key={idx} />
        ))}
      </List>
    </SessionContext.Provider>
  )
}

export const ActiveUser = Template.bind({})
ActiveUser.args = {
  componentProps: {
    sessionUser: otherUser,
  },
}
