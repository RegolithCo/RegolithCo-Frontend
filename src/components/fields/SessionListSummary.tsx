import * as React from 'react'
import { ScoutingFindTypeEnum, Session, SessionSummary } from '@regolithco/common'
import { Box, Chip, Stack, SxProps, Theme, Tooltip, Typography, useTheme } from '@mui/material'
import { AccessTime, Factory, Toll } from '@mui/icons-material'
import { MValue, MValueFormat, MValueFormatter } from './MValue'
import { CountdownTimer } from '../calculators/WorkOrderCalc/CountdownTimer'
import { fontFamilies } from '../../theme'
// import { AppContext } from '../../context/app.context'
import { WorkOrderStatus } from './WorkOrderStatus'
import { ScoutingFindStatus } from './ScoutingFindStatus'
import { SessionUsersStatus } from './SessionUsersStatus'
import { RefineryIcon } from './RefineryIcon'

export interface SessionListSummaryProps {
  session: Session
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  refineryBox: {
    display: 'flex',
    py: 0.5,
    textAlign: 'right',
    color: theme.palette.text.secondary,
    '&.MuiTypography-root': {
      whiteSpace: 'nowrap',
      fontSize: 10,
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
    // Vertically center the icon
    '& .MuiSvgIcon-root': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  refineryName: {
    // mx: 0.5,
    // p: 0.5,
    // border: '1px solid',
    // borderRadius: 2,
  },
  state: { pl: 1 },
  aUEC: {
    textAlign: 'right',
    minWidth: 80,
    px: 0.4,
    py: 0.1,
    border: '1px solid',
    borderRadius: 2,
    backgroundColor: theme.palette.success.contrastText,
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
  // const { hideNames } = React.useContext(AppContext)
  const {
    aUEC,
    activeMembers,
    totalMembers,
    // allPaid,
    lastJobDone,
    oreSCU,
    refineries,
    scoutingFindsByType,
    // workOrderSummaries,
    // workOrdersByType,
  } = session.summary as SessionSummary

  const oreSCUDecimals = oreSCU && oreSCU > 0 && oreSCU < 10 ? 1 : 0

  // Sum all the numeric values of workOrders
  // const totalWorkOrders = Object.values(workOrderSummaries || {}).reduce<number>(
  //   (acc, curr) => (typeof curr === 'number' ? acc + curr : acc),
  //   0
  // )
  const totalScoutingFnds = Object.values(scoutingFindsByType || {}).reduce<number>(
    (acc, curr) => (typeof curr === 'number' ? acc + curr : acc),
    0
  )

  return (
    <Stack justifyContent={'space-between'}>
      {/* THIS IS THE ROW WITH USERS, WORK ORDERS AND SCOUTING */}

      <Stack
        direction={{
          sm: 'column',
          md: 'row',
        }}
        spacing={1}
        sx={{ width: '100%' }}
      >
        <Stack direction="column" spacing={1} sx={{ flex: '1 1 20%', mt: 2 }}>
          <Typography
            component="div"
            color="text.secondary"
            sx={{
              fontSize: '0.6rem',
              borderBottom: '1px solid',
              fontFamily: fontFamilies.robotoMono,
              fontWeight: 'bold',
            }}
          >
            Users ({totalMembers}):
          </Typography>
          <Typography
            component="div"
            color="text.secondary"
            variant="caption"
            sx={
              {
                // textAlign: 'center',
              }
            }
          >
            <SessionUsersStatus numActive={activeMembers || 0} numTotal={totalMembers || 0} />
          </Typography>
        </Stack>
        <Stack direction="column" spacing={1} sx={{ flex: '1 1 50%', mt: 2 }}>
          <Typography
            component="div"
            color="text.secondary"
            sx={{
              fontSize: '0.6rem',
              borderBottom: '1px solid',
              fontFamily: fontFamilies.robotoMono,
              fontWeight: 'bold',
            }}
          >
            Work Orders ({(session.summary?.workOrderSummaries || []).length}):
          </Typography>
          <Stack direction="row" spacing={0} flexWrap="wrap">
            {(session.summary?.workOrderSummaries || []).map((wo, idx) => (
              <WorkOrderStatus key={`wostat-${idx}`} woSumm={wo} />
            ))}
          </Stack>
        </Stack>
        <Stack direction="column" spacing={1} sx={{ flex: '1 1 30%', mt: 2 }}>
          <Typography
            component="div"
            color="text.secondary"
            sx={{
              fontSize: '0.6rem',
              borderBottom: '1px solid',
              fontFamily: fontFamilies.robotoMono,
              fontWeight: 'bold',
            }}
          >
            Scouting Finds ({totalScoutingFnds}):
          </Typography>
          <Stack direction="row" spacing={1}>
            <ScoutingFindStatus
              num={session.summary?.scoutingFindsByType?.ship || 0}
              sfType={ScoutingFindTypeEnum.Ship}
            />
            <ScoutingFindStatus
              num={session.summary?.scoutingFindsByType?.vehicle || 0}
              sfType={ScoutingFindTypeEnum.Vehicle}
            />
            <ScoutingFindStatus
              num={session.summary?.scoutingFindsByType?.salvage || 0}
              sfType={ScoutingFindTypeEnum.Salvage}
            />
          </Stack>
        </Stack>
      </Stack>

      {/* THIS IS THE SUMMARY ROW WITH REFINERY AND PRICE AND SCU */}

      <Stack
        mt={2}
        direction={{
          sm: 'column',
          md: 'row',
        }}
        spacing={2}
        sx={{ width: '100%' }}
        justifyContent={'space-between'}
      >
        {refineries && refineries.length > 0 && (
          <Tooltip
            title={
              <Box>
                <Typography>
                  Total raw ore collected: <br />
                  {MValueFormatter(oreSCU, MValueFormat.volSCU, oreSCUDecimals)}
                </Typography>
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
              <Chip
                size="small"
                variant="outlined"
                label={MValueFormatter(oreSCU, MValueFormat.volSCU, oreSCUDecimals)}
                sx={{
                  mr: 1,
                }}
              />
              <RefineryIcon shortName={refineries[0]} />
              {refineries.length > 1 && `(+${refineries.length - 1})`}
              {lastJobDone && lastJobDone > 0 && (
                <AccessTime
                  sx={{
                    ...styles.icon,
                    fontSize: '0.8rem',
                    color: lastJobDone > Date.now() ? theme.palette.primary.light : undefined,
                    ml: 1,
                    mr: 0.5,
                  }}
                />
              )}
              {lastJobDone && lastJobDone > Date.now() && (
                <Typography component="div" sx={styles.countdown}>
                  <CountdownTimer
                    endTime={lastJobDone as number}
                    useMValue={false}
                    typoProps={{
                      variant: 'caption',
                      sx: {
                        color: theme.palette.primary.light,
                        fontFamily: fontFamilies.robotoMono,
                        fontWeight: 'bold',
                      },
                    }}
                  />
                </Typography>
              )}
              {lastJobDone && lastJobDone < Date.now() && MValueFormatter(lastJobDone, MValueFormat.dateTime)}
            </Typography>
          </Tooltip>
        )}
        <Box flexGrow={1} />
        <Tooltip
          title={
            <Typography>
              Total net profit from all work orders: <br />
              {MValueFormatter(aUEC, MValueFormat.currency)}
            </Typography>
          }
        >
          <Chip
            color="secondary"
            size="small"
            variant="outlined"
            sx={{ minWidth: 100, textAlign: 'right' }}
            icon={<Toll />}
            label={MValueFormatter(aUEC, MValueFormat.currency_sm)}
          />
        </Tooltip>
      </Stack>
    </Stack>
  )
}
