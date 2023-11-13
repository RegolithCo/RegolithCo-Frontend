import { CrewShare, UserSuggest, WorkOrder, WorkOrderDefaults } from '@regolithco/common'
import { createContext } from 'react'

export interface WorkOrderContextType {
  workOrder: WorkOrder
  onUpdate: (workOrder: WorkOrder, setFail?: boolean) => void
  deleteWorkOrder?: () => void
  markCrewSharePaid: (crewShare: CrewShare, isPaid: boolean) => void
  failWorkOrder?: (reason?: string) => void
  allowEdit?: boolean
  allowPay?: boolean
  isMine?: boolean
  isSessionActive?: boolean
  templateJob?: WorkOrderDefaults
  forceTemplate?: boolean
  userSuggest?: UserSuggest
  isNew?: boolean
}

const notAvailable = (name: string) => () => {
  console.log(`${name} not available in session context`)
}

export const workOrderContextDefaults: WorkOrderContextType = {
  workOrder: {} as WorkOrder,
  onUpdate: notAvailable('onUpdate'),
  deleteWorkOrder: notAvailable('deleteWorkOrder'),
  markCrewSharePaid: notAvailable('markCrewSharePaid'),
  failWorkOrder: notAvailable('failWorkOrder'),
  allowEdit: false,
  allowPay: false,
  isMine: true,
  isSessionActive: false,
  templateJob: {} as WorkOrderDefaults,
  forceTemplate: false,
  userSuggest: {} as UserSuggest,
  isNew: false,
}

export const WorkOrderContext = createContext<WorkOrderContextType>(workOrderContextDefaults)
