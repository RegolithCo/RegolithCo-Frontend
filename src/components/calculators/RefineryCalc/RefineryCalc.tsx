import * as React from 'react'
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Typography,
  InputAdornment,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
// import log from 'loglevel'
import { isUndefined } from 'lodash'
import { getShipOreName, RefineryMethodEnum, getRefineryMethodName, ShipOreEnum } from '@regolithco/common'
import { RefineryCalcTable } from './RefineryCalcTable'
import { fontFamilies } from '../../../theme'
import { Box } from '@mui/system'

type ObjectValues<T> = T[keyof T]

export const RefineryPivotEnum = {
  station: 'Refinery Location',
  method: 'Refining Method',
  oreType: 'Ore Type',
  metric: 'Refinery Metric',
} as const
export type RefineryPivotEnum = ObjectValues<typeof RefineryPivotEnum>

export const RefineryMetricEnum = {
  netProfit: 'Net Profit',
  oreYields: 'Ore Yields',
  refiningTime: 'Refining Time',
  refiningCost: 'Refining Cost',
  timeVProfit: 'Time & Profit',
} as const
export type RefineryMetricEnum = ObjectValues<typeof RefineryMetricEnum>

export const RefineryCalc: React.FC = () => {
  const [oreAmt, setOre] = React.useState<string>('32')
  const [oreType, setOreType] = React.useState<ShipOreEnum>(ShipOreEnum.Quantanium)
  const [method, setMethod] = React.useState<RefineryMethodEnum>(RefineryMethodEnum.DinyxSolventation)
  const [refMetric, setRefMetric] = React.useState<RefineryMetricEnum>(RefineryMetricEnum.netProfit)
  const [refMode, setRefMode] = React.useState<RefineryPivotEnum>(RefineryPivotEnum.method)
  const oreValid = isUndefined(oreAmt) || oreAmt === null || Number(oreAmt) >= 0
  const reset = () => {
    setOre('32')
    setMethod(RefineryMethodEnum.DinyxSolventation)
    setRefMetric(RefineryMetricEnum.netProfit)
    setOreType(ShipOreEnum.Quantanium)
  }

  return (
    <Box>
      <Grid container spacing={2} margin={1} maxWidth={800}>
        {/* ROW 1 */}
        <Grid xs={12} sm={6}>
          {refMode === RefineryPivotEnum.method ? (
            <FormControl fullWidth>
              <InputLabel id="vaxis-labelinput">Ore Type</InputLabel>
              <Select
                labelId="vaxis-label"
                id="cellAxis"
                value={oreType}
                label="Ore Type"
                sx={{
                  textAlign: 'center',
                  fontFamily: fontFamilies.robotoMono,
                  fontWeight: 'bold',
                  fontSize: 24,
                }}
                onChange={(event) => {
                  setOreType(event.target.value as ShipOreEnum)
                }}
              >
                {Object.entries(ShipOreEnum).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {getShipOreName(value)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <FormControl fullWidth>
              <InputLabel id="vaxis-labelinput">Refining Method</InputLabel>
              <Select
                labelId="vaxis-label"
                id="cellAxis"
                value={method}
                label="Refining Method"
                sx={{
                  textAlign: 'center',
                  fontFamily: fontFamilies.robotoMono,
                  fontWeight: 'bold',
                  fontSize: 24,
                }}
                onChange={(event) => {
                  setMethod(event.target.value as RefineryMethodEnum)
                }}
              >
                {Object.entries(RefineryMethodEnum).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {getRefineryMethodName(value)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Grid>

        <Grid xs={9} sm={4}>
          <TextField
            id="scu-basic"
            label="Volume"
            variant="outlined"
            value={oreAmt}
            InputProps={{
              endAdornment: <InputAdornment position="end">SCU</InputAdornment>,
            }}
            inputProps={{
              sx: {
                textAlign: 'right',
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
                fontSize: 24,
              },
            }}
            onFocus={(event) => {
              event.target.select()
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.value === '') setOre('')
              else setOre(event.target.value)
            }}
            error={!oreValid}
            helperText={!oreValid ? 'Must be a positive number' : ''}
          />
        </Grid>
        <Grid xs={3} sm={2}>
          <Button variant="contained" onClick={reset}>
            RESET
          </Button>
        </Grid>

        {/* ROW 2 */}

        <Grid xs={12} sm={4}>
          <FormControl>
            <FormLabel id="metric-label">
              <Typography color="secondary" sx={{ fontSize: 18, borderBottom: '1px solid' }}>
                Rows:
              </Typography>
            </FormLabel>
            <RadioGroup
              name="metric-group"
              value={refMode}
              onChange={(event) => {
                setRefMode(event.target.value as RefineryPivotEnum)
              }}
            >
              <FormControlLabel value={RefineryPivotEnum.method} control={<Radio />} label={RefineryPivotEnum.method} />
              <FormControlLabel
                value={RefineryPivotEnum.oreType}
                control={<Radio />}
                label={RefineryPivotEnum.oreType}
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid xs={12} sm={4}>
          <FormControl>
            <FormLabel id="metric-label">
              <Typography color="secondary" sx={{ fontSize: 18, borderBottom: '1px solid' }}>
                Metric:
              </Typography>
            </FormLabel>
            <RadioGroup
              name="metric-group"
              value={refMetric}
              onChange={(event) => {
                setRefMetric(event.target.value as RefineryMetricEnum)
              }}
            >
              <FormControlLabel
                value={RefineryMetricEnum.netProfit}
                control={<Radio />}
                label={RefineryMetricEnum.netProfit}
              />
              <FormControlLabel
                value={RefineryMetricEnum.oreYields}
                control={<Radio />}
                label={RefineryMetricEnum.oreYields}
              />
              <FormControlLabel
                value={RefineryMetricEnum.refiningCost}
                control={<Radio />}
                label={RefineryMetricEnum.refiningCost}
              />
              <FormControlLabel
                value={RefineryMetricEnum.refiningTime}
                control={<Radio />}
                label={RefineryMetricEnum.refiningTime}
              />
              <FormControlLabel
                value={RefineryMetricEnum.timeVProfit}
                control={<Radio />}
                label={RefineryMetricEnum.timeVProfit}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      <RefineryCalcTable
        method={method}
        oreAmt={oreValid ? Number(oreAmt) : 0}
        oreType={oreType}
        refMetric={refMetric}
        refMode={refMode}
      />
    </Box>
  )
}
