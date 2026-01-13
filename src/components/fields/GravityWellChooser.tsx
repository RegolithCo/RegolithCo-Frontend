import * as React from 'react'

import { Autocomplete, MenuItem, Stack, TextField, Tooltip, Typography, useTheme, Theme } from '@mui/material'
import { GravityWell, GravityWellTypeEnum, Lookups, SystemEnum } from '@regolithco/common'
import { LookupsContext } from '../../context/lookupsContext'
import { Bedtime, Brightness5, GolfCourse, Language, ScatterPlotOutlined } from '@mui/icons-material'
import { RockIcon } from '../../icons'
import { GravityWellOptions } from '../../types'
import { MValueFormat, MValueFormatter } from './MValue'

export interface GravityWellChooserProps {
  wellId: string | null
  filterToSystem?: SystemEnum | null
  onClick: (choice: string | null) => void
  bonuses?: Record<string, number>
  isSmall?: boolean
}

export const GravityWellNameRender: React.FC<{ options: GravityWellOptions; bonus?: number; simple?: boolean }> = ({
  options,
  bonus,
  simple,
}) => {
  const { color, icon, label } = (options || {}) as GravityWellOptions
  if (simple) return label
  return (
    <Stack sx={{ color, width: '100%' }} direction="row" spacing={2} alignItems="center">
      {icon}
      <Typography component={'div'} flex={1}>
        {label}
      </Typography>
      {bonus && (
        <Tooltip title="Scanning Area Bonus">
          <Typography variant={'caption'}>{MValueFormatter(bonus, MValueFormat.number, 2)}</Typography>
        </Tooltip>
      )}
    </Stack>
  )
}

export const GravityWellNameLookup: React.FC<{ code: string; simple: boolean }> = ({ code, simple }) => {
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
      hasGems: false,
      hasRocks: false,
    } as GravityWellOptions)
  return <GravityWellNameRender options={well as GravityWellOptions} simple={simple} />
}

export const getGravityWellOptions = (theme: Theme, systemLookup: GravityWell[]): GravityWellOptions[] => {
  if (!systemLookup) return []

  const getIconAndColor = (well: GravityWell) => {
    switch (well.wellType) {
      case GravityWellTypeEnum.SYSTEM:
        return { color: theme.palette.primary.main, icon: <Brightness5 /> }
      case GravityWellTypeEnum.BELT:
        return { color: theme.palette.secondary.light, icon: <RockIcon /> }
      case GravityWellTypeEnum.PLANET:
        return { color: theme.palette.info.main, icon: <Language /> }
      case GravityWellTypeEnum.LAGRANGE:
        return { color: theme.palette.info.dark, icon: <GolfCourse /> }
      case GravityWellTypeEnum.CLUSTER:
        return { color: theme.palette.success.main, icon: <ScatterPlotOutlined /> }
      case GravityWellTypeEnum.SATELLITE:
        return { color: 'white', icon: <Bedtime /> }
      default:
        return { color: 'white', icon: null }
    }
  }

  const nodes = new Map<string, GravityWell>()
  const childrenMap = new Map<string, string[]>()

  systemLookup.forEach((well) => {
    nodes.set(well.id, well)
    const parent = well.parent || 'ROOT'
    if (!childrenMap.has(parent)) {
      childrenMap.set(parent, [])
    }
    childrenMap.get(parent)!.push(well.id)
  })

  const roots = systemLookup.filter((well) => !well.parent || !nodes.has(well.parent))

  // Sort roots to prioritize SYSTEMS if they are present
  roots.sort((a, b) => {
    if (a.wellType === GravityWellTypeEnum.SYSTEM && b.wellType !== GravityWellTypeEnum.SYSTEM) return -1
    if (a.wellType !== GravityWellTypeEnum.SYSTEM && b.wellType === GravityWellTypeEnum.SYSTEM) return 1
    return 0
  })

  const result: GravityWellOptions[] = []
  const processed = new Set<string>()

  const traverse = (id: string, depth: number, parents: string[]) => {
    if (processed.has(id)) return
    const well = nodes.get(id)
    if (!well) return

    processed.add(id)
    const { color, icon } = getIconAndColor(well)
    result.push({
      ...well,
      depth: well.depth !== undefined ? well.depth : depth,
      parents: well.parents && well.parents.length ? well.parents : parents,
      color,
      icon,
    })

    const children = childrenMap.get(id) || []
    children.forEach((childId) => traverse(childId, depth + 1, [...parents, id]))
  }

  roots.forEach((root) => traverse(root.id, 0, []))

  // Final fallback to ensure nothing was missed (e.g. cycles, which shouldn't happen)
  systemLookup.forEach((well) => {
    if (!processed.has(well.id)) {
      traverse(well.id, 0, [])
    }
  })

  return result
}

export const GravityWellChooser: React.FC<GravityWellChooserProps> = ({ onClick, wellId, filterToSystem, bonuses }) => {
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
          if (
            filterToSystem &&
            filterToSystem.toLowerCase() !== (option.system || '').toLowerCase() &&
            filterToSystem.toLowerCase() !== (option.id || '').toLowerCase()
          ) {
            return false
          }
          const found = words.map(
            (word) =>
              option.label.toLowerCase().includes(word) ||
              option.id.toLowerCase().includes(word) ||
              option.wellType.toLowerCase().includes(word)
          )
          return found.every((f) => f)
        })
      }}
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
            <GravityWellNameRender
              options={option}
              bonus={bonuses && bonuses[option.id] ? bonuses[option.id] : undefined}
            />
          </MenuItem>
        )
      }}
      renderInput={(params) => <TextField {...params} label="Location (Gravity Well)" />}
    />
  )
}
