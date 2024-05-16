import { Google } from '@mui/icons-material'
import { Box, Button, Modal, Typography, useTheme } from '@mui/material'
import { AuthTypeEnum } from '@regolithco/common'
import * as React from 'react'
import { DiscordIcon } from '../../icons/Discord'

export type LoginRefreshProps = {
  open?: boolean
  authType: AuthTypeEnum
  onClose: () => void
  login: () => void
  logOut: () => void
}

export const LoginRefresh: React.FC<LoginRefreshProps> = ({ open, onClose, authType, login, logOut }) => {
  const theme = useTheme()
  return (
    <Modal open={Boolean(open)} disableEscapeKeyDown>
      <Box
        sx={{
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 10,
          border: `10px solid ${theme.palette.primary.main}`,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Your authentication token has expired please refresh it:
        </Typography>

        <Button
          variant="contained"
          sx={{
            my: 4,
          }}
          onClick={() => {
            onClose()
            login()
          }}
          size="large"
          fullWidth
          startIcon={authType === AuthTypeEnum.Google ? <Google /> : <DiscordIcon />}
        >
          Login with {authType === AuthTypeEnum.Google ? 'Google' : 'Discord'}
        </Button>
        <Button
          fullWidth
          onClick={() => {
            onClose()
            logOut()
          }}
        >
          Nah. I'm good. Just log me out.
        </Button>
      </Box>
    </Modal>
  )
}
