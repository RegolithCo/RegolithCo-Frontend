import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ActivePopupUser as ActivePopupUserC, ActivePopupUserProps } from './ActivePopupUser'
import { SessionContext, sessionContextDefault, SessionContextType } from '../../../context/session.context'
import { fakeSession, fakeSessionUser, fakeUserProfile } from '@regolithco/common/dist/mock'

export default {
  title: 'Modals/ActivePopupUser',
  component: ActivePopupUserC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof ActivePopupUserC>

interface TemplateProps {
  componentProps: ActivePopupUserProps
  contextProps: Partial<SessionContextType>
}

const Template: StoryFn<TemplateProps> = ({ componentProps, contextProps }: TemplateProps) => {
  const session = fakeSession()
  const meUser = fakeUserProfile({ friends: ['userB_Friend'], avatarUrl: '/images/avatars/dummyAvatar.png' })
  const sessionUser = fakeSessionUser(undefined, meUser)

  return (
    <SessionContext.Provider
      value={{
        ...sessionContextDefault,
        session,
        myUserProfile: meUser,
        mySessionUser: sessionUser,
        ...contextProps,
      }}
    >
      <ActivePopupUserC {...componentProps} />
    </SessionContext.Provider>
  )
}

export const ActivePopupUser = Template.bind({})
ActivePopupUser.args = {
  componentProps: {
    open: true,
    sessionUser: fakeSessionUser(),
    onClose: () => {
      console.log('Closed')
    },
  },
  contextProps: {},
}
