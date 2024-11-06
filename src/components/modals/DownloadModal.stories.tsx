import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { DownloadModal as DownloadModalC } from './DownloadModal'

export default {
  title: 'Modals/DownloadModal',
  component: DownloadModalC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof DownloadModalC>

const Template: StoryFn<typeof DownloadModalC> = (args) => <DownloadModalC {...args} />

export const DeleteProfileModal = Template.bind({})
DeleteProfileModal.args = {
  open: true,
  onClose: () => {
    console.log('Closed')
  },
  downloadCrewShareCSV() {
    console.log('Crew Share CSV')
  },
  downloadMembersCSV() {
    console.log('Members CSV')
  },
  downloadWorkOrderCSV() {
    console.log('Work Order CSV')
  },
  downloadJSON() {
    console.log('JSON')
  },
}
