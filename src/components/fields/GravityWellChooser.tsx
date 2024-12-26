import * as React from 'react'

import { Autocomplete, MenuItem, Stack, TextField, Typography, useTheme } from '@mui/material'
import { GravirtyWellTypeEnum, Lookups, SystemEnum, SystemLookupItem } from '@regolithco/common'
import { LookupsContext } from '../../context/lookupsContext'
import { Bedtime, Brightness5, GolfCourse, Language } from '@mui/icons-material'
import { RockIcon } from '../../icons'
import { GravityWellOptions } from '../../types'

export interface GravityWellChooserProps {
  wellId: string | null
  filterToSystem?: SystemEnum | null
  onClick: (choice: string | null) => void
  isSmall?: boolean
}

export const GravityWellNameRender: React.FC<{ options: GravityWellOptions }> = ({ options }) => {
  const { color, icon, label } = options
  return (
    <Stack style={{ color }} direction="row" spacing={2} alignItems="center">
      {icon}
      <Typography>{label}</Typography>
    </Stack>
  )
}

export const getGravityWellOptions = (theme, systemLookup): GravityWellOptions[] => {
  if (!systemLookup) return []
  const systems = systemLookup.filter(({ wellType }) => wellType === GravirtyWellTypeEnum.SYSTEM)
  //  Need to output all values in the format of { label: 'SYSTEMNAME - PLANETNAME - SATNAME', id: 'PY' }
  const planetOptions = systems.reduce((acc, system, key) => {
    acc.push({
      label: system.name,
      type: GravirtyWellTypeEnum.SYSTEM,
      id: system.code,
      system: system.code as SystemEnum,
      color: theme.palette.primary.main,
      icon: <Brightness5 />,
      depth: 0,
      parents: [],
      parentType: null,
    })
    systemLookup
      .filter(({ wellType, parent }) => wellType === GravirtyWellTypeEnum.BELT && parent === system.code)
      .forEach((belt, idx) => {
        acc.push({
          label: belt.name,
          type: GravirtyWellTypeEnum.BELT,
          id: belt.code,
          system: belt.system as SystemEnum,
          color: theme.palette.secondary.light,
          icon: <RockIcon />,
          depth: 1,
          parents: [system.code],
          parentType: GravirtyWellTypeEnum.SYSTEM,
        })
      })

    // Now we descend into planets
    systemLookup
      .filter(({ wellType, parent }) => wellType === GravirtyWellTypeEnum.PLANET && parent === system.code)
      .forEach((planet, idx) => {
        acc.push({
          label: planet.name,
          type: GravirtyWellTypeEnum.PLANET,
          id: planet.code,
          system: planet.system as SystemEnum,
          color: theme.palette.info.main,
          icon: <Language />,
          depth: 1,
          parents: [system.code],
          parentType: GravirtyWellTypeEnum.SYSTEM,
        })
        systemLookup
          .filter(({ wellType, parent }) => wellType === GravirtyWellTypeEnum.LAGRANGE && parent === planet.code)
          .forEach((lagrange, idx) => {
            acc.push({
              label: lagrange.name,
              type: GravirtyWellTypeEnum.LAGRANGE,
              id: lagrange.code,
              system: lagrange.system as SystemEnum,
              color: theme.palette.info.dark,
              icon: <GolfCourse />,
              depth: 2,
              parents: [system.code, planet.code],
              parentType: GravirtyWellTypeEnum.PLANET,
            })
          })
        systemLookup
          .filter(({ wellType, parent }) => wellType === GravirtyWellTypeEnum.SATELLITE && parent === planet.code)
          .forEach((sat, idx) => {
            acc.push({
              label: sat.name,
              type: GravirtyWellTypeEnum.CLUSTER,
              id: sat.code,
              system: sat.system as SystemEnum,
              color: 'white',
              icon: <Bedtime />,
              depth: 2,
              parents: [system.code, planet.code],
              parentType: GravirtyWellTypeEnum.PLANET,
            })
          })
      })

    // Finally we use system clusters
    systemLookup
      .filter(({ wellType, parent }) => wellType === GravirtyWellTypeEnum.CLUSTER && parent === system.code)
      .forEach((cluster, idx) => {
        acc.push({
          label: cluster.name,
          type: GravirtyWellTypeEnum.CLUSTER,
          id: cluster.code,
          system: cluster.system as SystemEnum,
          color: theme.palette.success.main,
          icon: <Bedtime />,
          depth: 1,
          parents: [system.code],
          parentType: GravirtyWellTypeEnum.SYSTEM,
        })
      })

    return acc
  }, [] as GravityWellOptions[])
  return planetOptions
}

export const GravityWellChooser: React.FC<GravityWellChooserProps> = ({ onClick, wellId, filterToSystem }) => {
  const theme = useTheme()

  const dataStore = React.useContext(LookupsContext)

  if (!dataStore.ready) return null
  const systemLookup = React.useMemo(
    () => dataStore.getLookup('gravityWellLookups') as Lookups['gravityWellLookups'],
    [dataStore]
  ) as SystemLookupItem[]

  // NO HOOKS BELOW HERE
  //  Need to output all values in the format of { label: 'SYSTEMNAME - PLANETNAME - SATNAME', id: 'PY' }
  const planetOptions = getGravityWellOptions(theme, systemLookup)

  return (
    <Autocomplete
      id="combo-box-demo"
      options={planetOptions}
      fullWidth
      autoHighlight
      sx={{
        mb: 3,
        // I want the border and the label to all be red
        '& .MuiInputLabel-root': {
          color: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
          },
          '&:hover fieldset': {
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused fieldset': {
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
          },
        },
      }}
      size="small"
      value={planetOptions.find((opt) => opt.id === wellId) || null}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(event, newValue) => {
        onClick(newValue?.id || null)
      }}
      filterOptions={(options, { inputValue }) => {
        const words = inputValue
          .split(' ')
          .map((word) => word.toLowerCase().trim())
          .filter((word) => word && word.length)
        // return values (case insensitive) that match ALL of the words
        return options.filter((option) => {
          if (wellId === option.id) return true
          if (filterToSystem && filterToSystem !== option.system) return false
          const found = words.map(
            (word) =>
              option.label.toLowerCase().includes(word) ||
              option.id.toLowerCase().includes(word) ||
              option.type.toLowerCase().includes(word)
          )
          return found.every((f) => f)
        })
      }}
      // getOptionLabel={(option) => option.label}
      renderOption={(props, option, { selected }) => {
        const { key, ...rest } = props
        const spacing: number = (option.depth || 0) * 2
        return (
          <MenuItem
            key={key}
            {...rest}
            value={option.id}
            sx={{
              ml: spacing,
              backgroundColor: selected ? theme.palette.action.selected : 'transparent',
            }}
          >
            <GravityWellNameRender options={option} />
          </MenuItem>
        )
      }}
      renderInput={(params) => <TextField {...params} label="Location (Gravity Well)" />}
    />
  )
}
