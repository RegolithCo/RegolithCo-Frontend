import {
  ActivityEnum,
  CrewHierarchy,
  CrewShare,
  DestructuredSettings,
  PendingUser,
  MiningLoadout,
  ScoutingFind,
  ScoutingFindTypeEnum,
  Session,
  SessionInput,
  SessionUser,
  SessionUserInput,
  UserProfile,
  VerifiedUserLookup,
  WorkOrder,
  UserSuggest,
  SessionRoleEnum,
  ShipRoleEnum,
  PendingUserInput,
} from '@regolithco/common'
import { createContext } from 'react'
import log from 'loglevel'
import { ScoutingFindTypenames, WorkOrderTypenames } from '../types'

type ObjectValues<T> = T[keyof T]
export const DialogEnum = {
  SHARE_SESSION: 'SHARE_SESSION',
  COLLABORATE: 'COLLABORATE',
  ADD_WORKORDER: 'ADD_WORKORDER',
  LEAVE_SESSION: 'LEAVE_SESSION',
  DELETE_SESSION: 'DELETE_SESSION',
  CLOSE_SESSION: 'CLOSE_SESSION',
  DOWNLOAD_SESSION: 'DOWNLOAD_SESSION',
  LOADOUT_MODAL: 'LOADOUT_MODAL',
  ADD_SCOUTING: 'ADD_SCOUTING',
  SESSION_PREFERENCES: 'SESSION_PREFERENCES',
  ADD_FRIEND: 'ADD_FRIEND',
  USER_STATUS: 'USER_STATUS',
  DISBAND_CREW: 'DISBAND_CREW',
  PASTE_DETECTED: 'PASTE_DETECTED',
} as const
export type DialogEnum = ObjectValues<typeof DialogEnum>

export const SessionTabs = {
  USERS: 'users',
  DASHBOARD: 'dash',
  WORK_ORDERS: 'work',
  SCOUTING: 'scout',
  SUMMARY: 'summary',
  SETTINGS: 'settings',
  ROLES: 'roles',
} as const
export type SessionTabs = ObjectValues<typeof SessionTabs>

export interface SessionContextType {
  session?: Session
  // Utility for finding out if I'm the leader etc.
  myUserProfile: UserProfile
  mySessionUser: SessionUser

  activeTab: SessionTabs
  setActiveTab: (tab: SessionTabs) => void
  // Utility
  navigate: (path: string) => void

  loading: boolean
  mutating: boolean
  isSessionAdmin: boolean

  verifiedMentionedUsers: VerifiedUserLookup
  addFriend: (username: string) => Promise<void>
  removeFriend: (username: string) => Promise<void>
  userSuggest: UserSuggest

  crewHierarchy: CrewHierarchy
  singleActives: SessionUser[]
  captains: SessionUser[]
  singleInnactives: PendingUser[]
  scoutingAttendanceMap: Map<string, ScoutingFind>

  // User-related modals
  setActiveModal: (modal: DialogEnum | null) => void
  openActiveUserModal: (userId: string) => void
  openPendingUserModal: (scName: string) => void
  openLoadoutModal: (loadout: MiningLoadout) => void

  createNewWorkOrder: (activity: ActivityEnum) => void
  createNewScoutingFind: (scoutingType: ScoutingFindTypeEnum) => void

  // Session
  onCloseSession: () => Promise<unknown>
  onReOpenSession: () => Promise<unknown>
  addSessionMentions: (scNames: string[]) => Promise<void>
  removeSessionMentions: (scNames: string[]) => Promise<void>
  removeSessionCrew: (scName: string) => Promise<void>
  onUpdateSession: (session: SessionInput, settings: DestructuredSettings) => Promise<void>
  resetDefaultSystemSettings: () => Promise<void>
  resetDefaultUserSettings: () => Promise<void>
  leaveSession: () => Promise<void>
  deleteSession: () => Promise<void>

  // For the two modals that take us deeper
  openWorkOrderModal: (workOrderId: string) => void
  openScoutingModal: (scoutinfFindId: string) => void

  // Sessionuser
  updateMySessionUser: (sessionUser: SessionUserInput) => Promise<void>
  updateSessionRole: (userId: string, sessionRole: SessionRoleEnum | null) => Promise<void>
  updateShipRole: (userId: string, shipRole: ShipRoleEnum | null) => Promise<void>
  updateSessionUserCaptain: (userId: string, newCaptainId: string | null) => Promise<void>
  updatePendingUsers: (pendingUsers: PendingUserInput[]) => Promise<void>

