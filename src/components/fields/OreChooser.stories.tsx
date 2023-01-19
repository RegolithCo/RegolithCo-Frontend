import React from 'react'

import { ShipOreChooser as ShipOreChooserComponent } from './ShipOreChooser'
import { VehicleOreChooser as VehicleOreChooserComponent } from './VehicleOreChooser'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Typography } from '@mui/material'

export default {
  title: 'Fields/OreChooser',
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
}

export const OreChooser = () => (
  <Grid container>
    <Grid xs={6}>
      <Typography>SINGLE</Typography>
      <ShipOreChooserComponent />
    </Grid>
    <Grid xs={6}>
      <Typography>MULTIPLE</Typography>
      <ShipOreChooserComponent multiple />
    </Grid>
    <Grid xs={6} sx={{ my: 4 }}>
      <Typography>SINGLE</Typography>
      <VehicleOreChooserComponent />
    </Grid>
    <Grid xs={6} sx={{ my: 4 }}>
      <Typography>MULTIPLE</Typography>
      <VehicleOreChooserComponent multiple />
    </Grid>
  </Grid>
)
