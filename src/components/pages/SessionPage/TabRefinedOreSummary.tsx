import * as React from 'react'

import {
  ActivityEnum,
  AnyOreEnum,
  calculateWorkOrder,
  getOreName,
  ObjectValues,
  SalvageOreEnum,
  Session,
  ShipOreEnum,
  VehicleOreEnum,
  WorkOrderSummary,
} from '@regolithco/common'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
  Stack,
  FormControlLabel,
  Switch,
} from '@mui/material'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { fontFamilies } from '../../../theme'
import { LookupsContext } from '../../../context/lookupsContext'

export interface TabRefinedOreSummaryProps {
  session: Session
  isShare?: boolean
}

type IndexedOreTableRow = { oreEnum: AnyOreEnum; collected: number; refined: number; refinedNoround?: number }
type IndexedOreSummary = Record<AnyOreEnum, IndexedOreTableRow>

const OreSummaryTableColsEnum = {
  Collected: 'Collected',
  Refined: 'Refined',
  Name: 'Name',
} as const
type OreSummaryTableColsEnum = ObjectValues<typeof OreSummaryTableColsEnum>

export const TabRefinedOreSummary: React.FC<TabRefinedOreSummaryProps> = ({ session, isShare }) => {
  const theme = useTheme()
  const dataStore = React.useContext(LookupsContext)
  const [orderSummaries, setOrderSummaries] = React.useState<WorkOrderSummary[]>([])
  const [includeFailed, setIncludeFailed] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (!dataStore || dataStore.loading) return
    async function fetchOrderSummaries() {
      const orderSummaries: WorkOrderSummary[] = []
      for (const wo of session.workOrders?.items || []) {
        if (!includeFailed && wo.failReason) continue // Skip failed work orders
        const summary = await calculateWorkOrder(dataStore, wo)
        orderSummaries.push(summary)
      }
      setOrderSummaries(orderSummaries)
    }
    fetchOrderSummaries()
  }, [session.workOrders?.items, dataStore, includeFailed])

  const dataTable: IndexedOreTableRow[] = React.useMemo(() => {
    const oreSummaries: IndexedOreSummary = (orderSummaries || []).reduce((acc, woSumm, idx) => {
      for (const [oreEnum, { collected, refined }] of Object.entries(woSumm.oreSummary || {})) {
        if (!acc[oreEnum]) {
          acc[oreEnum] = { oreEnum: oreEnum as AnyOreEnum, collected: 0, refined: 0, refinedNoround: 0 }
        }
        acc[oreEnum].collected += collected
        acc[oreEnum].refined += Math.ceil(refined / 100) * 100 // Round up to nearest SCU
        acc[oreEnum].refinedNoround += refined
      }
      return acc
    }, {} as IndexedOreSummary)

    const table = Object.values(oreSummaries)

    return table
      .filter((row) => row.collected > 0 || row.refined > 0)
      .map((row) => ({
        oreEnum: row.oreEnum,
        collected: row.collected,
        refined: row.refined,
        refinedNoround: row.refinedNoround,
      }))
  }, [orderSummaries])

  if (dataTable.length === 0) {
    return (
      <Box sx={{ p: 5 }}>
        <Typography variant="h5" align="center">
          No refined or unrefined ore data available
        </Typography>
      </Box>
    )
  }
  return (
    <Box sx={{ p: 5 }}>
      <FormControlLabel
        sx={{
          py: 1,
          px: 1,
        }}
        checked={includeFailed}
        control={<Switch onChange={(e) => setIncludeFailed(e.target.checked)} />}
        label="Include Failed Work Orders?"
      />
      <OreSummaryTable
        data={dataTable.filter((row) => Object.values(ShipOreEnum).includes(row.oreEnum as ShipOreEnum))}
        activity={ActivityEnum.ShipMining}
      />
      <OreSummaryTable
        data={dataTable.filter((row) => Object.values(VehicleOreEnum).includes(row.oreEnum as VehicleOreEnum))}
        activity={ActivityEnum.VehicleMining}
      />
      <OreSummaryTable
        data={dataTable.filter((row) => Object.values(SalvageOreEnum).includes(row.oreEnum as SalvageOreEnum))}
        activity={ActivityEnum.Salvage}
      />
    </Box>
  )
}

interface OreSummaryTableProps {
  activity: ActivityEnum
  data: IndexedOreTableRow[]
}

