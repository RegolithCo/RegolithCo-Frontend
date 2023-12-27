import React from 'react'
// import { StoryFn, Meta } from '@storybook/react'

import { WorkOrderAddFAB } from './WorkOrderAddFAB'
import { ScoutingAddFAB } from './ScoutingAddFAB'
import { Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { fakeSessionSettings } from '@regolithco/common/dist/mock'
import { ActivityEnum } from '@regolithco/common'

export default {
  title: 'Fields/FABs',
  parameters: {},
}

const Template = () => (
  <Grid container>
    <Grid sx={{ height: 500, border: '1px solid', position: 'relative' }} xs={3}>
      <Typography>ScoutingAddFAB</Typography>
      <ScoutingAddFAB />
    </Grid>
    <Grid sx={{ height: 500, border: '1px solid', position: 'relative' }} xs={3}>
      <Typography>ScoutingAddFAB Locked</Typography>
      <ScoutingAddFAB sessionSettings={fakeSessionSettings({ activity: ActivityEnum.ShipMining })} />
    </Grid>
    <Grid sx={{ height: 500, border: '1px solid', position: 'relative' }} xs={3}>
      <Typography>WorkOrderAddFAB</Typography>
      <WorkOrderAddFAB />
    </Grid>
    <Grid sx={{ height: 500, border: '1px solid', position: 'relative' }} xs={3}>
      <Typography>WorkOrderAddFAB Locked</Typography>
      <WorkOrderAddFAB sessionSettings={fakeSessionSettings({ activity: ActivityEnum.ShipMining })} />
    </Grid>
  </Grid>
)

export const Variations = Template.bind({})
