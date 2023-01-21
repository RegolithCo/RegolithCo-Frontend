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
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
// import log from 'loglevel'
import { isUndefined } from 'lodash'
import { getShipOreName, RefineryMethodEnum, getRefineryMethodName, ShipOreEnum } from '@regolithco/common'
import { RefineryCalcTable } from './RefineryCalcTable'
import { fontFamilies } from '../../../theme'
import { Box } from '@mui/system'

/* eslint-disable no-unused-vars */
export enum RefineryPivot {
  station = 'Refinery Location',
  method = 'Refining Method',
  oreType = 'Ore Type',
  metric = 'Refinery Metric',
}
export enum RefineryMetric {
  netProfit = 'Net Profit (aUEC)',
  oreYields = 'Ore Yields (SCU)',
  refiningTime = 'Refining Time (HH:MM)',
  refiningCost = 'Refining Cost (aUEC)',
  timeVProfit = 'Time & Profit (aUEC) (HH:MM)',
}
/* eslint-enable no-unused-vars */

export const RefineryCalc: React.FC = () => {
  const [oreAmt, setOre] = React.useState<string>('32')
  const [oreType, setOreType] = React.useState<ShipOreEnum>(ShipOreEnum.Quantanium)
  const [method, setMethod] = React.useState<RefineryMethodEnum>(RefineryMethodEnum.DinyxSolventation)
  const [refMetric, setRefMetric] = React.useState<RefineryMetric>(RefineryMetric.netProfit)
  const [refMode, setRefMode] = React.useState<RefineryPivot>(RefineryPivot.method)
  const oreValid = isUndefined(oreAmt) || oreAmt === null || Number(oreAmt) >= 0
  const reset = () => {
    setOre('32')
    setMethod(RefineryMethodEnum.DinyxSolventation)
    setRefMetric(RefineryMetric.netProfit)
    setOreType(ShipOreEnum.Quantanium)
  }

  return (
    <Box>
      <Grid container spacing={2} margin={1} maxWidth={800}>
        {/* ROW 1 */}
        <Grid xs={12} sm={6}>
          {refMode === RefineryPivot.method ? (
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
            label="SCU"
            variant="outlined"
            value={oreAmt}
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
                setRefMode(event.target.value as RefineryPivot)
              }}
            >
              <FormControlLabel value={RefineryPivot.method} control={<Radio />} label={RefineryPivot.method} />
              <FormControlLabel value={RefineryPivot.oreType} control={<Radio />} label={RefineryPivot.oreType} />
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
                setRefMetric(event.target.value as RefineryMetric)
              }}
            >
              <FormControlLabel value={RefineryMetric.netProfit} control={<Radio />} label={RefineryMetric.netProfit} />
              <FormControlLabel value={RefineryMetric.oreYields} control={<Radio />} label={RefineryMetric.oreYields} />
              <FormControlLabel
                value={RefineryMetric.refiningCost}
                control={<Radio />}
                label={RefineryMetric.refiningCost}
              />
              <FormControlLabel
                value={RefineryMetric.refiningTime}
                control={<Radio />}
                label={RefineryMetric.refiningTime}
              />
              <FormControlLabel
                value={RefineryMetric.timeVProfit}
                control={<Radio />}
                label={RefineryMetric.timeVProfit}
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
