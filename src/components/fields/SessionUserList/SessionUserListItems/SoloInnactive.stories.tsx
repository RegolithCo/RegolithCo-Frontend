import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { SoloActive as SoloInnactiveComponent } from './SoloActive'
import { fakeSession, fakeUserProfile } from '@regolithco/common/dist/mock'
import { List, Typography } from '@mui/material'
import { SoloInnactive, SoloInnactiveProps } from './SoloInnactive'
import { SessionContext, sessionContextDefault, SessionContextType } from '../../../../context/session.context'

export default {
  title: 'UserList/SoloInnactive',
  component: SoloInnactiveComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof SoloInnactiveComponent>

interface TemplateProps {
  componentProps: Partial<SoloInnactiveProps>
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
      <Typography variant="h6">Innactive Users</Typography>
      <List sx={{ maxWidth: 400, border: '1px solid blue' }}>
        <SoloInnactive
          innactiveUser={{ scName: 'userA', __typename: 'InnactiveUser' }}
          openContextMenu={(el: HTMLElement) => console.log('openContextMenu', el)}
          {...componentProps}
        />
        <SoloInnactive
          innactiveUser={{ scName: 'userB_Friend', __typename: 'InnactiveUser' }}
          openContextMenu={(el: HTMLElement) => console.log('openContextMenu', el)}
          {...componentProps}
        />
      </List>
    </SessionContext.Provider>
  )
}

export const ActiveUser = Template.bind({})
ActiveUser.args = {
  componentProps: {},
  contextProps: {},
}
