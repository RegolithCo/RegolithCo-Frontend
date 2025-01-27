import * as React from 'react'

import { Autocomplete, MenuItem, Stack, TextField, Typography, useTheme } from '@mui/material'
import { GravityWell, GravityWellTypeEnum, Lookups, SystemEnum } from '@regolithco/common'
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
  const { color, icon, label } = (options || {}) as GravityWellOptions
  return (
    <Stack style={{ color }} direction="row" spacing={2} alignItems="center">
      {icon}
      <Typography>{label}</Typography>
    </Stack>
  )
}

export const GravityWellNameLookup: React.FC<{ code: string }> = ({ code }) => {
  const dataStore = React.useContext(LookupsContext)
  const userTheme = useTheme()
  if (!dataStore.ready) return null
  const systemLookup = React.useMemo(() => {
    const lookup = (dataStore.getLookup('gravityWellLookups') as Lookups['gravityWellLookups']) || []
    return getGravityWellOptions(userTheme, lookup)
  }, [dataStore]) as GravityWellOptions[]

  const well =
    systemLookup.find((well) => well.id === code) ||
    ({
      color: 'white',
      depth: 0,
      icon: null,
      id: code,
      label: code,
      parent: null,
      parents: [],
      parentType: null,
      system: SystemEnum.Stanton,
      wellType: GravityWellTypeEnum.PLANET,
      isSpace: false,
      isSurface: true,
    } as GravityWellOptions)
  return <GravityWellNameRender options={well as GravityWellOptions} />
}

export const getGravityWellOptions = (theme, systemLookup): GravityWellOptions[] => {
  if (!systemLookup) return []
  const systems = systemLookup.filter(({ wellType }) => wellType === GravityWellTypeEnum.SYSTEM)
  //  Need to output all values in the format of { label: 'SYSTEMNAME - PLANETNAME - SATNAME', id: 'PY' }
  const planetOptions = systems.reduce((acc, system, key) => {
    acc.push({
      ...system,
      color: theme.palette.primary.main,
      icon: <Brightness5 />,
    })
    systemLookup
      .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.BELT && parent === system.id)
      .forEach((belt, idx) => {
        acc.push({
          ...belt,
          color: theme.palette.secondary.light,
          icon: <RockIcon />,
        })
      })

    // Now we descend into planets
    systemLookup
      .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.PLANET && parent === system.id)
      .forEach((planet, idx) => {
        acc.push({
          ...planet,
          color: theme.palette.info.main,
          icon: <Language />,
        })
        systemLookup
          .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.BELT && parent === planet.id)
          .forEach((belt, idx) => {
            acc.push({
              ...belt,
              color: theme.palette.secondary.light,
              icon: <RockIcon />,
            })
          })
        systemLookup
          .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.LAGRANGE && parent === planet.id)
          .forEach((lagrange, idx) => {
            acc.push({
              ...lagrange,
              color: theme.palette.info.dark,
              icon: <GolfCourse />,
            })
          })
        systemLookup
          .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.SATELLITE && parent === planet.id)
          .forEach((sat, idx) => {
            acc.push({
              ...sat,
              color: 'white',
              icon: <Bedtime />,
            })
            systemLookup
              .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.BELT && parent === sat.id)
              .forEach((belt, idx) => {
                acc.push({
                  ...belt,
                  color: theme.palette.secondary.light,
                  icon: <RockIcon />,
                })
              })
          })
      })

    // Finally we use system clusters
    systemLookup
      .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.CLUSTER && parent === system.id)
      .forEach((cluster, idx) => {
        acc.push({
          ...cluster,
          color: theme.palette.success.main,
          icon: <Bedtime />,
        })
      })

    return acc
  }, [] as GravityWellOptions[])
  return planetOptions
}

export const GravityWellChooser: React.FC<GravityWellChooserProps> = ({ onClick, wellId, filterToSystem }) => {
  const theme = useTheme()

  const dataStore = React.useContext(LookupsContext)

  const gravityWells = React.useMemo(
    () => dataStore.getLookup('gravityWellLookups') as Lookups['gravityWellLookups'],
    [dataStore]
  ) as GravityWell[]

  if (!dataStore.ready) return null
  // NO HOOKS BELOW HERE
  //  Need to output all values in the format of { label: 'SYSTEMNAME - PLANETNAME - SATNAME', id: 'PY' }
  const planetOptions = getGravityWellOptions(theme, gravityWells)

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
              option.wellType.toLowerCase().includes(word)
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
