import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ActivePopupMe as ActivePopupMeC, ActivePopupMeProps } from './ActivePopupMe'
import { SessionContext, sessionContextDefault, SessionContextType } from '../../../context/session.context'
import { fakeSession, fakeSessionUser, fakeUserProfile } from '@regolithco/common/dist/mock'
import { SessionUser, User } from '@regolithco/common'

export default {
  title: 'Modals/ActivePopupMe',
  component: ActivePopupMeC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof ActivePopupMeC>

interface TemplateProps {
  isCrew?: boolean
  componentProps: ActivePopupMeProps
  contextProps: Partial<SessionContextType>
}

const Template: StoryFn<TemplateProps> = ({ isCrew, componentProps, contextProps }: TemplateProps) => {
  const session = fakeSession()
  const sessionMembers: SessionUser[] = session.activeMembers?.items || []
  // Random session member chosen from sessionMembers
  const meUser = fakeUserProfile(sessionMembers[Math.floor(Math.random() * sessionMembers.length)].owner as User)
  const captains = isCrew
    ? [sessionMembers.filter((m) => m.ownerId !== meUser.userId)[Math.floor(Math.random() * sessionMembers.length)]]
    : []
  const sessionUser = fakeSessionUser(
    {
      // pick a random session.activeMemberIds[] that is not meUser.userId
      captainId: isCrew ? captains[0].ownerId : null,
    },
    meUser
  )

  return (
    <SessionContext.Provider
      value={{
        ...sessionContextDefault,
        session,
        captains,
        myUserProfile: meUser,
        mySessionUser: sessionUser,
        ...contextProps,
      }}
    >
      <ActivePopupMeC {...componentProps} />
    </SessionContext.Provider>
  )
}

export const ActivePopupMe = Template.bind({})
ActivePopupMe.args = {
  componentProps: {
    open: true,
    onClose: () => {
      console.log('Closed')
    },
  },
  contextProps: {},
}

export const ActivePopupMeCrew = Template.bind({})
ActivePopupMeCrew.args = {
  isCrew: true,
  componentProps: {
    open: true,
    onClose: () => {
      console.log('Closed')
    },
  },
  contextProps: {},
}
