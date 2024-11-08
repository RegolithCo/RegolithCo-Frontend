import { RefineryControl as RefineryControlComp } from './RefineryControl'
import { Box } from '@mui/material'

export default {
  title: 'Fields/RefineryControl',
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
}

export const RefineryControl = () => (
  <Box>
    <Box>
      <RefineryControlComp
        allowNone
        onChange={(change) => {
          console.log(change)
        }}
      />
    </Box>
  </Box>
)
