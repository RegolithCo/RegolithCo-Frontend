import React from 'react'
// import { StoryFn, Meta } from '@storybook/react'

import { WorkOrderAddFAB } from './WorkOrderAddFAB'
import { ScoutingAddFAB } from './ScoutingAddFAB'
import { Typography, Grid } from '@mui/material'
import { fakeSessionSettings } from '@regolithco/common/dist/__mocks__'
import { ActivityEnum } from '@regolithco/common'

export default {
  title: 'Fields/FABs',
  parameters: {},
}

const Template = () => (
  <Grid container>
    <Grid sx={{ height: 500, border: '1px solid', position: 'relative' }} size={{ xs: 3 }}>
      <Typography>ScoutingAddFAB</Typography>
      <ScoutingAddFAB />
    </Grid>
    <Grid sx={{ height: 500, border: '1px solid', position: 'relative' }} size={{ xs: 3 }}>
      <Typography>ScoutingAddFAB Locked</Typography>
      <ScoutingAddFAB sessionSettings={fakeSessionSettings({ activity: ActivityEnum.ShipMining })} />
    </Grid>
    <Grid sx={{ height: 500, border: '1px solid', position: 'relative' }} size={{ xs: 3 }}>
      <Typography>WorkOrderAddFAB</Typography>
      <WorkOrderAddFAB />
    </Grid>
    <Grid sx={{ height: 500, border: '1px solid', position: 'relative' }} size={{ xs: 3 }}>
      <Typography>WorkOrderAddFAB Locked</Typography>
      <WorkOrderAddFAB sessionSettings={fakeSessionSettings({ activity: ActivityEnum.ShipMining })} />
    </Grid>
  </Grid>
)

export const Variations = Template.bind({})
