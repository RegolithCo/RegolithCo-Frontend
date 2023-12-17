import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { CrewListItem as CrewC, CrewListItemProps } from './CrewListItem'
import { fakeSession, fakeUserProfile } from '@regolithco/common/dist/mock'
import { crewHierarchyCalc, Session, SessionUser, User } from '@regolithco/common'
import { SessionContext, sessionContextDefault, SessionContextType } from '../../../../context/session.context'
import { List, Typography } from '@mui/material'

export default {
  title: 'UserList/Crew',
  component: CrewC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof CrewC>

interface TemplateProps {
  componentProps: CrewListItemProps
  contextProps: Partial<SessionContextType>
}
const session = fakeSession()
const sessionMembers: SessionUser[] = session.activeMembers?.items || []
const mySessionUser = sessionMembers[Math.floor(Math.random() * sessionMembers.length)]
const notMySessionUser = sessionMembers.filter((m) => m.ownerId !== mySessionUser.ownerId)[
  Math.floor(Math.random() * sessionMembers.length)
]
const meUser = fakeUserProfile(mySessionUser.owner as User)
const notMeUser = fakeUserProfile(notMySessionUser.owner as User)
// Random session member chosen from sessionMembers

const Template: StoryFn<TemplateProps> = ({ componentProps, contextProps }: TemplateProps) => {
  const captain = { ...componentProps.captain, vehicleCode: 'ARMOLE' }
  const newSession: Session = {
    ...session,
    mentionedUsers: (session.mentionedUsers || []).map((u) => ({
      ...u,
      captainId: captain.ownerId,
    })),
    // Now make sure all the active members get the right captain
    activeMembers: {
      ...session.activeMembers,
      items: (session.activeMembers?.items || []).map((u) =>
        u.ownerId === captain.ownerId
          ? { ...u, vehicleCode: 'ARMOLE' }
          : {
              ...u,
              captainId: captain.ownerId,
              vehicleCode: 'ARMOLE',
            }
      ),
      __typename: 'PaginatedSessionUsers',
    },
  }

  return (
    <SessionContext.Provider
      value={{
        ...sessionContextDefault,
        session: newSession,
        captains: [captain],
        myUserProfile: meUser,
        mySessionUser: mySessionUser,
        crewHierarchy: crewHierarchyCalc(newSession.activeMembers?.items || [], newSession.mentionedUsers || []),
        ...contextProps,
      }}
    >
      <List sx={{ maxWidth: 400, border: '1px solid blue' }}>
        <Typography variant="h6">Me Captain</Typography>
        <CrewC {...componentProps} />
      </List>
    </SessionContext.Provider>
  )
}

export const Crew = Template.bind({})
Crew.args = {
  componentProps: {
    captain: mySessionUser,
  },
  contextProps: {},
}
export const CrewMeCaptain = Template.bind({})
CrewMeCaptain.args = {
  componentProps: {
    captain: notMySessionUser,
  },
  contextProps: {},
}
