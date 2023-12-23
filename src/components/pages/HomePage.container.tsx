import { StatsObjectSummary } from '@regolithco/common'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { useLogin } from '../../hooks/useOAuth2'
import { HomePage } from './HomePage'
import dayjs from 'dayjs'
import log from 'loglevel'

export const HomePageContainer: React.FC = () => {
  const userCtx = useLogin()
  const navigate = useNavigate()
  const [stats, setStats] = React.useState<Partial<StatsObjectSummary>>({})
  const [statsLoading, setStatsLoading] = React.useState<Record<keyof StatsObjectSummary, boolean>>({
    daily: true,
    monthly: true,
    yearly: true,
    total: true,
  })

  React.useEffect(() => {
    // Loop over all the possible keys of StatsObjectSummary and fetch them
    // Suffix the URL with query params of ?cachebust=YYYY-MM-DD-HH
    const dateSuffix = dayjs().format('YYYY-MM-DD-HH')

    for (const key of ['daily', 'monthly', 'yearly', 'total']) {
      axios
        .get(`/stats/${key}.json?cachebust=${dateSuffix}`)
        .then((response) => {
          //Set the data to the state
          setStats((stats) => ({ ...(stats || {}), [key as keyof StatsObjectSummary]: response.data }))
          //Set the loading to false
          setStatsLoading((statsLoading) => ({ ...statsLoading, [key as keyof StatsObjectSummary]: false }))
        })
        .catch((error) => {
          //If there is an error, log it. DO NOT FAIL
          log.error(error)
          //Set the loading to false
          setStatsLoading((statsLoading) => ({ ...statsLoading, [key as keyof StatsObjectSummary]: false }))
        })
    }
  }, [])

  return <HomePage userCtx={userCtx} navigate={navigate} stats={stats} statsLoading={statsLoading} />
}
