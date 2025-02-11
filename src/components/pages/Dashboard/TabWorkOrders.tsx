import * as React from 'react'

import {
  ActivityEnum,
  getRefineryName,
  getShipOreAbbrev,
  getShipOreName,
  makeHumanIds,
  RefineryEnum,
  ShipMiningOrder,
  WorkOrder,
  WorkOrderStateEnum,
  WorkOrderSummary,
} from '@regolithco/common'
import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { alpha, Box, Stack } from '@mui/system'
import { fontFamilies } from '../../../theme'
import { WorkOrderTable } from '../SessionPage/WorkOrderTable'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { Done, DoneAll, OpenInNew } from '@mui/icons-material'
import { DashboardProps } from './Dashboard'
import { AppContext } from '../../../context/app.context'
import { useShipOreColors } from '../../../hooks/useShipOreColors'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { RefineryIcon } from '../../fields/RefineryIcon'
import dayjs from 'dayjs'
import { WorkOrderTableColsEnum } from '../SessionPage/WorkOrderTableRow'
import { FetchMoreSessionLoader, FetchMoreWithDate } from './FetchMoreSessionLoader'
import { CountdownTimer } from '../../calculators/WorkOrderCalc/CountdownTimer'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'

export const TabWorkOrders: React.FC<DashboardProps> = ({
  userProfile,
  mySessions,
  joinedSessions,
  allLoaded,
  loading,
  paginationDate,
  workOrderSummaries,
  fetchMoreSessions,
  deliverWorkOrders,
}) => {
  const theme = useTheme()
  const { getSafeName } = React.useContext(AppContext)
  const sortedShipRowColors = useShipOreColors()
  const { workOrders, workOrdersByDate } = React.useMemo(() => {
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
    ].filter((wo) => (wo.sellerscName && wo.sellerscName === userProfile.scName) || wo.ownerId === userProfile.userId)
    // sort by date descending
    workOrders.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))

    const today = dayjs()
    const woByDate: WorkOrder[][] = []
    let currYear = today.year()
    let currMonth = today.month()
    let yearMonthArr: WorkOrder[] = []

    workOrders.forEach((workOrder) => {
      const woDate = dayjs(workOrder.createdAt)
      const woYear = woDate.year()
      const woMonth = woDate.month()
      const woDay = woDate.date()
      if (woYear === currYear && woMonth === currMonth) {
        yearMonthArr.push(workOrder)
      } else {
        woByDate.push(yearMonthArr)
        yearMonthArr = []
        currYear = woYear
        currMonth = woMonth
      }
    })

    return { workOrders, workOrdersByDate: woByDate }
  }, [joinedSessions, mySessions])

  const undeliveredWorkOrders: Record<RefineryEnum, ShipMiningOrder[]> = React.useMemo(() => {
    const orders = workOrders
      .filter(
        (wo) =>
          wo.orderType === ActivityEnum.ShipMining &&
          (wo as ShipMiningOrder).refinery &&
          wo.state !== WorkOrderStateEnum.Failed &&
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

  return (
    <Box>
      <Card
        elevation={6}
        sx={{
          // p: 3,
          // pb: 2,
          mb: 5,
          borderRadius: 7,
          // backgroundColor: '#282828',
          display: 'flex',
          flexDirection: 'column',
          border: `8px solid ${theme.palette.primary.main}`,
        }}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{
            px: 3,
            py: 2,
            backgroundColor: theme.palette.primary.main,
          }}
        >
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            sx={{
              color: theme.palette.primary.contrastText,
              fontFamily: fontFamilies.robotoMono,
              fontWeight: 'bold',
            }}
          >
            {Object.values(undeliveredWorkOrders).reduce((acc, orders) => acc + orders.length, 0)} active work orders in{' '}
            {Object.keys(undeliveredWorkOrders).length} Refineries
          </Typography>
          {loading && (
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <CircularProgress color="error" size={24} />
              <Typography variant="overline" sx={{ color: theme.palette.primary.contrastText }}>
                Loading...
              </Typography>
            </Stack>
          )}
        </Stack>
        <CardContent>
          <Divider />
          <Box sx={{ minHeight: 100, minWidth: 250 }}>
            {Object.keys(undeliveredWorkOrders).length === 0 ? (
              <Typography variant="body1" component="div" gutterBottom>
                No undelivered work orders
              </Typography>
            ) : (
              <SimpleTreeView sx={{ my: 2 }} disabledItemsFocusable disableSelection>
                {Object.entries(undeliveredWorkOrders).map(([refinery, orders]) => {
                  const uniqueSessions = Array.from(new Set(orders.map((wo) => wo.sessionId))).length
                  const totalSCU: number = orders.reduce((acc, wo) => {
                    const woYield =
                      workOrderSummaries[wo.sessionId] && workOrderSummaries[wo.sessionId][wo.orderId]
                        ? workOrderSummaries[wo.sessionId][wo.orderId].yieldSCU
                        : 0
                    return acc + woYield
                  }, 0)
                  const deliverableWorkOrders = orders.filter((wo) => {
                    try {
                      const woLookup = workOrderSummaries[wo.sessionId][wo.orderId]
                      return !woLookup.completionTime || woLookup.completionTime < Date.now()
                    } catch (e) {
                      console.log(e)
                      return false
                    }
                  })

                  return (
                    <TreeItem
                      key={refinery}
                      itemId={refinery}
                      sx={{
                        borderBottom: `2px solid tramsparent`,

                        // zebra stripe
                        '&:nth-child(odd)': {
                          backgroundColor: alpha(theme.palette.background.default, 0.5),
                        },
                        // Expanded items get a border
                        '&>.Mui-expanded': {
                          borderBottom: `2px solid ${theme.palette.primary.main}`,
                        },
                        '& .MuiCollapse-wrapperInner': {
                          pb: 3,
                        },
                      }}
                      label={
                        <Stack alignItems="center" direction={'row'} spacing={2}>
                          <Box sx={{ flex: '0 0' }}>
                            <RefineryIcon shortName={refinery} />
                          </Box>
                          <Tooltip title={getRefineryName(refinery as RefineryEnum)} placement="top">
                            <Typography
                              sx={{
                                flex: '1 1 30%',
                                fontFamily: fontFamilies.robotoMono,
                                fontWeight: 'bold',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {getRefineryName(refinery as RefineryEnum)}
                            </Typography>
                          </Tooltip>
                          <Typography
                            variant="caption"
                            sx={{
                              flex: '1 1 30%',
                              fontFamily: fontFamilies.robotoMono,
                              fontWeight: 'bold',
                              '& span': {
                                color: theme.palette.secondary.dark,
                              },
                            }}
                          >
                            <span>{totalSCU}</span> SCU from <span>{orders.length}</span> order(s) in{' '}
                            <span>{uniqueSessions}</span> session(s)
                          </Typography>
                          <Box sx={{ flexGrow: 1 }} />
                          <Tooltip
                            title={`Mark ${deliverableWorkOrders.length} / ${orders.length} deliverable work orders as SOLD`}
                            placement="top"
                          >
                            <span>
                              <Button
                                variant="contained"
                                size="small"
                                color="secondary"
                                disabled={loading || deliverableWorkOrders.length === 0}
                                startIcon={<DoneAll />}
                                onClick={() => {
                                  deliverWorkOrders(deliverableWorkOrders)
                                }}
                              >
                                Mark All SOLD
                              </Button>
                            </span>
                          </Tooltip>
                        </Stack>
                      }
                    >
                      {orders.map((order) => {
                        let lookupVal: WorkOrderSummary | null = null
                        try {
                          lookupVal = workOrderSummaries[order.sessionId][order.orderId]
                        } catch {
                          console.log('Error looking up order summary')
                        }
                        const completionTime = lookupVal?.completionTime || 0
                        const isProcessing = completionTime && completionTime > Date.now()
                        if (!lookupVal?.yieldSCU) return null
                        return (
                          <TreeItem
                            key={order.orderId}
                            itemId={order.orderId}
                            sx={{
                              opacity: isProcessing ? 0.5 : 1,
                              backgroundColor: isProcessing ? alpha(theme.palette.warning.dark, 0.2) : 'transparent',
                            }}
                            label={
                              <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                <Tooltip title={dayjs(order.createdAt).format('LLL')} placement="top">
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontFamily: fontFamilies.robotoMono,
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {/* In the format: May 14 */}
                                    {dayjs(order.createdAt).format('MMM D')}
                                  </Typography>
                                </Tooltip>

                                <Tooltip title="Open this work order in a new tab" placement="top">
                                  <IconButton
                                    color="primary"
                                    href={`/session/${order.sessionId}/dash/w/${order.orderId}`}
                                    target="_blank"
                                  >
                                    <OpenInNew />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Go to this work order" placement="top">
                                  <Link
                                    href={`/session/${order.sessionId}/dash/w/${order.orderId}`}
                                    sx={{
                                      flex: '0 1 10%',
                                      fontFamily: fontFamilies.robotoMono,
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    <Typography variant="subtitle1">
                                      {makeHumanIds(
                                        getSafeName(order.sellerscName || order.owner?.scName),
                                        order.orderId
                                      )}
                                    </Typography>
                                  </Link>
                                </Tooltip>
                                <Tooltip title="Ore Yields to be picked up" placement="top">
                                  <Typography variant="caption">
                                    {MValueFormatter(lookupVal?.yieldSCU || 0, MValueFormat.volSCU, 0)}
                                  </Typography>
                                </Tooltip>
                                <Grid2 sx={{ flex: '0 1 60%' }} container spacing={1}>
                                  {totalSCU === 0 && (
                                    <Typography variant="caption" color="error">
                                      No Ore Listed
                                    </Typography>
                                  )}
                                  {sortedShipRowColors.map((color) => {
                                    const ore = order.shipOres.find((ore) => ore.ore === color.ore)
                                    if (!ore || ore.amt <= 0) return null
                                    const finalAmt = lookupVal.oreSummary[ore.ore]?.refined || ore.amt
                                    const label = `${getShipOreAbbrev(ore.ore, 4)}: ${Math.ceil(finalAmt / 100)} SCU`
                                    const labelLong = `${getShipOreName(ore.ore)}: ${Math.ceil(finalAmt / 100)} SCU`
                                    return (
                                      <Grid2 key={ore.ore}>
                                        <Tooltip title={labelLong} placement="top">
                                          <Chip
                                            label={label}
                                            size="small"
                                            sx={{
                                              borderRadius: 1.5,
                                              minWidth: 110,
                                              color: color.fg,
                                              border: `1px solid ${color.fg}`,
                                              width: '100%',
                                              fontSize: '0.75rem',
                                              backgroundColor: alpha(color.bg, 0.8),
                                              textTransform: 'uppercase',
                                              fontFamily: fontFamilies.robotoMono,
                                              fontWeight: 'bold',
                                            }}
                                          />
                                        </Tooltip>
                                      </Grid2>
                                    )
                                  })}
                                </Grid2>
                                <Box sx={{ flexGrow: 1 }} />
                                {isProcessing ? (
                                  <Stack alignItems={'center'}>
                                    <Typography
                                      variant="caption"
                                      color="warning"
                                      sx={{
                                        fontFamily: fontFamilies.robotoMono,
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      Refinining
                                    </Typography>
                                    <CountdownTimer
                                      typoProps={{
                                        variant: 'caption',
                                        color: 'warning',
                                        sx: {
                                          fontFamily: fontFamilies.robotoMono,
                                          fontWeight: 'bold',
                                        },
                                      }}
                                      startTime={order.processStartTime as number}
                                      totalTime={(order.processDurationS || 0) * 1000}
                                      useMValue
                                    />
                                  </Stack>
                                ) : (
                                  <Tooltip title="Mark only THIS ONE work order as SOLD" placement="top">
                                    <span>
                                      <Button
                                        variant="contained"
                                        size="small"
                                        color="secondary"
                                        startIcon={<Done />}
                                        disabled={loading}
                                        onClick={() => deliverWorkOrders([order])}
                                      >
                                        Mark Sold
                                      </Button>
                                    </span>
                                  </Tooltip>
                                )}
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
        </CardContent>
        <FetchMoreWithDate
          sx={{
            background: theme.palette.background.default,
            borderTop: `3px solid ${theme.palette.primary.main}`,
            textAlign: 'right',
            p: 2,
            mt: 1,
          }}
          loading={loading}
          allLoaded={allLoaded}
          fetchMoreSessions={fetchMoreSessions}
          paginationDate={paginationDate}
        />
      </Card>
      <Box sx={{ mt: 7 }}>
        <Typography
          variant="h4"
          component="h4"
          gutterBottom
          sx={{
            color: 'secondary.dark',
            fontFamily: fontFamilies.robotoMono,
            borderBottom: `4px solid ${theme.palette.secondary.dark}`,
            fontWeight: 'bold',
          }}
        >
          Work Order timeline
        </Typography>
        <Alert elevation={1} variant="standard" severity="info" sx={{ my: 2, flex: 1 }}>
          <AlertTitle>Work orders from all your sessions</AlertTitle>
          <Typography>
            All work orders inside all your joined sessions that you either <strong>own</strong> or have been marked as
            the <strong>seller</strong>.
          </Typography>
        </Alert>

        {workOrdersByDate.map((yearMonthArr, idx) => {
          return <WorkOrderListMonth key={`yearMonth-${idx}`} yearMonthArr={yearMonthArr} activeOnly={false} />
        })}
        <FetchMoreSessionLoader loading={loading} allLoaded={allLoaded} fetchMoreSessions={fetchMoreSessions} />
      </Box>
    </Box>
  )
}

export interface WorkOrderListMonthProps {
  yearMonthArr: WorkOrder[]
  activeOnly?: boolean
}

export const WorkOrderListMonth: React.FC<WorkOrderListMonthProps> = ({ yearMonthArr, activeOnly }) => {
  const theme = useTheme()

  if (yearMonthArr.length === 0) return
  const currHeading = dayjs(yearMonthArr[0].createdAt).format('YYYY - MMMM')

  return (
    <Box sx={{ mb: 5, border: '1px solid transparent', borderRadius: 3, overflow: 'hidden' }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: 'left',
          // background: alpha(theme.palette.background.paper, 0.5),
          p: 2,
          fontWeight: 'bold',
          backgroundColor: theme.palette.secondary.dark,
          fontFamily: fontFamilies.robotoMono,
          color: theme.palette.secondary.contrastText,
        }}
      >
        {currHeading}
      </Typography>
      <WorkOrderTable
        sessionActive
        reverse
        workOrders={yearMonthArr}
        columns={[
          WorkOrderTableColsEnum.Session,
          WorkOrderTableColsEnum.Activity,
          WorkOrderTableColsEnum.Refinery,
          WorkOrderTableColsEnum.OrderId,
          // WorkOrderTableColsEnum.Shares,
          WorkOrderTableColsEnum.Ores,
          WorkOrderTableColsEnum.Volume,
          WorkOrderTableColsEnum.Gross,
          // WorkOrderTableColsEnum.Net,
          WorkOrderTableColsEnum.FinishedTime,
          // WorkOrderTableColsEnum.Sold,
          // WorkOrderTableColsEnum.Paid,
        ]}
      />
    </Box>
  )
}
