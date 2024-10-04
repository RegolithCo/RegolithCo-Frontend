import { RegolithMonthStats, RegolithAllTimeStats } from '@regolithco/common'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { useLogin } from '../../hooks/useOAuth2'
import { HomePage } from './HomePage'
import dayjs from 'dayjs'
import log from 'loglevel'
import { RegolithAlert } from '../../types'

export const HomePageContainer: React.FC = () => {
  const userCtx = useLogin()
  const navigate = useNavigate()
  const [last30Days, setLast30Days] = React.useState<RegolithMonthStats>()
  const [allTime, setAllTime] = React.useState<RegolithAllTimeStats>()

  const [alerts, setAlerts] = React.useState<RegolithAlert[]>([])

  React.useEffect(() => {
    // Loop over all the possible keys of StatsObjectSummary and fetch them
    // Suffix the URL with query params of ?cachebust=YYYY-MM-DD-HH
    axios
      .get(`/alerts.json`)
      .then((response) => {
        //Set the data to the state
        setAlerts((stats) => response.data as RegolithAlert[])
      })
      .catch((error) => {
        //If there is an error, log it. DO NOT FAIL
        log.error(error)
      })
  }, [])

  React.useEffect(() => {
    // Loop over all the possible keys of StatsObjectSummary and fetch them
    // Suffix the URL with query params of ?cachebust=YYYY-MM-DD-HH
    const dateSuffix = dayjs().format('YYYY-MM-DD-HH')
    Promise.all([
      axios
        .get(`/stats/last30.json?cachebust=${dateSuffix}`)
        .then((response) => {
          const contentType = response.headers['content-type']
          if (contentType && contentType.includes('application/json')) {
            setLast30Days(response.data)
          } else {
            log.error('Invalid content type', response.headers.contentType)
          }
        })
        .catch((error) => log.error(error)),
      axios.get(`/stats/alltime.json?cachebust=${dateSuffix}`).then((response) => {
        const contentType = response.headers['content-type']
        if (contentType && contentType.includes('application/json')) {
          setAllTime(response.data)
        } else {
          log.error('Invalid content type', response.headers.contentType)
        }
      }),
    ])
  }, [])

  return (
    <HomePage
      userCtx={userCtx}
      navigate={navigate}
      last30Days={last30Days}
      allTime={allTime}
      alerts={alerts}
      statsLoading={!(last30Days && allTime)}
    />
  )
}
