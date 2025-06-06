import * as React from 'react'
import { Box, BoxProps, Button, SxProps, Typography, keyframes, Theme } from '@mui/material'
import { theme } from '../../../theme'
import dayjs from 'dayjs'
import { Refresh } from '@mui/icons-material'
import { DashboardProps } from './Dashboard'

const textPulse = keyframes`
0% { color: transparent; }
70% { color:  ${theme.palette.secondary.dark}; }
100% { color: transparent; }
`

export const FetchMoreSessionLoader: React.FC<Pick<DashboardProps, 'loading' | 'allLoaded' | 'fetchMoreSessions'>> = ({
  loading,
  allLoaded,
  fetchMoreSessions,
}) => {
  const fetchMoreSessionsRef = React.useRef<HTMLDivElement | null>(null)

  const loadingPulse: SxProps<Theme> = {
    animation: `${textPulse} 1s infinite ease`,
    color: 'transparent',
  }

  React.useEffect(() => {
    if (loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreSessions()
        }
      },
      { threshold: 1 } // Adjust this value if you want the fetch to happen sooner or later
    )

    if (fetchMoreSessionsRef.current) {
      observer.observe(fetchMoreSessionsRef.current)
    }

    return () => {
      if (fetchMoreSessionsRef.current) {
        observer.unobserve(fetchMoreSessionsRef.current)
      }
    }
  }, [loading, fetchMoreSessions])

  return (
    <Box ref={fetchMoreSessionsRef}>
      {loading && (
        <Typography variant="h5" sx={{ textAlign: 'center', ...loadingPulse }} component="div" color="secondary.dark">
          <em>Loading More Sessions...</em>
        </Typography>
      )}
      {!loading && allLoaded && (
        <Typography variant="h5" sx={{ textAlign: 'center' }} component="div" color="text.secondary">
          <em>No sessions to display</em>
        </Typography>
      )}
    </Box>
  )
}

export const FetchMoreWithDate: React.FC<
  Pick<DashboardProps, 'paginationDate' | 'loading' | 'allLoaded' | 'fetchMoreSessions'> & BoxProps
> = ({ loading, allLoaded, fetchMoreSessions, paginationDate, ...rest }) => {
  return (
    <Box {...rest}>
      <Typography variant="caption" component="div">
        From {dayjs(paginationDate).format('ll')} to now{' '}
        {!allLoaded ? (
          <Button
            sx={{ ml: 2 }}
            startIcon={<Refresh />}
            variant="outlined"
            disabled={loading}
            onClick={() => {
              fetchMoreSessions()
            }}
          >
            Load More
          </Button>
        ) : (
          <span style={{ color: theme.palette.text.secondary }}>(All work orders loaded)</span>
        )}
      </Typography>
    </Box>
  )
}
