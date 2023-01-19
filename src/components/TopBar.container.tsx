import * as React from 'react'
import { useLogin } from '../hooks/useLogin'
import { TopBar } from './TopBar'
import { useNavigate } from 'react-router-dom'

export const TopBarContainer: React.FC = () => {
  const userCtx = useLogin()
  const navigate = useNavigate()

  React.useEffect(() => {
    // This is the flipside of the redirect code in useLogin
    const redirect = localStorage.getItem('redirect')
    if (redirect) {
      localStorage.removeItem('redirect')
      navigate(redirect, {
        replace: true,
      })
    }
  }, [navigate])

  return <TopBar userCtx={userCtx} navigate={navigate} />
}
