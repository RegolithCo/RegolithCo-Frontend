import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  GetLoadoutsDocument,
  GetLoadoutsQuery,
  useCreateLoadoutMutation,
  useDeleteLoadoutMutation,
  useGetLoadoutsQuery,
  useUpdateLoadoutMutation,
} from '../../schema'
import { MiningLoadout, MiningLoadoutInput, removeKeyRecursive, UserProfile } from '@regolithco/common'
import { LoadoutPage } from './LoadoutPage'
import { noop } from 'lodash'
import { UserProfileContext } from '../../context/auth.context'
import { useBrowserTitle } from '../../hooks/useBrowserTitle'

export const LoadoutPageContainer: React.FC = () => {
  const navigate = useNavigate()
  const { isInitialized, myProfile } = React.useContext(UserProfileContext)
  const { tab, activeLoadout } = useParams()
  let title = 'Loadouts'
  switch (tab) {
    case 'my':
      title = 'My Loadouts'
      break
    case 'calculator':
      title = 'Loadout Calculator'
      break
    case 'lasers':
      title = 'Loadout Lasers'
      break
    case 'modules':
      title = 'Loadout Modules'
      break
    default:
      title = 'Loadouts'
      break
  }
  useBrowserTitle(title)
  const loadoutsQuery = useGetLoadoutsQuery({
    skip: !isInitialized || !myProfile,
  })

  //   createLoadout
  const [createLoadoutMutation, { loading: createLoadoutLoading }] = useCreateLoadoutMutation()
  const createLoadout = async (loadout: MiningLoadout) => {
    const { __typename, updatedAt, createdAt, loadoutId, owner, activeLasers, ...rest } = loadout
    const loadoutInput: MiningLoadoutInput = {
      //
      ...rest,
      activeLasers: removeKeyRecursive(activeLasers, '__typename'),
    }
    if (!isInitialized) return
    return createLoadoutMutation({
      variables: {
        miningLoadout: loadoutInput,
      },
      onCompleted: (data) => {
        navigate && data?.createLoadout?.loadoutId && navigate(`/loadouts/my/${data?.createLoadout?.loadoutId}`)
      },
      update: (cache, { data }) => {
        const existingUserProfile = cache.readQuery<GetLoadoutsQuery>({
          query: GetLoadoutsDocument,
        })
        if (!data?.createLoadout || !existingUserProfile?.profile) return
        const existingProfile = existingUserProfile.profile
        const newLoadout = data?.createLoadout as MiningLoadout
        const existingLoadouts = existingUserProfile?.profile?.loadouts || ([] as MiningLoadout[])
        cache.writeQuery<GetLoadoutsQuery>({
          query: GetLoadoutsDocument,
          data: {
            profile: {
              ...existingProfile,
              loadouts: [...existingLoadouts, newLoadout],
            },
            __typename: 'Query',
          },
        })
      },
    }).then(noop)
  }

  // updateLoadout
  const [updateLoadoutMutation, { loading: updateLoadoutLoading }] = useUpdateLoadoutMutation()
  const updateLoadout = async (loadout: MiningLoadout) => {
    const { __typename, updatedAt, createdAt, owner, loadoutId, activeLasers, ...rest } = loadout
    const loadoutInput: MiningLoadoutInput = { ...rest, activeLasers: removeKeyRecursive(activeLasers, '__typename') }
    if (!isInitialized) return
    return updateLoadoutMutation({
      variables: {
        loadoutId,
        shipLoadout: loadoutInput,
      },
      optimisticResponse: () => {
        return {
          updateLoadout: {
            ...loadout,
            ...loadoutInput,
            activeLasers,
          },
          __typename: 'Mutation',
        }
      },
    }).then(noop)
  }

  // deleteLoadout
  const [deleteLoadoutMutation, { loading: deleteLoadoutLoading }] = useDeleteLoadoutMutation()
  const deleteLoadout = async (loadoutId: string) => {
    if (!isInitialized) return
    return deleteLoadoutMutation({
      variables: {
        loadoutId,
      },
      optimisticResponse: () => ({
        deleteLoadout: {
          loadoutId,
          __typename: 'MiningLoadout',
        },
        __typename: 'Mutation',
      }),
      update: (cache) => {
        const existingRecord = loadoutsQuery.data?.profile?.loadouts.find((l) => l.loadoutId === loadoutId)
        if (!existingRecord) return
        cache.evict({
          id: cache.identify(existingRecord),
        })
      },
    }).then(noop)
  }

  const loading = createLoadoutLoading || updateLoadoutLoading || deleteLoadoutLoading || loadoutsQuery.loading

  return (
    <LoadoutPage
      navigate={navigate}
      tab={tab as string}
      isLoggedIn={isInitialized}
      loading={loading}
      userProfile={myProfile as UserProfile}
      activeLoadout={activeLoadout}
      createLoadout={createLoadout}
      updateLoadout={updateLoadout}
      deleteLoadout={deleteLoadout}
      loadouts={(loadoutsQuery?.data?.profile?.loadouts as MiningLoadout[]) || []}
    />
  )
}
