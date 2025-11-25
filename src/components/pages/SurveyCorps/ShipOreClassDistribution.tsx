import * as React from 'react'

import {
  Alert,
  AlertTitle,
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
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
  getSystemName,
  JSONObject,
  OreTierEnum,
  OreTierNames,
  RockType,
  ShipOreEnum,
  ShipOreTiers,
  SurveyData,
  SystemEnum,
} from '@regolithco/common'
import { PeopleAlt, Podcasts, Refresh } from '@mui/icons-material'
import { MValueFormat, MValueFormatter } from '../../fields/MValue'
import { RockIcon } from '../../../icons'
import { useShipOreColors } from '../../../hooks/useShipOreColors'
import { fontFamilies } from '../../../theme'
import { OreTierColors } from './types'
import { StaleLookups } from './StaleLookups'
import { yellow } from '@mui/material/colors'
import * as signals from '../../../lib/signals'
import { usesignals } from '../../../hooks/useSignals'
import { useQueryParams, useURLArrayState, useURLState } from '../../../hooks/useURLState'

const URL_KEYS = {
  systems: 'socdSys',
  rockTypes: 'socdRt',
  oreTiers: 'socdOt',
  signal: 'socdSig',
} as const

const ROCK_TYPE_DEFAULTS: ('SURFACE' | 'ASTEROID')[] = ['SURFACE', 'ASTEROID']
const ORE_TIER_DEFAULTS: OreTierEnum[] = [OreTierEnum.STier, OreTierEnum.ATier, OreTierEnum.BTier, OreTierEnum.CTier]
const SYSTEM_DEFAULTS: SystemEnum[] = [SystemEnum.Stanton, SystemEnum.Pyro, SystemEnum.Nyx]

const parseRockTypeFilterValue = (value: string | null) =>
  value === 'SURFACE' || value === 'ASTEROID' ? (value as 'SURFACE' | 'ASTEROID') : null

const parseOreTierValue = (value: string | null) =>
  value && Object.values(OreTierEnum).includes(value as OreTierEnum) ? (value as OreTierEnum) : null

const parseSystemValue = (value: string | null) =>
  value && Object.values(SystemEnum).includes(value as SystemEnum) ? (value as SystemEnum) : null

const serializeNumber = (value: number) => (Number.isFinite(value) && value > 0 ? String(value) : '')

