import React, { useContext } from 'react'
import { Button } from '@mui/material'
import { Login } from '@mui/icons-material'
import { LoginContext } from '../context/auth.context'

export interface LoginButtonProps {
  newLoginRedirect?: string
}

export const LoginButton: React.FC<LoginButtonProps> = ({ newLoginRedirect }) => {
  const { setPopupOpen } = useContext(LoginContext)

  return (
    <Button
      onClick={() => setPopupOpen(newLoginRedirect)}
      variant="contained"
      color="primary"
      size="large"
      startIcon={<Login />}
    >
      Login
    </Button>
  )
}
