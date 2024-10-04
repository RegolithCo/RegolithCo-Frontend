import * as React from 'react'

import { User } from '@regolithco/common'
import { Box, Stack, Typography } from '@mui/material'
import { ConfirmModal } from './ConfirmModal'
import { ConfirmModalState } from '../fields/OwingListItem'
import { AppContext } from '../../context/app.context'
import { UserAvatar } from '../UserAvatar'
import { MValue, MValueFormat } from '../fields/MValue'
import { fontFamilies } from '../../theme'

export interface PayConfirmModalProps {
  payConfirm?: ConfirmModalState
  onClose: () => void
  onConfirm: () => void
}

export const PayConfirmModal: React.FC<PayConfirmModalProps> = ({ onClose, onConfirm, payConfirm }) => {
  const { hideNames, getSafeName } = React.useContext(AppContext)
  return (
    <ConfirmModal
      open={Boolean(payConfirm)}
      title="Mark All Shares Paid?"
      message={
        <>
          <Typography variant="body1" component="div" paragraph>
            Are you sure you want to mark all {payConfirm?.crewShares.length} shares to{' '}
            <strong>{getSafeName(payConfirm?.payeeUserSCName)}</strong> as paid?
          </Typography>
          <Stack spacing={1} direction="row" alignItems="center">
            <Box sx={{ display: 'flex' }}>
              <UserAvatar user={payConfirm?.payeeUser as User} size="small" privacy={hideNames} />
              <Typography
                sx={{
                  lineHeight: 2,
                  fontFamily: fontFamilies.robotoMono,
                  fontWeight: 'bold',
                  px: 1,
                  pt: 0.5,
                  fontSize: '1.1rem',
                }}
              >
                {getSafeName(payConfirm?.payeeUserSCName)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex' }} />
            <MValue
              value={payConfirm?.amt}
              format={MValueFormat.currency}
              typoProps={{
                px: 2,
                fontSize: '1.1rem',
                lineHeight: '2rem',
              }}
            />
          </Stack>
        </>
      }
      onClose={onClose}
      cancelBtnText="No"
      confirmBtnText="Yes!"
      onConfirm={onConfirm}
    />
  )
}
