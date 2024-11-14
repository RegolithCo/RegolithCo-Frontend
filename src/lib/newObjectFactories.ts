import {
  ActiveMiningLaserLoadout,
  ActivityEnum,
  CrewShare,
  DEFAULT_MOLE_LASER,
  DEFAULT_PROSPECTOR_LASER,
  LoadoutShipEnum,
  Maybe,
  MiningLaserEnum,
  MiningLoadout,
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
  CrewHierarchy,
  WorkOrderExpense,
  DataStore,
  UserPlanEnum,
} from '@regolithco/common'

export function profile2User(profile: UserProfile): User {
  const { createdAt, updatedAt, userId, scName, state } = profile
  return { createdAt, updatedAt, userId, scName, state, __typename: 'User' }
}

export function dummySession(owner: UserProfile): Session {
  return {
    sessionId: 'NEWSESSION', // This is a placeholder. it will never be committed
    joinId: 'NEWJOINID',
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
      usersCanAddUsers: true,
      usersCanInviteUsers: true,
      // gravityWell
      // location
      lockedFields: [],
      controlledSessionRole: false,
      controlledShipRole: false,
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

export function defaultCrewShare(
  sessionId: string,
  payeeScName: string,
  isPaid: boolean,
  payeeUserId?: string
): CrewShare {
  return {
    orderId: 'NEWWORKORDER', // This is a placeholder. it will never be committed
    payeeScName,
    payeeUserId,
    sessionId: sessionId,
    shareType: ShareTypeEnum.Share,
    share: 1,
    // note
    state: isPaid,

    createdAt: Date.now(),
    updatedAt: Date.now(),
    __typename: 'CrewShare',
  }
}

export function newWorkOrderMaker(
  session: Session,
  owner: UserProfile,
  activityType: ActivityEnum,
  crewHierarchy?: CrewHierarchy
): WorkOrder {
  const defaults: WorkOrderDefaults = session.sessionSettings?.workOrderDefaults ||
    owner.sessionSettings.workOrderDefaults || {
      __typename: 'WorkOrderDefaults',
    }

  // Convenience typings
  const defaultCrewShares: CrewShare[] = defaults.crewShares
    ? defaults.crewShares.map(({ payeeScName, share, shareType, note }) => {
        // If the payee is a crew member, then we need to look up their userId
        const lookupPayeeId = session.activeMembers?.items.find(
          (su) => su.owner?.scName.toLowerCase() === payeeScName.toLowerCase()
        )
        return {
          ...defaultCrewShare(session.sessionId, payeeScName, false, lookupPayeeId?.ownerId),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          orderId: 'NEWWORKORDER', // This is a placeholder. it will never be committed
          sessionId: session.sessionId,
          state: false,
          payeeScName,
          payeeUserId: lookupPayeeId?.ownerId,
          share,
          shareType,
          note,
          __typename: 'CrewShare',
        }
      })
    : []
  // this is for reference and easy searching
  const defaultCrewScNames = defaultCrewShares.map((cs) => cs.payeeScName)

  const crewHierarchyShares: CrewShare[] = []
  let sellerscName: string | undefined
  let sellerUserId: string | undefined

  // If we're a member of a crew then we need to add our crew as a default
  if (crewHierarchy) {
    // If I'm not the captain of my crew, I need to add a crewShare for my captain
    const mySessionUser = (session.activeMembers?.items || []).find((su) => su.ownerId === owner.userId) as SessionUser
    const myCaptain = mySessionUser.captainId
      ? ((session.activeMembers?.items || []).find((su) => su.ownerId === mySessionUser.captainId) as SessionUser)
      : undefined
    if (myCaptain) {
      sellerscName = myCaptain.owner?.scName
      sellerUserId = myCaptain.owner?.userId
      // Make sure the captain gets a crew share
      // If they are already added through default crew share then just set them paid
      if (defaultCrewScNames.includes(myCaptain.owner?.scName as string)) {
        const found = defaultCrewShares.find((cs) => cs.payeeScName === myCaptain.owner?.scName) as CrewShare
        found.state = true
      }
      // Otherwise add a new row
      else {
        crewHierarchyShares.push(
          defaultCrewShare(session.sessionId, myCaptain.owner?.scName as string, true, myCaptain.owner?.userId)
        )
      }
    }
    const crew = crewHierarchy[myCaptain ? myCaptain.ownerId : mySessionUser.ownerId]
    session.activeMembers?.items.forEach((su) => {
      if (
        crew &&
        crew.activeIds.includes(su.ownerId) && // Active member of my crew
        su.ownerId !== mySessionUser.ownerId && // Not me (I get added later)
        !defaultCrewScNames.includes(su.owner?.scName as string) // not already added as a default share
      ) {
        crewHierarchyShares.push(defaultCrewShare(session.sessionId, su.owner?.scName as string, false, su.ownerId))
      }
    })
    // All the inactive members of the crew get a crew share
    session.mentionedUsers.forEach((mu) => {
      if (
        crew &&
        crew.innactiveSCNames.includes(mu.scName) &&
        !defaultCrewScNames.includes(mu.scName) // not already added as a default share
      ) {
        crewHierarchyShares.push(defaultCrewShare(session.sessionId, mu.scName as string, false))
      }
    })
  }

  const crewShares = [...defaultCrewShares, ...crewHierarchyShares]
  // Push a default crewShare for me if there isn't one already
  // Only set it paid if the seller is not set
  if (!defaultCrewScNames.includes(owner.scName)) {
    crewShares.push(defaultCrewShare(session.sessionId, owner.scName, !sellerscName, owner.userId))
  } else {
    // If I'm already in the default crew shares, then set me paid
    const found = crewShares.find((cs) => cs.payeeScName === owner.scName) as CrewShare
    found.state = true
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
    sellerscName,
    sellerUserId,
    isSold: false,

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

  // TODO: When we get refinery costs back we need to remove this:
  const expenses: WorkOrderExpense[] = []
  if (activityType === ActivityEnum.ShipMining) {
    expenses.push({
      amount: 0,
      name: 'Refinery Fee',
      __typename: 'WorkOrderExpense',
    })
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
            yield: 0,
            __typename: 'RefineryRow',
          })) || [],
        expenses,
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
            : [
                { amt: 0, ore: SalvageOreEnum.Rmc, __typename: 'SalvageRow' },
                { amt: 0, ore: SalvageOreEnum.Cmat, __typename: 'SalvageRow' },
              ],
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
    lastActive: Date.now(),
    plan: UserPlanEnum.Free,
    friends: [],
    loadouts: [],
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
    lastActive: Date.now(),
    plan: UserPlanEnum.Free,
    friends: [],
    loadouts: [],
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

export async function newMiningLoadout(
  ds: DataStore,
  ship: LoadoutShipEnum,
  userProfile: UserProfile
): Promise<MiningLoadout> {
  const activeLasers = await Promise.all(
    ship === LoadoutShipEnum.Mole
      ? [
          newMiningLoadoutActiveLaser(ds, DEFAULT_MOLE_LASER),
          newMiningLoadoutActiveLaser(ds, DEFAULT_MOLE_LASER),
          newMiningLoadoutActiveLaser(ds, DEFAULT_MOLE_LASER),
        ]
      : [newMiningLoadoutActiveLaser(ds, DEFAULT_PROSPECTOR_LASER)]
  )
  return {
    name: 'New Loadout',
    loadoutId: 'NEWLOADOUT',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    owner: profile2User(userProfile),
    ship,
    activeLasers,
    inventoryGadgets: [],
    inventoryLasers: [],
    inventoryModules: [],
    __typename: 'MiningLoadout',
  }
}

export async function newMiningLoadoutActiveLaser(
  ds: DataStore,
  laser: MiningLaserEnum
): Promise<ActiveMiningLaserLoadout> {
  const loadoutLookups = await ds.getLookup('loadout')
  const slots = loadoutLookups.lasers[laser].slots
  return {
    laser,
    laserActive: true,
    modules: Array.from({ length: slots }, () => null),
    modulesActive: Array.from({ length: slots }, () => false),
    __typename: 'ActiveMiningLaserLoadout',
  }
}
