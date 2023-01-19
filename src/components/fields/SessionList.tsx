import * as React from 'react'

import { UserProfile, Session, SessionStateEnum, defaultSessionName } from '@orgminer/common'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Pagination,
  SxProps,
  Typography,
  useTheme,
} from '@mui/material'
import dayjs from 'dayjs'
import { chunk } from 'lodash'
import { AddCircle, Groups } from '@mui/icons-material'
import { Stack, Theme } from '@mui/system'
import { sessionSubtitleArr } from '../pages/SessionPage/SessionHeader'
import log from 'loglevel'

export interface SessionListProps {
  title: string
  userProfile: UserProfile
  activeOnly: boolean
  sessions: Session[]
  loading?: boolean
  pageSize: number
  onClickSession?: (sessionId: string) => void
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  containerBox: {
    [theme.breakpoints.up('md')]: { display: 'flex', flexDirection: 'column', height: '100%' },
  },
  listItemCommon: {
    '& .MuiListItemButton-root': {
      border: '1px solid #aaaaaa',
      borderRadius: 5,
    },
  },
})

export const SessionList: React.FC<SessionListProps> = ({
  title,
  activeOnly,
  userProfile,
  sessions,
  pageSize,
  onClickSession,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const [pageIdx, setPageIdx] = React.useState(0)

  const { numPages, numFiltered, filteredSortedChunked } = React.useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return {
        filteredSortedChunked: [[]],
        numFiltered: 0,
        numPages: 1,
      }
    }
    const filteredSessions = activeOnly
      ? sessions.filter(({ state }) => state === SessionStateEnum.Active)
      : [...(sessions || [])]

    // Sort by most recent update
    filteredSessions.sort((a, b) => b.updatedAt - a.updatedAt)

    const chunkedSessions = chunk(filteredSessions, pageSize)
    return {
      filteredSortedChunked: chunkedSessions,
      numFiltered: filteredSessions.length,
      numPages: chunkedSessions.length,
    }
  }, [activeOnly, sessions])
  const numActive = sessions.filter(({ state }) => state === SessionStateEnum.Active).length

  React.useEffect(() => {
    if (pageIdx >= numPages) setPageIdx(numPages - 1)
    else if (pageIdx < 0) setPageIdx(0)
  }, [pageIdx, numPages])

  return (
    <Box sx={styles.containerBox}>
      <Typography sx={{ flex: '0 0' }}>
        {title} (Active: {numActive} Closed: {sessions.length - numActive})
      </Typography>
      <List dense sx={{ flex: '0 0' }}>
        {filteredSortedChunked.length === 0 && (
          <ListItem>
            <ListItemText
              sx={{
                '& .MuiListItemText-primary': { fontStyle: 'italic' },
              }}
              primary={'No matching sessions'}
            />
          </ListItem>
        )}
        {filteredSortedChunked[pageIdx] &&
          filteredSortedChunked[pageIdx].map((session) => {
            const { sessionId, name, owner, createdAt, updatedAt, state } = session
            const sessionActive = state === SessionStateEnum.Active
            const subtitleArr = sessionSubtitleArr(session)
            return (
              <ListItem key={sessionId} sx={{ ...styles.listItemCommon, opacity: !sessionActive ? 0.5 : 1 }}>
                <ListItemButton onClick={() => onClickSession?.(sessionId)}>
                  <ListItemIcon>
                    <Groups />
                  </ListItemIcon>
                  <Box sx={{ overflow: 'hidden', flex: '1 1 ' }}>
                    <Typography
                      component="div"
                      variant="subtitle1"
                      sx={{
                        border: '1px transparent solid',
                        display: 'block',
                        textOverflow: 'ellipsis',
                        width: '100%',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
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
                    <Typography component="div" variant="caption">
                      Last Activity: {dayjs(updatedAt).format('ddd, DD/MM/YY, h:mm a')}
                    </Typography>
                  </Box>
                </ListItemButton>
              </ListItem>
            )
          })}
      </List>
      <Box sx={{ flex: '1 1' }} />
      {numPages > 1 && (
        <Stack alignItems="center" sx={{ flex: '0 0' }}>
          <Pagination
            sx={{ margin: '0 auto' }}
            count={numPages}
            page={pageIdx + 1}
            onChange={(event: React.ChangeEvent<unknown>, value: number) => {
              if (value < 1 || value > numPages) {
                return
              }
              setPageIdx(value - 1)
            }}
          />
        </Stack>
      )}
    </Box>
  )
}
