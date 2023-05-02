import * as React from 'react'
import { Session, SessionStateEnum, SessionSummary } from '@regolithco/common'
import { Box, Divider, SxProps, Tooltip, Typography, useTheme } from '@mui/material'
import { Theme } from '@mui/system'
import { AccessTime, Assignment, Factory, Groups, TravelExplore } from '@mui/icons-material'
import { MValue, MValueFormat, MValueFormatter } from './MValue'
import { CountdownTimer } from '../calculators/WorkOrderCalc/CountdownTimer'
import { fontFamilies } from '../../theme'

export interface SessionListSummaryProps {
  session: Session
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  refineryBox: {
    p: 0.5,
    display: 'flex',
    position: 'absolute',
    textAlign: 'right',
    right: 0,
    bottom: 20,
    '&.MuiTypography-root': {
      whiteSpace: 'nowrap',
      fontSize: 10,
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
  },
  refineryName: {
    mx: 0.5,
    // p: 0.5,
    // border: '1px solid',
    // borderRadius: 2,
  },
  state: { pl: 1 },
  aUEC: {
    textAlign: 'right',
    // background: theme.palette.success.main,
    minWidth: 80,
    px: 0.4,
    py: 0.1,
    border: '1px solid',
    borderRadius: 0.5,
    color: theme.palette.success.main,
  },
  oreSCU: {
    // color: theme.palette.warning.main
  },
  users: { flex: '1 1 10%', textAlign: 'right' },
  countdown: {
    color: 'yellow',
    whiteSpace: 'nowrap',
    fontSize: 10,
    fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
  },
  containerBox: {
    p: 0.5,
    display: 'flex',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    '& .MuiDivider-root': {
      ml: 1,
      mr: 1,
    },
    '& .MuiTypography-root': {
      whiteSpace: 'nowrap',
      fontSize: 10,
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
  },
  icon: {
    height: '1rem',
    marginBottom: '-4px',
  },
})

export const SessionListSummary: React.FC<SessionListSummaryProps> = ({ session }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const { aUEC, activeMembers, totalMembers, allPaid, lastJobDone, oreSCU, refineries, scoutingFinds, workOrders } =
    session.summary as SessionSummary

  const oreSCUDecimals = oreSCU && oreSCU > 0 && oreSCU < 10 ? 1 : 0

  // Sum all the numeric values of workOrders
  const totalWorkOrders = Object.values(workOrders || {}).reduce<number>(
    (acc, curr) => (typeof curr === 'number' ? acc + curr : acc),
    0
  )
  const totalScoutingFnds = Object.values(scoutingFinds || {}).reduce<number>(
    (acc, curr) => (typeof curr === 'number' ? acc + curr : acc),
    0
  )

  return (
    <>
      {refineries && refineries.length > 0 && (
        <Tooltip
          title={
            <Box>
              <Typography component="div">
                <strong>Refinery:</strong> {refineries.join(', ')}
              </Typography>
              <Typography component="div">
                <strong>Last refinery job complete</strong>
              </Typography>
              <MValue value={lastJobDone} format={MValueFormat.dateTime} />
            </Box>
          }
        >
          <Typography sx={styles.refineryBox} component="div">
            <Box sx={styles.refineryName}>
              <Factory sx={styles.icon} /> {refineries[0]}
            </Box>
            {refineries.length > 1 && `(+${refineries.length - 1})`}
            {lastJobDone && lastJobDone > 0 && <AccessTime sx={styles.icon} />}
            {lastJobDone && lastJobDone > Date.now() && (
              <Typography component="div" sx={styles.countdown}>
                <CountdownTimer endTime={lastJobDone as number} useMValue={false} />
              </Typography>
            )}
            {lastJobDone && lastJobDone < Date.now() && MValueFormatter(lastJobDone, MValueFormat.dateTime)}
          </Typography>
        </Tooltip>
      )}
      <Box sx={styles.containerBox}>
        <Tooltip
          title={<Typography>Session is {session.state === SessionStateEnum.Active ? 'ACTIVE' : 'ENDED'}</Typography>}
        >
          <Typography
            component="div"
            sx={{
              ...styles.state,
              color: session.state === SessionStateEnum.Active ? theme.palette.success.main : theme.palette.grey[500],
            }}
          >
            {session.state === SessionStateEnum.Active ? 'Active' : 'Ended'}
          </Typography>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title={<Typography>Work Orders: {totalWorkOrders}</Typography>}>
          <Typography sx={styles.workOrders}>
            <Assignment sx={styles.icon} /> {totalWorkOrders}
          </Typography>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title={<Typography>Scouting finds: {totalScoutingFnds}</Typography>}>
          <Typography sx={styles.scoutingFinds}>
            <TravelExplore sx={styles.icon} /> {totalScoutingFnds}
          </Typography>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        {totalMembers && totalMembers > 1 && (
          <>
            <Tooltip
              title={
                <Box>
                  <Typography>Active members: {activeMembers}</Typography>
                  <Typography>Total members: {totalMembers}</Typography>
                  <Typography
                    sx={{
                      color: allPaid ? theme.palette.success.main : theme.palette.error.main,
                    }}
                  >
                    All crew shares paid: {allPaid ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              }
            >
              <Typography
                sx={{ ...styles.users, color: allPaid ? theme.palette.success.main : theme.palette.error.main }}
              >
                <Groups sx={styles.icon} /> {activeMembers}/{totalMembers}
              </Typography>
            </Tooltip>
          </>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip
          title={
            <Typography>
              Total raw ore collected: <br />
              {MValueFormatter(oreSCU, MValueFormat.volSCU, oreSCUDecimals)}
            </Typography>
          }
        >
          <Typography sx={styles.oreSCU}>{MValueFormatter(oreSCU, MValueFormat.volSCU, oreSCUDecimals)}</Typography>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip
          title={
            <Typography>
              Total value of all work orders: <br />
              {MValueFormatter(aUEC, MValueFormat.currency)}
            </Typography>
          }
        >
          <Typography sx={styles.aUEC}>{MValueFormatter(aUEC, MValueFormat.currency)}</Typography>
        </Tooltip>
      </Box>
    </>
  )
}
