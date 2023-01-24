import React from 'react'
import { Button } from '@mui/material'
import { Login } from '@mui/icons-material'
import { useLogin } from '../hooks/useOAuth2'

export interface LoginButtonProps {
  newLoginRedirect?: string
}

export const LoginButton: React.FC<LoginButtonProps> = ({ newLoginRedirect }) => {
  const loginCtx = useLogin()

  return (
    <Button
      onClick={() => loginCtx.openPopup(newLoginRedirect)}
      variant="contained"
      color="primary"
      size="large"
      startIcon={<Login />}
    >
      Login
    </Button>
  )
}
