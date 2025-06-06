import React from 'react'

import { ShipOreChooser as ShipOreChooserComponent } from './ShipOreChooser'
import { VehicleOreChooser as VehicleOreChooserComponent } from './VehicleOreChooser'
import { Grid, Typography } from '@mui/material'

export default {
  title: 'Fields/OreChooser',
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
}

export const OreChooser = () => (
  <Grid container>
    <Grid size={{ xs: 6 }}>
      <Typography>SINGLE</Typography>
      <ShipOreChooserComponent />
    </Grid>
    <Grid size={{ xs: 6 }}>
      <Typography>MULTIPLE</Typography>
      <ShipOreChooserComponent multiple />
    </Grid>
    <Grid size={{ xs: 6 }} sx={{ my: 4 }}>
      <Typography>SINGLE</Typography>
      <VehicleOreChooserComponent />
    </Grid>
    <Grid size={{ xs: 6 }} sx={{ my: 4 }}>
      <Typography>MULTIPLE</Typography>
      <VehicleOreChooserComponent multiple />
    </Grid>
  </Grid>
)
