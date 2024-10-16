import * as React from 'react'
import { useTheme, Typography, Paper, Toolbar } from '@mui/material'
import {
  ActivityEnum,
  calculateWorkOrder,
  getTimezoneStr,
  makeHumanIds,
  WorkOrder,
  WorkOrderSummary,
} from '@regolithco/common'
import dayjs from 'dayjs'

import { ExpensesSharesCard } from '../calculators/WorkOrderCalc/WorkOrderCards/ExpensesSharesCard'
import { noop } from 'lodash'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { OreCard } from '../calculators/WorkOrderCalc/WorkOrderCards/OreCard'
import { Stack, SxProps, Theme } from '@mui/system'
import { AccountBalance, SvgIconComponent } from '@mui/icons-material'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { fontFamilies } from '../../theme'
import { AppContext } from '../../context/app.context'
import { LookupsContext } from '../../context/lookupsContext'

export type WorkOrderShareSettings = {
  hideNames?: boolean
  hideAvatars?: boolean
}

export interface WorkOrderShareProps {
  workOrder: WorkOrder
  settings?: WorkOrderShareSettings
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

export const WorkOrderShare: React.FC<WorkOrderShareProps> = ({ workOrder, settings }) => {
  const theme = useTheme()
  const styles = workOrderStylesThunk(theme)
  const [summary, setSummary] = React.useState<WorkOrderSummary>()
  const { getSafeName } = React.useContext(AppContext)

  const dataStore = React.useContext(LookupsContext)

  React.useEffect(() => {
    if (!dataStore.ready) return
    calculateWorkOrder(dataStore, workOrder).then((newSumm) => {
      setSummary(newSumm)
    })
  }, [workOrder, dataStore.ready])

  if (!dataStore.ready) return null

  let WorkIcon: SvgIconComponent
  let title = ''
  if (!workOrder) return null
  switch (workOrder.orderType) {
    case ActivityEnum.Salvage:
      title = 'Salvage Work Order'
      WorkIcon = ClawIcon
      break
    case ActivityEnum.ShipMining:
      title = 'Ship Mining Work Order'
      WorkIcon = RockIcon
      break
    case ActivityEnum.VehicleMining:
      title = 'Vehicle Mining Work Order'
      WorkIcon = GemIcon
      break
    case ActivityEnum.Other:
      title = 'Share aUEC Work Order'
      WorkIcon = AccountBalance
      break
    default:
      return <>DisplayError</>
  }
  if (!summary || !summary) return null
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
        <WorkIcon color="inherit" fontSize="large" sx={styles.icon} />
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
            {title}
          </Typography>
          <Typography component="div" sx={{ py: 0, pl: 5, fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}>
            ID: {makeHumanIds(getSafeName(workOrder.sellerscName || workOrder.owner?.scName), workOrder.orderId)}
          </Typography>
        </Stack>

        <Stack>
          <Typography component="div" sx={{ py: 0, pl: 5, fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}>
            Created By: {getSafeName(workOrder.owner?.scName)}
          </Typography>
          {workOrder.sellerscName && (
            <Typography component="div" sx={{ py: 0, pl: 5, fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}>
              {' '}
              Seller: {getSafeName(workOrder.sellerscName)}
            </Typography>
          )}
          <Typography
            component="div"
            variant="caption"
            sx={{ py: 0, pl: 5, fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}
          >
            {dayjs(workOrder.createdAt).format('MMM D YYYY, h:mm a')} ({getTimezoneStr()})
          </Typography>
        </Stack>
      </Toolbar>
      <Grid container spacing={2} sx={styles.container}>
        <Grid xs={5} sx={styles.gridCss}>
          <OreCard onChange={noop} isShare summary={summary} workOrder={workOrder} sx={styles.cardCss} />
        </Grid>
        <Grid xs={7} sx={styles.gridCss}>
          <ExpensesSharesCard onChange={noop} isShare summary={summary} workOrder={workOrder} sx={styles.cardCss} />
        </Grid>
      </Grid>
    </Paper>
  )
}
