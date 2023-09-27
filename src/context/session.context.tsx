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
} from '@regolithco/common'
import { createContext } from 'react'

type ObjectValues<T> = T[keyof T]
export const DialogEnum = {
  SHARE_SESSION: 'SHARE_SESSION',
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
} as const
export type DialogEnum = ObjectValues<typeof DialogEnum>

export const SessionTabs = {
  USERS: 'users',
  DASHBOARD: 'dash',
  WORK_ORDERS: 'work',
  SCOUTING: 'scout',
  SUMMARY: 'summary',
  SETTINGS: 'settings',
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
  // The
  verifiedMentionedUsers: VerifiedUserLookup
  addFriend: (username: string) => void
  removeFriend: (username: string) => void
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
  onCloseSession: () => void
  addSessionMentions: (scNames: string[]) => void
  removeSessionMentions: (scNames: string[]) => void
  removeSessionCrew: (scName: string) => void
  onUpdateSession: (session: SessionInput, settings: DestructuredSettings) => void
  resetDefaultSystemSettings: () => void
  resetDefaultUserSettings: () => void
  leaveSession: () => void
  deleteSession: () => void

  // For the two modals that take us deeper
  openWorkOrderModal: (workOrderId: string) => void
  openScoutingModal: (scoutinfFindId: string) => void

  // Sessionuser
  updateMySessionUser: (sessionUser: SessionUserInput) => void
  updateSessionUserCaptain: (userId: string, newCaptainId: string | null) => void
  updatePendingUserCaptain: (scName: string, newCaptainId: string | null) => void

  // CrewShares
  markCrewSharePaid: (crewShare: CrewShare, isPaid: boolean) => void

  // Work orders
  createWorkOrder: (workOrder: WorkOrder) => void
  deleteWorkOrder: (workOrderId: string) => void
  updateWorkOrder: (newWorkOrder: WorkOrder, setFail?: boolean) => void
  failWorkOrder: (reason?: string) => void

  // scouting
  createScoutingFind: (scoutingFind: ScoutingFind) => void
  updateScoutingFind: (scoutingFind: ScoutingFind) => void
  deleteScoutingFind: (scoutingFindId: string) => void
  joinScoutingFind: (findId: string, enRoute: boolean) => void
  leaveScoutingFind: (findId: string) => void
}

const notAvailable =
  (name: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any) => {
    console.log(`${name} not available in session context`, args)
  }

export const sessionContextDefault: SessionContextType = {
  mySessionUser: {} as SessionUser,
  myUserProfile: {} as UserProfile,

  navigate: notAvailable('navigate'),

  loading: false,
  mutating: false,
  userSuggest: {},

  activeTab: SessionTabs.DASHBOARD,
  setActiveTab: notAvailable('setActiveTab'),

  createNewWorkOrder: notAvailable('createNewWorkOrder'),
  createNewScoutingFind: notAvailable('createNewScoutingFind'),

  verifiedMentionedUsers: {},

  crewHierarchy: {},
  singleActives: [],
  captains: [],
  singleInnactives: [],
  scoutingAttendanceMap: new Map(),

  addFriend: notAvailable('addFriend'),
  removeFriend: notAvailable('removeFriend'),

  onCloseSession: notAvailable('onCloseSession'),
  addSessionMentions: notAvailable('addSessionMentions'),
  removeSessionMentions: notAvailable('removeSessionMentions'),
  removeSessionCrew: notAvailable('removeSessionCrew'),
  onUpdateSession: notAvailable('onUpdateSession'),
  resetDefaultSystemSettings: notAvailable('resetDefaultSystemSettings'),
  resetDefaultUserSettings: notAvailable('resetDefaultUserSettings'),
  leaveSession: notAvailable('leaveSession'),
  deleteSession: notAvailable('deleteSession'),

  setActiveModal: notAvailable('setActiveModal'),

  openWorkOrderModal: notAvailable('openWorkOrderModal'),
  openScoutingModal: notAvailable('openScoutingModal'),

  updateMySessionUser: notAvailable('updateSessionUser'),
  updateSessionUserCaptain: notAvailable('updateSessionUserCaptain'),
  updatePendingUserCaptain: notAvailable('updatePendingUserCaptain'),

  markCrewSharePaid: notAvailable('markCrewSharePaid'),

  createWorkOrder: notAvailable('createWorkOrder'),
  deleteWorkOrder: notAvailable('deleteWorkOrder'),
  updateWorkOrder: notAvailable('updateWorkOrder'),
  failWorkOrder: notAvailable('failWorkOrder'),

  createScoutingFind: notAvailable('createScoutingFind'),
  updateScoutingFind: notAvailable('updateScoutingFind'),
  deleteScoutingFind: notAvailable('deleteScoutingFind'),
  joinScoutingFind: notAvailable('joinScoutingFind'),
  leaveScoutingFind: notAvailable('leaveScoutingFind'),

  // For the session view
  openActiveUserModal: notAvailable('openUserModal'),
  openPendingUserModal: notAvailable('openUserModal'),
  openLoadoutModal: notAvailable('openLoadoutModal'),
}

export const SessionContext = createContext<SessionContextType>(sessionContextDefault)
