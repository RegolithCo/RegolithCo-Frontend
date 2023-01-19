import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { StyleGuide as StyleGuideComponent } from './StyleGuide'

export default {
  title: 'StyleGuide',
  component: StyleGuideComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof StyleGuideComponent>

const Template: ComponentStory<typeof StyleGuideComponent> = (args) => <StyleGuideComponent {...args} />

export const StyleGuide = Template.bind({})
