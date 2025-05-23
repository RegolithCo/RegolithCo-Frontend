import React from 'react'
import { Autocomplete, TextField, createFilterOptions, Tooltip } from '@mui/material'
import { UserSuggest } from '@regolithco/common'
import { UserListItem } from './UserListItem'
import { PersonAdd } from '@mui/icons-material'
// import log from 'loglevel'

export interface UserPickerProps {
  label?: string
  toolTip?: React.ReactNode | null
  onChange?: (scName: string) => void
  onInputChange?: (scName: string) => void
  disableList?: string[]
  disableResetBox?: boolean // don't reset the box after a choice
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

export const UserPicker: React.FC<UserPickerProps> = ({
  label,
  toolTip,
  onChange,
  onInputChange,
  disableResetBox,
  userSuggest,
  disableList,
  includeMentioned,
  includeFriends,
}) => {
  const [inputValue, setInputValue] = React.useState('')
  const [value, setValue] = React.useState<string | null>(null)
  const textFieldRef = React.useRef<HTMLInputElement>(null)
  // const theme = useTheme()
  // const styles = stylesThunk(theme)

  const finalTooltip = toolTip !== undefined ? toolTip : 'Enter a user name to add to the list'

  return (
    <Tooltip title={finalTooltip} placement="left">
      <Autocomplete
        id="adduser"
        color="primary"
        key={`userPicker`}
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
        value={value}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue)
          onInputChange && onInputChange(newInputValue)
        }}
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
        renderInput={(params) => (
          <TextField
            variant="standard"
            color="primary"
            {...params}
            inputRef={textFieldRef}
            placeholder="Type a session user or friend name..."
            InputProps={{
              ...params.InputProps,
              color: 'primary',
              startAdornment: <PersonAdd color="primary" sx={{ mr: 2 }} />,
            }}
            label={label !== undefined ? label : 'Add User'}
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
          const addName = typeof option === 'string' ? option : Array.isArray(option) ? option[0] : ''
          onChange && onChange(addName)

          // Reset the Autocomplete control if we are not disabling it
          if (!disableResetBox) {
            setValue(null)
            setInputValue('')
            // Set focus on the TextField
            setTimeout(() => {
              textFieldRef?.current?.focus()
            }, 100)
          } else {
            setInputValue(addName)
            setValue(addName)
          }
        }}
      />
    </Tooltip>
  )
}
