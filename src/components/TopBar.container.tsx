import * as React from 'react'
import { TopBar } from './TopBar'
import { useLogin } from '../hooks/useOAuth2'

export const TopBarContainer: React.FC = () => {
  const userCtx = useLogin()
  return <TopBar userCtx={userCtx} />
}
