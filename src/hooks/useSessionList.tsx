import {
  GetMyUserSessionsDocument,
  GetMyUserSessionsQuery,
  useCreateSessionMutation,
  useGetJoinedUserSessionsQuery,
  useGetMyUserSessionsQuery,
  useGetUserProfileQuery,
} from '../schema'
import {
  defaultSessionName,
  mergeSessionSettings,
  RefineryEnum,
  RefineryMethodEnum,
  SalvageOreEnum,
  Session,
  ShipOreEnum,
  UserProfile,
  VehicleOreEnum,
} from '@regolithco/common'
import { useGQLErrors } from './useGQLErrors'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect } from 'react'

type useSessionsReturn = {
  mySessions?: UserProfile['mySessions']
  joinedSessions?: UserProfile['joinedSessions']
  paginationDate: number
  setPaginationDate: (timestamp: number) => void
  fetchMoreSessions: () => void
  allLoaded: boolean
  loading: boolean
  mutating: boolean
  createSession: () => void
}

const getNewPaginationDate = (items?: Session[]): number => {
  if (!items?.length) return dayjs().subtract(15, 'days').startOf('month').valueOf()
  return items[items.length - 1].createdAt
}

export const useSessionList = (): useSessionsReturn => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const userProfileQry = useGetUserProfileQuery()
  const [paginationDate, _setPaginationDate] = React.useState<number>(getNewPaginationDate())

  const setPaginationDate = (timestamp: number) => {
    if (timestamp < paginationDate) _setPaginationDate(timestamp)
  }

  const mySessionsDoneRef = React.useRef(false)
  const joinedSessionsDoneRef = React.useRef(false)

  const mySessionsQry = useGetMyUserSessionsQuery({
    variables: { nextToken: null },
    notifyOnNetworkStatusChange: true,
    skip: !userProfileQry.data?.profile,
  })

  useEffect(() => {
    const data = mySessionsQry.data
    if (data) {
      const items: Session[] = (data.profile?.mySessions?.items as Session[]) || []
      if (items.length > 0) {
        const newDate = getNewPaginationDate(items)
        _setPaginationDate((prev) => (newDate < prev ? newDate : prev))
      }
    }
  }, [mySessionsQry.data])

  const joinedSessionsQry = useGetJoinedUserSessionsQuery({
    variables: { nextToken: null },
    notifyOnNetworkStatusChange: true,
    skip: !userProfileQry.data?.profile,
  })

  const createSessionMutation = useCreateSessionMutation({
    update: (cache, { data }) => {
      const existing = cache.readQuery<GetMyUserSessionsQuery>({
        query: GetMyUserSessionsDocument,
        variables: { nextToken: null },
      })
      if (!existing || !data?.createSession) return

      const items = existing.profile?.mySessions?.items || []
      cache.writeQuery({
        query: GetMyUserSessionsDocument,
        variables: { nextToken: null },
        data: {
          profile: {
            ...existing.profile,
            mySessions: {
              ...existing.profile?.mySessions,
              items: [...items, data.createSession],
            },
          },
        },
      })
    },
    onCompleted: (data) => {
      enqueueSnackbar('Session created', { variant: 'success' })
      navigate(`/session/${data.createSession?.sessionId}`)
    },
  })

  const fetchMoreGeneric = (
    query: typeof mySessionsQry,
    doneRef: React.MutableRefObject<boolean>,
    key: 'mySessions' | 'joinedSessions'
  ) => {
    const nextToken = query.data?.profile?.[key]?.nextToken
    if (!nextToken || doneRef.current) return

    query.fetchMore({
      variables: { nextToken },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.profile?.[key]?.nextToken) doneRef.current = true
        const oldList = prev.profile?.[key] || { items: [] }
        const newList = fetchMoreResult.profile?.[key] || { items: [] }

        const dedupedItems = [
          ...oldList.items.filter((s) => !newList.items.find((n) => n.sessionId === s.sessionId)),
          ...newList.items,
        ]

        if (newList.items.length > 0) {
          const lastDate = newList.items[newList.items.length - 1].createdAt
          setPaginationDate(lastDate)
        }

        return {
          ...prev,
          profile: {
            ...prev.profile,
            [key]: {
              ...oldList,
              items: dedupedItems,
              nextToken: newList.nextToken,
            },
          },
        } as GetMyUserSessionsQuery
      },
    })
  }

  useEffect(() => {
    fetchMoreGeneric(mySessionsQry, mySessionsDoneRef, 'mySessions')
    fetchMoreGeneric(joinedSessionsQry, joinedSessionsDoneRef, 'joinedSessions')
  }, [paginationDate, mySessionsQry, joinedSessionsQry])

  const fetchMoreSessions = useCallback(() => {
    fetchMoreGeneric(mySessionsQry, mySessionsDoneRef, 'mySessions')
    fetchMoreGeneric(joinedSessionsQry, joinedSessionsDoneRef, 'joinedSessions')
  }, [])

  const queries = [userProfileQry, mySessionsQry, joinedSessionsQry]
  const mutations = [createSessionMutation]
  const loading = queries.some((q) => q.loading)
  const mutating = mutations.some(([, state]) => state.loading)

  useGQLErrors(queries, mutations)

  return {
    mySessions: mySessionsQry.data?.profile?.mySessions as UserProfile['mySessions'],
    joinedSessions: joinedSessionsQry.data?.profile?.joinedSessions as UserProfile['joinedSessions'],
    paginationDate,
    setPaginationDate,
    fetchMoreSessions,
    allLoaded:
      !mySessionsQry.data?.profile?.mySessions?.nextToken &&
      !joinedSessionsQry.data?.profile?.joinedSessions?.nextToken,
    loading,
    mutating,
    createSession: () => {
      const userSessionDefaults = userProfileQry.data?.profile?.sessionSettings || { __typename: 'SessionSettings' }
      const initialSessionSettings = mergeSessionSettings(
        {
          allowUnverifiedUsers: true,
          specifyUsers: false,
          lockedFields: [],
          workOrderDefaults: {
            includeTransferFee: true,
            shareRefinedValue: true,
            lockedFields: [],
            isRefined: true,
            refinery: RefineryEnum.Arcl1,
            method: RefineryMethodEnum.DinyxSolventation,
            salvageOres: [SalvageOreEnum.Rmc],
            shipOres: [ShipOreEnum.Quantanium],
            vehicleOres: [VehicleOreEnum.Hadanite],
            crewShares: [],
            __typename: 'WorkOrderDefaults',
          },
          __typename: 'SessionSettings',
        },
        userSessionDefaults
      )

      createSessionMutation[0]({
        variables: {
          session: { mentionedUsers: [], name: defaultSessionName() },
          ...initialSessionSettings,
        },
        refetchQueries: [GetMyUserSessionsDocument],
      })
    },
  }
}
