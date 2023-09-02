import {
  ActivityEnum,
  CrewHierarchy,
  CrewShare,
  DestructuredSettings,
  InnactiveUser,
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
} from '@regolithco/common'
import { noop } from 'lodash'
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
  session: Session
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

  crewHierarchy: CrewHierarchy
  singleActives: SessionUser[]
  captains: SessionUser[]
  singleInnactives: InnactiveUser[]
  scoutingAttendanceMap: Map<string, ScoutingFind>

  // User-related modals
  setActiveModal: (modal: DialogEnum | null) => void
  openActiveUserModal: (userId: string) => void
  openInnactiveUserModal: (scName: string) => void
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
  updateSessionUser: (sessionUser: SessionUserInput) => void
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

const notAvailable = (name: string) => () => {
  console.log(`${name} not available in session context`)
}

export const sessionContextDefault: SessionContextType = {
  session: {} as Session,
  mySessionUser: {} as SessionUser,
  myUserProfile: {} as UserProfile,

  navigate: notAvailable('navigate'),

  loading: false,
  mutating: false,

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

  updateSessionUser: notAvailable('updateSessionUser'),
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
  openInnactiveUserModal: notAvailable('openUserModal'),
  openLoadoutModal: notAvailable('openLoadoutModal'),
}

export const SessionContext = createContext<SessionContextType>(sessionContextDefault)
