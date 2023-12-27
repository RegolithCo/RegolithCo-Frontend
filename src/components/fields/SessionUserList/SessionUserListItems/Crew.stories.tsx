import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { CrewListItem as CrewC } from './CrewListItem'
import { fakeSession, fakeUserProfile } from '@regolithco/common/dist/mock'
import { crewHierarchyCalc, Session, SessionUser, User, UserProfile } from '@regolithco/common'
import { SessionContext, sessionContextDefault, SessionContextType } from '../../../../context/session.context'
import { List, Typography } from '@mui/material'
import { useStorybookAsyncLookupData } from '../../../../hooks/useLookupStorybook'

export default {
  title: 'UserList/Crew',
  component: CrewC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof CrewC>

interface TemplateProps {
  componentProps: { iIsCaptain: boolean }
  contextProps: Partial<SessionContextType>
}

const Template: StoryFn<TemplateProps> = ({ componentProps, contextProps }: TemplateProps) => {
  const [myUserProfile, setMyUserProfile] = React.useState<UserProfile | null>(null)
  const [captain, setCaptain] = React.useState<SessionUser | null>(null)

  const [mySessionUser, setMySessionUser] = React.useState<SessionUser | null>(null)

  const fakeSessionObj = useStorybookAsyncLookupData<Session>(async (ds) => {
    const fSession = await fakeSession(ds)
    const sessionMembers: SessionUser[] = fSession.activeMembers?.items || []
    const mySessionUser = sessionMembers[Math.floor(Math.random() * sessionMembers.length)]
    setMySessionUser(mySessionUser)
    const notMySessionUser = sessionMembers.filter((m) => m.ownerId !== mySessionUser.ownerId)[
      Math.floor(Math.random() * sessionMembers.length)
    ]
    const meUser = fakeUserProfile(mySessionUser.owner as User)
    setMyUserProfile(meUser)

    const captain = componentProps.iIsCaptain ? mySessionUser : notMySessionUser
    setCaptain(captain)

    // Random session member chosen from sessionMembers

    const fakeSessionObj: Session = {
      ...fSession,
      mentionedUsers: (fSession.mentionedUsers || []).map((u) => ({
        ...u,
        captainId: captain.ownerId,
      })),
      // Now make sure all the active members get the right captain
      activeMembers: {
        ...fSession.activeMembers,
        items: (fSession.activeMembers?.items || []).map((u) =>
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
    return fakeSessionObj
  })

  if (!fakeSessionObj || !captain || !mySessionUser || !myUserProfile) return <div>Loading Fake session...</div>
  return (
    <SessionContext.Provider
      value={{
        ...sessionContextDefault,
        session: fakeSessionObj,
        captains: [captain],
        myUserProfile,
        mySessionUser: mySessionUser,
        crewHierarchy: crewHierarchyCalc(
          fakeSessionObj.activeMembers?.items || [],
          fakeSessionObj.mentionedUsers || []
        ),
        ...contextProps,
      }}
    >
      <List sx={{ maxWidth: 400, border: '1px solid blue' }}>
        <Typography variant="h6">Me Captain</Typography>
        <CrewC captain={captain} />
      </List>
    </SessionContext.Provider>
  )
}

export const Crew = Template.bind({})
Crew.args = {
  componentProps: {
    iIsCaptain: true,
  },
  contextProps: {},
}
export const CrewMeCaptain = Template.bind({})
CrewMeCaptain.args = {
  componentProps: {
    iIsCaptain: false,
  },
  contextProps: {},
}
