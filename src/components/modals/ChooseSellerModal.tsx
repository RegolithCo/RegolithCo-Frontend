import * as React from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { UserPicker } from '../fields/UserPicker'
import { UserSuggest, validateSCName } from '@regolithco/common'

export interface ChooseSellerModalProps {
  open: boolean
  disableList?: string[]
  onClose: () => void
  onChange: (newValue: string) => void
  userSuggest?: UserSuggest
}

export const ChooseSellerModal: React.FC<ChooseSellerModalProps> = ({
  open,
  disableList,
  userSuggest,
  onClose,
  onChange,
}) => {
  const [newScName, setNewScName] = React.useState<string | null>(null)
  const [valid, setValid] = React.useState<boolean>(false)

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Choose Seller</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          If you are not the one selling this order you can choose who will be doing the selling. This can be either
          someone who is already in the session, a friend or just a valid SC username. If the user then joins the
          session they will have permissions to change it and the ability to "claim" the work order.
        </Typography>
        <UserPicker
          label="Choose the Seller"
          toolTip="If the seller is not you then choose who will do the selling."
          onChange={(newScName: string) => {
            const valid = validateSCName(newScName as string)
            if (valid) {
              setValid(true)
              setNewScName(newScName)
              onChange && onChange(newScName as string)
              setTimeout(onClose, 200)
            } else {
              setValid(false)
              setNewScName(null)
            }
          }}
          userSuggest={userSuggest}
          includeFriends
          includeMentioned
          disableList={disableList || []}
        />
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          disabled={!newScName || newScName.length < 1 || !valid}
          onClick={() => {
            onChange && onChange(newScName as string)
            onClose()
          }}
        >
          Choose
        </Button>
      </DialogActions>
    </Dialog>
  )
}