const OreSummaryTable: React.FC<OreSummaryTableProps> = ({ data, activity }) => {
  const [sortBy, setSortBy] = React.useState<string>(OreSummaryTableColsEnum.Refined)
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')

  const sortedData = React.useMemo(() => {
    const newTable = [...data]
    newTable.sort((a, b) => {
      if (sortBy === OreSummaryTableColsEnum.Collected) {
        return sortOrder === 'asc' ? a.collected - b.collected : b.collected - a.collected
      }
      if (sortBy === OreSummaryTableColsEnum.Refined) {
        return sortOrder === 'asc' ? a.refined - b.refined : b.refined - a.refined
      }
      if (sortBy === OreSummaryTableColsEnum.Name) {
        return sortOrder === 'asc' ? a.oreEnum.localeCompare(b.oreEnum) : b.oreEnum.localeCompare(a.oreEnum)
      }
      return 0
    })
    return newTable
  }, [data, sortBy, sortOrder])

  if (data.length === 0) return null
  return (
    <Box sx={{ py: 4 }}>
      <Typography
        variant="h5"
        sx={{ fontFamily: fontFamilies.robotoMono, fontWeight: 'bold', mb: 2 }}
        color={'primary'}
      >
        {activity === ActivityEnum.ShipMining && 'Ship Mining'}
        {activity === ActivityEnum.VehicleMining && 'Vehicle Mining'}
        {activity === ActivityEnum.Salvage && 'Salvage'}
      </Typography>
      <TableContainer>
        <Table sx={{ minWidth: 300, maxWidth: 900 }} size="small">
          <TableHead>
            <TableRow>
              <TabScoutingSummaryHeader
                name="Name"
                tooltip="Ore type"
                isSorted={sortBy === OreSummaryTableColsEnum.Name}
                isAsc={sortOrder === 'asc'}
                setSortBy={setSortBy}
                setSortOrder={setSortOrder}
              />
              <TabScoutingSummaryHeader
                name="Collected"
                align="right"
                tooltip={`Total number of "Rocks" + "Wrecks" + "Gems" in all clusters scanned`}
                isSorted={sortBy === OreSummaryTableColsEnum.Collected}
                isAsc={sortOrder === 'asc'}
                setSortBy={setSortBy}
                setSortOrder={setSortOrder}
              />
              {activity === ActivityEnum.ShipMining && (
                <TabScoutingSummaryHeader
                  name="Refined"
                  align="right"
                  tooltip="Total number of clusters scanned"
                  isSorted={sortBy === OreSummaryTableColsEnum.Refined}
                  isAsc={sortOrder === 'asc'}
                  setSortBy={setSortBy}
                  setSortOrder={setSortOrder}
                />
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row, idx) => (
              <TableRow
                key={row.oreEnum || idx}
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: '#00000033',
                  },
                }}
              >
                <TableCell>
                  <Typography variant="h6" sx={{ fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}>
                    {getOreName(row.oreEnum)}
                  </Typography>
                </TableCell>
                <TabVolumeCell value={row.collected} activity={activity} />
                {activity === ActivityEnum.ShipMining && (
                  <TabVolumeCell value={row.refined} activity={activity} rounded />
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {activity === ActivityEnum.ShipMining && (
        <Typography variant="caption" sx={{ mt: 2 }} color={'text.secondary'}>
          Note: The "refined" amount is rounded up to the nearest SCU for every work order.
        </Typography>
      )}
    </Box>
  )
}

const TabVolumeCell: React.FC<{ value: number; activity: ActivityEnum; rounded?: boolean }> = ({
  value,
  activity,
  rounded,
}) => {
  let multiplier = 1
  let formatter: MValueFormat = MValueFormat.volSCU
  switch (activity) {
    case ActivityEnum.ShipMining:
      multiplier = 100 // Ship mining uses SCU
      formatter = MValueFormat.volSCU
      break
    case ActivityEnum.VehicleMining:
      multiplier = 1 // Vehicle mining uses CU
      formatter = MValueFormat.volcSCU
      break
    case ActivityEnum.Salvage:
      multiplier = 100 // Salvage uses SCU
      formatter = MValueFormat.volSCU
      break
    default:
      break
  }
  return (
    <TableCell align={'right'}>
      <Typography sx={{ fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}>
        {MValueFormatter(value / multiplier, formatter, rounded ? 0 : undefined)}
      </Typography>
    </TableCell>
  )
}

interface TabScoutingSummaryHeaderProps {
  name: string
  tooltip: string
  isSorted: boolean
  isAsc: boolean
  align?: 'left' | 'center' | 'right'
  setSortOrder: (order: 'asc' | 'desc') => void
  setSortBy: (sortBy: string) => void
}

const TabScoutingSummaryHeader: React.FC<TabScoutingSummaryHeaderProps> = ({
  name,
  tooltip,
  align,
  isAsc,
  isSorted,
  setSortBy,
  setSortOrder,
}) => {
  const theme = useTheme()
  const finalTooltip = `${tooltip} ${isSorted ? `Sorted ${isAsc ? 'ascending' : 'descending'}` : ''}`
  return (
    <TableCell
      padding="none"
      sx={{
        cursor: 'pointer',
        // Disable text selection
        userSelect: 'none',
      }}
      onClick={() => {
        if (isSorted) {
          setSortOrder(isAsc ? 'desc' : 'asc')
        } else setSortBy(name)
      }}
    >
      <Tooltip title={finalTooltip} placement="top">
        <Stack
          direction="row"
          spacing={1}
          justifyContent={align}
          alignItems={'center'}
          sx={{
            width: '100%',
            color: isSorted ? theme.palette.primary.main : undefined,
            '& svg': {
              fontSize: 30,
            },
          }}
        >
          <Typography>{name}</Typography>
          {isSorted && !isAsc && <ArrowDropDown />}
          {isSorted && isAsc && <ArrowDropUp />}
          {!isSorted && <ArrowDropUp sx={{ opacity: 0 }} />}
        </Stack>
      </Tooltip>
    </TableCell>
  )
}
