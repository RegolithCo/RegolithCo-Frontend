import { Google } from '@mui/icons-material'
import { Alert, Box, Button, Dialog, Stack, Typography, useTheme } from '@mui/material'
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
    <Dialog open={Boolean(open)} onClose={onClose} maxWidth="xs" fullWidth>
      <Box
        sx={{
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

        <Stack
          spacing={2}
          sx={{
            my: 4,
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              setAuthType(AuthTypeEnum.Discord)
              onClose()
            }}
            size="large"
            fullWidth
            startIcon={<DiscordIcon />}
          >
            Discord
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setAuthType(AuthTypeEnum.Google)
              onClose()
            }}
            size="large"
            fullWidth
            startIcon={<Google />}
          >
            Google
          </Button>
        </Stack>
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
    </Dialog>
  )
}
