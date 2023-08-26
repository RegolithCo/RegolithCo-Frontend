import * as React from 'react'
import { useSnackbar } from 'notistack'
import {
  GetJoinedUserSessionsDocument,
  GetSessionDocument,
  GetSessionUserDocument,
  useAddScoutingFindMutation,
  useAddSessionMentionsMutation,
  useRemoveSessionMentionsMutation,
  useCreateWorkOrderMutation,
  useDeleteSessionMutation,
  useGetSessionActiveMembersQuery,
  useGetSessionQuery,
  useGetSessionScoutingQuery,
  useGetSessionStubQuery,
  useGetSessionUserQuery,
  useGetSessionWorkOrdersQuery,
  useLeaveSessionMutation,
  useRemoveSessionCrewMutation,
  useUpdateSessionMutation,
  useUpsertSessionUserMutation,
  useMarkCrewSharePaidMutation,
} from '../schema'
import {
  CrewShare,
  CrewShareInput,
  DestructuredSettings,
  destructureSettings,
  ErrorCode,
  GetSessionQuery,
  mergeDestructured,
  PaginatedScoutingFinds,
  PaginatedSessions,
  PaginatedSessionUsers,
  PaginatedWorkOrders,
  RefineryRowInput,
  reverseDestructured,
  SalvageOrder,
  SalvageRowInput,
  ScoutingFind,
  scoutingFindDestructured,
  Session,
  SessionInput,
  SessionSettings,
  SessionStateEnum,
  SessionSystemDefaults,
  SessionUser,
  SessionUserInput,
  SessionUserStateEnum,
  ShipMiningOrder,
  UserProfile,
  VehicleMiningOrder,
  VehicleMiningRowInput,
  WorkOrder,
  WorkOrderInput,
} from '@regolithco/common'
import { useNavigate } from 'react-router-dom'
import { useGQLErrors } from './useGQLErrors'
import { makeSessionUrls } from '../lib/routingUrls'
import { useLogin } from './useOAuth2'
import log from 'loglevel'

type useSessionsReturn = {
  session?: Session
  sessionError?: ErrorCode
  sessionStub?: Session
  sessionUser?: SessionUser
  loading: boolean
  mutating: boolean
  addSessionMentions: (scNames: string[]) => void
  removeSessionMentions: (scName: string[]) => void
  removeSessionCrew: (scName: string) => void
  closeSession: () => void
  joinSession: () => void
  leaveSession: () => void
  onUpdateSession: (session: SessionInput, settings: DestructuredSettings) => void
  deleteSession: () => void
  updateSessionUser: (sessionUser: SessionUserInput) => void
  createWorkOrder: (workOrder: WorkOrder) => void
  createScoutingFind: (newFind: ScoutingFind) => void
  markCrewSharePaid: (crewShare: CrewShare, isPaid: boolean) => void
  resetDefaultSystemSettings: () => void
  resetDefaultUserSettings: () => void
}

