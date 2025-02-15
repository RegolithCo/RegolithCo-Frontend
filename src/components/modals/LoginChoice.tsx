import { Google } from '@mui/icons-material'
import { Alert, Box, Button, Modal, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material'
import { AuthTypeEnum } from '@regolithco/common'
import * as React from 'react'
import { DiscordIcon } from '../../icons/Discord'
import { LoginContext } from '../../context/auth.context'

export type LoginChoiceProps = {
  open?: boolean
  onClose: () => void
  authType: AuthTypeEnum | null
  setAuthType: (authType: AuthTypeEnum) => void
  login?: () => void
}

export const LoginChoiceContainer: React.FC = () => {
  const { authType, setAuthType, popupOpen, closePopup } = React.useContext(LoginContext)
  return <LoginChoice open={popupOpen} onClose={closePopup} authType={authType} setAuthType={setAuthType} />
}

export const LoginChoice: React.FC<LoginChoiceProps> = ({ open, onClose, authType, setAuthType }) => {
  const theme = useTheme()
  const [btnChoice, setBtnChoice] = React.useState<AuthTypeEnum>(authType || AuthTypeEnum.Discord)
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
          border: `10px solid ${theme.palette.primary.main}`,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Please choose an authentication method:
        </Typography>
        <ToggleButtonGroup
          size="small"
          value={btnChoice}
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
              setBtnChoice(value)
            }
          }}
        >
          <ToggleButton value={AuthTypeEnum.Discord} aria-label="left aligned">
            <DiscordIcon /> Discord
          </ToggleButton>
          <ToggleButton value={AuthTypeEnum.Google} aria-label="centered">
            <Google /> Google
          </ToggleButton>
        </ToggleButtonGroup>

        <Button
          variant="contained"
          sx={{
            my: 4,
          }}
          onClick={() => {
            setAuthType(btnChoice)
            onClose()
          }}
          size="large"
          fullWidth
          startIcon={btnChoice === AuthTypeEnum.Google ? <Google /> : <DiscordIcon />}
        >
          Login with {btnChoice === AuthTypeEnum.Google ? 'Google' : 'Discord'}
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
