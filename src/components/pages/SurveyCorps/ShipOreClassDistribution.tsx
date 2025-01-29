import * as React from 'react'

import {
  Alert,
  AlertTitle,
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  AsteroidTypeEnum,
  DepositTypeEnum,
  getOreName,
  getRockTypeName,
  JSONObject,
  OreTierEnum,
  OreTierNames,
  RockType,
  ShipOreEnum,
  ShipOreTiers,
  SurveyData,
} from '@regolithco/common'
import { PeopleAlt, Refresh } from '@mui/icons-material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { RockIcon } from '../../../icons'
import { useShipOreColors } from '../../../hooks/useShipOreColors'
import { fontFamilies } from '../../../theme'
import { OreTierColors } from './types'

export interface ShipOreClassDistributionProps {
  data?: SurveyData | null
}

export const ShipOreClassDistribution: React.FC<ShipOreClassDistributionProps> = ({ data }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))

  const [hoveredOre, setHoveredOre] = React.useState<ShipOreEnum | null>(null)
  const [rockTypeFilter, setRockTypeFilter] = React.useState<('SURFACE' | 'ASTEROID')[]>(['SURFACE', 'ASTEROID'])
  const [oreTierFilter, setOreTierFilter] = React.useState<OreTierEnum[]>([
    OreTierEnum.STier,
    OreTierEnum.ATier,
    OreTierEnum.BTier,
    OreTierEnum.CTier,
  ])
  const tableData = data?.data || {}

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        overflowY: isSmall ? 'visible' : 'auto',
      }}
    >
      <Container
        maxWidth={'lg'}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          flex: '0 0',
          my: 2,
        }}
      >
        <Stack
          direction={isSmall ? 'column' : 'row'}
          spacing={2}
          sx={{ marginBottom: theme.spacing(2) }}
          alignItems="center"
        >
          <Typography variant="overline" sx={{ marginBottom: theme.spacing(2) }}>
            Filter Options:
          </Typography>
          <ToggleButtonGroup
            size="small"
            value={rockTypeFilter}
            onChange={(_, newFilter) => {
              if (newFilter) {
                setRockTypeFilter(newFilter)
              } else {
                setRockTypeFilter([])
              }
            }}
            aria-label="text alignment"
          >
            <ToggleButton color="info" value={'ASTEROID'}>
              Asteroid
            </ToggleButton>
            <ToggleButton color="primary" value={'SURFACE'}>
              Surface
            </ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="overline" sx={{ marginBottom: theme.spacing(2) }}>
            Ore Tiers:
          </Typography>
          <ToggleButtonGroup
            size="small"
            value={oreTierFilter}
            onChange={(_, newFilter) => {
              if (newFilter) {
                setOreTierFilter(newFilter)
              } else {
                setOreTierFilter([])
              }
            }}
            aria-label="text alignment"
          >
            {Object.keys(OreTierNames).map((tier) => (
              <ToggleButton key={tier} value={tier} aria-label={OreTierNames[tier]} color={OreTierColors[tier]}>
                {OreTierNames[tier]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            onClick={() => {
              setOreTierFilter([OreTierEnum.STier, OreTierEnum.ATier, OreTierEnum.BTier, OreTierEnum.CTier])
              setRockTypeFilter(['SURFACE', 'ASTEROID'])
            }}
            color="error"
            variant="text"
            size="small"
            startIcon={<Refresh />}
          >
            Reset Form
          </Button>
        </Stack>
      </Container>

      {/* Table Box */}
      {tableData && (
        <Box>
          {rockTypeFilter.includes('ASTEROID') && (
            <>
              <Typography
                variant={isSmall ? 'h5' : 'h2'}
                sx={{
                  fontFamily: fontFamilies.robotoMono,
                  // fontWeight: 'bold',
                  color: theme.palette.text.primary,
                  borderBottom: `2px solid ${theme.palette.text.primary}`,
                  marginBottom: theme.spacing(2),
                  my: isSmall ? 2 : 5,
                }}
              >
                <RockIcon
                  sx={{
                    fontSize: isSmall ? '2rem' : '3rem',
                    color: 'inherit',
                    mr: 2,
                  }}
                />
                Asteroid Types
              </Typography>
              <Grid2 width={'100%'} container spacing={4}>
                {Object.values(AsteroidTypeEnum).map((type, idx) => (
                  <Grid2 key={idx} width={'400px'}>
                    <ClassCard
                      className={type}
                      data={tableData[type]}
                      hoveredOre={hoveredOre}
                      setHoveredOre={setHoveredOre}
                      oreTierFilter={oreTierFilter}
                      setOreTierFilter={setOreTierFilter}
                    />
                  </Grid2>
                ))}
              </Grid2>
            </>
          )}
          {rockTypeFilter.includes('SURFACE') && (
            <>
              <Typography
                variant={isSmall ? 'h5' : 'h2'}
                sx={{
                  fontFamily: fontFamilies.robotoMono,
                  // fontWeight: 'bold',
                  color: theme.palette.text.primary,
                  borderBottom: `2px solid ${theme.palette.text.primary}`,
                  marginBottom: theme.spacing(2),
                  my: isSmall ? 2 : 5,
                }}
              >
                <RockIcon
                  sx={{
                    fontSize: isSmall ? '2rem' : '3rem',
                    color: 'inherit',
                    mr: 2,
                  }}
                />
                Surface Deposit Types
              </Typography>
              <Grid2 width={'100%'} container spacing={4}>
                {Object.values(DepositTypeEnum).map((type, idx) => (
                  <Grid2 key={idx} width={'400px'}>
                    <ClassCard
                      className={type}
                      data={tableData[type]}
                      hoveredOre={hoveredOre}
                      setHoveredOre={setHoveredOre}
                      oreTierFilter={oreTierFilter}
                      setOreTierFilter={setOreTierFilter}
                    />
                  </Grid2>
                ))}
              </Grid2>
            </>
          )}
        </Box>
      )}
      <Alert severity="info" sx={{ borderRadius: 0, mt: 4 }}>
        <AlertTitle>Glossary</AlertTitle>
        <Typography variant="body2" paragraph component="div">
          <ul>
            <li>
              <strong>Prob:</strong> The probability of finding this ore in a given rock of this type
            </li>
            <li>
              <strong>Min, Max, Avg:</strong> The minimum, maximum, and average percentage of this ore in a given rock
              of this type
            </li>
          </ul>
        </Typography>
      </Alert>
    </Box>
  )
}

interface ClassCardProps {
  className: RockType
  data?: JSONObject
  hoveredOre: ShipOreEnum | null
  setHoveredOre: (ore: ShipOreEnum | null) => void
  oreTierFilter: OreTierEnum[]
  setOreTierFilter: (oreTierFilter: OreTierEnum[]) => void
}

const ClassCard: React.FC<ClassCardProps> = ({
  className,
  data,
  setHoveredOre,
  hoveredOre,
  oreTierFilter,
  setOreTierFilter,
}) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))

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
        minHeight: oreTierFilter.length > 0 ? '400px' : '200px',
        borderRadius: 3,
        border: '1px solid white',
      }}
    >
      <CardHeader
        title={
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography
              variant="h5"
              sx={{
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
              }}
            >
              {getRockTypeName(className)}
            </Typography>
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
                  placement="top"
                  title={`Based on ${(data && data['scans']) || 0} rock scans inside ${(data && data['clusters']) || 0} clusters`}
                >
                  <Stack direction="row" spacing={1} alignItems={'center'}>
                    <RockIcon />
                    <span>
                      {(data && data['scans']) || 0} - {(data && data['clusters']) || 0}
                    </span>
                  </Stack>
                </Tooltip>
                <Tooltip placement="top" title={`Data collected by ${(data && data['users']) || 0} users`}>
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
                  <TableCell>Rock Mass (t)</TableCell>
                  <TableCell align="right">{MValueFormatter(mass.min, MValueFormat.number_sm)}</TableCell>
                  <TableCell align="right">{MValueFormatter(mass.max, MValueFormat.number_sm)}</TableCell>
                  <TableCell align="right">{MValueFormatter(mass.avg, MValueFormat.number_sm)}</TableCell>
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
            {oreTierFilter.length > 0 && (
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
                <TableBody onMouseLeave={() => setHoveredOre(null)}>
                  {data &&
                    sortedShipRowColors.map((sortedOreColor, idx) => {
                      if (!ores[sortedOreColor.ore]) return
                      // Figure out if this ore should be shown
                      const show = oreTierFilter.find((tier) => ShipOreTiers[tier].indexOf(sortedOreColor.ore) !== -1)
                      if (!show) return

                      const { prob, minPct, maxPct, avgPct } = ores[sortedOreColor.ore] as {
                        prob: number
                        minPct: number
                        maxPct: number
                        avgPct: number
                      }
                      return (
                        <TableRow
                          key={idx}
                          onMouseEnter={() => setHoveredOre(sortedOreColor.ore)}
                          sx={{
                            position: 'relative',
                            '&::after': {
                              content: '""',
                              display: hoveredOre === sortedOreColor.ore ? 'block' : 'none',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              border: '1px solid white',
                              zIndex: 0,
                              backgroundColor: sortedOreColor.bg,
                              opacity: hoveredOre === sortedOreColor.ore ? 0.5 : 0,
                            },
                            '& .MuiTableCell-root': {
                              px: 0.1,
                              color: hoveredOre === sortedOreColor.ore ? 'white' : sortedOreColor.bg,
                              fontWeight: hoveredOre === sortedOreColor.ore ? 'bold' : 'normal',
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
            )}
          </TableContainer>
        </CardContent>
      )}
    </Card>
  )
}
