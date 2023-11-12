import * as React from 'react'
import { useTheme, Typography, Paper, Toolbar } from '@mui/material'
import {
  SalvageFind,
  ScoutingFind,
  ScoutingFindStateEnum,
  ScoutingFindTypeEnum,
  ShipClusterFind,
  VehicleClusterFind,
} from '@regolithco/common'
import dayjs from 'dayjs'

import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Stack, SxProps, Theme, ThemeProvider } from '@mui/system'
import { SvgIconComponent } from '@mui/icons-material'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { fontFamilies, scoutingFindStateThemes } from '../../theme'
import { ScoutingFindCalc } from '../calculators/ScoutingFindCalc'

export type ClusterShareSettings = {
  hideNames?: boolean
  hideAvatars?: boolean
}

export interface ClusterShareProps {
  scoutingFind: ScoutingFind
  settings?: ClusterShareSettings
}

const workOrderStylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  container: {
    [theme.breakpoints.up('md')]: {
      flex: '1 1',
    },
  },
  cardCss: {
    border: `1px solid #444444`,
    [theme.breakpoints.up('md')]: {
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: 600,
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
      border: `None`,
    },
  },
  gridCss: {
    [theme.breakpoints.up('md')]: {
      height: '100%',
    },
  },
})

export const ClusterShare: React.FC<ClusterShareProps> = ({ scoutingFind, settings }) => {
  const [theme, setTheme] = React.useState<Theme>(
    scoutingFindStateThemes[scoutingFind.state || ScoutingFindStateEnum.Discovered]
  )
  const styles = workOrderStylesThunk(theme)

  // Convenience type guards
  const shipFind = scoutingFind as ShipClusterFind
  const vehicleFind = scoutingFind as VehicleClusterFind
  const salvageFind = scoutingFind as SalvageFind

  let Icon: SvgIconComponent = ClawIcon
  let itemName = ''
  let hasScans = false
  // let scanComplete = false
  let numScans = 0
  const clusterCount = scoutingFind.clusterCount || 0
  const plural = scoutingFind?.clusterCount && scoutingFind.clusterCount > 1
  switch (scoutingFind.clusterType) {
    case ScoutingFindTypeEnum.Salvage:
      hasScans = salvageFind.wrecks && salvageFind.wrecks.length > 0
      // scanComplete = hasScans && hasCount && salvageFind.wrecks.length === scoutingFind.clusterCount
      numScans = hasScans ? salvageFind.wrecks.length : 0
      Icon = ClawIcon
      itemName = plural ? 'Wrecks' : 'Wreck'
      break
    case ScoutingFindTypeEnum.Ship:
      hasScans = shipFind.shipRocks && shipFind.shipRocks.length > 0
      // scanComplete = hasScans && hasCount && shipFind.shipRocks.length === scoutingFind.clusterCount
      numScans = hasScans ? shipFind.shipRocks.length : 0
      Icon = RockIcon
      itemName = plural ? 'Rocks' : 'Rock'
      break
    case ScoutingFindTypeEnum.Vehicle:
      hasScans = vehicleFind.vehicleRocks && vehicleFind.vehicleRocks.length > 0
      // scanComplete = hasScans && hasCount && vehicleFind.vehicleRocks.length === scoutingFind.clusterCount
      numScans = hasScans ? vehicleFind.vehicleRocks.length : 0
      Icon = GemIcon
      itemName = plural ? 'Gems' : 'Gem'
      break
  }

  return (
    <Paper elevation={11} sx={{ p: 2 }}>
      <Toolbar
        sx={{
          borderRadius: 2,
          mb: 2,
          flex: '0 0',
          fontFamily: fontFamilies.robotoMono,
          bgcolor: theme.palette.secondary.light,
          color: theme.palette.secondary.contrastText,
          // mb: 2,
        }}
      >
        <Icon color="inherit" fontSize="large" sx={styles.icon} />
        <Stack>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              fontWeight: 700,
              py: 0,
              pl: 5,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Scouting
          </Typography>
          <Typography component="div" sx={{ py: 0, pl: 5, fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}>
            {/* ID: {makeHumanIds(workOrder.sellerscName || workOrder.owner?.scName, workOrder.orderId)} */}
          </Typography>
        </Stack>

        <Stack>
          <Typography component="div" sx={{ py: 0, pl: 5, fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}>
            Found By: {scoutingFind.owner?.scName}
          </Typography>
          <Typography
            component="div"
            variant="caption"
            sx={{ py: 0, pl: 5, fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}
          >
            {dayjs(scoutingFind.createdAt).format('MMM D YYYY, h:mm a')} (
            {new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2]})
          </Typography>
        </Stack>
      </Toolbar>
      <ThemeProvider theme={theme}>
        <ScoutingFindCalc scoutingFind={scoutingFind} isShare />
      </ThemeProvider>
    </Paper>
  )
}
