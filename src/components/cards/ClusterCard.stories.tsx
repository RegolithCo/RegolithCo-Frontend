import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ClusterCard } from './ClusterCard'
import { SalvageFind, ScoutingFindStateEnum, ShipClusterFind, VehicleClusterFind } from '@regolithco/common'
import { fakeSalvageFind, fakeShipClusterFind, fakeVehicleClusterFind } from '@regolithco/common/dist/mock'
import { Box } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'

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
        <ClusterCard clusterFind={fakeSalvageFind({ state: ScoutingFindStateEnum.Working })} />
      </Grid>
      <Grid>
        <ClusterCard clusterFind={fakeShipClusterFind({ state: ScoutingFindStateEnum.Working })} />
      </Grid>
      <Grid>
        <ClusterCard clusterFind={fakeVehicleClusterFind({ state: ScoutingFindStateEnum.Working })} />
      </Grid>
      {/* One of each kind of card */}
      <Grid>
        <ClusterCard clusterFind={fakeShipClusterFind({ state: ScoutingFindStateEnum.Abandonned })} />
      </Grid>
      <Grid>
        <ClusterCard clusterFind={fakeShipClusterFind({ state: ScoutingFindStateEnum.Depleted })} />
      </Grid>
      <Grid>
        <ClusterCard clusterFind={fakeShipClusterFind({ state: ScoutingFindStateEnum.ReadyForWorkers })} />
      </Grid>
      <Grid>
        <ClusterCard clusterFind={fakeShipClusterFind({ state: ScoutingFindStateEnum.Working })} />
      </Grid>
      {/* Then a bunch more for fun */}
      {/* {fakeScoutingFinds(20).map((v, idx) => {
        return (
          <Grid key={`fake-${idx}`}>
            <ClusterCard clusterFind={v} />
          </Grid>
        )
      })} */}
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
} as ComponentMeta<typeof AllThree>

const Template: ComponentStory<typeof AllThree> = (args) => <AllThree {...args} />

export const ClusterCards = Template.bind({})

ClusterCards.args = {}
