import { ScoutingFind, SessionUser } from '@regolithco/common'
import { createContext } from 'react'

export interface ScoutingFindContextType {
  scoutingFind: ScoutingFind
  meUser: SessionUser
  onChange: (scoutingFind: ScoutingFind) => void
  onDelete?: () => void
  joinScoutingFind?: (findId: string, enRoute: boolean) => void
  leaveScoutingFind?: (findId: string) => void
  allowEdit?: boolean
  allowWork?: boolean
  isNew?: boolean
}

const notAvailable = (name: string) => () => {
  console.log(`${name} not available in session context`)
}

export const scoutingFindContextDefault: ScoutingFindContextType = {
  scoutingFind: {} as ScoutingFind,
  meUser: {} as SessionUser,
  onChange: notAvailable('onChange'),
  onDelete: notAvailable('onDelete'),
  joinScoutingFind: notAvailable('joinScoutingFind'),
  leaveScoutingFind: notAvailable('leaveScoutingFind'),
  allowEdit: false,
  allowWork: false,
  isNew: false,
}

export const ScoutingFindContext = createContext<ScoutingFindContextType>(scoutingFindContextDefault)
