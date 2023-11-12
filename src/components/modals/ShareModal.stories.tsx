import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ShareModal as ShareModalC } from './ShareModal'
import {
  fakePaginatedSessionUserList,
  fakeSCNameList,
  fakeSession,
  fakeUserProfile,
} from '@regolithco/common/dist/mock'
import { SessionContext, sessionContextDefault, SessionTabs } from '../../context/session.context'

export default {
  title: 'Modals/Share',
  component: ShareModalC,
  parameters: {},
} as Meta<typeof ShareModalC>

const Template: StoryFn<typeof ShareModalC> = (args) => {
  const [orderId, openWorkOrderModal] = React.useState<string>()
  const [scoutingFind, openScoutingModal] = React.useState<string>()
  const [activeTab, setActiveTab] = React.useState<SessionTabs>(SessionTabs.SETTINGS)
  return (
    <SessionContext.Provider
      value={{
        ...sessionContextDefault,
        session: fakeSession({
          activeMembers: fakePaginatedSessionUserList(40),
          mentionedUsers: fakeSCNameList(40),
        }),
        setActiveTab,
        openWorkOrderModal,
        openScoutingModal,
      }}
    >
      <ShareModalC {...args} open />
    </SessionContext.Provider>
  )
}

export const ShareModal = Template.bind({})
const meUser = fakeUserProfile()
ShareModal.args = {}
