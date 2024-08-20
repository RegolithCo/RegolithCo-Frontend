import * as React from 'react'

import {
  ActivityEnum,
  getRefineryName,
  getShipOreName,
  makeHumanIds,
  RefineryEnum,
  ShipMiningOrder,
  WorkOrder,
  WorkOrderStateEnum,
} from '@regolithco/common'
import { Alert, AlertTitle, Button, Chip, Divider, Typography, useTheme } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { fontFamilies } from '../../../theme'
import { WorkOrderTable } from '../SessionPage/WorkOrderTable'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { DoneAll } from '@mui/icons-material'
import { DashboardProps } from './Dashboard'
import log from 'loglevel'
import { AppContext } from '../../../context/app.context'
import { useShipOreColors } from '../../../hooks/useShipOreColors'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'

export const TabWorkOrders: React.FC<DashboardProps> = ({
  userProfile,
  mySessions,
  joinedSessions,
  allLoaded,
  loading,
  navigate,
}) => {
  const theme = useTheme()
  const { getSafeName } = React.useContext(AppContext)
  const sortedShipRowColors = useShipOreColors()
  const workOrders: WorkOrder[] = React.useMemo(() => {
    const workOrders = [
      ...joinedSessions.reduce(
        (acc, session) =>
          acc.concat(
            session.workOrders?.items.map((wo) => {
              const { workOrders, ...rest } = session
              return { ...wo, session: rest }
            }) || []
          ),
        [] as WorkOrder[]
      ),
      ...mySessions.reduce(
        (acc, session) =>
          acc.concat(
            session.workOrders?.items.map((wo) => {
              const { workOrders, ...rest } = session
              return { ...wo, session: rest }
            }) || []
          ),
        [] as WorkOrder[]
      ),
    ]
    // sort by date descending
    workOrders.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
    return workOrders
  }, [joinedSessions, mySessions])
  const undeliveredWorkOrders: Record<RefineryEnum, ShipMiningOrder[]> = React.useMemo(() => {
    const orders = workOrders
      .filter(
        (wo) =>
          wo.orderType === ActivityEnum.ShipMining &&
          (wo as ShipMiningOrder).refinery &&
          wo.state !== WorkOrderStateEnum.Failed &&
          wo.state !== WorkOrderStateEnum.RefiningStarted &&
          !wo.isSold
      )
      .map((wo) => wo as ShipMiningOrder)
    const grouped = orders.reduce(
      (acc, wo) => {
        const refinery = wo.refinery as RefineryEnum
        if (!acc[refinery]) acc[refinery] = []
        acc[refinery].push(wo)
        return acc
      },
      {} as Record<RefineryEnum, ShipMiningOrder[]>
    )
    return grouped
  }, [workOrders])

  log.debug('workOrders', workOrders, undeliveredWorkOrders)
  return (
    <>
      <Stack
        spacing={2}
        sx={{ my: 2, borderBottom: `2px solid ${theme.palette.secondary.dark}` }}
        direction={{ xs: 'column', sm: 'row' }}
      >
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            color: 'secondary.dark',
            fontFamily: fontFamilies.robotoMono,
            fontWeight: 'bold',
          }}
        >
          My Work Orders
        </Typography>
      </Stack>
      <Stack spacing={2} sx={{ my: 2 }} direction={{ xs: 'column', sm: 'row' }}>
        <Alert elevation={6} variant="outlined" severity="info" sx={{ my: 2, flex: '1 1 50%' }}>
          <AlertTitle>Work orders from all your sessions</AlertTitle>
          <Typography>
            All work orders inside all your joined sessions that you either own or have been marked as the seller.
          </Typography>
        </Alert>
      </Stack>

      <Box>
        <Typography variant="h5" component="h3" gutterBottom>
          Undelivered Work Orders (Grouped by refinery)
        </Typography>
        <Typography variant="body1" component="div" gutterBottom>
          These work orders have had their refinery timers run out and are ready to be delivered to market. Note: You
          must use the refinery timer in order to see orders in this list
        </Typography>
        <Divider />
        <Box sx={{ minHeight: 100, minWidth: 250 }}>
          {Object.keys(undeliveredWorkOrders).length === 0 ? (
            <Typography variant="body1" component="div" gutterBottom>
              No undelivered work orders
            </Typography>
          ) : (
            <SimpleTreeView>
              {Object.entries(undeliveredWorkOrders).map(([refinery, orders]) => {
                const totalSCU: number = orders.reduce(
                  (acc, wo) =>
                    acc +
                    wo.shipOres.reduce((acc, { amt }) => {
                      const amount = Math.ceil(amt / 100)
                      return acc + amount
                    }, 0),
                  0
                )
                return (
                  <TreeItem
                    key={refinery}
                    itemId={refinery}
                    label={
                      <Stack justifyContent="space-between" alignItems="center" direction={'row'}>
                        <Typography variant="h6">
                          {getRefineryName(refinery as RefineryEnum)} ({orders.length} orders, {totalSCU} SCU)
                        </Typography>
                        <Button variant="contained" size="small" color="success" startIcon={<DoneAll />}>
                          Mark All Delivered
                        </Button>
                      </Stack>
                    }
                  >
                    {orders.map((order) => {
                      return (
                        <TreeItem
                          key={order.orderId}
                          itemId={order.orderId}
                          label={
                            <Stack direction={'row'} spacing={1}>
                              <Typography variant="subtitle1">
                                {makeHumanIds(getSafeName(order.sellerscName || order.owner?.scName), order.orderId)}
                              </Typography>
                              <Grid2 sx={{ flex: '0 1 60%' }} container spacing={1}>
                                {sortedShipRowColors.map((color) => {
                                  const ore = order.shipOres.find((ore) => ore.ore === color.ore)
                                  if (!ore || ore.amt <= 0) return null
                                  return (
                                    <Grid2 key={ore.ore} xs={3}>
                                      <Chip
                                        label={`${getShipOreName(ore.ore).slice(0, 4)}: ${Math.ceil(ore.amt / 100)} SCU`}
                                        size="small"
                                        sx={{
                                          color: color.fg,
                                          width: '100%',
                                          fontSize: '0.75rem',
                                          backgroundColor: color.bg,
                                          textTransform: 'uppercase',
                                          fontFamily: fontFamilies.robotoMono,
                                          fontWeight: 'bold',
                                        }}
                                      />
                                    </Grid2>
                                  )
                                })}
                              </Grid2>
                              <Box sx={{ flexGrow: 1 }} />
                              <Button variant="contained" size="small" color="success" startIcon={<DoneAll />}>
                                Mark Delivered
                              </Button>
                            </Stack>
                          }
                        />
                      )
                    })}
                  </TreeItem>
                )
              })}
            </SimpleTreeView>
          )}
        </Box>
      </Box>
      <Box>
        <Typography variant="h5" component="h3" gutterBottom>
          All Work Orders (Grouped by month)
        </Typography>
        <WorkOrderTable workOrders={workOrders} isDashboard />
      </Box>
    </>
  )
}
