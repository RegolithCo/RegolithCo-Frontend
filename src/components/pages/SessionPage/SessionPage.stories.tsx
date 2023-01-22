import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { SessionPage as SessionPageComponent } from './SessionPage'
import {
  fakePaginatedSessionUserList,
  fakeSCNameList,
  fakeSession,
  fakeUserProfile,
} from '@regolithco/common/dist/mock'
import { WorkOrder } from '@regolithco/common'

export default {
  title: 'Pages/SessionPage',
  component: SessionPageComponent,
  parameters: {},
} as ComponentMeta<typeof SessionPageComponent>

const Template: ComponentStory<typeof SessionPageComponent> = (args) => {
  const [orderId, setActiveOrder] = React.useState<string>()
  const [scoutingFind, setScoutingFind] = React.useState<string>()
  return (
    <SessionPageComponent
      {...args}
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
    activeMembers: fakePaginatedSessionUserList(10),
    mentionedUsers: fakeSCNameList(3),
  }),
  verifiedMentionedUsers: {},
  userProfile: meUser,
}

export const Visitor = Template.bind({})
Visitor.args = {
  session: fakeSession({
    activeMembers: fakePaginatedSessionUserList(10),
    mentionedUsers: fakeSCNameList(3),
  }),
  verifiedMentionedUsers: {},
  userProfile: meUser,
}
