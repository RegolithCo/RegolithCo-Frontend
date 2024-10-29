import { ScoutingFind, SessionUser } from '@regolithco/common'
import { createContext } from 'react'
import log from 'loglevel'

export interface ScoutingFindContextType {
  scoutingFind: ScoutingFind
  meUser: SessionUser
  onChange: (scoutingFind: ScoutingFind) => void
  onDelete?: () => void
  joinScoutingFind?: (findId: string, enRoute: boolean) => void
  leaveScoutingFind?: (findId: string) => void
  allowEdit?: boolean
  allowDelete?: boolean
  isNew?: boolean
  pastedImgUrl?: string | null
  setPastedImgUrl?: (imgUrl: string | null) => void
}

const notAvailable = (name: string) => () => {
  log.error(`${name} not available in session context`)
}

export const scoutingFindContextDefault: ScoutingFindContextType = {
  scoutingFind: {} as ScoutingFind,
  meUser: {} as SessionUser,
  onChange: notAvailable('onChange'),
  onDelete: notAvailable('onDelete'),
  joinScoutingFind: notAvailable('joinScoutingFind'),
  leaveScoutingFind: notAvailable('leaveScoutingFind'),
  allowEdit: false,
  allowDelete: false,
  isNew: false,
}

export const ScoutingFindContext = createContext<ScoutingFindContextType>(scoutingFindContextDefault)
