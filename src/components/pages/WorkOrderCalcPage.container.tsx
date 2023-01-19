import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '../../hooks/useLogin'
import { WorkOrderCalcPage } from './WorkOrderCalcPage'

export const WorkOrderCalcPageContainer: React.FC = () => {
  const navigate = useNavigate()
  const { userProfile } = useLogin()

  return <WorkOrderCalcPage userProfile={userProfile} />
}
