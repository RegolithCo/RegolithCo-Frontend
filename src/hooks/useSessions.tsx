import * as React from 'react'
import { useSnackbar } from 'notistack'
import {
  GetSessionDocument,
  useAddScoutingFindMutation,
  useAddSessionMentionsMutation,
  useRemoveSessionMentionsMutation,
  useCreateWorkOrderMutation,
  useDeleteSessionMutation,
  useGetSessionActiveMembersQuery,
  useGetSessionQuery,
  useGetSessionScoutingQuery,
  useGetSessionUserQuery,
  useGetSessionWorkOrdersQuery,
  useLeaveSessionMutation,
  useRemoveSessionCrewMutation,
  useUpdateSessionMutation,
  useUpsertSessionUserMutation,
  useMarkCrewSharePaidMutation,
  useUpdateSessionUserMutation,
  useUpdatePendingUsersMutation,
  GetSessionQuery,
} from '../schema'
import {
  CrewShare,
  CrewShareInput,
  DestructuredSettings,
  destructureSettings,
  ErrorCode,
  PendingUser,
  mergeDestructured,
  PaginatedScoutingFinds,
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
  SessionRoleEnum,
  ShipRoleEnum,
  PendingUserInput,
  SessionStateEnum,
} from '@regolithco/common'
import { useNavigate } from 'react-router-dom'
import { useGQLErrors } from './useGQLErrors'
import log from 'loglevel'
import { Reference, StoreObject } from '@apollo/client'
import { UserProfileContext } from '../context/auth.context'

type useSessionsReturn = {
  session?: Session
  sessionError?: ErrorCode
  sessionUser?: SessionUser
  loading: boolean
  mutating: boolean
  addSessionMentions: (scNames: string[]) => Promise<void>
  removeSessionMentions: (scName: string[]) => Promise<void>
  removeSessionCrew: (scName: string) => Promise<void>
  reOpenSession: () => Promise<void>
  closeSession: () => Promise<void>
  leaveSession: () => Promise<void>
  onUpdateSession: (session: SessionInput, settings: DestructuredSettings) => Promise<void>
  deleteSession: () => Promise<void>
  updateMySessionUser: (sessionUser: SessionUserInput) => Promise<void>
  updateSessionRole: (userId: string, sessionRole: SessionRoleEnum | null) => Promise<void>
  updateShipRole: (userId: string, shipRole: ShipRoleEnum | null) => Promise<void>
  updateSessionUserCaptain: (userId: string, newCaptainId: string | null) => Promise<void>
  updatePendingUsers: (pendingUsers: PendingUserInput[]) => Promise<void>
  createWorkOrder: (workOrder: WorkOrder) => Promise<void>
  createScoutingFind: (newFind: ScoutingFind) => Promise<void>
  markCrewSharePaid: (crewShare: CrewShare, isPaid: boolean) => Promise<void>
  resetDefaultSystemSettings: () => Promise<void>
  resetDefaultUserSettings: () => Promise<void>
}

