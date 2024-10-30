import * as React from 'react'

import { Autocomplete, SxProps, TextField, Theme, useTheme } from '@mui/material'
import { Lookups } from '@regolithco/common'
import { LookupsContext } from '../../context/lookupsContext'

export interface GravityWellChooserProps {
  planetValue: string
  onClick: (choice: string) => void
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

export const GravityWellChooser: React.FC<GravityWellChooserProps> = ({ onClick, planetValue }) => {
  const theme = useTheme()
  const styles = styleThunk(theme)
  const dataStore = React.useContext(LookupsContext)

  if (!dataStore.ready) return null
  const planetLookups = React.useMemo(
    () => dataStore.getLookup('planetLookups') as Lookups['planetLookups'],
    [dataStore]
  )
  console.log('MARZIPAN', planetLookups)

  // // NO HOOKS BELOW HERE
  const planetOptions = Object.keys(planetLookups['ST']).map((key) => ({
    label: planetLookups['ST'][key].name,
    id: key,
  }))

  return (
    <Autocomplete
      id="combo-box-demo"
      options={planetOptions}
      fullWidth
      autoHighlight
      sx={{ mb: 3 }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      // value={gravWell ? { label: getPlanetName(gravWell), id: gravWell } : null}
      onChange={(event, newValue) => {
        // setNewSettings({
        //   ...newSettings,
        //   sessionSettings: {
        //     ...newSettings.sessionSettings,
        //     gravityWell: newValue ? newValue.id : null,
        //   },
        // })
      }}
      renderInput={(params) => <TextField {...params} label="Gravity Well" />}
    />
  )
}
