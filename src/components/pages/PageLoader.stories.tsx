import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { PageLoader as PageLoaderComponent } from './PageLoader'

export default {
  title: 'Pages/PageLoader',
  component: PageLoaderComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof PageLoaderComponent>

const Template: ComponentStory<typeof PageLoaderComponent> = (args) => <PageLoaderComponent {...args} />

export const PageLoader = Template.bind({})
PageLoader.args = {
  loading: true,
  title: 'Loading...',
  subtitle: 'Please wait...',
}