  // CrewShares
  markCrewSharePaid: (crewShare: CrewShare, isPaid: boolean) => Promise<void>

  // Work orders
  createWorkOrder: (workOrder: WorkOrder) => Promise<void>
  deleteWorkOrder: (workOrderId: string) => Promise<void>
  updateModalWorkOrder: (newWorkOrder: WorkOrder, setFail?: boolean) => Promise<void>
  setWorkOrderShareId: (workOrderId: string) => void
  failWorkOrder: (reason?: string) => Promise<void>

  // scouting
  createScoutingFind: (scoutingFind: ScoutingFind) => Promise<void>
  updateScoutingFind: (scoutingFind: ScoutingFind) => Promise<void>
  deleteScoutingFind: (scoutingFindId: string, __typename: ScoutingFindTypenames) => Promise<void>
  joinScoutingFind: (findId: string, enRoute: boolean) => Promise<void>
  setScoutingFindShareId: (findId: string) => void
  leaveScoutingFind: (findId: string) => Promise<void>
}

const notAvailable =
  (name: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any) => {
    log.error(`${name} not available in session context`, args)
  }
const notAvailablePromise =
  (name: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any) => {
    log.error(`${name} not available in session context`, args)
    return Promise.resolve()
  }

export const sessionContextDefault: SessionContextType = {
  mySessionUser: {} as SessionUser,
  myUserProfile: {} as UserProfile,

  navigate: notAvailable('navigate'),

  loading: false,
  mutating: false,
  isSessionAdmin: false,

  userSuggest: {},

  activeTab: SessionTabs.DASHBOARD,
  setActiveTab: notAvailable('setActiveTab'),

  createNewWorkOrder: notAvailablePromise('createNewWorkOrder'),
  createNewScoutingFind: notAvailablePromise('createNewScoutingFind'),

  verifiedMentionedUsers: {},

  crewHierarchy: {},
  singleActives: [],
  captains: [],
  singleInnactives: [],
  scoutingAttendanceMap: new Map(),

  addFriend: notAvailablePromise('addFriend'),
  removeFriend: notAvailablePromise('removeFriend'),

  onCloseSession: notAvailablePromise('onCloseSession'),
  onReOpenSession: notAvailablePromise('onReOpenSession'),
  addSessionMentions: notAvailablePromise('addSessionMentions'),
  removeSessionMentions: notAvailablePromise('removeSessionMentions'),
  removeSessionCrew: notAvailablePromise('removeSessionCrew'),
  onUpdateSession: notAvailablePromise('onUpdateSession'),
  resetDefaultSystemSettings: notAvailablePromise('resetDefaultSystemSettings'),
  resetDefaultUserSettings: notAvailablePromise('resetDefaultUserSettings'),
  leaveSession: notAvailablePromise('leaveSession'),
  deleteSession: notAvailablePromise('deleteSession'),

  setActiveModal: notAvailable('setActiveModal'),

  openWorkOrderModal: notAvailable('openWorkOrderModal'),
  openScoutingModal: notAvailable('openScoutingModal'),

  updateMySessionUser: notAvailablePromise('updateSessionUser'),
  updateSessionRole: notAvailablePromise('updateSessionRole'),
  updateShipRole: notAvailablePromise('updateShipRole'),
  updateSessionUserCaptain: notAvailablePromise('updateSessionUserCaptain'),
  updatePendingUsers: notAvailablePromise('updatePendingUsers'),

  markCrewSharePaid: notAvailablePromise('markCrewSharePaid'),

  createWorkOrder: notAvailablePromise('createWorkOrder'),
  deleteWorkOrder: notAvailablePromise('deleteWorkOrder'),
  updateModalWorkOrder: notAvailablePromise('updateWorkOrder'),
  setWorkOrderShareId: notAvailablePromise('setWorkOrderShareId'),
  failWorkOrder: notAvailablePromise('failWorkOrder'),

  createScoutingFind: notAvailablePromise('createScoutingFind'),
  updateScoutingFind: notAvailablePromise('updateScoutingFind'),
  deleteScoutingFind: notAvailablePromise('deleteScoutingFind'),
  setScoutingFindShareId: notAvailablePromise('setScoutingFindShareId'),
  joinScoutingFind: notAvailablePromise('joinScoutingFind'),
  leaveScoutingFind: notAvailablePromise('leaveScoutingFind'),

  // For the session view
  openActiveUserModal: notAvailable('openUserModal'),
  openPendingUserModal: notAvailable('openUserModal'),
  openLoadoutModal: notAvailable('openLoadoutModal'),
}

export const SessionContext = createContext<SessionContextType>(sessionContextDefault)
