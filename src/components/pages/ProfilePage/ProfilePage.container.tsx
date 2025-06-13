import * as React from 'react'
import { ProfilePage, ProfileTabsEnum } from './ProfilePage'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUserProfile } from '../../../hooks/useUserProfile'
import { UserProfile } from '@regolithco/common'
import { useBrowserTitle } from '../../../hooks/useBrowserTitle'

export const ProfilePageContainer: React.FC = () => {
  const navigate = useNavigate()
  const userProfileQueries = useUserProfile()

  const location = useLocation()

  const activeTab = location.pathname
    .split('/')
    .filter((path) => path && path.length)
    .join('/') as ProfileTabsEnum

  let pageTitle = 'Profile'
  switch (activeTab) {
    case ProfileTabsEnum.PROFILE:
      break
    case ProfileTabsEnum.API:
      pageTitle = 'Profile - API'
      break
    case ProfileTabsEnum.FRIENDS:
      pageTitle = 'Profile - Friends'
      break
    case ProfileTabsEnum.SESSION_DEFAULTS:
      pageTitle = 'Profile - Session Defaults'
      break
    case ProfileTabsEnum.SURVEY:
      pageTitle = 'Profile - Survey Corps'
      break
    default:
      return null
  }

  useBrowserTitle(pageTitle)

  return (
    <ProfilePage
      activeTab={activeTab}
      setActiveTab={(tab) => navigate(`/${tab}`)}
      userProfile={userProfileQueries.userProfile as UserProfile}
      addFriend={userProfileQueries.addFriend}
      removeFriend={userProfileQueries.removeFriend}
      updateUserProfile={userProfileQueries.updateUserProfile}
      deleteProfile={userProfileQueries.deleteProfile}
      loading={userProfileQueries.loading}
      mutating={userProfileQueries.mutating}
      refreshAvatar={userProfileQueries.refreshAvatar}
      resetDefaultSettings={userProfileQueries.resetDefaultSettings}
      deleteAPIKey={userProfileQueries.deleteAPIKey}
      upsertAPIKey={userProfileQueries.upsertAPIKey}
      verifiedFriends={{}}
      navigate={navigate}
    />
  )
}
