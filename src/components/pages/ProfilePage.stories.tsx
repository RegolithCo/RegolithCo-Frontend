import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ProfilePage as ProfilePageComponent } from './ProfilePage'
import { fakeUserProfile, fakeVerifiedUserLookup } from '@orgminer/common/dist/mock'

export default {
  title: 'Pages/ProfilePage',
  component: ProfilePageComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ProfilePageComponent>

const Template: ComponentStory<typeof ProfilePageComponent> = (args) => <ProfilePageComponent {...args} />

export const ProfilePage = Template.bind({})
const userProfile = fakeUserProfile()
ProfilePage.args = {
  userProfile,
  verifiedFriends: fakeVerifiedUserLookup(userProfile.friends),
}
