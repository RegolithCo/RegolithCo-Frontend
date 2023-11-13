import * as React from 'react'

import { Session, SessionBreakdown, sessionReduce } from '@regolithco/common'
import { Box, List, ListItem, ListItemSecondaryAction, ListItemText, Typography, useTheme } from '@mui/material'
import { MValue, MValueFormat } from '../../fields/MValue'
import { CountdownTimer } from '../../calculators/WorkOrderCalc/CountdownTimer'
import { fontFamilies } from '../../../theme'
import dayjs from 'dayjs'

export interface TabSummaryStatsProps {
  session: Session
  isShare?: boolean
}

export const TabSummaryStats: React.FC<TabSummaryStatsProps> = ({ session, isShare }) => {
  const theme = useTheme()
  const sessionSummary: SessionBreakdown = React.useMemo(
    () => sessionReduce(session?.workOrders?.items || []),
    [session]
  )

  const clusterCount = session.scouting?.items.length
  const rockCount = session.scouting?.items.reduce((acc, cur) => acc + (cur.clusterCount || 0), 0)

  return (
    <Box>
      <List
        sx={{
          // Make every other row a different color
          '& .MuiListItem-container:nth-of-type(odd)': {
            background: '#00000044',
          },
        }}
      >
        <ListItem>
          <ListItemText primary="Gross earnings" />
          <ListItemSecondaryAction>
            <MValue
              value={sessionSummary.shareAmount}
              format={MValueFormat.currency}
              typoProps={{
                px: 2,
                fontSize: '1.1rem',
                lineHeight: '2rem',
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary="Raw ore collected" />
          <ListItemSecondaryAction>
            <MValue
              value={sessionSummary.rawOreCollected / 100}
              format={MValueFormat.volSCU}
              decimals={1}
              typoProps={{
                px: 2,
                fontSize: '1.1rem',
                lineHeight: '2rem',
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary="Work Orders Created" />
          <ListItemSecondaryAction>
            <MValue
              value={Object.keys(sessionSummary.orderBreakdowns).length}
              format={MValueFormat.number}
              decimals={0}
              typoProps={{
                px: 2,
                fontSize: '1.1rem',
                lineHeight: '2rem',
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary="Scouting Finds" />
          <ListItemSecondaryAction>
            <Typography
              sx={{
                fontSize: '1.1rem',
                lineHeight: '2rem',
              }}
            >
              <strong>{rockCount}</strong> rocks inside <strong>{clusterCount}</strong> clusters
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
        {sessionSummary.lastFinishedOrder && sessionSummary.lastFinishedOrder > Date.now() && (
          <ListItem>
            <ListItemText primary="Last work order complete" />
            <ListItemSecondaryAction>
              {isShare ? (
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    textAlign: 'center',
                    fontSize: '1rem',
                    padding: 0.5,
                    fontWeight: 'bold',
                    fontFamily: fontFamilies.robotoMono,
                  }}
                >
                  {dayjs(sessionSummary.lastFinishedOrder).format('MMM D YYYY, h:mm a')} (
                  {new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2]})
                </Typography>
              ) : (
                <CountdownTimer
                  endTime={sessionSummary.lastFinishedOrder}
                  useMValue
                  typoProps={{
                    sx: {
                      color: theme.palette.primary.light,
                    },
                  }}
                />
              )}
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </List>
    </Box>
  )
}
