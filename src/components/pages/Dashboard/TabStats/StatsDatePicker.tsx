import * as React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker'
import { ObjectValues } from '@regolithco/common'
import { Box, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material'

// These values double as the url sl
export const DatePresetsEnum = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST7: 'last7',
  LAST30: 'last30',
  THISMONTH: 'mtd',
  LASTMONTH: 'lastmonth',
  YTD: 'ytd',
  ALLTIME: 'all',
}
export type DatePresetsEnum = ObjectValues<typeof DatePresetsEnum>

export const DatePresetStrings: Record<DatePresetsEnum, string> = {
  [DatePresetsEnum.TODAY]: 'Today',
  [DatePresetsEnum.YESTERDAY]: 'Yesterday',
  [DatePresetsEnum.LAST7]: 'Last 7 Days',
  [DatePresetsEnum.LAST30]: 'Last 30 Days',
  [DatePresetsEnum.THISMONTH]: 'Month to Date',
  [DatePresetsEnum.LASTMONTH]: 'Last Month',
  [DatePresetsEnum.YTD]: 'Year to date',
  [DatePresetsEnum.ALLTIME]: 'All Time',
}

export interface StatsDatePickerProps {
  preset?: DatePresetsEnum
  fromDate: Dayjs | null
  toDate: Dayjs | null
  setFromDate: (date: Dayjs | null) => void
  setToDate: (date: Dayjs | null) => void
  onPresetChange: (preset: DatePresetsEnum | null) => void
}

export const StatsDatePicker: React.FC<StatsDatePickerProps> = ({
  preset,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  onPresetChange,
}) => {
  React.useEffect(() => {
    switch (preset) {
      case DatePresetsEnum.TODAY:
        setFromDate(dayjs().startOf('day'))
        setToDate(dayjs().endOf('day'))
        break
      case DatePresetsEnum.YESTERDAY:
        setFromDate(dayjs().subtract(1, 'day').startOf('day'))
        setToDate(dayjs().subtract(1, 'day').endOf('day'))
        break
      case DatePresetsEnum.LAST7:
        setFromDate(dayjs().subtract(7, 'day').startOf('day'))
        setToDate(dayjs().endOf('day'))
        break
      case DatePresetsEnum.LAST30:
        setFromDate(dayjs().subtract(30, 'day').startOf('day'))
        setToDate(dayjs().endOf('day'))
        break
      case DatePresetsEnum.THISMONTH:
        setFromDate(dayjs().startOf('month'))
        setToDate(dayjs().endOf('month'))
        break
      case DatePresetsEnum.LASTMONTH:
        setFromDate(dayjs().subtract(1, 'month').startOf('month'))
        setToDate(dayjs().subtract(1, 'month').endOf('month'))
        break
      case DatePresetsEnum.YTD:
        setFromDate(dayjs().startOf('year'))
        setToDate(dayjs().endOf('day'))
        break
      case DatePresetsEnum.ALLTIME:
        setFromDate(dayjs('2023-03-01').startOf('day'))
        setToDate(dayjs().endOf('day'))
        break
      default:
        break
    }
  }, [preset])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormControl fullWidth>
          <InputLabel id="date-preset-select">Date Preset</InputLabel>
          <Select
            value={preset || 'CUSTOM'}
            fullWidth
            labelId="date-preset-select"
            label="Date Preset"
            onChange={(e) => {
              if (e.target.value === 'CUSTOM') onPresetChange(null)
              else onPresetChange(e.target.value as DatePresetsEnum)
            }}
          >
            <MenuItem value={'CUSTOM'}>Custom</MenuItem>
            {Object.values(DatePresetsEnum).map((presetEnumVal) => (
              <MenuItem key={presetEnumVal} value={presetEnumVal}>
                {DatePresetStrings[presetEnumVal]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <MUIDatePicker
          slotProps={{ field: { sx: { width: '100%' } } }}
          minDate={dayjs('2023-03-01')}
          disableFuture
          disabled={Boolean(preset)}
          label="From Date"
          value={fromDate}
          onChange={(newValue) => setFromDate(newValue)}
        />
        <MUIDatePicker
          minDate={dayjs('2023-03-01')}
          disableFuture
          slotProps={{ field: { sx: { width: '100%' } } }}
          disabled={Boolean(preset)}
          label="To Date"
          value={toDate}
          onChange={(newValue) => setToDate(newValue)}
        />
      </Stack>
    </LocalizationProvider>
  )
}
