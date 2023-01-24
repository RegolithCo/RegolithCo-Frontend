import * as React from 'react'
import { TopBar } from './TopBar'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import { useLogin } from '../hooks/useOAuth2'

export const TopBarContainer: React.FC = () => {
  const userCtx = useLogin()
  const navigate = useNavigate()
  const [postLoginRedirect, setPostLoginRedirect] = useLocalStorage<string | null>('ROCP_PostLoginRedirect', null)

  // React.useEffect(() => {
  //   // This is the flipside of the redirect code in useLogin
  //   if (postLoginRedirect) {
  //     setPostLoginRedirect(null)
  //     navigate(postLoginRedirect, {
  //       replace: true,
  //     })
  //   }
  // }, [navigate])

  return <TopBar userCtx={userCtx} navigate={navigate} />
}
