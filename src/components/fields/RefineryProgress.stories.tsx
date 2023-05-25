import React from 'react'

import { RefineryProgress as RefineryProgressComponent } from './RefineryProgress'
import { Box, Typography } from '@mui/material'

export default {
  title: 'Fields/RefineryProgress',
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
}

export const RefineryProgress = () => (
  <Box>
    <Box>
      <RefineryProgressComponent
        startTime={Date.now()}
        totalTimeS={30000}
        onChange={(val) => {
          console.log('RefineryProgressComponent', val)
        }}
      />
    </Box>
    <Box>
      <RefineryProgressComponent
        startTime={Date.now()}
        totalTimeS={3000000}
        onChange={(val) => {
          console.log('RefineryProgressComponent', val)
        }}
      />
    </Box>
  </Box>
)
