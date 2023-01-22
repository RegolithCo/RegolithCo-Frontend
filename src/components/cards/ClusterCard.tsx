import * as React from 'react'
import Card from '@mui/material/Card'
import { keyframes } from '@mui/system'
import { Avatar, Box, ThemeProvider, Tooltip, Typography, useTheme } from '@mui/material'
import { PersonSearch, Rocket, SvgIconComponent } from '@mui/icons-material'
import {
  clusterCalc,
  SalvageFind,
  ScoutingFind,
  ScoutingFindStateEnum,
  getScoutingFindStateName,
  ScoutingFindTypeEnum,
  ShipClusterFind,
  VehicleClusterFind,
} from '@regolithco/common'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { fontFamilies, scoutingFindStateThemes } from '../../theme'
import { MValueFormat, MValueFormatter } from '../fields/MValue'

export interface ClusterCardProps {
  clusterFind: ScoutingFind
}

export const ClusterCard: React.FC<ClusterCardProps> = ({ clusterFind }) => {
  const theme = scoutingFindStateThemes[clusterFind.state]
  const summary = clusterCalc(clusterFind)
  const ores = summary.oreSort || []
  const findType = clusterFind.clusterType
  const attendanceCount = clusterFind.attendanceIds?.length || 0

  // Conveneince variables
  const shipFind = clusterFind as ShipClusterFind
  const vehicleFind = clusterFind as VehicleClusterFind
  const salvageFind = clusterFind as SalvageFind

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

  const doPulse = clusterFind.state === ScoutingFindStateEnum.ReadyForWorkers
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
  if (badStates.includes(clusterFind.state)) {
    opacity = 0.5
  }

  return (
    <ThemeProvider theme={theme}>
      <Card
        elevation={5}
        sx={{
          border: '1px solid',
          position: 'relative',
          color: theme.palette.primary.main,
          opacity,
          borderColor: theme.palette.primary.dark,
          borderWidth: 3,
          backgroundColor: theme.palette.primary.contrastText,
          borderRadius: 2,
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
            borderRadius: 0,
            textAlign: 'left',
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            px: 1,
            py: 0.2,
            fontSize: 16,
          }}
        >
          {clusterFind.scoutingFindId.split('_')[0]}
        </Box>

        {/* The icon with the number (Absolute) */}
        <Avatar
          sx={{
            // zIndex: 10,
            position: 'absolute',
            top: -2,
            right: '-4%',
            transform: 'translateY(-50%)',
            fontWeight: 'bold',
            background: 'black',
            border: `2px solid ${theme.palette.primary.main}`,
            color: theme.palette.primary.main,
            overflow: 'visible',
            width: 38,
            height: 38,
            fontSize: ((clusterSize as number) || 0) < 10 ? 30 : 23,
            mx: 'auto',
            my: 2,
          }}
        >
          {(clusterSize as number) > 0 ? clusterSize : '?'}
          {/* The number of rocks */}
          <Tooltip title="Cluster Size">
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
          </Tooltip>
        </Avatar>
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

          {/* ORES */}
          <Typography
            gutterBottom
            sx={{
              flex: '0 0 auto',
              px: 1,
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
          {clusterFind.owner?.scName && (
            <Tooltip title={`${clusterFind.owner?.scName} found this cluster`}>
              <Typography
                component="div"
                sx={{
                  overflow: 'hidden',
                  flex: '0 0 auto',
                  px: 1,
                  py: 1,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  textAlign: 'left',
                  borderTop: `1px solid`,
                  borderBottom: `1px solid`,
                  display: 'block',
                  fontSize: 14,
                }}
              >
                <PersonSearch sx={{ fontSize: '0.9rem' }} /> {clusterFind.owner?.scName}
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
                  opacity: summary.potentialProfit > 0 ? 1 : 0.5,
                  fontFamily: fontFamilies.robotoMono,
                  fontWeight: 'bold',
                  display: 'block',
                  fontSize: 12,
                }}
              >
                {summary.potentialProfit > 0
                  ? MValueFormatter(summary.potentialProfit, MValueFormat.currency_sm)
                  : '??? aUEC'}
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
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,

              px: 1,
              py: 0,
              fontSize: 10,
              textTransform: 'uppercase',
            }}
          >
            <Box>{getScoutingFindStateName(clusterFind.state)}</Box>
            {/* The spaceships (Absolute) */}
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
