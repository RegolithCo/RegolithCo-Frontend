import { Google } from '@mui/icons-material'
import { Alert, Box, Button, List, ListItem, Modal, Typography, useTheme } from '@mui/material'
import { AuthTypeEnum } from '@regolithco/common'
import * as React from 'react'
import { DiscordIcon } from '../../icons/Discord'

export type LoginChoiceProps = {
  open?: boolean
  onClose: () => void
  onClick: (authType: AuthTypeEnum) => void
}

export const LoginChoice: React.FC<LoginChoiceProps> = ({ open, onClose, onClick }) => {
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
        <List>
          <ListItem>
            <Button
              variant="contained"
              onClick={() => onClick(AuthTypeEnum.DISCORD)}
              size="large"
              fullWidth
              startIcon={<DiscordIcon />}
            >
              Login with Discord
            </Button>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              onClick={() => onClick(AuthTypeEnum.GOOGLE)}
              size="large"
              fullWidth
              startIcon={<Google />}
            >
              Login with Google
            </Button>
          </ListItem>
        </List>
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
