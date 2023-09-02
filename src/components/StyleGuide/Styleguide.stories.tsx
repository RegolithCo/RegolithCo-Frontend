import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { StyleGuide as StyleGuideComponent } from './StyleGuide'

export default {
  title: 'StyleGuide',
  component: StyleGuideComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof StyleGuideComponent>

const Template: StoryFn<typeof StyleGuideComponent> = (args) => <StyleGuideComponent {...args} />

export const StyleGuide = Template.bind({})
