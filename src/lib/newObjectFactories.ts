import {
  ActivityEnum,
  CrewShare,
  Maybe,
  OtherOrder,
  RefineryEnum,
  RefineryMethodEnum,
  SalvageFind,
  SalvageOrder,
  SalvageOreEnum,
  ScoutingFind,
  ScoutingFindStateEnum,
  ScoutingFindTypeEnum,
  Session,
  SessionStateEnum,
  SessionUser,
  SessionUserStateEnum,
  ShareTypeEnum,
  ShipClusterFind,
  ShipMiningOrder,
  User,
  UserProfile,
  UserStateEnum,
  VehicleClusterFind,
  VehicleMiningOrder,
  WorkOrder,
  WorkOrderDefaults,
  WorkOrderStateEnum,
} from '@regolithco/common'

export function profile2User(profile: UserProfile): User {
  const { createdAt, updatedAt, userId, scName, state } = profile
  return { createdAt, updatedAt, userId, scName, state, __typename: 'User' }
}

export function dummySession(owner: UserProfile): Session {
  return {
    sessionId: 'NEWSESSION', // This is a placeholder. it will never be committed
    ownerId: owner.userId,
    owner: profile2User(owner),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    // finishedAt: null
    state: SessionStateEnum.Active,
    name: 'New Session',
    // note: '',

    sessionSettings: {
      // activity,
      allowUnverifiedUsers: true,
      specifyUsers: false,
      // gravityWell
      // location
      lockedFields: [],
      ...owner.sessionSettings,
    },
    mentionedUsers: [],
    __typename: 'Session',
  }
}

/**
 * Pick the first non-undefined value
 * @param cascade
 * @returns
 */
export function booleanDefault(cascade: (Maybe<boolean> | undefined)[]): boolean | undefined {
  for (const value of cascade) {
    if (typeof value !== 'undefined' && value !== null) {
      return value
    }
  }
  return undefined
}

export function myDefaultCrewShare(sessionId: string, scName: string): CrewShare {
  return {
    orderId: 'NEWWORKORDER', // This is a placeholder. it will never be committed
    scName: scName,
    sessionId: sessionId,
    shareType: ShareTypeEnum.Share,
    share: 1,
    // note
    state: true,

    createdAt: Date.now(),
    updatedAt: Date.now(),
    __typename: 'CrewShare',
  }
}

