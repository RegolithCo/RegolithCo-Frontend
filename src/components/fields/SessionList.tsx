import * as React from 'react'
import { Session, SessionStateEnum, defaultSessionName, User } from '@regolithco/common'
import {
  AvatarGroup,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  SxProps,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import dayjs from 'dayjs'
import { alpha, keyframes, Theme } from '@mui/system'
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
import { UserAvatar } from '../UserAvatar'
import { SessionListSummary } from './SessionListSummary'
import { MValueFormat, MValueFormatter } from './MValue'
import { fontFamilies } from '../../theme'

export interface SessionListProps {
  sessions: Session[]
  loading?: boolean
  activeOnly?: boolean
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

export const SessionList: React.FC<SessionListProps> = ({ sessions, loading, activeOnly, onClickSession }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)

  const pulse = keyframes`
  0% { background-color: transparent; }
  70% { background-color:  ${theme.palette.warning.light}22; }
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
          currDay = sessionDay
          dayArr = [session]
        }
      } else {
        if (dayArr.length > 0) yearMonthArr.push(dayArr)
        if (yearMonthArr.length > 0) sessionsByDate.push(yearMonthArr)
        yearMonthArr = []
        dayArr = [session]
        currYear = sessionYear
        currMonth = sessionMonth
        currDay = sessionDay
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
        const monthlyAUEC = yearMonthArr.reduce((acc, dayArr) => {
          const dayAUEC = dayArr.reduce<number>((acc, session) => {
            return acc + (session.summary?.aUEC || 0)
          }, 0)
          return acc + dayAUEC
        }, 0)

        return (
          <Box key={`yeamonth-${idx}`} sx={{ margin: '0 auto' }}>
            <Typography
              variant="h5"
              sx={{
                // background: alpha(theme.palette.background.paper, 0.5),
                p: 1,
                fontFamily: fontFamilies.robotoMono,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                textShadow: '1px 1px 1px #000000aa',
                textAlign: 'left',
              }}
            >
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
                      color="text.primary"
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
                          borderRadius: 5,
                          border: `2px solid ${theme.palette.primary.dark}`,
                          background: '#000000aa',
                          mb: 5,
                          overflow: 'hidden',
                        }}
                      >
                        <List dense disablePadding>
                          {dayArr.map((session, idx) => {
                            const { sessionId, name, owner, state, summary } = session
                            const sessionActive = state === SessionStateEnum.Active
                            const subtitleArr = sessionSubtitleArr(session)
                            return (
                              <ListItem
                                divider
                                alignItems="flex-start"
                                disableGutters
                                disablePadding
                                key={`${sessionId}-${idx}`}
                                sx={{
                                  ...pulseCssThunk(sessionActive),
                                  cursor: 'pointer',
                                  px: 0.5,
                                  py: 1,
                                  // Leave a little space for the session summary
                                  pb: 6,
                                  '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.23)',
                                  },
                                }}
                                onClick={() => onClickSession?.(sessionId)}
                              >
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
                                  {/* <Typography component="div" variant="caption">
                                    Owner: {owner?.scName || 'Unknown'}
                                  </Typography> */}
                                  <Typography component="div" variant="caption">
                                    {subtitleArr.join(' - ')}
                                  </Typography>
                                  <SessionListSummary session={session} />
                                </ListItemText>
                                <ListItemAvatar
                                  sx={{
                                    [theme.breakpoints.down('sm')]: {
                                      display: 'none',
                                    },
                                  }}
                                >
                                  <Tooltip
                                    placement="left"
                                    arrow
                                    sx={{ maxHeight: 200, overflow: 'hidden' }}
                                    title={
                                      <List
                                        sx={{
                                          maxHeight: 200,
                                          overflow: 'auto',
                                          overflowY: 'scroll',
                                        }}
                                      >
                                        <ListItem>
                                          <ListItemAvatar>
                                            <UserAvatar user={session.owner as User} size="small" hideTooltip />
                                          </ListItemAvatar>
                                          <ListItemText>
                                            <Typography variant="subtitle1">
                                              {session.owner?.scName} (Session Owner)
                                            </Typography>
                                          </ListItemText>
                                        </ListItem>
                                        {session.activeMembers?.items
                                          .filter((member) => member.ownerId !== session.ownerId)
                                          .map((member, idx) => (
                                            <ListItem key={`${member.ownerId}-${idx}`}>
                                              <ListItemAvatar>
                                                <UserAvatar
                                                  key={member.ownerId}
                                                  user={member.owner as User}
                                                  size="small"
                                                  hideTooltip
                                                />
                                              </ListItemAvatar>
                                              <ListItemText>
                                                <Typography variant="subtitle1">{member.owner?.scName}</Typography>
                                              </ListItemText>
                                            </ListItem>
                                          ))}
                                      </List>
                                    }
                                  >
                                    <AvatarGroup
                                      max={4}
                                      color="primary"
                                      sx={{
                                        '& .MuiAvatarGroup-avatar': {
                                          border: `2px solid ${theme.palette.primary.main}`,
                                          color: theme.palette.primary.main,
                                          backgroundColor: alpha(theme.palette.primary.dark, 0.2),
                                          fontSize: '0.75rem',
                                        },
                                      }}
                                    >
                                      <UserAvatar user={session.owner as User} size="large" hideTooltip />
                                      {session.activeMembers?.items
                                        .filter((member) => member.ownerId !== session.ownerId)
                                        .map((member) => (
                                          <UserAvatar
                                            key={member.ownerId}
                                            user={member.owner as User}
                                            size="large"
                                            hideTooltip
                                          />
                                        ))}
                                    </AvatarGroup>
                                  </Tooltip>
                                  <div style={{ flexGrow: 1 }} />
                                </ListItemAvatar>
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
            {!activeOnly && (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  textShadow: '2px 2px 4px #000000',
                  justifyContent: 'center',
                  mb: 4,
                  fontFamily: fontFamilies.robotoMono,
                  fontWeight: 'bold',
                }}
              >
                Monthly Total: {MValueFormatter(monthlyAUEC, MValueFormat.currency)}
              </Stack>
            )}
          </Box>
        )
      })}
      {!loading && !activeOnly && (
        <Typography variant="body2" sx={{ textAlign: 'center' }} component="div" color="text.secondary">
          <em>No more sessions</em>
        </Typography>
      )}
    </Box>
  )
}
