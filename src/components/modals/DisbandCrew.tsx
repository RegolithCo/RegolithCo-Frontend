import React from 'react'
import { SessionContext } from '../../context/session.context'
import { DeleteModal } from './DeleteModal'

export interface DisbandModalProps {
  open: boolean
  onClose: () => void
}

export const DisbandModal: React.FC<DisbandModalProps> = ({ open, onClose }) => {
  const { mySessionUser, crewHierarchy, updateSessionUserCaptain, updatePendingUserCaptain } =
    React.useContext(SessionContext)
  return (
    <DeleteModal
      open={open}
      title="Disband Crew?"
      confirmBtnText="Yes.Disband Crew"
      onConfirm={() => {
        //
        if (crewHierarchy[mySessionUser.ownerId] && crewHierarchy[mySessionUser.ownerId].activeIds) {
          Promise.allSettled(
            crewHierarchy[mySessionUser.ownerId].activeIds.map((id) => updateSessionUserCaptain(id, null))
          ).then(onClose)
        }
        if (crewHierarchy[mySessionUser.ownerId] && crewHierarchy[mySessionUser.ownerId].innactiveSCNames) {
          Promise.allSettled(
            crewHierarchy[mySessionUser.ownerId].innactiveSCNames.map((scName) =>
              updatePendingUserCaptain(scName, null)
            )
          ).then(onClose)
        }
      }}
      message="Are you sure you want to disband your crew? Crew members will remain in the session but will go back to being individual pilots."
      onClose={onClose}
    />
  )
}
