import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { WorkOrderModal as WorkOrderModalC } from './WorkOrderModal'
import {
  fakeOtherOrder,
  fakeSalvageOrder,
  fakeShipMiningOrder,
  fakeVehicleMiningOrder,
} from '@regolithco/common/dist/mock'
import log from 'loglevel'
import { ActivityEnum, WorkOrder } from '@regolithco/common'

export default {
  title: 'Modals/WorkOrderModal',
  component: WorkOrderModalC,
  argTypes: {
    activity: {
      control: {
        type: 'select',
        defaultValue: ActivityEnum.ShipMining,
        options: Object.values(ActivityEnum),
      },
    },
  },
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof WorkOrderModalC>

const Template: ComponentStory<typeof WorkOrderModalC> = ({ ...args }) => {
  let workOrder: WorkOrder
  const { activity } = args as any
  switch (activity) {
    case ActivityEnum.ShipMining:
      workOrder = fakeShipMiningOrder()
      break
    case ActivityEnum.VehicleMining:
      workOrder = fakeVehicleMiningOrder()
      break
    case ActivityEnum.Salvage:
      workOrder = fakeSalvageOrder()
      break
    case ActivityEnum.Other:
      workOrder = fakeOtherOrder()
      break
    default:
      return <div>Activity is required</div>
  }
  return <WorkOrderModalC {...args} workOrder={workOrder} />
}

export const Create = Template.bind({})
Create.args = {
  open: true,
  isNew: true,
  allowEdit: true,
  onUpdate: (order) => {
    log.debug('ShipMiningOrderUpdate', order)
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
  onUpdate: (order) => {
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
  onUpdate: (order) => {
    log.debug('ShipMiningOrderUpdate', order)
  },
  onClose: () => {
    console.log('Closed')
  },
}
