import * as React from 'react'

import {
  alpha,
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
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
import {
  AsteroidTypeEnum,
  DepositTypeEnum,
  getOreName,
  getRockTypeName,
  JSONObject,
  RockType,
  SurveyData,
} from '@regolithco/common'
import { PeopleAlt } from '@mui/icons-material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { RockIcon } from '../../../icons'
import { useShipOreColors } from '../../../hooks/useShipOreColors'

export interface ShipOreClassDistributionProps {
  // Props here
  data?: SurveyData | null
}

export const ShipOreClassDistribution: React.FC<ShipOreClassDistributionProps> = ({ data }) => {
  const theme = useTheme()

  const tableData = data?.data || {}

  return (
    <Box>
      {/* Table Box */}
      {tableData && (
        <Box>
          <Typography
            variant="h2"
            sx={{
              borderBottom: '2px solid white',
              marginBottom: theme.spacing(2),
              my: 5,
            }}
          >
            Asteroids
          </Typography>
          <Grid2 width={'100%'} container spacing={4}>
            {Object.values(AsteroidTypeEnum).map((type, idx) => (
              <Grid2 key={idx} width={'400px'}>
                <ClassCard className={type} data={tableData[type]} />
              </Grid2>
            ))}
          </Grid2>

          <Typography
            variant="h2"
            sx={{
              borderBottom: '2px solid white',
              marginBottom: theme.spacing(2),
              my: 5,
            }}
          >
            Surface Deposits
          </Typography>
          <Grid2 width={'100%'} container spacing={4}>
            {Object.values(DepositTypeEnum).map((type, idx) => (
              <Grid2 key={idx} width={'400px'}>
                <ClassCard className={type} data={tableData[type]} />
              </Grid2>
            ))}
          </Grid2>
        </Box>
      )}
    </Box>
  )
}

interface ClassCardProps {
  className: RockType
  data?: JSONObject
}

const ClassCard: React.FC<ClassCardProps> = ({ className, data }) => {
  const theme = useTheme()
  const sortedShipRowColors = useShipOreColors()

  const mass = (data && data['mass']) || {}
  const inst = (data && data['inst']) || {}
  const res = (data && data['res']) || {}
  const rocks = (data && data['clusterCount']) || {}
  const ores = (data && data['ores']) || {}

  return (
    <Card
      elevation={4}
      sx={{
        height: '100%',
        minHeight: '450px',
        borderRadius: 3,
        border: '1px solid white',
      }}
    >
      <CardHeader
        title={
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">{getRockTypeName(className)}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            {data && (
              <Stack
                direction="row"
                spacing={2}
                alignItems={'center'}
                sx={{
                  '& *': {
                    color: theme.palette.text.secondary,
                    fontSize: '1rem',
                  },
                }}
              >
                <Tooltip
                  title={`Based on ${(data && data['scans']) || 0} rock scans inside ${(data && data['clusters']) || 0} clusters`}
                >
                  <Stack direction="row" spacing={1} alignItems={'center'}>
                    <RockIcon />
                    <span>
                      {(data && data['scans']) || 0} - {(data && data['clusters']) || 0}
                    </span>
                  </Stack>
                </Tooltip>
                <Tooltip title={`Data collected by ${(data && data['users']) || 0} users`}>
                  <Stack direction="row" spacing={1} alignItems={'center'}>
                    <PeopleAlt />
                    <span>{(data && data['users']) || 0}</span>
                  </Stack>
                </Tooltip>
              </Stack>
            )}
          </Stack>
        }
      />
      {!data && (
        <CardContent>
          <Typography
            variant="overline"
            component={'div'}
            sx={{
              fontSize: '2rem',
              color: alpha(theme.palette.text.secondary, 0.2),
              width: '100%',
              textAlign: 'center',
            }}
          >
            No Data
          </Typography>
        </CardContent>
      )}
      {data && (
        <CardContent
          sx={{
            '& *': {
              fontSize: '0.8rem',
            },
          }}
        >
          <TableContainer>
            <Table size="small" padding="none">
              <TableHead>
                <TableRow
                  sx={{
                    borderBottom: '2px solid white',
                  }}
                >
                  <TableCell> </TableCell>
                  <TableCell align="right">Min</TableCell>
                  <TableCell align="right">Max</TableCell>
                  <TableCell align="right">Avg</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Cluster Rocks</TableCell>
                  <TableCell align="right">{MValueFormatter(rocks.min, MValueFormat.number)}</TableCell>
                  <TableCell align="right">{MValueFormatter(rocks.max, MValueFormat.number)}</TableCell>
                  <TableCell align="right">{MValueFormatter(rocks.avg, MValueFormat.number)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rock Mass</TableCell>
                  <TableCell align="right">{MValueFormatter(mass.min, MValueFormat.mass_sm)}</TableCell>
                  <TableCell align="right">{MValueFormatter(mass.max, MValueFormat.mass_sm)}</TableCell>
                  <TableCell align="right">{MValueFormatter(mass.avg, MValueFormat.mass_sm)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Instability</TableCell>
                  <TableCell align="right">{MValueFormatter(inst.min, MValueFormat.number)}</TableCell>
                  <TableCell align="right">{MValueFormatter(inst.max, MValueFormat.number)}</TableCell>
                  <TableCell align="right">{MValueFormatter(inst.avg, MValueFormat.number)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Resistance</TableCell>
                  <TableCell align="right">{MValueFormatter(res.min, MValueFormat.percent)}</TableCell>
                  <TableCell align="right">{MValueFormatter(res.max, MValueFormat.percent)}</TableCell>
                  <TableCell align="right">{MValueFormatter(res.avg, MValueFormat.percent)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table
              size="small"
              padding="none"
              sx={{
                marginTop: '2rem',
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    borderBottom: '2px solid white',
                    '& .MuiTableCell-root': {
                      whiteSpace: 'nowrap',
                    },
                  }}
                >
                  <TableCell>Mineral</TableCell>
                  <TableCell align="right">Prob</TableCell>
                  <TableCell align="right">Min</TableCell>
                  <TableCell align="right">Max</TableCell>
                  <TableCell align="right">Avg</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  sortedShipRowColors.map((sortedOreColor, idx) => {
                    if (!ores[sortedOreColor.ore]) return
                    const { prob, minPct, maxPct, avgPct } = ores[sortedOreColor.ore] as {
                      prob: number
                      minPct: number
                      maxPct: number
                      avgPct: number
                    }
                    return (
                      <TableRow
                        key={idx}
                        sx={{
                          '& *': {
                            color: sortedOreColor.bg,
                          },
                        }}
                      >
                        <TableCell>{getOreName(sortedOreColor.ore)}</TableCell>
                        <TableCell align="right">{MValueFormatter(prob, MValueFormat.percent)}</TableCell>
                        <TableCell align="right">{MValueFormatter(minPct, MValueFormat.percent)}</TableCell>
                        <TableCell align="right">{MValueFormatter(maxPct, MValueFormat.percent)}</TableCell>
                        <TableCell align="right">{MValueFormatter(avgPct, MValueFormat.percent)}</TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      )}
    </Card>
  )
}
