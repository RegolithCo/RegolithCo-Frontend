import React from 'react'
import { Autocomplete, Paper, TextField, Typography, createFilterOptions } from '@mui/material'
import { UserSuggest, validateSCName } from '@regolithco/common'
import { UserListItem } from './UserListItem'
import { fontFamilies } from '../../theme'
import { Box } from '@mui/system'
import { validate } from 'numeral'
// import log from 'loglevel'

export interface SellerPickerProps {
  value: string
  disabled?: boolean
  onChange?: (scName: string) => void
  disableList?: string[]
  includeMentioned?: boolean
  includeFriends?: boolean
  userSuggest?: UserSuggest
}

// const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({})

const filter = createFilterOptions<
  [
    string,
    {
      friend: boolean
      session: boolean
      named: boolean
      crew: boolean
    },
  ]
>()

export const SellerPicker: React.FC<SellerPickerProps> = ({
  value,
  disabled,
  onChange,
  userSuggest,
  disableList,
  includeMentioned,
  includeFriends,
}) => {
  const [inputValue, setInputValue] = React.useState(value)
  const isValid = validateSCName(inputValue)
  return (
    <Autocomplete
      id="seller-picker"
      color="primary"
      disabled={disabled}
      multiple={false}
      value={value}
      disableClearable
      blurOnSelect
      fullWidth
      freeSolo
      inputValue={inputValue}
      PaperComponent={(props) => (
        <Paper {...props}>
          <Box sx={{ px: 2, py: 1, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Who is selling this order?
            </Typography>
          </Box>
          {props.children}
        </Paper>
      )}
      renderOption={(props, [scName, { friend, session, named, crew }]) => {
        // key will throw an error if we pas it through and then spread the props
        const { key, ...rest } = props
        return (
          <UserListItem
            scName={scName}
            key={`scname-${scName}-${friend}-${session}-${named}-${crew}}`}
            props={rest}
            session={session}
            named={named}
            crew={crew}
            friend={friend}
          />
        )
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      getOptionLabel={(option) => {
        if (option === null) return ''
        if (typeof option === 'string') return option
        if (Array.isArray(option) && option[0]) return option[0]
        else return ''
      }}
      getOptionDisabled={(option) =>
        (disableList || []).find((cs) => cs.toLowerCase() === option[0].toLowerCase()) !== undefined
      }
      options={Object.entries(userSuggest || {})}
      sx={{ my: 1 }}
      renderInput={(params) => (
        <TextField
          variant="standard"
          color="primary"
          {...params}
          error={!isValid}
          placeholder="Type a session user or friend name..."
          helperText={!isValid ? 'Invalid name' : ''}
          InputProps={{
            ...params.InputProps,
            color: 'primary',
            startAdornment: (
              <Typography variant="overline" sx={{ fontWeight: 'bold' }} color="secondary">
                Seller:
              </Typography>
            ),
            sx: {
              color: 'inherit',
              fontFamily: fontFamilies.robotoMono,
              textAlign: 'right',
              '& .MuiInputBase-input': {
                color: 'inherit',
                fontFamily: fontFamilies.robotoMono,
                textAlign: 'right',
              },
              fontSize: {
                xs: '0.8rem',
                md: '0.9rem',
                lg: '1rem',
              },
              fontWeight: 'bold',
              '& .MuiSelect-select': {
                mx: 2,
                my: 1,
              },
            },
          }}
        />
      )}
      filterOptions={(options, params) => {
        const filtered = filter(options, params)
        if (params.inputValue !== '') {
          filtered.push([
            params.inputValue,
            { session: false, friend: !includeFriends, named: !includeMentioned, crew: false },
          ])
        }
        return filtered
      }}
      onChange={(event, option) => {
        const addName = typeof option === 'string' ? option.trim() : Array.isArray(option) ? option[0] : ''
        if (addName === null || addName === '' || !validateSCName(addName as string)) {
          setInputValue(value)
          return value
        } else {
          onChange && onChange(addName)
        }
      }}
    />
  )
}
