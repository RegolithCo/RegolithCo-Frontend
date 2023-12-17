import * as React from 'react'

import { DeleteModal } from './DeleteModal'

export interface DeleteScoutingFindModalProps {
  open: boolean
  onConfirm: () => void
  onClose: () => void
}

export const DeleteScoutingFindModal: React.FC<DeleteScoutingFindModalProps> = ({ open, onConfirm, onClose }) => {
  // const maxWidth = 500
  return (
    <DeleteModal
      title="Permanently DELETE this scouting find?"
      message="This action cannot be undone. You can also mark a find as abandoned or depleted and then filter those out."
      onClose={onClose}
      open={open}
      onConfirm={onConfirm}
      cancelBtnText="Cancel"
      confirmBtnText="Yes, Delete"
    />
  )
}
