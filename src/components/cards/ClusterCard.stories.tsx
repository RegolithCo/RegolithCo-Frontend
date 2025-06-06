import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ClusterCard } from './ClusterCard'
import { SalvageFind, ScoutingFindStateEnum, ShipClusterFind, VehicleClusterFind } from '@regolithco/common'
import {
  fakeSalvageFind,
  fakeScoutingFinds,
  fakeShipClusterFind,
  fakeVehicleClusterFind,
} from '@regolithco/common/dist/__mocks__'
import { Box, Grid } from '@mui/material'

interface AllThreeProps {
  shipClusterFind: ShipClusterFind
  salvageFind: SalvageFind
  vehicleClusterFind: VehicleClusterFind
}

const AllThree: React.FC<AllThreeProps> = () => (
  <Box sx={{ p: 4, width: '100%' }}>
    <Grid container spacing={3} margin={0}>
      {/* One of each kind of state */}
      <Grid>
        <ClusterCard scoutingFind={fakeSalvageFind({ state: ScoutingFindStateEnum.Working })} />
      </Grid>
      <Grid>
        <ClusterCard scoutingFind={fakeShipClusterFind({ state: ScoutingFindStateEnum.Working })} />
      </Grid>
      <Grid>
        <ClusterCard scoutingFind={fakeVehicleClusterFind({ state: ScoutingFindStateEnum.Working })} />
      </Grid>
      {/* One of each kind of card */}
      <Grid>
        <ClusterCard scoutingFind={fakeShipClusterFind({ state: ScoutingFindStateEnum.Abandonned })} />
      </Grid>
      <Grid>
        <ClusterCard scoutingFind={fakeShipClusterFind({ state: ScoutingFindStateEnum.Depleted })} />
      </Grid>
      <Grid>
        <ClusterCard scoutingFind={fakeShipClusterFind({ state: ScoutingFindStateEnum.ReadyForWorkers })} />
      </Grid>
      <Grid>
        <ClusterCard scoutingFind={fakeShipClusterFind({ state: ScoutingFindStateEnum.Working })} />
      </Grid>
      <Grid>
        <ClusterCard scoutingFind={fakeShipClusterFind({ state: ScoutingFindStateEnum.Discovered })} />
      </Grid>
      {/* Then a bunch more for fun */}
      {fakeScoutingFinds(20).map((v, idx) => {
        return (
          <Grid key={`fake-${idx}`}>
            <ClusterCard scoutingFind={v} />
          </Grid>
        )
      })}
    </Grid>
  </Box>
)

export default {
  title: 'ScoutingFind/ClusterCards',
  component: AllThree,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof AllThree>

const Template: StoryFn<typeof AllThree> = (args) => <AllThree {...args} />

export const ClusterCards = Template.bind({})
ClusterCards.args = {}
