import React from 'react'
import { Select, MenuItem, Avatar, SelectProps, Box, Menu } from '@mui/material'
import { DiscordGuildInput, MyDiscordGuild } from '@regolithco/common'
import { Diversity3 } from '@mui/icons-material'

export interface DiscordGuildChooserProps {
  discordGuildId?: string
  allowNone?: boolean
  options: MyDiscordGuild[]
  disabled: boolean
  onChange: (method?: DiscordGuildInput) => void
  selectProps?: SelectProps
}

export const DiscordGuildChooser: React.FC<DiscordGuildChooserProps> = ({
  discordGuildId,
  allowNone,
  options,
  disabled,
  onChange,
  selectProps = {},
}) => {
  return (
    <Select
      labelId="discordServer"
      id="discordServer"
      variant="standard"
      size="small"
      value={discordGuildId || ''}
      label="Discord Server"
      fullWidth
      disabled={disabled}
      renderValue={(selected) => {
        const selectedOption = options.find((option) => option.id === selected)
        return (
          <Box display="flex" alignItems="center">
            <Avatar src={selectedOption?.iconUrl || undefined} sx={{ width: 24, height: 24, marginRight: 1 }}>
              <Diversity3 color="primary" />
            </Avatar>
            {selectedOption?.name}
          </Box>
        )
      }}
      onChange={(event) => {
        const chosenGuild = options.find((option) => option.id === event.target.value)
        if (chosenGuild) {
          const { __typename, hasPermission, ...chosenGuildWithoutPermission } = chosenGuild
          onChange(chosenGuildWithoutPermission)
        } else {
          onChange(undefined)
        }
      }}
      {...selectProps}
    >
      {allowNone ? (
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
      ) : (
        <MenuItem value="" disabled>
          <em>Choose a Discord Server</em>
        </MenuItem>
      )}
      {options.map((option) => (
        // I want an option with the guild name and icon and a suffix that says (can post) if the permissions are correct
        <MenuItem key={option.id} value={option.id} disabled={!option.hasPermission}>
          <Avatar src={option.iconUrl || undefined} sx={{ width: 24, height: 24, marginRight: 1 }}>
            <Diversity3 color="primary" />
          </Avatar>
          {option.name}
          {option.hasPermission ? '' : ' (missing permissions)'}
        </MenuItem>
      ))}
    </Select>
  )
}
