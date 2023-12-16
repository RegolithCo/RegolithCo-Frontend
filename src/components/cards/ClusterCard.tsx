import * as React from 'react'
import Card from '@mui/material/Card'
import { keyframes } from '@mui/system'
import { Avatar, Box, ThemeProvider, Tooltip, Typography } from '@mui/material'
import { Article, PersonSearch, Rocket, SvgIconComponent } from '@mui/icons-material'
import {
  clusterCalc,
  SalvageFind,
  ScoutingFind,
  ScoutingFindStateEnum,
  getScoutingFindStateName,
  ScoutingFindTypeEnum,
  ShipClusterFind,
  VehicleClusterFind,
  SessionUserStateEnum,
  makeHumanIds,
} from '@regolithco/common'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { fontFamilies, scoutingFindStateThemes } from '../../theme'
import { MValueFormat, MValueFormatter } from '../fields/MValue'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { yellow } from '@mui/material/colors'
import { AppContext } from '../../context/app.context'
import { useSessionContextMenu } from '../modals/SessionContextMenu'
dayjs.extend(relativeTime)

export interface ClusterCardProps {
  scoutingFind: ScoutingFind
}

export const ClusterCard: React.FC<ClusterCardProps> = ({ scoutingFind }) => {
  const theme = scoutingFindStateThemes[scoutingFind.state]
  const summary = clusterCalc(scoutingFind)
  const ores = summary.oreSort || []
  const findType = scoutingFind.clusterType
  const { getSafeName } = React.useContext(AppContext)
  const attendanceCount = (scoutingFind.attendance || []).filter((a) => a.state === SessionUserStateEnum.OnSite).length
  const { contextMenuNode, handleClose, handleContextMenu } = useSessionContextMenu({
    header: `${findType} Cluster: ${makeHumanIds(
      getSafeName(scoutingFind.owner?.scName),
      scoutingFind.scoutingFindId
    )}`,
    menuItems: [
      {
        label: 'Abandonned',
      },
      {
        label: 'Need Workers',
      },
      {
        label: '',
        divider: true,
      },
      {
        label: 'Delete scouting find',
      },
    ],
  })

  // Conveneince variables
  const shipFind = scoutingFind as ShipClusterFind
  const vehicleFind = scoutingFind as VehicleClusterFind
  const salvageFind = scoutingFind as SalvageFind

  let Icon: SvgIconComponent = ClawIcon
  let clusterSize = 0
  switch (findType) {
    case ScoutingFindTypeEnum.Salvage:
      Icon = ClawIcon
      clusterSize = salvageFind.wrecks?.length || 0
      break
    case ScoutingFindTypeEnum.Ship:
      clusterSize = shipFind.shipRocks?.length || 0
      Icon = RockIcon
      break
    case ScoutingFindTypeEnum.Vehicle:
      clusterSize = vehicleFind.vehicleRocks?.length || 0
      Icon = GemIcon
      break
  }

  const doPulse = scoutingFind.state === ScoutingFindStateEnum.ReadyForWorkers
  const pulseColor = theme.palette.primary.light
  const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 ${pulseColor};
  }
  70% {
    box-shadow: 0 0 15px 1px ${pulseColor};
  }
  100% {
    box-shadow: 0 0 0 0 ${pulseColor};
  }
