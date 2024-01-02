import React from 'react'
import { Meta, StoryFn } from '@storybook/react'

import { ShareWrapper } from './ShareWrapper'
import { ImageDownloadComponent } from './ImageDownloadComponent'
import { WorkOrderShare } from './WorkOrderShare'

export default {
  title: 'Sharing/WorkOrderShare',
  component: WorkOrderShare,
  parameters: {},
  decorators: [
    (Story) => (
      <ImageDownloadComponent fileName={'TESTDOWNLOAD'} widthPx={800}>
        <ShareWrapper>
          <Story />
        </ShareWrapper>
      </ImageDownloadComponent>
    ),
  ],
} as Meta<typeof WorkOrderShare>

const Template: StoryFn<typeof WorkOrderShare> = (props) => {
  return <WorkOrderShare {...props} />
}

export const New = Template.bind({})
New.args = {}