export const useSessions = (sessionId?: string): useSessionsReturn => {
  const { userProfile } = useLogin()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [sessionError, setSessionError] = React.useState<ErrorCode>()

  const sessionUserQry = useGetSessionUserQuery({
    variables: {
      sessionId: sessionId as string,
    },
    skip: !sessionId,
  })
  // Think of this like a fallback. We get the short one when we need to
  const sessionStubQry = useGetSessionStubQuery({
    variables: {
      sessionId: sessionId as string,
    },
    skip: !sessionId || sessionUserQry.loading || Boolean(sessionUserQry.data?.sessionUser),
    onCompleted: (data) => {
      if (data.session && sessionError) {
        setSessionError(undefined)
      }
    },
    onError: (error) => {
      setSessionError((error.graphQLErrors[0].extensions?.code as ErrorCode) || ErrorCode.SESSION_NOT_FOUND)
    },
  })

  const sessionQry = useGetSessionQuery({
    variables: {
      sessionId: sessionId as string,
    },
    skip: !sessionId || !sessionUserQry.data?.sessionUser,
  })

  // TODO: This is our sloppy poll function we need to update to lower data costs
  React.useEffect(() => {
    if (sessionQry.data?.session) {
      // If the last updated date is greater than 24 hours or if the state is not active, slow your poll
      const oneDayMs = 86400000 // 24 hours in milliseconds
      const pollTime =
        Date.now() - oneDayMs > sessionQry.data?.session.updatedAt ||
        sessionQry.data?.session.state !== SessionStateEnum.Active
          ? 60000
          : 10000

      sessionQry.startPolling(pollTime)
    } else {
      sessionQry.stopPolling()
    }

    // Only poll the stub if we don't have a real session
    if (!sessionQry.data?.session && sessionStubQry.data?.session) {
      // If the last updated date is greater than 24 hours or if the state is not active, slow your poll
      const oneDayMs = 86400000 // 24 hours in milliseconds
      const pollTime =
        Date.now() - oneDayMs > sessionStubQry.data?.session.updatedAt ||
        sessionStubQry.data?.session.state !== SessionStateEnum.Active
          ? 120000
          : 10000
      // If the session is active, poll every 20 seconds, otherwise every 2 minutes
      sessionStubQry.startPolling(pollTime)
    } else {
      sessionStubQry.stopPolling()
    }
  }, [sessionStubQry.data, sessionQry.data])

  React.useEffect(() => {
    if (sessionQry.error) {
      try {
        if (sessionQry.error.graphQLErrors.find((e) => e.extensions.code === ErrorCode.SESSION_NOT_FOUND)) navigate('/')
      } catch {
        //
      }
      log.error('sessionQry.error', sessionQry.error)
    }
  }, [sessionQry.error])

  const sessionActiveMemberQry = useGetSessionActiveMembersQuery({
    variables: {
      sessionId: sessionId as string,
      nextToken: null,
    },
    skip: !sessionId || !sessionUserQry.data?.sessionUser,
    onCompleted(data) {
      if (data.session?.activeMembers?.nextToken) {
        sessionActiveMemberQry.fetchMore({
          variables: {
            nextToken: data.session?.activeMembers?.nextToken,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult || !prev.session) return prev
            const oldSess = prev.session as Session
            const oldMembers = prev.session.activeMembers as PaginatedSessionUsers
            const newMembers = fetchMoreResult.session?.activeMembers as PaginatedSessionUsers
            return {
              ...prev,
              session: {
                ...oldSess,
                activeMembers: {
                  ...oldMembers,
                  items: [...(oldMembers.items || []), ...(newMembers.items || [])],
                  nextToken: fetchMoreResult.session?.activeMembers?.nextToken,
                },
              },
            }
          },
        })
      }
    },
  })
  const sessionWorkOrdersQry = useGetSessionWorkOrdersQuery({
    variables: {
      sessionId: sessionId as string,
      nextToken: null,
    },
    skip: !sessionId || !sessionUserQry.data?.sessionUser,
  })

  // If there are multiple pages of workorders then fetch them all
  React.useEffect(() => {
    if (sessionQry.data?.session?.workOrders?.nextToken) {
      // We call the leaner version of the query for the second page
      sessionWorkOrdersQry.fetchMore({
        variables: {
          nextToken: sessionQry.data?.session?.workOrders?.nextToken,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          const oldList = (prev.session?.workOrders as PaginatedWorkOrders) || {}
          const newList = (fetchMoreResult.session?.workOrders as PaginatedWorkOrders) || {}
          const oldListFiltered = (oldList.items || []).filter((s) => s?.orderId !== newList.items?.[0]?.orderId)
          return {
            ...prev,
            session: {
              ...(prev.session as Session),
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
  }, [sessionQry.data?.session?.workOrders?.nextToken])

  const sessionScoutingQry = useGetSessionScoutingQuery({
    variables: {
      sessionId: sessionId as string,
      nextToken: null,
    },
    skip: !sessionId || !sessionUserQry.data?.sessionUser,
    onCompleted(data) {
      if (data.session?.scouting?.nextToken) {
        sessionScoutingQry.fetchMore({
          variables: {
            nextToken: data.session?.scouting?.nextToken,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult || !prev.session) return prev
            const oldSess = prev.session as Session
            const oldMembers = prev.session?.scouting as PaginatedScoutingFinds
            const newMembers = fetchMoreResult.session?.scouting as PaginatedScoutingFinds
            return {
              ...prev,
              session: {
                ...oldSess,
                activeMembers: {
                  ...oldMembers,
                  items: [...(oldMembers.items || []), ...(newMembers.items || [])],
                  nextToken: fetchMoreResult.session?.scouting?.nextToken,
                },
              },
            }
          },
        })
      }
    },
  })

  const updateSessionMutation = useUpdateSessionMutation()
  const addSessionMentionsMutation = useAddSessionMentionsMutation()
  const removeSessionMentionsMutation = useRemoveSessionMentionsMutation()
  const removeSessionCrewMutation = useRemoveSessionCrewMutation()
  const markCrewSharePaidMutation = useMarkCrewSharePaidMutation()
  const deleteSessionMutation = useDeleteSessionMutation({
    variables: {
      sessionId: sessionId as string,
    },
    onCompleted() {
      enqueueSnackbar('Session deleted', { variant: 'warning' })
      navigate('/session')
    },
    update: (cache) => {
      cache.evict({ id: cache.identify(sessionQry.data?.session as Session) })
    },
  })
  const upsertSessionUserMutation = useUpsertSessionUserMutation()
  const leaveSessionMutation = useLeaveSessionMutation({
    variables: {
      sessionId: sessionId as string,
    },
    update: (cache) => {
      const sessionUser = cache.identify(sessionQry.data?.session as Session)
      if (!sessionUser) return
      cache.evict({ id: sessionUser })
      // remove the entry from joinedSessionsQry
      cache.modify({
        id: cache.identify(userProfile as UserProfile),
        fields: {
          joinedSessions(existingSessions: PaginatedSessions) {
            if (!existingSessions) return existingSessions
            return {
              ...existingSessions,
              items: existingSessions.items?.filter((s) => s?.sessionId !== sessionId),
            }
          },
        },
      })
    },
    onCompleted: () => {
      enqueueSnackbar('Left session', { variant: 'warning' })
      navigate('/')
    },
  })

  const createWorkOrderMutation = useCreateWorkOrderMutation({
    onCompleted: (data) => {
      enqueueSnackbar('Work order created', { variant: 'success' })
    },
  })
  const createScoutngFindMutation = useAddScoutingFindMutation({
    onCompleted: (data) => {
      enqueueSnackbar('Scouting find created', { variant: 'success' })
    },
  })

  const queries = [
    sessionQry,
    sessionUserQry,
    sessionStubQry,
    sessionActiveMemberQry,
    sessionWorkOrdersQry,
    sessionScoutingQry,
  ]
  const mutations = [
    updateSessionMutation,
    addSessionMentionsMutation,
    removeSessionMentionsMutation,
    removeSessionCrewMutation,
    deleteSessionMutation,
    upsertSessionUserMutation,
    leaveSessionMutation,
    markCrewSharePaidMutation,
    createWorkOrderMutation,
    createScoutngFindMutation,
  ]

  useGQLErrors(queries, mutations)

  const loading = queries.some((q) => q.loading)
  const mutating = mutations.some((m) => m[1].loading)

  const addSessionMentions = (scNames: string[]) => {
    addSessionMentionsMutation[0]({
      variables: {
        sessionId: sessionId as string,
        scNames,
      },
      optimisticResponse: () => {
        const newMentionedMembers = [
          ...((sessionQry.data?.session?.mentionedUsers as Session['mentionedUsers']) || []),
          ...scNames,
        ]
        newMentionedMembers.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

        return {
          addSessionMentions: {
            ...(sessionQry.data?.session as Session),
            mentionedUsers: newMentionedMembers,
          },
          __typename: 'Mutation',
        }
      },
    })
  }

  return {
    session: sessionQry.data?.session as Session,
    sessionError,
    sessionStub: sessionStubQry.data?.session as Session,
    sessionUser: sessionUserQry.data?.sessionUser as SessionUser,
    loading,
    mutating,
    closeSession: () => {
      updateSessionMutation[0]({
        variables: {
          sessionId: sessionId as string,
          session: {
            closeSession: true,
          },
        },
      })
    },
    // We pulled this into a variable because something else needs it
    addSessionMentions,
    removeSessionMentions: (scNames: string[]) => {
      removeSessionMentionsMutation[0]({
        variables: {
          sessionId: sessionId as string,
          scNames,
        },
        optimisticResponse: () => ({
          removeSessionMentions: {
            ...(sessionQry.data?.session as Session),
            mentionedUsers: (sessionQry.data?.session?.mentionedUsers as Session['mentionedUsers']).filter(
              (m) => !scNames.includes(m)
            ),
          },
          __typename: 'Mutation',
        }),
      })
    },
    removeSessionCrew: (scName) => {
      removeSessionCrewMutation[0]({
        variables: {
          sessionId: sessionId as string,
          scNames: [scName],
        },
        optimisticResponse: () => ({
          removeSessionCrew: {
            ...(sessionQry.data?.session as Session),
            mentionedUsers: (sessionQry.data?.session?.mentionedUsers as Session['mentionedUsers']).filter(
              (m) => m !== scName
            ),
          },
          __typename: 'Mutation',
        }),
      })
    },
    deleteSession: deleteSessionMutation[0],
    joinSession: () => {
      upsertSessionUserMutation[0]({
        variables: {
          sessionId: sessionId as string,
          workSessionUser: {
            isPilot: true,
            state: SessionUserStateEnum.Unknown,
          },
        },
        // We need to wait for the ID here I think
        refetchQueries: [GetJoinedUserSessionsDocument, GetSessionUserDocument, GetSessionDocument],
        onCompleted: () => {
          enqueueSnackbar('Joined session', { variant: 'success' })
          navigate(makeSessionUrls({ sessionId }))
        },
      })
    },
    updateSessionUser: (sessionUser: SessionUserInput) => {
      upsertSessionUserMutation[0]({
        variables: {
          sessionId: sessionId as string,
          workSessionUser: sessionUser,
        },
        optimisticResponse: () => {
          const { isPilot, state, ...retVal } = {
            ...(sessionUserQry.data?.sessionUser as SessionUser),
            ...sessionUser,
          }
          return {
            upsertSessionUser: {
              isPilot: typeof isPilot === 'boolean' ? isPilot : sessionUserQry.data?.sessionUser?.isPilot || true,
              state: state || sessionUserQry.data?.sessionUser?.state || SessionUserStateEnum.Unknown,
              ...retVal,
            },
            __typename: 'Mutation',
          }
        },
      })
    },
    leaveSession: leaveSessionMutation[0],
    onUpdateSession: (session: SessionInput, destructSessSettings: DestructuredSettings) => {
      updateSessionMutation[0]({
        variables: {
          sessionId: sessionId as string,
          session: session || {},
          // UserProfile uses "sessionSettings" so we need to rename this
          ...destructSessSettings,
        },
        optimisticResponse: () => {
          const merged = mergeDestructured(
            sessionQry.data?.session?.sessionSettings || { __typename: 'SessionSettings' },
            destructSessSettings
          )
          return {
            updateSession: {
              ...(sessionQry.data?.session as Session),
              settings: merged,
            },
            __typename: 'Mutation',
          }
        },
      })
    },
    resetDefaultSystemSettings: () => {
      const newSettings = SessionSystemDefaults()
      const reversed = reverseDestructured(newSettings)

      updateSessionMutation[0]({
        variables: {
          sessionId: sessionId as string,
          session: {},
          // UserProfile uses "sessionSettings" so we need to rename this
          ...newSettings,
        },
        optimisticResponse: () => {
          return {
            updateSession: {
              ...(sessionQry.data?.session as Session),
              settings: reversed,
            },
            __typename: 'Mutation',
          }
        },
      })
    },
    resetDefaultUserSettings: () => {
      if (!userProfile) return
      const userSettings = userProfile?.sessionSettings as SessionSettings
      const newSettings = destructureSettings(userSettings)

      updateSessionMutation[0]({
        variables: {
          sessionId: sessionId as string,
          session: {},
          // UserProfile uses "sessionSettings" so we need to rename this
          ...newSettings,
        },
        optimisticResponse: () => {
          return {
            updateSession: {
              ...(sessionQry.data?.session as Session),
              settings: userSettings,
            },
            __typename: 'Mutation',
          }
        },
      })
    },
    createWorkOrder: async (newOrder: WorkOrder) => {
      const { crewShares, includeTransferFee, note, shareAmount, sellStore, sellerscName, expenses } = newOrder
      const shipOrder = newOrder as ShipMiningOrder
      const { processStartTime, processDurationS, refinery, method, isRefined, shareRefinedValue } = shipOrder

      const filteredExpenses = (expenses || [])
        .filter(({ name }) => name && name.trim().length > 0)
        .map(({ name, amount }) => ({ name, amount }))
      const workOrderInput: WorkOrderInput = {
        includeTransferFee,
        isRefined,
        method,
        note,
        processStartTime,
        processDurationS,
        sellerscName,
        expenses: filteredExpenses,
        refinery,
        shareRefinedValue,
        shareAmount,
        sellStore,
      }
      const newShares: CrewShareInput[] = (crewShares || []).map(({ scName, share, shareType, state, note }) => ({
        scName,
        share,
        shareType,
        state: Boolean(state),
        note,
      }))
      const salvageOres: SalvageRowInput[] = (newOrder as SalvageOrder).salvageOres
      const shipOres: RefineryRowInput[] = (newOrder as ShipMiningOrder).shipOres
      const vehicleOres: VehicleMiningRowInput[] = (newOrder as VehicleMiningOrder).vehicleOres
      newOrder.orderId = 'UPL_' + (Math.random() * 1000).toFixed(0)

      return createWorkOrderMutation[0]({
        variables: {
          sessionId: sessionId as string,
          workOrder: workOrderInput,
          salvageOres: salvageOres ? salvageOres.map(({ ore, amt }) => ({ ore, amt })) : undefined,
          shipOres: shipOres ? shipOres.map(({ ore, amt }) => ({ ore, amt })) : undefined,
          vehicleOres: vehicleOres ? vehicleOres.map(({ ore, amt }) => ({ ore, amt })) : undefined,
          shares: newShares,
        },

        // Now update the session work orders list to include the new item
        update: (cache, { data }) => {
          const newOrderVal = data?.createWorkOrder?.orderId ? (data?.createWorkOrder as WorkOrder) : undefined
          if (!newOrderVal?.orderId) return
          const session = cache.readQuery<GetSessionQuery>({
            query: GetSessionDocument,
            variables: { sessionId: sessionId as string },
          })
          if (!session) return
          const newOrderItems: WorkOrder[] = [
            ...((session.session?.workOrders?.items as WorkOrder[]) || []),
            newOrderVal,
          ]
          cache.writeQuery<GetSessionQuery>({
            query: GetSessionDocument,
            variables: { sessionId: sessionId as string },
            data: {
              session: {
                ...(session.session as Session),
                workOrders: {
                  ...(session.session?.workOrders || { __typename: 'PaginatedWorkOrders', nextToken: null }),
                  items: newOrderItems,
                },
              },
              __typename: 'Query',
            },
          })
        },
      })
    },
    // NOTE: This looks similar to "setCrewSharePaid" in useWorkOrder.ts but it's much more lightweight
    markCrewSharePaid: (crewShare: CrewShare, isPaid: boolean) => {
      const { orderId, sessionId, scName } = crewShare
      markCrewSharePaidMutation[0]({
        variables: {
          sessionId,
          orderId,
          scName,
          isPaid,
        },
        optimisticResponse: () => ({
          __typename: 'Mutation',
          markCrewSharePaid: {
            ...(crewShare as CrewShare),
            state: isPaid,
          },
        }),
      })
    },
    createScoutingFind: (newFind: ScoutingFind) => {
      // Assign a temp ID
      newFind.scoutingFindId = 'SFUPL_' + (Math.random() * 1000).toFixed(0)

      const destructured = scoutingFindDestructured(newFind)

      createScoutngFindMutation[0]({
        variables: {
          sessionId: sessionId as string,
          ...destructured,
        },
        update: (cache, { data }) => {
          const newScoutingFind = data?.addScoutingFind?.scoutingFindId
            ? (data?.addScoutingFind as ScoutingFind)
            : undefined
          if (!newScoutingFind?.scoutingFindId) return
          const session = cache.readQuery<GetSessionQuery>({
            query: GetSessionDocument,
            variables: { sessionId: sessionId as string },
          })
          if (!session) return
          const newScoutingFindItems: ScoutingFind[] = [
            ...((session.session?.scouting?.items as ScoutingFind[]) || []),
            newScoutingFind,
          ]
          cache.writeQuery<GetSessionQuery>({
            query: GetSessionDocument,
            variables: { sessionId: sessionId as string },
            data: {
              session: {
                ...(session.session as Session),
                scouting: {
                  ...(session.session?.scouting || { __typename: 'PaginatedScoutingFinds', nextToken: null }),
                  items: newScoutingFindItems,
                },
              },
              __typename: 'Query',
            },
          })
        },
      })
    },
  }
}
