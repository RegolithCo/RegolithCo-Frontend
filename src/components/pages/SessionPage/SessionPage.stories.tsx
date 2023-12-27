import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { SessionPage as SessionPageComponent } from './SessionPage'
import {
  fakePaginatedSessionUserList,
  fakeSCNameList,
  fakeSession,
  fakeUserProfile,
} from '@regolithco/common/dist/mock'
import { SessionContext, sessionContextDefault, SessionTabs } from '../../../context/session.context'

export default {
  title: 'Pages/SessionPage2',
  component: SessionPageComponent,
  parameters: {},
} as Meta<typeof SessionPageComponent>

// const Template: StoryFn<typeof SessionPageComponent> = (args) => {
//   const [orderId, openWorkOrderModal] = React.useState<string>()
//   const [scoutingFind, openScoutingModal] = React.useState<string>()
//   const [activeTab, setActiveTab] = React.useState<SessionTabs>(SessionTabs.SETTINGS)
//   return (
//     <SessionContext.Provider
//       value={{
//         ...sessionContextDefault,
//         session: fakeSession({
//           activeMembers: fakePaginatedSessionUserList(40),
//           mentionedUsers: fakeSCNameList(40),
//         }),
//         setActiveTab,
//         openWorkOrderModal,
//         openScoutingModal,
//       }}
//     >
//       <SessionPageComponent {...args} />
//     </SessionContext.Provider>
//   )
// }

// export const SessionPage = Template.bind({})
// const meUser = fakeUserProfile()
// SessionPage.args = {}

// export const Visitor = Template.bind({})
// Visitor.args = {}
