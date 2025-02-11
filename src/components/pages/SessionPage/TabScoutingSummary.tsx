import * as React from 'react'

import {
  ObjectValues,
  SalvageFind,
  ScoutingFindTypeEnum,
  Session,
  ShipClusterFind,
  User,
  VehicleClusterFind,
} from '@regolithco/common'
import {
  Avatar,
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
} from '@mui/material'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { Stack } from '@mui/system'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { UserAvatar } from '../../UserAvatar'
import { AppContext } from '../../../context/app.context'
import { fontFamilies } from '../../../theme'

export interface TabScoutingSummaryProps {
  session: Session
  isShare?: boolean
}

const ScoutingSummaryTableColsEnum = {
  Scans: 'Scans',
  Clusters: 'Clusters',
  Score: 'Survey Corps Score',
} as const
type ScoutingSummaryTableColsEnum = ObjectValues<typeof ScoutingSummaryTableColsEnum>

export const TabScoutingSummary: React.FC<TabScoutingSummaryProps> = ({ session, isShare }) => {
  const theme = useTheme()
  const [sortBy, setSortBy] = React.useState<string>(ScoutingSummaryTableColsEnum.Scans)
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')
  const { hideNames, getSafeName } = React.useContext(AppContext)

  const dataTable = React.useMemo(() => {
    const table = (session.activeMembers?.items || []).map((member) => {
      const theirFinds = (session.scouting?.items || []).filter(({ ownerId }) => ownerId === member.ownerId)
      return {
        user: member.owner,
        scans: theirFinds.reduce((acc, cur) => {
          if (cur.clusterType === ScoutingFindTypeEnum.Ship) {
            return acc + ((cur as ShipClusterFind).shipRocks?.length || 0)
          } else if (cur.clusterType === ScoutingFindTypeEnum.Salvage) {
            return acc + ((cur as SalvageFind).wrecks?.length || 0)
          } else if (cur.clusterType === ScoutingFindTypeEnum.Vehicle) {
            return acc + ((cur as VehicleClusterFind).clusterCount || 0)
          } else return acc
        }, 0),
        clusterCount: theirFinds.length,
        score: theirFinds.reduce((acc, cur) => acc + (cur.score || 0), 0),
      }
    })
    table.sort((a, b) => {
      if (sortBy === ScoutingSummaryTableColsEnum.Scans) {
        return sortOrder === 'asc' ? a.scans - b.scans : b.scans - a.scans
      } else if (sortBy === ScoutingSummaryTableColsEnum.Clusters) {
        return sortOrder === 'asc' ? a.clusterCount - b.clusterCount : b.clusterCount - a.clusterCount
      } else if (sortBy === ScoutingSummaryTableColsEnum.Score) {
        return sortOrder === 'asc' ? a.score - b.score : b.score - a.score
      } else return 0
    })
    return table.filter((row) => row.scans > 0 || row.clusterCount > 0 || row.score > 0)
  }, [session, sortBy, sortOrder])

  const noScores = dataTable.every((row) => row.score === 0)
  if (dataTable.length === 0) {
    return (
      <Box sx={{ p: 5 }}>
        <Typography variant="h5" align="center">
          No scouting data available
        </Typography>
      </Box>
    )
  }
  return (
    <Box sx={{ p: 5 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                '& *': {
                  fontSize: theme.typography.subtitle1.fontSize,
                  fontFamily: fontFamilies.robotoMono,
                  fontWeight: 'bold',
                },
              }}
            >
              <TableCell></TableCell>
              <TableCell></TableCell>

              {!noScores && (
                <TabScoutingSummaryHeader
                  name="Survey Corps Score"
                  tooltip="Total score of all clusters scanned. NOTE: Scoutng finds must be added to the survey to be scored."
                  isSorted={sortBy === ScoutingSummaryTableColsEnum.Score}
                  isAsc={sortOrder === 'asc'}
                  setSortBy={setSortBy}
                  setSortOrder={setSortOrder}
                />
              )}

              <TabScoutingSummaryHeader
                name="Scans"
                tooltip={`Total number of "Rocks" + "Wrecks" + "Gems" in all clusters scanned`}
                isSorted={sortBy === ScoutingSummaryTableColsEnum.Scans}
                isAsc={sortOrder === 'asc'}
                setSortBy={setSortBy}
                setSortOrder={setSortOrder}
              />
              <TabScoutingSummaryHeader
                name="Clusters"
                tooltip="Total number of clusters scanned"
                isSorted={sortBy === ScoutingSummaryTableColsEnum.Clusters}
                isAsc={sortOrder === 'asc'}
                setSortBy={setSortBy}
                setSortOrder={setSortOrder}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {dataTable.map((row, idx) => (
              <TableRow
                key={row.user?.scName || idx}
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: '#00000033',
                  },
                }}
              >
                <TableCell>
                  <Avatar
                    sx={{
                      height: 30,
                      width: 30,
                      color: 'white',
                      fontSize: '1rem',
                      border: `2px solid white`,
                      backgroundColor: 'black',
                    }}
                  >
                    {idx + 1}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <UserAvatar user={row.user as User} size="small" privacy={hideNames} />
                    <Typography
                      sx={{
                        fontSize: '1.5rem',
                        lineHeight: 2,
                        fontFamily: fontFamilies.robotoMono,
                        fontWeight: 'bold',
                      }}
                    >
                      {getSafeName(row.user?.scName)}
                    </Typography>
                  </Stack>
                </TableCell>
                {!noScores && <TabScoutingCell value={row.score} />}
                <TabScoutingCell value={row.scans} />
                <TabScoutingCell value={row.clusterCount} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

const TabScoutingCell: React.FC<{ value: number }> = ({ value }) => {
  return (
    <TableCell align={'right'}>
      <Typography sx={{ fontSize: '1.5rem', lineHeight: 2, fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}>
        {MValueFormatter(value, MValueFormat.number)}
      </Typography>
    </TableCell>
  )
}

interface TabScoutingSummaryHeaderProps {
  name: string
  tooltip: string
  isSorted: boolean
  isAsc: boolean
  setSortOrder: (order: 'asc' | 'desc') => void
  setSortBy: (sortBy: string) => void
}

const TabScoutingSummaryHeader: React.FC<TabScoutingSummaryHeaderProps> = ({
  name,
  tooltip,
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
          justifyContent={'right'}
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
