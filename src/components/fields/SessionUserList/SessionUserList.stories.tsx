import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { SessionUserList as SessionUserListComponent, SessionUserListProps } from './SessionUserList'
import { fakeSession, fakeSessionUser, fakeUserProfile } from '@regolithco/common/dist/mock'
import { Box } from '@mui/system'
import { SessionContext, sessionContextDefault, SessionContextType } from '../../../context/session.context'

export default {
  title: 'UserList/UserList',
  component: SessionUserListComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof SessionUserListComponent>

interface TemplateProps {
  componentProps: SessionUserListProps
  contextProps: Partial<SessionContextType>
}

const Template: StoryFn<TemplateProps> = ({ componentProps, contextProps }: TemplateProps) => {
  const session = fakeSession()
  const meUser = fakeUserProfile({ friends: ['userB_Friend'] })
  return (
    <SessionContext.Provider
      value={{
        ...sessionContextDefault,
        session,
        myUserProfile: meUser,
        ...contextProps,
      }}
    >
      <Box sx={{ maxWidth: 400 }}>
        <SessionUserListComponent {...componentProps} />
      </Box>
    </SessionContext.Provider>
  )
}

const fakeSessionUsers = Array.from({ length: 20 }, (_, i) => fakeSessionUser())

export const UserList = Template.bind({})
UserList.args = {
  componentProps: {},
}
