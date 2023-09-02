import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { PageLoader as PageLoaderComponent } from './PageLoader'

export default {
  title: 'Pages/PageLoader',
  component: PageLoaderComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof PageLoaderComponent>

const Template: StoryFn<typeof PageLoaderComponent> = (args) => <PageLoaderComponent {...args} />

export const PageLoader = Template.bind({})
PageLoader.args = {
  loading: true,
  title: 'Loading...',
  subtitle: 'Please wait...',
}