const parseSignalValue = (value: string | null) => {
  if (!value) return 0
  const parsed = parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

export interface ShipOreClassDistributionProps {
  data?: SurveyData | null
}

export const ShipOreClassDistribution: React.FC<ShipOreClassDistributionProps> = ({ data }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))
  const { resetQueryValues } = useQueryParams()

  const [hoveredOre, setHoveredOre] = React.useState<ShipOreEnum | null>(null)
  const [systemCode, setSystemCode] = useURLArrayState<SystemEnum>(
    URL_KEYS.systems,
    SYSTEM_DEFAULTS,
    (value) => value,
    parseSystemValue
  )
  const [rockTypeFilter, setRockTypeFilter] = useURLArrayState<'SURFACE' | 'ASTEROID'>(
    URL_KEYS.rockTypes,
    ROCK_TYPE_DEFAULTS,
    (value) => value,
    parseRockTypeFilterValue
  )
  const [signalFilter, setSignalFilter] = useURLState<number>(URL_KEYS.signal, 0, serializeNumber, parseSignalValue)
  const possibilities = usesignals(
    signalFilter,
    rockTypeFilter.length === 0 ? rockTypeFilter[0] === 'ASTEROID' : undefined
  )
  const [oreTierFilter, setOreTierFilter] = useURLArrayState<OreTierEnum>(
    URL_KEYS.oreTiers,
    ORE_TIER_DEFAULTS,
    (value) => value,
    parseOreTierValue
  )
  const tableData = data?.data || {
    [SystemEnum.Pyro]: {},
    [SystemEnum.Stanton]: {},
    [SystemEnum.Nyx]: {},
  }
  const showStanton = systemCode.includes(SystemEnum.Stanton)
  const showPyro = systemCode.includes(SystemEnum.Pyro)
  const showNyx = systemCode.includes(SystemEnum.Nyx)

  if (data && data.data && (!data.data[SystemEnum.Stanton] || !data.data[SystemEnum.Pyro])) {
    return <StaleLookups />
  }
  const counts = [0, 0, 0, 0]
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
            value={systemCode}
            onChange={(e, newSystems) => {
              if (newSystems && newSystems.length > 0) {
                setSystemCode(newSystems)
              }
            }}
            aria-label="text alignment"
          >
            <ToggleButton
              value={SystemEnum.Stanton}
              aria-label="Stanton"
              color="info"
              title="Stanton System"
              sx={{
                color: theme.palette.info.dark,
              }}
            >
              ST
            </ToggleButton>
            <ToggleButton
              value={SystemEnum.Pyro}
              aria-label="Pyro"
              color="primary"
              title="Pyro System"
              sx={{
                color: theme.palette.primary.dark,
              }}
            >
              PY
            </ToggleButton>
            <ToggleButton
              value={SystemEnum.Nyx}
              aria-label="Nyx"
              color="info"
              title="Nyx System"
              sx={{
                color: theme.palette.info.light,
              }}
            >
              NX
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            size="small"
            value={rockTypeFilter}
            onChange={(_, newFilter) => {
              if (newFilter && newFilter.length > 0) {
                setRockTypeFilter(newFilter)
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
          <TextField
            label="Signal Filter"
            variant="outlined"
            size="small"
            placeholder="(e.g. 1900)"
            value={signalFilter || ''}
            inputProps={{
              sx: {
                color: yellow[500],
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
              },
            }}
            onChange={(e) => {
              const nextValue = e.target.value
              if (nextValue.length === 0) {
                setSignalFilter(0)
                return
              }
              const parsed = parseInt(nextValue, 10)
              if (Number.isInteger(parsed)) {
                setSignalFilter(parsed)
              }
            }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Button
            onClick={() => {
              resetQueryValues()
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
              {showStanton && (
                <>
                  <SystemLabel system={SystemEnum.Stanton} />
                  <Grid width={'100%'} container spacing={4}>
                    {Object.values(AsteroidTypeEnum).map((type, idx) => {
                      const multiplier = possibilities.asteroid[type] || 0
                      if (signalFilter && signalFilter > 0 && !multiplier) return null
                      counts[0]++
                      return (
                        <Grid key={idx} width={'400px'}>
                          <ClassCard
                            className={type}
                            data={tableData[SystemEnum.Stanton][type]}
                            hoveredOre={hoveredOre}
                            setHoveredOre={setHoveredOre}
                            oreTierFilter={oreTierFilter}
                            setOreTierFilter={setOreTierFilter}
                            multiplier={multiplier}
                          />
                        </Grid>
                      )
                    })}
                    {counts[0] === 0 && <NoRocksMatch />}
                  </Grid>
                </>
              )}
              {showPyro && (
                <>
                  <SystemLabel system={SystemEnum.Pyro} />
                  <Grid width={'100%'} container spacing={4}>
                    {Object.values(AsteroidTypeEnum).map((type, idx) => {
                      const multiplier = possibilities.asteroid[type] || 0
                      if (signalFilter && signalFilter > 0 && !multiplier) return null
                      counts[1]++
                      return (
                        <Grid key={idx} width={'400px'}>
                          <ClassCard
                            className={type}
                            data={tableData[SystemEnum.Pyro][type]}
                            hoveredOre={hoveredOre}
                            setHoveredOre={setHoveredOre}
                            oreTierFilter={oreTierFilter}
                            setOreTierFilter={setOreTierFilter}
                            multiplier={multiplier}
                          />
                        </Grid>
                      )
                    })}
                    {counts[1] === 0 && <NoRocksMatch />}
                  </Grid>
                </>
              )}
              {showNyx && (
                <>
                  <SystemLabel system={SystemEnum.Nyx} />
                  <Grid width={'100%'} container spacing={4}>
                    {Object.values(AsteroidTypeEnum).map((type, idx) => {
                      const multiplier = possibilities.asteroid[type] || 0
                      if (signalFilter && signalFilter > 0 && !multiplier) return null
                      if (!tableData[SystemEnum.Nyx] || !tableData[SystemEnum.Nyx][type]) return null
                      counts[1]++
                      return (
                        <Grid key={idx} width={'400px'}>
                          <ClassCard
                            className={type}
                            data={tableData[SystemEnum.Nyx][type]}
                            hoveredOre={hoveredOre}
                            setHoveredOre={setHoveredOre}
                            oreTierFilter={oreTierFilter}
                            setOreTierFilter={setOreTierFilter}
                            multiplier={multiplier}
                          />
                        </Grid>
                      )
                    })}
                    {counts[1] === 0 && <NoRocksMatch />}
                  </Grid>
                </>
              )}
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
              {showStanton && (
                <>
                  <SystemLabel system={SystemEnum.Stanton} />
                  <Grid width={'100%'} container spacing={4}>
                    {Object.values(DepositTypeEnum).map((type, idx) => {
                      const multiplier = possibilities.deposit[type] || 0
                      if (signalFilter && signalFilter > 0 && !multiplier) return null
                      counts[2]++
                      return (
                        <Grid key={idx} width={'400px'}>
                          <ClassCard
                            className={type}
                            data={tableData[SystemEnum.Stanton][type]}
                            hoveredOre={hoveredOre}
                            setHoveredOre={setHoveredOre}
                            oreTierFilter={oreTierFilter}
                            setOreTierFilter={setOreTierFilter}
                            multiplier={multiplier}
                          />
                        </Grid>
                      )
                    })}
                    {counts[2] === 0 && <NoRocksMatch />}
                  </Grid>
                </>
              )}
              {showPyro && (
                <>
                  <SystemLabel system={SystemEnum.Pyro} />

                  <Grid width={'100%'} container spacing={4}>
                    {Object.values(DepositTypeEnum).map((type, idx) => {
                      const multiplier = possibilities.deposit[type] || 0
                      if (signalFilter && signalFilter > 0 && !multiplier) return null
                      counts[3]++
                      return (
                        <Grid key={idx} width={'400px'}>
                          <ClassCard
                            className={type}
                            data={tableData[SystemEnum.Pyro][type]}
                            hoveredOre={hoveredOre}
                            setHoveredOre={setHoveredOre}
                            oreTierFilter={oreTierFilter}
                            setOreTierFilter={setOreTierFilter}
                            multiplier={multiplier}
                          />
                        </Grid>
                      )
                    })}
                    {counts[3] === 0 && <NoRocksMatch />}
                  </Grid>
                </>
              )}
              {showNyx && (
                <>
                  <SystemLabel system={SystemEnum.Nyx} />

                  <Grid width={'100%'} container spacing={4}>
                    {Object.values(DepositTypeEnum).map((type, idx) => {
                      const multiplier = possibilities.deposit[type] || 0
                      if (signalFilter && signalFilter > 0 && !multiplier) return null
                      if (!tableData[SystemEnum.Nyx] || !tableData[SystemEnum.Nyx][type]) return null
                      counts[3]++
                      return (
                        <Grid key={idx} width={'400px'}>
                          <ClassCard
                            className={type}
                            data={tableData[SystemEnum.Nyx][type]}
                            hoveredOre={hoveredOre}
                            setHoveredOre={setHoveredOre}
                            oreTierFilter={oreTierFilter}
                            setOreTierFilter={setOreTierFilter}
                            multiplier={multiplier}
                          />
                        </Grid>
                      )
                    })}
                    {counts[3] === 0 && <NoRocksMatch />}
                  </Grid>
                </>
              )}
            </>
          )}
        </Box>
      )}
      <Alert severity="info" sx={{ borderRadius: 0, mt: 4 }}>
        <AlertTitle>Glossary</AlertTitle>
        <Typography variant="body2" component="div" gutterBottom>
          <ul>
            <li>
              <strong>Prob:</strong> The probability of finding this ore in a given rock of this type
            </li>
            <li>
              <strong>Min, Max, Median:</strong> The minimum, maximum, and median percentage of this ore in a given rock
              of this type
            </li>
          </ul>
        </Typography>
      </Alert>
    </Box>
  )
}

