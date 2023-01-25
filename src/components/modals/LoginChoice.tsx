import { Google } from '@mui/icons-material'
import { Alert, Box, Button, Modal, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material'
import { AuthTypeEnum } from '@regolithco/common'
import * as React from 'react'
import { DiscordIcon } from '../../icons/Discord'

export type LoginChoiceProps = {
  open?: boolean
  onClose: () => void
  authType: AuthTypeEnum
  setAuthType: (authType: AuthTypeEnum) => void
  login: () => void
}

export const LoginChoice: React.FC<LoginChoiceProps> = ({ open, onClose, authType, setAuthType, login }) => {
  const theme = useTheme()
  return (
    <Modal open={Boolean(open)} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 10,
          border: `10px solid ${theme.palette.primary.dark}`,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Please choose an authentication method:
        </Typography>
        <ToggleButtonGroup
          size="small"
          value={authType}
          sx={{
            width: '100%',
            my: 4,
            '& .MuiToggleButton-root': {
              flexGrow: 1,
              p: 2,
            },
            '& .MuiToggleButton-root.Mui-selected:hover': {
              color: theme.palette.primary.contrastText,
              boxShadow: `1px 1px 15px 5px ${theme.palette.primary.light}`,
              background: theme.palette.primary.light,
            },
            '& .MuiToggleButton-root.Mui-selected': {
              // border: '1px solid red',
              color: theme.palette.primary.contrastText,
              boxShadow: `1px 1px 10px 2px ${theme.palette.primary.light}`,
              background: theme.palette.primary.main,
            },
            '& svg': {
              mr: 1,
            },
          }}
          aria-label="Small sizes"
          exclusive
          onChange={(e, value) => {
            if (value) {
              setAuthType(value)
            }
          }}
        >
          <ToggleButton value={AuthTypeEnum.DISCORD} aria-label="left aligned">
            <DiscordIcon /> Discord
          </ToggleButton>
          <ToggleButton value={AuthTypeEnum.GOOGLE} aria-label="centered">
            <Google /> Google
          </ToggleButton>
        </ToggleButtonGroup>

        <Button
          variant="contained"
          sx={{
            my: 4,
          }}
          onClick={() => login()}
          size="large"
          fullWidth
          startIcon={authType === AuthTypeEnum.GOOGLE ? <Google /> : <DiscordIcon />}
        >
          Login with {authType === AuthTypeEnum.GOOGLE ? 'Google' : 'Discord'}
        </Button>

        <Alert severity="info">
          <Typography variant="body2" paragraph>
            We use Discord and Google to authenticate you. We do not store any of your personal information.
          </Typography>
          <Typography variant="body2" paragraph>
            Each method will create a separate account so please be consistent with which one you choose (unless you
            want multiple accounts).
          </Typography>
        </Alert>
      </Box>
    </Modal>
  )
}
