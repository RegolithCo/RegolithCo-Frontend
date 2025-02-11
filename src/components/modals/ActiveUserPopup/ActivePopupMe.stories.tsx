import React, { useEffect } from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ActivePopupMe as ActivePopupMeC, ActivePopupMeProps } from './ActivePopupMe'
import { SessionContext, sessionContextDefault, SessionContextType } from '../../../context/session.context'
import { fakeSession, fakeSessionUser, fakeUserProfile } from '@regolithco/common/dist/__mocks__'
import { Session, SessionUser, User } from '@regolithco/common'
import { useStorybookLookups } from '../../../hooks/useLookupStorybook'

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

  const sessionMembers: SessionUser[] = fakeSessionObj.activeMembers?.items || []
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
        session: fakeSessionObj,
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
