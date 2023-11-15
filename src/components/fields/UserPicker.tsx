import React from 'react'
import { Autocomplete, TextField, createFilterOptions, Tooltip } from '@mui/material'
import { UserSuggest } from '@regolithco/common'
import { UserListItem } from './UserListItem'
// import log from 'loglevel'

export interface UserPickerProps {
  label?: string
  toolTip?: React.ReactNode | null
  onChange: (scName: string) => void
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
    }
  ]
>()

export const UserPicker: React.FC<UserPickerProps> = ({
  label,
  toolTip,
  onChange,
  userSuggest,
  disableList,
  includeMentioned,
  includeFriends,
}) => {
  // const theme = useTheme()
  // const styles = stylesThunk(theme)

  const finalTooltip = toolTip !== undefined ? toolTip : 'Enter a user name to add to the list'

  return (
    <Tooltip title={finalTooltip}>
      <Autocomplete
        id="adduser"
        color="primary"
        key={`userPicker`}
        renderOption={(props, [scName, { friend, session, named, crew }]) => (
          <UserListItem
            scName={scName}
            key={`scname-${scName}`}
            props={props}
            session={session}
            named={named}
            crew={crew}
            friend={friend}
          />
        )}
        clearOnBlur
        blurOnSelect
        fullWidth
        freeSolo
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
        renderInput={(params) => <TextField variant="standard" {...params} label={label || 'Add User'} />}
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
          const addName = typeof option === 'string' ? option : Array.isArray(option) ? option[0] : ''
          onChange && onChange(addName)
        }}
      />
    </Tooltip>
  )
}
