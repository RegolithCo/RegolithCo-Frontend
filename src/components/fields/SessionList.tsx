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
import { fontFamilies, theme } from '../../theme'
import { AppContext } from '../../context/app.context'
import { RouterLink } from './RouterLink'
import { FetchMoreSessionLoader } from '../pages/Dashboard/FetchMoreSessionLoader'

export interface SessionListProps {
  sessions: Session[]
  loading?: boolean
  allLoaded?: boolean
  fetchMoreSessions: () => void
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

const pulseFn = (theme: Theme) => keyframes`
0% { background-color: transparent; }
70% { background-color:  ${theme.palette.warning.light}22; }
100% { background-color: transparent; }
`
const textPulse = keyframes`
0% { color: transparent; }
70% { color:  ${theme.palette.secondary.dark}; }
100% { color: transparent; }
`

const pulseCssThunk = (theme: Theme, doPulse: boolean): SxProps<Theme> => ({
  animation: doPulse ? `${pulseFn(theme)} 4s infinite ease` : '',
  backgroundColor: 'transparent',
})

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  loading,
  allLoaded,
  activeOnly,
  fetchMoreSessions,
  onClickSession,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const fetchMoreSessionsRef = React.useRef<HTMLDivElement | null>(null)

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

  // const loadingPulse: SxProps<Theme> = {
  //   animation: `${textPulse} 1s infinite ease`,
  //   color: 'transparent',
  // }

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
        return <SessionListMonth key={`yearMonth-${idx}`} yearMonthArr={yearMonthArr} activeOnly={activeOnly} />
      })}
      {!loading && !activeOnly && sessions.length === 0 && (
        <Paper
          elevation={5}
          sx={{
            m: 5,
            p: 3,
            '& strong': {
              color: theme.palette.secondary.main,
            },
          }}
        >
          <Typography variant="h5" paragraph>
            You have no sessions yet!
          </Typography>
          <Typography variant="body2" paragraph>
            This is where your sessions will appear. You will see both the sessions you create and the sessions of
            others that you have joined.
          </Typography>
          <Typography variant="body2" paragraph>
            Think of sessions as a way to group together your mining or salvage gameplay. You can create a session for
            yourself or invite others to join you. You can also join sessions created by others if they send you an
            invitation to do so.
          </Typography>
          <Typography variant="body2" paragraph>
            Sessions can contain both <strong>Work Orders</strong> and <strong>Scouting Finds</strong>.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Work orders</strong> represent either a single refinery job or a single sale at the TDD and have
            built-in tools to help you divide and share the proceeds with your party or crew.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Scouting finds</strong> represent a cluster of resources (rocks, gems, salvage chunks) that can be
            mined or salvaged to then create work orders.
          </Typography>
          <Typography variant="body2" paragraph>
            Click the <strong>Create a new Session</strong> button above or click a join link from someone else to get
            started!
          </Typography>
        </Paper>
      )}
      {/* Now have an element where viewing it triggers a fetch of the next page */}
      <FetchMoreSessionLoader loading={loading} allLoaded={allLoaded} fetchMoreSessions={fetchMoreSessions} />
    </Box>
  )
}

export interface SessionListMonthProps {
  yearMonthArr: Session[][]
  activeOnly?: boolean
}

