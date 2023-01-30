import * as React from 'react'

import { Session, SessionStateEnum, defaultSessionName, makeAvatar } from '@regolithco/common'
import {
  Avatar,
  Box,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  SxProps,
  Typography,
  useTheme,
} from '@mui/material'
import dayjs from 'dayjs'
import { Person } from '@mui/icons-material'
import { keyframes, Theme } from '@mui/system'
import { sessionSubtitleArr } from '../pages/SessionPage/SessionHeader'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab'

export interface SessionListProps {
  sessions: Session[]
  loading?: boolean
  onClickSession?: (sessionId: string) => void
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  containerBox: {
    // [theme.breakpoints.up('md')]: { display: 'flex', flexDirection: 'column', height: '100%' },
  },
  listItemCommon: {
    '& .MuiListItemButton-root': {
      // border: '1px solid #aaaaaa',
      // borderRadius: 5,
    },
  },
})

export const SessionList: React.FC<SessionListProps> = ({ sessions, loading, onClickSession }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)

  const pulse = keyframes`
  0% { background-color: transparent; }
  70% { background-color:  ${theme.palette.warning.light}44; }
  100% { background-color: transparent; }
  `
  const pulseCssThunk = (doPulse: boolean): SxProps<Theme> => ({
    animation: doPulse ? `${pulse} 4s infinite ease` : '',
    backgroundColor: 'transparent',
  })

  // Group sessions by YEAR[MONTH[DAY[]]]
  const sessionsByDate: Session[][][] = React.useMemo(() => {
    const today = dayjs()
    const sessionsByDate: Session[][][] = []
    let currYear = today.year()
    let currMonth = today.month()
    let currDay = today.date()
    let yearMonthArr: Session[][] = []
    let dayArr: Session[] = []

    sessions.forEach((session) => {
      const sessionDate = dayjs(session.createdAt)
      const sessionYear = sessionDate.year()
      const sessionMonth = sessionDate.month()
      const sessionDay = sessionDate.date()
      if (sessionYear === currYear && sessionMonth === currMonth) {
        if (sessionDay === currDay) {
          dayArr.push(session)
        } else {
          if (dayArr.length > 0) yearMonthArr.push(dayArr)
          dayArr = [session]
          currDay = sessionDay
        }
      } else {
        if (yearMonthArr.length > 0) sessionsByDate.push(yearMonthArr)
        yearMonthArr = [[session]]
        currYear = sessionYear
        currMonth = sessionMonth
      }
    })
    if (dayArr.length > 0) yearMonthArr.push(dayArr)
    if (yearMonthArr.length > 0) sessionsByDate.push(yearMonthArr)
    return sessionsByDate
  }, [sessions, loading])

  return (
    <Box sx={styles.containerBox}>
      {sessionsByDate.map((yearMonthArr, idx) => {
        if (yearMonthArr.length === 0) return
        const currHeading = dayjs(yearMonthArr[0][0].createdAt).format('YYYY - MMMM')
        return (
          <Box key={`yeamonth-${idx}`}>
            <Typography variant="h6" sx={{ textAlign: 'left' }}>
              {currHeading}
            </Typography>
            <Timeline
              position="right"
              sx={{
                [theme.breakpoints.down('sm')]: {
                  '&, & .MuiTimelineContent-root, & .MuiTimelineOppositeContent-root': {
                    // p: 0.2,
                    // m: 0.7,
                  },
                },
                '& .MuiTimelineOppositeContent-positionRight': {
                  flex: 0.2,
                },
              }}
            >
              {yearMonthArr.map((dayArr, idy) => {
                if (dayArr.length === 0) return
                const currHeading = dayjs(dayArr[0].createdAt).format('ddd, MMM DD')
                return (
                  <TimelineItem key={`days-${idy}`}>
                    <TimelineOppositeContent
                      color="text.secondary"
                      sx={{
                        fontStyle: 'italic',
                        fontSize: '0.75rem',
                        [theme.breakpoints.down('sm')]: {
                          fontSize: '0.65rem',
                          lineHeight: 2,
                        },
                      }}
                    >
                      {currHeading}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="secondary" />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper
                        elevation={10}
                        sx={{
                          // p: {
                          //   xs: 0.5,
                          //   sm: 1,
                          //   md: 1.5,
                          // },
                          border: '1px solid #666666',
                        }}
                      >
                        <List dense disablePadding>
                          {dayArr.map((session) => {
                            const { sessionId, name, owner, createdAt, updatedAt, state } = session
                            const sessionActive = state === SessionStateEnum.Active
                            const subtitleArr = sessionSubtitleArr(session)
                            const userAvatar = makeAvatar(session.owner?.avatarUrl as string)
                            return (
                              <ListItem
                                divider
                                alignItems="flex-start"
                                key={sessionId}
                                sx={{
                                  ...pulseCssThunk(sessionActive),
                                  cursor: 'pointer',
                                  // mb: {
                                  //   xs: 0.5,
                                  //   sm: 1,
                                  //   md: 1.5,
                                  // },
                                  // '&:last-child': {
                                  //   mb: 0,
                                  // },
                                  '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.23)',
                                  },
                                  // backgroundColor: 'rgba(255, 255, 255, 0.13)',
                                }}
                                onClick={() => onClickSession?.(sessionId)}
                              >
                                <Chip
                                  label={sessionActive ? 'Active' : 'Ended'}
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    color: sessionActive
                                      ? theme.palette.secondary.contrastText
                                      : theme.palette.grey[500],
                                    backgroundColor: sessionActive
                                      ? theme.palette.secondary.light
                                      : theme.palette.background.default,
                                    borderRadius: 0,
                                    borderTopLeftRadius: 3,
                                    p: 0,
                                    m: 0,
                                    //
                                  }}
                                />
                                <ListItemAvatar
                                  sx={{
                                    [theme.breakpoints.down('sm')]: {
                                      display: 'none',
                                    },
                                  }}
                                >
                                  <Avatar
                                    src={userAvatar}
                                    imgProps={{ referrerPolicy: 'no-referrer' }}
                                    alt={session.owner?.scName}
                                    sx={{
                                      background: theme.palette.secondary.main,
                                      color: theme.palette.secondary.contrastText,
                                      border: '1px solid',
                                      mt: 2,
                                      ml: 1,
                                    }}
                                  >
                                    <Person />
                                  </Avatar>
                                  <div style={{ flexGrow: 1 }} />
                                </ListItemAvatar>
                                <ListItemText sx={{ pl: 1 }}>
                                  <Typography
                                    component="div"
                                    variant="subtitle1"
                                    sx={{
                                      lineHeight: 1.2,
                                      [theme.breakpoints.down('sm')]: {
                                        mt: 2,
                                        fontSize: '0.9rem',
                                        lineHeight: 1.2,
                                      },
                                    }}
                                  >
                                    {name || defaultSessionName()}
                                  </Typography>
                                  <Typography component="div" variant="caption">
                                    Owner: {owner?.scName || 'Unknown'}
                                  </Typography>
                                  <Typography component="div" variant="caption">
                                    {subtitleArr.join(' - ')}
                                  </Typography>
                                </ListItemText>
                              </ListItem>
                            )
                          })}
                        </List>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                )
              })}
            </Timeline>
          </Box>
        )
      })}
      {!loading && (
        <Typography variant="body2" sx={{ textAlign: 'center' }} component="div" color="text.secondary">
          <em>No more sessions</em>
        </Typography>
      )}
    </Box>
  )
}
