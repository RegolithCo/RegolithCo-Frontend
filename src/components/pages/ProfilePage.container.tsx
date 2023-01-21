import * as React from 'react'
import { ProfilePage } from './ProfilePage'
import { useNavigate } from 'react-router-dom'
import { useUserProfile } from '../../hooks/useUserProfile'
import { UserProfile } from '@regolithco/common'

export const ProfilePageContainer: React.FC = () => {
  const navigate = useNavigate()
  const userProfileQueries = useUserProfile()
  return (
    <ProfilePage
      userProfile={userProfileQueries.userProfile as UserProfile}
      addFriend={userProfileQueries.addFriend}
      removeFriend={userProfileQueries.removeFriend}
      updateUserProfile={userProfileQueries.updateUserProfile}
      deleteProfile={userProfileQueries.deleteProfile}
      loading={userProfileQueries.loading}
      resetDefaultSettings={userProfileQueries.resetDefaultSettings}
      verifiedFriends={{}}
      navigate={navigate}
    />
  )
}
