import React from 'react'
import { Button } from '@mui/material'
import { useLogin } from '../hooks/useLogin'
import { Login } from '@mui/icons-material'

export const LoginButton: React.FC = () => {
  const loginCtx = useLogin()

  return (
    <Button onClick={loginCtx.signIn} variant="contained" color="primary" size="large" startIcon={<Login />}>
      Login
    </Button>
  )
}
