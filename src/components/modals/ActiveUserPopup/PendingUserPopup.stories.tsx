import React, { useEffect } from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { PendingUserPopup as PendingUserPopupC, PendingUserPopupProps } from './PendingUserPopup'
import { SessionContext, sessionContextDefault, SessionContextType } from '../../../context/session.context'
import { fakeSession, fakeUserProfile } from '@regolithco/common/dist/__mocks__'
import { Session } from '@regolithco/common'
import { useStorybookLookups } from '../../../hooks/useLookupStorybook'

export default {
  title: 'Modals/PendingUserPopup',
  component: PendingUserPopupC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof PendingUserPopupC>

interface TemplateProps {
  componentProps: PendingUserPopupProps
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
      <PendingUserPopupC {...componentProps} />
    </SessionContext.Provider>
  )
}

export const PendingUserPopup = Template.bind({})
PendingUserPopup.args = {
  componentProps: {
    open: true,
    pendingUser: {
      scName: 'userA',
      captainId: null,
      __typename: 'PendingUser',
    },
    onClose: () => {
      console.log('Closed')
    },
  },
  contextProps: {},
}
