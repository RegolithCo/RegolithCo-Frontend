import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ProfilePage as ProfilePageComponent } from './ProfilePage'
import { fakeUserProfile, fakeVerifiedUserLookup } from '@regolithco/common/dist/__mocks__'

export default {
  title: 'Pages/ProfilePage',
  component: ProfilePageComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof ProfilePageComponent>

const Template: StoryFn<typeof ProfilePageComponent> = (args) => <ProfilePageComponent {...args} />

export const ProfilePage = Template.bind({})
const userProfile = fakeUserProfile()
ProfilePage.args = {
  userProfile,
  verifiedFriends: fakeVerifiedUserLookup(userProfile.friends),
}
