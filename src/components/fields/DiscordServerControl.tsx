import React from 'react'
import { FormControlLabel, Switch, Typography, InputLabel } from '@mui/material'
import { DiscordGuild, DiscordGuildInput, MyDiscordGuild } from '@regolithco/common'
import { Stack } from '@mui/system'
import { DiscordGuildChooser } from './DiscordGuildChooser'

export interface DiscordServerControlProps {
  discordGuild?: DiscordGuild
  options: MyDiscordGuild[]
  isDiscordEnabled: boolean
  onChange: (method?: DiscordGuildInput) => void
}

export const DiscordServerControl: React.FC<DiscordServerControlProps> = ({
  discordGuild: lockToDiscordGuild,
  options,
  isDiscordEnabled,
  onChange,
}) => {
  const hasOneValid = options.length > 0 && options.some((guild) => guild.hasPermission)
  return (
    <Stack gap={2} direction="column">
      <FormControlLabel
        checked={Boolean(lockToDiscordGuild)}
        disabled={!isDiscordEnabled || !hasOneValid}
        control={
          <Switch
            onChange={(e) => {
              // If checked, find the first guild that has permission and submit that
              if (e.target.checked) {
                const myGuild = options.find((option) => option.hasPermission)
                if (myGuild) {
                  // Strip out the __typename and hasPermission fields before sending
                  const { __typename, hasPermission, ...myGuildWithoutPermission } = myGuild
                  onChange(myGuildWithoutPermission)
                }
              } else {
                onChange(undefined)
              }
            }}
          />
        }
        label="Users must be a member of a discord server to join this session."
      />
      {!isDiscordEnabled && (
        <Typography variant="caption" color="text.secondary">
          You must be logged into Regolith using Discord authentication to use this option.
        </Typography>
      )}
      {isDiscordEnabled && !hasOneValid && (
        <Typography variant="caption" color="text.secondary">
          To use this option you must have permission to join a voice channel on at least one discord server.
        </Typography>
      )}
      {isDiscordEnabled && lockToDiscordGuild && <InputLabel id="label">Discord Server</InputLabel>}
      {isDiscordEnabled && lockToDiscordGuild && (
        <DiscordGuildChooser
          disabled={!isDiscordEnabled || !hasOneValid}
          discordGuildId={lockToDiscordGuild?.id}
          options={options}
          onChange={onChange}
        />
      )}
    </Stack>
  )
}
