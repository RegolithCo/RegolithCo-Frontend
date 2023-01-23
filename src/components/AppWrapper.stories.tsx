import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { AppWrapper as AppWrapperComponent, BGImagesEnum } from './AppWrapper'

export default {
  title: 'AppWrapper',
  component: AppWrapperComponent,
  argTypes: {
    backgroundSelect: {
      control: {
        type: 'select',
        options: Object.values(BGImagesEnum),
        default: BGImagesEnum.DEFAULT,
      },
    },
  },
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof AppWrapperComponent>

const Template: ComponentStory<typeof AppWrapperComponent> = (args) => {
  const { backgroundSelect } = args as any
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <AppWrapperComponent bgImage={backgroundSelect} {...args} />
    </div>
  )
}
export const AppWrapper = Template.bind({})
AppWrapper.args = {
  children: <div>Background</div>,
}
