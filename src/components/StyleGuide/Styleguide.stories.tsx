import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { StyleGuide } from './StyleGuide'

export default {
  title: 'StyleGuide',
  component: StyleGuide,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof StyleGuide>

const Template: ComponentStory<typeof StyleGuide> = (args) => <StyleGuide {...args} />

export const Primary = Template.bind({})
