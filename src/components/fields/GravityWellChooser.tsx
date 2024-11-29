import * as React from 'react'

import { Autocomplete, MenuItem, SxProps, TextField, Theme, useTheme } from '@mui/material'
import { Lookups, SystemLookup } from '@regolithco/common'
import { LookupsContext } from '../../context/lookupsContext'
import { Bedtime, Brightness5, GolfCourse, Language } from '@mui/icons-material'
import { RockIcon } from '../../icons'

export interface GravityWellChooserProps {
  wellId: string | null
  onClick: (choice: string | null) => void
}

const styleThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  tinyChips: {
    fontSize: '0.7rem',
    mr: 0.5,
    height: 14,
    borderRadius: 1,
    fontWeight: 'bold',
  },
})

export const gravityWellName = (id: string, systemLookup: SystemLookup): string => {
  let finalRenderName = id

  //  Need to output all values in the format of { label: 'SYSTEMNAME - PLANETNAME - SATNAME', id: 'PY' }
  Object.entries(systemLookup).forEach(([sysKey, sysObj], key) => {
    if (sysKey === id) {
      finalRenderName = sysObj.name
      return
    }
    if (id === 'AARON_HALO') {
      finalRenderName = `${sysObj.name} ▶ Aaron Halo`
      return
    }
    Object.entries(sysObj.planets || {}).forEach(([plKey, plObj], idx) => {
      if (plKey === id) {
        finalRenderName = `${sysObj.name} ▶ ${plObj.name}`
        return
      }
      Object.entries(plObj.satellites).forEach(([satKey, satName], idx) => {
        if (satKey === id) {
          finalRenderName = `${sysObj.name} ▶ ${plObj.name} ▶ ${satName}`
          return
        }
      })
      const lagrange = ['L1', 'L2', 'L3', 'L4', 'L5']
      lagrange.forEach((lagKey) => {
        if (`${plKey}-${lagKey}` === id) {
          finalRenderName = `${sysObj.name} ▶ ${plObj.name} - ${lagKey}`
          return
        }
      })
    })
  })
  return finalRenderName
}

export const GravityWellNameRender: React.FC<{ id: string }> = ({ id }) => {
  const dataStore = React.useContext(LookupsContext)
  if (!dataStore.ready) return null
  const systemLookup = React.useMemo(
    () => dataStore.getLookup('planetLookups') as Lookups['planetLookups'],
    [dataStore]
  ) as SystemLookup

  if (!dataStore.ready) return id

  return gravityWellName(id, systemLookup)
}

export const GravityWellChooser: React.FC<GravityWellChooserProps> = ({ onClick, wellId }) => {
  const theme = useTheme()
  const styles = styleThunk(theme)
  const dataStore = React.useContext(LookupsContext)

  if (!dataStore.ready) return null
  const systemLookup = React.useMemo(
    () => dataStore.getLookup('planetLookups') as Lookups['planetLookups'],
    [dataStore]
  ) as SystemLookup

  // // NO HOOKS BELOW HERE

  //  Need to output all values in the format of { label: 'SYSTEMNAME - PLANETNAME - SATNAME', id: 'PY' }
  const planetOptions = Object.entries(systemLookup).reduce(
    (acc, [sysKey, sysObj], key) => {
      acc.push({
        label: sysObj.name,
        type: 'system',
        id: sysKey,
      })
      if (sysKey === 'ST')
        acc.push({
          label: `Aaron Halo`,
          type: 'belt',
          id: `AARON_HALO`,
        })
      Object.entries(sysObj.planets).forEach(([plKey, plObj], idx) => {
        acc.push({
          label: plObj.name,
          type: 'planet',
          id: plKey,
        })
        Object.entries(plObj.satellites).forEach(([satKey, satName], idx) => {
          acc.push({
            label: satName,
            type: 'satellite',
            id: satKey,
          })
        })
        const lagrange = ['L1', 'L2', 'L3', 'L4', 'L5']
        lagrange.forEach((lagKey) => {
          acc.push({
            label: `${plObj.name} - ${lagKey}`,
            type: 'lagrange',
            id: `${plKey}-${lagKey}`,
          })
        })
      })
      return acc
    },
    [] as { label: string; type: string; id: string }[]
  )

  return (
    <Autocomplete
      id="combo-box-demo"
      options={planetOptions}
      fullWidth
      autoHighlight
      sx={{ mb: 3 }}
      value={planetOptions.find((opt) => opt.id === wellId) || null}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(event, newValue) => {
        onClick(newValue?.id || null)
      }}
      getOptionLabel={(option) => gravityWellName(option.id, systemLookup)}
      renderOption={(props, option, { selected }) => {
        let color = theme.palette.text.primary
        switch (option.type) {
          case 'system':
            color = theme.palette.primary.main
            break
          case 'lagrange':
            color = theme.palette.success.main
            break
          case 'planet':
            color = theme.palette.info.main
            break
        }
        const { key, ...rest } = props
        return (
          <MenuItem
            key={key}
            {...rest}
            value={option.id}
            sx={{
              color: color,
              fontWeight: option.type === 'satellite' ? 'normal' : 'bold',
            }}
          >
            {option.type === 'system' && (
              <Brightness5
                sx={{
                  mr: 2,
                }}
              />
            )}
            {option.type === 'belt' && (
              <RockIcon
                sx={{
                  mr: 2,
                  ml: 3,
                }}
              />
            )}
            {option.type === 'planet' && (
              <Language
                sx={{
                  mr: 2,
                  ml: 3,
                }}
              />
            )}
            {option.type === 'lagrange' && (
              <GolfCourse
                sx={{
                  mr: 2,
                  ml: 6,
                }}
              />
            )}
            {option.type === 'satellite' && (
              <Bedtime
                sx={{
                  mr: 2,
                  ml: 6,
                }}
              />
            )}
            {option.label}
          </MenuItem>
        )
      }}
      renderInput={(params) => <TextField {...params} label="Gravity Well" />}
    />
  )
}
