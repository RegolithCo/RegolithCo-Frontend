import * as React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker'
import { ObjectValues } from '@regolithco/common'
import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material'

// These values double as the url sl
export const DatePresetsEnum = {
  CUSTOM: 'range',
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
  [DatePresetsEnum.CUSTOM]: 'Custom',
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
  fromDate: Dayjs | null // This is the actual state
  toDate: Dayjs | null // This is the actual state
  setFromDate: (date: Dayjs | null) => void
  setToDate: (date: Dayjs | null) => void
  onPresetChange: (preset: DatePresetsEnum) => void
}

export const StatsDatePicker: React.FC<StatsDatePickerProps> = ({
  preset,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  onPresetChange,
}) => {
  console.log('finalPreset DatePicker', { preset })

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormControl fullWidth>
          <InputLabel id="date-preset-select">Date Preset</InputLabel>
          <Select
            value={preset || DatePresetsEnum.CUSTOM}
            fullWidth
            labelId="date-preset-select"
            label="Date Preset"
            onChange={(e) => {
              onPresetChange(e.target.value as DatePresetsEnum)
            }}
          >
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
          disabled={preset !== DatePresetsEnum.CUSTOM}
          label="From Date"
          value={fromDate}
          onChange={(newValue) => {
            if (preset === DatePresetsEnum.CUSTOM) setFromDate(newValue)
          }}
        />
        <MUIDatePicker
          minDate={dayjs('2023-03-01')}
          disableFuture
          slotProps={{ field: { sx: { width: '100%' } } }}
          disabled={preset !== DatePresetsEnum.CUSTOM}
          label="To Date"
          value={toDate}
          onChange={(newValue) => {
            if (preset === DatePresetsEnum.CUSTOM) setToDate(newValue)
          }}
        />
      </Stack>
    </LocalizationProvider>
  )
}
