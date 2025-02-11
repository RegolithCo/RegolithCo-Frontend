import React, { useEffect } from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ActivePopupUser as ActivePopupUserC, ActivePopupUserProps } from './ActivePopupUser'
import { SessionContext, sessionContextDefault, SessionContextType } from '../../../context/session.context'
import { fakeSession, fakeSessionUser, fakeUserProfile } from '@regolithco/common/dist/__mocks__'
import { Session } from '@regolithco/common'
import { useStorybookLookups } from '../../../hooks/useLookupStorybook'

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
  const meUser = fakeUserProfile({ friends: ['userB_Friend'], avatarUrl: '/images/avatars/dummyAvatar.png' })
  const sessionUser = fakeSessionUser(undefined, meUser)

  return (
    <SessionContext.Provider
      value={{
        ...sessionContextDefault,
        session: fakeSessionObj,
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