const SystemLabel: React.FC<{ system: SystemEnum }> = ({ system }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))
  const color = system === SystemEnum.Stanton ? theme.palette.info.main : theme.palette.primary.main
  return (
    <Typography
      variant={isSmall ? 'body2' : 'h4'}
      sx={{
        fontFamily: fontFamilies.robotoMono,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: color,
        borderBottom: `2px solid ${color}`,
        marginBottom: theme.spacing(2),
        my: isSmall ? 2 : 5,
      }}
    >
      {getSystemName(system)}
    </Typography>
  )
}

interface ClassCardProps {
  className: RockType
  data?: JSONObject
  hoveredOre: ShipOreEnum | null
  setHoveredOre: (ore: ShipOreEnum | null) => void
  oreTierFilter: OreTierEnum[]
  setOreTierFilter: (oreTierFilter: OreTierEnum[]) => void
  multiplier?: number
}

const ClassCard: React.FC<ClassCardProps> = ({
  className,
  data,
  setHoveredOre,
  hoveredOre,
  oreTierFilter,
  setOreTierFilter,
  multiplier,
}) => {
  const theme = useTheme()
  // const isSmall = useMediaQuery(theme.breakpoints.down('md'))

  const sortedShipRowColors = useShipOreColors()

  const mass = (data && data['mass']) || {}
  const inst = (data && data['inst']) || {}
  const res = (data && data['res']) || {}
  const rocks = (data && data['clusterCount']) || {}
  const ores = (data && data['ores']) || {}

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
      }}
    >
      {multiplier ? (
        <Tooltip title={`Expected this many rocks with the signal provided`}>
          <Avatar
            sx={{
              border: '2px solid black',
              color: 'black',
              backgroundColor: yellow[500],
              position: 'absolute',
              top: -15,
              right: -15,
            }}
          >
            x{multiplier}
          </Avatar>
        </Tooltip>
      ) : null}

      <Card
        elevation={1}
        sx={{
          height: '100%',
          minHeight: oreTierFilter.length > 0 ? '400px' : '200px',
          borderRadius: 3,
          border: '1px solid #666666',
        }}
      >
        <CardHeader
          title={
            <Box>
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
                    justifyContent={'space-between'}
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
                          {(data && data['scans']) || 0} / {(data && data['clusters']) || 0}
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
              <Tooltip
                placement="right-start"
                title={
                  <Box>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      This is the scan signature for one rock. Cluster signatures will be a multiple of this number.
                    </Typography>
                    <TableContainer>
                      <Table
                        size="small"
                        sx={{
                          '& *': {
                            color: yellow[500],
                            fontFamily: fontFamilies.robotoMono,
                            fontWeight: 'bold',
                          },
                          // Zebra stripe the table
                          '& tr:nth-of-type(odd)': {
                            backgroundColor: alpha(theme.palette.text.primary, 0.1),
                          },
                        }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell padding="none" align="right" sx={{ pr: 2 }}>
                              {getRockTypeName(className)}
                            </TableCell>
                            <TableCell padding="none" align="right">
                              SIGNAL
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Array(16)
                            .fill(0)
                            .map((_, idx) => (
                              <TableRow key={idx}>
                                <TableCell padding="none" align="right" sx={{ pr: 2 }}>
                                  {idx + 1}x
                                </TableCell>
                                <TableCell padding="none" align="right">
                                  {(signals.spaceRocks[className] || signals.depositRocks[className] || 0) * (idx + 1)}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                }
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ width: '100%' }}
                  justifyContent={'flex-end'}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems={'center'}
                    sx={{
                      '& *': {
                        fontSize: theme.typography.body1.fontSize,
                        color: yellow[500],
                        fontFamily: fontFamilies.robotoMono,
                        fontWeight: 'bold',
                      },
                    }}
                  >
                    <Podcasts />
                    <span>{signals.spaceRocks[className] || signals.depositRocks[className]}</span>
                  </Stack>
                </Stack>
              </Tooltip>
            </Box>
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
                    <TableCell align="right">Med</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Cluster Rocks</TableCell>
                    <TableCell align="right">{MValueFormatter(rocks.min, MValueFormat.number)}</TableCell>
                    <TableCell align="right">{MValueFormatter(rocks.max, MValueFormat.number)}</TableCell>
                    <TableCell align="right">{MValueFormatter(rocks.med, MValueFormat.number)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rock Mass (t)</TableCell>
                    <TableCell align="right">{MValueFormatter(mass.min, MValueFormat.number_sm)}</TableCell>
                    <TableCell align="right">{MValueFormatter(mass.max, MValueFormat.number_sm)}</TableCell>
                    <TableCell align="right">{MValueFormatter(mass.med, MValueFormat.number_sm)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Instability</TableCell>
                    <TableCell align="right">{MValueFormatter(inst.min, MValueFormat.number)}</TableCell>
                    <TableCell align="right">{MValueFormatter(inst.max, MValueFormat.number)}</TableCell>
                    <TableCell align="right">{MValueFormatter(inst.med, MValueFormat.number)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Resistance</TableCell>
                    <TableCell align="right">{MValueFormatter(res.min, MValueFormat.percent)}</TableCell>
                    <TableCell align="right">{MValueFormatter(res.max, MValueFormat.percent)}</TableCell>
                    <TableCell align="right">{MValueFormatter(res.med, MValueFormat.percent)}</TableCell>
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
                      <TableCell align="right">Med</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody onMouseLeave={() => setHoveredOre(null)}>
                    {data &&
                      sortedShipRowColors.map((sortedOreColor, idx) => {
                        if (!ores[sortedOreColor.ore]) return
                        // Figure out if this ore should be shown
                        const show = oreTierFilter.find((tier) => ShipOreTiers[tier].indexOf(sortedOreColor.ore) !== -1)
                        if (!show) return

                        const { prob, minPct, maxPct, medPct } = ores[sortedOreColor.ore] as {
                          prob: number
                          minPct: number
                          maxPct: number
                          medPct: number
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
                            <TableCell align="right">{MValueFormatter(medPct, MValueFormat.percent)}</TableCell>
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
    </Box>
  )
}

const NoRocksMatch: React.FC = () => {
  return (
    <Grid width={'100%'}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ textAlign: 'center', color: 'text.secondary', fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}
      >
        No rock types match the filters above
      </Typography>
    </Grid>
  )
}
