import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { DownloadModal as DownloadModalC } from './DownloadModal'
import { fakeSession } from '@regolithco/common/dist/mock'
import { JSONObject } from '@regolithco/common'

export default {
  title: 'Modals/DownloadModal',
  component: DownloadModalC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof DownloadModalC>

const Template: ComponentStory<typeof DownloadModalC> = (args) => <DownloadModalC {...args} />

export const DeleteProfileModal = Template.bind({})
DeleteProfileModal.args = {
  open: true,
  onClose: () => {
    console.log('Closed')
  },
  title: 'Download Modal',
  description: 'This is a description',
  csvData: [
    ['a', 'b', 'c'],
    ['d', 'e', 'f'],
  ],
  jsonData: fakeSession() as JSONObject,
  fileName: 'test',
}
