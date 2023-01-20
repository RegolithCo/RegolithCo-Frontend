import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ScoutingFindModal as ScoutingFindModalC } from './ScoutingFindModal'
import { fakeSalvageFind, fakeShipClusterFind, fakeVehicleClusterFind } from '@orgminer/common/dist/mock'
import log from 'loglevel'
import { ScoutingFind, ScoutingFindTypeEnum } from '@orgminer/common'

export default {
  title: 'Modals/ScoutingFindModal',
  component: ScoutingFindModalC,
  argTypes: {
    scoutingFindType: {
      control: {
        type: 'select',
        options: Object.values(ScoutingFindTypeEnum),
        default: ScoutingFindTypeEnum.Ship,
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ScoutingFindModalC>

const Template: ComponentStory<typeof ScoutingFindModalC> = ({ ...args }) => {
  let workOrder: ScoutingFind
  const { scoutingFindType } = args as any
  switch (scoutingFindType) {
    case ScoutingFindTypeEnum.Ship:
      workOrder = fakeShipClusterFind()
      break
    case ScoutingFindTypeEnum.Vehicle:
      workOrder = fakeVehicleClusterFind()
      break
    case ScoutingFindTypeEnum.Salvage:
      workOrder = fakeSalvageFind()
      break
    default:
      return <div>Activity is required</div>
  }
  return <ScoutingFindModalC {...args} scoutingFind={workOrder} />
}

export const Create = Template.bind({})
Create.args = {
  open: true,
  isNew: true,
  allowEdit: true,
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
  onChange: (order) => {
    log.debug('ShipMiningOrderUpdate', order)
  },
  onClose: () => {
    console.log('Closed')
  },
}
