import { useGetMyWorkOrdersQuery, useGetUserProfileQuery } from '../schema'
import { PaginatedWorkOrders, UserProfile } from '@regolithco/common'
import { useGQLErrors } from './useGQLErrors'
import { useNavigate } from 'react-router-dom'

import { useSnackbar } from 'notistack'

type useWorkOrdersListReturn = {
  workOrders?: UserProfile['workOrders']
  fetchMore: () => void
  allLoaded: boolean
  loading: boolean
  mutating: boolean
}

export const useWorkOrdersList = (): useWorkOrdersListReturn => {
  const navigate = useNavigate()
  const userProfileQry = useGetUserProfileQuery()
  const { enqueueSnackbar } = useSnackbar()

  const mySessionsQry = useGetMyWorkOrdersQuery({
    variables: {
      nextToken: null,
    },
    notifyOnNetworkStatusChange: true,
    skip: !userProfileQry.data?.profile,
  })

  const fetchMore = () => {
    if (mySessionsQry.data?.profile?.workOrders?.nextToken) {
      mySessionsQry.fetchMore({
        variables: {
          nextToken: mySessionsQry.data?.profile?.workOrders?.nextToken,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          const oldList = (prev.profile?.workOrders as PaginatedWorkOrders) || {}
          const newList = (fetchMoreResult.profile?.workOrders as PaginatedWorkOrders) || {}
          const oldListFiltered = (oldList.items || []).filter((s) => s?.orderId !== newList.items?.[0]?.orderId)
          return {
            ...prev,
            profile: {
              ...(prev.profile as UserProfile),
              mySessions: {
                ...oldList,
                items: [...oldListFiltered, ...(newList?.items || [])],
                nextToken: newList?.nextToken,
              },
            },
          }
        },
      })
    }
  }

  const queries = [userProfileQry, mySessionsQry]
  const mutations = []

  const loading = queries.some((q) => q.loading)
  const mutating = false

  useGQLErrors(queries, mutations)

  return {
    workOrders: {
      items: [],
      nextToken: null,
      __typename: 'PaginatedWorkOrders',
    } as UserProfile['workOrders'],
    loading,
    fetchMore,
    allLoaded: mySessionsQry.data?.profile?.workOrders?.nextToken === null && loading,
    mutating,
  }
}
