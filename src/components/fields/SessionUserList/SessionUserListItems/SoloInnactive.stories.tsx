import React, { useEffect } from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ActiveUserListItem as SoloInnactiveComponent } from './ActiveUserListItem'
import { fakeSession, fakeUserProfile } from '@regolithco/common/dist/__mocks__'
import { List, Typography } from '@mui/material'
import { PendingUserListItem as SoloInnactiveC, PendingUserListItemProps } from './PendingUserListItem'
import { SessionContext, sessionContextDefault, SessionContextType } from '../../../../context/session.context'
import { Session } from '@regolithco/common'
import { useStorybookLookups } from '../../../../hooks/useLookupStorybook'

export default {
  title: 'UserList/SoloInnactive',
  component: SoloInnactiveComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof SoloInnactiveComponent>

interface TemplateProps {
  componentProps: Partial<PendingUserListItemProps>
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

  const meUser = fakeUserProfile({ friends: ['userB_Friend'] })
  return (
    <SessionContext.Provider
      value={{
        ...sessionContextDefault,
        session: fakeSessionObj,
        myUserProfile: meUser,
        ...contextProps,
      }}
    >
      <Typography variant="h6">OPendi Users</Typography>
      <List sx={{ maxWidth: 400, border: '1px solid blue' }}>
        <SoloInnactiveC pendingUser={{ scName: 'userA', __typename: 'PendingUser' }} {...componentProps} />
        <SoloInnactiveC pendingUser={{ scName: 'userB_Friend', __typename: 'PendingUser' }} {...componentProps} />
      </List>
    </SessionContext.Provider>
  )
}

export const SoloInnactive = Template.bind({})
SoloInnactive.args = {
  componentProps: {},
  contextProps: {},
}