`
  const finalOres = ores || []
  const oreNames =
    finalOres.length > 1 ? finalOres.map((o) => o.slice(0, 3)).join(', ') : finalOres[0] ? finalOres[0] : '???'

  let opacity = 1
  const badStates: ScoutingFindStateEnum[] = [ScoutingFindStateEnum.Abandonned, ScoutingFindStateEnum.Depleted]
  if (badStates.includes(scoutingFind.state)) {
    opacity = 0.5
  }
  const hasNote = scoutingFind.note && scoutingFind.note.trim().length > 0

  return (
    <ThemeProvider theme={theme}>
      <Card
        elevation={5}
        onContextMenu={handleContextMenu}
        sx={{
          border: '1px solid',
          position: 'relative',
          color: theme.palette.primary.main,
          opacity,
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
          backgroundColor: '#121212',
          borderRadius: 3,
          height: 150,
          width: 150,
          overflow: 'visible',
          animation: doPulse ? `${pulse} 2s infinite ease` : '',
          boxShadow: doPulse ? `0 0 5px 1px ${pulseColor}` : '',
        }}
      >
        {/* THis is the cluster id  */}

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            width: '100%',
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            fontFamily: fontFamilies.robotoMono,
            background: theme.palette.primary.contrastText,
            borderBottom: `1px solid ${theme.palette.primary.main}55`,
            borderRadius: 0,
            textAlign: 'left',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            px: 1,
            py: 0.2,
            fontSize: 16,
          }}
        >
          {makeHumanIds(getSafeName(scoutingFind.owner?.scName), scoutingFind.scoutingFindId)}
        </Box>

        {/* The icon with the number (Absolute) */}
        <Tooltip title="Cluster Size">
          <Avatar
            sx={{
              // zIndex: 10,
              position: 'absolute',
              top: -5,
              right: -7,
              transform: 'translateY(-50%)',
              fontWeight: 'bold',
              background: 'black',
              border: `2px solid ${theme.palette.primary.main}`,
              color: theme.palette.primary.main,
              overflow: 'visible',
              width: 38,
              height: 38,
              fontSize: ((scoutingFind.clusterCount as number) || 0) < 10 ? 30 : 23,
              mx: 'auto',
              my: 2,
            }}
          >
            {(scoutingFind.clusterCount as number) > 0 ? scoutingFind.clusterCount : '?'}
            {/* The number of rocks */}

            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '-25%',
                transform: 'translateY(-50%) translateX(-50%)',
                // zIndex: 1000,
                height: '27px',
                width: '27px',
                color: '#000000',
                background: theme.palette.primary.main,
                borderRadius: '50%',
                textAlign: 'center',
              }}
            >
              <Icon
                color="inherit"
                sx={{
                  fontSize: 23,
                }}
              />
            </Box>
          </Avatar>
        </Tooltip>
        <Box
          sx={{
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Give our icon some space! */}
          <Box sx={{ flex: '0 0 40px' }} />

          <Typography
            sx={{
              position: 'absolute',
              opacity: 0.5,
              top: 25,
              left: 5,
              fontSize: '0.75rem',
            }}
          >
            {Date.now() - scoutingFind.createdAt > 12 * 1000 * 60 * 60
              ? dayjs(scoutingFind.createdAt).from(dayjs(Date.now()))
              : dayjs(scoutingFind.createdAt).from(dayjs(Date.now()))}
          </Typography>

          {/* ORES */}
          <Typography
            gutterBottom
            sx={{
              flex: '0 0 auto',
              px: 1,
              py: 0.5,
              textAlign: 'center',
              opacity: finalOres.length > 0 ? 1 : 0.5,
              display: 'block',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {oreNames}
          </Typography>

          {/* WHo was the scout */}
          {scoutingFind.owner?.scName && (
            <Tooltip title={`${getSafeName(scoutingFind.owner?.scName)} found this cluster`}>
              <Typography
                component="div"
                sx={{
                  overflow: 'hidden',
                  flex: '0 0 auto',
                  px: 1,
                  py: 0.3,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  textAlign: 'center',
                  borderTop: `1px solid`,
                  borderBottom: `1px solid`,
                  display: 'block',
                  fontSize: '0.875rem',
                }}
              >
                <PersonSearch sx={{ fontSize: '0.875rem', mb: -0.2 }} /> {getSafeName(scoutingFind.owner?.scName)}
              </Typography>
            </Tooltip>
          )}
          <Box sx={{ display: 'flex', px: 1 }}>
            <Tooltip title={`Volume of raw ore scanned by the scout.`}>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  opacity: summary.volume > 0 ? 1 : 0.5,
                  fontFamily: fontFamilies.robotoMono,
                  fontWeight: 'bold',
                  display: 'block',
                  fontSize: 12,
                }}
              >
                {summary.volume > 0 ? MValueFormatter(summary.volume, MValueFormat.volSCU) : '? SCU'}
              </Typography>
            </Tooltip>
            <Box sx={{ flex: '1 1 0%' }} />
            <Tooltip title={`Value of the ore in scanned rocks (aUEC)`}>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  opacity: summary.value > 0 ? 1 : 0.5,
                  fontFamily: fontFamilies.robotoMono,
                  fontWeight: 'bold',
                  display: 'block',
                  fontSize: 12,
                }}
              >
                {summary.value > 0 ? MValueFormatter(summary.value, MValueFormat.currency_sm) : '??? aUEC'}
              </Typography>
            </Tooltip>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              fontWeight: 'bold',
              color: theme.palette.primary.main,

              display: 'flex',
              background: theme.palette.primary.contrastText,
              borderRadius: 0,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,

              px: 1,
              py: 0,
              fontSize: 10,
              textTransform: 'uppercase',
            }}
          >
            <Box>{getScoutingFindStateName(scoutingFind.state)}</Box>
            <Box sx={{ flex: '1 1' }} />
            {/* The spaceships (Absolute) */}
            {hasNote && (
              <Tooltip title={`Note: ${scoutingFind.note}`}>
                <Article sx={{ color: yellow[500], fontSize: 14, lineHeight: 10, mx: 0.2 }} />
              </Tooltip>
            )}

            <Box sx={{ flex: '1 1' }} />
            {attendanceCount > 0 && (
              <Tooltip title={`${attendanceCount} Ships on site`}>
                <Box sx={{}}>
                  {attendanceCount < 4 ? (
                    Array.from({ length: attendanceCount }, (_, idx) => (
                      <Rocket key={`rocket-${idx}`} color="inherit" sx={{ fontSize: 14, lineHeight: 10 }} />
                    ))
                  ) : (
                    <Typography sx={{ fontSize: 10 }}>
                      {attendanceCount}
                      <Rocket color="inherit" sx={{ fontSize: 14, lineHeight: 10 }} />
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Card>
    </ThemeProvider>
  )
}
