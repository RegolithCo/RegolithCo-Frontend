import * as React from 'react'
import { TopBar } from './TopBar'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '../hooks/useOAuth2'

export const TopBarContainer: React.FC = () => {
  const userCtx = useLogin()
  const navigate = useNavigate()
  return <TopBar userCtx={userCtx} navigate={navigate} />
}