export const useSessions = (sessionId?: string): useSessionsReturn => {
  const { myProfile } = React.useContext(UserProfileContext)
  const navigate = useNavigate()
  const [fetchPolicy, setFetchPolicy] = React.useState<'cache-only' | 'network-only'>('cache-only')
  const previousSessionId = React.useRef<string | null>(null)

  const { enqueueSnackbar } = useSnackbar()
  const [sessionError, setSessionError] = React.useState<ErrorCode>()

  const sessionUserQry = useGetSessionUserQuery({
    variables: {
      sessionId: sessionId as string,
    },
    skip: !sessionId,
  })

  const sessionQry = useGetSessionQuery({
    variables: {
      sessionId: sessionId as string,
    },
    fetchPolicy,
    skip: !sessionId || !sessionUserQry.data?.sessionUser,
    onCompleted: (data) => {},
  })

  React.useEffect(() => {
    if (previousSessionId.current !== sessionId) {
      setFetchPolicy('network-only')
      previousSessionId.current = sessionId || null
      // refetch the session if the sessionId changes
      sessionQry.refetch()
    } else {
      setFetchPolicy('cache-only')
    }
  }, [sessionId])

  React.useEffect(() => {
    if (sessionQry.error) {
      try {
        if (sessionQry.error.graphQLErrors.find((e) => e.extensions?.code === ErrorCode.SESSION_NOT_FOUND))
          navigate('/')
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
  const updateSessionUserMutation = useUpdateSessionUserMutation()
  const updatePendingUsersMutation = useUpdatePendingUsersMutation()

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
        id: cache.identify(myProfile as UserProfile),
        fields: {
          joinedSessions(existingSessionsRefs, { readField }) {
            return existingSessionsRefs.items.filter((sessionRef: StoreObject | Reference) => {
              return sessionId !== readField('sessionId', sessionRef)
            })
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

  const queries = [sessionQry, sessionUserQry, sessionActiveMemberQry, sessionWorkOrdersQry, sessionScoutingQry]
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

  const addSessionMentions = (scNames: string[]): Promise<void> => {
    return addSessionMentionsMutation[0]({
      variables: {
        sessionId: sessionId as string,
        scNames,
      },
      optimisticResponse: () => {
        const newMentionedMembers: PendingUser[] = [
          ...((sessionQry.data?.session?.mentionedUsers as PendingUser[]) || []),
          ...scNames.map(
            (s) =>
              ({
                scName: s,
                captainId: null,
                __typename: 'PendingUser',
              }) as PendingUser
          ),
        ]
        newMentionedMembers.sort(({ scName: a }, { scName: b }) => a.toLowerCase().localeCompare(b.toLowerCase()))

        return {
          addSessionMentions: {
            ...(sessionQry.data?.session as Session),
            updatedAt: new Date().getTime(),
            mentionedUsers: newMentionedMembers,
          },
          __typename: 'Mutation',
        }
      },
    }).then()
  }

  return {
    session: sessionQry.data?.session as Session,
    sessionError,
    sessionUser: sessionUserQry.data?.sessionUser as SessionUser,
    loading,
    mutating,
    reOpenSession: () => {
      return updateSessionMutation[0]({
        variables: {
          sessionId: sessionId as string,
          session: {
            state: SessionStateEnum.Active,
          },
        },
      }).then()
    },
    closeSession: () => {
      return updateSessionMutation[0]({
        variables: {
          sessionId: sessionId as string,
          session: {
            state: SessionStateEnum.Closed,
          },
        },
      }).then()
    },
    // We pulled this into a variable because something else needs it
    addSessionMentions,
    removeSessionMentions: (scNames: string[]) => {
      return removeSessionMentionsMutation[0]({
        variables: {
          sessionId: sessionId as string,
          scNames,
        },
        optimisticResponse: () => ({
          removeSessionMentions: {
            ...(sessionQry.data?.session as Session),
            updatedAt: new Date().getTime(),
            mentionedUsers: (sessionQry.data?.session?.mentionedUsers as Session['mentionedUsers']).filter(
              (m) => !scNames.includes(m.scName)
            ),
          },
          __typename: 'Mutation',
        }),
      }).then()
    },
    removeSessionCrew: (scName) => {
      return removeSessionCrewMutation[0]({
        variables: {
          sessionId: sessionId as string,
          scNames: [scName],
        },
        // We need to filter out the users because it may be another 10 seconds before the query updates its poll
        // Also we can save ourselves a query by just updating the cache
        update: (cache) => {
          // 1. Pull all crew shares for this session from the cache
          const sessionQry = cache.readQuery<GetSessionQuery>({
            query: GetSessionDocument,
            variables: { sessionId: sessionId as string },
          })
          if (!sessionQry || !sessionQry.session) return
          const activeUser = sessionQry.session?.activeMembers?.items?.find((m) => m.owner?.scName === scName)
          const newSessionQry: GetSessionQuery = {
            ...sessionQry,
            session: {
              ...sessionQry.session,
              activeMembers: sessionQry.session?.activeMembers
                ? {
                    ...sessionQry.session?.activeMembers,
                    items: (sessionQry.session?.activeMembers?.items as SessionUser[]).filter(({ ownerId }) =>
                      activeUser ? ownerId !== activeUser.ownerId : true
                    ),
                  }
                : undefined,
              workOrders: sessionQry.session?.workOrders
                ? {
                    ...sessionQry.session?.workOrders,
                    items: (sessionQry.session?.workOrders?.items as WorkOrder[])
                      .filter(({ ownerId }) => (activeUser ? ownerId !== activeUser.ownerId : true))
                      .map((wo) => ({
                        ...wo,
                        crewShares: (wo.crewShares as CrewShare[]).filter((cs) => cs.payeeScName !== scName),
                      })),
                  }
                : undefined,
              scouting: sessionQry.session?.scouting
                ? {
                    ...sessionQry.session?.scouting,
                    items: (sessionQry.session?.scouting?.items as ScoutingFind[]).filter(({ ownerId }) =>
                      activeUser ? ownerId !== activeUser.ownerId : true
                    ),
                  }
                : undefined,
            },
          }
          // 2. Write the modified session back to the cache
          cache.writeQuery<GetSessionQuery>({
            query: GetSessionDocument,
            variables: { sessionId: sessionId as string },
            data: newSessionQry,
          })
        },
        optimisticResponse: () => ({
          removeSessionCrew: {
            ...(sessionQry.data?.session as Session),
            mentionedUsers: (sessionQry.data?.session?.mentionedUsers as Session['mentionedUsers']).filter(
              (m) => m.scName !== scName
            ),
          },
          __typename: 'Mutation',
        }),
      }).then()
    },
    deleteSession: () => {
      return deleteSessionMutation[0]().then()
    },
    updateMySessionUser: (sessionUser: SessionUserInput) => {
      return upsertSessionUserMutation[0]({
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
              ...retVal,
              isPilot: typeof isPilot === 'boolean' ? isPilot : sessionUserQry.data?.sessionUser?.isPilot || true,
              state: state || sessionUserQry.data?.sessionUser?.state || SessionUserStateEnum.Unknown,
            },
            __typename: 'Mutation',
          }
        },
      }).then()
    },
    updateSessionRole: (userId: string, sessionRole: SessionRoleEnum | null) => {
      return updateSessionUserMutation[0]({
        variables: {
          sessionId: sessionId as string,
          userId,
          sessionUser: {
            sessionRole,
          },
        },
        optimisticResponse: (data) => {
          const foundSessionUser = sessionQry.data?.session?.activeMembers?.items?.find(
            (m) => m.ownerId === userId
          ) as SessionUser
          const { ...retVal } = foundSessionUser
          return {
            updateSessionUser: {
              ...retVal,
              sessionRole,
            },
            __typename: 'Mutation',
          }
        },
      }).then()
    },
    updateShipRole: (userId: string, shipRole: ShipRoleEnum | null) => {
      return updateSessionUserMutation[0]({
        variables: {
          sessionId: sessionId as string,
          userId,
          sessionUser: {
            shipRole,
          },
        },
        optimisticResponse: () => {
          const foundSessionUser = sessionQry.data?.session?.activeMembers?.items?.find(
            (m) => m.ownerId === userId
          ) as SessionUser
          const { ...retVal } = foundSessionUser
          return {
            updateSessionUser: {
              ...retVal,
              shipRole,
            },
            __typename: 'Mutation',
          }
        },
      }).then()
    },
    updateSessionUserCaptain: (userId: string, newCaptainId: string | null) => {
      return updateSessionUserMutation[0]({
        variables: {
          sessionId: sessionId as string,
          userId,
          sessionUser: {
            captainId: newCaptainId,
          },
        },
        optimisticResponse: () => {
          const foundSessionUser = sessionQry.data?.session?.activeMembers?.items?.find(
            (m) => m.ownerId === userId
          ) as SessionUser
          const { isPilot, ...retVal } = foundSessionUser
          return {
            updateSessionUser: {
              ...retVal,
              captainId: newCaptainId,
              isPilot: !newCaptainId,
            },
            __typename: 'Mutation',
          }
        },
      }).then()
    },
    updatePendingUsers: (pendingUsers: PendingUserInput[]) => {
      // Make sure to strip out the typename
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sanitizedUsers = (pendingUsers as any[]).map(({ __typename, ...rest }) => rest)
      return updatePendingUsersMutation[0]({
        variables: {
          sessionId: sessionId as string,
          pendingUsers: sanitizedUsers,
        },
        optimisticResponse: () => {
          return {
            updatePendingUsers: {
              ...(sessionQry.data?.session as Session),
              mentionedUsers: (sessionQry.data?.session?.mentionedUsers as Session['mentionedUsers']).map((m) => {
                const found = pendingUsers.find((p) => p.scName === m.scName)
                if (found) {
                  return {
                    ...m,
                    ...found,
                  }
                }
                return m
              }),
            },
            __typename: 'Mutation',
          }
        },
      }).then()
    },
    leaveSession: () => {
      return leaveSessionMutation[0]().then()
    },
    onUpdateSession: (session: SessionInput, destructSessSettings: DestructuredSettings) => {
      return updateSessionMutation[0]({
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
      }).then()
    },
    resetDefaultSystemSettings: () => {
      const newSettings = SessionSystemDefaults()
      const reversed = reverseDestructured(newSettings)

      return updateSessionMutation[0]({
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
      }).then()
    },
    resetDefaultUserSettings: () => {
      if (!myProfile) return Promise.resolve()
      const userSettings = myProfile?.sessionSettings as SessionSettings
      const newSettings = destructureSettings(userSettings)

      return updateSessionMutation[0]({
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
      }).then()
    },
    createWorkOrder: async (newOrder: WorkOrder) => {
      const { crewShares, includeTransferFee, note, shareAmount, sellStore, sellerscName, sellerUserId, expenses } =
        newOrder
      const shipOrder = newOrder as ShipMiningOrder
      const { processStartTime, processDurationS, refinery, method, isRefined, shareRefinedValue } = shipOrder

      const filteredExpenses = (expenses || [])
        .filter(({ name }) => name && name.trim().length > 0)
        .map(({ name, amount, ownerScName }) => ({ name, amount, ownerScName }))
      const workOrderInput: WorkOrderInput = {
        includeTransferFee,
        isRefined,
        method,
        note,
        processStartTime,
        processDurationS,
        sellerscName: sellerUserId ? undefined : sellerscName,
        sellerUserId,
        expenses: filteredExpenses,
        refinery,
        shareRefinedValue,
        shareAmount,
        sellStore,
      }
      const newShares: CrewShareInput[] = (crewShares || []).map(({ payeeScName, share, shareType, state, note }) => ({
        payeeScName,
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
      }).then()
    },
    // NOTE: This looks similar to "setCrewSharePaid" in useWorkOrder.ts but it's much more lightweight
    markCrewSharePaid: (crewShare: CrewShare, isPaid: boolean) => {
      const { orderId, sessionId, payeeScName } = crewShare
      return markCrewSharePaidMutation[0]({
        variables: {
          sessionId,
          orderId,
          payeeScName,
          isPaid,
        },
        optimisticResponse: () => ({
          __typename: 'Mutation',
          markCrewSharePaid: {
            ...(crewShare as CrewShare),
            state: isPaid,
          },
        }),
      }).then()
    },
    createScoutingFind: (newFind: ScoutingFind) => {
      // Assign a temp ID
      newFind.scoutingFindId = 'SFUPL_' + (Math.random() * 1000).toFixed(0)

      const destructured = scoutingFindDestructured(newFind)

      return createScoutngFindMutation[0]({
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
      }).then()
    },
  }
}
