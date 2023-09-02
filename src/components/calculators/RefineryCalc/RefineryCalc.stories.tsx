import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { RefineryCalc as RefineryCalcComponent } from './RefineryCalc'

export default {
  title: 'Calculators/RefineryCalc',
  component: RefineryCalcComponent,
  argTypes: {},
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
        { name: 'blue', value: '#00f' },
      ],
    },
  },
} as Meta<typeof RefineryCalcComponent>

const Template: StoryFn<typeof RefineryCalcComponent> = (args) => <RefineryCalcComponent {...args} />

export const RefineryCalc = Template.bind({})
RefineryCalc.args = {}
