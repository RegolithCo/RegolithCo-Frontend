import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLogin } from '../../hooks/useOAuth2'
import {
  GetLoadoutsDocument,
  useCreateLoadoutMutation,
  useDeleteLoadoutMutation,
  useGetLoadoutsQuery,
  useUpdateLoadoutMutation,
} from '../../schema'
import { GetLoadoutsQuery, MiningLoadout, MiningLoadoutInput, removeKeyRecursive } from '@regolithco/common'
import { LoadoutPage } from './LoadoutPage'
import { noop } from 'lodash'

export const LoadoutPageContainer: React.FC = () => {
  const navigate = useNavigate()
  const { isInitialized, userProfile } = useLogin()
  const { tab, activeLoadout } = useParams()

  const loadoutsQuery = useGetLoadoutsQuery({
    skip: !isInitialized || !userProfile,
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
      userProfile={userProfile}
      activeLoadout={activeLoadout}
      createLoadout={createLoadout}
      updateLoadout={updateLoadout}
      deleteLoadout={deleteLoadout}
      loadouts={(loadoutsQuery?.data?.profile?.loadouts as MiningLoadout[]) || []}
    />
  )
}
