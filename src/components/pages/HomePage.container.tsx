import { StatsObject } from '@regolithco/common'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { useLogin } from '../../hooks/useOAuth2'
import { HomePage } from './HomePage'

export const HomePageContainer: React.FC = () => {
  const userCtx = useLogin()
  const navigate = useNavigate()
  const [stats, setStats] = React.useState<StatsObject>()
  const [statsLoading, setStatsLoading] = React.useState(true)

  React.useEffect(() => {
    //Use axios to load a local json file named /stats.json
    axios
      .get('/stats.json')
      .then((response) => {
        //Set the data to the state
        setStats(response.data)
        setStatsLoading(false)
      })
      .catch((error) => {
        //If there is an error, log it. DO NOT FAIL
        console.log(error)
        setStats(undefined)
        setStatsLoading(false)
      })
  }, [])

  return <HomePage userCtx={userCtx} navigate={navigate} stats={stats} statsLoading={statsLoading} />
}