export function newWorkOrderMaker(session: Session, owner: UserProfile, activityType: ActivityEnum): WorkOrder {
  const defaults: WorkOrderDefaults = session.sessionSettings?.workOrderDefaults ||
    owner.sessionSettings.workOrderDefaults || {
      __typename: 'WorkOrderDefaults',
    }

  // Convenience typings
  const defaultCrewShares: CrewShare[] = defaults.crewShares
    ? defaults.crewShares.map(({ scName, share, shareType, note }) => ({
        createdAt: Date.now(),
        updatedAt: Date.now(),
        orderId: 'NEWWORKORDER', // This is a placeholder. it will never be committed
        sessionId: session.sessionId,
        state: false,
        scName,
        share,
        shareType,
        note,
        __typename: 'CrewShare',
      }))
    : []

  const crewShares = [...defaultCrewShares]
  // Push a default crewShare for me if there isn't one already
  if (!crewShares.some((cs) => cs.scName === owner.scName)) {
    crewShares.push(myDefaultCrewShare(session.sessionId, owner.scName))
  }

  const workOrderFields: Partial<WorkOrder> = {
    sessionId: session.sessionId,
    orderId: 'NEWWORKORDER', // This is a placeholder. it will never be committed
    createdAt: Date.now(),
    updatedAt: Date.now(),
    orderType: activityType,
    ownerId: owner.userId,
    owner: profile2User(owner),
    // note: defaults.note,

    shipOres: undefined,
    vehicleOres: undefined,
    salvageOres: undefined,
    refinery: undefined,
    method: undefined,
    isRefined: undefined,
    failReason: undefined,
    shareRefinedValue: undefined,
    processStartTime: undefined,
    processDurationS: undefined,
    shareAmount: undefined,

    // Cascading fallback of options
    includeTransferFee: booleanDefault([defaults.includeTransferFee, true]),
    crewShares,

    state: WorkOrderStateEnum.Unknown,
  }
  const isRefined = booleanDefault([defaults?.isRefined, true])
  switch (activityType) {
    case ActivityEnum.ShipMining:
      return {
        ...(workOrderFields as ShipMiningOrder),
        shipOres:
          defaults.shipOres?.map((ore) => ({
            ore,
            amt: 0,
            __typename: 'RefineryRow',
          })) || [],
        refinery: defaults.refinery || RefineryEnum.Arcl1,
        method: defaults.method || RefineryMethodEnum.DinyxSolventation,
        isRefined,
        shareRefinedValue: booleanDefault([defaults.shareRefinedValue, true]),
      }
    case ActivityEnum.VehicleMining:
      return {
        ...(workOrderFields as VehicleMiningOrder),
        vehicleOres:
          defaults.vehicleOres?.map((ore) => ({
            ore,
            amt: 0,
            __typename: 'VehicleMiningRow',
          })) || [],
      }
    case ActivityEnum.Salvage:
      return {
        ...(workOrderFields as SalvageOrder),
        salvageOres:
          defaults.salvageOres && defaults.salvageOres.length > 0
            ? defaults.salvageOres?.map((ore) => ({
                ore,
                amt: 0,
                __typename: 'SalvageRow',
              }))
            : [{ amt: 0, ore: SalvageOreEnum.Rmc, __typename: 'SalvageRow' }],
      }
    case ActivityEnum.Other:
      return {
        ...(workOrderFields as OtherOrder),
        shareAmount: 10000,
      }
    default:
      throw new Error(`Unknown order type: ${activityType}`)
  }
}

export function newEmptyScoutingFind(
  session: Session,
  sessUser: SessionUser,
  scoutingType: ScoutingFindTypeEnum
): ScoutingFind {
  const baseObj: Partial<ScoutingFind> = {
    sessionId: session.sessionId,
    scoutingFindId: 'NEWSCOUTINGFIND', // This is a placeholder. it will never be committed
    createdAt: Date.now(),
    updatedAt: Date.now(),
    clusterType: scoutingType,

    ownerId: sessUser.owner?.userId,
    owner: sessUser.owner,
    // note:
    state: ScoutingFindStateEnum.Discovered,
    attendanceIds: [sessUser.owner?.userId as string],
    attendance: [],
  }

  switch (scoutingType) {
    case ScoutingFindTypeEnum.Ship:
      return {
        ...(baseObj as ShipClusterFind),
        shipRocks: [],
      }
    case ScoutingFindTypeEnum.Vehicle:
      return {
        ...(baseObj as VehicleClusterFind),
        vehicleRocks: [],
      }
    case ScoutingFindTypeEnum.Salvage:
      return {
        ...(baseObj as SalvageFind),
        wrecks: [],
      }
    default:
      throw new Error(`Unknown scouting type: ${scoutingType}`)
  }
}

export function dummyUserProfile(): UserProfile {
  return {
    userId: 'DUMMYUSER',
    scName: 'YOU',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    friends: [],
    sessionSettings: {
      __typename: 'SessionSettings',
    },
    state: UserStateEnum.Unverified,
    __typename: 'UserProfile',
  }
}

export function newUserProfile(scName: string): UserProfile {
  return {
    userId: 'UNIMPORTANT', // never submitted
    scName,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    friends: [],
    sessionSettings: {
      __typename: 'SessionSettings',
    },
    state: UserStateEnum.Unverified,
    __typename: 'UserProfile',
  }
}

export function dummySessionUser(owner: UserProfile): SessionUser {
  const { createdAt, scName, state, updatedAt, userId } = owner
  return {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    state: SessionUserStateEnum.OnSite,
    isPilot: true,
    sessionId: 'DUMMYSESSION',
    ownerId: owner.userId,
    owner: {
      createdAt,
      scName,
      state,
      updatedAt,
      userId,
      __typename: 'User',
    },
    __typename: 'SessionUser',
  }
}