export const SessionListMonth: React.FC<SessionListMonthProps> = ({ yearMonthArr, activeOnly }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const { hideNames } = React.useContext(AppContext)

  if (yearMonthArr.length === 0) return
  const currHeading = dayjs(yearMonthArr[0][0].createdAt).format('YYYY - MMMM')
  const monthlyAUEC = yearMonthArr.reduce((acc, dayArr) => {
    const dayAUEC = dayArr.reduce<number>((acc, session) => {
      return acc + (session.summary?.aUEC || 0)
    }, 0)
    return acc + dayAUEC
  }, 0)

  return (
    <Box sx={{ margin: '0 auto' }}>
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
            p: 0,
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
                    // position: 'relative',
                    lineHeight: 2,

                    // Rotate the date to be vertical and down 100%
                    transform: 'rotate(-90deg) translateX(-100%) translateY(50%)',
                    // Change the rotation center to the top left corner
                    transformOrigin: 'bottom left',
                    textAlign: 'right',
                    // border: `1px solid ${theme.palette.primary.main}`,
                    width: '200px',
                    top: 0,
                    left: 0,
                    position: 'absolute',
                    // height: '300px',
                  },
                }}
              >
                <Box
                  sx={{
                    [theme.breakpoints.down('sm')]: {},
                  }}
                >
                  {currHeading}
                </Box>
              </TimelineOppositeContent>
              <TimelineSeparator
                sx={{
                  [theme.breakpoints.down('sm')]: {
                    display: 'none',
                  },
                }}
              >
                <TimelineDot color="secondary" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper
                  elevation={10}
                  sx={{
                    borderRadius: 5,
                    border: `2px solid ${theme.palette.grey[800]}`,
                    background: '#000000aa',
                    mb: 2,
                    overflow: 'hidden',
                  }}
                >
                  <List dense disablePadding>
                    {dayArr.map((session, idx) => {
                      const { sessionId, name, state } = session
                      const sessionActive = state === SessionStateEnum.Active
                      const subtitleArr = sessionSubtitleArr(session, hideNames)
                      return (
                        <RouterLink key={`${sessionId}-${idx}`} to={`/session/${sessionId}`}>
                          <ListItem
                            divider
                            alignItems="flex-start"
                            disableGutters
                            disablePadding
                            key={`${sessionId}-${idx}`}
                            sx={{
                              ...pulseCssThunk(theme, sessionActive),
                              cursor: 'pointer',
                              px: 1,
                              py: 2,
                              // Leave a little space for the session summary
                              pb: 0,
                              '&:hover': {
                                backgroundColor: 'rgba(100, 100, 100, 0.23)',
                              },
                              // If this is not the last
                              '&.MuiListItem-divider:not(:last-child)': {
                                borderBottom: `2px solid ${theme.palette.primary.dark}`,
                              },
                            }}
                            // onClick={() => onClickSession?.(sessionId)}
                          >
                            <Typography
                              component="div"
                              sx={{
                                ...styles.state,
                                textTransform: 'uppercase',
                                // rotate 45 degrees and put it in the middle of the list item
                                transform: 'rotate(-45deg) translateX(50%) translateY(50%)',
                                top: '50%',
                                right: '20%',
                                position: 'absolute',
                                fontFamily: fontFamilies.robotoMono,
                                fontWeight: 'bold',
                                fontSize: '3rem',
                                // no interactive
                                pointerEvents: 'none',
                                opacity: 0.2,
                                color:
                                  session.state === SessionStateEnum.Active
                                    ? theme.palette.secondary.light
                                    : theme.palette.grey[500],
                              }}
                            >
                              {session.state === SessionStateEnum.Active ? 'Active' : 'Ended'}
                            </Typography>
                            <ListItemText sx={{ pl: 1 }}>
                              <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={1}
                                alignItems={{ xs: 'center', sm: 'flex-start' }}
                                justifyContent="space-between"
                              >
                                <Box textAlign={{ xs: 'center', sm: 'left' }}>
                                  <Typography
                                    component="div"
                                    variant="subtitle1"
                                    sx={{
                                      color: sessionActive
                                        ? theme.palette.secondary.light
                                        : theme.palette.text.secondary,
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
                                  <Typography
                                    component="div"
                                    variant="overline"
                                    color="text.secondary"
                                    fontSize={'0.5rem'}
                                    mb={1}
                                  >
                                    {subtitleArr.map((subtitle, i) => (
                                      <React.Fragment key={i}>
                                        {subtitle}
                                        {i < subtitleArr.length - 1 && ' // '}
                                      </React.Fragment>
                                    ))}
                                  </Typography>
                                </Box>
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
                                          <UserAvatar
                                            user={session.owner as User}
                                            size="small"
                                            hideTooltip
                                            privacy={hideNames}
                                          />
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
                                                privacy={hideNames}
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
                                    <UserAvatar
                                      user={session.owner as User}
                                      size="large"
                                      hideTooltip
                                      privacy={hideNames}
                                    />
                                    {session.activeMembers?.items
                                      .filter((member) => member.ownerId !== session.ownerId)
                                      .map((member) => (
                                        <UserAvatar
                                          key={member.ownerId}
                                          user={member.owner as User}
                                          size="large"
                                          privacy={hideNames}
                                          hideTooltip
                                        />
                                      ))}
                                  </AvatarGroup>
                                </Tooltip>
                              </Stack>
                              <SessionListSummary session={session} />
                            </ListItemText>
                          </ListItem>
                        </RouterLink>
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
          alignItems="baseline"
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
}
