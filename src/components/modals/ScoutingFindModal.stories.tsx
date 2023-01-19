import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ScoutingFindModal as ScoutingFindModalC } from './ScoutingFindModal'
import { fakeShipClusterFind } from '@orgminer/common/dist/mock'
import log from 'loglevel'

export default {
  title: 'Modals/ScoutingFindModal',
  component: ScoutingFindModalC,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ScoutingFindModalC>

const Template: ComponentStory<typeof ScoutingFindModalC> = (args) => <ScoutingFindModalC {...args} />

export const Create = Template.bind({})
Create.args = {
  open: true,
  isNew: true,
  allowEdit: true,
  scoutingFind: fakeShipClusterFind({ clusterCount: 16 }),
  onChange: (scoutingFind) => {
    log.debug('ShipMiningOrderUpdate', scoutingFind)
  },
  onClose: () => {
    console.log('Closed')
  },
}

export const Edit = Template.bind({})
Edit.args = {
  open: true,
  isNew: false,
  allowEdit: true,
  scoutingFind: fakeShipClusterFind({ clusterCount: 10 }),

  onChange: (order) => {
    log.debug('ShipMiningOrderUpdate', order)
  },
  onClose: () => {
    console.log('Closed')
  },
}

export const View = Template.bind({})
View.args = {
  open: true,
  isNew: false,
  allowEdit: false,
  scoutingFind: fakeShipClusterFind(),

  onChange: (order) => {
    log.debug('ShipMiningOrderUpdate', order)
  },
  onClose: () => {
    console.log('Closed')
  },
}
