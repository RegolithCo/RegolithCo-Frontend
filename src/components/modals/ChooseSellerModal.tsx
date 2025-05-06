import * as React from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { UserPicker } from '../fields/UserPicker'
import { UserSuggest, validateSCName } from '@regolithco/common'

export interface ChooseSellerModalProps {
  scName: string
  open: boolean
  disableList?: string[]
  onClose: () => void
  onChange: (newScName: string) => void
  userSuggest?: UserSuggest
}

export const ChooseSellerModal: React.FC<ChooseSellerModalProps> = ({
  scName,
  open,
  disableList,
  userSuggest,
  onClose,
  onChange,
}) => {
  const [newScName, setNewScName] = React.useState<string | null>(null)
  const [valid, setValid] = React.useState<boolean>(false)

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Choose Seller</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          This is whoever is selling the assets. This is the person who is responsible for payouts. It defaults to the
          person who created the work order.
        </Typography>
        <UserPicker
          label="Choose the Seller"
          initialValue={scName}
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
