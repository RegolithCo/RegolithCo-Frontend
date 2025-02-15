import { RegolithMonthStats, RegolithAllTimeStats } from '@regolithco/common'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { HomePage } from './HomePage'
import dayjs from 'dayjs'
import log from 'loglevel'
import { RegolithAlert } from '../../types'

export const HomePageContainer: React.FC = () => {
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
          try {
            if (!response.data.days || !response.data.summary) {
              throw new Error('Invalid last30.json response')
            }
            setLast30Days(response.data)
          } catch (error) {
            log.error('Error loading last30.json', error)
          }
        })
        .catch((error) => log.error(error)),
      axios.get(`/stats/alltime.json?cachebust=${dateSuffix}`).then((response) => {
        try {
          if (!response.data || !Array.isArray(Object.keys(response.data))) {
            throw new Error('Invalid alltime.json response')
          }
          setAllTime(response.data)
        } catch (error) {
          log.error('Error loading alltime.json', error)
        }
      }),
    ])
  }, [])

  return (
    <HomePage
      navigate={navigate}
      last30Days={last30Days}
      allTime={allTime}
      alerts={alerts}
      statsLoading={!(last30Days && allTime)}
    />
  )
}
