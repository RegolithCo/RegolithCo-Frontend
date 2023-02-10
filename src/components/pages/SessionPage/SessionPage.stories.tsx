import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { SessionPage as SessionPageComponent } from './SessionPage'
import {
  fakePaginatedSessionUserList,
  fakeSCNameList,
  fakeSession,
  fakeUserProfile,
  fakeWorkOrders,
} from '@regolithco/common/dist/mock'
import { SessionTabs } from './SessionPage.container'

export default {
  title: 'Pages/SessionPage2',
  component: SessionPageComponent,
  parameters: {},
} as ComponentMeta<typeof SessionPageComponent>

const Template: ComponentStory<typeof SessionPageComponent> = (args) => {
  const [orderId, setActiveOrder] = React.useState<string>()
  const [scoutingFind, setScoutingFind] = React.useState<string>()
  const [activeTab, setActiveTab] = React.useState<SessionTabs>(SessionTabs.SETTINGS)
  return (
    <SessionPageComponent
      {...args}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      openWorkOrderModal={setActiveOrder}
      openScoutingModal={setScoutingFind}
      orderId={orderId}
      scoutingFindId={scoutingFind}
    />
  )
}

export const SessionPage = Template.bind({})
const meUser = fakeUserProfile()
SessionPage.args = {
  session: fakeSession({
    activeMembers: fakePaginatedSessionUserList(40),
    mentionedUsers: fakeSCNameList(40),
  }),
  verifiedMentionedUsers: {},
  userProfile: meUser,
}

export const Visitor = Template.bind({})
Visitor.args = {
  session: fakeSession({
    activeMembers: fakePaginatedSessionUserList(10),
    mentionedUsers: fakeSCNameList(20),
  }),
  verifiedMentionedUsers: {},
  userProfile: meUser,
}
